const { Schema, model } = require("mongoose");

const citySchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    faName: { type: String, required: true, unique: true },
    countyName: { type: String, ref: "County", required: true },
    provinceName: { type: String, ref: "Province", required: true },
  },
  { _id: false, timestamps: true }
);

citySchema.pre("save", function (next) {
  if (!this.name) {
    this.name = this._id;
  }
  next();
});

const City = model("City", citySchema);

module.exports = City;
