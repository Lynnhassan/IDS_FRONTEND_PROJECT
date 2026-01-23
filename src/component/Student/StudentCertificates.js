import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import './StudentCertificates.css';

const StudentCertificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/student/certificates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📜 Certificates data:', data);
        setCertificates(data.certificates || []);
      } else {
        console.error('Failed to fetch certificates');
      }
    } catch (err) {
      console.error('Error fetching certificates:', err);
      setError('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Accept certificateId parameter
  const downloadPDF = async (certificateId) => {
    if (!certificateId) {
      alert('Certificate ID is missing');
      return;
    }

    const token = localStorage.getItem('token');
    
    try {
      console.log('📥 Downloading PDF for certificate ID:', certificateId);
      
      const url = `${API_URL}/student/certificates/${certificateId}/download`;
      console.log('🔗 Download URL:', url);
      
      const response = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Content-Type:', response.headers.get('content-type'));

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          console.error('❌ Error data:', errorData);
          throw new Error(errorData.message);
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      if (!contentType?.includes('application/pdf')) {
        throw new Error('Invalid response type: ' + contentType);
      }

      const blob = await response.blob();
      console.log('📦 Blob size:', blob.size);
      
      if (blob.size === 0) throw new Error('Empty file');

      // Find the certificate to get verification code
      const cert = certificates.find(c => c.id === certificateId);
      const filename = cert ? `certificate-${cert.verification_code}.pdf` : `certificate-${certificateId}.pdf`;

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      console.log('✅ PDF downloaded successfully');

    } catch (err) {
      console.error('💥 Download error:', err);
      alert('Failed to download certificate: ' + err.message);
    }
  };

  // ✅ FIXED: Accept certificateId parameter
  const downloadQRCode = async (certificateId) => {
    if (!certificateId) {
      alert('Certificate ID is missing');
      return;
    }

    const token = localStorage.getItem('token');
    
    try {
      console.log('📥 Downloading QR for certificate ID:', certificateId);
      
      const url = `${API_URL}/student/certificates/${certificateId}/qr-code`;
      console.log('🔗 QR URL:', url);
      
      const response = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'image/png'
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Content-Type:', response.headers.get('content-type'));

      const contentType = response.headers.get('content-type');

      if (!response.ok) {
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          console.error('❌ Error data:', errorData);
          throw new Error(errorData.message);
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      if (!contentType?.includes('image/png')) {
        throw new Error('Invalid response type: ' + contentType);
      }

      const blob = await response.blob();
      console.log('📦 Blob size:', blob.size);
      
      if (blob.size === 0) throw new Error('Empty file');

      // Find the certificate to get verification code
      const cert = certificates.find(c => c.id === certificateId);
      const filename = cert ? `qr-${cert.verification_code}.png` : `qr-${certificateId}.png`;

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      console.log('✅ QR downloaded successfully');

    } catch (err) {
      console.error('💥 QR download error:', err);
      alert('Failed to download QR code: ' + err.message);
    }
  };

  const viewCertificate = (certificateId) => {
    navigate(`/student/certificates/${certificateId}`);
  };

  if (loading) {
    return (
      <div className="certificates-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading certificates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certificates-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchCertificates} className="btn-retry">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="certificates-container">
      {/* Header */}
      <div className="certificates-header">
        <h1>🎓 My Certificates</h1>
        <p>View and download your course completion certificates</p>
      </div>

      {/* Existing Certificates */}
      {certificates.length > 0 ? (
        <div className="certificates-section">
          <h2>Your Certificates</h2>
          <div className="certificates-grid">
            {certificates.map((cert) => (
              <div key={cert.id} className="certificate-card">
                <div className="certificate-badge">
                  <span className="badge-icon">🏆</span>
                </div>
                <div className="certificate-content">
                  <h3>{cert.course?.title}</h3>
                  <p className="certificate-category">{cert.course?.category}</p>
                  <p className="certificate-date">
                    Issued: {new Date(cert.generated_at).toLocaleDateString()}
                  </p>
                  <p className="certificate-code">
                    Code: <strong>{cert.verification_code}</strong>
                  </p>
                </div>
                <div className="certificate-actions">
                  <button 
                    onClick={() => viewCertificate(cert.id)}
                    className="btn-view"
                  >
                    👁️ View
                  </button>
                  <button 
                    onClick={() => downloadPDF(cert.id)}
                    className="btn-download"
                  >
                    📥 Download PDF
                  </button>
                  <button 
                    onClick={() => downloadQRCode(cert.id)}
                    className="btn-qr"
                  >
                    📱 Download QR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📜</div>
          <h3>No Certificates Yet</h3>
          <p>Score 90% or above on course quizzes to earn certificates automatically!</p>
          <button 
            onClick={() => navigate('/student/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;