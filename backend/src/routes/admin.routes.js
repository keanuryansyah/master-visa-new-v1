import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "very-secret-key"; // ganti di env production

// POST /admin/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email & password required" });

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Buat JWT payload (jangan masukkan password)
        const payload = { id: admin.id, email: admin.email };

        // Buat token (atur expiry sesuai kebutuhan)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

        // Pilihan A: kembalikan token ke client (frontend simpan di localStorage)
        // return res.json({ token, admin: { id: admin.id, email: admin.email } });

        // Pilihan B (lebih aman): set httpOnly cookie sehingga frontend tidak perlu menyimpan sendiri
        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 8 * 60 * 60 * 1000,
        });

        return res.json({ ok: true, admin: { id: admin.id, email: admin.email } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

export default router;
