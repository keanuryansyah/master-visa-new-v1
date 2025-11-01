import { NextResponse } from "next/server";

// Fungsi middleware ini akan dijalankan untuk setiap request yang cocok dengan matcher
export function middleware(request) { // Perhatikan: bagian ": NextRequest" sudah dihapus
    // 1. Dapatkan token dari cookie request yang masuk
    const token = request.cookies.get("admin_token")?.value;

    // 2. Dapatkan path URL yang sedang diminta
    const { pathname } = request.nextUrl;

    // 3. Logika redirect:
    // Jika TIDAK ada token DAN pengguna mencoba mengakses halaman di dalam /admin
    // (kecuali halaman login itu sendiri, agar tidak terjadi loop tak terbatas)
    if (!token && pathname.startsWith("/admin") && pathname !== "/admin/login") {
        // Redirect ke halaman login
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Jika ada token dan pengguna mencoba mengakses halaman login,
    // redirect mereka ke dashboard karena mereka sudah login.
    if (token && pathname === "/admin/login") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    // 4. Jika semua kondisi di atas tidak terpenuhi, lanjutkan seperti biasa
    return NextResponse.next();
}

// Konfigurasi Matcher:
// Tentukan path mana saja yang akan memicu middleware ini
export const config = {
    matcher: [
        /*
         * Cocokkan semua path, KECUALI yang:
         * - Dimulai dengan /api (rute API)
         * - Dimulai dengan /_next/static (file statis)
         * - Dimulai dengan /_next/image (optimasi gambar)
         * - Tepat file favicon.ico
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}