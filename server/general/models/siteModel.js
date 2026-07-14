const { Schema, model } = require("mongoose");

const siteSchema = new Schema(
  {
    _id: { type: String, required: true },
    postalCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    province: { type: String, ref: "Province" },
    county: { type: String, ref: "County" },
    city: { type: String, ref: "City" },
    creator: { type: String, ref: "Employee" },
    description: { type: String, trim: true },
    address: { type: String, trim: true },
    longitude: { type: Number, trim: true }, // طول جغرافیایی
    latitude: { type: Number, trim: true }, // عرض جغرافیایی
    meterage: { type: Number, trim: true }, // متراژ زمین
  },
  { _id: false, timestamps: true }
);

siteSchema.pre("save", function (next) {
  if (!this.postalCode) {
    this.postalCode = this._id;
  }
  next();
});

const Site = model("Site", siteSchema);

module.exports = Site;
