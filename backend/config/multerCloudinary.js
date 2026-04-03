const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // your existing file

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "auto", // ✅ detects PDF automatically
    format: "pdf",    // ✅ VERY IMPORTANT for PDFs
  },
});

const upload = multer({ storage });

module.exports = upload;
