const API_BASE = "https://api.frankfurter.dev/v2";

let historicalChart = null;


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
            "https://api.frankfurter.app/latest?from=INR"
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
                `https://api.frankfurter.app/latest?from=${from}&to=${to}`
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



async function loadHistoricalChart() {

    const select =
        document.getElementById(
            "historyCurrency"
        );


    const canvas =
        document.getElementById(
            "historicalCurrencyChart"
        );


    if (
        !select ||
        !canvas
    ) {

        return;

    }


    const currency =
        select.value;


    try {

        const today =
            new Date();


        const startDate =
            new Date();


        startDate.setFullYear(
            today.getFullYear() - 5
        );


        const start =
            startDate
                .toISOString()
                .split("T")[0];


        const end =
            today
                .toISOString()
                .split("T")[0];


        const response =
            await fetch(

                `https://api.frankfurter.app/${start}..${end}?from=INR&to=${currency}`

            );


        if (!response.ok) {

            throw new Error(
                "Historical data unavailable."
            );

        }


        const data =
            await response.json();


        const labels = [];

        const values = [];


        Object.keys(data.rates)
            .forEach(
                function(date) {

                    labels.push(
                        formatDate(date)
                    );


                    values.push(
                        Number(
                            data.rates[date][currency]
                        )
                    );

                }
            );


        if (
            labels.length === 0 ||
            values.length === 0
        ) {

            throw new Error(
                "No historical data found."
            );

        }


        if (historicalChart) {

            historicalChart.destroy();

        }


        historicalChart =
            new Chart(

                canvas.getContext("2d"),

                {

                    type: "line",


                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    `1 INR → ${currency}`,

                                data: values,

                                borderWidth: 2,

                                pointRadius: 0,

                                pointHoverRadius: 4,

                                tension: 0.25,

                                fill: false

                            }

                        ]

                    },


                    options: {

                        responsive: true,

                        maintainAspectRatio: false,


                        interaction: {

                            mode: "index",

                            intersect: false

                        },


                        plugins: {

                            legend: {

                                display: true

                            }

                        },


                        scales: {

                            x: {

                                ticks: {

                                    maxTicksLimit: 12,

                                    autoSkip: true

                                }

                            },


                            y: {

                                beginAtZero: false,

                                title: {

                                    display: true,

                                    text:
                                        `Value of 1 INR in ${currency}`

                                }

                            }

                        }

                    }

                }

            );


    } catch (errorObject) {

        console.error(
            "Historical graph error:",
            errorObject
        );

    }

}



function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            month: "short",
            year: "numeric"
        }
    );

}



document.addEventListener(
    "DOMContentLoaded",
    function() {

        getCurrencyRates();


        if (
            typeof Chart !== "undefined"
        ) {

            loadHistoricalChart();

        }

    }
);
