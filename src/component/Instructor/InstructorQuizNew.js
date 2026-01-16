import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_URL } from "../../config";

export default function InstructorQuizNew() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    passingScore: 60,
    timeLimit: 10,
    maxAttempts: 3,
  });
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/instructor/courses/${courseId}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          passingScore: Number(form.passingScore),
          timeLimit: Number(form.timeLimit),
          maxAttempts: Number(form.maxAttempts),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to create quiz");

      const created = data.data || data;

      // After creating quiz -> go add questions
      navigate(`/instructor/courses/${courseId}/quizzes/${created.id}/questions`, { replace: true });
    } catch (e2) {
      setError(e2.message);
    }
  };

  return (
    <div style={{ maxWidth: 650, display: "grid", gap: 14 }}>
      <div style={head}>
        <div>
          <div style={crumb}>Instructor / Courses / Quizzes / New</div>
          <h1 style={h1}>Create Quiz</h1>
        </div>
        <Link to={`/instructor/courses/${courseId}/view`} style={softBtn}>
          Back
        </Link>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      <div style={card}>
        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <div style={field}>
            <div style={label}>Quiz Title</div>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Example: Final Exam"
              style={input}
              required
            />
          </div>

          <div style={twoCol}>
            <div style={field}>
              <div style={label}>Passing Score (%)</div>
              <input
                name="passingScore"
                type="number"
                min="0"
                max="100"
                value={form.passingScore}
                onChange={onChange}
                style={input}
              />
            </div>

            <div style={field}>
              <div style={label}>Time Limit (minutes)</div>
              <input
                name="timeLimit"
                type="number"
                min="1"
                value={form.timeLimit}
                onChange={onChange}
                style={input}
              />
            </div>
          </div>

          <div style={field}>
            <div style={label}>Max Attempts</div>
            <input
              name="maxAttempts"
              type="number"
              min="1"
              value={form.maxAttempts}
              onChange={onChange}
              style={input}
            />
          </div>

          <button style={primaryBtn} type="submit">
            Create Quiz → Add Questions
          </button>
        </form>
      </div>
    </div>
  );
}

/* styles */
const head = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 };
const crumb = { fontSize: 13, color: "#64748b" };
const h1 = { margin: 0, fontSize: 22, fontWeight: 950, color: "#0f172a" };

const card = {
  background: "#fff",
  borderRadius: 18,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
  padding: 16,
};

const field = { display: "grid", gap: 6 };
const label = { fontSize: 12, fontWeight: 900, color: "#0f172a" };

const twoCol = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };

const input = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(15,23,42,0.12)",
  outline: "none",
  background: "#fff",
};

const primaryBtn = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(135deg,#2d8cff,#1b64ff)",
  color: "#fff",
  fontWeight: 950,
};

const softBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  background: "#f1f5f9",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: 850,
};

const errorBox = {
  padding: 12,
  borderRadius: 14,
  background: "rgba(244,63,94,0.08)",
  border: "1px solid rgba(244,63,94,0.25)",
  color: "#be123c",
  fontWeight: 800,
};
