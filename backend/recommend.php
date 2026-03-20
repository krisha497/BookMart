<?php

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
header("Access-Control-Allow-Methods: OPTIONS, POST, GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

include "db.php";

if (mysqli_connect_errno()) {
    echo json_encode([
        "status" => "error", 
        "message" => "Database connection failed"
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

if (empty($_SESSION['user_loggedin'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Not Logged In"
    ]);
    exit;
}

$input = json_decode(trim(file_get_contents('php://input')), true);
$query = $input['query'] ?? '';

if (empty(trim($query))) {
    echo json_encode(['error' => 'Query cannot be empty']);
    exit;
}

$prompt = "You are a book recommender. The user asked: \"$query\". Suggest 3 relevant books. Return a JSON array only, each item with: title, author, description, reason.";

$body = [
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ]
];

$lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0) continue;
    putenv($line);
}
$apiKey = getenv('GEMINI_API_KEY');

if (empty($apiKey)) {
    http_response_code(500);
    exit(json_encode(['error' => 'API key not configured']));
}

$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$apiKey";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(['error' => curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

$data = json_decode($response, true);
$text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '[]';
$text = preg_replace('/```json|```/', '', $text);

echo json_encode(['recommendations' => json_decode(trim($text), true)]);
?>