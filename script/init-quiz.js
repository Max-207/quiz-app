function getOptions() {
    let category = document.querySelector("[name='category']").value;
    let amount = document.querySelector("[name='number-questions']").value;
    let difficulty = document.querySelector("[name='difficulty']").value;
    let type = document.querySelector("[name='type']").value;

    return [category, amount, difficulty, type]
}

function buildURL() {
    [category, amount, difficulty, type] = getOptions();

    let paramsObject = {
        amount,
        category,
        difficulty,
        type
    };

    for(param in paramsObject) {
        if(paramsObject[param] === "any") {
            delete paramsObject[param];
        }
    }
    const params = "?" + new URLSearchParams(paramsObject).toString();
    return "https://opentdb.com/api.php" + params;
}

function startQuiz(questions) {
    if(!questions) {
        return function() {
            return;
        };
    }
    let startMenuElement = document.querySelector(".start-menu");
    startMenuElement.style.visibility = "hidden";

    let quizSection = document.createElement("section");
    quizSection.classList.add("quiz-section");
    
    let questionElement = document.createElement("div");
    questionElement.classList.add("question");
    quizSection.appendChild(questionElement);

    let answersElement = document.createElement("div");
    answersElement.classList.add("answers");
    quizSection.appendChild(answersElement);

    let nextQuestionButton = document.createElement("button");
    nextQuestionButton.classList.add("next-question");
    nextQuestionButton.addEventListener("click", nextQuestion);
    quizSection.appendChild(nextQuestionButton);

    document.body.appendChild(quizSection);

    let questionNumber = 0;

    function nextQuestion() {
        if(questionNumber === questions.length) {
            return;
        }
        const questionData = questions[questionNumber];
        quizSection.innerHTML = questionData.question;

        for(let i = 0; i < questionData.incorrect_answers.length; i++) {
            const answerElement = document.createElement("input");
            answerElement.type = "radio";
            answersElement.appendChild(answerElement);

            const answerTextElement = document.createElement("label");
            answerTextElement.innerHTML = questionData.incorrect_answers;
            answersElement.appendChild(answerTextElement);

            const pointsElement = document.createElement("p");
            pointsElement.textContent = questionData.difficulty === "easy" ? 10 : (questionData.difficulty === "medium" ? 20 : 30);
        }

        const answerElement = document.createElement("input");
        answerElement.name = "answer";
        answerElement.type = "radio";
        answersElement.appendChild(answerElement); 

        const answerTextElement = document.createElement("label");
        answerTextElement.innerHTML = questionData.correct_answer;
        answersElement.appendChild(answerTextElement);

        //Next Steps:
        //Nicht bei jeder Frage Elemente neu createn. Init und next() seperat aber ineinander hergehend
        //Error Handling hinzufügen
        //Styling
        //Code Optimierung
        //ChatGPT nach Review fragen
    }

    questionNumber++;

    return nextQuestion;
}

async function initQuiz() {
    const URL = buildURL();
    const result = await fetch(URL);
    const quizData = await result.json();
    startQuiz(quizData.results)();
}

const initQuizElement = document.querySelector("[name='init-quiz']");
initQuizElement.addEventListener("click", initQuiz);