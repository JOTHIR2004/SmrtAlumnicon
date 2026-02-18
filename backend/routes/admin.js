const express = require("express");
const router = express.Router();

const Signup = require("../models/signup");
const AdminBanner = require("../models/adminBanner");

/* =========================
   USER MANAGEMENT (ADMIN)
========================= */

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await Signup.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// DELETE user
router.delete("/users/:id", async (req, res) => {
  try {
    await Signup.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

/* =========================
   ADMIN EVENTS
========================= */

// POST – Admin uploads event
router.post("/events", async (req, res) => {
  try {
    const event = new AdminBanner(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Failed to create event" });
  }
});

// DELETE – Admin deletes event
router.delete("/events/:id", async (req, res) => {
  try {
    await AdminBanner.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event" });
  }
});

module.exports = router;
