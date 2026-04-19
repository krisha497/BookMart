<?php
ini_set('display_errors', 0);
error_reporting(0);

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

$user_id = $_SESSION['user_id'];

$stmt = $con->prepare("SELECT id FROM orders WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$order_ids = $result->fetch_all(MYSQLI_ASSOC);

$orders = [];

foreach ($order_ids as $order_id) {
    $stmt = $con->prepare("SELECT google_volume_id, quantity FROM order_items WHERE order_id = ?");
    $stmt->bind_param('i', $order_id['id']);
    $stmt->execute();
    $results = $stmt->get_result();
    $order_items = $results->fetch_all(MYSQLI_ASSOC);

    $orders[] = [
        "order_id" => $order_id['id'],
        "order_items" => $order_items
    ];
}

echo json_encode([
    "status" => "success",
    "orders" => $orders
]);
exit;

?>