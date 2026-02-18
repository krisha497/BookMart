<?php

require_once "jwt_helper.php";

$headers = getallheaders();

if (!isset($headers['Authentication'])) {
    http_response_code(401);
    exit("Access denied.");
}

$token = str_replace("Bearer ", "", $headers['Authentication']);

$decoded = verifyJWT($token);

if (!$decoded) {
    http_response_code(401);
    exit("Invalid token");
}

?>