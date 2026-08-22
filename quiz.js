const questions = [

    {
        question:
            "Which information should never be shared with anyone?",

        options: [
            "UPI ID",
            "Bank name",
            "UPI PIN",
            "Account holder name"
        ],

        answer:
            "UPI PIN"
    },


    {
        question:
            "What is the main purpose of saving money?",

        options: [
            "To spend everything later",
            "To prepare for future needs",
            "To avoid using banks",
            "To increase expenses"
        ],

        answer:
            "To prepare for future needs"
    },


    {
        question:
            "What does UPI allow users to do?",

        options: [
            "Transfer money digitally",
            "Print currency",
            "Create a bank",
            "Avoid passwords"
        ],

        answer:
            "Transfer money digitally"
    },


    {
        question:
            "Which is a good financial safety practice?",

        options: [
            "Sharing your OTP",
            "Clicking unknown links",
            "Using official banking apps",
            "Sharing your UPI PIN"
        ],

        answer:
            "Using official banking apps"
    },


    {
        question:
            "What does diversification help reduce?",

        options: [
            "Internet speed",
            "Investment risk",
            "Bank balance",
            "Income"
        ],

        answer:
            "Investment risk"
    }

];


function Quiz() {


    const [
        currentQuestion,
        setCurrentQuestion
    ] =
        React.useState(0);


    const [
        score,
        setScore
    ] =
        React.useState(0);


    const [
        showResult,
        setShowResult
    ] =
        React.useState(false);


    const [
        selectedAnswer,
        setSelectedAnswer
    ] =
        React.useState(null);


    function selectAnswer(option) {

        setSelectedAnswer(option);


        const correct =
            option ===
            questions[
                currentQuestion
            ].answer;


        if (correct) {

            setScore(
                score + 1
            );

        }


        setTimeout(

            function () {

                setSelectedAnswer(
                    null
                );


                if (
                    currentQuestion <
                    questions.length - 1
                ) {

                    setCurrentQuestion(
                        currentQuestion + 1
                    );

                } else {

                    setShowResult(
                        true
                    );

                }

            },

            500

        );

    }


    function restartQuiz() {

        setCurrentQuestion(0);

        setScore(0);

        setShowResult(false);

        setSelectedAnswer(null);

    }


    if (showResult) {

        const percentage =
            Math.round(
                (
                    score /
                    questions.length
                ) * 100
            );


        return (

            <div
                className="card
                           p-5
                           text-center
                           mx-auto"

                style={{
                    maxWidth:
                        "650px"
                }}
            >

                <h2>
                    🎉 Quiz Completed!
                </h2>


                <h1
                    className="text-success my-4"
                >
                    {score}
                    {" / "}
                    {questions.length}
                </h1>


                <p>
                    You scored
                    {" "}
                    {percentage}
                    %
                </p>


                <button
                    className="btn btn-primary"
                    onClick={restartQuiz}
                >
                    Try Again
                </button>

            </div>

        );

    }


    const question =
        questions[
            currentQuestion
        ];


    return (

        <div
            className="card
                       p-4
                       mx-auto"

            style={{
                maxWidth:
                    "700px"
            }}
        >


            <div
                className="
                    d-flex
                    justify-content-between
                    mb-3
                "
            >

                <span>

                    Question
                    {" "}
                    {currentQuestion + 1}
                    {" / "}
                    {questions.length}

                </span>


                <span>

                    Score:
                    {" "}
                    {score}

                </span>

            </div>


            <div className="progress mb-4">

                <div
                    className="progress-bar"
                    style={{
                        width:
                            `${
                                (
                                    (
                                        currentQuestion + 1
                                    ) /
                                    questions.length
                                ) * 100
                            }%`
                    }}
                >
                </div>

            </div>


            <h3 className="mb-4">

                {question.question}

            </h3>


            <div className="d-grid gap-2">

                {
                    question.options.map(

                        function (
                            option,
                            index
                        ) {

                            let buttonClass =
                                "btn btn-outline-success text-start p-3";


                            if (
                                selectedAnswer ===
                                option
                            ) {

                                if (
                                    option ===
                                    question.answer
                                ) {

                                    buttonClass =
                                        "btn btn-success text-start p-3";

                                } else {

                                    buttonClass =
                                        "btn btn-danger text-start p-3";

                                }

                            }


                            return (

                                <button
                                    key={index}
                                    className={
                                        buttonClass
                                    }
                                    onClick={
                                        function () {

                                            if (
                                                selectedAnswer ===
                                                null
                                            ) {

                                                selectAnswer(
                                                    option
                                                );

                                            }

                                        }
                                    }
                                >

                                    {option}

                                </button>

                            );

                        }

                    )
                }

            </div>


        </div>

    );

}


const root =
    ReactDOM.createRoot(

        document.getElementById(
            "quiz-root"
        )

    );


root.render(
    <Quiz />
);
