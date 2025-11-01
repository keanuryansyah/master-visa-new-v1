import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @route   POST /admin/login
 * @desc    Melakukan autentikasi admin dan mengembalikan token
 * @access  Public
 */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload = { id: admin.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET || "your-default-secret-key-123", {
            expiresIn: "8h",
        });

        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 8 * 60 * 60 * 1000,
        });

        return res.status(200).json({ ok: true, message: "Login successful" });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});


/**
 * ✨ [RUTE BARU] Endpoint untuk Logout ✨
 * @route   POST /admin/logout
 * @desc    Menghapus cookie token admin
 * @access  Private (memerlukan cookie untuk dihapus)
 */
router.post("/logout", (req, res) => {
    // Menghapus cookie di sisi client dengan memberitahu browser untuk meng-expire-kannya
    res.cookie("admin_token", "", {
        httpOnly: true,
        expires: new Date(0), // Set tanggal kedaluwarsa ke masa lalu
    });

    // Kirim respons sukses
    return res.status(200).json({ message: "Logged out successfully" });
});


export default router;