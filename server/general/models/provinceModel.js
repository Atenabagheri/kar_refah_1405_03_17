const { Schema, model } = require("mongoose");

const provinceSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    faName: { type: String, required: true, unique: true },
    population: { type: Number, default: 0 },
    description: { type: String },
  },
  { _id: false, timestamps: true }
);

provinceSchema.pre("save", function (next) {
  if (!this.name) {
    this.name = this._id;
  }
  next();
});

const Province = model("Province", provinceSchema);

module.exports = Province;
