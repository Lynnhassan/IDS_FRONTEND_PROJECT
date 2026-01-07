import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";

export default function InstructorCourseEdit() {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      setError("");
      try {
        const res = await fetch(`${API_URL}/instructor/courses/${courseId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || data.message || "Failed to load course");

        setForm({
          title: data.title || "",
          shortDescription: data.shortDescription || "",
          longDescription: data.longDescription || "",
          category: data.category || "",
          difficulty: data.difficulty || "Easy",
          thumbnail: data.thumbnail || "",
          isPublished: !!data.isPublished,
        });
      } catch (e) {
        setError(e.message);
      }
    };

    loadCourse();
  }, [courseId, token]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/instructor/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || data.message || "Failed to update course");

      alert("Course updated ✅");
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <p>Loading course...</p>;

  return (
    <div style={{ maxWidth: 650 }}>
      <h1>Edit Course</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={save} style={{ display: "grid", gap: 10 }}>
        <input name="title" value={form.title} onChange={onChange} placeholder="Title" style={input} />
        <input name="shortDescription" value={form.shortDescription} onChange={onChange} placeholder="Short Description" style={input} />
        <input name="longDescription" value={form.longDescription} onChange={onChange} placeholder="Long Description" style={input} />
        <input name="category" value={form.category} onChange={onChange} placeholder="Category" style={input} />

        <select name="difficulty" value={form.difficulty} onChange={onChange} style={input}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <input name="thumbnail" value={form.thumbnail} onChange={onChange} placeholder="Thumbnail URL (optional)" style={input} />

        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={onChange} />
          Publish this course
        </label>

        <button type="submit" disabled={saving} style={btn}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

const input = { padding: 12, borderRadius: 10, border: "1px solid #ddd" };
const btn = { padding: 12, borderRadius: 10, border: "none", cursor: "pointer" };
