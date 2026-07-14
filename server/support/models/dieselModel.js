const { Schema, model } = require("mongoose");

const dieselSchema = new Schema(
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
    invoiceNumber: {
      // شماره فاکتور
      type: String,
      trim: true,
    },
    documentNumber: {
      // شماره نیاز
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    amount: {
      // مبلغ خرید
      type: Number,
      required: true,
    },
    quantity: {
      // میزان خرید
      type: Number,
      required: true,
    },

    image: { type: String }, // تصویر
    gallery: { type: [String], default: [] }, // گالری

    description: { type: String },
  },
  { _id: false, timestamps: true },
);

const Diesel = model("Diesel", dieselSchema);

module.exports = Diesel;
