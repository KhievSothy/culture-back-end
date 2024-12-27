const mongoose = require('mongoose')

const museumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    createdDate: { type: Date, required: true, default: new Date() },
})

const MuseumModel = mongoose.model('Museum', museumSchema)

module.exports = MuseumModel