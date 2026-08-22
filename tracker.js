/* =====================================
   EXPENSE TRACKER
   ===================================== */


let expenses =
    JSON.parse(
        localStorage.getItem(
            "digitalFinanceExpenses"
        )
    ) || [];


let expenseChart = null;


/* =====================================
   ADD EXPENSE
   ===================================== */

function addExpense() {

    const name =
        document.getElementById(
            "expenseName"
        ).value.trim();


    const category =
        document.getElementById(
            "expenseCategory"
        ).value;


    const amount =
        Number(
            document.getElementById(
                "expenseAmount"
            ).value
        );


    if (!name) {

        alert(
            "Please enter an expense name."
        );

        return;

    }


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        return;

    }


    const expense = {

        id: Date.now(),

        name: name,

        category: category,

        amount: amount

    };


    expenses.push(expense);


    saveExpenses();

    displayExpenses();

    updateChart();


    document.getElementById(
        "expenseName"
    ).value = "";


    document.getElementById(
        "expenseAmount"
    ).value = "";

}


/* =====================================
   SAVE
   ===================================== */

function saveExpenses() {

    localStorage.setItem(

        "digitalFinanceExpenses",

        JSON.stringify(expenses)

    );

}


/* =====================================
   DISPLAY
   ===================================== */

function displayExpenses() {

    const list =
        document.getElementById(
            "expenseList"
        );


    const totalElement =
        document.getElementById(
            "totalExpense"
        );


    if (!list || !totalElement) {

        return;

    }


    list.innerHTML = "";


    let total = 0;


    expenses.forEach(
        function (expense) {

            total += expense.amount;


            list.innerHTML += `

                <div
                    class="d-flex
                           justify-content-between
                           align-items-center
                           border-bottom
                           py-3"
                >

                    <div>

                        <strong>
                            ${escapeHTML(
                                expense.name
                            )}
                        </strong>

                        <br>

                        <small class="text-muted">

                            ${expense.category}

                        </small>

                    </div>


                    <div>

                        <strong>
                            ₹${expense.amount.toLocaleString(
                                "en-IN"
                            )}
                        </strong>


                        <button

                            class="btn
                                   btn-sm
                                   btn-outline-danger
                                   ms-2"

                            onclick="deleteExpense(
                                ${expense.id}
                            )"

                        >

                            Delete

                        </button>

                    </div>

                </div>

            `;

        }
    );


    totalElement.textContent =
        total.toLocaleString(
            "en-IN"
        );

}


/* =====================================
   DELETE
   ===================================== */

function deleteExpense(id) {

    expenses =
        expenses.filter(
            function (expense) {

                return expense.id !== id;

            }
        );


    saveExpenses();

    displayExpenses();

    updateChart();

}


/* =====================================
   CHART
   ===================================== */

function updateChart() {

    const canvas =
        document.getElementById(
            "expenseChart"
        );


    if (!canvas) {

        return;

    }


    const categories = {};


    expenses.forEach(
        function (expense) {

            if (
                !categories[
                    expense.category
                ]
            ) {

                categories[
                    expense.category
                ] = 0;

            }


            categories[
                expense.category
            ] += expense.amount;

        }
    );


    const labels =
        Object.keys(categories);


    const values =
        Object.values(categories);


    if (expenseChart) {

        expenseChart.destroy();

    }


    expenseChart =
        new Chart(

            canvas,

            {

                type: "doughnut",


                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Expenses",

                            data:
                                values

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false

                }

            }

        );

}


/* =====================================
   BASIC HTML ESCAPING
   ===================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent = text;


    return div.innerHTML;

}


/* =====================================
   INITIAL LOAD
   ===================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayExpenses();

        updateChart();

    }
);
