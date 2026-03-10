<?php

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

if (!$_SESSION['user_id']) {
    echo json_encode([
        "status" => "error",
        "message" => "Not Logged In"
    ]);
}

$json = file_get_contents("php://input");
$data = json_decode($json, true);

$google_volume_id = $data['google_volume_id'] ?? null;
$quantity = $data['quantity'] ?? null;

$cart_id = $_SESSION['cart_id'];

if ($stmt = $con-> prepare("SELECT quantity FROM cart_items WHERE cart_id = ? AND google_volume_id = ?")) {
    $stmt->bind_param('ss', $cart_id, $google_volume_id);
    $stmt->execute();
    $stmt->store_result();
    if($stmt->num_rows > 0) {
        $stmt->bind_result($old_quantity);
        $quantity += $old_quantity;
        $stmt = $con->prepare("UPDATE cart_items SET quantity = ?");
        $stmt->bind_param('i', $quantity);
        $stmt->execute();

        echo json_encode([
            "status" => "success",
            "message" => "Quantity of book increased successfully."
        ]);

    } else {
        $stmt = $con->prepare("INSERT INTO cart_items (cart_id, google_volume_id, quantity) VALUES (?, ?, ?)");
        $stmt->bind_param('ssi', $cart_id, $google_volume_id, $quantity);
        $stmt->execute();

        echo json_encode([
            "status" => "success",
            "message" => "Book added to cart successfully"
        ]);
    }
}

?>