import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./InstructorDashboard.css"; 

export default function InstructorLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="md2">
      {/* Sidebar */}
      <aside className="md2-sidebar">
        <div className="md2-brand">
          <div className="md2-brand-icon">▦</div>
          <div className="md2-brand-title">Instructor Panel</div>
        </div>

        <nav className="md2-nav">
          <Link className={`md2-nav-item ${isActive("/instructor/dashboard") ? "active" : ""}`} to="/instructor/dashboard">
            <span className="md2-nav-ico">▦</span> Dashboard
          </Link>

          <Link className={`md2-nav-item ${isActive("/instructor/courses") ? "active" : ""}`} to="/instructor/courses">
            <span className="md2-nav-ico">▤</span> Courses
          </Link>

          <Link className={`md2-nav-item ${isActive("/instructor/courses/new") ? "active" : ""}`} to="/instructor/courses/new">
            <span className="md2-nav-ico">＋</span> Create Course
          </Link>

          <div className="md2-nav-sep" />

          
        </nav>

        <div className="md2-upgrade">
          <div className="md2-upgrade-title">Welcome</div>
          <div className="md2-upgrade-sub">{user.fullName || "Instructor"}</div>
          
          <button className="md2-upgrade-btn" onClick={logout}>
           Sign Out
          </button>
        </div>
      </aside>
      <main className="md2-main">
      
        <Outlet />
      </main>
    </div>
  );
}
