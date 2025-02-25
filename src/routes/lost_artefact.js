const express = require("express");
const passport = require("passport");
const {
  createLost,
  getLostById,
  getLosts,
  deleteLostbyId,
  updateLostById,
  uploadImage,
  deleteImage,
  getEnabledLosts,
} = require("../controller/lost_artefact.js");
const multer = require("multer");
const path = require("path");
const { randomUUID } = require("crypto");
const lostRouter = express.Router();

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${randomUUID()}${fileExtension}`);
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

lostRouter.post("/", passport.authenticate("jwt", { session: false }),createLost);
lostRouter.get("/enabled", getEnabledLosts);
lostRouter.get("/", getLosts);
lostRouter.get("/:id", getLostById);
lostRouter.delete("/:id", passport.authenticate("jwt", { session: false }), deleteLostbyId);
lostRouter.put("/:id", passport.authenticate("jwt", { session: false }), updateLostById);
lostRouter.post("/:id/upload", passport.authenticate("jwt", { session: false }), upload.single("image"), uploadImage);
lostRouter.delete("/:id/upload", passport.authenticate("jwt", { session: false }), deleteImage);

module.exports = lostRouter;
