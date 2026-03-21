const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true }, // Keep as string or change to Date if you prefer
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signup",
    required: true
  },
  imageUrl: { type: String } // <-- Add this field to store image path or URL
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
