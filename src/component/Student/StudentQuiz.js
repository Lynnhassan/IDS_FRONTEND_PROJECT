import React, { useState, useEffect, useCallback,useParams } from 'react';
import './StudentQuizStyle.css';
import { API_URL } from '../../config';

const StudentQuiz = ({ quizId, onComplete }) => {
    const { courseId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [error, setError] = useState(null);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false); // ✅ ADD THIS

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/student/quiz/${quizId}/start`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load quiz');
        }

        setQuiz(data.quiz);
        setQuestions(data.questions);
        setTimeLeft(data.quiz.timeLimit * 60); // Convert minutes to seconds
        setTimerStarted(true); // ✅ START TIMER AFTER DATA LOADS
        setLoading(false);
        
        console.log('✅ Quiz loaded, timer starting with:', data.quiz.timeLimit * 60, 'seconds');
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // ✅ IMPROVED TIMER COUNTDOWN
  useEffect(() => {
    // Don't start timer until quiz data is loaded
    if (!timerStarted || loading || timeLeft <= 0) {
      if (timeLeft <= 0 && timerStarted && !loading) {
        // Time expired
        setTimeExpired(true);
        setShowTimeUpModal(true);
        
        // Auto-submit after 3 seconds
        setTimeout(() => {
          handleSubmit();
        }, 3000);
      }
      return;
    }

    console.log('⏱️ Timer running:', timeLeft, 'seconds remaining');

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerStarted, loading]);

  // Submit quiz
  const handleSubmit = useCallback(async () => {
    if (submitting) return;

    setSubmitting(true);
    console.log('📝 Submitting quiz with answers:', answers);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/student/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit quiz');
      }

      console.log('✅ Quiz submitted successfully:', data);

      // Pass result to parent component
      if (onComplete) {
        onComplete(data);
      }
    } catch (err) {
      console.error('❌ Quiz submission error:', err);
      setError(err.message);
      setSubmitting(false);
    }
  }, [submitting, answers, quizId, onComplete]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer color based on time left
  const getTimerColor = () => {
    if (!quiz) return '#10b981';
    const percentage = (timeLeft / (quiz.timeLimit * 60)) * 100;
    if (percentage > 50) return '#10b981'; // green
    if (percentage > 20) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  // Handle answer selection
  const handleAnswerChange = (questionId, answerId, questionType) => {
    if (timeExpired) return;

    setAnswers(prev => {
      if (questionType === 'single') {
        return { ...prev, [questionId]: answerId };
      } else {
        // Multiple choice
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(answerId)
          ? currentAnswers.filter(id => id !== answerId)
          : [...currentAnswers, answerId];
        return { ...prev, [questionId]: newAnswers };
      }
    });
  };

  // Check if question is answered
  const isQuestionAnswered = (questionId) => {
    const answer = answers[questionId];
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  };

  // Count answered questions
  const answeredCount = questions.filter(q => isQuestionAnswered(q.id)).length;

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-loading">
          <div className="spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-error">
          <div className="error-icon">⚠️</div>
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-retry">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {/* Quiz Header */}
      <div className="quiz-header">
        <div className="quiz-info">
          <h1>{quiz.title}</h1>
          <p className="quiz-course">{quiz.course}</p>
          <div className="quiz-meta">
            <span>📚 {quiz.totalQuestions} Questions</span>
            <span>✓ Passing Score: {quiz.passingScore}%</span>
            <span>📝 Answered: {answeredCount}/{quiz.totalQuestions}</span>
          </div>
        </div>

        {/* Timer */}
        <div className="quiz-timer" style={{ borderColor: getTimerColor() }}>
          <div className="timer-icon">⏱️</div>
          <div className="timer-text">
            <span className="timer-label">Time Remaining</span>
            <span 
              className="timer-value" 
              style={{ color: getTimerColor() }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Time Expired Banner */}
      {timeExpired && (
        <div className="time-expired-banner">
          <span className="banner-icon">⏰</span>
          <span className="banner-text">Time's up! Answers are now locked.</span>
        </div>
      )}

      {/* Questions */}
      <div className="questions-list">
        {questions.map((question, index) => (
          <div key={question.id} className="question-card">
            <div className="question-header">
              <span className="question-number">Question {index + 1}</span>
              <span className={`question-type ${question.questionType}`}>
                {question.questionType === 'single' ? '⚪ Single Choice' : '☑️ Multiple Choice'}
              </span>
            </div>

            <h3 className="question-text">{question.questionText}</h3>

            <div className="answers-list">
              {question.answers.map((answer) => (
                <label
                  key={answer.id}
                  className={`answer-option ${
                    question.questionType === 'single'
                      ? answers[question.id] === answer.id ? 'selected' : ''
                      : (answers[question.id] || []).includes(answer.id) ? 'selected' : ''
                  } ${timeExpired ? 'disabled' : ''}`}
                >
                  <input
                    type={question.questionType === 'single' ? 'radio' : 'checkbox'}
                    name={`question-${question.id}`}
                    value={answer.id}
                    checked={
                      question.questionType === 'single'
                        ? answers[question.id] === answer.id
                        : (answers[question.id] || []).includes(answer.id)
                    }
                    onChange={() => handleAnswerChange(question.id, answer.id, question.questionType)}
                    disabled={timeExpired}
                  />
                  <span className="answer-text">{answer.answerText}</span>
                  {question.questionType === 'single' ? (
                    <span className="radio-indicator"></span>
                  ) : (
                    <span className="checkbox-indicator">
                      {(answers[question.id] || []).includes(answer.id) && '✓'}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="quiz-footer">
        <div className="footer-info">
          <p className="footer-warning">
            ⚠️ Make sure to review your answers before submitting. You cannot change them after submission.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || answeredCount === 0}
          className="btn-submit"
        >
          {submitting ? (
            <>
              <span className="spinner-small"></span>
              Submitting...
            </>
          ) : (
            <>
              Submit Quiz ({answeredCount}/{quiz.totalQuestions} answered)
            </>
          )}
        </button>
      </div>

      {/* Time Up Modal */}
      {showTimeUpModal && (
        <div className="modal-overlay">
          <div className="modal-card time-up-modal">
            <div className="modal-icon">⏰</div>
            <h3>Time's Up!</h3>
            <p>Your quiz time has expired. Your answers will be automatically submitted.</p>
            <div className="modal-timer">Submitting in 3 seconds...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQuiz;