const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    createdDate: { type: Date, required: true, default: new Date() },
})

const EventModel = mongoose.model('Events', eventSchema)

module.exports = EventModel