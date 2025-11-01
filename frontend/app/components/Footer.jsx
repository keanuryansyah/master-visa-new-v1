import '../styles/footer-section.scss';
import Image from "next/image"; // Impor komponen Image

// --- LETAKKAN KODE IKON INI DI LUAR KOMPONEN UTAMA ---

const IconInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const IconYoutube = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
);
const IconFacebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

export default function Footer() {
    return (
        <footer id="main-footer" className="section">
        <div className="container">
            <div className="footer-content">
            <div className="footer-col" id="footer-col-1">
                <Image 
                src="/images/logo-white.png" // Pastikan Anda punya logo versi putih
                alt="MasterVisa Logo"
                width={200}
                height={50}
                />
                <p className="tagline">Solusi Mudah dan Cepat Urus Visa</p>
                <div className="social-icons">
                <a href="#" aria-label="Instagram"><IconInstagram /></a>
                <a href="#" aria-label="YouTube"><IconYoutube /></a>
                <a href="#" aria-label="Facebook"><IconFacebook /></a>
                </div>
            </div>

            <div className="footer-col" id="footer-col-2">
                <h4>Company</h4>
                <ul>
                <li><a href="#">Layanan Kami</a></li>
                <li><a href="#">Terms of Services</a></li>
                <li><a href="#">Blog</a></li>
                </ul>
            </div>

            <div className="footer-col" id="footer-col-3">
                <h4>Hubungi Kami</h4>
                <p>
                Ruko Jatiwaringin Junction 2nd Floor Blok A<br />
                Jl Raya Jatiwaringin No 24 Jakarta Timur 13620
                </p>
                <div className="contact-list">
                <p>Admin 1: +62 859-2500-0659</p>
                <p>Admin 2: +62 889-0552-6131</p>
                <p>Admin 3: +62 857-1940-3976</p>
                <p>Admin 4: +62 852-8006-3980</p>
                </div>
            </div>
            </div>
            <div className="footer-bottom">
            <p>© 2025 Master Visa. All rights reserved.</p>
            </div>
        </div>
        </footer>
    )
}