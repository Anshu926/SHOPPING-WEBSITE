const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  body: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  createdAt: { type: Date, default: Date.now },
});

/* One review per customer per product */
ReviewSchema.index({ product: 1, customer: 1 }, { unique: true });

module.exports = mongoose.model("Review", ReviewSchema);
