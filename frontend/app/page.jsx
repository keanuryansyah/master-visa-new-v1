"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Import semua file styling Anda
import "./styles/home-hero-section.scss";
import "./styles/review-section.scss";
import "./styles/list-country-section.scss";
import "./styles/why-us-section.scss";
import "./styles/faq-section.scss";
import "./styles/insights-section.scss";
import "flag-icons/css/flag-icons.min.css";

// Import komponen
import CtaSection from "./components/CtaSection";
import SearchBar from "./components/SearchBar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_URL = "";

// Komponen Ikon
const IconChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
const IconCheckCircle = () => (
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
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
export default function Home() {
  // Data statis untuk review
  const reviewsRow1 = [
    {
      flag: "fi fi-au",
      text: "Awalnya ribet banget ngurus visa, tapi setelah pakai MasterVisaku semua jadi simple.",
      name: "D** L**",
    },
    {
      flag: "fi fi-fr",
      text: "Tenang banget pake MasterVisaku, nggak worry sama sekali. Service mantap!",
      name: "G** U**",
    },
    {
      flag: "fi fi-cn",
      text: "Semua beres rapi, profesional, nggak pake drama. Highly recommended.",
      name: "M** A**",
    },
    {
      flag: "fi fi-kr",
      text: "Alhamdulillah, visa beres tanpa ribet. Tim MasterVisaku super helpful!",
      name: "T** H**",
    },
    {
      flag: "fi fi-jp",
      text: "MasterVisaku bikin proses visa jadi gampang, cepat, dan jelas. Top banget!",
      name: "S** F**",
    },
    {
      flag: "fi fi-my",
      text: "Staffnya komunikatif banget, semua pertanyaan dijawab jelas dan sabar.",
      name: "N** P**",
    },
    {
      flag: "fi fi-nz",
      text: "Ngurus visa ke New Zealand jadi gampang banget, terima kasih MasterVisaku!",
      name: "H** K**",
    },
    {
      flag: "fi fi-id",
      text: "Layanannya cepet banget dan hasilnya memuaskan. Recommended!",
      name: "B** A**",
    },
    {
      flag: "fi fi-it",
      text: "Visa ke Italia jadi mudah dan dokumen saya diurus rapi banget.",
      name: "F** G**",
    },
    {
      flag: "fi fi-ae",
      text: "Dapat update rutin dari tim, bikin tenang selama nunggu proses.",
      name: "Y** M**",
    },
  ];
  const reviewsRow2 = [
    {
      flag: "fi fi-sg",
      text: "Cepat banget prosesnya, cuma beberapa hari visa langsung jadi.",
      name: "K** T**",
    },
    {
      flag: "fi fi-us",
      text: "Proses mudah dan timnya responsif. Recommended banget!",
      name: "A** Z**",
    },
    {
      flag: "fi fi-gb",
      text: "Pelayanan ramah, dokumen lengkap dan jelas. Mantap!",
      name: "J** W**",
    },
    {
      flag: "fi fi-de",
      text: "Suka banget sama transparansi dan kecepatan layanannya.",
      name: "L** P**",
    },
    {
      flag: "fi fi-th",
      text: "MasterVisaku sangat membantu untuk visa liburan keluarga saya.",
      name: "R** S**",
    },
    {
      flag: "fi fi-hk",
      text: "Pasti bakal pakai lagi kalau nanti mau apply visa ke negara lain.",
      name: "E** Q**",
    },
    {
      flag: "fi fi-ph",
      text: "Harga kompetitif, pelayanan bintang lima. Sangat puas!",
      name: "C** D**",
    },
    {
      flag: "fi fi-nl",
      text: "Dari awal konsultasi sampai visa jadi, semuanya mulus banget.",
      name: "O** R**",
    },
    {
      flag: "fi fi-vn",
      text: "Timnya teliti banget, nggak ada dokumen yang kurang. Keren!",
      name: "P** T**",
    },
    {
      flag: "fi fi-ca",
      text: "Visa Kanada saya approved tanpa revisi sama sekali. Mantap!",
      name: "W** L**",
    },
  ];

  // useEffect untuk animasi review
  useEffect(() => {
    const rows = document.querySelectorAll(".review-track");
    if (!rows.length) return;

    rows.forEach((track) => {
      let offset = 0;
      const speed = track.classList.contains("reverse") ? -0.4 : 0.4;
      let animationFrameId;

      function animate() {
        offset += speed;
        track.style.transform = `translateX(${offset}px)`;

        const first = track.children[0];
        if (!first) return;

        const cardWidth = first.offsetWidth + 16;
        if (speed > 0 && offset >= cardWidth) {
          track.appendChild(first);
          offset -= cardWidth;
        } else if (speed < 0 && Math.abs(offset) >= cardWidth) {
          track.prepend(track.children[track.children.length - 1]);
          offset += cardWidth;
        }
        animationFrameId = requestAnimationFrame(animate);
      }
      animate();

      return () => cancelAnimationFrame(animationFrameId);
    });
  }, []);

  // ✨ [DIUBAH] Data negara sekarang diambil dari API
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✨ [BARU] useEffect untuk mengambil data negara dari backend
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/countries`);
        if (!res.ok) throw new Error("Could not fetch countries data.");
        const data = await res.json();
        setCountries(data.slice(0, 8));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching countries:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Data statis untuk FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const faqData = [
    {
      question: "Berapa lama proses pengajuan visa melalui MasterVisa?",
      answer:
        "Proses pengajuan visa berbeda-beda tergantung pada jenis visa dan kedutaan negara tujuan. Kami akan memberikan estimasi waktu yang lebih tepat setelah konsultasi awal.",
    },
    {
      question: "Apakah MasterVisa menjamin visa saya diterima?",
      answer:
        "Kami menjamin kelengkapan dan keakuratan dokumen sesuai persyaratan. Namun, keputusan akhir persetujuan visa sepenuhnya merupakan wewenang pihak kedutaan.",
    },
    {
      question: "Bagaimana cara pembayaran untuk layanan MasterVisa?",
      answer:
        "Kami menerima berbagai metode pembayaran, termasuk transfer bank, kartu kredit, dan dompet digital untuk memudahkan transaksi Anda.",
    },
    {
      question: "Apa saja dokumen yang diperlukan untuk pengajuan visa?",
      answer:
        "Dokumen umum meliputi paspor, foto, bukti keuangan, dan formulir aplikasi. Persyaratan spesifik akan kami informasikan sesuai negara tujuan Anda saat konsultasi.",
    },
    {
      question: "Bagaimana cara mengajukan visa melalui MasterVisa?",
      answer:
        "Cukup hubungi kami untuk konsultasi awal, kirimkan dokumen yang diperlukan, dan tim kami akan menangani seluruh proses pengajuan hingga selesai.",
    },
    {
      question: "Negara mana saja yang bisa dibantu MasterVisa?",
      answer:
        "Kami dapat membantu pengurusan visa untuk lebih dari 100 negara di seluruh dunia. Hubungi tim kami untuk menanyakan negara tujuan spesifik Anda.",
    },
    {
      question: "Apakah MasterVisa aman untuk mengurus data pribadi saya?",
      answer:
        "Tentu. Keamanan dan kerahasiaan data pribadi Anda adalah prioritas utama kami. Semua informasi dikelola secara profesional dan aman.",
    },
  ];
  const handleFaqClick = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Data statis untuk Insight
  const insightsData = [
    {
      image: "/images/insight-1.png",
      title: "Tips Supaya Pengajuan Visa Anda Mudah Diterima",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    },
    {
      image: "/images/insight-2.png",
      title: "Persyaratan Baru untuk Pengajuan Visa ke Jepang",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    },
    {
      image: "/images/insight-3.png",
      title: "Hal Penting yang Perlu Anda Siapkan Sebelum ke Korea",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    },
  ];
  return (
    <>
      {/* HERO SECTION */}
      <section id="home-hero-section" className="section">
        <div className="container">
          <div className="hero-content">
            <span className="tagline">MasterVisaku</span>
            <h1 className="section-title">
              Daftar Visa Mudah, Aman & Terpercaya
            </h1>
            <div className="home-hero-desc">
              <div className="col-1 col">
                <span>99%</span>
                <span>Approval Rate</span>
              </div>
              <div className="col-2 col">
                <span>20k+</span>
                <span>Visa Approved</span>
              </div>
              <div className="col-3 col">
                <span>100+</span>
                <span>Negara Tujuan</span>
              </div>
              <div className="col-4 col">
                <div className="col-row">
                  <Image
                    src="/images/home-hero-icon-1.png"
                    alt="Dokumen"
                    width={36}
                    height={36}
                  />
                  <span>Dokumen Persyaratan Lengkap Disiapkan</span>
                </div>
                <div className="col-row">
                  <Image
                    src="/images/home-hero-icon-2.png"
                    alt="Online"
                    width={36}
                    height={36}
                  />
                  <span>Pengajuan Online Tanpa Repot ke Kedutaan</span>
                </div>
                <div className="col-row">
                  <Image
                    src="/images/home-hero-icon-3.png"
                    alt="Flight Hotel"
                    width={36}
                    height={36}
                  />
                  <span>Booking Flight & Hotel Tersedia</span>
                </div>
              </div>
            </div>
            <div className="buttons">
              <a href="#" className="global-btn transparent-btn">
                List Negara
              </a>
              <a href="#" className="global-btn purple-btn">
                Konsultasi Gratis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEW SECTION */}
      <section id="review-section" className="section high">
        <div className="container">
          <div className="review-content">
            <span className="tagline">20.000+ Visa Approved</span>
            <h2 className="section-title">Tentang Layanan MasterVisa</h2>

            <div className="review-row">
              <div className="review-track">
                {[...reviewsRow1, ...reviewsRow1].map((item, i) => (
                  <div className="review-card" key={i}>
                    <span className={item.flag + " flag"}></span>
                    <p>&quot;{item.text}&quot;</p>
                    <span>— {item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="review-row reverse">
              <div className="review-track reverse">
                {[...reviewsRow2, ...reviewsRow2].map((item, i) => (
                  <div className="review-card" key={i}>
                    <span className={item.flag + " flag"}></span>
                    <p>&quot;{item.text}&quot;</p>
                    <span>— {item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTRY LIST SECTION */}
      <section id="country-list-section" className="section high">
        <div className="container">
          <div className="country-list-content">
            <h2 className="section-title">Mulai Perjalanan Anda Dari Sini</h2>
            <SearchBar />

            <div className="country-grid">
              {isLoading && (
                <p style={{ textAlign: "center", gridColumn: "1 / -1" }}>
                  Loading countries...
                </p>
              )}
              {error && (
                <p
                  style={{
                    textAlign: "center",
                    color: "red",
                    gridColumn: "1 / -1",
                  }}
                >
                  Error: {error}
                </p>
              )}

              {countries.map((country) => {
                console.log(API_URL + country.featuredImage);

                return (
                  <div
                    className="country-card"
                    key={country.id}
                    style={{
                      backgroundImage: `url(${
                        API_URL + country.featuredImage
                      })`,
                    }}
                  >
                    <div className="card-content">
                      <h3>{country.name}</h3>
                      <div className="card-buttons">
                        <Link
                          href={`/${country.slug}/packages`}
                          className="global-btn card-btn btn-requirement"
                        >
                          Persyaratan
                        </Link>
                        <Link
                          href={`/${country.slug}/packages`}
                          className="global-btn card-btn btn-booking"
                        >
                          Booking
                          <div>
                            <i className="fa-solid fa-arrow-right"></i>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="consultation-prompt">
              Ingin ke Negara Lainnya? Konsultasikan dengan Tim Kami!
            </p>
            <a href="#" className="global-btn purple-btn">
              Konsultasi Gratis
            </a>
          </div>
        </div>
      </section>
      {/* WHY US SECTION */}
      <section id="why-us-section" className="section high">
        <div className="container">
          <div className="why-us-content">
            <div className="features-column">
              <h2 className="section-title">
                Mengapa Memilih <span className="col-purple">Master</span>
                <span className="col-blue">Visa</span>?
              </h2>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="icon-wrapper">
                    <img src="/images/icon-1.png" alt="" />
                  </div>
                  <div className="text-content">
                    <h3>Dokumen Lengkap by MasterVisaku</h3>
                    <p>
                      Dummy tiket & hotel? Santai, semua udah disiapin
                      MasterVisaku biar syarat visamu aman.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="icon-wrapper">
                    <img src="/images/icon-2.png" alt="" />
                  </div>
                  <div className="text-content">
                    <h3>Simple ala MasterVisaku</h3>
                    <p>
                      Urus visa jadi gampang banget—dari dokumen sampai approve,
                      semua beres di tangan kita.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="icon-wrapper">
                    <img src="/images/icon-3.png" alt="" />
                  </div>
                  <div className="text-content">
                    <h3>Privasi Dijaga MasterVisaku</h3>
                    <p>
                      Data pribadi kamu 100% aman, karena kepercayaan kamu
                      prioritas buat MasterVisaku.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="icon-wrapper">
                    <img src="/images/icon-4.png" alt="" />
                  </div>
                  <div className="text-content">
                    <h3>MasterVisaku Bisa ke Mana Aja</h3>
                    <p>
                      100+ negara bisa kamu tuju, approval rate tinggi bikin
                      Kamu jalan lebih tenang.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="icon-wrapper">
                    <img src="/images/icon-5.png" alt="" />
                  </div>
                  <div className="text-content">
                    <h3>Konsultasi Gratis bareng MasterVisaku</h3>
                    <p>
                      Tanya apa aja soal visa, tim expert MasterVisaku selalu
                      siap jawab tanpa ribet.
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="icon-wrapper">
                    <img src="/images/icon-6.png" alt="" />
                  </div>
                  <div className="text-content">
                    <h3>Full Support dari MasterVisaku</h3>
                    <p>
                      Mulai itinerary sampe dokumen pendukung, semua dipastikan
                      ready biar visamu lancar jaya.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="how-it-works-column">
              <h3>CARA KERJA</h3>
              <ul className="timeline">
                <li className="timeline-item">
                  <div className="timeline-icon">
                    <IconCheckCircle />
                  </div>
                  <div className="timeline-content">
                    <h4>Konsultasi Awal</h4>
                    <p>
                      Hubungi MasterVisaku untuk konsultasi gratis mengenai
                      jenis visa yang sesuai dengan kebutuhan perjalananmu.
                    </p>
                  </div>
                </li>
                <li className="timeline-item">
                  <div className="timeline-icon">
                    <IconCheckCircle />
                  </div>
                  <div className="timeline-content">
                    <h4>Pengumpulan Dokumen</h4>
                    <p>
                      Kirimkan dokumen persyaratan, tim MasterVisaku akan cek
                      kelengkapannya biar nggak ada yang kelewat.
                    </p>
                  </div>
                </li>
                <li className="timeline-item">
                  <div className="timeline-icon">
                    <IconCheckCircle />
                  </div>
                  <div className="timeline-content">
                    <h4>Proses Pengajuan Visa</h4>
                    <p>
                      Visa kamu langsung kami proses sesuai aturan kedutaan yang
                      berlaku—aman, cepat, dan terjamin.
                    </p>
                  </div>
                </li>
                <li className="timeline-item">
                  <div className="timeline-icon">
                    <IconCheckCircle />
                  </div>
                  <div className="timeline-content">
                    <h4>Visa Selesai & Siap Dipakai</h4>
                    <p>
                      Setelah approve, visamu siap digunakan. Bisa diambil
                      langsung atau dikirim ke alamatmu.
                    </p>
                  </div>
                </li>
              </ul>
              <a href="#" className="consultation-btn global-btn">
                Mulai Konsultasi
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ SECTION */}
      <section id="faq-section" className="section high">
        <div className="container">
          <div className="faq-content">
            <div className="faq-intro">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <a href="#" className="faq-btn global-btn">
                Tanya ke Visa Expert
              </a>
            </div>
            <div className="faq-accordion">
              {faqData.map((item, index) => (
                <div
                  className={`accordion-item ${
                    openFaqIndex === index ? "active" : ""
                  }`}
                  key={index}
                >
                  <div
                    className="accordion-header"
                    onClick={() => handleFaqClick(index)}
                  >
                    <p>{item.question}</p>
                    <div className="chevron-icon">
                      <IconChevronDown />
                    </div>
                  </div>
                  <div className="accordion-body">
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* INSIGHTS SECTION */}
      <section id="insights-section" className="section high">
        <div className="container">
          <div className="insights-content">
            <h2 className="section-title">
              <span className="col-purple">Master</span>
              <span className="col-blue">Visa</span> Travel Insights
            </h2>
            <div className="insights-grid">
              {insightsData.map((insight, index) => (
                <div className="insight-card" key={index}>
                  <div className="card-image">
                    <Image
                      src={insight.image}
                      alt={insight.title}
                      width={400}
                      height={250}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-text">
                    <h3>{insight.title}</h3>
                    <p>{insight.description}</p>
                    <a href="#">Read more </a>
                  </div>
                </div>
              ))}
            </div>
            <a href="#" className="global-btn transparent-btn read-more-btn">
              Baca Lebih Banyak
            </a>
          </div>
        </div>
      </section>

      {/* CTA SECTIOM */}
      <CtaSection />
    </>
  );
}
