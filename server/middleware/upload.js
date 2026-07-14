const multer = require("multer");
const path = require("path");
const fs = require("fs");

// تابع ساخت پوشه برای هر مدل بر اساس سال و ماه به‌صورت ایمن
const getStoragePath = (modelName) => {
  return (req, file, cb) => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");

      // مسیر کامل برای آپلود: uploads/modelName/year/month
      const folderPath = path.join(__dirname, "..", "uploads", modelName, year.toString(), month);

      // اگر مسیر وجود نداشت، بسازش
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      cb(null, folderPath);
    } catch (err) {
      console.error("خطا در ساخت پوشه آپلود:", err);
      cb(new Error("خطا در ساخت پوشه آپلود"));
    }
  };
};

// تنظیمات Multer
const storage = (modelName) =>
  multer.diskStorage({
    destination: getStoragePath(modelName),
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });

// فیلتر نوع فایل‌ها (فقط تصاویر)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|webp|svg/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("فقط فایل‌های تصویری (jpg, jpeg, png, webp, svg) مجاز است."));
  }
};

// اکسپورت آپلود کننده برای مدل‌های مختلف
const uploadForModel = (modelName) =>
  multer({
    storage: storage(modelName),
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    fileFilter: fileFilter,
  });

module.exports = { uploadForModel };
