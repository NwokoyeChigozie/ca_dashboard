<?php
include('./connection.php');
include('./util.php');

$month = test_input($_REQUEST['month']);
$year = test_input($_REQUEST['year']);

// Retrieve the transactions for the specified month
$query = "SELECT * FROM transactions WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$year, $month]);
$transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return the transactions as JSON
header('Content-Type: application/json');
echo json_encode($transactions);
