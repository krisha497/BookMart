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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
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

$user_input = $data['username'] ?? null;
$pass_input = $data['password'] ?? null;

if (!$user_input || !$pass_input) {
    echo json_encode([
        "status" => "error",
        "message" => "Please fill both username and password"
    ]);
    exit;
}

if ($stmt = $con->prepare('SELECT id, password from user_data where username = ?')) {
    $stmt->bind_param('s', $user_input);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $hashed_password);
        $stmt->fetch();

        if (password_verify($pass_input, $hashed_password)) {
            session_regenerate_id();

            $_SESSION['account_loggedin'] = TRUE;
            $_SESSION['account_name'] = $user_input;
            $_SESSION['account_id'] = $id;

            echo json_encode([
                "status" => "success",
                "message" => "Login successful",
                "user" => [
                    "id" => $id,
                    "username" => $user_input
                ]
            ]);
            exit;
        }
        else {
            echo json_encode(["status" => "error", "message" => "Incorrect password"]);
        }

    }
    else {
        echo json_encode(["status" => "error", "message" => "Username not found"]);
    }
    $stmt->close();
}
else {
    echo json_encode(["status" => "error", "message" => "Database query error"]);
}

?>
