"use client";
import { useState } from "react";
import axios from "axios";

export default function TestPaymentPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handlePay = async () => {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/create-transaction`,
            {
                name,
                phone,
                amount: 800000, // DP 800rb
            }
        );

        window.snap.pay(res.data.token, {
            onSuccess: (result) => {
                alert("Pembayaran berhasil!");
                console.log(result);
            },
            onPending: (result) => {
                alert("Pembayaran pending!");
                console.log(result);
            },
            onError: (err) => {
                alert("Pembayaran gagal!");
                console.log(err);
            },
            onClose: () => {
                alert("Kamu menutup popup pembayaran.");
            },
        });
    };

    return (
        <div style={{ padding: 40 }}>
            <h1>Test Midtrans Payment</h1>

            <input
                type="text"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />

            <input
                type="text"
                placeholder="Nomor Telepon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <br />

            <button onClick={handlePay}>Bayar DP Rp 800.000</button>
        </div>
    );
}
