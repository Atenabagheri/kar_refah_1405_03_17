const { Schema, model } = require("mongoose");

const positionSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    code: { type: String, required: true, unique: true, trim: true }, // کد ملی
    maxEmployees: { type: Number, min: 1, default: 1 },
  },
  { _id: false, timestamps: true },
);

positionSchema.pre("save", function (next) {
  if (!this.code) {
    this.code = this._id;
  }
  next();
});

const Position = model("Position", positionSchema);

module.exports = Position;
