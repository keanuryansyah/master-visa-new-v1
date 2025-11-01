import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();

// ✅ GET all packages
router.get("/", async (req, res) => {
    const packages = await prisma.package.findMany({
        include: { country: true },
    });
    res.json(packages);
});

// ✅ GET package by id
router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const pkg = await prisma.package.findUnique({
        where: { id },
        include: { country: true },
    });
    res.json(pkg);
});

// ✅ CREATE
router.post("/", async (req, res) => {
    const data = req.body;
    const newPackage = await prisma.package.create({ data });
    res.json(newPackage);
});

// ✅ UPDATE
router.put("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updated = await prisma.package.update({
        where: { id },
        data,
    });
    res.json(updated);
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.package.delete({ where: { id } });
    res.json({ message: "Deleted successfully" });
});

export default router;
