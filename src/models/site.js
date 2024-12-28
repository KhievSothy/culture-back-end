const { boolean } = require('joi')
const mongoose = require('mongoose')

const siteSchema = new mongoose.Schema({
    title_kh: { type: String, required: true },
    title_en: { type: String, required: true },
    is_enable: { type: Boolean, required: true },
    desc_kh: { type: String, required: true },
    desc_en: { type: String, required: true },
    img: { type: String, default: '' },
    createdDate: { type: Date, required: true, default: new Date() },
})

const SiteModel = mongoose.model('Site', siteSchema)

module.exports = SiteModel