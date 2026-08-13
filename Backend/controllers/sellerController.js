const Seller = require("../models/Seller");

async function signup(req, res) {
  try {
    const { username, email, name, shopName, phone, address, password } =
      req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Missing required fields" });
    const existing = await Seller.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });
    const seller = new Seller({
      username,
      email,
      name,
      shopName,
      phone,
      address,
    });
    await Seller.register(seller, password);
    return res.status(201).json({ message: "Seller registered" });
  } catch (err) {
    console.error("Seller signup error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function logout(req, res) {
  req.logout?.();
  req.session?.destroy?.(() => {});
  res.json({ message: "Logged out" });
}

module.exports = { signup, logout };
