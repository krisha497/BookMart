<?php

$env = parse_ini_file(__DIR__ . '/.env');

$allowedOrigin = rtrim($env['FRONTEND_URL'] ?? 'https://book-mart-krisha497s-projects.vercel.app', '/');
header("Access-Control-Allow-Origin: $allowedOrigin");
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