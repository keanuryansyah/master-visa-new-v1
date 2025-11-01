"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // ✨ [BARU] Import komponen Link
import CtaSection from "../../components/CtaSection"; // Sesuaikan path jika berbeda
import "./packages-page.scss";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Fungsi helper untuk format Rupiah
const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// Komponen Ikon Centang untuk "Kami Melayani"
const IconCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function CountryPackagesPage() {
  const params = useParams();
  const { slug } = params;

  const [countryData, setCountryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const fetchCountryPackages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/countries/slug/${slug}`);
        if (!res.ok) throw new Error(`Could not find packages for '${slug}'.`);
        const data = await res.json();
        setCountryData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountryPackages();
  }, [slug]);

  if (isLoading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;
  if (!countryData)
    return <div className="error-state">Country not found.</div>;

  return (
    <>
      {/* HERO SECTION */}
      <section
        id="package-hero-section"
        style={{ backgroundImage: `url(${countryData.featuredImage})` }}
      >
        <div className="hero-content">
          <h1>{countryData.name}</h1>
        </div>
      </section>

      {/* PACKAGES LIST SECTION */}
      <section id="packages-list-section" className="section high">
        <div className="container">
          <div className="packages-grid">
            {countryData.packages.length > 0 ? (
              countryData.packages.map((pkg) => {
                let services = { services: [] };
                try {
                  services =
                    typeof pkg.weServe === "string"
                      ? JSON.parse(pkg.weServe)
                      : pkg.weServe;
                } catch (e) {
                  console.error("Failed to parse weServe JSON:", pkg.weServe);
                }

                return (
                  // ✨ [DIUBAH] Seluruh kartu dibungkus dengan komponen Link
                  <Link
                    href={`/${slug}/${pkg.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="package-card"
                    key={pkg.id}
                  >
                    <div>
                      <span className="country-tag">{countryData.name}</span>
                      <h3>{pkg.title}</h3>
                      <p className="description">{pkg.description}</p>

                      <p>Kami melayani:</p>
                      <ul className="services-list">
                        {services &&
                        services.services &&
                        services.services.length > 0 ? (
                          services.services.map((service, index) => (
                            <li className="service-item" key={index}>
                              <IconCheck /> <span>{service}</span>
                            </li>
                          ))
                        ) : (
                          <li className="service-item">
                            Informasi layanan tidak tersedia.
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <p className="price-label">Mulai dari</p>
                      <p className="price">{formatRupiah(pkg.price1)}</p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p>No packages are currently available for this country.</p>
            )}
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
