<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_name('BOOKMARTSESSION');

session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

include "db.php";

if (!$_SESSION['user_loggedin']) {
    echo json_encode([
        "status" => "error",
        "message" => "Not Logged In"
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method"
    ]);
    exit;
}

$json = file_get_contents("php://input");
$data = json_decode($json, true);

$name = $data['delivery_name'];
$address = $data['delivery_address'];
$city = $data['delivery_city'];
$post_code = $data['delivery_post_code'];
$country = $data['delivery_country'];

if (!$name || !$address || !$city || !$post_code || !$country) {
    echo json_encode([
        "status" => "error",
        "message" => "Please fill in all form fields"
    ]);
    exit;
}

$user_id = $_SESSION['user_id'];
$user_name = $_SESSION['user_name'];
$cart_id = $_SESSION['active_cart'];

// Fetch cart items
$stmt = $con->prepare("SELECT * FROM cart_items WHERE cart_id = ?");
$stmt->bind_param("i", $cart_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Current cart is empty"
    ]);
    exit;
}

$items = $result->fetch_all(MYSQLI_ASSOC);

$total = 0;
foreach ($items as $row) {
    $total += $row['unit_price'] * $row['quantity'];
}

// Wrap everything in a transaction to prevent partial/inconsistent data
$con->begin_transaction();

try {
    $stmt = $con->prepare("INSERT INTO orders (user_id, total, delivery_name, delivery_address, delivery_city, delivery_post_code, delivery_country) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param('idsssss', $user_id, $total, $name, $address, $city, $post_code, $country);
    $stmt->execute();
    $order_id = $con->insert_id;

    foreach ($items as $row) {
        $google_volume_id = $row['google_volume_id'];
        $quantity = $row['quantity'];
        $unit_price = $row['unit_price'];
        $price = $unit_price * $quantity;

        $stmt = $con->prepare("INSERT INTO order_items (order_id, google_volume_id, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt->bind_param('isid', $order_id, $google_volume_id, $quantity, $price);
        $stmt->execute();
    }

    $stmt = $con->prepare("UPDATE carts SET status = 'completed' WHERE id = ?");
    $stmt->bind_param('i', $cart_id);
    $stmt->execute();

    $stmt = $con->prepare("INSERT INTO carts (user_id, status) VALUES (?, 'active')");
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $new_cart_id = $con->insert_id;

    $con->commit();

    $_SESSION['active_cart'] = $new_cart_id;

    echo json_encode([
        "status" => "success",
        "message" => "Order Placed Successfully",
        "order_id" => $order_id
    ]);

} catch (Exception $e) {
    $con->rollback();
    echo json_encode([
        "status" => "error",
        "message" => "Order failed, please try again"
    ]);
}

exit;

?>