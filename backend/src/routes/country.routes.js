import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ✅ GET semua country
router.get("/", async (req, res) => {
    const countries = await prisma.country.findMany();
    res.json(countries);
});

// ✅ GET detail 1 country
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const country = await prisma.country.findUnique({ where: { id: Number(id) } });
    res.json(country);
});

// ✅ CREATE
router.post("/", async (req, res) => {
    const { name, slug, description, featuredImage } = req.body;
    try {
        const newCountry = await prisma.country.create({
            data: { name, slug, description, featuredImage },
        });
        res.json(newCountry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ UPDATE
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, slug, description, featuredImage } = req.body;
    try {
        const updated = await prisma.country.update({
            where: { id: Number(id) },
            data: { name, slug, description, featuredImage },
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.country.delete({ where: { id: Number(id) } });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
