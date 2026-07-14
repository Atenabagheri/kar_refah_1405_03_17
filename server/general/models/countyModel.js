const { Schema, model } = require("mongoose");

const countySchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    faName: { type: String, required: true, unique: true },
    provinceName: { type: String, ref: "Province", required: true },
    city: { type: Boolean, default: false },
    isNewCounty: { type: Boolean, default: false },
    population: { type: Number, default: 0 },
    description: { type: String },
  },
  { _id: false, timestamps: true }
);

countySchema.pre("save", function (next) {
  if (!this.name) {
    this.name = this._id;
  }
  next();
});

const County = model("County", countySchema);

module.exports = County;
