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

export default function Cart() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);
    api
      .get("/orders/customer")
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const updateQuantity = async (orderId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.patch(`/orders/${orderId}`, { quantity });
      loadOrders();
    } catch (err) {
      alert(err?.response?.data?.error || "Unable to update quantity.");
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Remove this order?")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      loadOrders();
    } catch (err) {
      alert(err?.response?.data?.error || "Unable to remove order.");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="cart-wrap" style={{ margin: "0 auto" }}>
          <div className="section-card">
            <div className="section-card-header">
              <h2>Your Orders</h2>
              <p>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
            </div>
            <div className="section-card-body">
              {loading ? (
                <div className="form-grid">
                  {[1, 2].map((i) => (
                    <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
                      <div className="skeleton skeleton-h" style={{ marginBottom: 10 }} />
                      <div className="skeleton skeleton-text" style={{ width: "60%" }} />
                    </div>
                  ))}
                </div>
              ) : orders.length ? (
                <div>
                  {orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-card-header">
                        <span className="order-card-title">{order.title}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="order-card-meta">
                        <span>Qty: <strong>{order.quantity}</strong></span>
                        <span>Total: <strong style={{ color: "var(--accent-light)" }}>${(Number(order.price) * order.quantity).toFixed(2)}</strong></span>
                        <span>Unit: <strong>${Number(order.price).toFixed(2)}</strong></span>
                        {order.address && <span>📍 {order.address}</span>}
                      </div>
                      <div className="order-actions">
                        <div className="qty-stepper">
                          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Qty:</span>
                          <input
                            type="number"
                            min="1"
                            value={order.quantity}
                            onChange={(e) => updateQuantity(order._id, Number(e.target.value))}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn danger sm"
                          onClick={() => cancelOrder(order._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🛒</div>
                  <p>No orders yet. <Link to="/" style={{ color: "var(--accent-light)" }}>Start shopping →</Link></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
