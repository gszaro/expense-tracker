const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");
const form = document.getElementById("transaction-form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add new transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value;

  if (!text || isNaN(amount)) return;

  const transaction = {
    id: Date.now(),
    text,
    amount
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();
  form.reset();
});

// Render all transactions
function renderTransactions() {
  transactionList.innerHTML = "";

  transactions.forEach((item) => {
    const sign = item.amount < 0 ? "-" : "+";
    const itemClass = item.amount < 0 ? "minus" : "plus";

    const li = document.createElement("li");
    li.classList.add(itemClass);
    li.innerHTML = `
      ${item.text} <span>${sign}$${Math.abs(item.amount).toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${item.id})">x</button>
    `;
    transactionList.appendChild(li);
  });

  updateSummary();
}

// Update income, expense, and balance
function updateSummary() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts.filter(v => v > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expense = amounts.filter(v => v < 0).reduce((acc, val) => acc + val, 0).toFixed(2);

  balanceEl.textContent = `$${total}`;
  incomeEl.textContent = `+$${income}`;
  expenseEl.textContent = `-$${Math.abs(expense)}`;
}

// Delete a transaction
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  renderTransactions();
}

// Save to localStorage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initial render
renderTransactions();
