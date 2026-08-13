const express = require("express");
const passport = require("passport");
const router = express.Router();

const customerController = require("../controllers/customerController");

// signup
router.post("/signup", customerController.signup);

// login - use passport local strategy for customers
router.post("/login", (req, res, next) => {
  passport.authenticate("customer-local", (err, user, info) => {
    if (err) {
      console.error("Customer login auth error", err);
      return res.status(500).json({ error: "Authentication failed" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || "Invalid credentials" });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("Customer login session error", loginErr);
        return res.status(500).json({ error: "Unable to create session" });
      }
      const safe = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: "customer",
      };
      return res.json({ message: "Logged in", user: safe });
    });
  })(req, res, next);
});

router.get("/logout", customerController.logout);

module.exports = router;
