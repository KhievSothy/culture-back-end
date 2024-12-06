const mongoose = require('mongoose')

const siteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    createdDate: { type: Date, required: true, default: new Date() },
})

const SiteModel = mongoose.model('Site', siteSchema)

module.exports = SiteModel