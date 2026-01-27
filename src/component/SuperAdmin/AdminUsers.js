import React, { useEffect, useMemo, useState } from "react";
import { API_URL } from "../../config";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to load users");
      setUsers(data.data || []);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = String(query).toLowerCase().trim();
    if (!q) return users;
    return users.filter((u) => {
      const hay = `${u.fullName ?? ""} ${u.email ?? ""} ${u.role ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [users, query]);

  const updateUser = async (id, patch) => {
    setSavingId(id);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to update user");

      setUsers((prev) => prev.map((u) => (u.id === id ? data.data : u)));
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
          <div className="md2-title">Users</div>
        </div>

        <div className="md2-search">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users..." />
        </div>
      </div>

      {error && (
        <div style={{ padding: 12, borderRadius: 12, background: "#ffe4e6", color: "#9f1239", fontWeight: 800 }}>
          {error}
        </div>
      )}

      <div className="md2-admin-table-card">
        <div className="md2-admin-table-title">All Users</div>

        {filtered.length === 0 ? (
          <div className="md2-admin-empty">No users found.</div>
        ) : (
          <table className="md2-admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const busy = savingId === u.id;
                return (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 900 }}>{u.fullName}</td>
                    <td>{u.email}</td>

                    <td>
                      <select
                        value={u.role}
                        disabled={busy}
                        onChange={(e) => updateUser(u.id, { role: e.target.value })}
                      >
                        <option value="Student">Student</option>
                        <option value="Instructor">Instructor</option>
                        <option value="SuperAdmin">SuperAdmin</option>
                      </select>
                    </td>

                    <td style={{ fontWeight: 900, color: u.isActive ? "#065f46" : "#9f1239" }}>
                      {u.isActive ? "Active" : "Inactive"}
                    </td>

                    <td>
                      <button
                        onClick={() => updateUser(u.id, { isActive: !u.isActive })}
                        disabled={busy}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 10,
                          border: "1px solid rgba(15,23,42,0.10)",
                          cursor: "pointer",
                          fontWeight: 900,
                        }}
                      >
                        {busy ? "Saving..." : u.isActive ? "Deactivate" : "Activate"}
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
