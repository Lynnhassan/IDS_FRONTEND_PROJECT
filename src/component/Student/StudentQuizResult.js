import React from 'react';
import './StudentQuizResult.css';
import { useNavigate } from 'react-router-dom';

const StudentQuizResult = ({ result, onRetake, onViewHistory }) => {
  const navigate = useNavigate();

  console.log('📊 StudentQuizResult received:', result);

  if (!result) {
    return (
      <div className="result-container">
        <div className="quiz-error">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Results</h3>
          <p>No quiz results found</p>
          <button onClick={() => navigate('/student/dashboard')} className="btn-retry">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const score = result.result || result.score || {};
  const quiz_info = result.quiz_info || result.quiz || {};
  const attempts_info = result.attempts_info || result.attempts || {};
  const question_results = result.question_results || result.questions || [];

  console.log('📝 Parsed Data:', { score, quiz_info, attempts_info, question_results });

  if (!score || typeof score.score === 'undefined') {
    return (
      <div className="result-container">
        <div className="quiz-error">
          <div className="error-icon">⚠️</div>
          <h3>Invalid Results Data</h3>
          <p>The quiz results are incomplete</p>
          <button onClick={() => navigate('/student/dashboard')} className="btn-retry">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = () => {
    if (score.passed) return '#10b981';
    if (score.score >= score.passing_score * 0.8) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreEmoji = () => {
    if (score.passed) return '🎉';
    if (score.score >= score.passing_score * 0.8) return '😊';
    return '😔';
  };

  // Enhanced helper function with better debugging
  const getAnswerText = (question, answerData) => {
    console.log('🔍 Getting answer for:', {
      questionText: question.question_text,
      answerData,
      availableAnswers: question.answers || question.options
    });

    // If answerData is already text, return it
    if (typeof answerData === 'string' && isNaN(answerData)) {
      return answerData;
    }

    const answers = question.answers || question.options || [];
    
    if (!answers || answers.length === 0) {
      console.warn('⚠️ No answer options available for question:', question.question_text);
      return 'No answer options available';
    }

    // Handle array of answer IDs
    if (Array.isArray(answerData)) {
      const results = answerData.map(item => {
        if (typeof item === 'string' && isNaN(item)) {
          return item;
        }
        
        // Try different ID matching strategies
        const answer = answers.find(a => 
          a.id === item || 
          a.answer_id === item || 
          String(a.id) === String(item) || 
          String(a.answer_id) === String(item)
        );
        
        if (!answer) {
          console.warn('⚠️ Could not find answer for ID:', item, 'Available answers:', answers);
          return `Answer ID: ${item}`;
        }
        
        return answer.answer_text || answer.text || answer.content || `ID: ${item}`;
      });
      
      return results.join(', ');
    }

    // Handle single answer ID
    const answer = answers.find(a => 
      a.id === answerData || 
      a.answer_id === answerData ||
      String(a.id) === String(answerData) ||
      String(a.answer_id) === String(answerData)
    );
    
    if (!answer) {
      console.warn('⚠️ Could not find answer for ID:', answerData, 'Available answers:', answers);
      return `Answer ID: ${answerData}`;
    }
    
    return answer.answer_text || answer.text || answer.content || `ID: ${answerData}`;
  };

  const percentage = (score.score / 100) * 100;

  return (
    <div className="result-container">
      {/* Result Header */}
      <div className="result-header">
        <div className="result-icon">{getScoreEmoji()}</div>
        <h1>{score.passed ? 'Congratulations!' : 'Quiz Completed'}</h1>
        <p className="result-message">
          {score.passed 
            ? 'You have passed the quiz successfully!' 
            : 'Unfortunately, you did not pass this time.'}
        </p>
      </div>

      {/* Score Circle */}
      <div className="score-section">
        <div className="score-circle" style={{ borderColor: getScoreColor() }}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={getScoreColor()}
              strokeWidth="12"
              strokeDasharray={`${(percentage / 100) * 565} 565`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              style={{ transition: 'stroke-dasharray 1s ease-out' }}
            />
          </svg>
          <div className="score-text">
            <span className="score-value" style={{ color: getScoreColor() }}>
              {/* ✅ CHANGED: .toFixed(1) to .toFixed(2) */}
              {score.score?.toFixed(2) || '0.00'}%
            </span>
            <span className="score-label">Your Score</span>
          </div>
        </div>

        <div className="score-details">
          <div className="detail-item">
            <span className="detail-icon">✓</span>
            <div>
              <span className="detail-value">{score.correct_answers || 0}</span>
              <span className="detail-label">Correct</span>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">✗</span>
            <div>
              <span className="detail-value">
                {(score.total_questions || 0) - (score.correct_answers || 0)}
              </span>
              <span className="detail-label">Wrong</span>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">🎯</span>
            <div>
              {/* ✅ CHANGED: Added optional chaining and default value */}
              <span className="stat-value">{score.passing_score?.toFixed(2) || '0.00'}%</span>
              <span className="detail-label">Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className={`status-card ${score.passed ? 'passed' : 'failed'}`}>
        <div className="status-icon">
          {score.passed ? '✓' : '✗'}
        </div>
        <div className="status-text">
          <h3>{score.passed ? 'Quiz Passed' : 'Quiz Failed'}</h3>
          <p>
            {score.passed
              ? /* ✅ CHANGED: Both percentages now use .toFixed(2) */
                `You scored ${score.score?.toFixed(2)}% which is above the passing score of ${score.passing_score?.toFixed(2)}%`
              : `You scored ${score.score?.toFixed(2)}% which is below the passing score of ${score.passing_score?.toFixed(2)}%`}
          </p>
        </div>
      </div>

      {/* Attempts Info */}
      {attempts_info && (
        <div className="attempts-card">
          <h3>Attempt Information</h3>
          <div className="attempts-grid">
            <div className="attempt-stat">
              <span className="stat-label">Attempts Used</span>
              <span className="stat-value">
                {attempts_info.attempts_used || 0} / {attempts_info.max_attempts || 0}
              </span>
            </div>
            <div className="attempt-stat">
              <span className="stat-label">Attempts Left</span>
              <span className="stat-value">{attempts_info.attempts_left || 0}</span>
            </div>
          </div>
          {attempts_info.can_retake && !score.passed && (
            <p className="retake-message">
              💡 You can retake this quiz {attempts_info.attempts_left} more time(s)
            </p>
          )}
          {!attempts_info.can_retake && !score.passed && (
            <p className="no-retake-message">
              ⚠️ You have used all your attempts for this quiz
            </p>
          )}
        </div>
      )}

      {/* Question Review */}
      {question_results && question_results.length > 0 && (
        <div className="review-section">
          <h3>Question Review</h3>
          <div className="questions-review">
            {question_results.map((question, index) => {
              console.log(`📝 Question ${index + 1} full data:`, JSON.stringify(question, null, 2));
              
              const answers = question.answers || question.options || [];
              console.log(`📋 Available answers for Q${index + 1}:`, answers);

              return (
                <div key={question.question_id || index} className="review-item">
                  <div className="review-header">
                    <span className="review-number">Q{index + 1}</span>
                    <span className={`review-badge ${question.is_correct ? 'correct' : 'incorrect'}`}>
                      {question.is_correct ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p className="review-question">{question.question_text}</p>
                  
                  {/* Show all answer options if available */}
                  {answers && answers.length > 0 ? (
                    <div className="all-answers">
                      <p className="answers-label">Answer Options:</p>
                      <ul className="answer-options-list">
                        {answers.map((answer, ansIdx) => {
                          const answerId = answer.id || answer.answer_id;
                          const answerText = answer.answer_text || answer.text || answer.content || `Option ${ansIdx + 1}`;
                          
                          console.log(`  Answer ${ansIdx + 1}:`, { answerId, answerText, fullAnswer: answer });
                          
                          // Compare with both number and string types
                          const isUserAnswer = Array.isArray(question.user_answer) 
                            ? question.user_answer.some(ua => ua === answerId || String(ua) === String(answerId))
                            : question.user_answer === answerId || String(question.user_answer) === String(answerId);
                          
                          const isCorrectAnswer = Array.isArray(question.correct_answer)
                            ? question.correct_answer.some(ca => ca === answerId || String(ca) === String(answerId))
                            : question.correct_answer === answerId || String(question.correct_answer) === String(answerId);

                          return (
                            <li 
                              key={answerId || ansIdx} 
                              className={`answer-option ${isCorrectAnswer ? 'correct-option' : ''} ${isUserAnswer && !isCorrectAnswer ? 'wrong-option' : ''}`}
                            >
                              <span className="option-text">{answerText}</span>
                              {isCorrectAnswer && <span className="option-badge correct">✓ Correct Answer</span>}
                              {isUserAnswer && !isCorrectAnswer && <span className="option-badge wrong">✗ Your Answer</span>}
                              {isUserAnswer && isCorrectAnswer && <span className="option-badge both">✓ Your Answer (Correct!)</span>}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    /* Fallback: Show text-based answers */
                    <div className="answer-comparison">
                      <div className="your-answer">
                        <span className="answer-label">Your Answer:</span>
                        <span className="answer-value wrong">
                          {question.user_answer_text || getAnswerText(question, question.user_answer)}
                        </span>
                      </div>
                      {!question.is_correct && (
                        <div className="correct-answer">
                          <span className="answer-label">Correct Answer:</span>
                          <span className="answer-value correct">
                            {question.correct_answer_text || getAnswerText(question, question.correct_answer)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="result-actions">
        <button onClick={onViewHistory} className="btn-secondary">
          📊 View History
        </button>
        {attempts_info?.can_retake && !score.passed && (
          <button onClick={onRetake} className="btn-primary">
            🔄 Retake Quiz
          </button>
        )}
        {score.passed && (
          <button onClick={() => navigate('/student/dashboard')} className="btn-primary">
            🏠 Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentQuizResult;
