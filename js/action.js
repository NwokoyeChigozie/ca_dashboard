const address = ETH_WALLET_ADDRESS;
const walletBalanceSpanId = "wallet_balance";
const totalEarningsId = "total_earnings";
const completedMonthyearId = "completed_month_year";
const completedMonthyearRateId = "completed_month_year_rate";
const pendingMonthyearId = "pending_month_year";
const pendingMonthyearRateId = "pending_month_year_rate";
const todayIncomeId = "today_income";
const todayIncomeRateId = "today_income_rate";
const todayTransactionsId = "today_transactions";
const failedTransactionsId = "failed_transactions";
const salesRevenueId = "sales_revenue";
const moreHistoryId = "more_history";
const txHistoryTableId = "tx_history_table";
const infuraUrl = `https://${ETHNETWORK}.infura.io/v3/${INFURA_API_KEY}`;
var web3Provider = new Web3.providers.HttpProvider(infuraUrl);
var web3 = new Web3(web3Provider);

let page = 1;
const limit = 5;

async function updateWalletBalance() {
  const balance = await getEthWalletBalance(address, web3);
  const amountInUsd = await convertEthToUsd(parseFloat(balance));
  const walletBalanceSpan = document.getElementById(walletBalanceSpanId);
  walletBalanceSpan.innerText = amountInUsd;
}

async function updateCompletedThisMonth(month, year) {
  const data = await getCompletedTransactionsByMonthYear(month, year);
  const amt = await convertEthToUsd(
    parseFloat(data.total_amount_current_month)
  );
  document.getElementById(completedMonthyearId).innerText = amt;
  document.getElementById(totalEarningsId).innerText = amt;
  document.getElementById(completedMonthyearRateId).innerText =
    data.percentage_increase;
}

async function updatePendingThisMonth(month, year) {
  const data = await getPendingTransactionsByMonthYear(month, year);
  document.getElementById(pendingMonthyearId).innerText = await convertEthToUsd(
    parseFloat(data.total_amount_current_month)
  );
  document.getElementById(pendingMonthyearRateId).innerText =
    data.percentage_increase;
}

async function updateTodayIncome() {
  const data = await getTotalIncomeToday();
  document.getElementById(todayIncomeId).innerText = await convertEthToUsd(
    parseFloat(data.total_amount_today)
  );
  document.getElementById(todayIncomeRateId).innerText =
    data.percentage_increase;
}
async function updateTodayTransactions() {
  const data = await getTransactionsToday();
  document.getElementById(todayTransactionsId).innerText =
    await convertEthToUsd(parseFloat(data.total_amount_today));
}
async function updateFailedTransactions(month, year) {
  const data = await getFailedTransactionsByMonthYear(month, year);
  document.getElementById(failedTransactionsId).innerText =
    await convertEthToUsd(parseFloat(data.total_amount_failed));
}
async function updateSalesRevenue() {
  const data = await getAlltimeRevenue();
  document.getElementById(salesRevenueId).innerText = await convertEthToUsd(
    parseFloat(data.total_amount)
  );
}

async function updateTransactionsList() {
  const moreHistoryButton = document.getElementById(moreHistoryId);
  const data = await getPaginatedTransactions(page, limit);
  if (data.hasNextPage) {
    page += 1;
  } else {
    moreHistoryButton.disabled = true;
  }

  for (const obj of data.transactions) {
    addToTransactionsTable(obj, txHistoryTableId);
  }
}

async function resolvePendingTransactions() {
  const data = await getPendingTransactions();
  console.log("data", data);
  for (const obj of data) {
    checkTransactionStatus(obj.hash, obj.created_at, web3);
  }
}

async function createTrxHistoryDoc() {
  const selectedMonth = parseInt(document.getElementById("monthSelect").value);
  const selectedYear = parseInt(document.getElementById("yearSelect").value);
  const data = await getTransactionsByMonthYear(selectedMonth, selectedYear);
  convertToPDF(data);
}

function handleDateChange() {
  const selectedMonth = parseInt(document.getElementById("monthSelect").value);
  const selectedYear = parseInt(document.getElementById("yearSelect").value);

  monthRestrictedCalls(selectedMonth, selectedYear);
}

// calls
async function calls() {
  updateWalletBalance();
  updateTodayIncome();
  updateTodayTransactions();
  updateSalesRevenue();
  updateTransactionsList();
  resolvePendingTransactions();
}

async function monthRestrictedCalls(month, year) {
  updateCompletedThisMonth(month, year);
  updatePendingThisMonth(month, year);
  updateFailedTransactions(month, year);
}

var currentDate = new Date();
var currentMonth = currentDate.getMonth() + 1; // Months are zero-based
var currentYear = currentDate.getFullYear();
document.getElementById("monthSelect").value = currentMonth;
document.getElementById("yearSelect").value = currentYear;
calls();
monthRestrictedCalls(currentMonth, currentYear);

// Call updateTransactionsList onclick
const moreHistoryButton = document.getElementById(moreHistoryId);
moreHistoryButton.addEventListener("click", async () => {
  updateTransactionsList();
});
