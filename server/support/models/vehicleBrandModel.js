const { Schema, model } = require("mongoose");

const vehicleBrandSchema = new Schema(
  {
    _id: { type: String, required: true },
    creator: { type: String, ref: "Employee", required: true },
    name: { type: String, required: true, unique: true }, // نام انگلیسی برند
    faName: { type: String, required: true }, // نام فارسی برند
    country: { type: String }, // کشور سازنده
    foundedYear: { type: String }, // سال تأسیس برند
    logo: { type: String }, // لینک لوگو
    description: { type: String }, // توضیحات برند
    isActive: { type: Boolean, default: true }, // وضعیت فعال یا غیرفعال
  },
  { _id: false, timestamps: true }
);

const VehicleBrand = model("VehicleBrand", vehicleBrandSchema);

module.exports = VehicleBrand;
