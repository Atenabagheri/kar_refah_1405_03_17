// models/Setting.js
const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed, // هر نوع داده‌ای را می‌پذیرد
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    creator: { type: String, ref: "Employee" },
  },
  { timestamps: true }, // createdAt و updatedAt خودکار
);

module.exports = mongoose.model("Setting", settingSchema);
