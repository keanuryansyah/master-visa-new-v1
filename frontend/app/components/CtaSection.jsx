import '../styles/cta-section.scss';

export default function CtaSection() {
  return (
    // CTA SECTION
    <section id="cta-section" className="section">
      <div className="container">
        <div className="cta-content">
          <h2 className="section-title cta-title">
            Mulai Pengajuan dan Segera Dapatkan Visa Anda!
          </h2>
          <div className="buttons-wrapper">
            <a href="#" className="cta-btn global-btn">
              List Negara
            </a>
            <a href="#" className="cta-btn solid-btn global-btn">
              Konsultasi Gratis
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
