const XLSX = require("xlsx");
const fs = require("fs");
const convertJalaliToDate = require("../../utils/convertJalaliToDate");
const Vehicle = require("../models/vehicleModel");
const Maintenance = require("../models/maintenanceModel");

exports.addMaintenance = async (req, res) => {
  const {
    financialDocumentNumber,
    repairDate,
    repairType,
    repairShop,
    partsPayment,
    laborPayment,
    creator,
    vehicle,
    description
  } = req.body;

  // بررسی الزامی بودن فیلدها
  if (
    !financialDocumentNumber ||
    !repairDate ||
    !repairType ||
    !repairShop ||
    !partsPayment ||
    !laborPayment ||
    !vehicle
  ) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    // بررسی عدم تکرار شماره سند مالی
    const existingRecord = await Maintenance.findOne({
      financialDocumentNumber,
    });
    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "این شماره سند مالی قبلاً ثبت شده است." });
    }

    // بررسی وجود خودرو
    const existingVehicle = await Vehicle.findOne({ vin: vehicle });
    if (!existingVehicle) {
      return res.status(400).json({ message: "خودروی انتخاب‌شده وجود ندارد." });
    }

    // ایجاد رکورد جدید
    const newMaintenance = new Maintenance({
      _id: financialDocumentNumber,
      financialDocumentNumber,
      repairDate,
      repairType,
      repairShop,
      partsPayment,
      laborPayment,
      creator,
      vehicle,
      description
    });

    await newMaintenance.save();

    res.status(201).json({
      message: "سند مالی جدید نگهداری و تعمیرات با موفقیت ثبت شد.",
      maintenance: newMaintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در ایجاد سند مالی نگهداری و تعمیرات",
      error: error.message,
    });
  }
};

exports.getMaintenances = async (req, res) => {
  try {
    const vehicle = req.query.vehicle;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let searchConditions = {};
    if (vehicle) searchConditions.vehicle = vehicle;

    const maintenances = await Maintenance.find(searchConditions)
      .populate("creator", "firstName lastName")
      .populate("vehicle", "licensePlate model vin")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalMaintenances = await Maintenance.countDocuments(
      searchConditions
    );

    res.status(200).json({
      data: maintenances,
      total: totalMaintenances,
      totalPages: Math.ceil(totalMaintenances / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست نگهداری و تعمیرات",
      error: error.message,
    });
  }
};

exports.getMaintenanceByDocumentNumber = async (req, res) => {
  const { financialDocumentNumber } = req.params;

  try {
    const maintenance = await Maintenance.findOne({ financialDocumentNumber })
      .populate("creator", "firstName lastName")
      .populate("vehicle", "licensePlate model vin");

    if (!maintenance) {
      return res.status(404).json({ message: "سند مالی مورد نظر یافت نشد." });
    }

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات تعمیر",
      error: error.message,
    });
  }
};

exports.updateMaintenance = async (req, res) => {
  const { financialDocumentNumber } = req.params;
  const updateData = req.body;

  try {
    const existingMaintenance = await Maintenance.findOne({
      financialDocumentNumber,
    });
    if (!existingMaintenance) {
      return res.status(404).json({ message: "اطلاعات مورد نظر یافت نشد." });
    }

    const updatedMaintenance = await Maintenance.findOneAndUpdate(
      { financialDocumentNumber },
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "اطلاعات با موفقیت ویرایش شد.",
      updatedMaintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در ویرایش اطلاعات نگهداری و تعمیرات",
      error: error.message,
    });
  }
};

exports.deleteMaintenance = async (req, res) => {
  const { financialDocumentNumber } = req.params;

  try {
    const existingMaintenance = await Maintenance.findOne({
      financialDocumentNumber,
    });
    if (!existingMaintenance) {
      return res.status(404).json({ message: "سند مالی مورد نظر یافت نشد." });
    }

    const maintenance = await Maintenance.findOneAndDelete({
      financialDocumentNumber,
    });

    res.status(200).json({
      message: "سند مالی نگهداری و تعمیرات با موفقیت حذف شد.",
      maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در حذف رکورد نگهداری و تعمیرات",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "maintenance";

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
        financialDocumentNumber,
        repairDate,
        repairType,
        repairShop,
        partsPayment,
        laborPayment,
        creator,
        vehicle,
        description
      } = row;

      const dateJalali = convertJalaliToDate(repairDate);

      await Maintenance.findOneAndUpdate(
        { _id: financialDocumentNumber },
        {
          financialDocumentNumber,
          repairDate: dateJalali,
          repairType,
          repairShop,
          partsPayment,
          laborPayment,
          creator,
          vehicle,
          description
        },
        { upsert: true, new: true }
      );
    }

    fs.unlinkSync(filePath);
    res.json({
      message: "اطلاعات نگهداری و تعمیرات با موفقیت بارگذاری و بروزرسانی شد.",
      jsonData,
    });
  } catch (error) {
    res.status(500).json({
      message: "در پردازش فایل اکسل خطایی رخ داد.",
      error,
    });
  }
};
