// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { API_URL } from '../../config';
// import './StudentQuizHistory.css';

// const StudentQuizHistory = () => {
//   const { quizId } = useParams();
//   const navigate = useNavigate();
//   const [history, setHistory] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
// const [showCertificateModal, setShowCertificateModal] = useState(false);

//   useEffect(() => {
//     console.log('📊 Fetching quiz history for quizId:', quizId);
//     fetchHistory();
//   }, [quizId]);

// //   useEffect(() => {
// //   let timer;

// //   if (!canRetakeQuiz) {
// //     timer = setTimeout(() => {
// //       setShowCertificateModal(true);
// //     }, 10000); // 10 seconds
// //   }

// //   return () => {
// //     if (timer) clearTimeout(timer);
// //   };
// // }, [canRetakeQuiz]);


//   const fetchHistory = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const token = localStorage.getItem('token');
      
//       console.log('🔑 Token:', token ? 'exists' : 'missing');
//       console.log('🌐 API URL:', `${API_URL}/student/quiz/${quizId}/history`);

//       const response = await fetch(
//         `${API_URL}/student/quiz/${quizId}/history`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       const data = await response.json();
//       console.log('📥 History API Response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to fetch quiz history');
//       }

//       setHistory(data);
//       setLoading(false);
//     } catch (err) {
//       console.error('❌ Error fetching history:', err);
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="history-container">
//         <div className="history-loading">
//           <div className="spinner"></div>
//           <p>Loading quiz history...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="history-container">
//         <div className="history-error">
//           <div className="error-icon">⚠️</div>
//           <h3>Error Loading History</h3>
//           <p>{error}</p>
//           <button onClick={fetchHistory} className="btn-retry">
//             Try Again
//           </button>
//           <button 
//             onClick={() => navigate('/student/dashboard')} 
//             className="btn-back"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!history || !history.quiz) {
//     return (
//       <div className="history-container">
//         <div className="history-empty">
//           <div className="empty-icon">📊</div>
//           <h3>No History Found</h3>
//           <p>You haven't attempted this quiz yet.</p>
//           <button 
//             onClick={() => navigate('/student/dashboard')} 
//             className="btn-back"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { quiz, statistics, attempts } = history;
  
//   // Check if best score is 90 or above
//   const canRetakeQuiz = !statistics?.best_score || statistics.best_score < 90;

//   return (
//     <div className="history-container">
//       {/* Header */}
//       <div className="history-header">
//         <button 
//           onClick={() => navigate('/student/dashboard')} 
//           className="back-button"
//         >
//           ← Back to Dashboard
//         </button>
//         <h1>Quiz History</h1>
//       </div>

//       {/* Quiz Info Card */}
//       <div className="quiz-info-card">
//         <h2>{quiz.title}</h2>
//         <div className="quiz-details">
//           <span className="detail-badge">
//             🎯 Passing Score: {quiz.passing_score}%
//           </span>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="statistics-section">
//         <h3>Your Statistics</h3>
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-icon">📝</div>
//             <div className="stat-content">
//               <span className="stat-value">{statistics?.total_attempts || 0}</span>
//               <span className="stat-label">Total Attempts</span>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">🏆</div>
//             <div className="stat-content">
//               <span className="stat-value">{statistics?.best_score?.toFixed(1) || 0}%</span>
//               <span className="stat-label">Best Score</span>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">📊</div>
//             <div className="stat-content">
//               <span className="stat-value">{statistics?.average_score?.toFixed(1) || 0}%</span>
//               <span className="stat-label">Average Score</span>
//             </div>
//           </div>

//           <div className="stat-card">
//             <div className="stat-icon">{statistics?.has_passed ? '✓' : '✗'}</div>
//             <div className="stat-content">
//               <span className="stat-value">
//                 {statistics?.has_passed ? 'Passed' : 'Not Yet'}
//               </span>
//               <span className="stat-label">Status</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Excellence Achievement Banner */}
//       {!canRetakeQuiz && (
//         <div className="excellence-banner">
//           <div className="excellence-icon">🌟</div>
//           <div className="excellence-content">
//             <h4>Excellent Performance!</h4>
//             <p>
//               You've achieved an outstanding score of {statistics.best_score.toFixed(1)}%. 
//               Quiz retakes are not available for scores of 90% or above.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Attempts History */}
//       <div className="attempts-section">
//         <h3>Attempt History</h3>
//         {attempts && attempts.length > 0 ? (
//           <div className="attempts-list">
//             {attempts.map((attempt, index) => (
//               <div 
//                 key={attempt.id} 
//                 className={`attempt-card ${attempt.passed ? 'passed' : 'failed'}`}
//               >
//                 <div className="attempt-header">
//                   <div className="attempt-number">
//                     <span className="attempt-badge">
//                       Attempt #{attempts.length - index}
//                     </span>
//                     <span className={`status-badge ${attempt.passed ? 'passed' : 'failed'}`}>
//                       {attempt.passed ? '✓ Passed' : '✗ Failed'}
//                     </span>
//                   </div>
//                   <span className="attempt-date">{attempt.formatted_date}</span>
//                 </div>

//                 <div className="attempt-body">
//                   <div className="score-display">
//                     <div className="score-circle-small">
//                       <svg width="80" height="80" viewBox="0 0 80 80">
//                         <circle
//                           cx="40"
//                           cy="40"
//                           r="35"
//                           fill="none"
//                           stroke="#e5e7eb"
//                           strokeWidth="6"
//                         />
//                         <circle
//                           cx="40"
//                           cy="40"
//                           r="35"
//                           fill="none"
//                           stroke={attempt.passed ? '#10b981' : '#ef4444'}
//                           strokeWidth="6"
//                           strokeDasharray={`${2 * Math.PI * 35}`}
//                           strokeDashoffset={`${2 * Math.PI * 35 * (1 - attempt.score / 100)}`}
//                           strokeLinecap="round"
//                           transform="rotate(-90 40 40)"
//                         />
//                       </svg>
//                       <div className="score-text-small">
//                         <span className="score-value-small">{attempt.score}%</span>
//                       </div>
//                     </div>
                    
//                     <div className="attempt-details">
//                       <p>
//                         <strong>Date:</strong> {new Date(attempt.attempt_date).toLocaleDateString()} 
//                         {' at '} 
//                         {new Date(attempt.attempt_date).toLocaleTimeString()}
//                       </p>
//                       <p>
//                         <strong>Result:</strong> {attempt.score}% 
//                         {attempt.passed 
//                           ? ` (${(attempt.score - quiz.passing_score).toFixed(1)}% above passing)` 
//                           : ` (${(quiz.passing_score - attempt.score).toFixed(1)}% below passing)`}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="no-attempts">
//             <p>No attempts recorded yet.</p>
//           </div>
//         )}
//       </div>

//       {/* Action Buttons */}
//       <div className="history-actions">
//         <button 
//           onClick={() => navigate('/student/dashboard')} 
//           className="btn-secondary"
//         >
//           🏠 Back to Dashboard
//         </button>
//         {canRetakeQuiz ? (
//           <button 
//             onClick={() => navigate(`/student/quiz/${quizId}/take`)} 
//             className="btn-primary"
//           >
//             📝 Take Quiz Again
//           </button>
//         ) : (
//           <button 
//             className="btn-primary btn-disabled"
//             disabled
//             title="Retakes not available for scores 90% or above"
//           >
//             📝 Retake Not Available
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentQuizHistory;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import './StudentQuizHistory.css';

const StudentQuizHistory = () => {
    const { courseId } = useParams();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  useEffect(() => {
    console.log('📊 Fetching quiz history for quizId:', quizId);
    fetchHistory();
  }, [quizId]);

  useEffect(() => {
    let timer;

    if (history && !canRetakeQuiz(history.statistics)) {
      timer = setTimeout(() => {
        setShowCertificateModal(true);
      }, 10000); // 10 seconds
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [history]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      
      console.log('🔑 Token:', token ? 'exists' : 'missing');
      console.log('🌐 API URL:', `${API_URL}/student/quiz/${quizId}/history`);

      const response = await fetch(
        `${API_URL}/student/quiz/${quizId}/history`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      console.log('📥 History API Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch quiz history');
      }

      setHistory(data);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching history:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const canRetakeQuiz = (statistics) => {
    return !statistics?.best_score || statistics.best_score < 90;
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="history-loading">
          <div className="spinner"></div>
          <p>Loading quiz history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container">
        <div className="history-error">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading History</h3>
          <p>{error}</p>
          <button onClick={fetchHistory} className="btn-retry">
            Try Again
          </button>
          <button 
            onClick={() => navigate('/student/dashboard')} 
            className="btn-back"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!history || !history.quiz) {
    return (
      <div className="history-container">
        <div className="history-empty">
          <div className="empty-icon">📊</div>
          <h3>No History Found</h3>
          <p>You haven't attempted this quiz yet.</p>
          <button 
            onClick={() => navigate('/student/dashboard')} 
            className="btn-back"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { quiz, statistics, attempts } = history;
  const isRetakeAvailable = canRetakeQuiz(statistics);

  return (
    <div className="history-container">
      {/* Certificate Modal */}
      {/* {showCertificateModal && (
        <div className="modal-overlay" onClick={() => setShowCertificateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowCertificateModal(false)}
            >
              ×
            </button>
            <div className="modal-icon">🏆</div>
            <h2>Congratulations!</h2>
            <p>You've achieved an excellent score of {statistics.best_score.toFixed(1)}%!</p>
            <p>Would you like to view your certificate?</p>
            <div className="modal-actions">
              <button 
                onClick={() => navigate(`/student/quiz/${quizId}/certificate`)}
                className="btn-primary"
              >
                View Certificate
              </button>
              <button 
                onClick={() => setShowCertificateModal(false)}
                className="btn-secondary"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )} */}
{showCertificateModal && (
  <div className="modal-overlay" onClick={() => setShowCertificateModal(false)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <div className="modal-icon">🏆</div>
      <h2>Congratulations!</h2>
      <p>You've achieved an excellent score of {statistics.best_score.toFixed(1)}%!</p>
      <p>Would you like to view your certificate?</p>
      <div className="modal-actions">
        <button 
          onClick={() => navigate(`/student/certificates`)}
          className="btn-primary"
        >
          View Certificate
        </button>
        <button 
          onClick={() => setShowCertificateModal(false)}
          className="btn-secondary"
        >
          Maybe Later
        </button>
      </div>
    </div>
  </div>
)}
      {/* Header */}
      <div className="history-header">
        <button 
          onClick={() => navigate('/student/dashboard')} 
          className="back-button"
        >
          ← Back to Dashboard
        </button>
        <h1>Quiz History</h1>
      </div>

      {/* Quiz Info Card */}
      <div className="quiz-info-card">
        <h2>{quiz.title}</h2>
        <div className="quiz-details">
          <span className="detail-badge">
            🎯 Passing Score: {quiz.passing_score}%
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="statistics-section">
        <h3>Your Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <span className="stat-value">{statistics?.total_attempts || 0}</span>
              <span className="stat-label">Total Attempts</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <span className="stat-value">{statistics?.best_score?.toFixed(1) || 0}%</span>
              <span className="stat-label">Best Score</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <span className="stat-value">{statistics?.average_score?.toFixed(1) || 0}%</span>
              <span className="stat-label">Average Score</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">{statistics?.has_passed ? '✓' : '✗'}</div>
            <div className="stat-content">
              <span className="stat-value">
                {statistics?.has_passed ? 'Passed' : 'Not Yet'}
              </span>
              <span className="stat-label">Status</span>
            </div>
          </div>
        </div>
      </div>

      {/* Excellence Achievement Banner */}
      {!isRetakeAvailable && (
        <div className="excellence-banner">
          <div className="excellence-icon">🌟</div>
          <div className="excellence-content">
            <h4>Excellent Performance!</h4>
            <p>
              You've achieved an outstanding score of {statistics.best_score.toFixed(1)}%. 
              Quiz retakes are not available for scores of 90% or above.
            </p>
          </div>
        </div>
      )}

      {/* Attempts History */}
      <div className="attempts-section">
        <h3>Attempt History</h3>
        {attempts && attempts.length > 0 ? (
          <div className="attempts-list">
            {attempts.map((attempt, index) => (
              <div 
                key={attempt.id} 
                className={`attempt-card ${attempt.passed ? 'passed' : 'failed'}`}
              >
                <div className="attempt-header">
                  <div className="attempt-number">
                    <span className="attempt-badge">
                      Attempt #{attempts.length - index}
                    </span>
                    <span className={`status-badge ${attempt.passed ? 'passed' : 'failed'}`}>
                      {attempt.passed ? '✓ Passed' : '✗ Failed'}
                    </span>
                  </div>
                  <span className="attempt-date">{attempt.formatted_date}</span>
                </div>

                <div className="attempt-body">
                  <div className="score-display">
                    <div className="score-circle-small">
                      <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="6"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="35"
                          fill="none"
                          stroke={attempt.passed ? '#10b981' : '#ef4444'}
                          strokeWidth="6"
                          strokeDasharray={`${2 * Math.PI * 35}`}
                          strokeDashoffset={`${2 * Math.PI * 35 * (1 - attempt.score / 100)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 40 40)"
                        />
                      </svg>
                      <div className="score-text-small">
                        <span className="score-value-small">{attempt.score}%</span>
                      </div>
                    </div>
                    
                    <div className="attempt-details">
                      <p>
                        <strong>Date:</strong> {new Date(attempt.attempt_date).toLocaleDateString()} 
                        {' at '} 
                        {new Date(attempt.attempt_date).toLocaleTimeString()}
                      </p>
                      <p>
                        <strong>Result:</strong> {attempt.score}% 
                        {attempt.passed 
                          ? ` (${(attempt.score - quiz.passing_score).toFixed(1)}% above passing)` 
                          : ` (${(quiz.passing_score - attempt.score).toFixed(1)}% below passing)`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-attempts">
            <p>No attempts recorded yet.</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="history-actions">
        <button 
          onClick={() => navigate('/student/dashboard')} 
          className="btn-secondary"
        >
          🏠 Back to Dashboard
        </button>
        {isRetakeAvailable ? (
          <button 
            onClick={() => navigate(`/student/quiz/${quizId}/take`)} 
            className="btn-primary"
          >
            📝 Take Quiz Again
          </button>
        ) : (
          <button 
            className="btn-primary btn-disabled"
            disabled
            title="Retakes not available for scores 90% or above"
          >
            📝 Retake Not Available
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentQuizHistory;