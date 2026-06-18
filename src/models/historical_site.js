const mongoose = require("mongoose");

const historicSiteSchema = new mongoose.Schema({

  site_number: { type: String, required: true },
  ik_number: { type: String},
  title_kh: { type: String, required: true },
  title_en: { type: String, required: true },

  // TEMPORARY OPTIONAL
  category_site_kh: { type: String },
  type_of_site_kh: { type: String },
  village_kh: { type: String },
  commune_kh: { type: String },
  district_kh: { type: String },
  province_kh: { type: String },
  coordinate_system: { type: String },
  utm_x: { type: Number },
  utm_y: { type: Number },
  period: { type: String },
  style: { type: String },
  code_property: { type: String },
  inscription_number: { type: String },
  refernce: { type: String },
  registered_date: { type: Date },
  desc_kh: { type: String, required: true },
  desc_en: { type: String},

  is_enable: {type: Boolean, default: true, },

  img: [
    {
      path: String,
      is_cover: {
        type: Boolean,
        default: false,
      },
      order: {
        type: Number,
        default: 0,
      },
      caption: {
        type: String,
        default: "",
      },
    },
  ],

  createdDate: {
    type: Date,
    default: Date.now,
  },

});

const HistoricSiteModel = mongoose.model(
  "Historical_Site",
  historicSiteSchema
);

module.exports = HistoricSiteModel;
