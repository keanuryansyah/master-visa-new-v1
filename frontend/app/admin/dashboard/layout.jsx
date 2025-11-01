"use client";
import "../styles/admin-layout.scss";
import AdminSidebar from "../../../components/AdminSidebar";
import AdminNavbar from "../../../components/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <main className="admin-main-content">
        {children} {/* Ini akan merender page.jsx atau halaman lainnya */}
      </main>
    </div>
  );
}
