import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../config";

export default function InstructorQuizView() {
  const { courseId, quizId } = useParams();
  const token = localStorage.getItem("token");

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const res = await fetch(
          `${API_URL}/instructor/courses/${courseId}/quizzes/${quizId}/questions`,
          { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || "Failed to load quiz");

        setQuiz(data.quiz);
        setQuestions(Array.isArray(data.questions) ? data.questions : []);
      } catch (e) {
        setError(e.message);
      }
    };
    load();
  }, [courseId, quizId, token]);

  if (error) return <div style={errBox}>{error}</div>;
  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 900 }}>
      <div style={card}>
        <div style={{ fontSize: 13, color: "#64748b" }}>
          Instructor / Course / Quiz
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950 }}>{quiz.title}</h1>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <span style={pill}>Passing: {quiz.passingScore}%</span>
          <span style={pill}>Time: {quiz.timeLimit} min</span>
          <span style={pill}>Attempts: {quiz.maxAttempts}</span>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <Link to={`/instructor/courses/${courseId}/view`} style={btnSoft}>Back</Link>
          <Link to={`/instructor/courses/${courseId}/quizzes/${quizId}/questions`} style={btnDark}>
            + Add Questions
          </Link>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontWeight: 950 }}>Questions ({questions.length})</div>

        {questions.length === 0 ? (
          <div style={empty}>No questions yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {questions.map((q) => (
              <div key={q.id} style={qCard}>
                <div style={{ fontWeight: 950 }}>{q.questionText}</div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  Type: {q.questionType}
                </div>

                <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
                  {(q.answers || []).map((a) => (
                    <div key={a.id} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div>{a.answerText}</div>
                      <div style={{ fontWeight: 900, color: a.isCorrect ? "#166534" : "#94a3b8" }}>
                        {a.isCorrect ? "✅" : ""}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const card = { background: "#fff", borderRadius: 18, border: "1px solid rgba(15,23,42,0.08)", boxShadow: "0 18px 40px rgba(15,23,42,0.06)", padding: 16 };
const pill = { fontSize: 12, padding: "6px 10px", borderRadius: 999, background: "rgba(15,23,42,0.04)", border: "1px solid rgba(15,23,42,0.08)", fontWeight: 800 };
const btnSoft = { padding: "10px 12px", borderRadius: 12, background: "#f1f5f9", border: "1px solid rgba(15,23,42,0.08)", color: "#0f172a", textDecoration: "none", fontWeight: 850 };
const btnDark = { padding: "10px 12px", borderRadius: 12, background: "#111827", color: "#fff", textDecoration: "none", fontWeight: 950 };
const empty = { marginTop: 12, padding: 14, borderRadius: 14, background: "rgba(15,23,42,0.03)", border: "1px dashed rgba(15,23,42,0.15)" };
const qCard = { padding: 14, borderRadius: 16, border: "1px solid rgba(15,23,42,0.08)", background: "linear-gradient(180deg,#fff,#fbfdff)" };
const errBox = { padding: 12, borderRadius: 14, background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)", color: "#be123c", fontWeight: 800 };
