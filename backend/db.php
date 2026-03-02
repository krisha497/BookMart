<?php

$env = parse_ini_file(__DIR__ . '/.env');
if ($env === false) {
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode(["status" => "error", "message" => "Server configuration error"]);
    exit;
}

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

$host = $env['DB_HOST'] ?? 'localhost';
$user = $env['DB_USER'] ?? 'root';
$pass = $env['DB_PASS'] ?? '';
$dbname = $env['DB_NAME'] ?? 'bookmart';

$con = new mysqli($host, $user, $pass, $dbname);
if ($con->connect_error) {
    die("Connection failed: " . $con->connect_error);
}

?>