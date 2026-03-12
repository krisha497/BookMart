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

$cart_id = $_SESSION['active_cart'];

$stmt = $con->prepare("SELECT google_volume_id, quantity FROM cart_items WHERE cart_id = ?");
$stmt->bind_param('s', $cart_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([]);
    exit;
}

$items = $result->fetch_all(MYSQLI_ASSOC);
$cart_items = [];

foreach ($items as $item) {
    $volumeId = $item['google_volume_id'];
    $quantity = $item['quantity'];

    $apiUrl = "https://www.googleapis.com/books/v1/volumes/" . urlencode($volumeId);
    $book_data = json_decode(file_get_contents($apiUrl), true);

    $imageLinks = $book_data['volumeInfo']['imageLinks'] ?? [];
    $image = $imageLinks['thumbnail'] ?? null;
    $title = $book_data['volumeInfo']['title'] ?? "";
    $rating = $book_data['volumeInfo']['averageRating'] ?? 3.9;
    $price = round($rating * 5.5 + 8, 2);

    $cart_items[] = [
        "google_volume_id" => $volumeId,
        "quantity" => $quantity,
        "name" => $title,
        "image" => $image,
        "price" => $price
    ];
}

echo json_encode($cart_items);

?>