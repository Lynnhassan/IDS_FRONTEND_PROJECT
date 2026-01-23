import { useParams } from 'react-router-dom';
import StudentCertificateResult from './StudentCertificateResult';

// This component extracts courseId from the URL and passes it as a prop
const StudentCertificateWrapper = () => {
  const { courseId } = useParams(); // Gets courseId from URL like /courses/123/certificate
  const userId = localStorage.getItem('userId'); // Optional: get userId if needed
  
  // Pass courseId as prop to your actual component
  return <StudentCertificateResult courseId={courseId} userId={userId} />;
};

export default StudentCertificateWrapper;