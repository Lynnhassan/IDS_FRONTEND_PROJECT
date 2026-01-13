import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";
import reportWebVitals from "./reportWebVitals";

import SplashScreen from "./component/Splash/SplashScreen";
import Login from "./component/Authentication/Login";
import SignUp from "./component/Authentication/SignUp";

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
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Instructor protected */}
        {/* <Route element={<ProtectedRoute allowedRoles={["Instructor"]} />}>
          <Route element={<InstructorLayout />}>
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/courses" element={<InstructorCourses />} />
            <Route path="/instructor/courses/new" element={<InstructorCourseNew />} />
            <Route path="/instructor/courses/:courseId/edit" element={<InstructorCourseEdit />} />
            <Route path="/instructor/courses/:courseId/lessons/new" element={<InstructorLessonNew />} />
            <Route path="/instructor/courses/:courseId/view" element={<InstructorCourseView />} />


          </Route>
        </Route> */}

         
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<StudentEnrollment />} />
              <Route path="/student/course/:courseId" element={<StudentLessons/>}></Route>
              <Route path="/student/review/:courseId" element={<StudentReview />} />
            </Route>
          
        

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
