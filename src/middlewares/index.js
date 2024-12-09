const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const { validationResult } = require('express-validator');

// File Upload
const multer = require('multer');
const path = require('path')

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
    const extract = token.split(' ')[1]
    const decoded = jwt.verify(extract, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id)
    req.user = user;
    next();
})
function logger(req, res, next) {
    // console.log(req)
    console.log("Incoming request", req.rawHeaders[3])
    // Example, request from unauthorized user
    // return res.status(404).send("Forbidden")
    next()
}

function authroize(req, res, next) {
    return res.status(404).json({
        msg: "Not Found"
    })
}

function handleError(error, req, res, next) {
    // console.log("Hello")
    // console.log(error.message)
    return res.status(500).json(error.message)
}

function checkId(req, res, next) {
    const id = req.params.id
    const site = sites.find((item) => {
        return item.id == id
    })
    if (!course) {
        return res.status(404).json({
            error: "Resource Not Found"
        })
    }
    next()
}

function handleValidation(req, res, next) {
    console.log("Hello")
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
})
const singleUpload = multer({
    storage: storage,
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
}).single('file')

module.exports = {
    handleError,
    logger,
    verifyJWT,
    handleValidation,
//    cacheInterceptor,
//    cacheMiddleware,
//    invalidateInterceptor,
    singleUpload
}