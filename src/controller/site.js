const SiteModel = require('../models/site.js')
const asyncHandler = require('express-async-handler')
const redisClient = require('../redis/index.js')

/**
 * Controller is a specific function to handle specific tasks
 */

const createSite = asyncHandler(async (req, res) => {
    const site = new SiteModel(req.body)
    const result = await site.save()
    return res.json(result)
})

const getSiteById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const site = await SiteModel.findById(id)
    return res.json(site)
})

//const getSites = asyncHandler(async (req, res) => {
//    const key = '/sites'
//    const result = await redisClient.get(key)
//    if (!result) {
//        console.log("Consuming Time")
//        const sites = await SiteModel.find()
//        redisClient.set(key, JSON.stringify(sites), {
//            EX: 30
//        })
//        return res.json(sites)
//    }
//    const site = JSON.parse(result)
//    return res.json(site)
//})

const getSites = asyncHandler(async (req, res) => {
    const { join } = req.query
    // Get all sites 
    const sites = await SiteModel.find().populate(join)
    return res.json(sites)
})

const deleteSitebyId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await SiteModel.deleteOne({ _id: id })
    return res.json(result)
})

const updateSiteById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await SiteModel.updateOne({ _id: id }, req.body)
    // const result = await SiteModel.findByIdAndUpdate(id, req.body)
    return res.json(result)
})

module.exports = {
    createSite,
    getSiteById,
    getSites,
    deleteSitebyId,
    updateSiteById
}