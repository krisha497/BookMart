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

$json = file_get_contents("php://input");
$data = json_decode($json, true);

$order_id = $data['order_id'];

$stmt = $con->prepare("SELECT user_id FROM orders WHERE id = ?");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();
$order = $result->fetch_assoc();

if (!$order || $order['user_id'] !== $_SESSION['user_id']) {
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized access"
    ]);
    exit;
}

$stmt = $con->prepare("SELECT * FROM order_items WHERE order_id = ?");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();

$items = $result->fetch_all(MYSQLI_ASSOC);

$order_items = [];

foreach ($items as $row) {
    $google_volume_id = $row['google_volume_id'];
    $quantity = $row['quantity'];

    $apiUrl = "https://www.googleapis.com/books/v1/volumes/" . urlencode($google_volume_id);
    $book_data = json_decode(file_get_contents($apiUrl), true);

    $imageLinks = $book_data['volumeInfo']['imageLinks'] ?? [];
    $image = $imageLinks['thumbnail'] ?? null;
    $title = $book_data['volumeInfo']['title'] ?? "";
    $rating = $book_data['volumeInfo']['averageRating'] ?? 3.9;
    $price = round($rating * 5.5 + 8, 2);

    $order_items[] = [
        "google_volume_id" => $google_volume_id,
        "quantity" => $quantity,
        "name" => $title,
        "image" => $image,
        "price" => $price
    ];

}

$stmt = $con->prepare("SELECT * FROM orders WHERE id = ?");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$order_details = $stmt->get_result()->fetch_assoc();

echo json_encode([
    "status" => "success",
    "order_items" => $order_items,
    "order_details" => $order_details,
    "username" => $_SESSION['user_name']
]);
exit;

?>