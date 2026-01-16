import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config";

export default function InstructorCourseEdit() {
  const { courseId } = useParams();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdf, setExistingPdf] = useState(null);
  const [removePdf, setRemovePdf] = useState(false); // ✅ NEW

  useEffect(() => {
    const loadCourse = async () => {
      setError("");
      try {
        const res = await fetch(`${API_URL}/instructor/courses/${courseId}`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
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

        setExistingPdf(data.pdf || null);
        setPdfFile(null);
        setRemovePdf(false);
      } catch (e) {
        setError(e.message);
      }
    };

    loadCourse();
  }, [courseId, token]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const needsMultipart = !!pdfFile || removePdf; // ✅ if uploading OR removing, use FormData

      if (needsMultipart) {
        const body = new FormData();
        body.append("_method", "PUT");

        // ✅ append fields (force isPublished to 1/0)
        body.append("title", form.title ?? "");
        body.append("shortDescription", form.shortDescription ?? "");
        body.append("longDescription", form.longDescription ?? "");
        body.append("category", form.category ?? "");
        body.append("difficulty", form.difficulty ?? "Easy");
        body.append("thumbnail", form.thumbnail ?? "");
        body.append("isPublished", form.isPublished ? "1" : "0");

        // ✅ remove pdf flag
        if (removePdf) body.append("remove_pdf", "1");

        // ✅ new pdf file overrides old
        if (pdfFile) body.append("pdf", pdfFile);

        const res = await fetch(`${API_URL}/instructor/courses/${courseId}`, {
          method: "POST",
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
          body,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(formatLaravelErrors(data) || data.error || data.message || "Failed to update course");

        const updated = data.course || data.data || data;

        setExistingPdf(updated?.pdf ?? null);
        setPdfFile(null);
        setRemovePdf(false);

        alert("Course updated ✅");
      } else {
        // ✅ normal JSON PUT
        const payload = {
          ...form,
          isPublished: form.isPublished ? 1 : 0, // ✅ send numeric
        };

        const res = await fetch(`${API_URL}/instructor/courses/${courseId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(formatLaravelErrors(data) || data.error || data.message || "Failed to update course");

        alert("Course updated ✅");
      }
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  const pdfUrl = existingPdf ? `http://127.0.0.1:8000/storage/${existingPdf}` : null;

  if (!form) return <p>Loading course...</p>;

  return (
    <div style={{ maxWidth: 650 }}>
      <h1>Edit Course</h1>
      {error && <p style={{ color: "crimson", fontWeight: 800 }}>{error}</p>}

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

        {/* ✅ PDF section */}
        <div style={fileBox}>
          <div style={{ fontWeight: 900 }}>Course PDF</div>

          {pdfUrl ? (
            <>
              <a href={pdfUrl} target="_blank" rel="noreferrer" style={pdfLink}>
                View current PDF 📄
              </a>

              <label style={removeRow}>
                <input
                  type="checkbox"
                  checked={removePdf}
                  onChange={(e) => {
                    const v = e.target.checked;
                    setRemovePdf(v);
                    if (v) setPdfFile(null); // if removing, don’t upload
                  }}
                />
                Remove current PDF
              </label>
            </>
          ) : (
            <div style={{ fontSize: 12, opacity: 0.7 }}>No PDF attached yet.</div>
          )}

          <input
            type="file"
            accept="application/pdf"
            disabled={removePdf}
            onChange={(e) => {
              setPdfFile(e.target.files?.[0] || null);
              if (e.target.files?.[0]) setRemovePdf(false); // uploading overrides remove
            }}
            style={fileInput}
          />

          {pdfFile ? (
            <div style={fileMeta}>
              <span style={{ fontWeight: 800 }}>{pdfFile.name}</span>
              <button type="button" onClick={() => setPdfFile(null)} style={removeFileBtn}>
                Remove selection
              </button>
            </div>
          ) : null}
        </div>

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

function formatLaravelErrors(data) {
  if (!data || !data.errors) return "";
  return Object.values(data.errors).flat().join(" | ");
}

const input = { padding: 12, borderRadius: 10, border: "1px solid #ddd" };
const btn = { padding: 12, borderRadius: 10, border: "none", cursor: "pointer", background: "#111827", color: "#fff", fontWeight: 900 };

const fileBox = { padding: 12, borderRadius: 12, border: "1px solid rgba(15,23,42,0.12)", background: "rgba(15,23,42,0.02)", display: "grid", gap: 10 };
const fileInput = { padding: 10, borderRadius: 10, border: "1px dashed rgba(15,23,42,0.25)", background: "#fff" };
const fileMeta = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" };
const removeFileBtn = { marginLeft: "auto", padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(15,23,42,0.12)", background: "#fff", cursor: "pointer", fontWeight: 800 };
const pdfLink = { textDecoration: "none", display: "inline-block", width: "fit-content", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(45,140,255,0.20)", background: "rgba(45,140,255,0.08)", fontWeight: 900 };
const removeRow = { display: "flex", gap: 8, alignItems: "center", fontSize: 13, fontWeight: 800, color: "#334155" };
