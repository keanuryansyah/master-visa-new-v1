"use client";

import { use } from "react";

export default function PackagePage({ params }) {
    const slug = use(params).slug; // Buka Promise params

    return (
        <div>
            <h1>Negara: {slug}</h1>
            {/* Konten halamanmu */}
        </div>
    );
}