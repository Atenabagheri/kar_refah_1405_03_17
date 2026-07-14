const { Schema, model } = require("mongoose");

const assetSchema = new Schema(
  {
    _id: { type: String, required: true },
    creator: { type: String, ref: "Employee", required: true },
    type: {
      type: String,
      enum: ["hqs", "province"], // ستادی / استانی
      required: true,
    },
    name: { type: String, required: true, trim: true }, // نام دسته‌بندی
    description: { type: String, trim: true }, // توضیحات
    category: {
      type: String,
      ref: "AssetCategory",
      required: true,
    },
    employee: {
      type: String,
      ref: "Employee",
      index: true,
    },
    roomNumber: {
      type: String,
      ref: "Room",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    serialNumber: { type: String, trim: true, unique: true, required: true },
  },
  { _id: false, timestamps: true }
);

assetSchema.pre("save", function (next) {
  if (!this.serialNumber) {
    this.serialNumber = this._id;
  }
  next();
});

const Asset = model("Asset", assetSchema);

module.exports = Asset;
