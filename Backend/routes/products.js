const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { isSellerLoggedIn } = require("../middleware/auth");

// Public: list and view
router.get("/", productController.listProducts);
router.get("/:id", productController.getProduct);

// Protected: only sellers
router.post("/", isSellerLoggedIn, productController.createProduct);
router.put("/:id", isSellerLoggedIn, productController.updateProduct);
router.delete("/:id", isSellerLoggedIn, productController.deleteProduct);

module.exports = router;
