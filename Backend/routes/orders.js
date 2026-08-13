const express = require("express");
const router = express.Router();
const { isCustomerLoggedIn, isSellerLoggedIn } = require("../middleware/auth");
const Order = require("../models/Order");

router.post("/", isCustomerLoggedIn, async (req, res) => {
  try {
    const {
      productId,
      sellerId,
      title,
      price,
      quantity = 1,
      address,
    } = req.body;
    if (!productId || !sellerId || !title || price == null || !address) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const order = await Order.create({
      customer: req.user._id,
      seller: sellerId,
      product: productId,
      title,
      price,
      quantity,
      address,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/customer", isCustomerLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error("Customer orders error", err);
    res.status(500).json({ error: "Failed to load orders" });
  }
});

router.get("/seller", isSellerLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate("customer", "username email name phone address")
      .sort({
        createdAt: -1,
      });
    res.json(orders);
  } catch (err) {
    console.error("Seller orders error", err);
    res.status(500).json({ error: "Failed to load orders" });
  }
});

router.patch("/:id", isCustomerLoggedIn, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });

    const { quantity, status } = req.body;
    if (quantity != null) order.quantity = quantity;
    if (status != null) order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error("Update order error", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

router.delete("/:id", isCustomerLoggedIn, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });

    await order.deleteOne();
    res.json({ message: "Order removed" });
  } catch (err) {
    console.error("Delete order error", err);
    res.status(500).json({ error: "Failed to remove order" });
  }
});

router.patch("/seller/:id", isSellerLoggedIn, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (req.body.status) order.status = req.body.status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error("Seller update order error", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

module.exports = router;
