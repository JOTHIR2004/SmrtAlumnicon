const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  batch: String,
  phone: String,
  company: String,

  role: {
    type: String,
    enum: ["student", "alumni", "admin"],
    default: "student"
  },

  password: String,

  // OTP verification
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,

  // Student profile
  skills: { type: String, default: "" },
  areaOfInterest: { type: String, default: "" },

  // Resume management
  resumeUrl: {
    type: String,
    default: ""
  },

  resumeStatus: {
    type: String,
    enum: ["not_uploaded", "pending", "approved", "rejected"], // ✅ FIXED
    default: "not_uploaded"
  },

  // Optional but professional
  resumeRejectedReason: {
    type: String,
    default: ""
  },

  resumeVerifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signup",
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("signup", userSchema);
