<?php
include('./connection.php');
include('./util.php');

// Get the total amount for completed transactions today
$query = "SELECT ifnull(SUM(amount), 0) AS total_amount FROM transactions WHERE status = 'completed'";
$stmt = $pdo->query($query);
$totalAmount = $stmt->fetchColumn();

// Return the result as JSON
$result = [
    'total_amount' => $totalAmount
];
header('Content-Type: application/json');
echo json_encode($result);
