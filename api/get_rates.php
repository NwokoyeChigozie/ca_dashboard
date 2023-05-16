<?php
include('./connection.php');
include('./util.php');
$currency = test_input($_REQUEST['currency']);

$url = 'https://bitpay.com/api/rates';
$json = json_decode(file_get_contents($url));
$btc_to_usd_rate = 0;
$btc_to_next_rate = 0;

foreach ($json as $obj) {
    if ($obj->code == 'USD') {
        $btc_to_usd_rate = $obj->rate;
    } elseif ($obj->code == $currency) {
        $btc_to_next_rate = $obj->rate;
        break;
    }
}

// Return the result as JSON
$result = [
    'rate' => $btc_to_usd_rate / $btc_to_next_rate
];
header('Content-Type: application/json');
echo json_encode($result);
