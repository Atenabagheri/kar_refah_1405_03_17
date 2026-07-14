const { Schema, model } = require("mongoose");

const employeeSchema = new Schema(
  {
    _id: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    nationalId: { type: String, required: true, unique: true, trim: true }, // کد ملی
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    positionCode: {
      type: String,
      ref: "Position",
    },
    roomNumber: {
      type: String,
      ref: "Room",
    },
    password: { type: String },
    province: {
      type: String,
      ref: "Province",
    },
    county: {
      type: String,
      ref: "County",
    },
    roles: {
      type: String,
      enum: ["MPO", "EPO", "MHQO", "EHQO"],
      // ManagerProvinceObserver
      // EmployeeProvinceObserver
      // ManagerHeadquartersObserver
      // EmployeeHeadquartersObserver
    },
    isAdmin: { type: Boolean, default: false },
    image: { type: String }, // تصویر ساختمان
    gallery: { type: [String], default: [] }, // گالری تصاویر
  },
  { _id: false, timestamps: true },
);

employeeSchema.pre("save", function (next) {
  if (!this.nationalId) {
    this.nationalId = this._id;
  }
  next();
});

const Employee = model("Employee", employeeSchema);

module.exports = Employee;
