const Customer = require("../models/Customer");
const Seller = require("../models/Seller");
const Product = require("../models/Product");
const Review = require("../models/Review");

exports.getStats = async (req, res) => {
  try {
    const [customers, sellers, products, reviews] = await Promise.all([
      Customer.countDocuments(),
      Seller.countDocuments(),
      Product.countDocuments(),
      Review.find({}, "rating"),
    ]);

    const avgRating = reviews.length
      ? (
          reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

    res.json({
      customers,
      sellers,
      products,
      averageRating: avgRating,
    });
  } catch (err) {
    console.error("Failed to fetch stats", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
