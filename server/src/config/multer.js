const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure tmp/ folder exists
const tmpDir = path.join(__dirname, "../tmp"); // Adjust the path as needed
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Multer Storage Configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Multer Filter Configuration
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only images (JPEG, JPG, PNG)."), false);
  }
};

// Exporting the configured multer instance
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = upload;
