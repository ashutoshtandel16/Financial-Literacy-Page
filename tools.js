// Savings Calculator

function calculateSavings() {

    const income = Number(document.getElementById("income").value);
    const expenses = Number(document.getElementById("expenses").value);

    const result = document.getElementById("savingsResult");

    if (income <= 0 || expenses < 0) {

        result.innerHTML = "Please enter valid values.";
        return;

    }

    const savings = income - expenses;

    const savingsRate = (savings / income) * 100;

    result.innerHTML = `
        Monthly Savings: ₹${savings.toFixed(2)}
        <br>
        Savings Rate: ${savingsRate.toFixed(2)}%
    `;
}


// EMI Calculator

function calculateEMI() {

    const principal =
        Number(document.getElementById("loanAmount").value);

    const annualRate =
        Number(document.getElementById("interestRate").value);

    const years =
        Number(document.getElementById("loanYears").value);


    const result =
        document.getElementById("emiResult");


    if (principal <= 0 || annualRate <= 0 || years <= 0) {

        result.innerHTML =
            "Please enter valid values.";

        return;
    }


    const monthlyRate =
        annualRate / 12 / 100;

    const months =
        years * 12;


    const emi =
        principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, months) /
        (Math.pow(1 + monthlyRate, months) - 1);


    const totalPayment =
        emi * months;

    const totalInterest =
        totalPayment - principal;


    result.innerHTML = `
        Monthly EMI: ₹${emi.toFixed(2)}
        <br>
        Total Interest: ₹${totalInterest.toFixed(2)}
        <br>
        Total Payment: ₹${totalPayment.toFixed(2)}
    `;
}