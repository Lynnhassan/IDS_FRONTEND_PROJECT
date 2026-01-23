import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentQuiz from './StudentQuiz';
import StudentQuizResult from './StudentQuizResult';

const StudentQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const handleQuizComplete = (result) => {
    console.log('Quiz completed:', result);
    setQuizResult(result);
    setShowResult(true);
  };

  const handleRetake = () => {
    window.location.reload();
  };

  const handleViewHistory = () => {
    navigate(`/student/quiz/${quizId}/history`); 
  };

  // const handleBackToDashboard = () => {
  //   navigate('/student/dashboard');
  // };

  return (
    <div className="quiz-page">
      {!showResult ? (
        <>
          {/* <button 
            onClick={handleBackToDashboard} 
            style={{
              // position: 'fixed',
              // top: '20px',
              // left: '20px',
              // padding: '10px 20px',
              // background: '#fff',
              // border: '2px solid #e2e8f0',
              // borderRadius: '12px',
              // cursor: 'pointer',
              // fontWeight: '600',
                 padding: '10px 20px',
    background: '#fff',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
              zIndex: 100,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}

          >
            ← Back to Dashboard
          </button> */}
          <StudentQuiz quizId={quizId} onComplete={handleQuizComplete} />
        </>
      ) : (
        <StudentQuizResult 
          result={quizResult} 
          onRetake={handleRetake}
          onViewHistory={handleViewHistory}
        />
      )}
    </div>
  );
};

export default StudentQuizPage;
