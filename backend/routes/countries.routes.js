import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Fungsi sederhana untuk membuat 'slug' dari nama negara
const createSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

// GET: Mengambil semua negara
router.get('/', async (req, res) => {
    try {
        const countries = await prisma.country.findMany({
            orderBy: { name: 'asc' },
        });
        res.json(countries);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch countries', error: error.message });
    }
});


// ✨ [RUTE BARU] GET: Mengambil satu negara berdasarkan SLUG beserta semua paketnya
router.get('/slug/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const country = await prisma.country.findUnique({
            where: { slug: slug },
            include: {
                // Secara otomatis ikut sertakan semua paket yang terhubung dengan negara ini
                packages: {
                    orderBy: {
                        // Urutkan paket berdasarkan harga termurah
                        price1: 'asc',
                    }
                },
            },
        });

        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        res.json(country);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch country details', error: error.message });
    }
});


// POST: Membuat negara baru
router.post('/', async (req, res) => {
    const { name, description, featuredImage } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Country name is required' });
    }
    try {
        const newCountry = await prisma.country.create({
            data: { name, slug: createSlug(name), description, featuredImage },
        });
        res.status(201).json(newCountry);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'A country with this name already exists.' });
        }
        res.status(500).json({ message: 'Failed to create country', error: error.message });
    }
});

// PUT: Memperbarui negara berdasarkan ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, featuredImage } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Country name is required' });
    }
    try {
        const updatedCountry = await prisma.country.update({
            where: { id: parseInt(id) },
            data: { name, slug: createSlug(name), description, featuredImage },
        });
        res.json(updatedCountry);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'A country with this name already exists.' });
        }
        res.status(500).json({ message: 'Failed to update country', error: error.message });
    }
});

// DELETE: Menghapus negara berdasarkan ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.country.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete country', error: error.message });
    }
});

export default router;