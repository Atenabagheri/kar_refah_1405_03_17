const { Schema, model } = require("mongoose");

const electricityMeterSchema = new Schema(
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
    description: { type: String },

    serialNumber: { type: String, required: true }, // شماره بدنه کنتور
    billIdentifier: { type: String, required: true }, // شناسه قبض کنتور

    companyName: { type: String }, // نام شرکت توزیع برق
    customerName: { type: String }, // مشترک گرامی
    phase: { type: String }, // فاز
    amper: { type: String }, // آمپر
    serviceAdd: { type: String }, // آدرس انشعاب
    tariffTypeName: { type: String }, // تعرفه

    image: { type: String }, // تصویر
    gallery: { type: [String], default: [] }, // گالری
  },
  { _id: false, timestamps: true },
);

const ElectricityMeter = model("ElectricityMeter", electricityMeterSchema);

module.exports = ElectricityMeter;
