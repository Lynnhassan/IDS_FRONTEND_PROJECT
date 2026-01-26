import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (e) {
      console.warn("Logout API failed, clearing locally");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  const linkClass = ({ isActive }) => `md2-nav-item ${isActive ? "active" : ""}`;

  return (
    <aside className="md2-sidebar">
      <div className="md2-brand">
        <div className="md2-brand-icon">A</div>
        <div className="md2-brand-title">Admin Panel</div>
      </div>

      <nav className="md2-nav">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <span className="md2-nav-ico">📊</span> Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <span className="md2-nav-ico">👥</span> Users
        </NavLink>

        <NavLink to="/admin/courses" className={linkClass}>
          <span className="md2-nav-ico">📚</span> Courses
        </NavLink>

        <div className="md2-nav-sep" />

        <button onClick={handleLogout} className="md2-nav-item btn">
          <span className="md2-nav-ico">🚪</span> Logout
        </button>
      </nav>
    </aside>
  );
}
