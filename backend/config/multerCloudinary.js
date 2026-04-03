const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // your existing file

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "raw",
    type: "upload",        // ✅ VERY IMPORTANT
    access_mode: "public",  // ✅ VERY IMPORTANT for PDFs
  },
});

const upload = multer({ storage });

module.exports = upload;