// const express = require("express");
// const bcrypt = require("bcryptjs");
// const User = require("../models/User");
// const sendEmail = require("../utils/sendEmail");

// const router = express.Router();


// const multer = require("multer");
// const path = require("path");

// // Multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/resumes"); // make sure this folder exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // Resume upload
// router.post("/upload-resume/:id", upload.single("resume"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     const student = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         resume: req.file.path,
//         resumeStatus: "pending", // mark as pending for admin approval
//       },
//       { new: true }
//     );

//     if (!student) return res.status(404).json({ message: "Student not found" });

//     res.json({
//       message: "Resume uploaded successfully",
//       student,
//     });
//   } catch (err) {
//     console.error("RESUME UPLOAD ERROR:", err);
//     res.status(500).json({ message: "Resume upload failed" });
//   }
// });

// /* ================= SEND OTP ================= */
// router.post("/send-otp", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     let user = await User.findOne({ email });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     if (!user) {
//       user = new User({
//         email,
//         otp,
//         otpExpiry: Date.now() + 5 * 60 * 1000,
//         isVerified: false
//       });
//     } else {
//       user.otp = otp;
//       user.otpExpiry = Date.now() + 5 * 60 * 1000;
//       user.isVerified = false;
//     }

//     await user.save();          // save first
//     await sendEmail(email, otp); //  then send email

//     return res.status(200).json({ message: "OTP sent successfully" });

//   } catch (err) {
//     console.error("SEND OTP ERROR:", err);
//     return res.status(500).json({ message: "Failed to send OTP" });
//   }
// });

// /* ================= VERIFY OTP ================= */
// router.post("/verify-otp", async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP are required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (Date.now() > user.otpExpiry) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     user.isVerified = true;
//     user.otp = null;
//     user.otpExpiry = null;

//     await user.save();

//     return res.status(200).json({ message: "Email verified successfully" });

//   } catch (err) {
//     console.error("VERIFY OTP ERROR:", err);
//     return res.status(500).json({ message: "OTP verification failed" });
//   }
// });

// /* ================= REGISTER ================= */
// /*router.post("/register", async (req, res) => {
//   try {
//     const { firstName, lastName, email, phone, company, password, role } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Please verify email first" });
//     }

//     if (!user.isVerified) {
//       return res.status(400).json({ message: "Email not verified" });
//     }

//     if (user.password) {
//       return res.status(400).json({ message: "User already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     user.firstName = firstName;
//     user.lastName = lastName;
//     user.phone = phone;
//     user.company = company;
//     user.role = role;
//     user.password = hashedPassword;

//     await user.save();

//     return res.status(201).json({ message: "Registration successful" });

//   } catch (err) {
//     console.error("REGISTER ERROR:", err);
//     return res.status(500).json({ message: "Registration failed" });
//   }
// });
// */
// /* ================= REGISTER ================= */
// router.post("/register", async (req, res) => {
//   try {
//     // Get all fields from frontend
//     const {
//       firstName,
//       lastName,
//       email,
//       batch,
//       phone,
//       password,
//       role,
//       skills,          // NEW
//       areaOfInterest   // NEW
//     } = req.body;

//     // Find user by email (should exist after OTP verification)
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "Please verify email first" });
//     }

//     if (!user.isVerified) {
//       return res.status(400).json({ message: "Email not verified" });
//     }

//     if (user.password) {
//       return res.status(400).json({ message: "User already registered" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Update user document
//     user.firstName = firstName;
//     user.lastName = lastName;
//     user.batch = batch;
//     user.phone = phone;
//     user.role = role;
//     user.password = hashedPassword;
//     user.skills = skills || "";               // store skills
//     user.areaOfInterest = areaOfInterest || "";// store area of interest

//     await user.save();

//     return res.status(201).json({ message: "Registration successful" });
//   } catch (err) {
//     console.error("REGISTER ERROR:", err);
//     return res.status(500).json({ message: "Registration failed" });
//   }
// });

// /* ================= LOGIN ================= */
// /*router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // 1. Find user by firstName (as you decided)
//     const user = await User.findOne({ firstName: username });

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // 2. Compare password
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     // 3. Send required user data to frontend
//     return res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role   // student / alumni / admin
//       }
//     });

//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     return res.status(500).json({ message: "Login failed" });
//   }
// });
// // for profile
// // GET user by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id); // MongoDB _id
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user); // send full user object
//   } catch (err) {
//     console.error("GET USER ERROR:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });*/
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//       if (username === "admin" && password === "admin123") {
//       return res.status(200).json({
//         message: "Admin login successful",
//         user: {
//           _id: "ADMIN001",
//           firstName: "Admin",
//           role: "admin"
//         }
//       });
//     }

//     const user = await User.findOne({ firstName: username });

//     if (!user) return res.status(400).json({ message: "User not found" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Invalid password" });

//     // Include _id, skills, and areaOfInterest
//    return res.status(200).json({
//   message: "Login successful",
//   user: {
//     _id: user._id,
//     firstName: user.firstName,
//     lastName: user.lastName,
//     batch :user.batch,
//     email: user.email,
//     role: user.role,
//     skills: user.skills || "",
//     areaOfInterest: user.areaOfInterest || ""
//   }
// });

//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     return res.status(500).json({ message: "Login failed" });
//   }
// });


// //admin approvel
// router.put("/admin/approve-resume/", async (req, res) => {
//   try {
//     const { adminId } = req.body;

//     await User.findByIdAndUpdate(req.params.id, {
//       resumeStatus: "approved",
//       resumeVerifiedBy: adminId
//     });

//     res.json({ message: "Resume approved successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Approval failed" });
//   }
// });



// module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose");
const fs = require("fs");
const upload = require("../config/multerCloudinary");

const router = express.Router();

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


router.post("/upload-resume/:id", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const student = await User.findByIdAndUpdate(
      req.params.id,
      {
        resumeUrl: req.file.path, // ✅ Cloudinary URL
        resumeStatus: "pending",
      },
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({
      message: "Resume uploaded successfully",
      student,
    });
  } catch (err) {
    console.error("RESUME UPLOAD ERROR:", err);
    res.status(500).json({ message: "Resume upload failed" });
  }
});

/* ================= SEND OTP ================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await User.findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (!user) {
      user = new User({
        email,
        otp,
        otpExpiry: Date.now() + 5 * 60 * 1000,
        isVerified: false
      });
    } else {
      user.otp = otp;
      user.otpExpiry = Date.now() + 5 * 60 * 1000;
      user.isVerified = false;
    }

    await user.save();
    await sendEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ================= VERIFY OTP ================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > user.otpExpiry) return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, batch, phone, password, role, skills, areaOfInterest } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Please verify email first" });
    if (!user.isVerified) return res.status(400).json({ message: "Email not verified" });
    if (user.password) return res.status(400).json({ message: "User already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.firstName = firstName;
    user.lastName = lastName;
    user.batch = batch;
    user.phone = phone;
    user.role = role;
    user.password = hashedPassword;
    user.skills = skills || "";
    user.areaOfInterest = areaOfInterest || "";

    await user.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ================= LOGIN ================= */
/*router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Hard-coded admin
  if (username.toLowerCase() === "admin" && password === "admin123") {
    return res.status(200).json({
      message: "Admin login successful",
      user: { _id: "ADMIN001", firstName: "Admin", role: "admin" }
    });
  }

  // Student login
  const user = await User.findOne({ firstName: username });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid password" });

  res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      skills: user.skills || "",
      areaOfInterest: user.areaOfInterest || "",
      resumeStatus: user.resumeStatus || "not_uploaded"
    }
  });
});*/
//login updated with admin
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // 🔹 Find user by email OR firstName (your choice)
    const user = await User.findOne({
      $or: [
        { email: username },
        { firstName: username }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔹 Compare password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🔹 Success response
    res.status(200).json({
      message: user.role === "admin" 
        ? "Admin login successful" 
        : "Login successful",
        
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        skills: user.skills || "",
        areaOfInterest: user.areaOfInterest || "",
        resumeStatus: user.resumeStatus || "not_uploaded"
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//forgot-password

router.post("/forgot-password", async (req, res) => {
  try {
    console.log(" Forgot Password API called");

    const { email, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email: email.trim() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent same password reuse (optional but good)
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: "New password cannot be same as old password" });
    }

    //  Password validation
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //  Update password
    user.password = hashedPassword;
    await user.save();

    console.log(" Password updated for:", email);

    return res.status(200).json({ message: "Password reset successful" });

  } catch (err) {
    console.error(" ERROR:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET USER PROFILE ================= */
// 1️⃣ Pending resumes route MUST come first
router.get("/pending-resumes", async (req, res) => {
  try {
    const students = await User.find({ resumeStatus: "pending" });
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pending resumes" });
  }
});

// 2️⃣ GET user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});



/* ================= ADMIN APPROVE RESUME ================= */
// Approve student resume
// Approve resume route
router.put("/admin/approve-resume/:id", async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { resumeStatus: "approved" }, // remove resumeVerifiedBy
      { new: true }
    );

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Resume approved successfully", student });
  } catch (err) {
    console.error("APPROVE RESUME ERROR:", err);
    res.status(500).json({ message: "Approval failed" });
  }
});

router.put("/admin/reject-resume/:id", async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    // Delete resume file if exists
    if (student.resumeUrl) {
      const filePath = path.join(__dirname, "..", student.resumeUrl);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // delete file
      }
    }

    // Update DB
    student.resumeStatus = "rejected";
    student.resumeUrl = "";
    await student.save();

    res.json({ message: "Resume rejected and file deleted" });
  } catch (err) {
    console.error("REJECT RESUME ERROR:", err);
    res.status(500).json({ message: "Rejection failed" });
  }
});

//event deletion form admin 






module.exports = router;
