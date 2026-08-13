import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../App.css";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    stock: "",
  });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    setError(null);
    try {
      await api.post("/products", {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        images: form.image ? [form.image] : [],
        stock: parseInt(form.stock, 10),
      });
      setStatus("Product listed successfully! Redirecting…");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err?.response?.data?.error || "Could not create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container auth-page">
        <div className="form-card compact">
          <div className="form-heading">
            <span className="eyebrow">Seller</span>
            <h2 style={{ marginTop: 6 }}>List a new product</h2>
            <p>Fill in the details below to publish your product to the store.</p>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-grid two-column">
              <label>
                Product title
                <input
                  name="title"
                  placeholder="e.g. Wireless Headphones"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Price (USD)
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 29.99"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Stock quantity
                <input
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="e.g. 50"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Image URL
                <input
                  name="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              Description
              <textarea
                name="description"
                placeholder="Describe your product — features, materials, dimensions, etc."
                value={form.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </label>

            {/* Image preview */}
            {form.image && (
              <div style={{
                borderRadius: "var(--r)",
                overflow: "hidden",
                border: "1px solid var(--border)",
                height: 160,
                background: "var(--surface-2)",
              }}>
                <img
                  src={form.image}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}

            <div className="button-row justify-end" style={{ marginTop: 4 }}>
              <Link to="/" className="btn outline">Cancel</Link>
              <button
                type="submit"
                className="btn primary"
                disabled={loading}
                style={{ minWidth: 140 }}
              >
                {loading ? "Listing…" : "📦 List Product"}
              </button>
            </div>
          </form>

          {status && <div className="form-alert success">{status}</div>}
          {error  && <div className="form-alert error">{error}</div>}
        </div>
      </div>
    </div>
  );
}
