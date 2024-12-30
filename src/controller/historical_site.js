const HistoricSiteModel = require("../models/historical_site.js");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");

const fsPromises = fs.promises;

/**
 * Helper to validate the image path.
 */
const validateImagePath = (imagePath) => {
  return imagePath && imagePath.trim().length > 0;
};

/**
 * Helper to resolve file paths.
 */
const resolveFilePath = (imagePath, isDocker) => {
  const normalizedPath = imagePath.startsWith("uploads/")
    ? imagePath.slice("uploads/".length)
    : imagePath;

  const basePath = isDocker
    ? "/app/uploads"
    : path.join(__dirname, "..", "..", "uploads");
  return path.join(basePath, normalizedPath);
};

/**
 * Create a new historic site.
 */
const createSite = asyncHandler(async (req, res) => {
  const site = new HistoricSiteModel(req.body);
  const result = await site.save();
  return res.status(201).json(result);
});

/**
 * Get a site by ID.
 */
const getSiteById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const site = await HistoricSiteModel.findById(id);
  return res.json(site);
});

/**
 * Get all sites.
 */
const getSites = asyncHandler(async (req, res) => {
  const { join } = req.query;
  const sites = await HistoricSiteModel.find().populate(join);
  return res.json(sites);
});

/**
 * Get enabled sites.
 */
const getEnabledSites = asyncHandler(async (req, res) => {
  const sites = await HistoricSiteModel.find().where({ is_enable: true });
  return res.json(sites);
});

/**
 * Update a site by ID.
 */
const updateSiteById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const site = await HistoricSiteModel.findById(id);

  if (site?.img && validateImagePath(site.img)) {
    const isDocker = process.env.IS_PRODUCTION === "true";
    const filePath = resolveFilePath(site.img, isDocker);

    try {
      await fsPromises.access(filePath, fs.constants.F_OK);
      await fsPromises.unlink(filePath);
    } catch (err) {
      console.error("File deletion error:", err);
    }
  }

  await HistoricSiteModel.updateOne({ _id: id }, req.body);
  return res.status(200).json({ message: "Update Successful" });
});

/**
 * Upload an image for a site.
 */
const uploadImage = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imagePath = req.file.path;
  const result = await HistoricSiteModel.findByIdAndUpdate(
    id,
    { img: imagePath },
    { new: true }
  );

  if (!result) {
    return res.status(404).json({ message: "Site not found" });
  }

  return res.json({ message: "Image uploaded successfully", site: result });
});

/**
 * Delete a site by ID.
 */
const deleteSitebyId = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const site = await HistoricSiteModel.findById(id);

  if (!site) {
    return res.status(404).json({ message: "Historic site not found" });
  }

  if (site?.img && validateImagePath(site.img)) {
    const isDocker = process.env.IS_PRODUCTION === "true";
    const filePath = resolveFilePath(site.img, isDocker);

    try {
      await fsPromises.access(filePath, fs.constants.F_OK);
      await fsPromises.unlink(filePath);
    } catch (err) {
      console.error("Error deleting image file:", err);
    }
  }

  await site.deleteOne();
  return res.json({ message: "Site deleted successfully", site });
});

/**
 * Delete an image associated with a site.
 */
const deleteImage = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const site = await HistoricSiteModel.findById(id);

  if (!site) {
    return res.status(404).json({ message: "Historic site not found" });
  }

  if (!validateImagePath(site.img)) {
    return res
      .status(404)
      .json({ message: "No image associated with this site" });
  }

  const isDocker = process.env.IS_PRODUCTION === "true";
  const filePath = resolveFilePath(site.img, isDocker);

  try {
    await fsPromises.access(filePath, fs.constants.F_OK);
    await fsPromises.unlink(filePath);

    site.img = null;
    await site.save();

    return res.json({ message: "Image removed successfully", site });
  } catch (err) {
    console.error("File deletion error:", err);
    return res.status(404).json({ message: "Image file not found" });
  }
});

module.exports = {
  createSite,
  getSiteById,
  getSites,
  getEnabledSites,
  deleteSitebyId,
  updateSiteById,
  uploadImage,
  deleteImage,
};
