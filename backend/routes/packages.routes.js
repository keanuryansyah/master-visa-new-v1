import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Fungsi helper untuk mengubah slug kembali menjadi format Title Case
// contoh: 'single-entry' -> 'Single Entry'
const slugToTitle = (slug) => {
    if (!slug) return '';
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// =========================================================================
// RUTE PENGAMBILAN DATA (GET)
// =========================================================================

// GET: Mengambil semua paket untuk sebuah negara spesifik (berdasarkan ID, untuk admin panel)
router.get('/country/:countryId', async (req, res) => {
    const { countryId } = req.params;
    try {
        const packages = await prisma.package.findMany({
            where: { countryId: parseInt(countryId) },
            orderBy: { title: 'asc' },
        });
        const country = await prisma.country.findUnique({
            where: { id: parseInt(countryId) },
            select: { name: true },
        });
        res.json({ packages, countryName: country?.name || "Unknown" });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch packages', error: error.message });
    }
});

// ✨ [DIPERBAIKI DENGAN DEBUG] GET: Mengambil satu paket berdasarkan SLUG NEGARA dan SLUG PAKET
router.get('/:countrySlug/:packageSlug', async (req, res) => {
    const { countrySlug, packageSlug } = req.params;
    const packageTitle = slugToTitle(packageSlug);

    // ======================= DEBUG POINT =======================
    console.log("\n--- Menerima Permintaan Detail Paket ---");
    console.log("Timestamp:", new Date().toLocaleTimeString());
    console.log("Mencari dengan Slug Negara:", countrySlug);
    console.log("Mencari dengan Slug Paket:", packageSlug);
    console.log("Dikonversi menjadi Title Paket:", packageTitle);
    console.log("-----------------------------------------");
    // =========================================================

    try {
        const pkg = await prisma.package.findFirst({
            where: {
                title: packageTitle,
                country: {
                    slug: countrySlug,
                },
            },
            include: {
                country: { select: { name: true } },
            },
        });

        if (!pkg) {
            console.log("❌ Hasil Query: TIDAK DITEMUKAN. Periksa data di database.");
            console.log("-----------------------------------------");
            return res.status(404).json({ message: 'Package not found. Please check data consistency.' });
        }

        console.log("✅ Hasil Query: DITEMUKAN!");
        console.log(pkg);
        console.log("-----------------------------------------");
        res.json(pkg);

    } catch (error) {
        console.error("🔥 Terjadi ERROR saat query database:", error);
        console.log("-----------------------------------------");
        res.status(500).json({ message: 'Failed to fetch package details', error: error.message });
    }
});


// GET: Mengambil SATU paket spesifik berdasarkan ID-nya (untuk admin panel)
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
        return next();
    }
    try {
        const pkg = await prisma.package.findUnique({
            where: { id: parseInt(id) },
            include: { country: { select: { name: true } } }
        });
        if (!pkg) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(pkg);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch package details', error: error.message });
    }
});

// =========================================================================
// RUTE MODIFIKASI DATA (POST, PUT, DELETE) - TANPA SLUG
// =========================================================================

// POST: Membuat paket baru
router.post('/', async (req, res) => {
    const { countryId, title, description, weServe, price1, price2, price3_6, price7plus } = req.body;
    if (!countryId || !title) {
        return res.status(400).json({ message: 'Country ID and Title are required' });
    }
    try {
        const newPackage = await prisma.package.create({
            data: {
                countryId: parseInt(countryId),
                title,
                description,
                weServe,
                price1: parseInt(price1) || 0,
                price2: parseInt(price2) || 0,
                price3_6: parseInt(price3_6) || 0,
                price7plus: parseInt(price7plus) || 0,
            },
        });
        res.status(201).json(newPackage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create package', error: error.message });
    }
});

// PUT: Memperbarui paket berdasarkan ID-nya
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, weServe, price1, price2, price3_6, price7plus } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    try {
        const updatedPackage = await prisma.package.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                weServe,
                price1: parseInt(price1) || 0,
                price2: parseInt(price2) || 0,
                price3_6: parseInt(price3_6) || 0,
                price7plus: parseInt(price7plus) || 0,
            },
        });
        res.json(updatedPackage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update package', error: error.message });
    }
});

// DELETE: Menghapus paket berdasarkan ID-nya
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.package.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete package', error: error.message });
    }
});

export default router;