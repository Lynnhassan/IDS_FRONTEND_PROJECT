import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import SignUp from './component/Authentication/SignUp';
import Login from './component/Authentication/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ================= Routing Component =================
const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Routing />);
