const Province = require("../models/provinceModel");
const XLSX = require("xlsx");
const fs = require("fs");
const County = require("../models/countyModel");

exports.addProvince = async (req, res) => {
  const { name, faName, population, description } = req.body;

  if (!name || !faName) {
    return res
      .status(400)
      .json({ message: "نام فارسی و نام انگلیسی الزامی هستند." });
  }

  try {
    const existingProvinceName = await Province.findOne({
      name,
    });
    if (existingProvinceName) {
      return res
        .status(400)
        .json({ message: "این نام انگلیسی را قبلاً ثبت کرده اید." });
    }

    const existingProvinceFaName = await Province.findOne({
      faName,
    });
    if (existingProvinceFaName) {
      return res
        .status(400)
        .json({ message: "این نام فارسی را قبلاً ثبت کرده اید." });
    }

    const newProvince = new Province({
      _id: name,
      name,
      faName,
      population,
      description,
    });

    await newProvince.save();
    res.status(201).json({
      message: "استان جدید اضافه شد.",
      Province: newProvince,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد استان", error: error.message });
  }
};

exports.getProvinces = async (req, res) => {
  try {
    const provinces = await Province.find().sort({
      createdAt: -1,
    });

    res.status(200).json(provinces);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست استان ها",
      error: error.message,
    });
  }
};

exports.getProvinceWithName = async (req, res) => {
  const { name } = req.params;
  try {
    const province = await Province.findOne({ name: name });

    if (!province)
      return res.status(404).json({ message: "استان مورد نظر یافت نشد" });

    res.status(200).json(province);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاع استان",
      error: error.message,
    });
  }
};

exports.updateProvince = async (req, res) => {
  const { provinceName } = req.params;
  const { name, faName } = req.body;

  try {
    const province = await Province.findOne({
      name: provinceName,
    });

    if (!province) {
      return res.status(404).json({ message: "استان یافت نشد." });
    }

    if (name && name !== province.name) {
      const Name = await Province.findOne({
        name,
      });
      if (Name) {
        return res
          .status(400)
          .json({ message: "این نام انگلیسی قبلاً ثبت شده است." });
      }
    }

    if (faName && faName !== province.faName) {
      const existingProvinceFaName = await Province.findOne({
        faName,
      });
      if (existingProvinceFaName) {
        return res
          .status(400)
          .json({ message: "این نام فارسی قبلاً ثبت شده است." });
      }
    }

    const oldName = province.name;

    province.name = name || province.name;
    province.faName = faName || province.faName;

    await province.save();

    if (name && name !== oldName) {
      await County.updateMany(
        { provinceName: oldName },
        { $set: { provinceName: name } }
      );
    }

    res.status(200).json({ message: "استان ویرایش شد.", province });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش استان", error: error.message });
  }
};

exports.deleteProvince = async (req, res) => {
  const { provinceName } = req.params;

  try {
    const province = await Province.findOneAndDelete({
      name: provinceName,
    });

    if (!province) {
      return res.status(404).json({ message: "استان یافت نشد." });
    }

    const name = province.name;
    const faName = province.faName;
    res.status(200).json({ message: "استان حذف شد.", name, faName });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف استان", error: error.message });
  }
};

exports.searchProvince = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const provinces = await Province.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { faName: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(provinces);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی استان ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "province";
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
      const { name, faName, population, description } = row;
      await Province.findOneAndUpdate(
        { _id: name },
        { name, faName, population, description },
        { upsert: true, new: true }
      );
    }

    fs.unlinkSync(filePath);
    res.json({ message: "اطلاعات بارگذاری و بروزرسانی شد.", jsonData });
  } catch (error) {
    res.status(500).json({ message: "در پردازش اطلاعات خطا رخ داد.", error });
  }
};
