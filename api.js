const API_BASE = "https://api.frankfurter.dev/v1";


async function getCurrencyRates() {

    const loading =
        document.getElementById("loading");

    const container =
        document.getElementById("currencyContainer");

    const error =
        document.getElementById("error");


    if (loading) {
        loading.style.display = "block";
    }

    if (error) {
        error.style.display = "none";
    }


    try {

        const response = await fetch(
            `${API_BASE}/latest?base=INR`
        );


        if (!response.ok) {
            throw new Error(
                "Could not fetch current rates."
            );
        }


        const data =
            await response.json();


        const currencies = [
            "USD",
            "EUR",
            "GBP",
            "AED",
            "JPY"
        ];


        if (container) {

            container.innerHTML = "";


            currencies.forEach(
                function(currency) {

                    const rate =
                        data.rates[currency];


                    if (
                        rate === undefined
                    ) {
                        return;
                    }


                    container.innerHTML += `

                        <div class="col-md-4 col-lg">

                            <div class="card text-center p-4 h-100">

                                <div class="fs-2">
                                    💱
                                </div>

                                <h5>
                                    INR → ${currency}
                                </h5>

                                <h2 class="text-success">
                                    ${Number(rate).toFixed(4)}
                                </h2>

                                <p class="text-muted mb-0">
                                    1 INR =
                                    ${Number(rate).toFixed(4)}
                                    ${currency}
                                </p>

                            </div>

                        </div>

                    `;

                }
            );

        }


    } catch (errorObject) {

        console.error(
            "Current rates error:",
            errorObject
        );


        if (error) {

            error.style.display = "block";

            error.textContent =
                "Unable to load current exchange rates.";

        }

    } finally {

        if (loading) {
            loading.style.display = "none";
        }

    }

}



async function convertCurrency() {

    const amount =
        Number(
            document.getElementById(
                "amount"
            ).value
        );


    const from =
        document.getElementById(
            "fromCurrency"
        ).value;


    const to =
        document.getElementById(
            "toCurrency"
        ).value;


    const result =
        document.getElementById(
            "conversionResult"
        );


    const error =
        document.getElementById(
            "converterError"
        );


    result.style.display = "none";

    error.style.display = "none";


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        error.textContent =
            "Please enter an amount greater than 0.";

        error.style.display = "block";

        return;

    }


    if (from === to) {

        result.innerHTML = `

            <h4>
                ${amount.toLocaleString(
                    "en-IN",
                    {
                        maximumFractionDigits: 2
                    }
                )}
                ${from}
            </h4>

            <h2 class="text-success">
                =
                ${amount.toLocaleString(
                    "en-IN",
                    {
                        maximumFractionDigits: 2
                    }
                )}
                ${to}
            </h2>

        `;


        result.style.display = "block";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_BASE}/latest?base=${from}&symbols=${to}`
            );


        if (!response.ok) {

            throw new Error(
                "Conversion failed."
            );

        }


        const data =
            await response.json();


        const rate =
            Number(data.rates[to]);


        const converted =
            amount * rate;


        result.innerHTML = `

            <h4>
                ${amount.toLocaleString(
                    "en-IN",
                    {
                        maximumFractionDigits: 2
                    }
                )}
                ${from}
            </h4>

            <h2 class="text-success">
                =
                ${converted.toLocaleString(
                    "en-IN",
                    {
                        maximumFractionDigits: 2
                    }
                )}
                ${to}
            </h2>

            <p class="mb-0">
                1 ${from} =
                ${rate.toFixed(4)}
                ${to}
            </p>

        `;


        result.style.display = "block";


    } catch (errorObject) {

        console.error(
            "Converter error:",
            errorObject
        );


        error.textContent =
            "Unable to convert currency. Please try again.";

        error.style.display = "block";

    }

}



document.addEventListener(
    "DOMContentLoaded",
    function() {

        getCurrencyRates();

    }
);
