const { Schema, model } = require("mongoose");

const unitPositionSchema = new Schema(
  {
    _id: { type: String, required: true },
    dateCategory: { type: String, ref: "DateCategory", required: true },
    creator: { type: String, ref: "Employee", required: true },
    provinceName: { type: String, ref: "Province", required: true },
    countyName: { type: String, ref: "County", required: true },
    cityName: { type: String, ref: "City" },
    unitType: {
      type: String,
      enum: ["Management", "Department", "Agency", "WithoutDepartment"],
      required: true,
    }, // مدیریت / اداره / نمایندگی / فاقد واحد اداری
    WithTenure: { type: Number, default: 0 },
    WithoutTenure: { type: Number, default: 0 },
    officeComplex: { type: Boolean, default: false }, // احداث مجتمع اداری
    population: { type: Number, default: 0 }, // جمعیت شهر یا شهرستان
    distance: { type: Number, default: 0 }, // فاصله تا نزدیکترین شهر یا شهرستان
    isUpdate: { type: Boolean, default: false }, // قابلیت ارتقا دارد
    updateDescription: { type: String }, // توضیحات قابلیت ارتقا داشتن یا نداشتن
    description: { type: String },
  },
  { _id: false, timestamps: true }
);

const UnitPosition = model("UnitPosition", unitPositionSchema);

module.exports = UnitPosition;
