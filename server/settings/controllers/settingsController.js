// controllers/settingsController.js
const Setting = require("../models/settingsModel");

// دریافت همه تنظیمات (برای پنل ادمین)
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find().lean();
    // تبدیل به یک آبجکت key-value برای استفاده راحت‌تر در کلاینت
    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    res.json({ success: true, data: settingsMap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// دریافت یک تنظیم با کلید مشخص
exports.getSettingByKey = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return res
        .status(404)
        .json({ success: false, message: "تنظیم یافت نشد" });
    }
    res.json({
      success: true,
      data: setting.value,
      description: setting.description,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ایجاد یا بروزرسانی یک تنظیم (Upsert)
exports.updateSetting = async (req, res) => {
  try {
    const { key, value, description } = req.body;
    const user = req.employee;
    if (!key || value === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "key و value الزامی هستند" });
    }

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value, description: description || "", creator: user.nationalId },
      { new: true, upsert: true, runValidators: true },
    );

    req.app.locals.settingsCache = null;

    res.json({
      message: "تنظیمات با موفقیت انجام شد.",
      success: true,
      data: setting,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// حذف یک تنظیم (اختیاری)
exports.deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findOneAndDelete({ key: req.params.key });
    if (!setting) {
      return res
        .status(404)
        .json({ success: false, message: "تنظیم یافت نشد" });
    }
    req.app.locals.settingsCache = null;
    res.json({ success: true, message: "تنظیم حذف شد" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
