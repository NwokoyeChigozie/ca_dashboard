<?php
include('./connection.php');
include('./util.php');

// Get the total amount for transactions carried out today
$query = "SELECT ifnull(SUM(amount), 0) AS total_amount FROM transactions WHERE DATE(created_at) = CURDATE()";
$stmt = $pdo->query($query);
$totalAmountToday = $stmt->fetchColumn();

// Get the total amount for transactions carried out last month
$query = "SELECT ifnull(SUM(amount), 0) AS total_amount FROM transactions WHERE YEAR(created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)";
$stmt = $pdo->query($query);
$totalAmountLastMonth = $stmt->fetchColumn();

// Calculate the percentage increase
$percentageIncrease = 0;
if ($totalAmountLastMonth > 0) {
    $percentageIncrease = ($totalAmountToday - $totalAmountLastMonth) / $totalAmountLastMonth * 100;
}

// Return the result as JSON
$result = [
    'total_amount_today' => $totalAmountToday,
    'percentage_increase' => $percentageIncrease
];
header('Content-Type: application/json');
echo json_encode($result);
