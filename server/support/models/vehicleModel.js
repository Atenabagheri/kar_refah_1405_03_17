const { Schema, model } = require("mongoose");

const vehicleSchema = new Schema(
  {
    _id: { type: String, required: true, trim: true },
    creator: { type: String, ref: "Employee"},
    type: {
      type: String,
      enum: ["hqs", "province"], // ستادی / استانی
      required: true,
    },
    province: {
      type: String,
      ref: "Province",
    },
    county: {
      type: String,
      ref: "County",
    },
    // اطلاعات پایه
    vehicleType: {
      type: String,
      ref: "VehicleType",
      required: true,
    },
    brand: { type: String, ref: "VehicleBrand", required: true }, // برند
    model: { type: String, required: true }, // مدل (Corolla, i8, ...)
    year: { type: String, required: true }, // سال ساخت
    vin: { type: String, unique: true, trim: true }, // شماره شاسی / VIN
    engineNumber: { type: String, unique: true, trim: true }, // شماره موتور
    licensePlate: { type: String, unique: true, sparse: true }, // پلاک خودرو

    // مشخصات فنی
    color: { type: String },
    fuelType: {
      type: String,
      enum: ["gasoline", "diesel", "electric", "hybrid", "cng", "other"],
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic", "semi-automatic"],
    },
    engineCapacity: { type: Number }, // حجم موتور (cc)
    horsepower: { type: Number }, // قدرت موتور
    seats: { type: Number }, // تعداد صندلی‌ها
    doors: { type: Number }, // تعداد درها
    mileage: { type: Number, default: 0 }, // کارکرد (کیلومتر)
    wheelman: { type: String, ref: "Employee" }, // راننده
    operatorType: {
      type: String,
      enum: ["special", "general"], // اختصاصی عمومی
    }, // بهره بردار
    operatorSpecial: { type: String, ref: "Employee" }, // بهره بردار اختصاصی
    operatorGeneral: { type: String, ref: "Division" }, // بهره بردار عمومی
    status: {
      type: String,
      enum: ["active", "inactive", "sold", "rented"],
      default: "active",
    },

    // اطلاعات اضافی
    price: { type: Number }, // قیمت (در صورت فروش/اجاره)
    image: { type: String }, // تصویر
    gallery: { type: [String], default: [] }, // گالری

    description: { type: String }, // توضیحات

    // مدیریت زمان
  },
  { _id: false, timestamps: true }
);

const Vehicle = model("Vehicle", vehicleSchema);

module.exports = Vehicle;
