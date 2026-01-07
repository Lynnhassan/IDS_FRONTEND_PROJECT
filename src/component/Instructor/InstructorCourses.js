import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../config";

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/instructor/courses`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to load courses");

      setCourses(Array.isArray(data) ? data : data.data || []);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const thumbSrc = (course) => {
    // If you store full URL, use it. Otherwise adjust base URL for Laravel storage.
    if (!course.thumbnail) return null;
    if (String(course.thumbnail).startsWith("http")) return course.thumbnail;
    return `http://127.0.0.1:8000/storage/${course.thumbnail}`; // change if your backend path differs
  };

  return (
    <div style={page}>
      <div style={topRow}>
        <div>
          <div style={crumb}>Instructor / Courses</div>
          <h1 style={h1}>My Courses</h1>
        </div>

        <Link to="/instructor/courses/new" style={primaryBtn}>
          + Create Course
        </Link>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      {courses.length === 0 ? (
        <div style={emptyBox}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>No courses yet</div>
          <div style={{ opacity: 0.7, marginTop: 6 }}>
            Create your first course and start adding lessons.
          </div>
          <Link to="/instructor/courses/new" style={{ ...primaryBtn, display: "inline-block", marginTop: 14 }}>
            Create Course
          </Link>
        </div>
      ) : (
        <div style={grid}>
          {courses.map((course) => (
            <div key={course.id} style={card}>
              <div style={thumbWrap}>
                {thumbSrc(course) ? (
                  <img
                    src={thumbSrc(course)}
                    alt={course.title}
                    style={thumbImg}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <div style={thumbFallback}>📚</div>
                )}

                <div style={badge(course.isPublished ? "published" : "draft")}>
                  {course.isPublished ? "Published" : "Draft"}
                </div>
              </div>

              <div style={cardBody}>
                <div style={titleRow}>
                  <div style={cardTitle}>{course.title}</div>
                </div>

                

                <div style={cardDesc}>{course.shortDescription}</div>

                <div style={metaRow}>
                  <span style={pill}>{course.category || "Category"}</span>
                  <span style={pill}>{course.difficulty || "Easy"}</span>
                </div>

                <div style={actions}>
                  <Link to={`/instructor/courses/${course.id}/view`} style={softBtn}>
                    View
                  </Link>
                  <Link to={`/instructor/courses/${course.id}/edit`} style={softBtn}>
                    Edit
                  </Link>
                  <Link to={`/instructor/courses/${course.id}/lessons/new`} style={darkBtn}>
                    + Add Lessons
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* styles */
const page = { display: "grid", gap: 16 };
const topRow = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 };
const crumb = { fontSize: 13, color: "#64748b" };
const h1 = { margin: 0, fontSize: 22, fontWeight: 900, color: "#0f172a" };

const grid = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
};

const card = {
  background: "#fff",
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
  display: "flex",
  flexDirection: "column",
};

const thumbWrap = { position: "relative", height: 160, background: "linear-gradient(135deg,#e2e8f0,#f8fafc)" };
const thumbImg = { width: "100%", height: "100%", objectFit: "cover", display: "block" };
const thumbFallback = { height: "100%", display: "grid", placeItems: "center", fontSize: 46, color: "#334155" };

const badge = (type) => ({
  position: "absolute",
  top: 12,
  left: 12,
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  color: type === "published" ? "#065f46" : "#92400e",
  background: type === "published" ? "rgba(16,185,129,0.18)" : "rgba(245,158,11,0.18)",
  border: "1px solid rgba(15,23,42,0.10)",
});

const cardBody = { padding: 14, display: "grid", gap: 10 };
const titleRow = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 };
const cardTitle = { fontSize: 16, fontWeight: 900, color: "#0f172a", lineHeight: 1.2 };
const cardDesc = { fontSize: 13, color: "#64748b", lineHeight: 1.35, minHeight: 34 };

const metaRow = { display: "flex", gap: 8, flexWrap: "wrap" };
const pill = {
  fontSize: 12,
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(15,23,42,0.04)",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#0f172a",
  fontWeight: 700,
};

const actions = { display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" };

const primaryBtn = {
  padding: "10px 14px",
  borderRadius: 12,
  background: "linear-gradient(135deg,#2d8cff,#1b64ff)",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 900,
  boxShadow: "0 12px 24px rgba(45,140,255,0.25)",
};

const softBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  background: "#f1f5f9",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: 800,
};

const darkBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  background: "#111827",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 900,
};

const errorBox = {
  padding: 12,
  borderRadius: 14,
  background: "rgba(244,63,94,0.08)",
  border: "1px solid rgba(244,63,94,0.25)",
  color: "#be123c",
  fontWeight: 700,
};

const emptyBox = {
  padding: 18,
  borderRadius: 18,
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
};
