import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

// --- PERBAIKAN UTAMA: Gunakan Path Absolut ---

// Baris ini mendapatkan path direktori saat ini (folder 'routes')
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Baris ini membuat path absolut ke folder 'public/uploads'
const uploadDirectory = path.join(__dirname, '../public/uploads');

// Baris ini memastikan folder tujuan benar-benar ada sebelum multer mencoba menulis
fs.mkdirSync(uploadDirectory, { recursive: true });

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Gunakan path absolut yang sudah kita definisikan
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        // Buat nama file yang unik untuk menghindari duplikasi
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
// --- AKHIR DARI PERBAIKAN ---


// Filter untuk hanya menerima file gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Definisikan endpoint POST untuk upload
// 'featuredImage' adalah nama field dari form di frontend
router.post('/', upload.single('featuredImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    // URL publik tidak boleh mengandung 'localhost'. Kita akan membuatnya relatif.
    // Frontend akan menggabungkannya dengan domain utama.
    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(201).json({
        message: 'File uploaded successfully',
        imageUrl: imageUrl, // Kirim URL relatif
    });
});

export default router;