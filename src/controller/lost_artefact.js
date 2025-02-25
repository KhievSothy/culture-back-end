const LostArtefactModel = require("../models/lost_artefact.js");
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
 * Create a new lost.
 */
const createLost = asyncHandler(async (req, res) => {
  const lost = new LostArtefactModel(req.body);
  const result = await lost.save();
  return res.status(201).json(result);
});

/**
 * Get a lost by ID.
 */
const getLostById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const lost = await LostArtefactModel.findById(id);
  return res.json(lost);
});

/**
 * Get all losts.
 */
// const getLosts = asyncHandler(async (req, res) => {
//   const { join } = req.query;
//   const losts = await LostArtefactModel.find().populate(join);
//   return res.json(losts);
// });


const getLosts = asyncHandler(async (req, res) => {
  const { join, title, objectype, period, style } = req.query;
  
  // Build a query object based on provided search parameters
  const query = {};

  // Filter by title_en using regex (case-insensitive)
  if (title) {
    query.title_en = { $regex: title, $options: 'i' };
  }
  
  // Filter by objecttype_en using regex (case-insensitive)
  if (objectype) {
    query.objecttype_en = { $regex: objectype, $options: 'i' };
  }
  
  // Filter by period_en using regex (case-insensitive)
  if (period) {
    query.period_en = { $regex: period, $options: 'i' };
  }
  
  // Filter by style_en using regex (case-insensitive)
  if (style) {
    query.style_en = { $regex: style, $options: 'i' };
  }
  
  // Create the query based on search criteria
  let lostsQuery = LostArtefactModel.find(query);
  
  // Populate if "join" is provided
  if (join) {
    lostsQuery = lostsQuery.populate(join);
  }
  
  // Execute query
  const losts = await lostsQuery;
  return res.json(losts);
});


/**
 * Get enabled losts.
 */
const getEnabledLosts = asyncHandler(async (req, res) => {
  const losts = await LostArtefactModel.find().where({ is_enable: true });
  return res.json(losts);
});

/**
 * Update a lost by ID.
 */
const updateLostById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const lost = await LostArtefactModel.findById(id);

  if (lost?.img && validateImagePath(lost.img)) {
    const isDocker = process.env.IS_PRODUCTION === "true";
    const filePath = resolveFilePath(lost.img, isDocker);

    try {
      await fsPromises.access(filePath, fs.constants.F_OK);
      await fsPromises.unlink(filePath);
    } catch (err) {
      console.error("File deletion error:", err);
    }
  }

  await LostArtefactModel.updateOne({ _id: id }, req.body);
  return res.status(200).json({ message: "Update Successful" });
});

/**
 * Upload an image for a lost.
 */
const uploadImage = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imagePath = req.file.path;
  const result = await LostArtefactModel.findByIdAndUpdate(
    id,
    { img: imagePath },
    { new: true }
  );

  if (!result) {
    return res.status(404).json({ message: "Lost artefact not found" });
  }

  return res.json({ message: "Image uploaded successfully", lost: result });
});

/**
 * Delete a lost by ID.
 */
const deleteLostbyId = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const lost = await LostArtefactModel.findById(id);

  if (!lost) {
    return res.status(404).json({ message: "Historic lost artefact not found" });
  }

  if (lost?.img && validateImagePath(lost.img)) {
    const isDocker = process.env.IS_PRODUCTION === "true";
    const filePath = resolveFilePath(lost.img, isDocker);

    try {
      await fsPromises.access(filePath, fs.constants.F_OK);
      await fsPromises.unlink(filePath);
    } catch (err) {
      console.error("Error deleting image file:", err);
    }
  }

  await lost.deleteOne();
  return res.json({ message: "Lost Artefact deleted successfully", lost });
});

/**
 * Delete an image associated with a lost.
 */
const deleteImage = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const lost = await LostArtefactModel.findById(id);

  if (!lost) {
    return res.status(404).json({ message: "Historic lost artefact not found" });
  }

  if (!validateImagePath(lost.img)) {
    return res
      .status(404)
      .json({ message: "No image associated with this lost" });
  }

  const isDocker = process.env.IS_PRODUCTION === "true";
  const filePath = resolveFilePath(lost.img, isDocker);

  try {
    await fsPromises.access(filePath, fs.constants.F_OK);
    await fsPromises.unlink(filePath);

    lost.img = null;
    await lost.save();

    return res.json({ message: "Image removed successfully", lost });
  } catch (err) {
    console.error("File deletion error:", err);
    return res.status(404).json({ message: "Image file not found" });
  }
});

module.exports = {
  createLost,
  getLostById,
  getLosts,
  //getLostBySearch,
  getEnabledLosts,
  deleteLostbyId,
  updateLostById,
  uploadImage,
  deleteImage,
};
