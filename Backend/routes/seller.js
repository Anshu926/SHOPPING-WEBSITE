const express = require("express");
const passport = require("passport");
const router = express.Router();

const sellerController = require("../controllers/sellerController");

router.post("/signup", sellerController.signup);

router.post("/login", (req, res, next) => {
  passport.authenticate("seller-local", (err, user, info) => {
    if (err) {
      console.error("Seller login auth error", err);
      return res.status(500).json({ error: "Authentication failed" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || "Invalid credentials" });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("Seller login session error", loginErr);
        return res.status(500).json({ error: "Unable to create session" });
      }
      const safe = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: "seller",
      };
      return res.json({ message: "Logged in", user: safe });
    });
  })(req, res, next);
});

router.get("/logout", sellerController.logout);

module.exports = router;
