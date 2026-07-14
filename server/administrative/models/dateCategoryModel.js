const { Schema, model } = require("mongoose");

const dateCategorySchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, trim: true }, // عنوان
    description: { type: String, trim: true }, // توضیحات
    code: { type: String, trim: true, unique: true, sparse: true },
  },
  { _id: false, timestamps: true }
);

dateCategorySchema.pre("save", function (next) {
  if (!this.code) {
    this.code = this._id;
  }
  next();
});

const DateCategory = model("DateCategory", dateCategorySchema);

module.exports = DateCategory;
