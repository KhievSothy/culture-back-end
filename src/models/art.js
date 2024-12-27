const mongoose = require('mongoose')

const artSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    createdDate: { type: Date, required: true, default: new Date() },
})

const ArtModel = mongoose.model('Arts', artSchema)

module.exports = ArtModel