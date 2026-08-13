import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import "../../App.css";

export default function PlaceOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProduct = location.state?.product;

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    productId: "",
    title: "",
    price: "",
    stock: 1,
    sellerId: "",
    address: "",
  });

  useEffect(() => {
    if (!selectedProduct) return;
    setForm((prev) => ({
      ...prev,
      productId: selectedProduct._id || "",
      title: selectedProduct.title || "",
      price: selectedProduct.price ?? "",
      stock: 1,
      sellerId: selectedProduct.seller?._id || selectedProduct.sellerId || "",
    }));
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/orders", {
        productId: form.productId || selectedProduct?._id,
        sellerId: form.sellerId,
        title: form.title,
        price: Number(form.price),
        quantity: Number(form.stock),
        address: form.address,
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  /* If no product was passed, redirect back to shop */
  if (!selectedProduct) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: "center", paddingTop: 60 }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🛒</div>
          <h2 style={{ marginBottom: 8 }}>No product selected</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
            Please choose a product from the store first.
          </p>
          <Link to="/" className="btn primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  /* Success state */
  if (success) {
    return (
      <div className="page">
        <div className="container auth-page">
          <div className="form-card compact" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎉</div>
            <h2 style={{ marginBottom: 8 }}>Order Placed!</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>
              Your order for <strong style={{ color: "var(--text-h)" }}>{form.title}</strong> has been placed successfully.
              The seller will review and confirm it shortly.
            </p>
            <div className="button-row" style={{ justifyContent: "center", gap: 12 }}>
              <Link to="/customer/cart" className="btn primary">View My Orders</Link>
              <Link to="/" className="btn outline">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container auth-page">
        <div className="form-card compact">

          {/* Header */}
          <div className="form-heading">
            <span className="eyebrow">Customer</span>
            <h2 style={{ marginTop: 6 }}>Checkout</h2>
            <p>Review your item and confirm your order details below.</p>
          </div>

          {/* Product preview */}
          <div className="checkout-product-preview" style={{ marginBottom: 24 }}>
            {selectedProduct.images?.[0] && (
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.title}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}
            <div className="checkout-product-info">
              <h4>{selectedProduct.title}</h4>
              <p>
                Price:{" "}
                <strong style={{ color: "var(--accent-light)", fontSize: 16 }}>
                  ${Number(selectedProduct.price || 0).toFixed(2)}
                </strong>
              </p>
              <p>Available stock: {selectedProduct.stock ?? 0}</p>
            </div>
          </div>

          {/* Order form */}
          <form onSubmit={submitOrder} className="form-grid">
            <label>
              Quantity
              <div className="qty-stepper">
                <input
                  name="stock"
                  type="number"
                  min="1"
                  max={selectedProduct?.stock ?? 999}
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <label>
              Delivery address
              <input
                name="address"
                placeholder="Enter your full delivery address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </label>

            {/* Price summary */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 18px",
              background: "var(--surface-2)",
              borderRadius: "var(--r)",
              border: "1px solid var(--border)",
            }}>
              <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
                {form.stock} × ${Number(form.price).toFixed(2)}
              </span>
              <span style={{ fontFamily: "var(--heading)", fontWeight: 700, fontSize: 20, color: "var(--accent-light)" }}>
                Total: ${(Number(form.price) * Number(form.stock)).toFixed(2)}
              </span>
            </div>

            {error && <div className="form-alert error">{error}</div>}

            <div className="button-row" style={{ marginTop: 4 }}>
              <Link to="/" className="btn outline">← Back to Shop</Link>
              <button
                type="submit"
                className="btn primary"
                disabled={submitting || !selectedProduct.stock}
                style={{ flex: 1 }}
              >
                {submitting ? "Placing order…" : "✓ Confirm Order"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
