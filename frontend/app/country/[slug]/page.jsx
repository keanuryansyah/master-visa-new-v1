"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image"; // Kita akan gunakan untuk logo
import "./.scss"; // Ganti nama file SCSS agar lebih deskriptif

// Komponen ikon centang kecil
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function LayananDetailPage() {
  const params = useParams();
  const { slug } = params;

  const [countryData, setCountryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchCountryData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/country/${slug}`);
          if (!response.ok) throw new Error("Country not found");
          const data = await response.json();
          setCountryData(data);
        } catch (error) {
          console.error("Failed to fetch country data:", error);
          setCountryData(null); // Set ke null jika ada error
        } finally {
          setIsLoading(false);
        }
      };
      fetchCountryData();
    }
  }, [slug]);

  if (isLoading) {
    return <div className="page-state">Loading...</div>;
  }

  if (!countryData) {
    return <div className="page-state">Halaman tidak ditemukan.</div>;
  }

  return (
    <main>
      {/* HERO SECTION UNTUK DETAIL NEGARA */}
      <section 
        id="layanan-hero" 
        style={{ backgroundImage: `url(${countryData.image})` }}
      >
        <div className="hero-overlay">
          <div className="container">
            {/* Header placeholder - Anda bisa ganti dengan komponen Header asli */}
            <div className="header-placeholder">
                <Image src="/images/logo-white.png" alt="MasterVisa Logo" width={150} height={30} />
                <nav>
                    <a href="#">List Layanan Visa</a>
                    <a href="#">Cara Kerja</a>
                    <a href="#">Testimoni</a>
                    <a href="#">FAQ</a>
                    <a href="#">Blog</a>
                </nav>
            </div>
            <h1>{countryData.name}</h1>
          </div>
        </div>
      </section>

      {/* SECTION DAFTAR PAKET VISA */}
      <section id="package-list-section">
        <div className="container">
          <div className="packages-grid">
            {countryData.packages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                <div className="card-header">
                  <span className="country-tag">{countryData.name}</span>
                </div>
                <div className="card-body">
                  <h3>{pkg.title}</h3>
                  <p className="description">{pkg.description}</p>
                  
                  <div className="we-serve">
                    <h4>Kami melayani:</h4>
                    <ul>
                      {Array.isArray(pkg.weServe) && pkg.weServe.map((item, index) => (
                        <li key={index}><CheckIcon /> {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="card-footer">
                  <span>Mulai dari</span>
                  <p className="price">Rp {pkg.price1.toLocaleString('id-ID')}</p>
                  {/* Di sini, tombol bisa mengarah ke halaman booking spesifik */}
                  {/* Contoh: <Link href={`/booking/${pkg.id}`}> */}
                  <a href="#" className="book-btn">Pesan Paket Ini</a>
                </div>
              </div>
            ))}
            {/* Duplikasi untuk memenuhi UI di gambar */}
            {countryData.packages.map((pkg) => (
              <div key={`${pkg.id}-dup`} className="package-card">
                 {/* ... Konten kartu sama persis seperti di atas ... */}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}