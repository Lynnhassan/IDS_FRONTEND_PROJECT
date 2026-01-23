import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { useParams } from 'react-router-dom';


const StudentReviews = () => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  const [userReview, setUserReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  const { courseId } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    fetchSummary();
    if (token) checkUserReview();
  }, [courseId, token]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  /* ---------------- API ---------------- */

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_URL}/student/reviews/course/${courseId}`);
      const data = await res.json();

      if (data.success) {
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    try {
      const res = await fetch(
        `${API_URL}/student/reviews/course/${courseId}/check`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        }
      );
      const data = await res.json();

      if (data.success && data.hasReviewed) {
        setUserReview(data.review);
        setRating(data.review.rating);
        setComment(data.review.comment || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  /* ---------------- Actions ---------------- */

  const validateForm = () => {
    const newErrors = {};
    if (rating < 1 || rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    if (comment.length > 1000) newErrors.comment = 'Max 1000 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitReview = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/student/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: Number(courseId),
          rating,
          comment: comment.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showNotification(userReview ? 'Review updated!' : 'Review submitted!');
        setShowReviewModal(false);
        fetchSummary();
        checkUserReview();
      } else {
        showNotification(data.error || 'Failed', 'error');
      }
    } catch {
      showNotification('Network error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;

    setDeleting(true);
    try {
      const res = await fetch(
        `${API_URL}/student/reviews/${userReview.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();

      if (res.ok && data.success) {
        showNotification('Review deleted!');
        setUserReview(null);
        setRating(5);
        setComment('');
        setShowDeleteModal(false);
        fetchSummary();
      } else {
        showNotification('Delete failed', 'error');
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )} */}

      {/* SUMMARY */}
      <div style={styles.summaryCard}>
         {/* <div style={styles.summaryLeft}>
          <div style={styles.ratingCircle}>
            <div style={styles.ratingNumber}>
              {averageRating.toFixed(1)}
            </div>
            <div style={styles.reviewCount}>
              {totalReviews} Reviews
            </div>
          </div>
        </div>  */}

        <div style={styles.summaryRight}>
          <h3 style={styles.summaryTitle}>Course Review</h3>
          <p style={styles.summaryText}>
            Share your experience with this course
          </p>

          {!userReview && token && (
            <button
              style={styles.writeBtn}
              onClick={() => setShowReviewModal(true)}
            >
              ✍️ Write a Review
            </button>
          )}
        </div>
      </div>

      {/* USER REVIEW OR EMPTY MESSAGE */}
      {userReview ? (
        <div style={styles.userReviewCard}>
          <div style={styles.userReviewHeader}>
            <span style={styles.userBadge}>Your Review</span>
            <div>
              <button style={styles.editBtn} onClick={() => setShowReviewModal(true)}>
                ✏️ Edit
              </button>
              <button style={styles.deleteBtn} onClick={() => setShowDeleteModal(true)}>
                🗑️ Delete
              </button>
            </div>
          </div>

          <div style={styles.userReviewContent}>
            {[1,2,3,4,5].map(star => (
              <span
                key={star}
                style={{
                  color: star <= userReview.rating ? '#fbbf24' : '#e5e7eb',
                  fontSize: 20
                }}
              >
                ★
              </span>
            ))}
            {userReview.comment && (
              <p style={styles.userComment}>{userReview.comment}</p>
            )}
          </div>
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>💬</div>
          <h4 style={styles.emptyTitle}>No reviews yet</h4>
          <p style={styles.emptyText}>
            You haven’t reviewed this course yet.
          </p>
        </div>
      )}

      {/* MODALS */}
      {showReviewModal && (
        <div style={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>{userReview ? 'Edit Review' : 'Write Review'}</h3>
            <div style={styles.starSelector}>
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  style={{
                    ...styles.starButton,
                    color: star <= rating ? '#fbbf24' : '#d1d5db'
                  }}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <textarea
              style={styles.textarea}
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={5}
            ></textarea>

            <button style={styles.submitButton} onClick={handleSubmitReview}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.deleteModal}>
            <h3>Delete review?</h3>
            <button style={styles.deleteConfirmBtn} onClick={handleDeleteReview}>
              Delete
            </button>
            <button style={styles.cancelButton} onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  
  );
};
const styles = {
  /* ---------- Page ---------- */
  container: {
    padding: '40px 20px',
    maxWidth: '950px',
    margin: '0 ',
    lineHeight: 1.6,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },

  /* ---------- Loading ---------- */
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
  },
  spinner: {
    width: '28px',
    height: '28px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  loadingText: {
    marginTop: '18px',
    fontSize: '14px',
    color: '#64748b'
  },

  /* ---------- Summary ---------- */
  summaryCard: {
    background: '#fff',
    borderRadius: '22px',
    padding: '38px',
    marginBottom: '20px',
    boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '40px',
    alignItems: 'center',
    width: '100%'
  },
  summaryRight: {
    flex: 1
  },
  summaryTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '12px'
  },
  summaryText: {
    fontSize: '15px',
    color: '#64748b',
    marginBottom: '24px',
    maxWidth: '520px'
  },
  writeBtn: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  /* ---------- User Review ---------- */
  userReviewCard: {
    background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
    border: '2px solid #3b82f6',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '40px',
    width: '100%',

  },
  userReviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px'
  },
  userBadge: {
    background: '#3b82f6',
    color: '#fff',
    padding: '6px 14px',
    borderRadius: '14px',
    fontSize: '13px',
    fontWeight: '600',
    marginRight: '14px'
  },
  userReviewContent: {
    background: '#fff',
    padding: '24px',
    borderRadius: '14px'
  },
  userComment: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.7',
    marginTop: '18px'
  },
  editBtn: {
    padding: '10px 20px',
    marginRight: '12px',
    background: '#fff',
    border: '1px solid #3b82f6',
    borderRadius: '10px',
    color: '#3b82f6',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '10px 20px',
    background: '#fff',
    border: '1px solid #ef4444',
    borderRadius: '10px',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    
  },

  /* ---------- Empty State ---------- */
  emptyState: {
    background: '#fff',
    borderRadius: '20px',
    padding: '96px 32px',
    textAlign: 'center',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    marginTop: '30px',
    width: '100%'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  emptyTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '10px'
  },
  emptyText: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.6'
  },

  /* ---------- Modal ---------- */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff',
    borderRadius: '22px',
    padding: '36px',
    width: '95%',
    maxWidth: '640px',
    boxShadow: '0 24px 70px rgba(0,0,0,0.35)'
  },
  starSelector: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    margin: '28px 0'
  },
  starButton: {
    fontSize: '38px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  textarea: {
    width: '100%',
    padding: '14px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    resize: 'vertical',
    outline: 'none',
    marginBottom: '24px'
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    cursor: 'pointer'
  },

  /* ---------- Delete Modal ---------- */
  deleteModal: {
    background: '#fff',
    borderRadius: '20px',
    padding: '44px',
    width: '95%',
    maxWidth: '480px',
    textAlign: 'center'
  },
  deleteConfirmBtn: {
    width: '100%',
    padding: '14px',
    background: '#ef4444',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '18px'
  },
  cancelButton: {
    width: '100%',
    padding: '14px',
    background: '#fff',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontWeight: '600',
    color:'#0f172a',
    cursor: 'pointer'
  }
};


export default StudentReviews;
