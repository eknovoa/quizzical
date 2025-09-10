import { useState, useEffect } from "react";
import { clsx } from "clsx"

export default function App() {
  const [startBtnClicked, setStatus] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

   useEffect(() => {
      const url = "https://opentdb.com/api.php?amount=5";
      fetch(url)
      .then(res => res.json())
      .then(data => {
        const processedQuestions = data.results.map(question => {
          const possibleAnswers = [...question.incorrect_answers, question.correct_answer];
          return {
            ...question,
            shuffledAnswers: shuffleArray(possibleAnswers),
          };
        });
        console.log(processedQuestions)
        setQuestions(processedQuestions);
      })
    }, []);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function handleChange(event, index) {
    const { value } = event.target;
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [index]: value,
    }));
  }
    
  function handleStart() {
    setStatus(prevStatus => !prevStatus)
  }

  function changeQuizDone() {
    setQuizSubmitted(true);
  } 

  function playAgain() {
    setCorrectCount(0);
    setQuizSubmitted(false);
    setUserAnswers({});
    
    
    const url = "https://opentdb.com/api.php?amount=5";
    fetch(url)
    .then(res => res.json())
    .then(data => {
      const processedQuestions = data.results.map(question => {
      const possibleAnswers = [...question.incorrect_answers, question.correct_answer];
        return {
          ...question,
          shuffledAnswers: shuffleArray(possibleAnswers),
        };
      });
      setQuestions(processedQuestions);
    })
  }

  const quizElements = questions !== null ? questions.map((question, questionIndex) => {
    const answerElements = question.shuffledAnswers.map((answer, answerIndex) => {
      // Determine if answer is selected, correct, or incorrect
      const isSelected = userAnswers[questionIndex] === answer;
      const isCorrect = quizSubmitted && answer === question.correct_answer;
      const isIncorrect = quizSubmitted && isSelected && !isCorrect;

       const answerClasses = clsx(
        'answer-label',
        {
          selected: isSelected && !quizSubmitted,
          correctAnswer: isCorrect,
          incorrectAnswer: isIncorrect
        }
      );

      return (
        <>
          <div key={answerIndex} className="question-answer-set">
            <input className="question" type="radio" name={`question-${questionIndex}`} id={`question-${questionIndex}-${answerIndex}`} value={answer} checked={isSelected} disabled={quizSubmitted} onChange={(e) => handleChange(e, questionIndex)} />
            <label className={answerClasses} htmlFor={`question-${questionIndex}-${answerIndex}`}>{answer}</label>
          </div>
        </>
        )
    })
    return (
    <div key={questionIndex}>
      <h3 className="question">{question.question}</h3>
      <div className="answers">
        {answerElements}
      </div>
      <hr/> 
    </div>
  );
}) : "";


  

function checkAnswers() {
  changeQuizDone();
    
  let count = 0
  questions.forEach((question, index) => {
    if (userAnswers[index] === question.correct_answer) {
      count++
    }
  });
  setCorrectCount(count);
}

  return (
    <main>
      {!startBtnClicked && 
        <section className="section-main">
          <h1 className="main-title">Quizzical</h1>
          <button className="startBtn" onClick={handleStart}>Start quiz</button>
        </section>
        
      }
      {startBtnClicked && 
        <>
          <section className="section-quiz">
            <form className="question-answers" action="">
              {quizElements}

              
            </form>
          </section>
          {!quizSubmitted && 
          <button onClick={checkAnswers} className="checkAnswers-btn">Check answers</button>}
        </>
      }
      {quizSubmitted && 
        <section className="quiz-results">
          <p>{correctCount !== null ? `You scored ${correctCount}/5 correct answers` : "No results"} </p>
          <button className="playAgain-btn" onClick={playAgain}>Play again</button>
        </section>
      }
    </main>
  )
}