const { Schema, model } = require("mongoose");

const waterBillSchema = new Schema(
  {
    _id: { type: String, required: true },
    creator: { type: String, ref: "Employee" },
    serialNumber: { type: String, ref: "WaterMeter", required: true }, // شماره بدنه کنتور
    billIdentifier: { type: String }, // شناسه قبض
    paymentIdentifier: { type: String }, // شناسه پرداخت
    totalBillDebt: { type: Number, default: 0 }, // مبلغ پرداخت
    totalPeriod: { type: Number, default: 0 }, // مصرف کل دوره
    averageThirtyDay: { type: Number, default: 0 }, // متوسط مصرف 30 روز
    totalDays: { type: Number, default: 0 }, // تعداد کل روزهای دوره
    paymentDeadLine: { type: Date }, // مهلت پرداخت
    currentReading: { type: Date }, // قرائت کنونی
    previousReading: { type: Date }, // قرائت پیشین
    period: { type: String }, // دوره
    description: { type: String },

    image: { type: String }, // تصویر
    gallery: { type: [String], default: [] }, // گالری
  },
  { _id: false, timestamps: true },
);

const WaterBill = model("WaterBill", waterBillSchema);

module.exports = WaterBill;
