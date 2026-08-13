const mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");
if (passportLocalMongoose && passportLocalMongoose.default)
  passportLocalMongoose = passportLocalMongoose.default;

const SellerSchema = new mongoose.Schema({
  username: { type: String, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: { type: String },
  shopName: { type: String },
  phone: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Use passport-local-mongoose to manage password hashing and helpers
SellerSchema.plugin(passportLocalMongoose, {
  usernameField: "username",
  usernameLowerCase: true,
});

module.exports = mongoose.model("Seller", SellerSchema);
