const API_BASE = "https://api.frankfurter.dev/v2";

let historicalChart = null;


// =====================================
// CURRENT EXCHANGE RATES
// =====================================

async function getCurrencyRates() {

    const loading = document.getElementById("loading");
    const container = document.getElementById("currencyContainer");
    const error = document.getElementById("error");

    if (loading) {
        loading.style.display = "block";
    }

    if (error) {
        error.style.display = "none";
    }

    try {

        const response = await fetch(
            `${API_BASE}/rates?base=INR`
        );

        if (!response.ok) {
            throw new Error("Could not load rates.");
        }

        const data = await response.json();

        const currencies = [
            "USD",
            "EUR",
            "GBP",
            "AED",
            "JPY"
        ];

        if (container) {

            container.innerHTML = "";

            currencies.forEach(function(currency) {

                const item = data.find(
                    rate => rate.quote === currency
                );

                if (!item) {
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
                                ${Number(item.rate).toFixed(4)}
                            </h2>

                            <p class="text-muted mb-0">

                                1 INR =
                                ${Number(item.rate).toFixed(4)}
                                ${currency}

                            </p>

                        </div>

                    </div>

                `;

            });

        }

    } catch (errorObject) {

        console.error(
            "Current rate error:",
            errorObject
        );

        if (error) {

            error.style.display = "block";

            error.textContent =
                "Unable to load exchange rates.";

        }

    } finally {

        if (loading) {
            loading.style.display = "none";
        }

    }

}


// =====================================
// CURRENCY CONVERTER
// =====================================

async function convertCurrency() {

    const amountInput =
        document.getElementById("amount");

    const fromInput =
        document.getElementById("fromCurrency");

    const toInput =
        document.getElementById("toCurrency");

    const result =
        document.getElementById("conversionResult");

    const error =
        document.getElementById("converterError");


    const amount =
        Number(amountInput.value);

    const from =
        fromInput.value;

    const to =
        toInput.value;


    result.style.display = "none";
    error.style.display = "none";


    // Validation

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        error.textContent =
            "Please enter an amount greater than 0.";

        error.style.display = "block";

        return;

    }


    // Same currency

    if (from === to) {

        result.innerHTML = `

            <h4>
                ${amount.toLocaleString("en-IN")}
                ${from}
            </h4>

            <h2 class="text-success">
                =
                ${amount.toLocaleString("en-IN")}
                ${to}
            </h2>

        `;

        result.style.display = "block";

        return;

    }


    try {

        const response = await fetch(
            `${API_BASE}/rate/${from}/${to}`
        );


        if (!response.ok) {
            throw new Error("Conversion failed.");
        }


        const data =
            await response.json();


        const rate =
            Number(data.rate);


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

                1 ${from}
                =
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


// =====================================
// HISTORICAL GRAPH
// =====================================

async function loadHistoricalChart() {

    const select =
        document.getElementById(
            "historyCurrency"
        );

    const canvas =
        document.getElementById(
            "historicalCurrencyChart"
        );


    if (!select || !canvas) {
        return;
    }


    const currency =
        select.value;


    try {

        /*
         * We request approximately
         * five years of daily data.
         */

        const endDate =
            new Date();


        const startDate =
            new Date();


        startDate.setFullYear(
            startDate.getFullYear() - 5
        );


        const start =
            startDate
                .toISOString()
                .split("T")[0];


        const end =
            endDate
                .toISOString()
                .split("T")[0];


        /*
         * IMPORTANT:
         *
         * Frankfurter's v2 endpoint uses
         * "quotes", not "symbols".
         */

        const url =
            `${API_BASE}/rates` +
            `?base=INR` +
            `&quotes=${currency}` +
            `&from=${start}` +
            `&to=${end}`;


        console.log(
            "Historical API:",
            url
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Historical data:",
            data
        );


        /*
         * API returns an array like:
         *
         * [
         *   {
         *      base: "INR",
         *      date: "...",
         *      quote: "USD",
         *      rate: 0.012
         *   }
         * ]
         */


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            throw new Error(
                "No historical data received."
            );

        }


        const labels = [];
        const values = [];


        data.forEach(function(item) {

            if (
                item.date &&
                item.rate !== undefined
            ) {

                labels.push(
                    formatDate(item.date)
                );

                values.push(
                    Number(item.rate)
                );

            }

        });


        if (values.length === 0) {

            throw new Error(
                "Historical data contained no rates."
            );

        }


        /*
         * Destroy old chart
         */

        if (historicalChart) {

            historicalChart.destroy();

        }


        /*
         * Create chart
         */

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

                            },


                            tooltip: {

                                callbacks: {

                                    label:
                                        function(context) {

                                            return (

                                                "1 INR = " +

                                                Number(
                                                    context.raw
                                                ).toFixed(4) +

                                                " " +

                                                currency

                                            );

                                        }

                                }

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


        /*
         * Put a visible error message
         * instead of leaving a blank graph.
         */

        const chartBox =
            canvas.parentElement;


        chartBox.innerHTML = `

            <div
                class="alert alert-warning text-center"
            >

                <strong>
                    Historical graph could not be loaded.
                </strong>

                <br>

                Please refresh the page and try again.

                <br><br>

                <small>
                    Check the browser console if the
                    problem continues.
                </small>

            </div>

        `;

    }

}


// =====================================
// DATE FORMAT
// =====================================

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


// =====================================
// PAGE LOAD
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            document.getElementById(
                "currencyContainer"
            )
        ) {

            getCurrencyRates();

        }


        /*
         * Wait until Chart.js is available.
         */

      data.forEach(function(item, index) {

    if (
        item.date &&
        item.rate !== undefined
    ) {

        // Keep approximately one observation
        // per month instead of thousands of points.

        const date = new Date(item.date);

        if (date.getDate() <= 7) {

            labels.push(
                formatDate(item.date)
            );

            values.push(
                Number(item.rate)
            );

        }

    }

});
