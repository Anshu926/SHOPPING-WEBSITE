const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");

const customerRoutes = require("./routes/customer");
const sellerRoutes = require("./routes/seller");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const reviewRoutes = require("./routes/reviews");
const statsRoutes = require("./routes/stats");
const configurePassport = require("./config/passport");

const app = express();
const port = process.env.PORT || 3000;

const isProd = process.env.NODE_ENV === "production";

/* ---------------- CORS ---------------- */

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "https://shopping-website-iunq.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- Mongo ---------------- */

const mongoUri =
  process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

/* ---------------- Session ---------------- */

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 14,
    },
  }),
);

/* ---------------- Passport ---------------- */

app.use(passport.initialize());
app.use(passport.session());

configurePassport();

/* ---------------- Database ---------------- */

async function seedAdmin() {
  try {
    const Admin = require("./models/Admin");

    const existing = await Admin.findOne({
      email: "admin@shop.com",
    });

    if (!existing) {
      const admin = new Admin({
        email: "admin@shop.com",
        name: "Administrator",
      });

      admin.setPassword("password");

      await admin.save();

      console.log("Default admin created");
    }
  } catch (err) {
    console.error(err);
  }
}

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(mongoUri);

  console.log("MongoDB Connected");

  await seedAdmin();
}

/* ---------------- Routes ---------------- */

function registerRoutes() {
  app.get("/", (req, res) => {
    res.send("AB Fashion API is running ✅");
  });

  app.use("/customer", customerRoutes);
  app.use("/seller", sellerRoutes);
  app.use("/products", productRoutes);
  app.use("/orders", orderRoutes);
  app.use("/reviews", reviewRoutes);
  app.use("/stats", statsRoutes);
  app.use("/auth", require("./routes/auth"));

  // DEBUG
  app.get("/debug-session", (req, res) => {
    res.json({
      authenticated: req.isAuthenticated(),
      sessionID: req.sessionID,
      user: req.user,
      session: req.session,
    });
  });

  app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
  });
}

/* ---------------- Start ---------------- */

async function startServer() {
  await connectDatabase();

  registerRoutes();

  if (require.main === module) {
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  }

  return app;
}

module.exports = app;
module.exports.startServer = startServer;

if (require.main === module) {
  startServer();
}
