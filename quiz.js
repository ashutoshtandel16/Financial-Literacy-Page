const questions = [
    {
        question: "Which information should never be shared with anyone?",
        options: [
            "UPI ID",
            "Bank name",
            "UPI PIN",
            "Account holder name"
        ],
        answer: "UPI PIN"
    },

    {
        question: "What is the main purpose of saving money?",
        options: [
            "To spend everything later",
            "To prepare for future needs",
            "To avoid using banks",
            "To increase expenses"
        ],
        answer: "To prepare for future needs"
    },

    {
        question: "What does UPI allow users to do?",
        options: [
            "Transfer money digitally",
            "Print currency",
            "Create a bank",
            "Avoid passwords"
        ],
        answer: "Transfer money digitally"
    },

    {
        question: "Which is an example of a strong financial safety practice?",
        options: [
            "Sharing your OTP",
            "Clicking unknown links",
            "Using official banking apps",
            "Sharing your UPI PIN"
        ],
        answer: "Using official banking apps"
    },

    {
        question: "What does diversification help reduce?",
        options: [
            "Internet speed",
            "Investment risk",
            "Bank balance",
            "Income"
        ],
        answer: "Investment risk"
    }
];


function Quiz() {

    const [currentQuestion, setCurrentQuestion] = React.useState(0);

    const [score, setScore] = React.useState(0);

    const [showResult, setShowResult] = React.useState(false);


    function selectAnswer(option) {

        if (option === questions[currentQuestion].answer) {

            setScore(score + 1);

        }


        if (currentQuestion < questions.length - 1) {

            setCurrentQuestion(currentQuestion + 1);

        } else {

            setShowResult(true);

        }

    }


    function restartQuiz() {

        setCurrentQuestion(0);

        setScore(0);

        setShowResult(false);

    }


    if (showResult) {

        return (

            <div className="card p-5 text-center mx-auto"
                 style={{maxWidth: "600px"}}>

                <h2>🎉 Quiz Completed!</h2>

                <h1 className="text-primary my-4">
                    {score} / {questions.length}
                </h1>

                <p>
                    You scored
                    {" "}
                    {Math.round(
                        (score / questions.length) * 100
                    )}
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
        questions[currentQuestion];


    return (

        <div
            className="card p-4 mx-auto"
            style={{maxWidth: "700px"}}
        >

            <div className="d-flex justify-content-between mb-3">

                <span>
                    Question {currentQuestion + 1}
                    {" "}
                    / {questions.length}
                </span>

                <span>
                    Score: {score}
                </span>

            </div>


            <div className="progress mb-4">

                <div
                    className="progress-bar"
                    style={{
                        width:
                            `${((currentQuestion + 1) /
                            questions.length) * 100}%`
                    }}
                >
                </div>

            </div>


            <h3 className="mb-4">
                {question.question}
            </h3>


            <div className="d-grid gap-2">

                {question.options.map((option, index) => (

                    <button
                        key={index}
                        className="btn btn-outline-primary text-start p-3"
                        onClick={() => selectAnswer(option)}
                    >

                        {option}

                    </button>

                ))}

            </div>

        </div>

    );

}


const root =
    ReactDOM.createRoot(
        document.getElementById("quiz-root")
    );


root.render(<Quiz />);