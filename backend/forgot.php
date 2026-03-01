<?php

require "db.php";
$allowedOrigin = rtrim($env['FRONTEND_URL'] ?? 'http://localhost:5173', '/');

header("Access-Control-Allow-Origin: $allowedOrigin");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$email = $data['email'] ?? null;

if (!$email) {
    echo json_encode([
        "status" => "error",
        "message" => "Enter a valid email address. "
    ]);
    exit;
}

$stmt = $con->prepare("SELECT id FROM user_data WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 1) {
    $token = bin2hex(random_bytes(32));
    $expires = date("Y-m-d H:i:s", time() + 3600);

    $stmt = $con->prepare("UPDATE user_data SET reset_token = ?, reset_expires = ? WHERE email = ?");
    $stmt->bind_param("sss", $token, $expires, $email);
    $stmt->execute();

    $resetLink = "$allowedOrigin/reset?token=$token";

    echo json_encode([
        "status" => "success",
        "message" => "Reset link generated successfully.",
        "resetLink" => $resetLink
    ]);
    exit;

} else {
    echo json_encode([
        "status" => "error",
        "message" => "Email ID does not exist"
    ]);
    exit;
}

?>