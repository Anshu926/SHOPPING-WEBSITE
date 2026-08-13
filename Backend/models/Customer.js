const mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");
// handle CJS/ESM interop where require may return { default: fn }
if (passportLocalMongoose && passportLocalMongoose.default)
  passportLocalMongoose = passportLocalMongoose.default;

const CustomerSchema = new mongoose.Schema({
  username: { type: String, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Use passport-local-mongoose to add username, hash and salt fields
CustomerSchema.plugin(passportLocalMongoose, {
  usernameField: "username",
  usernameLowerCase: true,
});

module.exports = mongoose.model("Customer", CustomerSchema);
