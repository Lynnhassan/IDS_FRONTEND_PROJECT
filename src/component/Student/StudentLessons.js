import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { useParams, useNavigate } from 'react-router-dom';

const StudentLessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [notification, setNotification] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!courseId) {
      setError('No course ID provided');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Not authenticated. Please login.');
      setLoading(false);
      return;
    }

    fetchLessons();
  }, [courseId, token]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching lessons for courseId:', courseId);

      const response = await fetch(`${API_URL}/student/course/${courseId}/lessons`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch lessons');
      }

      if (data.success) {
        setLessons(data.lessons || []);
        const completed = new Set(
          data.lessons.filter(l => l.isCompleted).map(l => l.id)
        );
        setCompletedLessons(completed);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleLesson = (lessonId) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const handleMarkComplete = async (lessonId) => {
    try {
      const response = await fetch(`${API_URL}/student/lesson/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark lesson complete');
      }

      if (data.success) {
        setCompletedLessons(prev => new Set([...prev, lessonId]));
        showNotification('Lesson marked as complete! 🎉', 'success');
      }
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      showNotification('Failed to mark lesson complete', 'error');
    }
  };

  const handleTakeQuiz = () => {
    navigate(`/student/course/${courseId}/quiz`);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading lessons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>Failed to load lessons</h3>
        <p style={styles.errorText}>{error}</p>
        <button onClick={fetchLessons} style={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📚</div>
        <h3 style={styles.emptyTitle}>No Lessons Yet</h3>
        <p style={styles.emptyText}>This course doesn't have any lessons at the moment.</p>
      </div>
    );
  }

  const completedCount = completedLessons.size;
  const totalCount = lessons.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const isFullyCompleted = progress === 100;

  return (
    <div style={styles.container}>
      {/* ✅ NOTIFICATION TOAST */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Course Progress Header */}
      <div style={styles.progressCard}>
        <div style={styles.progressHeader}>
          <div>
            <h2 style={styles.progressTitle}>Course Progress</h2>
            <p style={styles.progressSubtitle}>
              {completedCount} of {totalCount} lessons completed
            </p>
          </div>
          <div style={styles.progressCircle}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke={isFullyCompleted ? "#10b981" : "#3b82f6"}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 35}`}
                strokeDashoffset={`${2 * Math.PI * 35 * (1 - progress / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
              <text
                x="40"
                y="45"
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill="#0f172a"
              >
                {progress}%
              </text>
            </svg>
          </div>
        </div>
        <div style={styles.progressBarBg}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${progress}%`,
              background: isFullyCompleted 
                ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
            }}
          />
        </div>
      </div>

      {/* CONGRATULATIONS CARD */}
      {isFullyCompleted && (
        <div style={styles.congratsCard}>
          <div style={styles.congratsIcon}>🎉</div>
          <div style={styles.congratsContent}>
            <h3 style={styles.congratsTitle}>Congratulations!</h3>
            <p style={styles.congratsText}>
              You've completed all lessons in this course. Ready to test your knowledge?
            </p>
          </div>
          <button style={styles.quizButton} onClick={handleTakeQuiz}>
            📝 Take Final Quiz
          </button>
        </div>
      )}

      {/* Lessons List */}
      <div style={styles.lessonsContainer}>
        <h3 style={styles.lessonsTitle}>Course Lessons</h3>

        {lessons.map((lesson, index) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            lessonNumber={index + 1}
            isCompleted={completedLessons.has(lesson.id)}
            isExpanded={expandedLesson === lesson.id}
            onToggle={() => handleToggleLesson(lesson.id)}
            onMarkComplete={() => handleMarkComplete(lesson.id)}
          />
        ))}
      </div>

      {/* BOTTOM QUIZ BUTTON */}
      {isFullyCompleted && (
        <div style={styles.bottomQuizSection}>
          <div style={styles.bottomQuizCard}>
            <div style={styles.bottomQuizContent}>
              <h4 style={styles.bottomQuizTitle}>Ready for the Final Quiz?</h4>
              <p style={styles.bottomQuizText}>
                Test your knowledge and earn your certificate!
              </p>
            </div>
            <button style={styles.bottomQuizButton} onClick={handleTakeQuiz}>
              📝 Start Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ NOTIFICATION COMPONENT
function Notification({ message, type, onClose }) {
  const notificationStyles = {
    success: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: '✓',
      iconBg: '#059669'
    },
    error: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      icon: '✕',
      iconBg: '#dc2626'
    },
    info: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      icon: 'ℹ',
      iconBg: '#2563eb'
    }
  };

  const style = notificationStyles[type] || notificationStyles.success;

  return (
    <div style={styles.notificationContainer}>
      <div style={{...styles.notification, background: style.background}}>
        <div style={{...styles.notificationIcon, background: style.iconBg}}>
          {style.icon}
        </div>
        <div style={styles.notificationContent}>
          <p style={styles.notificationMessage}>{message}</p>
        </div>
        <button style={styles.notificationClose} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

function LessonCard({ lesson, lessonNumber, isCompleted, isExpanded, onToggle, onMarkComplete }) {
  return (
    <div style={styles.lessonCard}>
      {/* Lesson Header */}
      <div 
        style={{
          ...styles.lessonHeader,
          ...(isCompleted ? styles.lessonHeaderCompleted : {})
        }}
        onClick={onToggle}
      >
        <div style={styles.lessonHeaderLeft}>
          <div style={{
            ...styles.lessonNumber,
            ...(isCompleted ? styles.lessonNumberCompleted : {})
          }}>
            {isCompleted ? '✓' : lessonNumber}
          </div>
          <div style={styles.lessonHeaderContent}>
            <h4 style={styles.lessonTitle}>
              Lesson {lessonNumber}: {lesson.title || 'Untitled Lesson'}
            </h4>
            {lesson.estimatedDuration && (
              <span style={styles.lessonDuration}>
                ⏱️ {lesson.estimatedDuration} min
              </span>
            )}
          </div>
        </div>
        <div style={styles.expandIcon}>
          {isExpanded ? '▲' : '▼'}
        </div>
      </div>

      {/* Lesson Content - Expanded */}
      {isExpanded && (
        <div style={styles.lessonBody}>
          {/* Video */}
          {lesson.videoUrl && (
            <div style={styles.videoSection}>
              <h5 style={styles.sectionTitle}>📹 Video Lesson</h5>
              <div style={styles.videoContainer}>
                {lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be') ? (
                  <iframe
                    style={styles.videoIframe}
                    src={getYoutubeEmbedUrl(lesson.videoUrl)}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video style={styles.video} controls>
                    <source src={lesson.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          {lesson.content && (
            <div style={styles.contentSection}>
              <h5 style={styles.sectionTitle}>📝 Lesson Content</h5>
              <div style={styles.contentText}>
                {lesson.content}
              </div>
            </div>
          )}

          {/* Lesson Info */}
          <div style={styles.infoSection}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Order:</span>
              <span style={styles.infoValue}>#{lesson.order}</span>
            </div>
            {lesson.estimatedDuration && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Duration:</span>
                <span style={styles.infoValue}>{lesson.estimatedDuration} minutes</span>
              </div>
            )}
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Status:</span>
              <span style={{
                ...styles.statusBadge,
                ...(isCompleted ? styles.statusCompleted : styles.statusPending)
              }}>
                {isCompleted ? '✓ Completed' : '○ Not Started'}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {!isCompleted && (
            <button
              style={styles.completeButton}
              onClick={(e) => {
                e.stopPropagation();
                onMarkComplete();
              }}
            >
              Mark as Complete
            </button>
          )}

          {isCompleted && (
            <div style={styles.completedMessage}>
              <span style={styles.completedIcon}>🎉</span>
              You've completed this lesson!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to get YouTube embed URL
function getYoutubeEmbedUrl(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

const styles = {
  container: {
    padding: '24px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative'
  },
  // ✅ NOTIFICATION STYLES
  notificationContainer: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 9999,
    animation: 'slideInRight 0.3s ease'
  },
  notification: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    minWidth: '320px',
    maxWidth: '480px',
    animation: 'slideInRight 0.3s ease'
  },
  notificationIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0
  },
  notificationContent: {
    flex: 1
  },
  notificationMessage: {
    margin: 0,
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1.4'
  },
  notificationClose: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: '#fff',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.2s',
    flexShrink: 0
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px'
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
    textAlign: 'center',
    padding: '60px 20px',
    background: '#fff',
    borderRadius: '18px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  errorIcon: {
    fontSize: '64px',
    marginBottom: '16px'
  },
  errorTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px'
  },
  errorText: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '20px'
  },
  retryButton: {
    padding: '12px 24px',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
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
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '14px',
    color: '#64748b'
  },
  progressCard: {
    background: '#fff',
    borderRadius: '18px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  progressTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  progressSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  progressCircle: {
    flexShrink: 0
  },
  progressBarBg: {
    height: '12px',
    background: '#e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '12px',
    transition: 'width 0.5s ease'
  },
  congratsCard: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '18px',
    padding: '24px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    animation: 'slideIn 0.5s ease'
  },
  congratsIcon: {
    fontSize: '48px',
    animation: 'bounce 1s infinite'
  },
  congratsContent: {
    flex: 1
  },
  congratsTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 8px 0'
  },
  congratsText: {
    fontSize: '14px',
    color: '#d1fae5',
    margin: 0
  },
  quizButton: {
    padding: '12px 24px',
    background: '#fff',
    color: '#10b981',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  bottomQuizSection: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '2px solid #e2e8f0'
  },
  bottomQuizCard: {
    background: '#fff',
    borderRadius: '18px',
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '2px solid #10b981'
  },
  bottomQuizContent: {
    flex: 1
  },
  bottomQuizTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  bottomQuizText: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0
  },
  bottomQuizButton: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  lessonsContainer: {
    marginTop: '24px'
  },
  lessonsTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '16px'
  },
  lessonCard: {
    background: '#fff',
    borderRadius: '16px',
    marginBottom: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s'
  },
  lessonHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    borderLeft: '4px solid #3b82f6'
  },
  lessonHeaderCompleted: {
    borderLeft: '4px solid #10b981',
    background: '#f0fdf4'
  },
  lessonHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1
  },
  lessonNumber: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#3b82f6',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0
  },
  lessonNumberCompleted: {
    background: '#10b981'
  },
  lessonHeaderContent: {
    flex: 1
  },
  lessonTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0f172a',
    margin: '0 0 4px 0'
  },
  lessonDuration: {
    fontSize: '13px',
    color: '#64748b'
  },
  expandIcon: {
    fontSize: '12px',
    color: '#64748b',
    marginLeft: '16px'
  },
  lessonBody: {
    padding: '0 20px 20px 20px',
    borderTop: '1px solid #e2e8f0'
  },
  videoSection: {
    marginTop: '20px',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: '12px'
  },
  videoContainer: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
    borderRadius: '12px',
    background: '#000'
  },
  videoIframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '12px'
  },
  video: {
    width: '100%',
    borderRadius: '12px'
  },
  contentSection: {
    marginBottom: '20px'
  },
  contentText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#475569',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '12px',
    whiteSpace: 'pre-wrap'
  },
  infoSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '20px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '12px'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  infoLabel: {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '600'
  },
  infoValue: {
    fontSize: '13px',
    color: '#0f172a',
    fontWeight: '500'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600'
  },
  statusCompleted: {
    background: '#d1fae5',
    color: '#065f46'
  },
  statusPending: {
    background: '#e0e7ff',
    color: '#3730a3'
  },
  completeButton: {
    width: '100%',
    padding: '12px',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  completedMessage: {
    textAlign: 'center',
    padding: '16px',
    background: '#d1fae5',
    borderRadius: '12px',
    color: '#065f46',
    fontSize: '14px',
    fontWeight: '600'
  },
  completedIcon: {
    marginRight: '8px',
    fontSize: '18px'
  }
};

// Add keyframes and animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  .lessonCard:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  }
  .lessonHeader:hover {
    background: #f8fafc !important;
  }
  .completeButton:hover {
    background: #2563eb !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  .quizButton:hover, .bottomQuizButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }
  .notificationClose:hover {
    background: rgba(255, 255, 255, 0.3) !important;
    transform: scale(1.1);
  }
`;
document.head.appendChild(styleSheet);

export default StudentLessons;