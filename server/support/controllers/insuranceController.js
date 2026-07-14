const XLSX = require("xlsx");
const fs = require("fs");
const convertJalaliToDate = require("../../utils/convertJalaliToDate");
const Vehicle = require("../models/vehicleModel");
const Insurance = require("../models/insuranceModel");
const removeUploaded = require("../../middleware/removeUploaded");
const removeAnyUploaded = require("../../middleware/removeAnyUploaded");

exports.addInsurance = async (req, res) => {
  const {
    insuranceCode,
    insuranceCompany,
    thirdPartyNumber,
    thirdPartyExpire,
    bodyNumber,
    bodyExpire,
    inspectionSerial,
    inspectionExpire,
    creator,
    vehicle,
    description,
  } = req.body;

  console.log(req.body);
  if (
    !insuranceCode ||
    !thirdPartyNumber ||
    !thirdPartyExpire ||
    !bodyNumber ||
    !bodyExpire ||
    !inspectionSerial ||
    !inspectionExpire ||
    // !creator ||
    !vehicle
  ) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear(); // سال فعلی
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // ماه فعلی (01 تا 12)
  const gallery = [];
  let image = null;

  if (req.files["image"]) {
    image = `/uploads/insurance/${year}/${month}/${req.files["image"][0].filename}`;
  }

  // تنظیم مسیر فایل‌های گالری
  if (req.files["gallery"]) {
    req.files["gallery"].forEach((file) => {
      gallery.push(`/uploads/insurance/${year}/${month}/${file.filename}`);
    });
  }

  try {
    const existingInsuranceCode = await Insurance.findOne({
      insuranceCode,
    });
    if (existingInsuranceCode) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res
        .status(400)
        .json({ message: "این شماره فاکتور قبلا ثبت شده است." });
    }

    const existingVehicle = await Vehicle.findOne({ vin: vehicle });
    if (!existingVehicle) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res.status(400).json({ message: "خودروی انتخاب‌شده وجود ندارد." });
    }

    const newInsurance = new Insurance({
      _id: insuranceCode,
      insuranceCode,
      insuranceCompany,
      thirdPartyNumber,
      thirdPartyExpire,
      bodyNumber,
      bodyExpire,
      inspectionSerial,
      inspectionExpire,
      creator,
      vehicle,
      description,
      image,
      gallery,
    });

    await newInsurance.save();

    res.status(201).json({
      message: "بیمه جدید با موفقیت ثبت شد.",
      insurance: newInsurance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد بیمه جدید", error: error.message });
  }
};

exports.getInsurances = async (req, res) => {
  try {
    const vehicle = req.query.vehicle;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let searchConditions = {};
    if (vehicle) searchConditions.vehicle = vehicle;

    const insurances = await Insurance.find(searchConditions)
      .populate("creator", "firstName lastName")
      .populate("vehicle", "licensePlate model vin")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalInsurances = await Insurance.countDocuments(searchConditions);

    res.status(200).json({
      data: insurances,
      total: totalInsurances,
      totalPages: Math.ceil(totalInsurances / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست بیمه‌ها",
      error: error.message,
    });
  }
};

exports.getInsuranceByInsuranceCode = async (req, res) => {
  const { insuranceCode } = req.params;

  try {
    const insurance = await Insurance.findOne({ insuranceCode })
      .populate("creator", "firstName lastName")
      .populate("vehicle", "licensePlate model vin");

    if (!insurance) {
      return res.status(404).json({ message: "بیمه مورد نظر یافت نشد." });
    }

    res.status(200).json(insurance);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در دریافت اطلاعات بیمه", error: error.message });
  }
};

exports.updateInsurance = async (req, res) => {
  const { insuranceCode } = req.params;
  const updateData = req.body;

  try {
    const existingInsurance = await Insurance.findOne({ insuranceCode });
    if (!existingInsurance) {
      return res.status(404).json({ message: "اطلاعات بیمه یافت نشد." });
    }

    const updatedInsurance = await Insurance.findOneAndUpdate(
      { insuranceCode: insuranceCode },
      updateData,
      {
        new: true,
      },
    );

    res.status(200).json({
      message: "اطلاعات بیمه با موفقیت ویرایش شد.",
      updatedInsurance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش بیمه", error: error.message });
  }
};

exports.deleteInsurance = async (req, res) => {
  const { insuranceCode } = req.params;

  try {
    const existingInsurance = await Insurance.findOne({ insuranceCode });
    if (!existingInsurance) {
      return res.status(404).json({ message: "بیمه مورد نظر یافت نشد." });
    }

    const insurance = await Insurance.findOneAndDelete({
      insuranceCode,
    });

    res.status(200).json({ message: "بیمه با موفقیت حذف شد.", insurance });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف بیمه", error: error.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "insurance";

    if (
      req.file.filename !== fileName + ".xlsx" &&
      req.file.filename !== fileName + ".xls" &&
      req.file.filename !== fileName + ".numbers"
    ) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: `لطفاً فایل با نام ${fileName}.xlsx یا ${fileName}.xls یا ${fileName}.numbers انتخاب کنید.`,
      });
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

    for (const row of jsonData) {
      const {
        insuranceCode,
        insuranceCompany,
        thirdPartyNumber,
        thirdPartyExpire,
        bodyNumber,
        bodyExpire,
        inspectionSerial,
        inspectionExpire,
        creator,
        vehicle,
        description,
      } = row;
      const thirdPartyExpireJalali = thirdPartyExpire
        ? convertJalaliToDate(thirdPartyExpire)
        : null;
      const bodyExpireJalali = bodyExpire
        ? convertJalaliToDate(bodyExpire)
        : null;
      const inspectionExpireJalali = inspectionExpire
        ? convertJalaliToDate(inspectionExpire)
        : null;

      await Insurance.findOneAndUpdate(
        { _id: insuranceCode },
        {
          insuranceCode,
          insuranceCompany,
          thirdPartyNumber,
          thirdPartyExpire: thirdPartyExpireJalali,
          bodyNumber,
          bodyExpire: bodyExpireJalali,
          inspectionSerial,
          inspectionExpire: inspectionExpireJalali,
          creator,
          vehicle,
          description,
        },
        { upsert: true, new: true },
      );
    }

    fs.unlinkSync(filePath);
    res.json({
      message: "اطلاعات بیمه‌ها با موفقیت بارگذاری و بروزرسانی شد.",
      jsonData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "در پردازش فایل اکسل خطایی رخ داد.", error });
  }
};
