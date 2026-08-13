const Review = require("../models/Review");
const Product = require("../models/Product");

/* ── GET /reviews/:productId  — fetch all reviews for a product ── */
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("customer", "username name")
      .sort({ createdAt: -1 });

    /* Compute average rating */
    const avg =
      reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    res.json({ reviews, averageRating: avg, total: reviews.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to load reviews" });
  }
};

/* ── POST /reviews/:productId  — submit a review (customer only) ── */
exports.createReview = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "customer") {
      return res.status(401).json({ message: "Login as a customer to leave a review" });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { rating, title, body } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    /* upsert — update if customer already reviewed */
    const review = await Review.findOneAndUpdate(
      { product: product._id, customer: req.user._id },
      { rating, title, body, createdAt: Date.now() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await review.populate("customer", "username name");
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save review" });
  }
};

/* ── DELETE /reviews/:reviewId  — delete own review ── */
exports.deleteReview = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "customer") {
      return res.status(401).json({ message: "Unauthorised" });
    }

    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own review" });
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};
