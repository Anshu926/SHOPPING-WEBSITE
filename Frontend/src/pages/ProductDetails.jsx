import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import useAuth from "../hooks/useAuth";
import ProductReviews from "../components/ProductReviews";
import "../App.css";

export default function ProductDetails() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* Edit state */
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  /* Delete state */
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get(`/products/${id}`)
      .then((res) => {
        if (mounted) {
          setProduct(res.data);
          setEditForm({
            title: res.data.title || "",
            description: res.data.description || "",
            price: res.data.price ?? "",
            stock: res.data.stock ?? 0,
            image: res.data.images?.[0] || "",

          });
        }
      })
      .catch((err) => {
        if (mounted) setError(err?.response?.data?.error || "Unable to load product details.");
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  /* Is this seller the owner? */
  const isOwner =
    !authLoading &&
    user?.role === "seller" &&
    product?.seller &&
    (product.seller._id === user._id ||
      product.seller._id?.toString() === user._id?.toString() ||
      product.seller.username === user.username);

  /* --- Handlers --- */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const res = await api.put(`/products/${id}`, {
        title: editForm.title,
        description: editForm.description,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock, 10),
        images: editForm.image ? [editForm.image] : [],
      });
      setProduct(res.data);
      setEditing(false);
    } catch (err) {
      setSaveError(err?.response?.data?.error || "Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this product?")) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${id}`);
      navigate("/seller/dashboard");
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to delete product.");
      setDeleting(false);
    }
  };

  /* --- Loading / Error states --- */
  if (loading) {
    return (
      <div className="page">
        <div className="container product-detail-page">
          <div className="detail-card">
            <div className="skeleton" style={{ minHeight: 420, borderRadius: "var(--r-lg)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "10px 0" }}>
              <div className="skeleton skeleton-h" style={{ width: "80%" }} />
              <div className="skeleton skeleton-text" style={{ width: "50%" }} />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: "center", paddingTop: 60 }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>{error ? "⚠️" : "🔍"}</div>
          <h2 style={{ marginBottom: 8 }}>{error ? "Something went wrong" : "Product not found"}</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>{error || "This product may have been removed."}</p>
          <Link to="/" className="btn primary">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  /* --- Edit form (shown inline when seller clicks Edit) --- */
  if (editing && isOwner) {
    return (
      <div className="page">
        <div className="container auth-page">
          <div className="form-card compact">
            <div className="form-heading">
              <span className="eyebrow">Seller · Editing</span>
              <h2 style={{ marginTop: 6 }}>Update Product</h2>
              <p>Make changes below and save to update the listing.</p>
            </div>

            <form onSubmit={handleUpdate} className="form-grid">
              <div className="form-grid two-column">
                <label>
                  Product title
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
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
                    value={editForm.price}
                    onChange={handleEditChange}
                    required
                  />
                </label>
                <label>
                  Stock quantity
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={editForm.stock}
                    onChange={handleEditChange}
                    required
                  />
                </label>

              </div>

              <label>
                Image URL
                <input
                  name="image"
                  type="url"
                  value={editForm.image}
                  onChange={handleEditChange}
                  placeholder="https://example.com/image.jpg"
                />
              </label>

              {/* Image preview */}
              {editForm.image && (
                <div style={{
                  borderRadius: "var(--r)",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  height: 160,
                  background: "var(--surface-2)",
                }}>
                  <img
                    src={editForm.image}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}

              <label>
                Description
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows={4}
                  placeholder="Describe your product..."
                />
              </label>

              {saveError && <div className="form-alert error">{saveError}</div>}

              <div className="button-row justify-end" style={{ marginTop: 4 }}>
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => { setEditing(false); setSaveError(null); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={saving}
                  style={{ minWidth: 130 }}
                >
                  {saving ? "Saving…" : "✓ Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* --- Main product detail view --- */
  return (
    <div className="page">
      <div className="container">
        <div className="product-detail-wrapper">
          {/* ── Product card ── */}
          <div className="detail-card">
          {/* Image */}
          <div className="detail-image">
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.title}
              onError={(e) => { e.target.style.objectFit = "contain"; e.target.style.padding = "20px"; }}
            />
          </div>

          {/* Content */}
          <div className="detail-content">
            {product.category && (
              <span className="eyebrow">📂 {product.category}</span>
            )}

            <h2>{product.title}</h2>

            <div className="detail-price">
              ${product.price?.toFixed(2)}
              <span style={{ fontSize: "0.55em", color: "var(--text-muted)", marginLeft: 8, fontWeight: 400 }}>
                {product.currency || "USD"}
              </span>
            </div>

            {product.description && (
              <p className="detail-desc">{product.description}</p>
            )}

            {/* Stats */}
            <div className="detail-grid">
              <div>
                <span>Stock</span>
                <strong style={{ color: product.stock > 0 ? "var(--success)" : "var(--error)" }}>
                  {product.stock ?? 0}
                </strong>
              </div>
              <div>
                <span>Currency</span>
                <strong>{product.currency || "USD"}</strong>
              </div>
              <div>
                <span>Listed</span>
                <strong style={{ fontSize: 14 }}>
                  {new Date(product.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </strong>
              </div>
            </div>

            {/* Seller info */}
            {product.seller && (
              <div className="seller-box">
                <h3>Seller</h3>
                <p className="seller-name-big">
                  {product.seller.username || product.seller.shopName || "Seller"}
                </p>
                {product.seller.email && <p>{product.seller.email}</p>}
              </div>
            )}

            {/* ── Actions (role-aware) ── */}
            <div className="button-row">
              {!authLoading && isOwner ? (
                /* Seller who owns this product */
                <>
                  <button
                    type="button"
                    className="btn primary"
                    style={{ flex: 1 }}
                    onClick={() => setEditing(true)}
                  >
                    ✏️ Edit Product
                  </button>
                  <button
                    type="button"
                    className="btn danger"
                    disabled={deleting}
                    onClick={handleDelete}
                  >
                    {deleting ? "Deleting…" : "🗑 Delete"}
                  </button>
                  <Link to="/" className="btn outline">← Back</Link>
                </>
              ) : !authLoading && user?.role === "customer" ? (
                /* Customer */
                <>
                  <button
                    type="button"
                    className="btn primary"
                    disabled={!product.stock}
                    style={{ flex: 1 }}
                    onClick={() => navigate("/customer/place_order", { state: { product } })}
                  >
                    {product.stock > 0 ? "🛒 Buy Now" : "Out of Stock"}
                  </button>
                  <Link to="/" className="btn outline">← Back</Link>
                </>
              ) : !authLoading && user?.role === "seller" ? (
                /* Seller who does NOT own this product */
                <Link to="/" className="btn outline">← Back to Shop</Link>
              ) : !authLoading ? (
                /* Guest */
                <>
                  <Link to="/customer/login" className="btn primary" style={{ flex: 1, justifyContent: "center" }}>
                    Login to Buy
                  </Link>
                  <Link to="/" className="btn outline">← Back</Link>
                </>
              ) : null}
            </div>

          </div>{/* end detail-content */}
        </div>{/* end detail-card */}

        {/* ── Reviews section — full width below card ── */}
        <ProductReviews productId={id} />

        </div>{/* end product-detail-wrapper */}
      </div>{/* end container */}
    </div>
  );
}
