<?php
include('./connection.php');
include('./util.php');

$page = test_input($_REQUEST['page'] ?? 1); // Default to page 1 if not provided
// echo $page;
$perPage = test_input($_REQUEST['limit'] ?? 10); // Number of transactions per page
// echo $perPage;

// Calculate the offset for pagination
$offset = ($page - 1) * $perPage;

// Retrieve the transactions with pagination
$query = "SELECT * FROM transactions ORDER BY created_at DESC LIMIT $offset, $perPage";
$stmt = $pdo->query($query);
$transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Check if there are more transactions
$queryCount = "SELECT COUNT(*) AS total FROM transactions";
$stmtCount = $pdo->query($queryCount);
$totalTransactions = $stmtCount->fetchColumn();
$hasNextPage = ($offset + $perPage) < $totalTransactions;

// Prepare the response data
$responseData = [
    'transactions' => $transactions,
    'hasNextPage' => $hasNextPage
];

// Return the response as JSON
header('Content-Type: application/json');
echo json_encode($responseData);
