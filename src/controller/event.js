
const asyncHandler = require('express-async-handler')
const EventModel = require('../models/event.js')
const redisClient = require('../redis/index.js')
const {PaginationParameters} = require('mongoose-paginate-v2')
/**
 * Controller is a specific function to handle specific tasks
 */

const createEvent = asyncHandler(async (req, res) => {
    const event = new EventModel(req.body)
    const result = await event.save()
    return res.json(result)
})

const getEventById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const event = await EventModel.findById(id)
    return res.json(event)
})

const getEvents = asyncHandler(async (req, res) => {
    const { join } = req.query
    // Get all courses 
    const events = await EventModel.find().populate(join)
    return res.json(events)
})

const deleteEventbyId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await EventModel.deleteOne({ _id: id })
    return res.json(result)
})

const updateEventById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await EventModel.updateOne({ _id: id }, req.body)
    return res.json(result)
})

module.exports = {
    createEvent,
    getEventById,
    getEvents,
    deleteEventbyId,
    updateEventById
}

