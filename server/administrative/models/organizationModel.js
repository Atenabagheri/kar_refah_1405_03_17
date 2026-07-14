const { Schema, model } = require("mongoose");

const organizationSchema = new Schema(
  {
    _id: { type: String, required: true },
    dateCategory: { type: String, ref: "DateCategory", required: true },
    creator: { type: String, ref: "Employee", required: true },
    provinceName: { type: String, ref: "Province", required: true },
    management: { type: Number, default: 0 }, // معاونت
    department: { type: Number, default: 0 }, // اداره/گروه
    WithTenure: { type: Number, default: 0 },
    WithoutTenure: { type: Number, default: 0 },
    description: { type: String },
  },
  { _id: false, timestamps: true }
);

const Organization = model(
  "Organization",
  organizationSchema
);

module.exports = Organization;
