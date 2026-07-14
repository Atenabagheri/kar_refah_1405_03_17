const XLSX = require("xlsx");
const fs = require("fs");
const VehicleBrand = require("../models/vehicleBrandModel");

exports.addVehicleBrand = async (req, res) => {
  const {
    creator,
    name,
    faName,
    country,
    foundedYear,
    logo,
    description,
    isActive,
  } = req.body;

  if (!creator || !name || !faName) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    const existingBrandName = await VehicleBrand.findOne({
      name,
    });

    if (existingBrandName) {
      return res.status(400).json({
        message: "برند وسیله نقلیه با این نام انگلیسی قبلا ثبت شده است.",
      });
    }

    const newVehicleBrand = new VehicleBrand({
      _id: name,
      creator,
      name,
      faName,
      country,
      foundedYear,
      logo,
      description,
      isActive,
    });

    await newVehicleBrand.save();
    res.status(201).json({
      message: "برند وسیله نقلیه جدید اضافه شد.",
      VehicleBrand: newVehicleBrand,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد برند وسیله نقلیه", error: error.message });
  }
};

exports.getVehicleBrands = async (req, res) => {
  try {
    const vehicleBrands = await VehicleBrand.find().sort({
      createdAt: -1,
    });

    res.status(200).json(vehicleBrands);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست برند وسایل نقلیه",
      error: error.message,
    });
  }
};

exports.getVehicleBrandWithBrandName = async (req, res) => {
  const { brandName } = req.params;
  try {
    const existingVehicleBrand = await VehicleBrand.findOne({
      name: brandName,
    }).sort({
      createdAt: -1,
    });

    if (!existingVehicleBrand) {
      return res
        .status(400)
        .json({ message: "برند وسیله نقلیه انتخاب شده وجود ندارد." });
    }

    res.status(200).json(existingVehicleBrand);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست برند وسایل نقلیه",
      error: error.message,
    });
  }
};

exports.updateVehicleBrandWithBrandName = async (req, res) => {
  const { brandName } = req.params;

  try {
    const newData = req.body;
    const existingVehicleBrand = await VehicleBrand.findOne({
      name: brandName,
    });

    if (!existingVehicleBrand) {
      return res
        .status(400)
        .json({ message: "برند وسیله نقلیه انتخاب شده وجود ندارد." });
    }

    const updatedVehicleBrand = await VehicleBrand.findOneAndUpdate(
      { name: brandName },
      newData,
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ message: "اطلاعات ویرایش شد.", updatedVehicleBrand });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteVehicleBrand = async (req, res) => {
  const { brandName } = req.params;

  try {
    const existingVehicleBrand = await VehicleBrand.findOne({
      name: brandName,
    });

    if (!existingVehicleBrand) {
      return res
        .status(400)
        .json({ message: "برند وسیله نقلیه انتخاب شده وجود ندارد." });
    }

    const vehicleBrand = await VehicleBrand.findOneAndDelete({
      name: brandName,
    });

    res
      .status(200)
      .json({ message: "اطلاعات برند وسیله نقلیه حذف شد.", vehicleBrand });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف برند وسیله نقلیه", error: error.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "vehicleBrand";
    if (
      req.file.filename !== fileName + ".xlsx" &&
      req.file.filename !== fileName + ".xls" &&
      req.file.filename !== fileName + ".numbers"
    ) {
      fs.unlinkSync(filePath);

      return res.status(400).json({
        message: `لطفا فایل با نام ${fileName}.xlsx یا ${fileName}.xls یا ${fileName}.numbers انتخاب کنید.`,
      });
    }
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: null });

    for (const row of jsonData) {
      const {
        creator,
        name,
        faName,
        country,
        foundedYear,
        logo,
        description,
        isActive,
      } = row;
      await VehicleBrand.findOneAndUpdate(
        { _id: name },
        {
          creator,
          name,
          faName,
          country,
          foundedYear,
          logo,
          description,
          isActive,
        },
        { upsert: true, new: true }
      );
    }

    fs.unlinkSync(filePath);
    res.json({ message: "اطلاعات بارگذاری و بروزرسانی شد.", jsonData });
  } catch (error) {
    res.status(500).json({ message: "در پردازش اطلاعات خطا رخ داد.", error });
  }
};
