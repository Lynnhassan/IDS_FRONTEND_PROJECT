import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function InstructorLessonNew() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    contentType: "Video",
    videoUrl: "",
    estimatedDuration: 10,
    order: 1,
  });
const label = { display: "grid", gap: 6, fontWeight: 500 };

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
    setSuccess("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/instructor/courses/${courseId}/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          estimatedDuration: Number(form.estimatedDuration),
          order: Number(form.order),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to create lesson");

      setSuccess("Lesson added ✅");
      setForm((p) => ({ ...p, title: "", videoUrl: "" }));
    } catch (e2) {
      setError(e2.message);
    }
  };

  return (
    <div style={{ maxWidth: 650 }}>
      <h1>Add Lesson (Course #{courseId})</h1>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
  <label style={label}>

    Lesson Title
    <input
      name="title"
      value={form.title}
      onChange={onChange}
      placeholder="e.g. Introduction to React"
      style={input}
    />
  </label>

<label style={label}>

    Content Type
    <select
      name="contentType"
      value={form.contentType}
      onChange={onChange}
      style={input}
    >
      <option value="Video">Video</option>
      <option value="Article">Article</option>
      <option value="Quiz">Quiz</option>
    </select>
  </label>

<label style={label}>

    Video / Content URL
    <input
      name="videoUrl"
      value={form.videoUrl}
      onChange={onChange}
      placeholder="https://..."
      style={input}
    />
  </label>
<label style={label}>

    Estimated Duration (minutes)
    <input
      name="estimatedDuration"
      type="number"
      value={form.estimatedDuration}
      onChange={onChange}
      placeholder="e.g. 10"
      style={input}
    />
  </label>

  <label style={label}>

    Lesson Order
    <input
      name="order"
      type="number"
      value={form.order}
      onChange={onChange}
      placeholder="1, 2, 3..."
      style={input}
    />
  </label>

  <button type="submit" style={btn}>Add Lesson</button>

  <button
    type="button"
    onClick={() => navigate(`/instructor/courses`, { replace: true })}
    style={{ ...btn, background: "#e5e7eb", color: "#111827" }}
  >
    Back to Courses
  </button>
</form>

    </div>
  );
}

const input = { padding: 12, borderRadius: 10, border: "1px solid #ddd" };
const btn = { padding: 12, borderRadius: 10, border: "none", cursor: "pointer", background: "#111827", color: "#fff" };
