const { Schema, model } = require("mongoose");

const roomSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    building: { type: String, ref: "Building", trim: true },
    floor: { type: String, ref: "Floor", trim: true },
    number: { type: String, required: true, unique: true, trim: true },
    image: { type: String }, // تصویر
    gallery: { type: [String], default: [] }, // گالری
  },
  {
    _id: false,
    timestamps: true,
  }
);

roomSchema.pre("save", function (next) {
  if (!this.number) {
    this.number = this._id;
  }
  next();
});

const Room = model("Room", roomSchema);

module.exports = Room;
