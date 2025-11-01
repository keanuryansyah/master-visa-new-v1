export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCountries() {
    const res = await fetch(`${API_URL}/api/countries`);
    return res.json();
}

export async function createCountry(data) {
    const res = await fetch(`${API_URL}/api/countries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteCountry(id) {
    await fetch(`${API_URL}/api/countries/${id}`, { method: "DELETE" });
}

// Sama untuk paket
export async function getPackages() {
    const res = await fetch(`${API_URL}/api/packages`);
    return res.json();
}

export async function createPackage(data) {
    const res = await fetch(`${API_URL}/api/packages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}
