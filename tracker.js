let expenses = JSON.parse(
    localStorage.getItem("expenses")
) || [];

let chart;


// Add Expense

function addExpense() {

    const name =
        document.getElementById("expenseName").value;

    const category =
        document.getElementById("expenseCategory").value;

    const amount =
        Number(document.getElementById("expenseAmount").value);


    if (name === "" || amount <= 0) {

        alert("Please enter valid expense details.");

        return;
    }


    const expense = {

        name: name,
        category: category,
        amount: amount

    };


    expenses.push(expense);


    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    document.getElementById("expenseName").value = "";

    document.getElementById("expenseAmount").value = "";


    displayExpenses();

}


// Display Expenses

function displayExpenses() {

    const list =
        document.getElementById("expenseList");

    const totalElement =
        document.getElementById("totalExpense");


    list.innerHTML = "";

    let total = 0;


    expenses.forEach((expense, index) => {

        total += expense.amount;


        list.innerHTML += `

            <div class="expense-item">

                <strong>${expense.name}</strong>

                <span>
                    ${expense.category}
                </span>

                <span>
                    ₹${expense.amount}
                </span>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteExpense(${index})">

                    Delete

                </button>

            </div>

        `;

    });


    totalElement.textContent =
        total.toFixed(2);


    createChart();

}


// Delete Expense

function deleteExpense(index) {

    expenses.splice(index, 1);


    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    displayExpenses();

}


// Create Chart

function createChart() {

    const categories = {};

    expenses.forEach(expense => {

        if (!categories[expense.category]) {

            categories[expense.category] = 0;

        }

        categories[expense.category] +=
            expense.amount;

    });


    const ctx =
        document.getElementById("expenseChart");


    if (chart) {

        chart.destroy();

    }


    chart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: Object.keys(categories),

            datasets: [{

                data: Object.values(categories)

            }]

        }

    });

}


// Load saved expenses

displayExpenses();