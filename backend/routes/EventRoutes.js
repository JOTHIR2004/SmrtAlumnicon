const express = require("express");
const router = express.Router();
const Event = require("../models/Events");
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

// ------------------- POST EVENT -------------------
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, postedBy } = req.body;

    const imageUrl = req.file ? req.file.path : null;

    const event = new Event({
      title,
      description,
      date,
      postedBy,
      imageUrl
    });

    await event.save();

    res.json({
      message: "Event posted successfully",
      event
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to post event" });
  }
});

// ------------------- GET ALL EVENTS -------------------
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});
//delete event from 
// ------------------- DELETE EVENT (ADMIN) -------------------
router.delete("/:id", async (req, res) => {
  try {
    const eventId = req.params.id;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete event" });
  }
});


module.exports = router;
