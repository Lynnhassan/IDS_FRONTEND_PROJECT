import React, { useState } from 'react';
import { API_URL } from '../../config';
import './InstructorQuizGenerator.css';
import { useSearchParams, useNavigate } from "react-router-dom";



const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};
const InstructorQuizGenerator = ({ courseId }) => {
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get("quizId"); // ✅ HERE
  const navigate = useNavigate();

  const [step, setStep] = useState('initial');
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setStep('loading');
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}/courses/${courseId}/generate-quiz`,
        { headers: { Accept: 'application/json' } }
      );

      const data = await res.json();

      if (!data.suggestedQuestions) {
        throw new Error('AI could not generate questions.');
      }

      const formatted = data.suggestedQuestions.map((q) => ({
        ...q,
        answers: shuffleArray(q.answers),
      }));

      setQuestions(formatted);
      setQuizTitle(data.suggestedTitle || 'New AI Quiz');
      setStep('review');
    } catch (err) {
      setError(err.message);
      setStep('initial');
    }
  };

  const handleRejectQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, text) => {
    const updated = [...questions];
    updated[index].questionText = text;
    setQuestions(updated);
  };

  const handleSaveQuiz = async () => {
  try {
    const token = localStorage.getItem("token");

    const payload = questions.map(q => ({
      questionText: q.questionText,
      questionType: q.questionType || "single",
      answers: q.answers.map(a => ({
        answerText: a.answerText,
        isCorrect: !!a.isCorrect
      }))
    }));

    const res = await fetch(
      `${API_URL}/instructor/courses/${courseId}/quizzes/${quizId}/questions/bulk`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questions: payload }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message);

    // ✅ GO BACK TO QUESTIONS PAGE
    navigate(`/instructor/courses/${courseId}/quizzes/${quizId}/questions`);
  } catch (err) {
    setError(err.message);
  }
};


// const handleSaveQuiz = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     // Prepare payload: array of questions and answers
//     const payload = questions.map(q => ({
//       questionText: q.questionText,
//       questionType: q.questionType || "single",
//       answers: q.answers.map(a => ({
//         answerText: a.answerText,
//         isCorrect: !!a.isCorrect
//       }))
//     }));

//     // Save all questions to backend
//     const res = await fetch(`${API_URL}/instructor/courses/${courseId}/quizzes/${quizId}/questions/bulk`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ questions: payload }),
//     });

//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error || data.message || "Failed to save AI questions");

//     // ✅ Redirect to quiz questions page
//     navigate(`/instructor/courses/${courseId}/quizzes/${quizId}/questions`);
//   } catch (err) {
//     setError(err.message);
//   }
// };


  /* ================= STATES ================= */

  if (step === 'loading') {
    return (
      <div className="card loader">
        <div className="spinner"></div>
        <h3>Generating your Quiz...</h3>
        <p>AI is reading your PDF.</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="card success">
        <h2>Quiz Published 🎉</h2>
        <p>The quiz is now live for students.</p>
        <button className="btn dark" onClick={() => window.location.reload()}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>AI Quiz Builder</h1>
          <p>Turn course PDFs into quizzes instantly.</p>
        </div>
        <br></br>
        {step === 'initial' && (
          <button className="btn primary" onClick={handleGenerate}>
            Generate Quiz
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {step === 'initial' && (
        <div className="empty">
          <h3>No Quiz Generated</h3>
          <p>Click “Generate Quiz” to let AI suggest questions.</p>
        </div>
      )}

      {step === 'review' && (
        <>
          {/*  */}

          {questions.map((q, i) => (
            <div key={i} className="question-card">
              <div className="question-header">
                <span>QUESTION {i + 1}</span>
                <button
                  className="reject-btn"
                  onClick={() => handleRejectQuestion(i)}
                >
                  Reject Question
                </button>
              </div>

              <div className="question-body">
                <textarea
                  value={q.questionText}
                  onChange={(e) =>
                    handleQuestionChange(i, e.target.value)
                  }
                />

                <div className="answers">
                  {q.answers.map((a, ai) => (
                    <div
                      key={ai}
                      className={`answer ${a.isCorrect ? 'correct' : ''}`}
                    >
                      <span className="dot">
                        {a.isCorrect && '✓'}
                      </span>
                      {a.answerText}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="footer">
            <div>
              <small>Total Questions</small>
              <strong>{questions.length}</strong>
            </div>

            <div>
              <button
                className="btn muted"
                onClick={() => setStep('initial')}
              >
                Discard
              </button>
              <button
                className="btn primary"
                disabled={!questions.length}
                onClick={handleSaveQuiz}
              >
                Publish Quiz
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InstructorQuizGenerator;
