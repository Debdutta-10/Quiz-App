import React, { useState, useEffect } from 'react';
import quizData from './quizdata.json'; // Adjust the path as necessary
import './quiz.css';

// Helper function to shuffle an array (Fisher-Yates Shuffle Algorithm)
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Quiz = () => {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [shuffledOptions, setShuffledOptions] = useState([]); // To store shuffled options for each question
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false); // Track showing the correct answer
  const [disableOptions, setDisableOptions] = useState(false); // Disable option buttons after selection
  const [incorrectQuestions, setIncorrectQuestions] = useState([]); // Store incorrect questions

  useEffect(() => {
    if (selectedWeek) {
      let selectedQuestions = [];
      if (selectedWeek === 'combined') {
        selectedQuestions = Object.keys(quizData.weeks).reduce((acc, week) => {
          return acc.concat(quizData.weeks[week].questions);
        }, []);
      } else if (selectedWeek === 'week-1-6') {
        selectedQuestions = Object.keys(quizData.weeks)
          .filter(week => {
            const weekNumber = parseInt(week.split('-')[1], 10);
            return weekNumber >= 1 && weekNumber <= 6;
          })
          .reduce((acc, week) => acc.concat(quizData.weeks[week].questions), []);
      } else if (selectedWeek === 'week-7-12') {
        selectedQuestions = Object.keys(quizData.weeks)
          .filter(week => {
            const weekNumber = parseInt(week.split('-')[1], 10);
            return weekNumber >= 7 && weekNumber <= 12;
          })
          .reduce((acc, week) => acc.concat(quizData.weeks[week].questions), []);
      } else {
        selectedQuestions = quizData.weeks[selectedWeek].questions;
      }

      setQuestions(shuffleArray(selectedQuestions));
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setShowCorrectAnswer(false);
      setIncorrectQuestions([]); // Reset incorrect questions when starting a new quiz
    }
  }, [selectedWeek]);

  useEffect(() => {
    if (questions.length > 0) {
      setShuffledOptions(shuffleArray([...questions[currentQuestionIndex].options]));
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswer = (answer) => {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    if (answer === correctAnswer) {
      setScore(score + 1);
      setFeedback('Correct!');
    } else {
      setFeedback('Wrong!');
      setShowCorrectAnswer(true);

      // Add incorrect question to the list
      setIncorrectQuestions((prev) => [
        ...prev,
        {
          question: questions[currentQuestionIndex].question,
          correctAnswer,
        },
      ]);
    }

    setUserAnswer(answer);
    setDisableOptions(true);

    setTimeout(() => {
      setUserAnswer('');
      setFeedback('');
      setShowCorrectAnswer(false);
      setDisableOptions(false);

      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setSelectedWeek('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setFeedback('');
    setShowCorrectAnswer(false);
    setDisableOptions(false);
    setIncorrectQuestions([]); // Reset incorrect questions when restarting
  };

  return (
    <div className='quiz-container'>
      <h1 style={{ textAlign: "center" }}>Select a Week Quiz or Combined Test</h1>
      {!selectedWeek ? (
        <div className='all-container'>
          {[...Array(12)].map((_, index) => (
            <button className='week-button' key={index} onClick={() => setSelectedWeek(`week-${index + 1}`)}>
              Week {index + 1}
            </button>
          ))}
          <button className='week-button' onClick={() => setSelectedWeek('combined')}>
            Combined Quiz
          </button>
          <button className='week-button' onClick={() => setSelectedWeek('week-1-6')}>
            Week 1-6
          </button>
          <button className='week-button' onClick={() => setSelectedWeek('week-7-12')}>
            Week 7-12
          </button>
        </div>
      ) : showResult ? (
        <div>
          <h2 className='q-head'>Your Score: {score} out of {questions.length}</h2>
          <button style={{ display: "block", margin: "auto", backgroundColor: "#111827", color: "white", border: "2px solid white", padding: "10px" }} className='q-head' onClick={handleRestart}>Restart Quiz</button>

          {incorrectQuestions.length > 0 && (
            <div className='incorrect-ans'>
              <h3 className='q-head'>Review Incorrect Questions:</h3>
              <div>
                {incorrectQuestions.map((item, index) => (
                  <div key={index}>
                    <p><strong>Question:</strong> {item.question}</p>
                    <p style={{color:"lightgreen"}}><strong>Correct Answer:</strong> {item.correctAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {currentQuestionIndex < questions.length ? (
            <div className='question-container'>
              <h3 className='q-head'>
                Q{currentQuestionIndex + 1}: {questions[currentQuestionIndex].question}
              </h3>
              <div className='option-container'>
                {shuffledOptions.map((option, index) => {
                  const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
                  const isSelected = userAnswer === option;

                  return (
                    <button className='question-option'
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={disableOptions}
                      style={{
                        backgroundColor: isSelected
                          ? (isCorrect ? 'lightgreen' : 'lightcoral')
                          : (showCorrectAnswer && isCorrect ? 'lightgreen' : ''),
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {feedback && <p className='q-head'>{feedback}</p>}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Quiz;
