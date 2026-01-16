import React, { useEffect, useMemo, useState } from "react";
import "./InstructorDashboard.css";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";


export default function InstructorDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({ courses: 0, students: 0, lessons: 0 });
  const [charts, setCharts] = useState({
    labels7: ["M", "T", "W", "T", "F", "S", "S"],
    courses7: [0, 0, 0, 0, 0, 0, 0],
    lessons7: [0, 0, 0, 0, 0, 0, 0],
    completions7: [0, 0, 0, 0, 0, 0, 0],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/instructor/dashboard/stats`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || data.message || "Failed to load dashboard");

        setStats(data.stats || { courses: 0, students: 0, lessons: 0 });
        setCharts(data.charts || charts);
      } catch (e) {
        setError(e.message);
      }
    };

    load();
    // eslint-disable-next-line
  }, []);

  // Helpful for scaling charts
  const maxCourses = useMemo(() => Math.max(...charts.courses7, 1), [charts.courses7]);
  const maxLessons = useMemo(() => Math.max(...charts.lessons7, 1), [charts.lessons7]);
  const maxCompletions = useMemo(() => Math.max(...charts.completions7, 1), [charts.completions7]);

  return (
    <>
      <header className="md2-topbar">
        <div className="md2-breadcrumbs">
          <span className="muted">/</span> Dashboard
          <div className="md2-title">Dashboard</div>
        </div>

        <div className="md2-topbar-right">
          <div className="md2-search">
            <input placeholder="Search here" />
          </div>
         <button className="md2-icon-btn" title="Profile" onClick={() => navigate("/instructor/account")}>👤</button>

          <button className="md2-icon-btn" title="Settings">⚙️</button>
          <button className="md2-icon-btn" title="Notifications">🔔</button>
        </div>
      </header>

      {error && (
        <div style={{ margin: "12px 0", padding: 10, borderRadius: 12, background: "#ffe4e6", color: "#9f1239", fontWeight: 800 }}>
          {error}
        </div>
      )}

      {/* Stat cards */}
      <section className="md2-stats">
        <StatCard icon="📚" label="Courses" value={stats.courses} delta="" deltaText="total" color="blue" />
        <StatCard icon="🎓" label="Students" value={stats.students} delta="" deltaText="total" color="sky" />
        <StatCard icon="🧩" label="Lessons" value={stats.lessons} delta="" deltaText="total" color="green" />
        <StatCard icon="✅" label="Completions" value={charts.completions7.reduce((a,b)=>a+b,0)} delta="" deltaText="last 7 days" color="pink" />
      </section>

      {/* Chart cards */}
      <section className="md2-charts">
        <ChartCard title="Website Views" subtitle="Courses created (last 7 days)" footer="auto from DB" theme="blue">
          <BarMiniChart values={charts.courses7} labels={charts.labels7} maxValue={maxCourses} />
        </ChartCard>

        <ChartCard title="Daily Sales" subtitle="Lessons created (last 7 days)" footer="auto from DB" theme="green">
          <LineMiniChart values={charts.lessons7} labels={charts.labels7} maxValue={maxLessons} />
        </ChartCard>

        <ChartCard title="Completed Tasks" subtitle="Lesson completions (last 7 days)" footer="auto from DB" theme="dark">
          <LineMiniChart values={charts.completions7} labels={charts.labels7} maxValue={maxCompletions} variant="dark" />
        </ChartCard>
      </section>
    </>
  );
}

function StatCard({ icon, label, value, delta, deltaText, color }) {
  return (
    <div className="md2-stat-card">
      <div className={`md2-stat-icon ${color}`}>{icon}</div>
      <div className="md2-stat-content">
        <div className="md2-stat-label">{label}</div>
        <div className="md2-stat-value">{value}</div>
        <div className="md2-stat-foot">
          {delta ? <span className="md2-delta">{delta}</span> : null} <span className="muted">{deltaText}</span>
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

/** Bar chart (7 values) */
function BarMiniChart({ values, labels, maxValue }) {
  const safe = Array.isArray(values) ? values : [0, 0, 0, 0, 0, 0, 0];
  const labs = Array.isArray(labels) ? labels : ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <svg viewBox="0 0 320 160" className="md2-svg">
      {[20, 60, 100, 140].map((y) => (
        <line key={y} x1="10" y1={y} x2="310" y2={y} className="md2-grid" />
      ))}

      {safe.map((v, i) => {
        const x = 30 + i * 40;
        const h = (v / maxValue) * 110;
        return (
          <rect key={i} x={x} y={145 - h} width="18" height={h} rx="4" className="md2-bar" />
        );
      })}

      {labs.map((d, i) => (
        <text key={d + i} x={38 + i * 40} y="156" className="md2-xlab">
          {d}
        </text>
      ))}
    </svg>
  );
}

/** Line chart (7 values) */
function LineMiniChart({ values, labels, maxValue, variant }) {
  const safe = Array.isArray(values) ? values : [0, 0, 0, 0, 0, 0, 0];
  const labs = Array.isArray(labels) ? labels : ["M", "T", "W", "T", "F", "S", "S"];

  // Map values to y positions (bigger value = higher point)
  const pts = safe.map((v) => {
    const normalized = v / maxValue;         // 0..1
    return 140 - normalized * 100;           // y range
  });

  const path = pts
    .map((y, i) => {
      const x = 20 + i * 40;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 320 160" className="md2-svg">
      {[30, 70, 110, 150].map((y) => (
        <line key={y} x1="10" y1={y} x2="310" y2={y} className="md2-grid" />
      ))}

      <path d={path} className="md2-line" fill="none" />
      {pts.map((y, i) => {
        const x = 20 + i * 40;
        return <circle key={i} cx={x} cy={y} r="4" className="md2-dot" />;
      })}

      {labs.map((d, i) => (
        <text key={d + i} x={20 + i * 40} y="156" className="md2-xlab">
          {d}
        </text>
      ))}
    </svg>
  );
}
