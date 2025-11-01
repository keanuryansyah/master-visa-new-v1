"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import "./styles/countries.scss";

export default function CountryForm() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    featuredImage: "",
  });

  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:5000/api/countries/${id}`).then((res) => {
        setForm(res.data);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await axios.put(`http://localhost:5000/api/countries/${id}`, form);
    } else {
      await axios.post("http://localhost:5000/api/countries", form);
    }
    router.push("/admin/countries");
  };

  return (
    <div className="country-form">
      <h2>{isEdit ? "Edit Country" : "Add New Country"}</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Country Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Slug
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description || ""}
            onChange={handleChange}
          />
        </label>

        <label>
          Featured Image URL
          <input
            name="featuredImage"
            value={form.featuredImage || ""}
            onChange={handleChange}
            placeholder="https://..."
          />
        </label>

        {form.featuredImage && (
          <div className="preview">
            <img src={form.featuredImage} alt="Preview" />
          </div>
        )}

        <button type="submit" className="btn-submit">
          {isEdit ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
}
