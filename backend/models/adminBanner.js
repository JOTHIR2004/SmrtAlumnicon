const mongoose = require("mongoose");

const adminBannerSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String, // "/uploads/event.jpg"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminBanner", adminBannerSchema);
