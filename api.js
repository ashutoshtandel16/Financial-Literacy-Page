const API_BASE = "https://api.frankfurter.dev/v2";

let historicalChart = null;

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
            throw new Error("Unable to fetch exchange rates.");
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

                const item = data.find(function(rate) {
                    return rate.quote === currency;
                });

                if (!item) {
                    return;
                }

                const rate = Number(item.rate);

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

        }

    } catch (errorObject) {

        console.error(
            "Current exchange-rate error:",
            errorObject
        );

        if (error) {

            error.style.display = "block";

            error.textContent =
                "Unable to load exchange rates. Please try again.";

        }

    } finally {

        if (loading) {
            loading.style.display = "none";
        }

    }

}


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

        const response = await fetch(
            `${API_BASE}/rate/${from}/${to}`
        );

        if (!response.ok) {
            throw new Error("Currency conversion failed.");
        }

        const data =
            await response.json();

        const rate =
            Number(data.rate);

        const convertedAmount =
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

            <h2 class="text-success my-2">
                =
                ${convertedAmount.toLocaleString(
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
            "Currency converter error:",
            errorObject
        );

        error.textContent =
            "Unable to convert currency. Please try again.";

        error.style.display = "block";

    }

}


async function loadHistoricalChart() {

    const select =
        document.getElementById("historyCurrency");

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

        const today =
            new Date();

        const fiveYearsAgo =
            new Date();

        fiveYearsAgo.setFullYear(
            today.getFullYear() - 5
        );

        const startDate =
            fiveYearsAgo
                .toISOString()
                .split("T")[0];

        const url =
            `${API_BASE}/rates` +
            `?base=INR` +
            `&from=${startDate}` +
            `&group=month`;

        console.log(
            "Historical exchange-rate URL:",
            url
        );

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Historical API request failed. Status: " +
                response.status
            );

        }

        const data =
            await response.json();

        console.log(
            "Historical exchange-rate data:",
            data
        );

        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            throw new Error(
                "No historical exchange-rate data was returned."
            );

        }

        const labels = [];
        const values = [];

        data.forEach(function(item) {

            if (
                item.quote === currency &&
                item.rate !== undefined &&
                item.date
            ) {

                labels.push(
                    formatGraphDate(item.date)
                );

                values.push(
                    Number(item.rate)
                );

            }

        });

        if (values.length === 0) {

            throw new Error(
                "No historical data was found for " +
                currency
            );

        }

        if (historicalChart) {

            historicalChart.destroy();

            historicalChart = null;

        }

        const context =
            canvas.getContext("2d");

        historicalChart =
            new Chart(

                context,

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

                                borderWidth:
                                    2,

                                pointRadius:
                                    2,

                                pointHoverRadius:
                                    5,

                                tension:
                                    0.25,

                                fill:
                                    false

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

                                title: {

                                    display:
                                        true,

                                    text:
                                        "Year"

                                },

                                ticks: {

                                    maxTicksLimit:
                                        12,

                                    autoSkip:
                                        true

                                }

                            },

                            y: {

                                beginAtZero:
                                    false,

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

    } catch (errorObject) {

        console.error(
            "Historical graph error:",
            errorObject
        );

        const chartBox =
            canvas.parentElement;

        if (chartBox) {

            chartBox.innerHTML = `

                <div class="alert alert-warning text-center">

                    <strong>
                        Historical graph could not be loaded.
                    </strong>

                    <br><br>

                    Please refresh the page and try again.

                </div>

            `;

        }

    }

}


function formatGraphDate(dateString) {

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

        if (
            document.getElementById(
                "currencyContainer"
            )
        ) {

            getCurrencyRates();

        }

        if (
            document.getElementById(
                "historicalCurrencyChart"
            )
        ) {

            if (
                typeof Chart !== "undefined"
            ) {

                loadHistoricalChart();

            } else {

                console.error(
                    "Chart.js has not loaded."
                );

            }

        }

    }
);
