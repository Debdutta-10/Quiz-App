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
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false); // New state to track showing the correct answer

  useEffect(() => {
    if (selectedWeek) {
      if (selectedWeek === 'combined') {
        // Combine all questions from all weeks
        const combinedQuestions = Object.keys(quizData.weeks).reduce((acc, week) => {
          return acc.concat(quizData.weeks[week].questions);
        }, []);

        // Shuffle the combined questions
        setQuestions(shuffleArray(combinedQuestions));
      } else {
        // Load questions for the selected week
        setQuestions(quizData.weeks[selectedWeek].questions);
      }

      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setShowCorrectAnswer(false); // Reset correct answer display
    }
  }, [selectedWeek]);

  useEffect(() => {
    if (questions.length > 0) {
      // Shuffle options when the current question changes
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
      setShowCorrectAnswer(true); // Show the correct answer when the user is wrong
    }

    setUserAnswer(answer);

    // Check if it's the last question
    setTimeout(() => {
      setUserAnswer('');
      setFeedback('');
      setShowCorrectAnswer(false); // Reset for the next question

      if (currentQuestionIndex + 1 < questions.length) {
        // Move to next question if not finished
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Automatically show the result after the last question
        setShowResult(true);
      }
    }, 1500); // Adjusted timeout to give more time to read feedback
  };

  const handleRestart = () => {
    setSelectedWeek('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setFeedback('');
    setShowCorrectAnswer(false); // Reset when restarting
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
        </div>
      ) : showResult ? (
        <div>
          <h2 className='q-head'>Your Score: {score} out of {questions.length}</h2>
          <button style={{ display: "block", margin: "auto", backgroundColor: "#111827", color: "white", border: "2px solid white", padding: "10px" }} className='q-head' onClick={handleRestart}>Restart Quiz</button>
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
