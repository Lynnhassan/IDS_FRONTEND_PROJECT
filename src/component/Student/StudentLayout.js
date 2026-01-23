import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

export default function StudentLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

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
          <div className="md2-brand-icon">🎓</div>
          <div className="md2-brand-title">Student Panel</div>
        </div>

        <nav className="md2-nav">
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) =>
              `md2-nav-item ${isActive ? "active" : ""}`
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/student/courses"
            className={({ isActive }) =>
              `md2-nav-item ${isActive ? "active" : ""}`
            }
          >
            📚 Enrolled Courses
          </NavLink>
              <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              `md2-nav-item ${isActive ? "active" : ""}`
            }
          >
            👤 Profile
          </NavLink>
                <NavLink
            to="/student/certificates"
            className={({ isActive }) =>
              `md2-nav-item ${isActive ? "active" : ""}`
            }
          >
            📚 Certificates
          </NavLink>
{/* 
          <NavLink
            to="/student/quizzes"
            className={({ isActive }) =>
              `md2-nav-item ${isActive ? "active" : ""}`
            }
          >
            📝 Quizzes
          </NavLink> */}

          {/* <NavLink
            to="/student/certificates"
            className={({ isActive }) =>
              `md2-nav-item ${isActive ? "active" : ""}`
            }
          >
            🎓 Certificates
          </NavLink>

          <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              `md2-nav-item ${isActive ? "active" : ""}`
            }
          >
            👤 Profile
          </NavLink> */}
        </nav>

        <div className="md2-upgrade">
          <div className="md2-upgrade-title">Welcome</div>
          <div className="md2-upgrade-sub">{user.fullName || "Student"}</div>

          <button className="md2-upgrade-btn" onClick={logout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="md2-main">
        <Outlet />
      </main>
    </div>
  );
}
