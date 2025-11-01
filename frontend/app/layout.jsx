import "./styles/global.scss"; // Impor global SCSS
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "Master Visa",
  description: "Pemesanan visa luar negeri",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"></link>

        {/* Flag Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css"
        />

        {/* Font  Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        ></script>
      </body>
    </html>
  );
}
