const { Schema, model } = require("mongoose");

// تعریف اسکیمای نگهداری و تعمیرات خودرو
const maintenanceSchema = new Schema(
  {
    _id: { type: String, required: true },

    repairDate: {
      // تاریخ تعمیر
      type: Date,
      required: true,
    },

    repairType: {
      // نوع تعمیرات
      type: String,
      required: true,
      trim: true,
    },

    repairShop: {
      // مشخصات تعمیرگاه
      type: String,
      required: true,
      trim: true,
    },

    partsPayment: {
      // مبلغ پرداختی بابت قطعات
      type: Number,
      required: true,
    },

    laborPayment: {
      // مبلغ پرداختی بابت دستمزد
      type: Number,
      required: true,
    },

    financialDocumentNumber: {
      // شماره سند مالی
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    creator: {
      // ایجادکننده رکورد (ارجاع به کارمند)
      type: String,
      ref: "Employee",
      required: true,
    },

    vehicle: {
      // خودروی مربوطه (ارجاع به مدل Car)
      type: String,
      ref: "Vehicle",
      required: true,
    },

    description: { type: String }, // توضیحات
  },
  { _id: false, timestamps: true } // زمان ایجاد و بروزرسانی خودکار
);

const Maintenance = model("Maintenance", maintenanceSchema);

module.exports = Maintenance;
