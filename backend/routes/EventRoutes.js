const express = require("express");
const router = express.Router();
const Event = require("../models/Events");
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

// ------------------- POST EVENT -------------------
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, postedBy } = req.body;

    // If image uploaded, store path
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const event = new Event({
      title,
      description,
      date,
      postedBy,
      imageUrl
    });

    await event.save();
    res.json({ message: "Event posted successfully", event });
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
