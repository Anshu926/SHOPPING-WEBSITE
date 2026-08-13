const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, trim: true, lowercase: true },
  description: { type: String },
  price: { type: Number, required: true, default: 0 },
  currency: { type: String, default: "USD" },
  images: [{ type: String }],
  category: { type: String, index: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  stock: { type: Number, default: 0 },
  attributes: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", ProductSchema);
