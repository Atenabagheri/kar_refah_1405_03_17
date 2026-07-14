const { Schema, model } = require("mongoose");

const greenBillSchema = new Schema(
  {
    _id: { type: String, required: true },
    creator: { type: String, ref: "Employee" },
    serialNumber: { type: String, ref: "GreenMeter", required: true }, // شماره بدنه کنتور
    billIdentifier: { type: String, ref: "GreenMeter", required: true }, // شماره قبض کنتور
    totalPeriod: { type: Number, default: 0 }, // تولید کل دوره
    totalDays: { type: Number, default: 0 }, // تعداد کل روزهای دوره
    currentReading: { type: Date }, // قرائت کنونی
    previousReading: { type: Date }, // قرائت پیشین
    period: { type: String }, // دوره
    description: { type: String },
  },
  { _id: false, timestamps: true }
);

const GreenBill = model("GreenBill", greenBillSchema);

module.exports = GreenBill;
