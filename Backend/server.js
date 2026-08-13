const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore;
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

/* ── CORS — allow any origin that sends credentials ── */
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);
app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── MongoDB URI ── */
const mongoUri =
  process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

/* ── Sessions — stored in MongoDB so they survive restarts ── */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    store: mongoUri
      ? MongoStore.create({
          mongoUrl: mongoUri,
          collectionName: "sessions",
          ttl: 14 * 24 * 60 * 60,
        })
      : undefined,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

async function seedAdmin() {
  try {
    const Admin = require("./models/Admin");
    const existing = await Admin.findOne({ email: "admin@shop.com" });
    if (!existing) {
      const admin = new Admin({
        email: "admin@shop.com",
        name: "Administrator",
      });
      admin.setPassword("password");
      await admin.save();
      console.log("Seeded default admin: admin@shop.com / password");
    } else {
      console.log("Default admin already present");
    }
  } catch (err) {
    console.error("Error seeding admin", err);
  }
}

async function connectDatabase() {
  if (!mongoUri) {
    console.error(
      "⚠ No MongoDB URI found. Set MONGO_URI in your environment variables.",
    );
    return false;
  }

  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }

    const mongooseOptions = {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    };

    if (
      mongoUri.startsWith("mongodb+srv://") ||
      mongoUri.includes("mongodb.net")
    ) {
      mongooseOptions.tls = true;
    }

    await mongoose.connect(mongoUri, mongooseOptions);
    console.log("✅ MongoDB connected");
    await seedAdmin();
    return true;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

function registerRoutes() {
  app.get("/", (req, res) => res.send("AB Fashion API is running ✅"));

  app.use("/customer", customerRoutes);
  app.use("/seller", sellerRoutes);
  app.use("/products", productRoutes);
  app.use("/orders", orderRoutes);
  app.use("/reviews", reviewRoutes);
  app.use("/stats", statsRoutes);
  app.use("/auth", require("./routes/auth"));

  app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
    });
  });
}

async function startServer() {
  await connectDatabase();
  registerRoutes();

  if (require.main === module) {
    app.listen(port, () => console.log("🚀 Server is running"));
  }

  return app;
}

let routesRegistered = false;

function registerRoutes() {
  if (routesRegistered) return;
  routesRegistered = true;

  app.get("/", (req, res) => res.send("AB Fashion API is running ✅"));

  app.use("/customer", customerRoutes);
  app.use("/seller", sellerRoutes);
  app.use("/products", productRoutes);
  app.use("/orders", orderRoutes);
  app.use("/reviews", reviewRoutes);
  app.use("/stats", statsRoutes);
  app.use("/auth", require("./routes/auth"));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  });
}

module.exports = app;
module.exports.startServer = startServer;

if (require.main === module) {
  startServer();
}
