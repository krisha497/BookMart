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
        "message" => "User Not Logged In"
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$google_volume_id = $data['google_volume_id'] ?? null;
$cart_id = $_SESSION['active_cart'];

if (!$google_volume_id) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid Inputs"
    ]);
    exit;
}

$stmt = $con->prepare("DELETE FROM cart_items WHERE cart_id = ? AND google_volume_id = ?");
$stmt->bind_param('ss', $cart_id, $google_volume_id);
$stmt->execute();

echo json_encode([
    "status" => "success",
    "message"=> "Item Removed From Cart Successfully"
]);

?>