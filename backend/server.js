// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config(); // 👈 ADD THIS

// const authRoutes = require("./routes/authRoutes");
// const alumniRoutes = require("./routes/Alumni");
// const adminRoutes = require("./routes/admin");


// const app = express();

// app.use(cors());
// app.use(express.json());

// // Alumni routes
// app.use("/api/alumni", alumniRoutes);

// // Admin routes
// app.use("/api/admin", adminRoutes);

// // Events
// app.use("/api/events", require("./routes/EventRoutes"));


// // Static uploads
// app.use("/uploads", express.static("uploads"));

// // MongoDB Atlas connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Atlas connected"))
//   .catch((err) => console.error("MongoDB error:", err));

// // Auth routes (after middleware)
// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const alumniRoutes = require("./routes/alumni");
const adminRoutes = require("./routes/admin");
const eventRoutes = require("./routes/EventRoutes");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== STATIC FILES =====
app.use("/uploads", express.static("uploads"));

// ===== ROUTES =====

// Auth (login / register)
app.use("/api/auth", authRoutes);

app.use("/api/admin-banners", require("./routes/AdminBannerRoutes"));
// Public – view alumni events
app.use("/api/events", eventRoutes);

// Alumni features
app.use("/api/alumni", alumniRoutes);

// Admin – users + alumni event control
app.use("/api/admin", adminRoutes);

// ===== DATABASE =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ===== SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
