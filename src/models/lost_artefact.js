const mongoose = require('mongoose');

const lostArtefactSchema = new mongoose.Schema({
  title_kh: { type: String, required: true },
  title_en: { type: String, required: true },
  objecttype_kh: { type: String, required: true },
  objecttype_en: { type: String, required: true },
  period_kh: { type: String, required: true },
  period_en: { type: String, required: true },
  style_kh: { type: String, required: true },
  style_en: { type: String, required: true },
  shape_kh: { type: String, required: true },
  shape_en: { type: String, required: true },
  hight: { type: Number, required: true },
  width: { type: Number, required: true },
  depth: { type: Number, required: true },
  diameter: { type: Number, required: true },
  weight: { type: Number, required: true },  
  desc_kh: { type: String, required: true },
  desc_en: { type: String, required: true },
  provenance_kh: { type: String, required: true },
  provenance_en: { type: String, required: true },
  report_no: { type: String, required: true },
  is_enable: { type: Boolean, require: true, default: true },
  img: { type: String, required: false },
  createdDate: { type: Date, required: true, default: new Date() },
});

const LostArtefactModel = mongoose.model("Lost", lostArtefactSchema);

module.exports = LostArtefactModel;
