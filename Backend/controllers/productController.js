const Product = require("../models/Product");

async function listProducts(req, res) {
  try {
    const products = await Product.find().populate(
      "seller",
      "username shopName email",
    );
    res.json(products);
  } catch (err) {
    console.error("List products error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getProduct(req, res) {
  try {
    const p = await Product.findById(req.params.id).populate(
      "seller",
      "username shopName email",
    );
    if (!p) return res.status(404).json({ error: "Product not found" });
    res.json(p);
  } catch (err) {
    console.error("Get product error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createProduct(req, res) {
  try {
    const { title, description, price, images, category, stock } = req.body;
    if (!title || price == null)
      return res.status(400).json({ error: "Missing required fields" });
    const sellerId =
      req.user && req.user._id ? req.user._id : req.user.id || req.user;
    const product = new Product({
      title,
      description,
      price,
      images: images || [],
      category,
      stock: stock || 0,
      seller: sellerId,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateProduct(req, res) {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Product not found" });
    const sellerId = req.user && (req.user._id || req.user.id);
    if (p.seller.toString() !== sellerId.toString())
      return res.status(403).json({ error: "Not your product" });
    const updates = req.body;
    Object.assign(p, updates);
    await p.save();
    res.json(p);
  } catch (err) {
    console.error("Update product error", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteProduct(req, res) {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Product not found" });
    const sellerId = req.user && (req.user._id || req.user.id);
    if (p.seller.toString() !== sellerId.toString())
      return res.status(403).json({ error: "Not your product" });
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("List products error:", err);
    res.status(500).json({
      error: err.message,
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
    });
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
