const express = require('express')
const { handleUpload, handleUploads, getAllFiles, deleteFile } = require('../controller/file')
const { singleUpload, multipleUploads } = require('../middlewares')
const fileRouter = express.Router()

fileRouter.post('/upload-single', singleUpload, handleUpload)
fileRouter.post('/upload-multiple', multipleUploads, handleUploads)
fileRouter.delete('/:id', deleteFile)
fileRouter.get('/getallfile', getAllFiles)

module.exports = fileRouter