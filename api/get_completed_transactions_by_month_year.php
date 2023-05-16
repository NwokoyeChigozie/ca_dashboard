<?php
include('./connection.php');
include('./util.php');


$month = test_input($_REQUEST['month']);
$year = test_input($_REQUEST['year']);
// echo $month . "<br>";
// echo $year . "<br>";

// Get the total amount for completed transactions in the specified month
$query = "SELECT ifnull(SUM(amount), 0) AS total_amount FROM transactions WHERE status = 'completed' AND YEAR(created_at) = ? AND MONTH(created_at) = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$year, $month]);
$totalAmountCurrentMonth = $stmt->fetchColumn();

// Get the total amount for completed transactions in the previous month
$query = "SELECT ifnull(SUM(amount), 0) AS total_amount FROM transactions WHERE status = 'completed' AND YEAR(created_at) = YEAR(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d')) - INTERVAL 1 MONTH AND MONTH(created_at) = MONTH(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d')) - INTERVAL 1 MONTH";
$stmt = $pdo->prepare($query);
$stmt->execute([$year, $month, $year, $month]);
$totalAmountPreviousMonth = $stmt->fetchColumn();

// Calculate the percentage increase
$percentageIncrease = 0;
if ($totalAmountPreviousMonth > 0) {
    $percentageIncrease = ($totalAmountCurrentMonth - $totalAmountPreviousMonth) / $totalAmountPreviousMonth * 100;
}

// Return the result as JSON
$result = [
    'total_amount_current_month' => $totalAmountCurrentMonth,
    'percentage_increase' => $percentageIncrease
];
header('Content-Type: application/json');
echo json_encode($result);
