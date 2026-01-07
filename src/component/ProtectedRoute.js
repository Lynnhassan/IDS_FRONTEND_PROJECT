import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) return <Navigate to="/login" replace />;

  const role = (user.role || "").trim().toLowerCase();
  const allowed = (allowedRoles || []).map((r) => r.trim().toLowerCase());

  if (allowed.length > 0 && !allowed.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
