import React, { useState, useEffect, useMemo } from "react";
import "./StudentDashboard.css";
import { API_URL } from "../../config";
import { useParams } from "react-router-dom";

export default function StudentDashboard() {
  const token = localStorage.getItem('token');
  const [stats, setStats] = useState({ courses: 0, lessons: 23, quizzes: 6 });
  const [instructors, setInstructors] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [charts] = useState({
    courses7: [1, 2, 1, 3, 2, 1, 2],
    lessons7: [2, 3, 4, 3, 5, 4, 6],
    completions7: [1, 1, 2, 2, 3, 2, 3],
  });

  const maxCourses = useMemo(() => Math.max(...charts.courses7, 1), []);
  const maxLessons = useMemo(() => Math.max(...charts.lessons7, 1), []);
  const maxCompletions = useMemo(() => Math.max(...charts.completions7, 1), []);

  // ✅ FETCH ENROLLED COURSES ON MOUNT
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/student/enrolled-courses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!res.ok) throw new Error('Failed to fetch enrolled courses');

        const data = await res.json();
        
        if (data.success && data.courses) {
          // Extract course IDs from enrolled courses
          const enrolledIds = data.courses.map(course => course.id);
          setEnrolledCourses(enrolledIds);
          console.log('Enrolled course IDs:', enrolledIds);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    if (token) {
      fetchEnrolledCourses();
    }
  }, [token]);

  const handleEnroll = (courseId) => {
    setSelectedCourseId(courseId);
    setShowConfirm(true);
  };

  const confirmEnroll = async () => {
    try {
      const res = await fetch(`${API_URL}/student/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          courseId: selectedCourseId,
        }),
      });

      if (!res.ok) throw new Error("Enroll failed");

      // ✅ Mark course as enrolled
      setEnrolledCourses((prev) => [...prev, selectedCourseId]);

      setShowConfirm(false);
      setSelectedCourseId(null);
      
      // ✅ Show success notification
      alert('✅ Successfully enrolled in the course!');
    } catch (error) {
      console.error("Enrollment failed:", error);
      alert('❌ Failed to enroll. Please try again.');
    }
  };

  const cancelEnroll = () => {
    setShowConfirm(false);
    setSelectedCourseId(null);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/coursesDisplay`);
        const data = await res.json();
        setInstructors(data);

        const totalCourses = data.reduce(
          (sum, instructor) => sum + instructor.courses_taught.length,
          0
        );
        setStats((prev) => ({ ...prev, courses: totalCourses }));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="md2-dashboard">
      {/* Topbar */}
      <header className="md2-header">
        <div className="md2-welcome">Welcome back 👋</div>
        <div className="md2-stats-row">
          <StatCard icon="📚" label="My Courses" value={stats.courses} color="blue" />
          <StatCard icon="📖" label="Lessons Watched" value={stats.lessons} color="green" />
          <StatCard icon="📝" label="Quizzes Taken" value={stats.quizzes} color="sky" />
          <StatCard
            icon="🎓"
            label="Weekly Activity"
            value={charts.completions7.reduce((a, b) => a + b, 0)}
            color="pink"
          />
        </div>
      </header>

      {/* Charts Section */}
      <section className="md2-charts-section">
        <ChartCard title="Weekly Learning" subtitle="Lessons completed" color="blue">
          <BarMiniChart values={charts.courses7} maxValue={maxCourses} />
        </ChartCard>

        <ChartCard title="Quiz Practice" subtitle="Quiz activity" color="green">
          <LineMiniChart values={charts.lessons7} maxValue={maxLessons} />
        </ChartCard>

        <ChartCard title="Progress Trend" subtitle="Consistency" color="dark">
          <LineMiniChart values={charts.completions7} maxValue={maxCompletions} />
        </ChartCard>
      </section>

      {/* Courses Section */}
      <section className="md2-courses-section">
        <h2>Available Courses</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <p>Loading courses...</p>
          </div>
        ) : (
          <div className="md2-course-list">
            {instructors.map((inst) =>
              inst.courses_taught.map((course) => (
                <div key={course.id} className="md2-course-card">
                  <h3>{course.title}</h3>
                  <p><strong>Category:</strong> {course.category}</p>
                  <p><strong>Difficulty:</strong> {course.difficulty}</p>
                  <p>{course.shortDescription}</p>
                  <p><strong>Instructor:</strong> {inst.fullName} ({inst.email})</p>
                  
                  {/* ✅ CONDITIONAL BUTTON RENDERING */}
                  {enrolledCourses.includes(course.id) ? (
                    <button className="md2-enrolled-btn" disabled>
                      ✅ Already Enrolled
                    </button>
                  ) : (
                    <button
                      className="md2-enroll-btn"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="md2-modal-overlay">
          <div className="md2-modal">
            <div className="md2-modal-icon">🎓</div>
            <h3>Confirm Enrollment</h3>
            <p>Are you sure you want to enroll in this course?</p>

            <div className="md2-modal-actions">
              <button className="md2-btn-cancel" onClick={cancelEnroll}>
                Cancel
              </button>
              <button className="md2-btn-confirm" onClick={confirmEnroll}>
                Yes, Enroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------- Reusable Components ------------------- */
function StatCard({ icon, label, value, color }) {
  return (
    <div className="md2-stat-card">
      <div className={`md2-stat-icon ${color}`}>{icon}</div>
      <div className="md2-stat-text">
        <div className="md2-stat-label">{label}</div>
        <div className="md2-stat-value">{value}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, color, children }) {
  return (
    <div className="md2-chart-card">
      <div className={`md2-chart-top ${color}`}>{children}</div>
      <div className="md2-chart-body">
        <div className="md2-chart-title">{title}</div>
        <div className="md2-chart-sub">{subtitle}</div>
      </div>
    </div>
  );
}

function BarMiniChart({ values, maxValue }) {
  return (
    <svg viewBox="0 0 320 160" className="md2-svg">
      {values.map((v, i) => (
        <rect
          key={i}
          className="md2-bar"
          x={30 + i * 40}
          y={150 - (v / maxValue) * 110}
          width="18"
          height={(v / maxValue) * 110}
          rx="4"
        />
      ))}
    </svg>
  );
}

function LineMiniChart({ values, maxValue }) {
  const path = values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${20 + i * 40} ${140 - (v / maxValue) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 320 160" className="md2-svg">
      <path className="md2-line" d={path} fill="none" strokeWidth="3" />
    </svg>
  );
}