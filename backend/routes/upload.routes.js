import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Tentukan folder penyimpanan
    },
    filename: function (req, file, cb) {
        // Buat nama file yang unik untuk menghindari duplikasi
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

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

    // Jika upload berhasil, kembalikan URL publik dari file tersebut
    // Contoh: http://localhost:4000/uploads/featuredImage-1678886400000.jpg
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.status(201).json({
        message: 'File uploaded successfully',
        imageUrl: imageUrl,
    });
});

export default router;