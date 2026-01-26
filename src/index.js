import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";
import reportWebVitals from "./reportWebVitals";


import SplashScreen from "./component/Splash/SplashScreen";
import Login from "./component/Authentication/Login";
import SignUp from "./component/Authentication/SignUp";
import InstructorQuizView from "./component/Instructor/InstructorQuizView";
import ProtectedRoute from "./component/ProtectedRoute";

import InstructorLayout from "./component/Instructor/InstructorLayout";
import InstructorDashboard from "./component/Instructor/InstructorDashboard";
import InstructorCourses from "./component/Instructor/InstructorCourses";
import InstructorCourseNew from "./component/Instructor/InstructorCourseNew";
import InstructorCourseEdit from "./component/Instructor/InstructorCourseEdit";
import InstructorLessonNew from "./component/Instructor/InstructorLessonNew";
import InstructorCourseView from "./component/Instructor/InstructorCourseView";
import StudentReview from "./component/Student/StudentReview";
import StudentDashboard from "./component/Student/StudentDashboard";
import StudentLayout from "./component/Student/StudentLayout";
import StudentEnrollment from "./component/Student/StudentEnrollment";
import StudentLessons from "./component/Student/StudentLessons";
import InstructorQuizQuestions from "./component/Instructor/InstructorQuizQuestions";
import InstructorQuizNew from "./component/Instructor/InstructorQuizNew";
import InstructorAccount from "./component/Instructor/InstructorAccount";
import StudentQuiz from "./component/Student/StudentQuiz";
import StudentQuizPage from "./component/Student/StudentQuizPage";
import StudentQuizResult from "./component/Student/StudentQuizResult";
import StudentQuizHistory from "./component/Student/StudentQuizHistory";
import StudentCertificateWrapper from './component/Student/StudentCertificateWrapper';
import { useParams } from "react-router-dom";
import StudentCertificates from "./component/Student/StudentCertificates";
import StudentCertificateDetails from "./component/Student/StudentCertificateDetails";
import InstructorQuizGenerator from "./component/Instructor/InstructorQuizGenerator";
import StudentSummarizer from "./component/Student/StudentSummarizer";

const root = ReactDOM.createRoot(document.getElementById("root"));
const CertificateResultWrapper = () => {
  const { courseId } = useParams();
  return <StudentCertificates courseId={courseId} />;
};

const CertificateDetailWrapper = () => {
  const { certificateId } = useParams();
  return <StudentCertificateDetails certificateId={certificateId} />;
};

function QuizBuilderWrapper() {
  const { id } = useParams();
  return <InstructorQuizGenerator courseId={id} />;
}
// Add this wrapper function with your other wrappers at the top
function StudentSummarizerWrapper() {
  const { courseId } = useParams();
  return <StudentSummarizer courseId={courseId} />;
}


root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Instructor protected */}
         <Route element={<ProtectedRoute allowedRoles={["Instructor"]} />}>
          <Route element={<InstructorLayout />}>
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/account" element={<InstructorAccount />} />

            <Route path="/instructor/courses" element={<InstructorCourses />} />
            
            <Route path="/instructor/courses/new" element={<InstructorCourseNew />} />
            <Route path="/instructor/courses/:courseId/quizzes/:quizId/questions" element={<InstructorQuizQuestions />} />
            <Route
                  path="/instructor/courses/:courseId/quizzes/new"
                  element={<InstructorQuizNew />}
                />

            
<Route path="/instructor/courses/:courseId/quizzes/:quizId/view" element={<InstructorQuizView />} />


            <Route path="/instructor/courses/:courseId/edit" element={<InstructorCourseEdit />} />
            <Route path="/instructor/courses/:courseId/lessons/new" element={<InstructorLessonNew />} />
            <Route path="/instructor/courses/:courseId/view" element={<InstructorCourseView />} />

            <Route path="/instructor/courses/:id/quiz-builder" element={<QuizBuilderWrapper />} />
          </Route>
        </Route> 

         
            <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<StudentEnrollment />} />
            <Route path="/student/course/:courseId" element={<StudentLessons/>}></Route>
            <Route path="/student/review/:courseId" element={<StudentReview />} />
            <Route path="/student/quiz/:quizId/take" element={<StudentQuizPage />} />
            <Route path="/student/quiz/:quizId/history" element={<StudentQuizHistory />} />
    {/* <Route path="/student/courses/:courseId/certificate"  element={<StudentCertificateWrapper />} /> */}
          {/* <Route path="/student/verify" element={<StudentCertificateVerify />} />
        <Route path="/student/verify/:verificationCode" element={<CertificateVerifyWrapper />} /> */}
          {/* Certificate Routes */}
          <Route path="/student/certificates" element={<StudentCertificates />} />
          <Route path="/student/certificates/:certificateId" element={<CertificateDetailWrapper />} />
          <Route path="/student/courses/:courseId/certificate" element={<CertificateResultWrapper />} />

<Route path="/student/courses/:courseId/summary" element={<StudentSummarizerWrapper />} />
            </Route>
          
        

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
