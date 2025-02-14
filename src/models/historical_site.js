const mongoose = require("mongoose");

const historicSiteSchema = new mongoose.Schema({
  title_kh: { type: String, required: true },
  title_en: { type: String, required: true },
  desc_kh: { type: String, required: true },
  desc_en: { type: String, required: true },
  is_enable: { type: Boolean, require: true, default: true },
  img: { type: String, required: false },
  createdDate: { type: Date, required: true, default: new Date() },
});

const HistoricSiteModel = mongoose.model("Historical_Site", historicSiteSchema);

module.exports = HistoricSiteModel;
