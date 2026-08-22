/* =====================================
   DIGITAL FINANCE
   CURRENCY API
   ===================================== */


/*
    Frankfurter provides current and
    historical exchange-rate data.

    We use:
    https://api.frankfurter.dev/v2
*/


const API_BASE =
    "https://api.frankfurter.dev/v2";


let historicalChart = null;


/* =====================================
   CURRENT EXCHANGE RATES
   ===================================== */

async function getCurrencyRates() {

    const loading =
        document.getElementById(
            "loading"
        );


    const container =
        document.getElementById(
            "currencyContainer"
        );


    const error =
        document.getElementById(
            "error"
        );


    if (loading) {

        loading.style.display =
            "block";

    }


    if (error) {

        error.style.display =
            "none";

    }


    try {

        const response =
            await fetch(
                `${API_BASE}/rates?base=INR`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to fetch rates."
            );

        }


        const data =
            await response.json();


        const wantedCurrencies = [

            "USD",
            "EUR",
            "GBP",
            "AED",
            "JPY"

        ];


        const rates = {};


        data.forEach(
            function (item) {

                if (
                    wantedCurrencies.includes(
                        item.quote
                    )
                ) {

                    rates[item.quote] =
                        item.rate;

                }

            }
        );


        if (container) {

            container.innerHTML = "";


            wantedCurrencies.forEach(
                function (currency) {

                    const rate =
                        rates[currency];


                    if (!rate) {

                        return;

                    }


                    container.innerHTML += `

                        <div class="col-md-4 col-lg">

                            <div
                                class="card
                                       text-center
                                       p-4
                                       h-100"
                            >

                                <div
                                    class="fs-2"
                                >
                                    💱
                                </div>

                                <h4>
                                    INR → ${currency}
                                </h4>

                                <h2
                                    class="text-success"
                                >
                                    ${rate.toFixed(4)}
                                </h2>

                                <p
                                    class="text-muted
                                           mb-0"
                                >

                                    1 INR =
                                    ${rate.toFixed(4)}
                                    ${currency}

                                </p>

                            </div>

                        </div>

                    `;

                }
            );

        }


        /*
            Refreshing current rates also
            refreshes the historical graph.
        */

        loadHistoricalChart();


    } catch (err) {

        console.error(err);


        if (error) {

            error.style.display =
                "block";


            error.textContent =
                "Unable to load exchange rates. Please try again.";

        }

    }


    if (loading) {

        loading.style.display =
            "none";

    }

}


/* =====================================
   CURRENCY CONVERTER
   ===================================== */

async function convertCurrency() {

    const amount =
        Number(
            document.getElementById(
                "amount"
            ).value
        );


    const fromCurrency =
        document.getElementById(
            "fromCurrency"
        ).value;


    const toCurrency =
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


    error.style.display =
        "none";


    result.style.display =
        "none";


    /* VALIDATION */

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        error.textContent =
            "Please enter an amount greater than 0.";

        error.style.display =
            "block";

        return;

    }


    try {

        /*
            If the user chooses the same
            currency, no API calculation
            is necessary.
        */

        if (
            fromCurrency ===
            toCurrency
        ) {

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


                <h2 class="text-success">

                    =

                    ${amount.toLocaleString(
                        "en-IN",
                        {
                            maximumFractionDigits: 2
                        }
                    )}

                    ${toCurrency}

                </h2>

            `;


            result.style.display =
                "block";


            return;

        }


        const response =
            await fetch(

                `${API_BASE}/rate/` +
                `${fromCurrency}/` +
                `${toCurrency}`

            );


        if (!response.ok) {

            throw new Error(
                "Conversion failed."
            );

        }


        const data =
            await response.json();


        const convertedAmount =
            amount * data.rate;


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


            <h2 class="text-success my-2">

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

                1 ${fromCurrency}
                =
                ${data.rate.toFixed(4)}
                ${toCurrency}

            </p>

        `;


        result.style.display =
            "block";


    } catch (err) {

        console.error(err);


        error.textContent =
            "Unable to convert currency. Please try again.";

        error.style.display =
            "block";

    }

}


/* =====================================
   HISTORICAL GRAPH
   ===================================== */

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

        /*
            Get the current date.
        */

        const today =
            new Date();


        /*
            Go back five years.
        */

        const fiveYearsAgo =
            new Date();


        fiveYearsAgo.setFullYear(
            today.getFullYear() - 5
        );


        const startDate =
            fiveYearsAgo
                .toISOString()
                .split("T")[0];


        const endDate =
            today
                .toISOString()
                .split("T")[0];


        /*
            Frankfurter historical
            time-series endpoint.
        */

        const url =
            `${API_BASE}/rates` +
            `?base=INR` +
            `&symbols=${currency}` +
            `&from=${startDate}` +
            `&to=${endDate}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Historical data unavailable."
            );

        }


        const data =
            await response.json();


        const labels = [];

        const values = [];


        /*
            The API returns an array
            of observations.
        */

        if (Array.isArray(data)) {

            data.forEach(
                function (item) {

                    if (
                        item.rate &&
                        item.date
                    ) {

                        labels.push(
                            formatDate(
                                item.date
                            )
                        );


                        values.push(
                            item.rate
                        );

                    }

                }
            );

        }


        /*
            Make sure we have data.
        */

        if (values.length === 0) {

            console.log(
                "No historical data available."
            );

            return;

        }


        /*
            Destroy old graph before
            drawing the new one.
        */

        if (historicalChart) {

            historicalChart.destroy();

        }


        historicalChart =
            new Chart(

                canvas,

                {

                    type: "line",


                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    `1 INR → ${currency}`,

                                data:
                                    values,

                                tension:
                                    0.25,

                                fill:
                                    false,

                                pointRadius:
                                    1.5

                            }

                        ]

                    },


                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,


                        interaction: {

                            mode:
                                "index",

                            intersect:
                                false

                        },


                        plugins: {

                            legend: {

                                display:
                                    true

                            },


                            tooltip: {

                                callbacks: {

                                    label:
                                        function (
                                            context
                                        ) {

                                            return (

                                                "1 INR = " +

                                                context.parsed.y
                                                    .toFixed(4) +

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

                                    maxTicksLimit:
                                        12

                                }

                            },


                            y: {

                                title: {

                                    display:
                                        true,

                                    text:
                                        `Value of 1 INR in ${currency}`

                                }

                            }

                        }

                    }

                }

            );


    } catch (err) {

        console.error(
            "Historical graph error:",
            err
        );

    }

}


/* =====================================
   DATE FORMATTER
   ===================================== */

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(

        "en-IN",

        {

            month:
                "short",

            year:
                "numeric"

        }

    );

}


/* =====================================
   INITIAL LOAD
   ===================================== */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        if (
            document.getElementById(
                "currencyContainer"
            )
        ) {

            getCurrencyRates();

        }

    }

);
