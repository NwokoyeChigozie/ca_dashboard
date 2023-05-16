async function fetchDataFromEndpoint(data, endpoint) {
  const formData = new FormData();
  for (let key in data) {
    formData.append(key, data[key]);
  }
  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const responseData = await response.json();
  return responseData;
}

async function updateTransactionStatus(hash, status) {
  const endpoint = "./api/update_transaction_status.php";
  const data = { hash: hash, status: status };
  return await fetchDataFromEndpoint(data, endpoint);
}

async function getPendingTransactions() {
  const endpoint = "./api/get_pending_transactions.php";
  const data = {};
  return await fetchDataFromEndpoint(data, endpoint);
}

async function getPaginatedTransactions(page, limit) {
  const endpoint = "./api/get_paginated_transactions.php";
  const data = {
    page: page,
    limit: limit,
  };
  return await fetchDataFromEndpoint(data, endpoint);
}

async function getTotalIncomeToday() {
  const endpoint = "./api/get_total_income_today.php";
  const data = {};
  return await fetchDataFromEndpoint(data, endpoint);
}
async function getTransactionsToday() {
  const endpoint = "./api/get_transactions_today.php";
  const data = {};
  return await fetchDataFromEndpoint(data, endpoint);
}

async function getTransactionsByMonthYear(month, year) {
  const endpoint = `./api/get_transactions_by_month_year.php`;

  const data = {
    month: month,
    year: year,
  };
  return await fetchDataFromEndpoint(data, endpoint);
}
async function getCompletedTransactionsByMonthYear(month, year) {
  const endpoint = "./api/get_completed_transactions_by_month_year.php";
  const data = {
    month: month,
    year: year,
  };

  return await fetchDataFromEndpoint(data, endpoint);
}
async function getPendingTransactionsByMonthYear(month, year) {
  const endpoint = "./api/get_pending_transactions_by_month_year.php";
  const data = {
    month: month,
    year: year,
  };

  return await fetchDataFromEndpoint(data, endpoint);
}

async function getFailedTransactionsByMonthYear(month, year) {
  const endpoint = "./api/get_failed_transactions_by_month_year.php";
  const data = {
    month: month,
    year: year,
  };
  return await fetchDataFromEndpoint(data, endpoint);
}

async function getAlltimeRevenue() {
  const endpoint = "./api/get_alltime_revenue.php";
  const data = {};
  return await fetchDataFromEndpoint(data, endpoint);
}

async function getUsdRate(currency) {
  const endpoint = "./api/get_rates.php";
  const data = { currency: currency };
  return await fetchDataFromEndpoint(data, endpoint);
}
