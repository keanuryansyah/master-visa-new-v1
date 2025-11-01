import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const hashed = await bcrypt.hash("admin123", 10); // ganti password default
    await prisma.admin.upsert({
        where: { email: "admin@mastervisa.local" },
        update: {},
        create: {
            email: "admin@mastervisa.local",
            password: hashed,
        },
    });
    console.log("Admin seeded");
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
