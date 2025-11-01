// Jika Client Component, tambahkan "use client"
"use client";
import Image from "next/image"; // Impor komponen Image

export default function Header() {
  return (
    <header id="header-section" className="section">
      <div className="container">
        <a href="/">
        <Image
          className="logo"
          src="/images/logo.png" // Path relatif dari folder public
          alt="Master Visa Logo"
          width={150}
          height={50}
          />{" "}
          </a>
        <nav>
          <ul>
            <li>
              <a href="/service-list">List Layanan Visa</a>
            </li>
            <li>
              <a href="/cara-kerja">Cara Kerja</a>
            </li>
            <li>
              <a href="/testimoni">Testimoni</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/blog">Blog</a>
            </li>
          </ul>
        </nav>
        <div className="burger-menu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
}
