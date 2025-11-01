"use client";
import { useEffect, useState } from "react";
import { getPackages, createPackage, getCountries } from "@/lib/api";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({
    countryId: "",
    title: "",
    description: "",
    weServe: [],
    price1: 0,
    price2: 0,
    price3_6: 0,
    price7plus: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setPackages(await getPackages());
    setCountries(await getCountries());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPackage(form);
    loadData();
  };

  return (
    <div>
      <h1>Manage Packages</h1>

      <form onSubmit={handleSubmit}>
        <select
          value={form.countryId}
          onChange={(e) =>
            setForm({ ...form, countryId: parseInt(e.target.value) })
          }
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          placeholder="We Serve (comma separated)"
          onChange={(e) =>
            setForm({ ...form, weServe: e.target.value.split(",") })
          }
        />
        <input
          type="number"
          placeholder="Price (1)"
          onChange={(e) =>
            setForm({ ...form, price1: parseInt(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Price (2)"
          onChange={(e) =>
            setForm({ ...form, price2: parseInt(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Price (3-6)"
          onChange={(e) =>
            setForm({ ...form, price3_6: parseInt(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Price (7+)"
          onChange={(e) =>
            setForm({ ...form, price7plus: parseInt(e.target.value) })
          }
        />
        <button type="submit">Add Package</button>
      </form>

      <ul>
        {packages.map((p) => (
          <li key={p.id}>
            {p.title} — {p.country?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
