const { Schema, model } = require("mongoose");

const assetCategorySchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true }, // نام دسته‌بندی
    description: { type: String, trim: true }, // توضیحات
    code: { type: String, trim: true, unique: true, sparse: true },
  },
  { _id: false, timestamps: true }
);

assetCategorySchema.pre("save", function (next) {
  if (!this.code) {
    this.code = this._id;
  }
  next();
});

const AssetCategory = model("AssetCategory", assetCategorySchema);

module.exports = AssetCategory;
