<?php

header("Access-Control-Allow-Origin: https://book-mart-krisha497s-projects.vercel.app");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require "db.php";

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
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $token = bin2hex(random_bytes(32));
    $expires = date("Y-m-d H:i:s", time() + 3600);

    $stmt = $con->prepare("UPDATE user_data SET reset_token = ?, reset_expires = ? WHERE email = ?");
    $stmt->bind_param("sss", $token, $expires, $email);
    $stmt->execute();

    $resetLink = "https://book-mart-krisha497s-projects.vercel.app/reset?token=$token";

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