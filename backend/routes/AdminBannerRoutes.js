const express = require("express");
const router = express.Router();
const AdminBanner = require("../models/adminBanner");
const multer = require("multer");
const path = require("path");

// ------------------- MULTER CONFIG -------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save banner images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

// ------------------- POST BANNER (ADMIN) -------------------
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    // If image uploaded, store path
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const banner = new AdminBanner({
      imageUrl
    });

    await banner.save();

    res.json({
      message: "Banner uploaded successfully",
      banner
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload banner" });
  }
});

// ------------------- GET ALL BANNERS -------------------
router.get("/", async (req, res) => {
  try {
    const banners = await AdminBanner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
});

// ------------------- DELETE BANNER (ADMIN) -------------------
router.delete("/:id", async (req, res) => {
  try {
    const bannerId = req.params.id;

    const deletedBanner = await AdminBanner.findByIdAndDelete(bannerId);

    if (!deletedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({ message: "Banner deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete banner" });
  }
});

module.exports = router;
