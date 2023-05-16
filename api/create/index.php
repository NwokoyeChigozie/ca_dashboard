<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Establish database connection
include('../connection.php');
include('../util.php');

// header('Access-Control-Allow-Origin: *');
// header("Content-Type: application/json; charset=UTF-8");
// header("Access-Control-Allow-Methods: POST");
// header("Access-Control-Max-Age: 3600");
// header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the request body
    $jsonData = file_get_contents("php://input");
    $data = json_decode($jsonData);

    // Validate JSON decoding
    if ($data === null) {
        http_response_code(400); // Return 400 Bad Request status code
        echo json_encode(array("message" => "Invalid JSON data."));
        exit();
    }

    // Sanitize and retrieve data
    $amount = test_input($data->amount);
    $currency = test_input($data->currency);
    $hash = test_input($data->hash);
    $wallet = test_input($data->wallet);
    $platform = test_input($data->platform);
    $website = test_input($data->website);
    $status = 'pending';

    // Prepare and execute the query
    $query = "INSERT INTO transactions (amount, currency, hash, wallet, platform, website, status)
              VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$amount, $currency, $hash, $wallet, $platform, $website, $status]);

    // Return a response indicating success or failure
    if ($stmt) {
        http_response_code(201); // Return 201 Created status code
        echo json_encode(array("message" => "Transaction created successfully."));
    } else {
        http_response_code(500); // Return 500 Internal Server Error status code
        echo json_encode(array("message" => "Failed to create transaction."));
    }
} else {
    http_response_code(405); // Return 405 Method Not Allowed status code
    echo json_encode(array("message" => "Method not allowed."));
}
