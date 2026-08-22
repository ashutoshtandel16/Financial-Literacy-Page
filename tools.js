/* =====================================
   SAVINGS CALCULATOR
   ===================================== */

function calculateSavings() {

    const income =
        Number(
            document.getElementById(
                "income"
            ).value
        );


    const expenses =
        Number(
            document.getElementById(
                "expenses"
            ).value
        );


    const result =
        document.getElementById(
            "savingsResult"
        );


    if (
        !Number.isFinite(income) ||
        income <= 0
    ) {

        result.className =
            "alert alert-danger mt-3";

        result.textContent =
            "Please enter a valid monthly income.";

        return;

    }


    if (
        !Number.isFinite(expenses) ||
        expenses < 0
    ) {

        result.className =
            "alert alert-danger mt-3";

        result.textContent =
            "Please enter valid expenses.";

        return;

    }


    if (expenses > income) {

        result.className =
            "alert alert-warning mt-3";

        result.innerHTML = `

            Your expenses are higher than
            your income.

            <br>

            Try reducing unnecessary expenses.

        `;

        return;

    }


    const savings =
        income - expenses;


    const percentage =
        (savings / income) * 100;


    result.className =
        "alert alert-success mt-3";


    result.innerHTML = `

        <strong>
            Monthly Savings:
        </strong>

        ₹${savings.toLocaleString("en-IN")}

        <br>

        <strong>
            Savings Rate:
        </strong>

        ${percentage.toFixed(1)}%

    `;

}


/* =====================================
   EMI CALCULATOR
   ===================================== */

function calculateEMI() {

    const principal =
        Number(
            document.getElementById(
                "loanAmount"
            ).value
        );


    const annualRate =
        Number(
            document.getElementById(
                "interestRate"
            ).value
        );


    const years =
        Number(
            document.getElementById(
                "loanYears"
            ).value
        );


    const result =
        document.getElementById(
            "emiResult"
        );


    if (
        !Number.isFinite(principal) ||
        principal <= 0
    ) {

        result.className =
            "alert alert-danger mt-3";

        result.textContent =
            "Please enter a valid loan amount.";

        return;

    }


    if (
        !Number.isFinite(annualRate) ||
        annualRate < 0
    ) {

        result.className =
            "alert alert-danger mt-3";

        result.textContent =
            "Please enter a valid interest rate.";

        return;

    }


    if (
        !Number.isFinite(years) ||
        years <= 0
    ) {

        result.className =
            "alert alert-danger mt-3";

        result.textContent =
            "Please enter a valid loan tenure.";

        return;

    }


    const monthlyRate =
        annualRate / 12 / 100;


    const months =
        years * 12;


    let emi;


    if (monthlyRate === 0) {

        emi =
            principal / months;

    } else {

        emi =
            principal *
            monthlyRate *
            Math.pow(
                1 + monthlyRate,
                months
            ) /
            (
                Math.pow(
                    1 + monthlyRate,
                    months
                ) - 1
            );

    }


    const totalPayment =
        emi * months;


    const totalInterest =
        totalPayment - principal;


    result.className =
        "alert alert-success mt-3";


    result.innerHTML = `

        <strong>
            Monthly EMI:
        </strong>

        ₹${emi.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        )}

        <br>

        <strong>
            Total Interest:
        </strong>

        ₹${totalInterest.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        )}

        <br>

        <strong>
            Total Payment:
        </strong>

        ₹${totalPayment.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        )}

    `;

}
