const express = require("express");
const router = express.Router();
const AdminBanner = require("../models/adminBanner");
const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "events", // folder name in cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// ------------------- POST BANNER (ADMIN) -------------------
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    // Get Cloudinary image URL
    const imageUrl = req.file ? req.file.path : null;

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
