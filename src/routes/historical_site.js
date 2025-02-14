const express = require("express");
const passport = require("passport");
const {
  createSite,
  getSiteById,
  getSites,
  deleteSitebyId,
  updateSiteById,
  uploadImage,
  deleteImage,
  getEnabledSites,
} = require("../controller/historical_site.js");
const multer = require("multer");
const path = require("path");
const { randomUUID } = require("crypto");
const siteRouter = express.Router();

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

siteRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createSite
);
siteRouter.get("/enabled", getEnabledSites);
siteRouter.get("/", getSites);
siteRouter.get("/:id", getSiteById);
siteRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deleteSitebyId
);
siteRouter.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  updateSiteById
);
siteRouter.post(
  "/:id/upload",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  uploadImage
);
siteRouter.delete(
  "/:id/upload",
  passport.authenticate("jwt", { session: false }),
  deleteImage
);

module.exports = siteRouter;
