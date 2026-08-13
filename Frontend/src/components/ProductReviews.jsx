import { useState, useEffect } from "react";
import api from "../api";
import useAuth from "../hooks/useAuth";

/* ── Interactive / display stars ── */
function Stars({ value, interactive = false, size = 18, onChange }) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? hovered || value : value;

  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`star${n <= display ? " filled" : ""}`}
          style={{
            fontSize: size,
            cursor: interactive ? "pointer" : "default",
          }}
          onMouseEnter={() => interactive && setHovered(n)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange?.(n)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ── Submit / Edit form ── */
function ReviewForm({ productId, existing, onSaved, onCancel }) {
  const [rating, setRating] = useState(existing?.rating || 0);
  const [title, setTitle] = useState(existing?.title || "");
  const [body, setBody] = useState(existing?.body || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return setError("Please select a star rating first.");
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post(
        `/reviews/${productId}`,
        { rating, title, body },
        { withCredentials: true },
      );
      onSaved(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={submit}>
      <div className="review-form-title">
        ✍️ {existing ? "Edit Your Review" : "Write a Review"}
      </div>

      {/* Star picker */}
      <div className="review-form-row">
        <label>Your Rating *</label>
        <Stars value={rating} interactive size={32} onChange={setRating} />
        {!rating && (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Click a star to rate
          </span>
        )}
      </div>

      <div className="review-form-grid">
        <div className="review-form-row">
          <label>
            Title <span style={{ opacity: 0.5 }}>(optional)</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Great quality!"
            maxLength={100}
          />
        </div>
      </div>

      <div className="review-form-row full">
        <label>
          Your Review <span style={{ opacity: 0.5 }}>(optional)</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell other shoppers what you liked or didn't like..."
          rows={4}
          maxLength={1000}
        />
        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            textAlign: "right",
          }}
        >
          {body.length}/1000
        </span>
      </div>

      {error && (
        <p style={{ color: "var(--error)", fontSize: 13, margin: 0 }}>
          ⚠ {error}
        </p>
      )}

      <div className="review-form-actions">
        <button
          type="submit"
          className="btn primary"
          disabled={loading || !rating}
        >
          {loading ? "Saving…" : existing ? "Update Review" : "Submit Review"}
        </button>
        <button type="button" className="btn outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ── Single review card ── */
function ReviewCard({ review, currentUserId, onDelete }) {
  const isOwn = currentUserId && review.customer?._id === currentUserId;

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-avatar">
          {(review.customer?.username || "?")[0].toUpperCase()}
        </div>
        <div className="review-meta">
          <strong>{review.customer?.username || "Customer"}</strong>
          <Stars value={review.rating} size={15} />
        </div>
        <span className="review-date">
          {new Date(review.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {review.title && <p className="review-title">"{review.title}"</p>}
      {review.body && <p className="review-body">{review.body}</p>}

      {isOwn && (
        <div className="review-footer">
          <button
            className="review-delete"
            onClick={() => onDelete(review._id)}
          >
            🗑 Delete my review
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Main Reviews Section ── */
export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [data, setData] = useState({
    reviews: [],
    averageRating: null,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reviews/${productId}`);
      setData(res.data);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const myReview = user
    ? data.reviews.find((r) => r.customer?._id === user._id)
    : null;

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await api.delete(`/reviews/delete/${reviewId}`, {
        withCredentials: true,
      });
      fetchReviews();
    } catch (_) {}
  };

  return (
    <section className="reviews-section">
      {/* ── Header ── */}
      <div className="reviews-header">
        <div className="reviews-header-left">
          <h3>Customer Reviews</h3>

          {data.averageRating ? (
            <div className="reviews-avg-block">
              <div className="avg-big-number">{data.averageRating}</div>
              <div className="avg-right">
                <Stars value={Math.round(data.averageRating)} size={20} />
                <span className="avg-total">
                  {data.total} {data.total === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>
          ) : (
            !loading && (
              <div className="reviews-empty">
                <div className="reviews-empty-icon">💬</div>
                <p>No reviews yet — be the first to share your thoughts!</p>
              </div>
            )
          )}
        </div>

        {/* CTA */}
        <div className="reviews-action">
          {user?.role === "customer" && !showForm && (
            <button className="btn primary" onClick={() => setShowForm(true)}>
              {myReview ? "✏️ Edit My Review" : "✍️ Write a Review"}
            </button>
          )}
          {!user && (
            <p className="reviews-login-hint">
              <a href="/customer/login">Login</a> to leave a review
            </p>
          )}
        </div>
      </div>

      {/* ── Form ── */}
      {showForm && user?.role === "customer" && (
        <ReviewForm
          productId={productId}
          existing={myReview}
          onSaved={() => {
            setShowForm(false);
            fetchReviews();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* ── List ── */}
      {loading ? (
        <div className="reviews-loading">
          {[80, 100, 72].map((h, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: h, borderRadius: 14 }}
            />
          ))}
        </div>
      ) : data.reviews.length > 0 ? (
        <div className="reviews-list">
          {data.reviews.map((r) => (
            <ReviewCard
              key={r._id}
              review={r}
              currentUserId={user?._id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
