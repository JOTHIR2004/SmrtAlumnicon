const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  phone: { type: String },
  role: { type: String, enum: ["student", "alumni"], required: true },
  isVerified: { type: Boolean, default: false },
  skills: { type: String },            // comma-separated skills or string
  areaOfInterest: { type: String },
  batch: { type: String },
  resumeUrl: { type: String, default: "" },
  resumeStatus: { type: String, default: "not_uploaded" },
  resumeRejectedReason: { type: String, default: "" },
  resumeVerifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "signup" },
  imageUrl: { type: String, default: "" }, // profile image
}, { timestamps: true });

module.exports = mongoose.models.signup || mongoose.model("signup", signupSchema);
