// import React, { useState } from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import { useParams } from 'react-router-dom';
// import { API_URL } from '../../config';

// const CourseSummary = () => {
//   const { courseId } = useParams();
//   const [summary, setSummary] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSummarize = async () => {
//     setLoading(true);
//     setError(null);
//     setSummary('');

//     try {
//       const response = await fetch(
//         `${API_URL}/student/course/${courseId}/summary`,
//         { headers: { Accept: 'application/json' } }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success && data.summary) {
//         setSummary(data.summary);
//       } else {
//         setError(data.message || 'No summary available');
//       }
//     } catch (err) {
//       setError(`Failed to connect to server: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         .course-summary-container {
//           max-width: 900px;
//           margin: 40px auto;
//           padding: 0 20px;
//         }

//         .course-summary-card {
//           background: #ffffff;
//           border-radius: 16px;
//           padding: 28px;
//           border: 1px solid rgba(15, 23, 42, 0.08);
//           box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
//         }

//         .course-summary-title {
//           font-size: 24px;
//           font-weight: 900;
//           color: #0f172a;
//           margin-bottom: 16px;
//         }

//         .summary-btn {
//           padding: 12px 18px;
//           border-radius: 12px;
//           border: none;
//           cursor: pointer;
//           background: linear-gradient(135deg, #6366f1, #4f46e5);
//           color: #ffffff;
//           font-weight: 800;
//           font-size: 14px;
//           box-shadow: 0 10px 24px rgba(79, 70, 229, 0.35);
//           transition: all 0.15s ease;
//         }

//         .summary-btn:hover {
//           transform: translateY(-1px);
//           box-shadow: 0 14px 30px rgba(79, 70, 229, 0.45);
//         }

//         .summary-btn:disabled {
//           background: #c7c9f7;
//           cursor: not-allowed;
//           box-shadow: none;
//           transform: none;
//         }

//         .summary-error {
//           margin-top: 16px;
//           padding: 14px;
//           border-radius: 12px;
//           background: rgba(244, 63, 94, 0.08);
//           border: 1px solid rgba(244, 63, 94, 0.25);
//           color: #be123c;
//           font-weight: 700;
//           font-size: 14px;
//         }

//         .summary-placeholder {
//           margin-top: 20px;
//           font-size: 14px;
//           color: #64748b;
//         }

//         .summary-content {
//           margin-top: 24px;
//           background: #f8fafc;
//           padding: 24px;
//           border-radius: 14px;
//           border: 1px solid rgba(15, 23, 42, 0.08);
//         }

//         .summary-content h1,
//         .summary-content h2,
//         .summary-content h3 {
//           color: #0f172a;
//           font-weight: 900;
//         }

//         .summary-content p {
//           color: #334155;
//           line-height: 1.7;
//         }

//         .summary-content ul {
//           padding-left: 20px;
//         }

//         .summary-content li {
//           margin-bottom: 6px;
//         }
//       `}</style>

//       <div className="course-summary-container">
//         <div className="course-summary-card">
//           <h2 className="course-summary-title">AI Course Summary</h2>

//           <button
//             className="summary-btn"
//             onClick={handleSummarize}
//             disabled={loading}
//           >
//             {loading ? 'AI is Thinking…' : 'Generate AI Summary'}
//           </button>

//           {error && <div className="summary-error">{error}</div>}

//           {summary && (
//             <div className="summary-content">
//               <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                 {summary}
//               </ReactMarkdown>
//             </div>
//           )}

//           {!summary && !loading && !error && (
//             <p className="summary-placeholder">
//               Click the button above to generate a summary
//             </p>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default CourseSummary;
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../config';

const CourseSummary = () => {
  const { courseId } = useParams();
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setError(null);
      setSummary('');

      try {
        const response = await fetch(
          `${API_URL}/student/course/${courseId}/summary`,
          { headers: { Accept: 'application/json' } }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.summary) {
          setSummary(data.summary);
        } else {
          setError(data.message || 'No summary available');
        }
      } catch (err) {
        setError(`Failed to connect to server: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [courseId]);

  return (
    <>
      <style>{`
        .course-summary-container {
          max-width: 900px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .course-summary-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 28px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
        }

        .summary-error {
          padding: 14px;
          border-radius: 12px;
          background: rgba(244, 63, 94, 0.08);
          border: 1px solid rgba(244, 63, 94, 0.25);
          color: #be123c;
          font-weight: 700;
          font-size: 14px;
        }

        .summary-loading {
          text-align: center;
          font-weight: 700;
          color: #6366f1;
        }

        .summary-content {
          background: #f8fafc;
          padding: 24px;
          border-radius: 14px;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .summary-content h1,
        .summary-content h2,
        .summary-content h3 {
          color: #0f172a;
          font-weight: 900;
        }

        .summary-content p {
          color: #334155;
          line-height: 1.7;
        }

        .summary-content ul {
          padding-left: 20px;
        }

        .summary-content li {
          margin-bottom: 6px;
        }
      `}</style>

      <div className="course-summary-container">
        <div className="course-summary-card">
          {loading && <div className="summary-loading">AI is summarizing the course… 🤖</div>}

          {error && <div className="summary-error">{error}</div>}

          {!loading && summary && (
            <div className="summary-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {summary}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseSummary;
