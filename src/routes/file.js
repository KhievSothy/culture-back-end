const express = require('express')
const { handleUpload } = require('../controller/file')
const { singleUpload } = require('../middlewares')
const fileRouter = express.Router()
fileRouter.post('/upload-single', singleUpload, handleUpload)
module.exports = fileRouter