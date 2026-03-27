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

if (empty($_SESSION['user_loggedin'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Not Logged In"
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "status" => "error",
        "message" => "Method not allowed"
    ]);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$rating = $data['rating'];
$title = $data['title'];
$body = $data['body'];
$google_volume_id = $data['google_volume_id'];

$user_id = $_SESSION['user_id'];

if (!$rating || !$title || !$body || !$google_volume_id) {
    echo json_encode([
        "status" => "error",
        "message" => "Please enter all fields"
    ]);
    exit;
}

if (!is_numeric($rating) || $rating<1 || $rating>5) {
    echo json_encode([
        "status" => "error",
        "message" => "The rating should be a numerical value between 1 and 5"
    ]);
    exit;
}

if (strlen($title) > 250) {
    echo json_encode([
        "status" => "error",
        "message" => "Title cannot be more than 250 characters."
    ]);
    exit;
}

$stmt = $con->prepare('SELECT * FROM reviews WHERE user_id = ? AND google_volume_id = ?');
$stmt->bind_param('is', $user_id, $google_volume_id);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows !== 0) {
    echo json_encode([
        "status" => "error",
        "message" => "You have already left a review for this book."
    ]);
    exit;
}

$stmt = $con->prepare("INSERT INTO reviews (user_id, rating, title, body, google_volume_id) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param('iisss', $user_id, $rating, $title, $body, $google_volume_id);
$stmt->execute();

echo json_encode([
    "status" => "success",
    "message" => "Review added successfully"
]);
exit;

?>