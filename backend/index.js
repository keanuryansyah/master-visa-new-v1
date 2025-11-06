import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// 1. Pastikan semua file rute diimpor
import adminRoutes from "./routes/admin.routes.js";
import countryRoutes from "./routes/countries.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import packageRoutes from "./routes/packages.routes.js";

const app = express();
app.use(express.urlencoded({ extended: true }));

// --- PERBAIKAN CORS ADA DI SINI ---

// Daftar domain yang diizinkan untuk mengakses API Anda
const allowedOrigins = [
  "http://localhost:3000", // Untuk development di lokal
  "http://localhost:4000", // Untuk development di lokal
  "https://mastervisaku.com", // Untuk domain produksi utama
  "https://www.mastervisaku.com", // Untuk domain produksi dengan 'www'
  "http://145.79.13.228",
  "http://145.79.13.228:8484",
  "http://145.79.13.228:4000",
  "https://be.mastervisaku.com",
];

// Konfigurasi CORS baru yang lebih cerdas
app.use(
  cors({
    origin: function (origin, callback) {
      // Izinkan jika origin (sumber permintaan) ada di dalam daftar di atas
      // atau jika tidak ada origin sama sekali (misalnya dari aplikasi seperti Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Origin tidak diizinkan oleh kebijakan CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- AKHIR DARI PERBAIKAN CORS ---

// 2. Jadikan folder 'public' dapat diakses secara publik
// Baris ini PENTING agar gambar yang di-upload bisa ditampilkan
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("Static uploads path:", path.join(__dirname, "public/uploads"));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Middleware lain
app.use(express.json());
app.use(cookieParser());

// 3. Daftarkan SEMUA rute Anda
app.use("/api/admin", adminRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/packages", packageRoutes);

// Rute testing
app.get("/", (req, res) => {
  res.send("✅ Backend API aktif dan berjalan di port 4000");
});

app.listen(4000, () =>
  console.log("🚀 Server running at http://localhost:4000")
);
