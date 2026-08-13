const Customer = require("../models/Customer");

async function signup(req, res) {
  try {
    const { username, email, name, phone, address, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "Missing required fields" });
    const existing = await Customer.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "Email already registered" });
    const customer = new Customer({ username, email, name, phone, address });
    await Customer.register(customer, password);
    return res.status(201).json({ message: "Customer registered" });
  } catch (err) {
    console.error("Customer signup error", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

function logout(req, res) {
  req.logout?.();
  req.session?.destroy?.(() => {});
  res.json({ message: "Logged out" });
}

module.exports = { signup, logout };
