// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { API_URL } from '../../config';

// const StudentEnrollment = () => {
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     if (token) {
//       fetchEnrolledCourses();
//     } else {
//       setError('Please login to view your courses');
//       setLoading(false);
//     }
//   }, [token]);

//   const fetchEnrolledCourses = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(`${API_URL}/student/enrolled-courses`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//         }
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || data.message || 'Failed to fetch courses');
//       }

//       if (data.success) {
//         setEnrolledCourses(data.courses || []);
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (err) {
//       console.error('Error fetching enrolled courses:', err);
//       setError(err.message || 'Failed to load courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredCourses = enrolledCourses.filter(course => {
//     const matchesFilter = filter === 'all' || course.status === filter;
//     const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   const stats = {
//     total: enrolledCourses.length,
//     inProgress: enrolledCourses.filter(c => c.status === 'in-progress').length,
//     completed: enrolledCourses.filter(c => c.status === 'completed').length,
//     avgProgress: enrolledCourses.length > 0 
//       ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / enrolledCourses.length)
//       : 0
//   };

//   if (loading) {
//     return (
//       <div style={styles.loadingContainer}>
//         <div style={styles.spinner}></div>
//         <p style={styles.loadingText}>Loading your courses...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={styles.errorContainer}>
//         <div style={styles.errorIcon}>⚠️</div>
//         <h3 style={styles.errorTitle}>Oops! Something went wrong</h3>
//         <p style={styles.errorText}>{error}</p>
//         {token && (
//           <button onClick={fetchEnrolledCourses} style={styles.retryButton}>
//             Try Again
//           </button>
//         )}
//         {!token && (
//           <button 
//             onClick={() => navigate('/login')}
//             style={styles.retryButton}
//           >
//             Go to Login
//           </button>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <div>
//           <h1 style={styles.title}>My Learning Journey 🎓</h1>
//           <p style={styles.subtitle}>Track your progress and continue learning</p>
//         </div>
//         <button 
//           onClick={() => navigate('/student/dashboard')}
//           style={styles.backButton}
//         >
//           ← Back to Dashboard
//         </button>
//       </header>

//       {enrolledCourses.length > 0 && (
//         <div style={styles.statsGrid}>
//           <StatCard icon="📚" label="Total Courses" value={stats.total} color="#3b82f6" />
//           <StatCard icon="🔄" label="In Progress" value={stats.inProgress} color="#f59e0b" />
//           <StatCard icon="✅" label="Completed" value={stats.completed} color="#10b981" />
//           <StatCard icon="📊" label="Avg Progress" value={`${stats.avgProgress}%`} color="#8b5cf6" />
//         </div>
//       )}

//       <div style={styles.controlsSection}>
//         <div style={styles.filterButtons}>
//           <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All Courses" count={stats.total} />
//           <FilterButton active={filter === 'in-progress'} onClick={() => setFilter('in-progress')} label="In Progress" count={stats.inProgress} />
//           <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')} label="Completed" count={stats.completed} />
//         </div>

//         <input
//           type="text"
//           placeholder="Search courses..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={styles.searchInput}
//         />
//       </div>

//       {filteredCourses.length === 0 ? (
//         <div style={styles.emptyState}>
//           <div style={styles.emptyIcon}>📭</div>
//           <h3 style={styles.emptyTitle}>No courses found</h3>
//           <p style={styles.emptyText}>
//             {searchTerm 
//               ? 'Try adjusting your search' 
//               : enrolledCourses.length === 0
//                 ? 'Start learning by enrolling in a course!'
//                 : 'No courses match the selected filter'}
//           </p>
//           {enrolledCourses.length === 0 && (
//             <button onClick={() => navigate('/courses')} style={styles.browseButton}>
//               Browse Courses
//             </button>
//           )}
//         </div>
//       ) : (
//         <div style={styles.coursesGrid}>
//           {filteredCourses.map((course) => (
//             <CourseCard key={course.id} course={course} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// function StatCard({ icon, label, value, color }) {
//   return (
//     <div style={{...styles.statCard, borderLeft: `4px solid ${color}`}}>
//       <div style={{...styles.statIcon, background: `${color}15`}}>
//         <span style={{fontSize: '24px'}}>{icon}</span>
//       </div>
//       <div style={styles.statContent}>
//         <div style={styles.statLabel}>{label}</div>
//         <div style={styles.statValue}>{value}</div>
//       </div>
//     </div>
//   );
// }

// function FilterButton({ active, onClick, label, count }) {
//   return (
//     <button onClick={onClick} style={{...styles.filterButton, ...(active ? styles.filterButtonActive : {})}}>
//       {label}
//       <span style={styles.filterCount}>{count}</span>
//     </button>
//   );
// }

// function CourseCard({ course }) {
//   const navigate = useNavigate();
//   const isCompleted = course.status === 'completed';

//   const handleContinueLearning = () => {
//     navigate(`/student/course/${course.id}`);
//   };

//   return (
//     <div style={styles.courseCard}>
//       <div style={styles.courseHeader}>
//         <div style={styles.courseThumbnail}>{course.thumbnail || '📚'}</div>
//         {isCompleted && <div style={styles.completedBadge}>✓ Completed</div>}
//       </div>

//       <div style={styles.courseBody}>
//         <h3 style={styles.courseTitle}>{course.title || 'Untitled Course'}</h3>
//         <p style={styles.courseInstructor}>👨‍🏫 {course.instructor || 'Unknown Instructor'}</p>

//         <div style={styles.courseMeta}>
//           <span style={styles.metaItem}>📂 {course.category || 'General'}</span>
//           <span style={styles.metaItem}>⚡ {course.difficulty || 'N/A'}</span>
//         </div>

//         <div style={styles.progressSection}>
//           <div style={styles.progressHeader}>
//             <span style={styles.progressLabel}>Progress</span>
//             <span style={styles.progressPercent}>{course.progress || 0}%</span>
//           </div>
//           <div style={styles.progressBarBg}>
//             <div style={{...styles.progressBarFill, width: `${course.progress || 0}%`, background: isCompleted ? '#10b981' : '#3b82f6'}} />
//           </div>
//           <div style={styles.lessonCount}>
//             {course.completedLessons || 0} of {course.totalLessons || 0} lessons completed
//           </div>
//         </div>

//         <div style={styles.enrolledDate}>
//           Enrolled: {new Date(course.enrolledDate).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//           })}
//         </div>

//         {course.nextLesson && !isCompleted && (
//           <div style={styles.nextLesson}>
//             <div style={styles.nextLessonLabel}>Next up:</div>
//             <div style={styles.nextLessonTitle}>{course.nextLesson}</div>
//           </div>
//         )}

//         <button
//           style={{...styles.actionButton, background: isCompleted ? '#10b981' : '#3b82f6'}}
//           onClick={handleContinueLearning}
//         >
//           {isCompleted ? 'Review Course' : 'Continue Learning'}
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     padding: '24px',
//     background: '#f8fafc',
//     minHeight: '100vh',
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//   },
//   loadingContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '100vh',
//     background: '#f8fafc'
//   },
//   spinner: {
//     width: '48px',
//     height: '48px',
//     border: '4px solid #e2e8f0',
//     borderTop: '4px solid #3b82f6',
//     borderRadius: '50%',
//     animation: 'spin 1s linear infinite'
//   },
//   loadingText: {
//     marginTop: '16px',
//     color: '#64748b',
//     fontSize: '14px'
//   },
//   errorContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '100vh',
//     background: '#f8fafc',
//     padding: '20px'
//   },
//   errorIcon: {
//     fontSize: '64px',
//     marginBottom: '16px'
//   },
//   errorTitle: {
//     fontSize: '24px',
//     fontWeight: '700',
//     color: '#0f172a',
//     marginBottom: '8px'
//   },
//   errorText: {
//     fontSize: '14px',
//     color: '#64748b',
//     marginBottom: '24px',
//     textAlign: 'center'
//   },
//   retryButton: {
//     padding: '12px 24px',
//     background: '#3b82f6',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '12px',
//     fontSize: '14px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.2s'
//   },
//   header: {
//     marginBottom: '24px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start'
//   },
//   title: {
//     fontSize: '28px',
//     fontWeight: '700',
//     color: '#0f172a',
//     margin: '0 0 4px 0'
//   },
//   subtitle: {
//     fontSize: '14px',
//     color: '#64748b',
//     margin: 0
//   },
//   backButton: {
//     padding: '10px 20px',
//     background: '#fff',
//     border: '2px solid #e2e8f0',
//     borderRadius: '10px',
//     color: '#0f172a',
//     fontSize: '14px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.2s'
//   },
//   statsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//     gap: '16px',
//     marginBottom: '24px'
//   },
//   statCard: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '12px',
//     padding: '16px',
//     background: '#fff',
//     borderRadius: '16px',
//     boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//     transition: 'transform 0.2s'
//   },
//   statIcon: {
//     width: '52px',
//     height: '52px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: '12px'
//   },
//   statContent: {
//     flex: 1
//   },
//   statLabel: {
//     fontSize: '13px',
//     color: '#64748b',
//     marginBottom: '2px'
//   },
//   statValue: {
//     fontSize: '22px',
//     fontWeight: '700',
//     color: '#0f172a'
//   },
//   controlsSection: {
//     display: 'flex',
//     gap: '16px',
//     marginBottom: '24px',
//     flexWrap: 'wrap',
//     alignItems: 'center'
//   },
//   filterButtons: {
//     display: 'flex',
//     gap: '8px',
//     flex: 1,
//     flexWrap: 'wrap'
//   },
//   filterButton: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     padding: '10px 16px',
//     border: '2px solid #e2e8f0',
//     background: '#fff',
//     borderRadius: '12px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#64748b',
//     transition: 'all 0.2s'
//   },
//   filterButtonActive: {
//     background: '#3b82f6',
//     borderColor: '#3b82f6',
//     color: '#fff'
//   },
//   filterCount: {
//     padding: '2px 8px',
//     borderRadius: '8px',
//     background: 'rgba(0,0,0,0.1)',
//     fontSize: '12px',
//     fontWeight: '700'
//   },
//   searchInput: {
//     padding: '10px 16px',
//     border: '2px solid #e2e8f0',
//     borderRadius: '12px',
//     fontSize: '14px',
//     outline: 'none',
//     minWidth: '250px',
//     transition: 'border-color 0.2s'
//   },
//   coursesGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
//     gap: '20px'
//   },
//   courseCard: {
//     background: '#fff',
//     borderRadius: '18px',
//     overflow: 'hidden',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//     transition: 'all 0.3s',
//     cursor: 'pointer'
//   },
//   courseHeader: {
//     position: 'relative',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     padding: '48px 20px',
//     textAlign: 'center'
//   },
//   courseThumbnail: {
//     fontSize: '48px'
//   },
//   completedBadge: {
//     position: 'absolute',
//     top: '12px',
//     right: '12px',
//     padding: '6px 12px',
//     background: '#10b981',
//     color: '#fff',
//     borderRadius: '8px',
//     fontSize: '12px',
//     fontWeight: '600'
//   },
//   courseBody: {
//     padding: '20px'
//   },
//   courseTitle: {
//     fontSize: '18px',
//     fontWeight: '700',
//     color: '#0f172a',
//     margin: '0 0 8px 0',
//     lineHeight: '1.4'
//   },
//   courseInstructor: {
//     fontSize: '13px',
//     color: '#64748b',
//     margin: '0 0 12px 0'
//   },
//   courseMeta: {
//     display: 'flex',
//     gap: '12px',
//     marginBottom: '16px'
//   },
//   metaItem: {
//     fontSize: '12px',
//     padding: '4px 10px',
//     background: '#f1f5f9',
//     borderRadius: '8px',
//     color: '#475569'
//   },
//   progressSection: {
//     marginBottom: '12px'
//   },
//   progressHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     marginBottom: '8px'
//   },
//   progressLabel: {
//     fontSize: '13px',
//     color: '#64748b',
//     fontWeight: '600'
//   },
//   progressPercent: {
//     fontSize: '13px',
//     color: '#0f172a',
//     fontWeight: '700'
//   },
//   progressBarBg: {
//     height: '8px',
//     background: '#e2e8f0',
//     borderRadius: '8px',
//     overflow: 'hidden'
//   },
//   progressBarFill: {
//     height: '100%',
//     borderRadius: '8px',
//     transition: 'width 0.3s'
//   },
//   lessonCount: {
//     fontSize: '12px',
//     color: '#64748b',
//     marginTop: '6px'
//   },
//   enrolledDate: {
//     fontSize: '12px',
//     color: '#94a3b8',
//     marginBottom: '12px',
//     fontStyle: 'italic'
//   },
//   nextLesson: {
//     padding: '12px',
//     background: '#f8fafc',
//     borderRadius: '10px',
//     marginBottom: '16px',
//     borderLeft: '3px solid #3b82f6'
//   },
//   nextLessonLabel: {
//     fontSize: '11px',
//     color: '#64748b',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//     marginBottom: '4px'
//   },
//   nextLessonTitle: {
//     fontSize: '13px',
//     color: '#0f172a',
//     fontWeight: '600'
//   },
//   actionButton: {
//     width: '100%',
//     padding: '12px',
//     border: 'none',
//     borderRadius: '12px',
//     color: '#fff',
//     fontSize: '14px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.2s'
//   },
//   emptyState: {
//     textAlign: 'center',
//     padding: '60px 20px',
//     background: '#fff',
//     borderRadius: '18px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
//   },
//   emptyIcon: {
//     fontSize: '64px',
//     marginBottom: '16px'
//   },
//   emptyTitle: {
//     fontSize: '20px',
//     fontWeight: '700',
//     color: '#0f172a',
//     margin: '0 0 8px 0'
//   },
//   emptyText: {
//     fontSize: '14px',
//     color: '#64748b',
//     margin: '0 0 20px 0'
//   },
//   browseButton: {
//     padding: '12px 24px',
//     background: '#3b82f6',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '12px',
//     fontSize: '14px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.2s'
//   }
// };

// const styleSheet = document.createElement('style');
// styleSheet.textContent = `
//   @keyframes spin {
//     to { transform: rotate(360deg); }
//   }
//   .courseCard:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
//   }
// `;
// document.head.appendChild(styleSheet);

// export default StudentEnrollment;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../../config';

const StudentEnrollment = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Initial load
  useEffect(() => {
    if (token) {
      fetchEnrolledCourses();
    } else {
      setError('Please login to view your courses');
      setLoading(false);
    }
  }, [token]);


  useEffect(() => {
   
    const handleVisibilityChange = () => {
      if (!document.hidden && token) {
        console.log('📊 Page visible - refreshing courses...');
        fetchEnrolledCourses();
      }
    };

   
    const handleFocus = () => {
      if (token) {
        console.log('👁️ Window focused - refreshing courses...');
        fetchEnrolledCourses();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [token]);

  
  useEffect(() => {
    if (location.state?.refreshCourses) {
      console.log('🔄 Navigation triggered refresh');
      fetchEnrolledCourses();
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/student/enrolled-courses`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch courses');
      }

      if (data.success) {
        setEnrolledCourses(data.courses || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = enrolledCourses.filter(course => {
    const matchesFilter = filter === 'all' || course.status === filter;
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: enrolledCourses.length,
    inProgress: enrolledCourses.filter(c => c.status === 'in-progress').length,
    completed: enrolledCourses.filter(c => c.status === 'completed').length,
    avgProgress: enrolledCourses.length > 0 
      ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / enrolledCourses.length)
      : 0
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>Oops! Something went wrong</h3>
        <p style={styles.errorText}>{error}</p>
        {token && (
          <button onClick={fetchEnrolledCourses} style={styles.retryButton}>
            Try Again
          </button>
        )}
        {!token && (
          <button 
            onClick={() => navigate('/login')}
            style={styles.retryButton}
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>My Learning Journey 🎓</h1>
          <p style={styles.subtitle}>Track your progress and continue learning</p>
        </div>
        <button 
          onClick={() => navigate('/student/dashboard')}
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>
      </header>

      {enrolledCourses.length > 0 && (
        <div style={styles.statsGrid}>
          <StatCard icon="📚" label="Total Courses" value={stats.total} color="#3b82f6" />
          <StatCard icon="🔄" label="In Progress" value={stats.inProgress} color="#f59e0b" />
          <StatCard icon="✅" label="Completed" value={stats.completed} color="#10b981" />
          <StatCard icon="📊" label="Avg Progress" value={`${stats.avgProgress}%`} color="#8b5cf6" />
        </div>
      )}

      <div style={styles.controlsSection}>
        <div style={styles.filterButtons}>
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All Courses" count={stats.total} />
          <FilterButton active={filter === 'in-progress'} onClick={() => setFilter('in-progress')} label="In Progress" count={stats.inProgress} />
          <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')} label="Completed" count={stats.completed} />
        </div>

        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {filteredCourses.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={styles.emptyTitle}>No courses found</h3>
          <p style={styles.emptyText}>
            {searchTerm 
              ? 'Try adjusting your search' 
              : enrolledCourses.length === 0
                ? 'Start learning by enrolling in a course!'
                : 'No courses match the selected filter'}
          </p>
          {enrolledCourses.length === 0 && (
            <button onClick={() => navigate('/courses')} style={styles.browseButton}>
              Browse Courses
            </button>
          )}
        </div>
      ) : (
        <div style={styles.coursesGrid}>
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{...styles.statCard, borderLeft: `4px solid ${color}`}}>
      <div style={{...styles.statIcon, background: `${color}15`}}>
        <span style={{fontSize: '24px'}}>{icon}</span>
      </div>
      <div style={styles.statContent}>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{value}</div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label, count }) {
  return (
    <button onClick={onClick} style={{...styles.filterButton, ...(active ? styles.filterButtonActive : {})}}>
      {label}
      <span style={styles.filterCount}>{count}</span>
    </button>
  );
}

// function CourseCard({ course }) {
//   const navigate = useNavigate();
//   const isCompleted = course.status === 'completed';

//   const handleContinueLearning = () => {
//     navigate(`/student/course/${course.id}`);
//   };

//   return (
//     <div style={styles.courseCard}>
//       <div style={styles.courseHeader}>
//         <div style={styles.courseThumbnail}>{course.thumbnail || '📚'}</div>
//         {isCompleted && <div style={styles.completedBadge}>✓ Completed</div>}
//       </div>

//       <div style={styles.courseBody}>
//         <h3 style={styles.courseTitle}>{course.title || 'Untitled Course'}</h3>
//         <p style={styles.courseInstructor}>👨‍🏫 {course.instructor || 'Unknown Instructor'}</p>

//         <div style={styles.courseMeta}>
//           <span style={styles.metaItem}>📂 {course.category || 'General'}</span>
//           <span style={styles.metaItem}>⚡ {course.difficulty || 'N/A'}</span>
//         </div>

//         <div style={styles.progressSection}>
//           <div style={styles.progressHeader}>
//             <span style={styles.progressLabel}>Progress</span>
//             <span style={styles.progressPercent}>{course.progress || 0}%</span>
//           </div>
//           <div style={styles.progressBarBg}>
//             <div style={{...styles.progressBarFill, width: `${course.progress || 0}%`, background: isCompleted ? '#10b981' : '#3b82f6'}} />
//           </div>
//           <div style={styles.lessonCount}>
//             {course.completedLessons || 0} of {course.totalLessons || 0} lessons completed
//           </div>
//         </div>

//         <div style={styles.enrolledDate}>
//           Enrolled: {new Date(course.enrolledDate).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//           })}
//         </div>

//         {course.nextLesson && !isCompleted && (
//           <div style={styles.nextLesson}>
//             <div style={styles.nextLessonLabel}>Next up:</div>
//             <div style={styles.nextLessonTitle}>{course.nextLesson}</div>
//           </div>
//         )}

//         <button
//           style={{...styles.actionButton, background: isCompleted ? '#10b981' : '#3b82f6'}}
//           onClick={handleContinueLearning}
//         >
//           {isCompleted ? 'Review Course' : 'Continue Learning'}
//         </button>
//       </div>
//     </div>
//   );
// }
function CourseCard({ course }) {
  const navigate = useNavigate();
  const isCompleted = course.status === 'completed';

  const handleContinueLearning = () => {
    navigate(`/student/course/${course.id}`);
  };

  const handleReviewCourse = () => {
    // Navigate to reviews section of the course
    navigate(`/student/review/${course.id}`, { state: { scrollToReviews: true } });
  };

  return (
    <div style={styles.courseCard}>
      <div style={styles.courseHeader}>
        <div style={styles.courseThumbnail}>{course.thumbnail || '📚'}</div>
        {isCompleted && <div style={styles.completedBadge}>✓ Completed</div>}
      </div>

      <div style={styles.courseBody}>
        <h3 style={styles.courseTitle}>{course.title || 'Untitled Course'}</h3>
        <p style={styles.courseInstructor}>👨‍🏫 {course.instructor || 'Unknown Instructor'}</p>

        <div style={styles.courseMeta}>
          <span style={styles.metaItem}>📂 {course.category || 'General'}</span>
          <span style={styles.metaItem}>⚡ {course.difficulty || 'N/A'}</span>
        </div>

        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Progress</span>
            <span style={styles.progressPercent}>{course.progress || 0}%</span>
          </div>
          <div style={styles.progressBarBg}>
            <div style={{...styles.progressBarFill, width: `${course.progress || 0}%`, background: isCompleted ? '#10b981' : '#3b82f6'}} />
          </div>
          <div style={styles.lessonCount}>
            {course.completedLessons || 0} of {course.totalLessons || 0} lessons completed
          </div>
        </div>

        <div style={styles.enrolledDate}>
          Enrolled: {new Date(course.enrolledDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>

        {course.nextLesson && !isCompleted && (
          <div style={styles.nextLesson}>
            <div style={styles.nextLessonLabel}>Next up:</div>
            <div style={styles.nextLessonTitle}>{course.nextLesson}</div>
          </div>
        )}

        {/* Continue Learning Button - Always shows */}
        <button
          style={styles.actionButton}
          onClick={handleContinueLearning}
        >
          Continue Learning
        </button>

        {/* Review Course Button - Only shows when completed */}
        {isCompleted && (
          <button
            style={styles.reviewButton}
            onClick={handleReviewCourse}
          >
            ⭐ Review Course
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    background: '#f8fafc',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f8fafc'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '16px',
    color: '#64748b',
    fontSize: '14px'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f8fafc',
    padding: '20px'
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  errorTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px'
  },
  errorText: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '24px',
    textAlign: 'center'
  },
  retryButton: {
    padding: '12px 24px',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  header: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  backButton: {
    padding: '10px 20px',
    background: '#fff',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    color: '#0f172a',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  },
  statIcon: {
    width: '52px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px'
  },
  statContent: {
    flex: 1
  },
  statLabel: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '2px'
  },
  statValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a'
  },
  controlsSection: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    flex: 1,
    flexWrap: 'wrap'
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: '2px solid #e2e8f0',
    background: '#fff',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    transition: 'all 0.2s'
  },
  filterButtonActive: {
    background: '#3b82f6',
    borderColor: '#3b82f6',
    color: '#fff'
  },
  filterCount: {
    padding: '2px 8px',
    borderRadius: '8px',
    background: 'rgba(0,0,0,0.1)',
    fontSize: '12px',
    fontWeight: '700'
  },
  searchInput: {
    padding: '10px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    minWidth: '250px',
    transition: 'border-color 0.2s'
  },
  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px'
  },
  courseCard: {
    background: '#fff',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'all 0.3s',
    cursor: 'pointer'
  },
  courseHeader: {
    position: 'relative',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '48px 20px',
    textAlign: 'center'
  },
  courseThumbnail: {
    fontSize: '48px'
  },
  completedBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '6px 12px',
    background: '#10b981',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600'
  },
  courseBody: {
    padding: '20px'
  },
  courseTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0',
    lineHeight: '1.4'
  },
  courseInstructor: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 12px 0'
  },
  courseMeta: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  },
  metaItem: {
    fontSize: '12px',
    padding: '4px 10px',
    background: '#f1f5f9',
    borderRadius: '8px',
    color: '#475569'
  },
  progressSection: {
    marginBottom: '12px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  progressLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '600'
  },
  progressPercent: {
    fontSize: '13px',
    color: '#0f172a',
    fontWeight: '700'
  },
  progressBarBg: {
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '8px',
    transition: 'width 0.3s'
  },
  lessonCount: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '6px'
  },
  enrolledDate: {
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '12px',
    fontStyle: 'italic'
  },
  nextLesson: {
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '10px',
    marginBottom: '16px',
    borderLeft: '3px solid #3b82f6'
  },
  nextLessonLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '4px'
  },
  nextLessonTitle: {
    fontSize: '13px',
    color: '#0f172a',
    fontWeight: '600'
  },
 
  actionButton: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '12px',
    background: '#3b82f6',  // Always blue
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '8px'  // Add spacing between buttons
  },
  reviewButton: {
    width: '100%',
    padding: '12px',
    border: '2px solid #10b981',
    borderRadius: '12px',
    background: '#fff',
    color: '#10b981',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: '#fff',
    borderRadius: '18px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0'
  },
  emptyText: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 20px 0'
  },
  browseButton: {
    padding: '12px 24px',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};


const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .courseCard:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
  }
  button[style*="actionButton"]:hover {
    background: #2563eb !important;
    transform: translateY(-2px);
  }
  button[style*="reviewButton"]:hover {
    background: #10b981 !important;
    color: #fff !important;
    transform: translateY(-2px);
  }
`;
document.head.appendChild(styleSheet);

export default StudentEnrollment;