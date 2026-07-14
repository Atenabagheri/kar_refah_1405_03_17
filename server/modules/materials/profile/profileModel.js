const { Schema, model } = require("mongoose");

const profileSchema = new Schema(
  {
    _id: { type: String, required: true },
    code: { type: String, trim: true, unique: true, required: true },
    name: { type: String, required: true, trim: true }, // نام دسته‌بندی
    description: { type: String, trim: true }, // توضیحات
    creator: { type: String, ref: "Employee", required: true },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false, timestamps: true },
);

profileSchema.pre("save", function (next) {
  if (!this.code) {
    this.code = this._id;
  }
  next();
});

const Profile = model("Profile", profileSchema);

module.exports = Profile;
