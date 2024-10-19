'use strict';

// Initializing variables

// User Login variables
const loginText = document.querySelector('.login');
const loginSection = document.querySelector('.section__login');
const loginForm = document.querySelector('#login__form');
const loginUser = document.querySelector('#username');
const loginPsw = document.querySelector('#password');
const loginBtn = document.querySelector('#login__btn');

// User Dashboard
const Userdashboard = document.querySelector('.dashboard');
const UserGreet = document.querySelector('.greetings');
const balanceAmount = document.querySelector('.balance-amount');
const balanceDate = document.querySelector('.balance-date');
const transactionList = document.querySelector('.transaction-list');

// Transfer Form
const transferToInput = document.querySelector('#transfer-to');
const transferAmountInput = document.querySelector('#transfer-amount');
const transferButton = document.querySelector('#transfer-btn');

// Loan Request
const loanRequest = document.querySelector('#loan');
const loanTransfer = document.querySelector('#loan-btn');

// Loan Request
const userInput = document.querySelector('#user-input');
const userPin = document.querySelector('#user-pin');
const closeAcc = document.querySelector('#closeAcc-btn');

// Success Message
const modal = document.querySelector('#success-modal');
const modalMessage = document.querySelector('#modal-message');

// User Class
class UserLogin {
  #psw; // private feild
  constructor(user, psw, balance) {
    this.user = user;
    this.#psw = psw;
    this.balance = balance;
    this.transactions = [];
  }

  checkPassword(password) {
    return parseInt(password) === this.#psw;
  }

  getPassword() {
    return this.#psw;
  }

  setPassword(newPassword) {
    this.#psw = newPassword;
  }

  getCurrentDate() {
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return currentDate.toLocaleDateString(undefined, options);
  }

  transfer(recipient, amount) {
    if (this.balance >= amount) {
      this.balance -= amount;
      recipient.balance += amount;
      this.addTransactions('debit', amount);
      recipient.addTransactions('credit', amount);
      return true;
    } else {
      return false;
    }
  }

  addTransactions(type, amount) {
    const transaction = {
      type,
      amount: amount.toFixed(2),
      date: this.getCurrentDate(),
    };
    this.transactions.push(transaction);
  }

  requestLoan() {
    const loanAmount = Number(loanRequest.value);

    if (loanAmount > 0 && this.balance >= 500) {
      this.balance += loanAmount;
      this.addTransactions('credit', loanAmount);
      return true;
    } else {
      return false;
    }
  }

  closeAccount() {
    const userAccName = userInput.value.trim();
    const userAccPin = userPin.value.trim();

    if (this.user === userAccName && this.checkPassword(userAccPin)) {
      const userIndex = users.findIndex(user => user.user === this.user);

      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        displayMessage(`Your account has been closed successfully`);
        currentUser = null;
        loginSection.classList.remove('hidden');
        Userdashboard.classList.add('hidden');
        loginText.innerHTML = 'LOGIN';
        // Empty Fields
        loginUser.value = loginPsw.value = '';
      } else {
        displayMessage(`Incorrect Username and Password`);
      }
    }
  }
}

// Storing the Objects in an array
const user1 = new UserLogin('Princess', 1111, 500);
const user2 = new UserLogin('David', 2222, 100);
const user3 = new UserLogin('Sophia', 3333, 50);
const user4 = new UserLogin('Nonso', 1212, 140);
const users = [user1, user2, user3, user4];

// FUNCTIONS

// Function To Save to Local Storage
const saveToLocalStr = function () {
  // Convert user objects into plain objects suitable for storage
  const usersData = users.map(user => ({
    user: user.user,
    psw: user.getPassword(), // Accessing the password through the method for storage
    balance: user.balance,
    transactions: user.transactions,
  }));

  localStorage.setItem('users', JSON.stringify(usersData));
};

// Function to Retrive from Local Storage
const loadFromLocalStr = function () {
  const savedUsers = localStorage.getItem('users');

  if (savedUsers) {
    const parsedUsers = JSON.parse(savedUsers);

    // Clear the current array to avoid duplicates
    users.length = 0;

    parsedUsers.forEach(userData => {
      const user = new UserLogin(userData.user, userData.psw, userData.balance);
      user.transactions = userData.transactions;
      users.push(user);
    });
  }
};

// Function To Display Balance
const displayBalance = function () {
  balanceAmount.textContent = `${currentUser.balance.toFixed(2)}€`;
  balanceDate.textContent = `As of ${currentUser.getCurrentDate()}`;
};

// Function to display successful message
const displayMessage = function (message) {
  modalMessage.innerHTML = message;

  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 3000);
};

// Function To Display Transactions
const displayTransactions = function () {
  transactionList.innerHTML = '';
  currentUser.transactions.forEach(transaction => {
    const li = document.createElement('li');
    li.classList.add(
      'transaction-item',
      transaction.type === 'credit' ? 'credit' : 'debit'
    );
    li.textContent = `${transaction.type === 'credit' ? 'Credit' : 'Debit'} ${
      transaction.amount
    }€ on ${transaction.date}`;
    transactionList.appendChild(li);
  });
};

// Function to handle classes

const displayClassList = function () {
  loginSection.classList.add('hidden');
  Userdashboard.classList.remove('hidden');
  UserGreet.textContent = `${currentUser.user}`;
  loginText.innerHTML = `LOGOUT`;
};

// Function to toggle class list
const toggleClassList = function () {
  loginSection.classList.remove('hidden');
  Userdashboard.classList.add('hidden');
  loginText.innerHTML = `LOGIN`;
};

// EVENT HANDLERS

// Login Event
let currentUser;

loginBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const enteredUser = loginUser.value;
  const enteredPsw = loginPsw.value;

  currentUser = users.find(
    user => user.user === enteredUser && user.checkPassword(enteredPsw)
  );

  if (currentUser) {
    displayClassList();
    displayBalance();
    displayTransactions();

    localStorage.setItem('loggedInUser', currentUser.user);
  } else {
    displayMessage(
      `Login Failed: User does not exist or credentials are incorrect.`
    );
  }
});

// Load users data when the page loads
window.addEventListener('DOMContentLoaded', function () {
  loadFromLocalStr(); // Load users from local storage

  const savedUser = localStorage.getItem('loggedInUser');
  if (savedUser) {
    currentUser = users.find(user => user.user === savedUser);
    if (currentUser) {
      displayClassList();
      displayBalance();
      displayTransactions();
    }
  }
});

// Change Login To Logout

loginText.addEventListener('click', function (e) {
  e.preventDefault();
  toggleClassList();
  // Remove the logged-in user from localStorage
  localStorage.removeItem('loggedInUser');
  // Empty Fields
  loginUser.value = loginPsw.value = '';
});

// Transfer Event

transferButton.addEventListener('click', function (e) {
  e.preventDefault();

  const recipientName = transferToInput.value.trim();
  const amount = parseFloat(transferAmountInput.value);

  if (recipientName && amount > 0) {
    const recipient = users.find(user => user.user === recipientName);

    if (!recipient) {
      displayMessage(`User Not found`);
      return;
    }
    const transferSuccess = currentUser.transfer(recipient, amount);

    if (transferSuccess) {
      displayBalance();
      displayTransactions();
      saveToLocalStr();

      displayMessage(`Action Successful!`);
    } else {
      displayMessage(`Insufficient Balance`);
    }
  } else {
    displayMessage(`Please enter a valid recipient and amount `);
  }

  // Empty Fields

  transferToInput.value = transferAmountInput.value = '';
});

// Request Loan Event

loanTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  if (currentUser.requestLoan()) {
    displayBalance();
    displayTransactions();
    saveToLocalStr();

    displayMessage(`Loan granted!`);
  } else {
    displayMessage(`You must have at least 500€ balance to request a loan`);
  }
  // Empty Fields
  loanRequest.value = '';
});

// Close Account Event
closeAcc.addEventListener('click', function (e) {
  e.preventDefault();
  if (currentUser) {
    currentUser.closeAccount();
    saveToLocalStr();
  } else {
    displayMessage(`No user is currently logged in`);
  }

  // Empty Fields
  userInput.value = userPin.value = '';
});
