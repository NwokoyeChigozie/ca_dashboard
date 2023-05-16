async function convertEthToUsd(amountInEth) {
  const ethRate = await getUsdRate("ETH");
  const amountInUsd = amountInEth * ethRate.rate;
  return parseFloat(amountInUsd).toFixed(2);
}

async function getEthWalletBalance(address) {
  if (typeof window.ethereum === "undefined") {
    return "Web3 is not available. Please install MetaMask or use a compatible browser.";
  }
  const web3 = new Web3(window.ethereum);
  const balance = await web3.eth.getBalance(address);
  const etherAmount = web3.utils.fromWei(balance, "ether");
  return etherAmount;
}

async function checkTransactionStatus(transactionHash, createdAt) {
  if (typeof window.ethereum === "undefined") {
    return "Web3 is not available. Please install MetaMask or use a compatible browser.";
  }
  const web3 = new Web3(window.ethereum);
  try {
    const receipt = await web3.eth.getTransactionReceipt(transactionHash);

    if (receipt && receipt.status) {
      // Transaction is successful, update the status
      updateTransactionStatus(transactionHash, "completed");
    } else {
      const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000;
      const transactionDate = new Date(createdAt);
      const currentDate = new Date();
      const timeDifference = currentDate - transactionDate;

      if (timeDifference >= twoDaysInMillis) {
        // Transaction has lasted more than 2 days, update the status to failed
        updateTransactionStatus(transactionHash, "failed");
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function addToTransactionsTable(data, tableId) {
  const table = document.getElementById(tableId);
  const tbody = table.getElementsByTagName("tbody")[0];
  const lastRow = tbody.lastElementChild;

  const row = document.createElement("tr");

  const walletCell = document.createElement("td");
  const walletDiv = document.createElement("div");
  walletDiv.className = "d-flex align-items-center";
  const walletName = document.createElement("div");
  walletName.className = "table-user-name ml-3";
  const walletNameText = document.createElement("p");
  walletNameText.className = "mb-0 font-weight-medium";
  walletNameText.textContent = data.wallet;
  const walletStatus = document.createElement("small");
  walletStatus.textContent = "wallet connected";
  walletName.appendChild(walletNameText);
  walletName.appendChild(walletStatus);
  walletDiv.appendChild(walletName);
  walletCell.appendChild(walletDiv);
  row.appendChild(walletCell);

  const platformCell = document.createElement("td");
  platformCell.textContent = data.platform;
  row.appendChild(platformCell);

  const statusCell = document.createElement("td");
  const statusBadge = document.createElement("div");
  statusBadge.className =
    data.status === "completed"
      ? "badge badge-inverse-success"
      : data.status === "incomplete"
      ? "badge badge-inverse-danger"
      : "badge badge-inverse-warning";
  statusBadge.textContent = data.status;
  statusCell.appendChild(statusBadge);
  row.appendChild(statusCell);

  const amountCell = document.createElement("td");
  amountCell.textContent = data.currency.toUpperCase() + " " + data.amount;
  row.appendChild(amountCell);

  const websiteCell = document.createElement("td");
  const websiteLink = document.createElement("a");
  websiteLink.href = data.website;
  websiteLink.textContent = data.website;
  websiteCell.appendChild(websiteLink);
  row.appendChild(websiteCell);

  if (lastRow) {
    tbody.insertBefore(row, lastRow.nextSibling);
  } else {
    tbody.appendChild(row);
  }
}
function convertToPDF(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const tableData = [];

  // Convert the data to table format
  data.forEach((transaction, index) => {
    const rowData = [
      index + 1,
      transaction.wallet,
      transaction.platform,
      transaction.status,
      transaction.currency.toUpperCase() + "" + transaction.amount,
      transaction.hash,
      transaction.website,
      transaction.created_at,
    ];
    tableData.push(rowData);
  });

  // Set table headers
  const headers = [
    "ID",
    "Wallet",
    "Platform",
    "Status",
    "Amount",
    "Hash",
    "Website",
    "Created At",
  ];

  // Set column styles for dynamic width and reduced font size
  const columnStyles = {
    0: { cellWidth: 8, fontSize: 8 }, // ID
    1: { cellWidth: 35, fontSize: 8 }, // Wallet
    2: { cellWidth: 20, fontSize: 8 }, // Platform
    3: { cellWidth: 19, fontSize: 8 }, // Status
    4: { cellWidth: 19, fontSize: 8 }, // Amount
    5: { cellWidth: 35, fontSize: 8 }, // Hash
    6: { cellWidth: 20, fontSize: 8 }, // Website
    7: { cellWidth: 29, fontSize: 8 }, // Created At
  };

  // Add table to the PDF document
  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: 20,
    styles: { halign: "center" },
    columnStyles: columnStyles,
    tableWidth: "auto",
    horizontalPageBreak: false,
  });

  // Save the PDF file
  doc.save("transactions.pdf");
}
