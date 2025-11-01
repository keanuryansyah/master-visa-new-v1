"use client";
import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">Master Visa</div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link href="/admin">Dashboard</Link>
          </li>
          <li>
            <Link href="/admin/countries">Manage Countries</Link>
          </li>
          <li>
            <Link href="/admin/packages">Manage Packages</Link>
          </li>
          {/* Tambahkan link navigasi lainnya di sini */}
        </ul>
      </nav>
    </aside>
  );
}
