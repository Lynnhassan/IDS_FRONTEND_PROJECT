// import React, { useState, useEffect } from 'react';
// import './StudentCertificateResult.css'
// import { API_URL } from '../../config';

// const StudentCertificateResult = ({ courseId, userId }) => {
//   const [certificate, setCertificate] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [qrCode, setQrCode] = useState(null);
 
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     generateCertificate();
//   }, [courseId]);

//   // Generate Certificate
//   const generateCertificate = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       // ✅ FIXED: Match Laravel route - removed '/generate'
//       const response = await fetch(`${API_URL}/student/courses/${courseId}/certificate`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to generate certificate');
//       }

//       const data = await response.json();
      
//       // Now fetch the certificate details
//       await fetchCertificateDetails(data.certificate_id);
      
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch Certificate Details
//   const fetchCertificateDetails = async (certificateId) => {
//     try {
//       // ✅ Correct - matches Laravel route with /student prefix
//       const response = await fetch(`${API_URL}/student/certificates/${certificateId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//         },
//       });

//       if (!response.ok) throw new Error('Failed to fetch certificate');

//       const data = await response.json();
//       setCertificate(data.certificate);
      
//       // Fetch QR code as well
//       await fetchQrCode(certificateId);
      
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Fetch QR Code
//   const fetchQrCode = async (certificateId) => {
//     try {
//       // ✅ Correct - matches Laravel route with /student prefix
//       const response = await fetch(`${API_URL}/student/certificates/${certificateId}/qr-code`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error('Failed to fetch QR code');

//       const blob = await response.blob();
//       const qrUrl = URL.createObjectURL(blob);
//       setQrCode(qrUrl);
      
//     } catch (err) {
//       console.error('QR Code error:', err);
//     }
//   };

//   // Download PDF Certificate
//   const downloadPDF = async () => {
//     if (!certificate) return;

//     try {
//       // ✅ Correct - matches Laravel route with /student prefix
//       const response = await fetch(`${API_URL}/student/certificates/${certificate.id}/download`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error('Failed to download certificate');

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `certificate-${certificate.verification_code}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//     } catch (err) {
//       alert('Failed to download certificate: ' + err.message);
//     }
//   };

//   // Download QR Code
//   const downloadQRCode = async () => {
//     if (!certificate) return;

//     try {
//       // ✅ Correct - matches Laravel route with /student prefix
//       const response = await fetch(`${API_URL}/student/certificates/${certificate.id}/qr-code`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) throw new Error('Failed to download QR code');

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `qr-${certificate.verification_code}.png`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
      
//     } catch (err) {
//       alert('Failed to download QR code: ' + err.message);
//     }
//   };

//   // Share Certificate Link
//   const shareCertificate = () => {
//     if (!certificate) return;
    
//     // ✅ FIXED: Match Laravel route - it's /verify/{code}, not /certificates/verify/{code}
//     const shareUrl = `${window.location.origin}/verify/${certificate.verification_code}`;
    
//     if (navigator.share) {
//       navigator.share({
//         title: 'My Certificate',
//         text: `Check out my certificate for ${certificate.course.title}!`,
//         url: shareUrl,
//       });
//     } else {
//       // Fallback: Copy to clipboard
//       navigator.clipboard.writeText(shareUrl);
//       alert('Certificate link copied to clipboard!');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="result-container">
//         <div className="loading-spinner">
//           <div className="spinner"></div>
//           <p>Generating your certificate...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="result-container">
//         <div className="error-card">
//           <span className="error-icon">⚠️</span>
//           <h2>Error</h2>
//           <p>{error}</p>
//           <button className="btn-primary" onClick={generateCertificate}>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!certificate) {
//     return null;
//   }

//   return (
//     <div className="result-container">
//       {/* Header */}
//       <div className="result-header">
//         <div className="result-icon">🎓</div>
//         <h1>Congratulations!</h1>
//         <p className="result-message">
//           You've successfully completed the course and earned your certificate
//         </p>
//       </div>

//       {/* Certificate Details Card */}
//       <div className="certificate-card">
//         <div className="certificate-preview">
//           <div className="certificate-content">
//             <h2>{certificate.course.title}</h2>
//             <p className="student-name">{certificate.user.full_name}</p>
//             <p className="certificate-date">
//               Issued on {new Date(certificate.generated_at).toLocaleDateString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//               })}
//             </p>
//             <div className="verification-info">
//               <span className="verification-label">Verification Code:</span>
//               <code className="verification-code">{certificate.verification_code}</code>
//             </div>
//           </div>
          
//           {qrCode && (
//             <div className="qr-section">
//               <img src={qrCode} alt="QR Code" className="qr-code-image" />
//               <p className="qr-label">Scan to verify</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="result-actions">
//         <button className="btn-primary" onClick={downloadPDF}>
//           <span>📥</span>
//           Download Certificate
//         </button>
        
//         <button className="btn-secondary" onClick={downloadQRCode}>
//           <span>📱</span>
//           Download QR Code
//         </button>
        
//         <button className="btn-secondary" onClick={shareCertificate}>
//           <span>🔗</span>
//           Share Certificate
//         </button>
//       </div>

//       {/* Additional Info */}
//       <div className="info-card">
//         <h3>What's Next?</h3>
//         <ul>
//           <li>📄 Download your certificate PDF for your records</li>
//           <li>📱 Save the QR code for quick verification</li>
//           <li>🔗 Share your achievement on social media</li>
//           <li>✅ Add this certificate to your portfolio or LinkedIn</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default StudentCertificateResult;