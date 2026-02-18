const express = require("express");
const router = express.Router();
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../models/User");

// GET alumni suggestions for a student
router.get("/suggestions/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;
    console.log("Received studentId:", studentId);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // Fetch student from DB
    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Payload for ML service
    const payload = {
      studentSkills: student.skills || "",
      studentAoi: student.areaOfInterest || ""
    };

    console.log("Sending payload to ML service:", payload);

    // POST to FastAPI ML service
    const mlResponse = await axios.post(
      "https://recomlservices.onrender.com/suggest",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("ML RESPONSE DATA:", mlResponse.data);

    if (!mlResponse.data || !Array.isArray(mlResponse.data)) {
      return res.status(500).json({ message: "ML service returned invalid data" });
    }

    // Return alumni suggestions
    return res.json(mlResponse.data);

  } catch (err) {
    console.error("Error fetching alumni suggestions:", err.message, err.response?.data || "");
    res.status(500).json({ message: "Failed to fetch alumni suggestions" });
  }
});

module.exports = router;
