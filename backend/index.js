import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// 1. Pastikan semua file rute diimpor
import adminRoutes from "./routes/admin.routes.js";
import countryRoutes from "./routes/countries.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import packageRoutes from "./routes/packages.routes.js"; // <-- PASTIKAN INI ADA

const app = express();

// Konfigurasi CORS
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// 2. Jadikan folder 'public' dapat diakses secara publik
// Baris ini PENTING agar gambar yang di-upload bisa ditampilkan
app.use(express.static('public'));

// Middleware lain
app.use(express.json());
app.use(cookieParser());

// 3. Daftarkan SEMUA rute Anda
app.use("/admin", adminRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/upload", uploadRoutes); // <-- INI YANG PALING PENTING & KEMUNGKINAN BESAR HILANG
app.use("/api/packages", packageRoutes); // <-- DAN PASTIKAN INI JUGA ADA


// Rute testing
app.get("/", (req, res) => {
    res.send("✅ Backend API aktif dan berjalan di port 4000");
});

app.listen(4000, () => console.log("🚀 Server running at http://localhost:4000"));