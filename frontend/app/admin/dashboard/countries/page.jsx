"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import "./styles/countries.scss"; // Pastikan path ini benar
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// const API_URL = "";

// State awal untuk Negara (tetap dengan slug)
const initialCountryState = {
  id: null,
  name: "",
  slug: "",
  description: "",
  featuredImage: "",
};
// ✨ [DIPERBAIKI] Hapus 'slug' dari state awal paket
const initialPackageState = {
  id: null,
  title: "",
  description: "",
  weServe: '{\n  "services": []\n}',
  price1: 0,
  price2: 0,
  price3_6: 0,
  price7plus: 0,
};

// Fungsi helper untuk membuat slug (tetap digunakan untuk Negara)
const createSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: 20, height: 20 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default function ManageCountriesPage() {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(initialCountryState);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isPackageListModalOpen, setIsPackageListModalOpen] = useState(false);
  const [selectedCountryForPackages, setSelectedCountryForPackages] =
    useState(null);
  const [packages, setPackages] = useState([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [isPackageFormModalOpen, setIsPackageFormModalOpen] = useState(false);
  const [isEditingPackage, setIsEditingPackage] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(initialPackageState);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/countries`);
      if (!res.ok) throw new Error("Failed to fetch countries");
      const data = await res.json();
      setCountries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCountryModal = (country = null) => {
    setImageFile(null);
    if (country) {
      setIsEditingCountry(true);
      setCurrentCountry({
        ...country,
        slug: country.slug || createSlug(country.name),
      });
    } else {
      setIsEditingCountry(false);
      setCurrentCountry(initialCountryState);
    }
    setIsCountryModalOpen(true);
  };

  const handleCloseCountryModal = () => setIsCountryModalOpen(false);

  const handleCountryInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setCurrentCountry({
        ...currentCountry,
        name: value,
        slug: createSlug(value),
      });
    } else {
      setCurrentCountry({ ...currentCountry, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleSaveCountry = async () => {
    let imageUrl = currentCountry.featuredImage;
    if (imageFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("featuredImage", imageFile);
      try {
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      } catch (err) {
        alert(`Error: ${err.message}`);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const countryData = { ...currentCountry, featuredImage: imageUrl };
    const method = isEditingCountry ? "PUT" : "POST";
    const url = isEditingCountry
      ? `${API_URL}/api/countries/${countryData.id}`
      : `${API_URL}/api/countries`;

    try {
      const saveRes = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(countryData),
      });
      if (!saveRes.ok) {
        const errorData = await saveRes.json();
        throw new Error(errorData.message || "Failed to save country");
      }
      handleCloseCountryModal();
      fetchCountries();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteCountry = async (id) => {
    if (confirm("Are you sure you want to delete this country?")) {
      try {
        await fetch(`${API_URL}/api/countries/${id}`, { method: "DELETE" });
        fetchCountries();
      } catch (err) {
        alert("Failed to delete country.");
      }
    }
  };

  const handleOpenPackageManager = async (country) => {
    setSelectedCountryForPackages(country);
    setIsPackageListModalOpen(true);
    setIsLoadingPackages(true);
    try {
      const res = await fetch(`${API_URL}/api/packages/country/${country.id}`);
      if (!res.ok) throw new Error("Failed to load packages");
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoadingPackages(false);
    }
  };

  const handleClosePackageManager = () => setIsPackageListModalOpen(false);

  const handleOpenPackageForm = (pkg = null) => {
    if (pkg) {
      setIsEditingPackage(true);
      setCurrentPackage({
        ...pkg,
        weServe: JSON.stringify(pkg.weServe, null, 2),
      });
    } else {
      setIsEditingPackage(false);
      setCurrentPackage(initialPackageState);
    }
    setIsPackageFormModalOpen(true);
  };

  const handleClosePackageForm = () => setIsPackageFormModalOpen(false);

  const handlePackageInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPackage({ ...currentPackage, [name]: value });
  };

  const handleSavePackage = async () => {
    if (!currentPackage.title) {
      alert("Package Title cannot be empty.");
      return;
    }

    let packageData = { ...currentPackage };
    try {
      packageData.weServe = JSON.parse(packageData.weServe);
    } catch (e) {
      alert("Invalid JSON format in 'We Serve' field.");
      return;
    }

    const method = isEditingPackage ? "PUT" : "POST";
    const url = isEditingPackage
      ? `${API_URL}/api/packages/${packageData.id}`
      : `${API_URL}/api/packages`;

    if (!isEditingPackage) {
      if (!selectedCountryForPackages || !selectedCountryForPackages.id) {
        alert("Error: Country not selected. Please close and try again.");
        return;
      }
      packageData.countryId = selectedCountryForPackages.id;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packageData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save package");
      }
      handleClosePackageForm();
      handleOpenPackageManager(selectedCountryForPackages);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeletePackage = async (id) => {
    if (confirm("Are you sure you want to delete this package?")) {
      await fetch(`${API_URL}/api/packages/${id}`, { method: "DELETE" });
      handleOpenPackageManager(selectedCountryForPackages);
    }
  };

  if (isLoading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="crud-container">
      <Link href="/admin/dashboard" className="btn-back">
        <ArrowLeftIcon />
        <span>Back to Dashboard</span>
      </Link>
      <div className="crud-header">
        <h1>Manage Countries</h1>
        <button
          className="btn-primary"
          onClick={() => handleOpenCountryModal()}
        >
          Add New Country
        </button>
      </div>
      <table className="crud-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.id}>
              <td data-label="Image">
                {country.featuredImage ? (
                  <Image src={country.featuredImage} alt={country.name} />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td data-label="Name">{country.name}</td>
              <td data-label="Slug">{country.slug}</td>
              <td data-label="Actions" className="actions">
                <button
                  className="btn-edit"
                  onClick={() => handleOpenCountryModal(country)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteCountry(country.id)}
                >
                  Delete
                </button>
                <button
                  className="btn-manage"
                  onClick={() => handleOpenPackageManager(country)}
                >
                  Packages
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL 1: FORM CRUD NEGARA */}
      {isCountryModalOpen && (
        <div className="modal-overlay" onClick={handleCloseCountryModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditingCountry ? "Edit Country" : "Add New Country"}</h2>
            <div className="form-group">
              <label htmlFor="name">Country Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={currentCountry.name}
                onChange={handleCountryInputChange}
              />
            </div>
            <div className="form-group">
              <label>Slug (auto-generated)</label>
              <input
                type="text"
                name="slug"
                value={currentCountry.slug}
                readOnly
                style={{ backgroundColor: "#f3f4f6", color: "#6b7280" }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={currentCountry.description || ""}
                onChange={handleCountryInputChange}
              ></textarea>
            </div>
            <div className="form-group image-upload-group">
              <label>Featured Image</label>
              {isEditingCountry && currentCountry.featuredImage && (
                <div className="image-preview-container">
                  <p>Current Image:</p>
                  <Image
                    src={currentCountry.featuredImage}
                    alt="Current Preview"
                  />
                </div>
              )}
              <input
                type="file"
                id="featuredImageFile"
                name="featuredImageFile"
                accept="image/*"
                onChange={handleFileChange}
              />
              <small
                style={{ color: "#6b7280", marginTop: "5px", display: "block" }}
              >
                {isEditingCountry
                  ? "Choose a new file to replace the image."
                  : "Upload an image."}
              </small>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={handleCloseCountryModal}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveCountry}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DAFTAR & MANAJER PAKET */}
      {isPackageListModalOpen && (
        <div className="modal-overlay" onClick={handleClosePackageManager}>
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="package-modal-header">
              <h2>
                Packages for:{" "}
                <strong>{selectedCountryForPackages?.name}</strong>
              </h2>
              <button
                className="btn-primary"
                onClick={() => handleOpenPackageForm()}
              >
                Add New Package
              </button>
            </div>
            {isLoadingPackages ? (
              <div className="loading-state">Loading packages...</div>
            ) : packages.length > 0 ? (
              <table className="crud-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Price (1 Person)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td data-label="Title">{pkg.title}</td>
                      <td data-label="Price (1 Person)">
                        {formatRupiah(pkg.price1)}
                      </td>
                      <td data-label="Actions" className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleOpenPackageForm(pkg)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeletePackage(pkg.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  border: "1px dashed #e5e7eb",
                  borderRadius: "8px",
                  marginTop: "1.5rem",
                }}
              >
                <p>No packages found for this country.</p>
                <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
                  Click &apos;Add New Package&apos; to get started.
                </p>
              </div>
            )}
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={handleClosePackageManager}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: FORM TAMBAH/EDIT PAKET (TANPA SLUG) */}
      {isPackageFormModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditingPackage ? "Edit Package" : "Add New Package"}</h2>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={currentPackage.title}
                onChange={handlePackageInputChange}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={currentPackage.description}
                onChange={handlePackageInputChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label>We Serve (JSON)</label>
              <textarea
                name="weServe"
                value={currentPackage.weServe}
                onChange={handlePackageInputChange}
                rows={5}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Price (1 Person)</label>
              <input
                type="number"
                name="price1"
                value={currentPackage.price1}
                onChange={handlePackageInputChange}
              />
            </div>
            <div className="form-group">
              <label>Price (2 People)</label>
              <input
                type="number"
                name="price2"
                value={currentPackage.price2}
                onChange={handlePackageInputChange}
              />
            </div>
            <div className="form-group">
              <label>Price (3-6 People)</label>
              <input
                type="number"
                name="price3_6"
                value={currentPackage.price3_6}
                onChange={handlePackageInputChange}
              />
            </div>
            <div className="form-group">
              <label>Price (7+ People)</label>
              <input
                type="number"
                name="price7plus"
                value={currentPackage.price7plus}
                onChange={handlePackageInputChange}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={handleClosePackageForm}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSavePackage}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
