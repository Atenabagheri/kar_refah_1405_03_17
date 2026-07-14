const { Schema, model } = require("mongoose");

const sectionSchema = new Schema(
  {
    _id: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    faName: { type: String, required: true, unique: true },
    divisionCode: { type: String, ref: "Division", required: true },
    description: { type: String, trim: true },
  },
  { _id: false, timestamps: true }
);

sectionSchema.pre("save", function (next) {
  if (!this.code) {
    this.code = this._id;
  }
  next();
});

const Section = model("Section", sectionSchema);

module.exports = Section;
