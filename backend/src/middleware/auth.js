import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "very-secret-key";

export function requireAdmin(req, res, next) {
    // Jika pakai cookie
    const token = req.cookies?.admin_token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.admin = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
