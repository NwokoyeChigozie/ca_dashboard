<?php
include('./connection.php');
include('./util.php');

// Retrieve data from the request
$hash = test_input($_REQUEST['hash']);
$status = test_input($_REQUEST['status']);

// Prepare and execute the query
$query = "UPDATE transactions SET status = ? WHERE hash = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$status, $hash]);

// Return a response indicating success or failure
if ($stmt) {
    echo "Transaction status updated successfully.";
} else {
    echo "Failed to update transaction status.";
}
