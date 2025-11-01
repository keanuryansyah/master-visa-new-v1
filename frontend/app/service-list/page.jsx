"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "../styles/hero-service-section.scss";
import "../styles/service-list-section.scss";
import CtaSection from "../components/CtaSection";
import SearchBar from "../components/SearchBar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// --- Komponen untuk Tampilan "Corporate" (Formulir) ---
const CorporateView = () => (
  <form className="corporate-form">
    <div className="form-grid">
      <div className="form-group">
        <label htmlFor="namaLengkap">Nama Lengkap</label>
        <input type="text" id="namaLengkap" />
      </div>
      <div className="form-group">
        <label htmlFor="noHp">No. HP</label>
        <input type="text" id="noHp" />
      </div>
      <div className="form-group">
        <label htmlFor="namaPerusahaan">Nama Perusahaan</label>
        <input type="text" id="namaPerusahaan" />
      </div>
      <div className="form-group">
        <label htmlFor="negaraTujuan">Negara Tujuan</label>
        <select id="negaraTujuan">
          <option value="">Pilih negara tujuan</option>
          <option value="jepang">Jepang</option>
          <option value="korea">Korea</option>
          <option value="australia">Australia</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="jenisVisa">Jenis Visa</label>
        <select id="jenisVisa">
          <option value="">Pilih jenis visa</option>
          <option value="turis">Turis</option>
          <option value="bisnis">Bisnis</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="jumlahPerson">Jumlah Person</label>
        <div className="number-stepper">
          <button type="button">-</button>
          <input type="number" id="jumlahPerson" defaultValue="1" min="1" />
          <button type="button">+</button>
        </div>
      </div>
      <div className="form-group full-width">
        <label htmlFor="keterangan">Keterangan Tambahan</label>
        <textarea id="keterangan" rows="6"></textarea>
      </div>
    </div>
    <button type="submit" className="submit-btn">
      Dapatkan Penawaran
    </button>
  </form>
);

// --- Komponen Utama Halaman ---
export default function ServiceList() {
  const [activeView, setActiveView] = useState("individu");

  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeView === "individu") {
      const fetchCountries = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(`${API_URL}/api/countries`);
          if (!res.ok) throw new Error("Could not fetch countries data.");
          const data = await res.json();

          // ✨ [PERBAIKAN] Data tidak lagi diduplikasi
          setCountries(data);
        } catch (err) {
          setError(err.message);
          console.error("Error fetching countries:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCountries();
    }
  }, [activeView]);

  // --- Komponen untuk Tampilan "Individu" ---
  const IndividuView = ({ countries, isLoading, error }) => {
    if (isLoading)
      return (
        <p style={{ textAlign: "center", padding: "3rem" }}>
          Loading countries...
        </p>
      );
    if (error)
      return (
        <p style={{ textAlign: "center", color: "red", padding: "3rem" }}>
          Error: {error}
        </p>
      );

    return (
      <div className="country-grid">
        {countries.map((country) => (
          <div
            className="country-card"
            key={country.id} // Sekarang bisa menggunakan ID karena sudah unik
            style={{ backgroundImage: `url(${country.featuredImage})` }}
          >
            <div className="card-content">
              <h3>{country.name}</h3>
              <div className="card-buttons">
                <Link
                  href={`/${country.slug}/packages`}
                  className="card-btn btn-requirement"
                >
                  Persyaratan
                </Link>
                <Link
                  href={`/${country.slug}/packages`}
                  className="card-btn btn-booking"
                >
                  Booking
                  <div>
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section id="hero-service-section">
        <div className="container">
          <div className="hero-service-ctn">
            <h2 className="section-title">
              Keliling Dunia Nggak Perlu Repot Karena Ada MasterVisa
            </h2>
            <SearchBar />
          </div>
        </div>
      </section>

      <section id="service-list-section" className="section">
        <div className="container">
          <div className="view-toggle">
            <span
              className={activeView === "individu" ? "active" : ""}
              onClick={() => setActiveView("individu")}
            >
              Individu
            </span>
            <label className="switch">
              <input
                type="checkbox"
                onChange={() =>
                  setActiveView(
                    activeView === "individu" ? "corporate" : "individu"
                  )
                }
                checked={activeView === "corporate"}
              />
              <span className="slider"></span>
            </label>
            <span
              className={activeView === "corporate" ? "active" : ""}
              onClick={() => setActiveView("corporate")}
            >
              Corporate
            </span>
          </div>

          <div className="view-content">
            {activeView === "individu" ? (
              <IndividuView
                countries={countries}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <CorporateView />
            )}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
