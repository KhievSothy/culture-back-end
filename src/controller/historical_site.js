const HistoricSiteModel = require("../models/historical_site.js");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");

// Assuming `this.image` is the current image path or null if no image
const uploadFolder = path.join(__dirname, "uploads"); // Path to your upload folder

const createSite = asyncHandler(async (req, res) => {
  const site = new HistoricSiteModel(req.body);
  const result = await site.save();
  return res.status(201).json(result);
});

const getSiteById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const site = await HistoricSiteModel.findById(id);
  return res.json(site);
});

const getSites = asyncHandler(async (req, res) => {
  const { join } = req.query;
  // Get all sites
  const sites = await HistoricSiteModel.find().populate(join);
  return res.json(sites);
});

const getEnabledSites = asyncHandler(async (req, res) => {
  const sites = await HistoricSiteModel.find().populate(join).where({
    is_enable: true,
  });
  return res.json(sites);
});

const updateSiteById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  //delete image

  const site = await HistoricSiteModel.findById(id);
  let imagePath = "";

  if (site.img) {
    imagePath = site.img.toString().replaceAll("uploads\\", "");

    const filePath = path.join(__dirname, "..", "..", "uploads", imagePath);

    const normalizedFilePath = path.normalize(filePath);

    const fsPromises = require("fs").promises;

    try {
      await fsPromises.access(normalizedFilePath, fs.constants.F_OK); // Check if file exists
      // Delete the image file
      fs.unlink(normalizedFilePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ message: "Error removing image file" });
        }

        return res.json({
          message: "Image removed successfully",
        });
      });
    } catch (err) {
      console.error("File not found or inaccessible:", err);
      return res.status(404).json({ message: "Image file not found" });
    }
  }
  const result = await HistoricSiteModel.updateOne({ _id: id }, req.body);
  return res.status(200).send({
    message: "Update Successful",
  });
});

const uploadImage = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Update the database with the image path
  const imagePath = req.file.path;
  const result = await HistoricSiteModel.findByIdAndUpdate(
    id,
    { img: imagePath },
    { new: true } // Return the updated document
  );

  if (!result) {
    return res.status(404).json({ message: "Site not found" });
  }

  return res.json({ message: "Image uploaded successfully", site: result });
});

const deleteSitebyId = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const result = await HistoricSiteModel.findById(id).exec();
  if (!result) {
    return res.status(404).json({ message: "Historic site not found" });
  }

  if (result.img) {
    const imagePath = result.img.toString().replaceAll("uploads\\", "");

    if (!imagePath) {
      return res
        .status(404)
        .json({ message: "No image associated with this site" });
    }

    const filePath = path.join(__dirname, "..", "..", "uploads", imagePath);

    const normalizedFilePath = path.normalize(filePath);

    const fsPromises = require("fs").promises;
    try {
      await fsPromises.access(normalizedFilePath, fs.constants.F_OK); // Check if file exists
      // Delete the image file
      fs.unlink(normalizedFilePath, async (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ message: "Error removing image file" });
        }

        await result.deleteOne();

        return res.json({
          message: "Image removed successfully",
          site: result,
        });
      });
    } catch (err) {
      console.error("File not found or inaccessible:", err);
      await result.deleteOne();
      return res.json({
        message: "Image removed successfully",
        site: result,
      });
      //return res.status(404).json({ message: "Image file not found" });
    }
  } else {
    await result.deleteOne();
    return res.json({
      message: "Image removed successfully",
      site: result,
    });
  }
});

const deleteImage = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const result = await HistoricSiteModel.findById(id).exec();
    if (!result) {
      return res.status(404).json({ message: "Historic site not found" });
    }

    const imagePath = result.img.toString().replaceAll("uploads\\", "");
    console.log("Image path from database:", imagePath);

    if (!imagePath) {
      return res
        .status(404)
        .json({ message: "No image associated with this site" });
    }

    const filePath = path.join(__dirname, "..", "..", "uploads", imagePath);
    console.log("File path for deletion:", filePath);

    // Normalize the file path (if needed)
    const normalizedFilePath = path.normalize(filePath);
    console.log("Normalized file path for deletion:", normalizedFilePath);

    const fsPromises = require("fs").promises;
    try {
      await fsPromises.access(normalizedFilePath, fs.constants.F_OK); // Check if file exists
      // Delete the image file
      fs.unlink(normalizedFilePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ message: "Error removing image file" });
        }

        // Optionally, update the database
        result.imagePath = null;
        result.save();

        return res.json({
          message: "Image removed successfully",
          site: result,
        });
      });
    } catch (err) {
      console.error("File not found or inaccessible:", err);
      return res.status(404).json({ message: "Image file not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
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
