const asyncHandler = require("express-async-handler");
const FileModel = require("../models/file");
const path = require('path')
const handleUpload = asyncHandler(async (req, res) => {
    // save file path in DB
    console.log(req.file)
    return res.json(req.file)
    //const file = new FileModel(req.file)
    //file.save()
    //return res.json(file)

})
const getFile = asyncHandler(async (req, res) => {
    const id = req.params.id
    const file = await FileModel.findById(id)
    return res.sendFile(path.join(__dirname, "./../../" + file.path))
})
const getAllFiles = asyncHandler(async (req, res) => {
    const files = await FileModel.find()
    return res.json(files)
})
const handleUploads = asyncHandler(async (req, res) => {
    // const file = new FileModel(req.file)
    // file.save()
    const files = req.files
    return res.json(files)
})
const deleteFile = asyncHandler(async (req, res) => {
    const id = req.params.id
    const file = await FileModel.findById(id)
    fs.unlinkSync(path.join(__dirname, "./../../" + file.path))
    const result = await FileModel.deleteOne({ _id: id })
    return res.json(result)
})
module.exports = { handleUpload, getFile, handleUploads,getAllFiles,deleteFile}