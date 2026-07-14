const { Schema, model } = require("mongoose");

const vehicleTypeSchema = new Schema(
  {
    _id: { type: String, required: true },
    creator: { type: String, ref: "Employee", required: true },
    priority: { type: Number, trim: true, default: 0 }, // اولویت
    name: { type: String, required: true, unique: true }, // نام انگلیسی نوع وسیله نقلیه
    faName: { type: String, required: true }, // نام فارسی نوع وسیله نقلیه
    description: { type: String }, // توضیحات نوع وسیله نقلیه
  },
  { _id: false, timestamps: true }
);

const VehicleType = model("VehicleType", vehicleTypeSchema);

module.exports = VehicleType;
