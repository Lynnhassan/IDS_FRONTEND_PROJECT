import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "./AdminDashboard.css";

export default function AdminLayout() {
  return (
    <div className="md2">
      <AdminSidebar />
      <main className="md2-main">
        <Outlet />
      </main>
    </div>
  );
}
