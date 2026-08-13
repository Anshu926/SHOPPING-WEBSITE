const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const Customer = require("../models/Customer");
const Seller = require("../models/Seller");

module.exports = function configurePassport() {
  // Customer strategy
  passport.use("customer-local", new LocalStrategy(Customer.authenticate()));

  // Seller strategy
  passport.use("seller-local", new LocalStrategy(Seller.authenticate()));

  // serialize user with role info
  passport.serializeUser((user, done) => {
    try {
      const role =
        user && user.constructor && user.constructor.modelName
          ? user.constructor.modelName.toLowerCase()
          : "user";
      done(null, { id: user._id.toString(), role });
    } catch (err) {
      done(err);
    }
  });

  // deserialize: load correct model based on role
  passport.deserializeUser(async (obj, done) => {
    try {
      if (!obj || !obj.id || !obj.role) return done(null, false);
      const Model = obj.role === "seller" ? Seller : Customer;
      const user = await Model.findById(obj.id).select("-hash -salt -__v");
      if (!user) return done(null, false);
      // attach role for downstream checks
      const userObj = user.toObject();
      userObj.role = obj.role;
      done(null, userObj);
    } catch (err) {
      done(err);
    }
  });
};
