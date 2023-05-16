<?php
include('./connection.php');
include('./util.php');

$month = test_input($_REQUEST['month']);
$year = test_input($_REQUEST['year']);

// Get the total amount for failed transactions in the specified month
$query = "SELECT ifnull(SUM(amount), 0) AS total_amount FROM transactions WHERE status = 'failed' AND YEAR(created_at) = ? AND MONTH(created_at) = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$year, $month]);
$totalAmountFailed = $stmt->fetchColumn();

// Return the result as JSON
$result = [
    'total_amount_failed' => $totalAmountFailed
];
header('Content-Type: application/json');
echo json_encode($result);
