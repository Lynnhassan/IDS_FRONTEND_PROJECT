import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./InstructorAccount.css";

export default function InstructorAccount() {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  useEffect(() => {
    const loadAccount = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/instructor/account`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load account");

        setAccount(data);
      } catch (e) {
        setError(e.message);
      }
    };

    loadAccount();
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/instructor/account/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.errors) {
          const firstKey = Object.keys(data.errors)[0];
          throw new Error(data.errors[firstKey][0]);
        }
        throw new Error(data.message || "Failed to change password");
      }

      setSuccess(data.message || "Password updated ✅");
      setForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (e2) {
      setError(e2.message);
    }
  };

  return (
    <div style={{ padding: 16, maxWidth: 600 }}>
      <h2>Instructor Account</h2>

      {error && (
        <div style={{ margin: "12px 0", padding: 10, borderRadius: 12, background: "#ffe4e6", color: "#9f1239", fontWeight: 800 }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ margin: "12px 0", padding: 10, borderRadius: 12, background: "#dcfce7", color: "#166534", fontWeight: 800 }}>
          {success}
        </div>
      )}

      {account ? (
        <div style={{ padding: 12, borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 16 }}>
          <p><b>Full Name:</b> {account.fullName}</p>
          <p><b>Email:</b> {account.email}</p>
          <p><b>Role:</b> {account.role}</p>
          <p><b>Status:</b> {account.isActive ? "Active" : "Inactive"}</p>
        </div>
      ) : (
        <p>Loading account...</p>
      )}

      <h3>Change Password</h3>

      <form onSubmit={changePassword} style={{ display: "grid", gap: 10 }}>
        <input
          type="password"
          name="current_password"
          placeholder="Current password"
          value={form.current_password}
          onChange={onChange}
          required
        />

        <input
          type="password"
          name="new_password"
          placeholder="New password (min 8)"
          value={form.new_password}
          onChange={onChange}
          required
          minLength={8}
        />

        <input
          type="password"
          name="new_password_confirmation"
          placeholder="Confirm new password"
          value={form.new_password_confirmation}
          onChange={onChange}
          required
          minLength={8}
        />

        <button type="submit" style={{ padding: 10, borderRadius: 10, border: "none", cursor: "pointer" }}>
          Update Password
        </button>
      </form>
    </div>
  );
}
