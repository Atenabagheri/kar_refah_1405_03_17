const { Schema, model } = require("mongoose");

const electricityBillSchema = new Schema(
  {
    _id: { type: String, required: true },
    creator: { type: String, ref: "Employee" },
    billIdentifier: { type: String, ref: "ElectricityMeter", required: true }, // شماره قبض کنتور
    description: { type: String },

    avgCost: { type: Number },
    billAmt: { type: Number },
    billType: { type: String },
    energyAmt: { type: Number },
    grossAmt: { type: Number },
    insuranceAmt: { type: Number },
    issueDate: { type: String },
    lowCons: { type: Number },
    normalCons: { type: Number },
    patternMessage: { type: String },
    peakCons: { type: Number },
    powerPaytollAmt: { type: Number },
    prevReadingDate: { type: String },
    previousEnergyDebit: { type: Number },
    processStatus: { type: String },
    readingDate: { type: String },
    salePrd: { type: Number },
    saleYear: { type: Number },
    taxAmt: { type: Number },
    totalDays: { type: Number },

    image: { type: String }, // تصویر
    gallery: { type: [String], default: [] }, // گالری
  },
  { _id: false, timestamps: true },
);

const ElectricityBill = model("ElectricityBill", electricityBillSchema);

module.exports = ElectricityBill;
