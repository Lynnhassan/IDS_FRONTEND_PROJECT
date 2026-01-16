import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../config";

export default function InstructorCourseView() {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");

  // ✅ Filter/search state (lessons + quizzes)
  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const res = await fetch(`${API_URL}/instructor/courses/${courseId}`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || "Failed to load course");
        setCourse(data.data || data);

        const qres = await fetch(`${API_URL}/instructor/courses/${courseId}/quizzes`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        const qdata = await qres.json();
        if (qres.ok) setQuizzes(Array.isArray(qdata) ? qdata : qdata.data || []);
      } catch (e) {
        setError(e.message);
      }
    };
    load();
  }, [courseId, token]);

  const lessons = useMemo(
    () => (course?.lessons && Array.isArray(course.lessons) ? course.lessons : []),
    [course]
  );

  // ✅ PDF url (if pdf exists)
  const pdfUrl = useMemo(() => {
    const pdf = course?.pdf;
    if (!pdf) return null;
    if (String(pdf).startsWith("http")) return pdf; // in case you store full URL
    return `http://127.0.0.1:8000/storage/${pdf}`;  // adjust if needed
  }, [course]);

  // ✅ Search helpers
  const norm = (v) => String(v ?? "").toLowerCase().trim();

  const filteredLessons = useMemo(() => {
    if (!query) return lessons;
    const q = norm(query);
    return lessons.filter((l) =>
      [l.title, l.contentType, l.estimatedDuration, l.order].some((x) => norm(x).includes(q))
    );
  }, [lessons, query]);

  const filteredQuizzes = useMemo(() => {
    if (!query) return quizzes;
    const q = norm(query);
    return quizzes.filter((quiz) =>
      [quiz.title, quiz.passingScore, quiz.timeLimit, quiz.maxAttempts].some((x) => norm(x).includes(q))
    );
  }, [quizzes, query]);

  if (error) return <div style={errorBox}>{error}</div>;
  if (!course) return <p>Loading course...</p>;

  return (
    <div style={page}>
      {/* Header */}
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

          {/* ✅ PDF display */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {pdfUrl ? (
              <>
                <a href={pdfUrl} target="_blank" rel="noreferrer" style={pdfBtn}>
                  View Course PDF 📄
                </a>
                <a href={pdfUrl} download style={pdfSoftBtn}>
                  Download
                </a>
              </>
            ) : (
              <div style={muted}>No PDF attached</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Link to={`/instructor/courses/${course.id}/edit`} style={softBtn}>
            Edit Course
          </Link>
          <Link to={`/instructor/courses/${course.id}/lessons/new`} style={darkBtn}>
            + Add Lesson
          </Link>
          <Link to={`/instructor/courses`} style={softBtn}>
            Back
          </Link>
        </div>
      </div>

      {/* ✅ Filter Bar */}
      <div style={filterCard}>
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontWeight: 950, color: "#0f172a" }}>Search</div>
          <div style={muted}>Filter lessons and quizzes by keyword</div>
        </div>

        <div style={filterRight}>
          <div style={searchWrap}>
            <span style={searchIcon}>🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lessons, quizzes..."
              style={searchInput}
            />
            {query ? (
              <button onClick={() => setQuery("")} style={clearBtn} title="Clear">
                ✕
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div style={card}>
        <div style={topRow}>
          <div>
            <div style={cardTitle}>Lessons</div>
            <div style={muted}>
              {filteredLessons.length} lesson{filteredLessons.length === 1 ? "" : "s"}
              {query ? <span style={{ marginLeft: 8 }}>• filtered</span> : null}
            </div>
          </div>
          <Link to={`/instructor/courses/${course.id}/lessons/new`} style={primaryBtnSmall}>
            + Add Lesson
          </Link>
        </div>

        {filteredLessons.length === 0 ? (
          <div style={empty}>{query ? "No results for your search." : "No lessons yet."}</div>
        ) : (
          <div style={grid2}>
            {filteredLessons
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((l) => (
                <div key={l.id} style={lessonCard}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={lessonOrder}>{l.order ?? "-"}</div>
                    <div style={{ display: "grid", gap: 4 }}>
                      <div style={{ fontWeight: 950 }}>{l.title}</div>
                      <div style={muted}>
                        {l.contentType} • {l.estimatedDuration} min
                      </div>
                    </div>
                  </div>

                  {l.videoUrl ? (
                    <a href={l.videoUrl} target="_blank" rel="noreferrer" style={openLink}>
                      Open ▶
                    </a>
                  ) : (
                    <div style={muted}>No URL</div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Quizzes */}
      <div style={card}>
        <div style={topRow}>
          <div>
            <div style={cardTitle}>Quizzes</div>
            <div style={muted}>
              {filteredQuizzes.length} quiz{filteredQuizzes.length === 1 ? "" : "zes"}
              {query ? <span style={{ marginLeft: 8 }}>• filtered</span> : null}
            </div>
          </div>

          <Link to={`/instructor/courses/${course.id}/quizzes/new`} style={primaryBtnSmall}>
            + Create Quiz
          </Link>
        </div>

        {filteredQuizzes.length === 0 ? (
          <div style={empty}>{query ? "No results for your search." : "No quizzes yet."}</div>
        ) : (
          <div style={grid2}>
            {filteredQuizzes.map((q) => (
              <div key={q.id} style={lessonCard}>
                <div style={{ fontWeight: 950 }}>{q.title}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={miniPill}>Passing: {q.passingScore}%</span>
                  <span style={miniPill}>Time: {q.timeLimit} min</span>
                  <span style={miniPill}>Attempts: {q.maxAttempts}</span>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link to={`/instructor/courses/${courseId}/quizzes/${q.id}/view`} style={softBtn}>
                    Open Quiz
                  </Link>
                  <Link to={`/instructor/courses/${courseId}/quizzes/${q.id}/questions`} style={darkBtn}>
                    + Add Questions
                  </Link>
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

const card = {
  background: "#fff",
  borderRadius: 18,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
  padding: 16,
};
const cardTitle = { fontWeight: 950, color: "#0f172a" };
const muted = { color: "#64748b", fontSize: 13 };

const topRow = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" };
const grid2 = { display: "grid", gap: 12, marginTop: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" };

const lessonCard = { borderRadius: 16, border: "1px solid rgba(15,23,42,0.08)", background: "linear-gradient(180deg,#fff,#fbfdff)", padding: 14, display: "grid", gap: 10 };
const lessonOrder = { width: 34, height: 34, borderRadius: 12, display: "grid", placeItems: "center", fontWeight: 950, color: "#fff", background: "linear-gradient(135deg,#2d8cff,#1b64ff)", boxShadow: "0 12px 24px rgba(45,140,255,0.25)" };

const pill = { fontSize: 12, padding: "6px 10px", borderRadius: 999, background: "rgba(15,23,42,0.04)", border: "1px solid rgba(15,23,42,0.08)", color: "#0f172a", fontWeight: 800 };
const miniPill = { ...pill, padding: "5px 9px", fontSize: 11 };
const pubPill = { ...pill, color: "#065f46", background: "rgba(16,185,129,0.18)" };
const draftPill = { ...pill, color: "#92400e", background: "rgba(245,158,11,0.18)" };

const primaryBtnSmall = { padding: "10px 12px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#2d8cff,#1b64ff)", color: "#fff", textDecoration: "none", fontWeight: 950 };
const softBtn = { padding: "10px 12px", borderRadius: 12, background: "#f1f5f9", border: "1px solid rgba(15,23,42,0.08)", color: "#0f172a", textDecoration: "none", fontWeight: 850 };
const darkBtn = { padding: "10px 12px", borderRadius: 12, background: "#111827", color: "#fff", textDecoration: "none", fontWeight: 950 };

const openLink = { textDecoration: "none", fontWeight: 900, color: "#1b64ff", padding: "10px 12px", borderRadius: 12, background: "rgba(45,140,255,0.10)", border: "1px solid rgba(45,140,255,0.18)", display: "inline-block", width: "fit-content" };

const errorBox = { padding: 12, borderRadius: 14, background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)", color: "#be123c", fontWeight: 800 };
const empty = { marginTop: 12, padding: 14, borderRadius: 14, background: "rgba(15,23,42,0.03)", border: "1px dashed rgba(15,23,42,0.15)" };

// ✅ PDF buttons
const pdfBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  background: "rgba(45,140,255,0.10)",
  border: "1px solid rgba(45,140,255,0.22)",
  color: "#1b64ff",
  textDecoration: "none",
  fontWeight: 950,
  width: "fit-content",
};

const pdfSoftBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  background: "#f1f5f9",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: 850,
  width: "fit-content",
};

// ✅ Filter bar styles
const filterCard = {
  background: "#fff",
  borderRadius: 18,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.05)",
  padding: 14,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const filterRight = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" };

const searchWrap = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "#f8fafc",
  border: "1px solid rgba(15,23,42,0.10)",
  borderRadius: 14,
  padding: "10px 12px",
  minWidth: 320,
};

const searchIcon = { opacity: 0.7 };

const searchInput = {
  border: "none",
  outline: "none",
  background: "transparent",
  width: "100%",
  fontWeight: 700,
  color: "#0f172a",
};

const clearBtn = {
  border: "none",
  cursor: "pointer",
  background: "rgba(15,23,42,0.06)",
  borderRadius: 10,
  padding: "6px 10px",
  fontWeight: 900,
};
