const { Schema, model } = require("mongoose");

const buildingSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    address: { type: String, trim: true },
    numberBuilding: { type: String, trim: true }, // شماره ساختمان
    number: { type: String, trim: true }, // پلاک
    postalCode: { type: String, required: true, unique: true, trim: true }, // کد پستی
    division: { type: String, ref: "Division" }, // ستاد در اختیار
    province: { type: String, ref: "Province" },
    county: { type: String, ref: "County" },
    city: { type: String, ref: "City" },
    site: { type: String, ref: "Site" },
    usage: {
      type: [String],
      enum: [
        "administrative",
        "educational",
        "sports",
        "welfare",
        "cultural",
        "other",
      ], // اداری آموزشی ورزشی رفاهی فرهنگی سایر
      required: true,
    },
    type: {
      type: String,
      enum: ["hqs", "province"], // ستادی / استانی
      required: true,
    },
    ownership: {
      type: String,
      enum: ["other", "owner", "leased"], // سایر ملکی استیجاری
      required: true,
    },
    priority: { type: Number, trim: true, default: 0 }, // اولویت
    longitude: { type: Number, trim: true }, // طول جغرافیایی
    latitude: { type: Number, trim: true }, // عرض جغرافیایی
    landArea: { type: Number, trim: true }, // عرصه (متراژ زمین)
    builtArea: { type: Number, trim: true }, // اعیان (متراژ بنا)
    meterage: { type: Number, trim: true }, // متراژ زمین
    floors: { type: Number, trim: true }, // طبقات
    image: { type: String }, // تصویر ساختمان
    gallery: { type: [String], default: [] }, // گالری تصاویر
  },
  {
    _id: false,
    timestamps: true,
  }
);

buildingSchema.pre("save", function (next) {
  if (!this.postalCode) {
    this.postalCode = this._id;
  }
  next();
});

const Building = model("Building", buildingSchema);

module.exports = Building;
