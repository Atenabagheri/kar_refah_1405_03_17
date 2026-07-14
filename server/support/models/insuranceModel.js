const { Schema, model } = require("mongoose");

// تعریف اسکیمای بیمه خودرو
const insuranceSchema = new Schema(
  {
    _id: { type: String, required: true },
    // کد یکتای بیمه‌نامه
    insuranceCode: { type: String, unique: true, trim: true, required: true },

    // شماره بیمه شخص ثالث
    thirdPartyNumber: { type: String, trim: true },

    // تاریخ اعتبار بیمه شخص ثالث
    thirdPartyExpire: { type: Date },

    // شماره بیمه بدنه
    bodyNumber: { type: String, trim: true },

    // تاریخ اعتبار بیمه بدنه
    bodyExpire: { type: Date },

    // سریال گواهی معاینه فنی
    inspectionSerial: { type: String, trim: true },

    // تاریخ اعتبار گواهی معاینه فنی
    inspectionExpire: { type: Date },

    // ایجادکننده رکورد (ارجاع به کارمند)
    creator: {
      type: String,
      ref: "Employee",
    },

    // خودرو بیمه‌شده (ارجاع به مدل Car)
    vehicle: {
      type: String,
      ref: "Vehicle",
      required: true,
    },
    image: { type: String }, // تصویر
    gallery: { type: [String], default: [] }, // گالری

    description: { type: String }, // توضیحات
  },
  { _id: false, timestamps: true },
);

// ساخت مدل بیمه
const Insurance = model("Insurance", insuranceSchema);

module.exports = Insurance;
