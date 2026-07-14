const { Schema, model } = require("mongoose");

const floorSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    number: { type: String, required: true, unique: true, trim: true }, // پلاک
  },
  {
    _id: false,
    timestamps: true,
  }
);

floorSchema.pre("save", function (next) {
  if (!this.number) {
    this.number = this._id;
  }
  next();
});

const Floor = model("Floor", floorSchema);

module.exports = Floor;
