import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import './StudentCertificateDetails.css';

const StudentCertificateDetails = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificate();
  }, [certificateId]);

  const fetchCertificate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/student/certificates/${certificateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCertificate(data.certificate);
      } else {
        setError('Certificate not found');
      }
    } catch (err) {
      console.error('Error fetching certificate:', err);
      setError('Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/student/certificates/${certificateId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificate.verification_code}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error downloading certificate:', err);
      alert('Failed to download certificate');
    }
  };

  const downloadQRCode = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/student/certificates/${certificateId}/qr-code`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-code-${certificate.verification_code}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error downloading QR code:', err);
      alert('Failed to download QR code');
    }
  };

  const copyVerificationCode = () => {
    navigator.clipboard.writeText(certificate.verification_code);
    alert('Verification code copied to clipboard!');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(certificate.course.title)}&organizationId=&issueYear=${new Date(certificate.generated_at).getFullYear()}&issueMonth=${new Date(certificate.generated_at).getMonth() + 1}&certUrl=${encodeURIComponent(window.location.href)}&certId=${certificate.verification_code}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="certificate-detail-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="certificate-detail-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>{error || 'Certificate not found'}</h3>
          <button onClick={() => navigate('/student/certificates')} className="btn-back">
            ← Back to Certificates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="certificate-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button onClick={() => navigate('/student/certificates')} className="back-button">
          ← Back
        </button>
        <h1>Certificate Details</h1>
      </div>

      {/* Certificate Preview */}
      <div className="certificate-preview">
        <div className="preview-badge">
          <span className="badge-icon-large">🏆</span>
        </div>
        <div className="preview-content">
          <h2>Certificate of Completion</h2>
          <p className="student-name">{certificate.user.full_name}</p>
          <p className="completion-text">has successfully completed</p>
          <h3 className="course-title">{certificate.course.title}</h3>
          <p className="course-category">{certificate.course.category}</p>
          <p className="issue-date">
            Issued on {new Date(certificate.generated_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Verification Info */}
      <div className="verification-section">
        <h3>Verification Information</h3>
        <div className="verification-code-box">
          <label>Verification Code:</label>
          <div className="code-display">
            <code>{certificate.verification_code}</code>
            <button onClick={copyVerificationCode} className="btn-copy">
              📋 Copy
            </button>
          </div>
        </div>
        <p className="verification-note">
          Share this code with employers or institutions to verify your certificate
        </p>
      </div>

      {/* Actions */}
      <div className="certificate-actions">
        <button onClick={downloadCertificate} className="btn-primary">
          📥 Download Certificate
        </button>
        <button onClick={downloadQRCode} className="btn-secondary">
          📱 Download QR Code
        </button>
        <button onClick={shareOnLinkedIn} className="btn-linkedin">
          <span className="linkedin-icon">in</span> Share on LinkedIn
        </button>
      </div>

      {/* Additional Info */}
      <div className="additional-info">
        <div className="info-card">
          <h4>Student Information</h4>
          <p><strong>Name:</strong> {certificate.user.full_name}</p>
          <p><strong>Email:</strong> {certificate.user.email}</p>
        </div>
        <div className="info-card">
          <h4>Course Information</h4>
          <p><strong>Title:</strong> {certificate.course.title}</p>
          <p><strong>Category:</strong> {certificate.course.category}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificateDetails;