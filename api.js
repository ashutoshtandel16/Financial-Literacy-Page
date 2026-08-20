// Store the latest exchange rates
let exchangeRates = {};


// API URL
const API_URL =
    "https://open.er-api.com/v6/latest/INR";


// Fetch exchange rates
async function getCurrencyRates() {

    const loading =
        document.getElementById("loading");

    const container =
        document.getElementById("currencyContainer");

    const error =
        document.getElementById("error");


    loading.style.display = "block";

    error.style.display = "none";

    container.innerHTML = "";


    try {

        // Fetch data from REST API
        const response = await fetch(API_URL);


        // Check response
        if (!response.ok) {

            throw new Error(
                "Unable to fetch currency data."
            );

        }


        // Convert response to JSON
        const data = await response.json();


        // Store rates
        exchangeRates = data.rates;


        // Currencies to display
        const currencies = [
            "USD",
            "EUR",
            "GBP",
            "AED"
        ];


        // Create currency cards
        currencies.forEach(currency => {

            const rate =
                exchangeRates[currency];


            container.innerHTML += `

                <div class="col-md-3">

                    <div class="card text-center p-4 h-100">

                        <h2>💱</h2>

                        <h4>
                            INR → ${currency}
                        </h4>

                        <h2 class="text-primary">
                            ${rate.toFixed(4)}
                        </h2>

                        <p class="text-muted mb-0">
                            1 INR =
                            ${rate.toFixed(4)}
                            ${currency}
                        </p>

                    </div>

                </div>

            `;

        });


    } catch (err) {

        error.style.display = "block";

        error.textContent =
            "Unable to load currency data. Please try again.";

        console.error(err);

    }


    loading.style.display = "none";
}



// Currency Converter

async function convertCurrency() {

    const amount =
        Number(
            document.getElementById("amount").value
        );


    const fromCurrency =
        document.getElementById("fromCurrency").value;


    const toCurrency =
        document.getElementById("toCurrency").value;


    const result =
        document.getElementById("conversionResult");


    const error =
        document.getElementById("converterError");


    // Hide previous messages

    error.style.display = "none";

    result.style.display = "none";


    // Validation

    if (!amount || amount <= 0) {

        error.textContent =
            "Please enter an amount greater than 0.";

        error.style.display = "block";

        return;
    }


    try {

        // If rates haven't loaded yet,
        // fetch them first

        if (Object.keys(exchangeRates).length === 0) {

            const response =
                await fetch(API_URL);


            if (!response.ok) {

                throw new Error(
                    "Unable to fetch exchange rates."
                );

            }


            const data =
                await response.json();


            exchangeRates =
                data.rates;

        }


        /*
            API gives rates based on INR.

            Example:

            1 INR = 0.011 USD

            To convert between any two currencies:

            Amount × (Target rate / Source rate)
        */


        const fromRate =
            fromCurrency === "INR"
                ? 1
                : exchangeRates[fromCurrency];


        const toRate =
            toCurrency === "INR"
                ? 1
                : exchangeRates[toCurrency];


        const convertedAmount =
            amount * (toRate / fromRate);


        // Display formatted result

        result.innerHTML = `

            <h4>
                ${amount.toLocaleString(
                    "en-IN",
                    {
                        maximumFractionDigits: 2
                    }
                )}
                ${fromCurrency}
            </h4>

            <h2 class="text-primary my-2">
                =
                ${convertedAmount.toLocaleString(
                    "en-IN",
                    {
                        maximumFractionDigits: 2
                    }
                )}
                ${toCurrency}
            </h2>

            <p class="mb-0">
                Based on the latest available exchange rate.
            </p>

        `;


        result.style.display = "block";


    } catch (err) {

        error.textContent =
            "Unable to convert currency. Please try again.";

        error.style.display = "block";

        console.error(err);

    }

}


// Load exchange rates when page opens

getCurrencyRates();