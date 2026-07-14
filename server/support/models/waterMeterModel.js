const { Schema, model } = require("mongoose");

const waterMeterSchema = new Schema(
  {
    _id: { type: String, required: true },
    creator: { type: String, ref: "Employee" },
    type: {
      type: String,
      enum: ["hqs", "province"], // ستادی / استانی
      required: true,
    },
    province: {
      type: String,
      ref: "Province",
    },
    county: {
      type: String,
      ref: "County",
    },
    building: { type: String, ref: "Building" },
    site: { type: String, ref: "Site" },
    buildingsCover: { type: [String], ref: "Building" },
    serialNumber: { type: String, required: true }, // شماره بدنه کنتور
    billIdentifier: { type: String, required: true }, // شناسه قبض کنتور

    image: { type: String }, // تصویر
    gallery: { type: [String], default: [] }, // گالری

    description: { type: String },
  },
  { _id: false, timestamps: true },
);

const WaterMeter = model("WaterMeter", waterMeterSchema);

module.exports = WaterMeter;
