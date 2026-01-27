import React, { useEffect, useMemo, useState } from "react";
import { API_URL } from "../../config";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/courses`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to load courses");
      setCourses(data.data || []);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = String(query).toLowerCase().trim();
    if (!q) return courses;
    return courses.filter((c) => {
      const hay = `${c.title ?? ""} ${c.category ?? ""} ${c.difficulty ?? ""} ${c.instructor?.fullName ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [courses, query]);

  const updateCourse = async (id, patch) => {
    setSavingId(id);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/courses/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to update course");

      setCourses((prev) => prev.map((c) => (c.id === id ? data.data : c)));
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <div className="md2-topbar">
        <div className="md2-breadcrumbs">
          <span className="muted">/</span> Admin
          <div className="md2-title">Courses</div>
        </div>

        <div className="md2-search">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses..." />
        </div>
      </div>

      {error && (
        <div style={{ padding: 12, borderRadius: 12, background: "#ffe4e6", color: "#9f1239", fontWeight: 800 }}>
          {error}
        </div>
      )}

      <div className="md2-admin-table-card">
        <div className="md2-admin-table-title">All Courses</div>

        {filtered.length === 0 ? (
          <div className="md2-admin-empty">No courses found.</div>
        ) : (
          <table className="md2-admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const busy = savingId === c.id;
                return (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 900 }}>{c.title}</td>
                    <td>{c.instructor?.fullName || "-"}</td>
                    <td>{c.category || "-"}</td>
                    <td>{c.difficulty || "-"}</td>
                    <td style={{ fontWeight: 900, color: c.isPublished ? "#065f46" : "#92400e" }}>
                      {c.isPublished ? "Published" : "Draft"}
                    </td>
                    <td>
                      <button
                        onClick={() => updateCourse(c.id, { isPublished: !c.isPublished })}
                        disabled={busy}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 10,
                          border: "1px solid rgba(15,23,42,0.10)",
                          cursor: "pointer",
                          fontWeight: 900,
                        }}
                      >
                        {busy ? "Saving..." : c.isPublished ? "Unpublish" : "Publish"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
