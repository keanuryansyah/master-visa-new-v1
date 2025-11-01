"use client";
import { useState } from "react";
import axios from "axios";

export default function TestVA() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [bank, setBank] = useState("bca");
    const [result, setResult] = useState(null);

    const handlePay = async () => {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/create-va`,
            {
                name,
                phone,
                amount: 800000,
                bank,
            }
        );
        setResult(res.data);
    };

    return (
        <div style={{ padding: 40 }}>
            <h1>Test Pembayaran via Virtual Account</h1>

            <input
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
                placeholder="Nomor Telepon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <br />

            <select value={bank} onChange={(e) => setBank(e.target.value)}>
                <option value="bca">BCA</option>
                <option value="bni">BNI</option>
                <option value="permata">Permata</option>
            </select>
            <br />
            <button onClick={handlePay}>Buat Virtual Account</button>

            {result && (
                <div style={{ marginTop: 20 }}>
                    <h3>Virtual Account:</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>

                    {result.va_numbers && (
                        <p>
                            <b>
                                {result.va_numbers[0].bank.toUpperCase()} VA:{" "}
                                {result.va_numbers[0].va_number}
                            </b>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
