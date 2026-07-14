const { Schema, model } = require("mongoose");

const sectionHeadquarterSchema = new Schema(
  {
    _id: { type: String, required: true },
    dateCategory: { type: String, ref: "DateCategory", required: true },
    creator: { type: String, ref: "Employee", required: true },
    divisionCode: { type: String, ref: "Division", required: true },
    sectionCode: { type: String, ref: "Section", required: true },
    sectionDeputy: { type: Number, default: 0 }, // معاونت
    sectionCenter: { type: Number, default: 0 }, // مرکز
    sectionGeneral: { type: Number, default: 0 }, // اداره کل
    sectionOffice: { type: Number, default: 0 }, // دفتر
    sectionManagement: { type: Number, default: 0 }, // مدیریت
    sectionDepartment: { type: Number, default: 0 }, // اداره/گروه
    description: { type: String },
  },
  { _id: false, timestamps: true }
);

const SectionHeadquarter = model(
  "SectionHeadquarter",
  sectionHeadquarterSchema
);

module.exports = SectionHeadquarter;
