import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { API_URL } from "../../config";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    instructors: 0,
    courses: 0,
    publishedCourses: 0,
    enrollments: 0,
    quizzes: 0,
    overallAvgScore: 0,
  });

  const [charts, setCharts] = useState({
    labels7: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    users7: [0, 0, 0, 0, 0, 0, 0],
    courses7: [0, 0, 0, 0, 0, 0, 0],
    enrollments7: [0, 0, 0, 0, 0, 0, 0],
  });

  const [topQuizzes, setTopQuizzes] = useState([]);
  const [lowQuizzes, setLowQuizzes] = useState([]);
  const [error, setError] = useState("");

  // ✅ Logout handler
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

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/admin/dashboard`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || "Failed to load admin dashboard");

        setStats(data.stats || stats);
        setCharts(data.charts || charts);
        setTopQuizzes(Array.isArray(data.topQuizzes) ? data.topQuizzes : []);
        setLowQuizzes(Array.isArray(data.lowQuizzes) ? data.lowQuizzes : []);
      } catch (e) {
        setError(e.message);
      }
    };

    load();
    // eslint-disable-next-line
  }, []);

  const maxUsers = useMemo(() => Math.max(...charts.users7, 1), [charts.users7]);
  const maxCourses = useMemo(() => Math.max(...charts.courses7, 1), [charts.courses7]);
  const maxEnroll = useMemo(() => Math.max(...charts.enrollments7, 1), [charts.enrollments7]);

  return (
    <>
      {/* ✅ Topbar with Logout */}
      <header className="md2-topbar">
        <div className="md2-breadcrumbs">
          <span className="muted">/</span> Admin
          <div className="md2-title">Admin Dashboard</div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={handleLogout} className="md2-logout-btn" title="Logout">
             Logout
          </button>
        </div>
      </header>

      {error && (
        <div style={{ margin: "12px 0", padding: 10, borderRadius: 12, background: "#ffe4e6", color: "#9f1239", fontWeight: 800 }}>
          {error}
        </div>
      )}

      <section className="md2-stats">
        <StatCard icon="👥" label="Users" value={stats.totalUsers} deltaText="total" color="blue" />
        <StatCard icon="🎓" label="Students" value={stats.students} deltaText="total" color="sky" />
        <StatCard icon="🧑‍🏫" label="Instructors" value={stats.instructors} deltaText="total" color="green" />
        <StatCard icon="📚" label="Courses" value={stats.courses} deltaText={`${stats.publishedCourses} published`} color="pink" />
      </section>

      <section className="md2-stats">
        <StatCard icon="🧾" label="Enrollments" value={stats.enrollments} deltaText="total" color="blue" />
        <StatCard icon="📝" label="Quizzes" value={stats.quizzes} deltaText="total" color="sky" />
        <StatCard icon="📊" label="Avg Score" value={`${stats.overallAvgScore}%`} deltaText="overall" color="green" />
        <StatCard icon="✅" label="Active" value="OK" deltaText="system" color="pink" />
      </section>

      <section className="md2-charts">
        <ChartCard title="New Users" subtitle="last 7 days" footer="auto from DB" theme="blue">
          <BarMiniChart values={charts.users7} labels={charts.labels7} maxValue={maxUsers} />
        </ChartCard>

        <ChartCard title="New Courses" subtitle="last 7 days" footer="auto from DB" theme="green">
          <LineMiniChart values={charts.courses7} labels={charts.labels7} maxValue={maxCourses} />
        </ChartCard>

        <ChartCard title="Enrollments" subtitle="last 7 days" footer="auto from DB" theme="dark">
          <LineMiniChart values={charts.enrollments7} labels={charts.labels7} maxValue={maxEnroll} />
        </ChartCard>
      </section>

      <section className="md2-admin-tables">
        <QuizTable title="Top Performing Quizzes" items={topQuizzes} />
        <QuizTable title="Low Performing Quizzes" items={lowQuizzes} />
      </section>
    </>
  );
}

function StatCard({ icon, label, value, deltaText, color }) {
  return (
    <div className="md2-stat-card">
      <div className={`md2-stat-icon ${color}`}>{icon}</div>
      <div className="md2-stat-content">
        <div className="md2-stat-label">{label}</div>
        <div className="md2-stat-value">{value}</div>
        <div className="md2-stat-foot">
          <span className="muted">{deltaText}</span>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, footer, theme, children }) {
  return (
    <div className="md2-chart-card">
      <div className={`md2-chart-top ${theme}`}>{children}</div>
      <div className="md2-chart-body">
        <div className="md2-chart-title">{title}</div>
        <div className="md2-chart-sub">{subtitle}</div>
        <div className="md2-chart-foot">⏱ {footer}</div>
      </div>
    </div>
  );
}

function QuizTable({ title, items }) {
  return (
    <div className="md2-admin-table-card">
      <div className="md2-admin-table-title">{title}</div>

      {items.length === 0 ? (
        <div className="md2-admin-empty">No data yet (no quiz attempts).</div>
      ) : (
        <table className="md2-admin-table">
          <thead>
            <tr>
              <th>Quiz</th>
              <th>Avg Score</th>
              <th>Attempts</th>
            </tr>
          </thead>
          <tbody>
            {items.map((q) => (
              <tr key={q.id}>
                <td style={{ fontWeight: 900 }}>{q.title}</td>
                <td>{Number(q.avgScore).toFixed(1)}%</td>
                <td>{q.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function BarMiniChart({ values, labels, maxValue }) {
  const safe = Array.isArray(values) ? values : [0, 0, 0, 0, 0, 0, 0];
  const labs = Array.isArray(labels) ? labels : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <svg viewBox="0 0 320 160" className="md2-svg">
      {[20, 60, 100, 140].map((y) => (
        <line key={y} x1="10" y1={y} x2="310" y2={y} className="md2-grid" />
      ))}
      {safe.map((v, i) => {
        const x = 30 + i * 40;
        const h = (v / maxValue) * 110;
        return <rect key={i} x={x} y={145 - h} width="18" height={h} rx="4" className="md2-bar" />;
      })}
      {labs.map((d, i) => (
        <text key={d + i} x={34 + i * 40} y="156" className="md2-xlab">
          {String(d).slice(0, 1)}
        </text>
      ))}
    </svg>
  );
}

function LineMiniChart({ values, labels, maxValue }) {
  const safe = Array.isArray(values) ? values : [0, 0, 0, 0, 0, 0, 0];
  const labs = Array.isArray(labels) ? labels : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const pts = safe.map((v) => 140 - (v / maxValue) * 100);
  const path = pts.map((y, i) => `${i === 0 ? "M" : "L"} ${20 + i * 40} ${y}`).join(" ");

  return (
    <svg viewBox="0 0 320 160" className="md2-svg">
      {[30, 70, 110, 150].map((y) => (
        <line key={y} x1="10" y1={y} x2="310" y2={y} className="md2-grid" />
      ))}
      <path d={path} className="md2-line" fill="none" />
      {pts.map((y, i) => <circle key={i} cx={20 + i * 40} cy={y} r="4" className="md2-dot" />)}
      {labs.map((d, i) => (
        <text key={d + i} x={20 + i * 40} y="156" className="md2-xlab">
          {String(d).slice(0, 1)}
        </text>
      ))}
    </svg>
  );
}
