const mongoose = require("mongoose");
const crypto = require("crypto");

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: { type: String },
  passwordHash: { type: String },
  salt: { type: String },
  createdAt: { type: Date, default: Date.now },
});

AdminSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, this.salt, 64);
  this.passwordHash = derived.toString("hex");
};

AdminSchema.methods.validatePassword = function (password) {
  if (!this.passwordHash || !this.salt) return false;
  const derived = crypto.scryptSync(password, this.salt, 64);
  return crypto.timingSafeEqual(Buffer.from(this.passwordHash, "hex"), derived);
};

module.exports = mongoose.model("Admin", AdminSchema);
