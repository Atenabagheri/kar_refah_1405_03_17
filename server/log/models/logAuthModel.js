const { Schema, model } = require("mongoose");

const logAuthSchema = new Schema({
  employee: { type: String, ref: "Employee", required: false },
  action: { type: String, required: true }, // "login", "change_password"
  status: { type: String, default: "success" }, // success, failure
  ip: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
  details: { type: Object }, // برای اطلاعات اضافی مثل تغییرات
});

module.exports = model("Log", logAuthSchema);
