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

const getSites = asyncHandler(async (req, res) => {
    const key = '/sites'
    const result = await redisClient.get(key)
    // console.log(result)
    if (!result) {
        // Query operation takes time
        console.log("Consuming Time")
        const sites = await SiteModel.find()
        redisClient.set(key, JSON.stringify(sites), {
            EX: 30
        })
        return res.json(sites)
    }
    const site = JSON.parse(result)
    // console.log(result)
    return res.json(site)
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