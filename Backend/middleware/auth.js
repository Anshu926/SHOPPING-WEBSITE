// auth middleware
function isCustomerLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    if (req.user && req.user.role === "customer") return next();
    return res.status(403).json({ error: "Forbidden: not a customer" });
  }
  return res.status(401).json({ error: "Unauthorized" });
}

function isSellerLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    if (req.user && req.user.role === "seller") return next();
    return res.status(403).json({ error: "Forbidden: not a seller" });
  }
  return res.status(401).json({ error: "Unauthorized" });
}

module.exports = { isCustomerLoggedIn, isSellerLoggedIn };
