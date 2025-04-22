// Simulate a database with an object
let database = {
    user: {
        balance: 100,
        transactions: [],
    }
};

// Global variable for the countdown timer
let countdownTimer;
let rollTimer;

// Function to update the displayed balance
function updateBalance() {
    document.getElementById('balance').innerText = database.user.balance;
}

// Function to update the transaction history
function updateTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = ''; // Clear existing list
    database.user.transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.innerText = ${transaction.date}: ${transaction.type} $${transaction.amount};
        transactionsList.appendChild(li);
    });
}

// Function to handle the color game
function playGame(selectedColor) {
    const betAmount = parseInt(document.getElementById('bet-amount').value);
    const balance = database.user.balance;

    if (betAmount <= 0 || betAmount > balance) {
        alert('Invalid bet amount');
        return;
    }

    // Start the dice roll simulation
    startRollSimulation(selectedColor);
}

// Function to start the countdown and then simulate the rolling colors
function startRollSimulation(selectedColor) {
    let timeLeft = 10; // 10-second timer for picking a color
    document.getElementById('timer').innerText = Time Left: ${timeLeft};
    
    // Countdown timer
    countdownTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = Time Left: ${timeLeft};
        if (timeLeft <= 0) {
            clearInterval(countdownTimer); // Stop countdown when time is up
            document.getElementById('timer').innerText = 'Rolling...';
            rollDiceForColor(selectedColor);
        }
    }, 1000);
}

// Function to simulate the dice roll for 5 seconds
function rollDiceForColor(selectedColor) {
    const colors = ['Red', 'Green', 'Blue'];
    let randomColor;
    
    // Roll for 5 seconds
    let rollDuration = 5000; // 5 seconds
    let startTime = Date.now();
    
    // Change the color every 200ms
    rollTimer = setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        if (elapsedTime >= rollDuration) {
            clearInterval(rollTimer);
            // After rolling ends, show the result
            displayResult(selectedColor, randomColor);
        } else {
            // Pick a random color from Red, Green, Blue
            randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.style.backgroundColor = randomColor.toLowerCase();
        }
    }, 200);
}

// Function to display the result after the dice roll
function displayResult(selectedColor, rolledColor) {
    let resultMessage = '';
    
    if (selectedColor === rolledColor) {
        database.user.balance += parseInt(document.getElementById('bet-amount').value); // Win the bet amount
        resultMessage = You win! The color was ${rolledColor}. You win $${document.getElementById('bet-amount').value};
    } else {
        database.user.balance -= parseInt(document.getElementById('bet-amount').value); // Lose the bet amount
        resultMessage = You lose. The color was ${rolledColor}. You lose $${document.getElementById('bet-amount').value};
    }

    // Record transaction
    const transaction = {
        date: new Date().toLocaleString(),
        type: selectedColor === rolledColor ? 'Win' : 'Loss',
        amount: document.getElementById('bet-amount').value,
    };
    database.user.transactions.push(transaction);

    // Update the balance and transaction list
    updateBalance();
    updateTransactions();

    // Show the result message
    document.getElementById('result').innerText = resultMessage;
}

// Function to handle logout
function logout() {
    database.user.balance = 100; // Reset balance
    database.user.transactions = []; // Clear transaction history
    updateBalance();
    updateTransactions();
    document.getElementById('result').innerText = '';
    alert('You have logged out.');
}

// Event listeners for color buttons
document.getElementById('red-btn').addEventListener('click', function() {
    playGame('Red');
});

document.getElementById('green-btn').addEventListener('click', function() {
    playGame('Green');
});

document.getElementById('blue-btn').addEventListener('click', function() {
    playGame('Blue');
});

// Event listener for logout button
document.getElementById('logout-btn').addEventListener('click', logout);

// Initial updates
updateBalance();
updateTransactions();