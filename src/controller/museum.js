const MuseumModel = require('../models/museum.js')
const asyncHandler = require('express-async-handler')
const redisClient = require('../redis/index.js')

/**
 * Controller is a specific function to handle specific tasks
 */

const createMuseum = asyncHandler(async (req, res) => {
    const museum = new MuseumModel(req.body)
    const result = await museum.save()
    return res.json(result)
})

const getMuseumById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const art = await MuseumModel.findById(id)
    return res.json(art)
})


const getMuseums = asyncHandler(async (req, res) => {
    const { join } = req.query
    // Get all sites 
    const museums = await MuseumModel.find().populate(join)
    return res.json(museums)
})

const deleteMuseumbyId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await MuseumModel.deleteOne({ _id: id })
    return res.json(result)
})

const updateMuseumById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await MuseumModel.updateOne({ _id: id }, req.body)
    // const result = await SiteModel.findByIdAndUpdate(id, req.body)
    return res.json(result)
})

module.exports = {
    createMuseum,
    getMuseumById,
    getMuseums,
    deleteMuseumbyId,
    updateMuseumById
}