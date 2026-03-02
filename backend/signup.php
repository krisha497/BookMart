<?php

require "db.php";

$allowedOrigins = array_filter([
    rtrim($env['FRONTEND_URL'] ?? '', '/'),
    'http://localhost:5173'
]);

$requestOrigin = rtrim($_SERVER['HTTP_ORIGIN'] ?? '', '/');
if (in_array($requestOrigin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $requestOrigin");
    header("Vary: Origin");
}

header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json");

$isHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_set_cookie_params([
  'lifetime' => 0,
  'path' => '/',
  'secure' => $isHttps,
  'httponly' => true,
  'samesite' => $isHttps ? 'None' : 'Lax'
]);

session_start();

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$username = $data['username'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
$confirm = $data['confirm'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if(!$username || !$email || !$password || !$confirm) {
        echo json_encode(["status" => "error", "message" => "Please fill all fields"]);
        exit;
    }

    if ($password !== $confirm) {
        echo json_encode(["status" => "error", "message" => "Passwords do not match"]);
        exit;
    }

    date_default_timezone_set("Europe/London");
    $registered = date("Y-m-d H:i:s");

    $hashed = password_hash($password, PASSWORD_DEFAULT);

    if ($stmt = $con->prepare('SELECT id FROM user_data WHERE username = ? OR email = ?')) {
        $stmt->bind_param('ss', $username, $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Username or email already exists"]);
            $stmt->close();
            exit;
        }
        $stmt->close();
    }

    if ($stmt = $con->prepare('INSERT INTO user_data (username, email, password, registered) VALUES (?, ?, ?, ?)')) {
        $stmt->bind_param('ssss', $username, $email, $hashed, $registered);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Registration successful"]);
            exit;
        } else {
            echo json_encode(["status" => "error", "message" => "Signup failed, please try again"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $con->error]);
    }

    exit;
    $stmt->close();
    $con->close();

}

?>