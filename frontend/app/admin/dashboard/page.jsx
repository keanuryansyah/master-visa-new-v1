"use client";
import { useState } from "react";
import Link from "next/link";
import "./dashboard.scss";

// Komponen Ikon sederhana
const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.25 9.75l17.5 0M9.75 21a15.046 15.046 0 01-4.25-9.75 15.046 15.046 0 014.25-9.75M14.25 3a15.046 15.046 0 014.25 9.75 15.046 15.046 0 01-4.25 9.75"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
    />
  </svg>
);

export default function AdminDashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
        }/admin/logout`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) throw new Error("Logout failed.");
      window.location.href = "/admin/login";
    } catch (err) {
      alert(err.message);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="header">
        <h1>Admin Dashboard</h1>
      </div>

      <p className="dashboard-subtitle">
        Select a category to manage your content.
      </p>

      <div className="dashboard-grid">
        <Link href="/admin/dashboard/countries" className="dashboard-card">
          <div className="card-icon">
            <GlobeIcon />
          </div>
          <h3>Manage Countries</h3>
          <p>Add, edit, or delete supported countries for visa applications.</p>
        </Link>
        {/* Tambahkan kartu lain di sini */}
      </div>

      {/* Logout di bawah */}
      <button
        className="btn-logout-bottom"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        <LogoutIcon />
      </button>
    </div>
  );
}
