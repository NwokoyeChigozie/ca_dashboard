<?php
include('./connection.php');
include('./util.php');

// Prepare and execute the query
$query = "SELECT * FROM transactions WHERE status = 'pending'";
$stmt = $pdo->query($query);
$transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return the transactions as JSON
header('Content-Type: application/json');
echo json_encode($transactions);
