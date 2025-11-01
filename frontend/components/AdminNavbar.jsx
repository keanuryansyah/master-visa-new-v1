export default function AdminNavbar() {
  // Di masa depan, Anda bisa mengambil nama admin dari state atau context
  const adminName = "Admin User";

  return (
    <header className="admin-navbar">
      <div className="user-profile">
        Welcome, {adminName}
        {/* Di sini bisa ditambahkan tombol Logout */}
      </div>
    </header>
  );
}
