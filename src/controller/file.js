const asyncHandler = require("express-async-handler");

const handleUpload = asyncHandler(async (req, res) => {
    // save file path in DB
    console.log(req.file)
    return res.json(req.file)

})

module.exports = { handleUpload }