"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CtaSection from "../../components/CtaSection"; // Path relatif dari [slug]/[packageSlug]/
import "./detail-page.scss";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_URL = "";

// --- Helper Components ---
const formatRupiah = (number) => {
  if (typeof number !== "number") return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
const IconCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: 20, height: 20 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  // ✨ [DIPERBAIKI] Mengambil 'slug' dan menamainya 'countrySlug' untuk kejelasan
  const { slug: countrySlug, packageSlug } = params;

  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [personCount, setPersonCount] = useState(1);
  const [subtotal, setSubtotal] = useState(0);
  const downPayment = 800000;

  useEffect(() => {
    if (!countrySlug || !packageSlug) return;

    const fetchPackage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Panggil endpoint API yang benar: /api/packages/[countrySlug]/[packageSlug]
        const res = await fetch(
          `${API_URL}/api/packages/${countrySlug}/${packageSlug}`
        );
        if (!res.ok) throw new Error("Package not found.");
        const data = await res.json();
        setPackageData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [countrySlug, packageSlug]);

  useEffect(() => {
    if (packageData) {
      setSubtotal(downPayment * personCount);
    }
  }, [personCount, packageData]);

  const handleCountChange = (amount) => {
    setPersonCount((prev) => Math.max(1, prev + amount));
  };

  if (isLoading)
    return (
      <div
        className="loading-state"
        style={{ textAlign: "center", padding: "5rem", fontSize: "1.2rem" }}
      >
        Loading Package Details...
      </div>
    );
  if (error)
    return (
      <div
        className="error-state"
        style={{ textAlign: "center", padding: "5rem", color: "red" }}
      >
        Error: {error}
      </div>
    );
  if (!packageData)
    return (
      <div
        className="error-state"
        style={{ textAlign: "center", padding: "5rem" }}
      >
        Package not found.
      </div>
    );

  let services = { services: [] };
  try {
    services =
      typeof packageData.weServe === "string"
        ? JSON.parse(packageData.weServe)
        : packageData.weServe;
  } catch (e) {
    console.error("Failed to parse weServe JSON:", packageData.weServe);
  }

  return (
    <>
      <section id="detail-package-section" className="section high">
        <div className="container">
          <div className="detail-package-content">
            <div className="col-1">
              <button onClick={() => router.back()} className="back-link">
                <ArrowLeftIcon /> Kembali
              </button>
              <div className="col-1-row-2">
                <span className="country-tag">{packageData.country.name}</span>
                <h3 className="package-title">{packageData.title}</h3>
                <p className="package-description">{packageData.description}</p>
                <ul className="services-list">
                  <p>Kami melayani:</p>
                  {services.services?.map((service, index) => (
                    <li className="service-item" key={index}>
                      <IconCheck />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-1-row-3">
                <h4>Pricing</h4>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>1</th>
                      <th>2</th>
                      <th>3–6</th>
                      <th>&gt;7</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Price per person</td>
                      <td>{formatRupiah(packageData.price1)}</td>
                      <td>{formatRupiah(packageData.price2)}</td>
                      <td>{formatRupiah(packageData.price3_6)}</td>
                      <td>{formatRupiah(packageData.price7plus)}</td>
                    </tr>
                    <tr>
                      <td>Down payment</td>
                      <td colSpan="4">
                        {formatRupiah(downPayment)} / applicant
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-2">
              <aside className="sidebar">
                <div className="checkout-box">
                  <h4>Berapa banyak orang yang akan mendaftar?</h4>
                  <div className="number-stepper">
                    <button
                      onClick={() => handleCountChange(-1)}
                      disabled={personCount <= 1}
                    >
                      -
                    </button>
                    <input type="text" value={personCount} readOnly />
                    <button onClick={() => handleCountChange(1)}>+</button>
                  </div>
                  <div className="subtotal">
                    <p>
                      Subtotal <span>Down Payment (DP)</span>
                    </p>
                    <h3>{formatRupiah(subtotal)}</h3>
                  </div>
                  <button className="checkout-btn">Checkout</button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
