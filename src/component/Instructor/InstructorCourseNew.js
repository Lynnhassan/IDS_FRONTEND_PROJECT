import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function InstructorCourseNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    category: "",
    difficulty: "Easy",
    thumbnail: "",
  });

  // ✅ added: pdf file state
  const [pdfFile, setPdfFile] = useState(null);

  const [error, setError] = useState("");

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      // ✅ If PDF is attached -> send multipart/form-data
      const hasPdf = !!pdfFile;

      const body = hasPdf ? new FormData() : null;

      if (hasPdf) {
        Object.entries(form).forEach(([k, v]) => body.append(k, v ?? ""));
        body.append("pdf", pdfFile); // ✅ field name "pdf" (change to what your backend expects)
      }

      const res = await fetch(`${API_URL}/instructor/courses`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          ...(hasPdf ? {} : { "Content-Type": "application/json" }),
        },
        body: hasPdf ? body : JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to create course");

      const courseId = data.id || data.data?.id;
      navigate(`/instructor/courses/${courseId}/view`, { replace: true });
    } catch (e2) {
      setError(e2.message);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={head}>
        <div>
          <div style={crumb}>Instructor / Courses / New</div>
          <h1 style={h1}>Create Course</h1>
        </div>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      <div style={card}>
        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <input name="title" value={form.title} onChange={onChange} placeholder="Title" style={input} />

          <input
            name="shortDescription"
            value={form.shortDescription}
            onChange={onChange}
            placeholder="Short Description"
            style={input}
          />
          <input
            name="longDescription"
            value={form.longDescription}
            onChange={onChange}
            placeholder="Long Description"
            style={input}
          />
          <input name="category" value={form.category} onChange={onChange} placeholder="Category" style={input} />

          <select name="difficulty" value={form.difficulty} onChange={onChange} style={input}>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <input
            name="thumbnail"
            type="url"
            value={form.thumbnail}
            onChange={onChange}
            placeholder="Thumbnail URL (optional)"
            style={input}
          />

          {/* ✅ added: PDF upload */}
          <div style={fileBox}>
            <div style={{ display: "grid", gap: 4 }}>
              <div style={{ fontWeight: 950, color: "#0f172a" }}>Course PDF (optional)</div>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800 }}>
                Upload a PDF file to attach to this course.
              </div>
            </div>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              style={fileInput}
            />

            {pdfFile ? (
              <div style={fileMeta}>
                <span style={{ fontWeight: 900 }}>{pdfFile.name}</span>
                <span style={{ color: "#64748b", fontSize: 12 }}>
                  ({Math.ceil(pdfFile.size / 1024)} KB)
                </span>
                <button type="button" onClick={() => setPdfFile(null)} style={removeFileBtn}>
                  Remove
                </button>
              </div>
            ) : null}
          </div>

          {/* Optional preview - only here, not between inputs randomly */}
          {form.thumbnail && (
            <div style={previewBox}>
              <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800 }}>Preview</div>
              <img
                src={form.thumbnail}
                alt="Thumbnail preview"
                style={previewImg}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}

          <button type="submit" style={primaryBtn}>
            Create & View Course
          </button>
        </form>
      </div>
    </div>
  );
}

/* styles */
const head = { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 };
const crumb = { fontSize: 13, color: "#64748b" };
const h1 = { margin: 0, fontSize: 22, fontWeight: 950, color: "#0f172a" };

const card = {
  background: "#fff",
  borderRadius: 18,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
  padding: 16,
};

const input = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid rgba(15,23,42,0.12)",
  outline: "none",
  background: "#fff",
  backgroundImage: "none",
};

const previewBox = {
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.10)",
  background: "rgba(15,23,42,0.02)",
  display: "grid",
  gap: 8,
};

const previewImg = {
  width: 260,
  height: 150,
  objectFit: "cover",
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.08)",
};

const primaryBtn = {
  padding: 12,
  borderRadius: 12,
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(135deg,#2d8cff,#1b64ff)",
  color: "#fff",
  fontWeight: 950,
};

const errorBox = {
  padding: 12,
  borderRadius: 14,
  background: "rgba(244,63,94,0.08)",
  border: "1px solid rgba(244,63,94,0.25)",
  color: "#be123c",
  fontWeight: 850,
};

/* ✅ added styles for file upload */
const fileBox = {
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.10)",
  background: "rgba(15,23,42,0.02)",
  display: "grid",
  gap: 10,
};

const fileInput = {
  padding: 10,
  borderRadius: 12,
  border: "1px dashed rgba(15,23,42,0.20)",
  background: "#fff",
};

const fileMeta = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  flexWrap: "wrap",
};

const removeFileBtn = {
  marginLeft: "auto",
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 900,
};
