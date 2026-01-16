import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../config";

export default function InstructorQuizQuestions() {
  const { courseId, quizId } = useParams();
  const token = localStorage.getItem("token");

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    questionText: "",
    questionType: "single",
    answers: [
      { answerText: "", isCorrect: true },
      { answerText: "", isCorrect: false },
      { answerText: "", isCorrect: false },
      { answerText: "", isCorrect: false },
    ],
  });

  const load = async () => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/instructor/courses/${courseId}/quizzes/${quizId}/questions`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to load questions");

      setQuiz(data.quiz);
      setQuestions(Array.isArray(data.questions) ? data.questions : []);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { load(); }, [courseId, quizId]);

  const setAnswer = (idx, patch) => {
    setForm((p) => {
      const next = [...p.answers];
      next[idx] = { ...next[idx], ...patch };

      // if single: only one correct
      if (p.questionType === "single" && patch.isCorrect === true) {
        for (let i = 0; i < next.length; i++) {
          if (i !== idx) next[i].isCorrect = false;
        }
      }

      return { ...p, answers: next };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        questionText: form.questionText,
        questionType: form.questionType,
        answers: form.answers.filter(a => a.answerText.trim().length > 0),
      };

      const res = await fetch(`${API_URL}/instructor/courses/${courseId}/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to create question");

      setQuestions((prev) => [data, ...prev]);
      setForm({
        questionText: "",
        questionType: "single",
        answers: [
          { answerText: "", isCorrect: true },
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
        ],
      });
    } catch (e2) {
      setError(e2.message);
    }
  };

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 13, color: "#64748b" }}>Instructor / Courses / Quiz / Questions</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: "#0f172a" }}>
            {quiz ? quiz.title : "Quiz"}
          </h1>
        </div>

        <Link to={`/instructor/courses/${courseId}/view`} style={btnSoft}>Back to Course</Link>
      </div>

      {error && <div style={errBox}>{error}</div>}

      {/* Create Question */}
      <div style={card}>
        <div style={{ fontWeight: 950, color: "#0f172a" }}>Add Question</div>

        <form onSubmit={submit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
          <div style={field}>
            <div style={label}>Question text</div>
            <input
              value={form.questionText}
              onChange={(e) => setForm((p) => ({ ...p, questionText: e.target.value }))}
              style={input}
              placeholder="Example: What is React?"
              required
            />
          </div>

          <div style={field}>
            <div style={label}>Question type</div>
            <select
              value={form.questionType}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  questionType: e.target.value,
                  // reset correct flags for single
                  answers: p.answers.map((a, idx) => ({ ...a, isCorrect: e.target.value === "single" ? idx === 0 : a.isCorrect })),
                }))
              }
              style={input}
            >
              <option value="single">Single choice (only 1 correct)</option>
              <option value="multiple">Multiple choice (many correct)</option>
            </select>
          </div>

          <div style={field}>
            <div style={label}>Answers (mark correct)</div>

            <div style={{ display: "grid", gap: 10 }}>
              {form.answers.map((a, idx) => (
                <div key={idx} style={ansRow}>
                  <input
                    value={a.answerText}
                    onChange={(e) => setAnswer(idx, { answerText: e.target.value })}
                    placeholder={`Answer ${idx + 1}`}
                    style={{ ...input, flex: 1 }}
                  />

                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 12 }}>
                    <input
                      type={form.questionType === "single" ? "radio" : "checkbox"}
                      checked={!!a.isCorrect}
                      onChange={(e) => setAnswer(idx, { isCorrect: e.target.checked })}
                    />
                    Correct
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" style={btnPrimary}>+ Save Question</button>
        </form>
      </div>

      {/* Existing Questions */}
      <div style={card}>
        <div style={{ fontWeight: 950, color: "#0f172a" }}>
          Questions ({questions.length})
        </div>

        {questions.length === 0 ? (
          <div style={{ marginTop: 12, padding: 14, borderRadius: 14, background: "rgba(15,23,42,0.03)", border: "1px dashed rgba(15,23,42,0.15)" }}>
            No questions yet.
          </div>
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
                    <div key={a.id} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div>{a.answerText}</div>
                      <div style={{ fontWeight: 900, color: a.isCorrect ? "#166534" : "#94a3b8" }}>
                        {a.isCorrect ? "✅ Correct" : ""}
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

/* styles */
const card = { background: "#fff", borderRadius: 18, border: "1px solid rgba(15,23,42,0.08)", boxShadow: "0 18px 40px rgba(15,23,42,0.06)", padding: 16 };
const input = { padding: 12, borderRadius: 12, border: "1px solid rgba(15,23,42,0.12)", outline: "none", background: "#fff" };
const label = { fontSize: 12, fontWeight: 900, color: "#0f172a" };
const field = { display: "grid", gap: 6 };
const ansRow = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" };
const btnPrimary = { padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#2d8cff,#1b64ff)", color: "#fff", fontWeight: 950 };
const btnSoft = { padding: "10px 12px", borderRadius: 12, background: "#f1f5f9", border: "1px solid rgba(15,23,42,0.08)", color: "#0f172a", textDecoration: "none", fontWeight: 850 };
const errBox = { padding: 12, borderRadius: 14, background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)", color: "#be123c", fontWeight: 800 };
const qCard = { padding: 14, borderRadius: 16, border: "1px solid rgba(15,23,42,0.08)", background: "linear-gradient(180deg,#fff,#fbfdff)" };
