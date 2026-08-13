const express = require("express");
const router = express.Router();
const { getReviews, createReview, deleteReview } = require("../controllers/reviewController");

/* GET  /reviews/:productId        — public, no auth needed */
router.get("/:productId", getReviews);

/* POST /reviews/:productId        — customer must be logged in */
router.post("/:productId", createReview);

/* DELETE /reviews/delete/:reviewId — customer must be logged in */
router.delete("/delete/:reviewId", deleteReview);

module.exports = router;
