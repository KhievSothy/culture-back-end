const ArtModel = require('../models/art.js')
const asyncHandler = require('express-async-handler')
const redisClient = require('../redis/index.js')

/**
 * Controller is a specific function to handle specific tasks
 */

const createArt = asyncHandler(async (req, res) => {
    const art = new ArtModel(req.body)
    const result = await site.save()
    return res.json(result)
})

const getArtById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const art = await ArtModel.findById(id)
    return res.json(art)
})


const getArts = asyncHandler(async (req, res) => {
    const { join } = req.query
    // Get all sites 
    const arts = await ArtModel.find().populate(join)
    return res.json(arts)
})

const deleteArtbyId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await ArtModel.deleteOne({ _id: id })
    return res.json(result)
})

const updateArtById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await ArtModel.updateOne({ _id: id }, req.body)
    // const result = await SiteModel.findByIdAndUpdate(id, req.body)
    return res.json(result)
})

module.exports = {
    createArt,
    getArtById,
    getArts,
    deleteArtbyId,
    updateArtById
}