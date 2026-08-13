import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import "../../App.css";

function StatusBadge({ status }) {
  const cls =
    status === "accepted" ? "badge-accepted" :
    status === "rejected" ? "badge-rejected" :
    "badge-pending";
  const icon =
    status === "accepted" ? "✓" :
    status === "rejected" ? "✗" : "●";
  return <span className={`badge ${cls}`}>{icon} {status || "pending"}</span>;
}

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    api
      .get("/orders/seller")
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId + status);
    try {
      await api.patch(`/orders/seller/${orderId}`, { status });
      loadOrders();
    } catch (err) {
      alert(err?.response?.data?.error || "Unable to update status.");
    } finally {
      setUpdating(null);
    }
  };

  const pending   = orders.filter((o) => !o.status || o.status === "pending");
  const processed = orders.filter((o) => o.status && o.status !== "pending");

  return (
    <div className="page">
      <div className="container">

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <span className="eyebrow" style={{ marginBottom: 10, display: "inline-flex" }}>Seller</span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>Orders</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            Review and action orders placed by customers for your products.
          </p>
        </div>

        {/* Stats bar */}
        {!loading && (
          <div style={{
            display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap"
          }}>
            {[
              { label: "Total orders", value: orders.length, color: "var(--text-h)" },
              { label: "Pending",      value: pending.length,   color: "var(--warning)" },
              { label: "Accepted",     value: orders.filter(o => o.status === "accepted").length, color: "var(--success)" },
              { label: "Rejected",     value: orders.filter(o => o.status === "rejected").length, color: "var(--error)" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: "1 1 120px",
                  background: "var(--surface-1)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r-lg)",
                  padding: "16px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: stat.color, fontFamily: "var(--heading)" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ display: "grid", gap: 16 }}>
            {[1,2,3].map((i) => (
              <div key={i} style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: "var(--r-lg)", padding: "22px 24px" }}>
                <div className="skeleton skeleton-h" style={{ marginBottom: 12 }} />
                <div className="skeleton skeleton-text" style={{ width: "70%" }} />
                <div className="skeleton skeleton-text" style={{ width: "50%" }} />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>📭</div>
            <h3 style={{ color: "var(--text)", marginBottom: 8 }}>No orders yet</h3>
            <p style={{ marginBottom: 20 }}>When customers place orders on your products, they'll appear here.</p>
            <Link to="/seller/create-product" className="btn primary">+ List a Product</Link>
          </div>
        ) : (
          <div>
            {/* Pending orders */}
            {pending.length > 0 && (
              <div style={{ marginBottom: 36 }}>
                <h3 style={{ marginBottom: 16, color: "var(--warning)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  ● Pending Action ({pending.length})
                </h3>
                <div style={{ display: "grid", gap: 14 }}>
                  {pending.map((order) => (
                    <div key={order._id} className="seller-order-card" style={{ borderLeft: "3px solid var(--warning)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                        <span className="seller-order-title">{order.title}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="seller-order-meta">
                        <span>👤 <strong>{order.customer?.name || order.customer?.username || "Customer"}</strong></span>
                        <span>📧 <strong>{order.customer?.email || "N/A"}</strong></span>
                        <span>📦 Qty: <strong>{order.quantity}</strong></span>
                        <span>💰 Revenue: <strong style={{ color: "var(--accent-light)" }}>${(Number(order.price) * order.quantity).toFixed(2)}</strong></span>
                        {order.address && <span>📍 <strong>{order.address}</strong></span>}
                      </div>
                      <div className="order-actions">
                        <button
                          type="button"
                          className="btn success sm"
                          disabled={updating === order._id + "accepted"}
                          onClick={() => updateStatus(order._id, "accepted")}
                        >
                          ✓ Accept
                        </button>
                        <button
                          type="button"
                          className="btn danger sm"
                          disabled={updating === order._id + "rejected"}
                          onClick={() => updateStatus(order._id, "rejected")}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processed orders */}
            {processed.length > 0 && (
              <div>
                <h3 style={{ marginBottom: 16, color: "var(--text-muted)", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Processed ({processed.length})
                </h3>
                <div style={{ display: "grid", gap: 14 }}>
                  {processed.map((order) => (
                    <div
                      key={order._id}
                      className="seller-order-card"
                      style={{
                        borderLeft: `3px solid ${order.status === "accepted" ? "var(--success)" : "var(--error)"}`,
                        opacity: 0.75,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                        <span className="seller-order-title">{order.title}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="seller-order-meta">
                        <span>👤 <strong>{order.customer?.name || order.customer?.username || "Customer"}</strong></span>
                        <span>📦 Qty: <strong>{order.quantity}</strong></span>
                        <span>💰 <strong style={{ color: "var(--accent-light)" }}>${(Number(order.price) * order.quantity).toFixed(2)}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <Link to="/" className="btn outline">← Back to Store</Link>
        </div>
      </div>
    </div>
  );
}
