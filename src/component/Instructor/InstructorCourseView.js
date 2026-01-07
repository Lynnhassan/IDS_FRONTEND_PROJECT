import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../config";

export default function InstructorCourseView() {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const res = await fetch(`${API_URL}/instructor/courses/${courseId}`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || "Failed to load course");

        setCourse(data);
      } catch (e) {
        setError(e.message);
      }
    };

    load();
  }, [courseId, token]);

  if (error) return <div style={errorBox}>{error}</div>;
  if (!course) return <p>Loading course...</p>;

  const lessons = Array.isArray(course.lessons) ? course.lessons : [];

  return (
    <div style={page}>
      {/* Header Card */}
      <div style={headerCard}>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={crumb}>Instructor / Courses / View</div>
          <div style={headerTitle}>{course.title}</div>

          <div style={headerMeta}>
            <span style={pill}>{course.category || "Category"}</span>
            <span style={pill}>{course.difficulty || "Easy"}</span>
            <span style={course.isPublished ? pubPill : draftPill}>
              {course.isPublished ? "Published" : "Draft"}
            </span>
          </div>

          <div style={{ color: "#64748b", fontSize: 13, lineHeight: 1.4 }}>
            {course.shortDescription}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Link to={`/instructor/courses/${course.id}/edit`} style={softBtn}>Edit Course</Link>
          <Link to={`/instructor/courses/${course.id}/lessons/new`} style={darkBtn}>+ Add Lesson</Link>
          <Link to={`/instructor/courses`} style={softBtn}>Back</Link>
        </div>
      </div>

      {/* Descriptions */}
      <div style={twoCol}>
        <div style={card}>
          <div style={cardTitle}>Short Description</div>
          <div style={cardText}>{course.shortDescription || "-"}</div>
        </div>

        <div style={card}>
          <div style={cardTitle}>Long Description</div>
          <div style={cardText}>{course.longDescription || "-"}</div>
        </div>
      </div>

      {/* Lessons */}
      <div style={card}>
        <div style={lessonsTop}>
          <div>
            <div style={cardTitle}>Lessons</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>
              {lessons.length} lesson{lessons.length === 1 ? "" : "s"}
            </div>
          </div>
          <Link to={`/instructor/courses/${course.id}/lessons/new`} style={primaryBtnSmall}>
            + Add Lesson
          </Link>
        </div>

        {lessons.length === 0 ? (
          <div style={empty}>
            <div style={{ fontWeight: 900 }}>No lessons yet</div>
            <div style={{ color: "#64748b", marginTop: 6 }}>
              Click “Add Lesson” to start building your course.
            </div>
          </div>
        ) : (
          <div style={lessonGrid}>
            {lessons
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((lesson) => (
                <div key={lesson.id} style={lessonCard}>
                  <div style={lessonHead}>
                    <div style={lessonOrder}>{lesson.order ?? "-"}</div>
                    <div style={{ display: "grid", gap: 4 }}>
                      <div style={lessonTitle}>{lesson.title}</div>
                      <div style={lessonMeta}>
                        <span style={miniPill}>{lesson.contentType}</span>
                        <span style={miniPill}>{lesson.estimatedDuration} min</span>
                      </div>
                    </div>
                  </div>

                  {lesson.videoUrl ? (
                    <a href={lesson.videoUrl} target="_blank" rel="noreferrer" style={openLink}>
                      Open Content ▶
                    </a>
                  ) : (
                    <div style={{ color: "#94a3b8", fontSize: 13 }}>No content URL</div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* styles */
const page = { display: "grid", gap: 16 };
const crumb = { fontSize: 13, color: "#64748b" };
const headerCard = {
  background: "#fff",
  borderRadius: 18,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
  padding: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  flexWrap: "wrap",
};
const headerTitle = { fontSize: 22, fontWeight: 950, color: "#0f172a" };
const headerMeta = { display: "flex", gap: 8, flexWrap: "wrap" };

const twoCol = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 };

const card = {
  background: "#fff",
  borderRadius: 18,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
  padding: 16,
};

const cardTitle = { fontWeight: 950, color: "#0f172a" };
const cardText = { marginTop: 8, color: "#334155", lineHeight: 1.5 };

const lessonsTop = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" };

const lessonGrid = { display: "grid", gap: 12, marginTop: 14, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" };

const lessonCard = {
  borderRadius: 16,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "linear-gradient(180deg, #ffffff, #fbfdff)",
  padding: 14,
  display: "grid",
  gap: 10,
};

const lessonHead = { display: "flex", gap: 12, alignItems: "flex-start" };
const lessonOrder = {
  width: 34,
  height: 34,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  fontWeight: 950,
  color: "#fff",
  background: "linear-gradient(135deg,#2d8cff,#1b64ff)",
  boxShadow: "0 12px 24px rgba(45,140,255,0.25)",
};
const lessonTitle = { fontWeight: 950, color: "#0f172a" };
const lessonMeta = { display: "flex", gap: 8, flexWrap: "wrap" };

const pill = {
  fontSize: 12,
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(15,23,42,0.04)",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#0f172a",
  fontWeight: 800,
};
const miniPill = { ...pill, padding: "5px 9px", fontSize: 11 };

const pubPill = { ...pill, color: "#065f46", background: "rgba(16,185,129,0.18)" };
const draftPill = { ...pill, color: "#92400e", background: "rgba(245,158,11,0.18)" };

const openLink = {
  textDecoration: "none",
  fontWeight: 900,
  color: "#1b64ff",
  padding: "10px 12px",
  borderRadius: 12,
  background: "rgba(45,140,255,0.10)",
  border: "1px solid rgba(45,140,255,0.18)",
  display: "inline-block",
  width: "fit-content",
};

const primaryBtnSmall = {
  padding: "10px 12px",
  borderRadius: 12,
  background: "linear-gradient(135deg,#2d8cff,#1b64ff)",
  color: "#fff",
  textDecoration: "none",
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

const darkBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  background: "#111827",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 950,
};

const errorBox = {
  padding: 12,
  borderRadius: 14,
  background: "rgba(244,63,94,0.08)",
  border: "1px solid rgba(244,63,94,0.25)",
  color: "#be123c",
  fontWeight: 800,
};

const empty = { marginTop: 12, padding: 14, borderRadius: 14, background: "rgba(15,23,42,0.03)", border: "1px dashed rgba(15,23,42,0.15)" };
