'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PackagePage({ params }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [people, setPeople] = useState(1);

    const handlePay = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                packageId: Number(params.id),
                name, email, phone, peopleCount: Number(people)
            })
        });
        const data = await res.json();
        const token = data.token;

        // Panggil Midtrans Snap
        // Pastikan script midtrans sudah di-load di _document atau page
        window.snap.pay(token, {
            onSuccess: function (result) { window.location.href = '/success' },
            onPending: function (result) { window.location.href = '/pending' },
            onError: function (result) { window.location.href = '/failed' },
        });
    };

    return (
        <div>
            <h1>Booking Paket</h1>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama" />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
            <input type="number" value={people} onChange={e => setPeople(e.target.value)} min="1" />
            <button onClick={handlePay}>Bayar DP</button>
        </div>
    );
}
