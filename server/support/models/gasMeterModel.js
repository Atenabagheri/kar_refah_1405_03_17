const { Schema, model } = require("mongoose");

const gasMeterSchema = new Schema(
  {
    _id: { type: String, required: true },
    creator: { type: String, ref: "Employee" },
    type: {
      type: String,
      enum: ["hqs", "province"], // ستادی / استانی
      required: true,
    },
    building: { type: String, ref: "Building" },
    site: { type: String, ref: "Site" },
    province: {
      type: String,
      ref: "Province",
    },
    county: {
      type: String,
      ref: "County",
    },
    buildingsCover: { type: [String], ref: "Building" },
    serialNumber: { type: String, required: true }, // شماره بدنه کنتور
    billIdentifier: { type: String, required: true }, // شناسه قبض کنتور
    description: { type: String },

    image: { type: String }, // تصویر
    gallery: { type: [String], default: [] }, // گالری
  },
  { _id: false, timestamps: true },
);

const GasMeter = model("GasMeter", gasMeterSchema);

module.exports = GasMeter;
