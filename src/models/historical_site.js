const mongoose = require("mongoose");

const historicSiteSchema = new mongoose.Schema({
  site_number: { type: String, required: true },
  ik_number: { type: String, required: true },
  title_kh: { type: String, required: true },
  title_en: { type: String, required: true },
  category_site_kh: { type: String, required: true },
  type_of_site_kh: { type: String, required: true },
  village_kh: { type: String, required: true },
  commune_kh: { type: String, required: true },
  district_kh: { type: String, required: true },
  province_kh: { type: String, required: true },
  coordinate_system: { type: String, required: true },
  utm_x: { type: Number, required: true },
  utm_y: { type: Number, required: true },
  period: { type: String, required: true },
  style: { type: String, required: true },
  code_property: { type: String, required: true },
  inscription_number: { type: String, required: true },
  refernce: { type: String, required: true },
  registered_date: { type: Date, required: true},
  desc_kh: { type: String, required: true },
  desc_en: { type: String, required: true },
  is_enable: { type: Boolean, require: true, default: true },
  img: { type: String, required: false },
  createdDate: { type: Date, required: true, default: new Date() },
});

const HistoricSiteModel = mongoose.model("Historical_Site", historicSiteSchema);

module.exports = HistoricSiteModel;
