const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Handle KYC uploads specially
    let uploadPath;
    if (file.fieldname === 'document') {
      uploadPath = path.join(uploadsDir, 'kyc');
    } else {
      uploadPath = path.join(uploadsDir, file.fieldname);
    }
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Middleware for single file upload
const uploadSingle = (fieldName) => upload.single(fieldName);

// Middleware for multiple files
const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);

// Middleware for multiple fields
const uploadFields = (fields) => upload.fields(fields);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
};