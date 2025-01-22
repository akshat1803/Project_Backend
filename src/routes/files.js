import express from "express";
import multer from "multer";
import File from "../models/File.js";

// const protect = require("../../middleware/authMiddleware").default;
import protect from "../../middleware/authMiddleware.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/x-msdownload")
      return cb(new Error("Executable files are not allowed"));
    cb(null, true);
  },
});

router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    console.log("req.file", req.file);
    const file = await File.create({
      filename: req.file.filename,
      filepath: req.file.path,
      uploadedBy: req.user.id,
    });
    res.status(201).json(file);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
