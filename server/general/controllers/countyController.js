const County = require("../models/countyModel");
const XLSX = require("xlsx");
const fs = require("fs");
const Province = require("../models/provinceModel");
const City = require("../models/cityModel");

exports.addCounty = async (req, res) => {
  const {
    name,
    faName,
    provinceName,
    city,
    isNewCounty,
    population,
    description,
  } = req.body;

  if (!name || !faName || !provinceName) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    const existingProvinceName = await Province.findOne({
      name: provinceName,
    });
    if (!existingProvinceName) {
      return res.status(400).json({ message: "استان انتخاب شده وجود ندارد." });
    }

    const existingCountyName = await County.findOne({
      name,
    });
    if (existingCountyName) {
      return res
        .status(400)
        .json({ message: "این نام انگلیسی را قبلاً ثبت کرده اید." });
    }

    const existingCountyFaName = await County.findOne({
      faName,
    });
    if (existingCountyFaName) {
      return res
        .status(400)
        .json({ message: "این نام فارسی را قبلاً ثبت کرده اید." });
    }

    if (city && isNewCounty) {
      return res
        .status(400)
        .json({ message: "شهرستان جدید نمی تواند شهر داشته باشد." });
    }

    const newCounty = new County({
      _id: name,
      name,
      faName,
      provinceName,
      city,
      isNewCounty,
      population,
      description,
    });

    await newCounty.save();
    res.status(201).json({
      message: "شهرستان جدید اضافه شد.",
      County: newCounty,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد شهرستان", error: error.message });
  }
};

exports.getCounties = async (req, res) => {
  try {
    const counties = await County.find()
      .sort({
        createdAt: -1,
      })
      .sort({ provinceName: 1 });

    res.status(200).json(counties);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شهرستان ها",
      error: error.message,
    });
  }
};

exports.getCountyWithName = async (req, res) => {
  const { name } = req.params;
  try {
    const county = await County.findOne({ name: name }).populate(
      "provinceName"
    );

    if (!county)
      return res.status(404).json({ message: "شهرستان مورد نظر یافت نشد" });

    res.status(200).json(county);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شهرستان ها",
      error: error.message,
    });
  }
};

exports.getCountiesWithProvince = async (req, res) => {
  const { provinceName } = req.params;
  try {
    const province = await Province.findOne({ name: provinceName });
    if (!province)
      return res.status(404).json({ message: "استان مورد نظر یافت نشد" });

    const counties = await County.find({ provinceName });

    res.status(200).json(counties);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شهرستان ها",
      error: error.message,
    });
  }
};

exports.getCountiesWithProvinceAndCity = async (req, res) => {
  const { provinceName } = req.params;
  try {
    const province = await Province.findOne({ name: provinceName });
    if (!province)
      return res.status(404).json({ message: "استان مورد نظر یافت نشد" });

    const counties = await County.find({ provinceName, city: true });

    res.status(200).json(counties);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شهرستان ها",
      error: error.message,
    });
  }
};

// get all cities and all counties without counties city field true
exports.getCountiesAndCitiesWithProvince = async (req, res) => {
  const { provinceName } = req.params;
  try {
    const province = await Province.findOne({ name: provinceName });
    if (!province)
      return res.status(404).json({ message: "استان مورد نظر یافت نشد" });

    const counties = await County.find({ provinceName, city: false });
    const cities = await City.find({ provinceName });

    const countiesAndCities = [...counties, ...cities];

    res.status(200).json(countiesAndCities);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شهرستان ها",
      error: error.message,
    });
  }
};

// get all counties for all cities
exports.getCountiesForCities = async (req, res) => {
  try {
    const counties = await County.find({ city: true }).select({
      name: 1,
      faName: 1,
    });

    res.status(200).json(counties);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شهرستان ها",
      error: error.message,
    });
  }
};

exports.updateCounty = async (req, res) => {
  const { countyName } = req.params;
  // const { name, faName, provinceName } = req.body;
  const newData = req.body;
  try {
    const county = await County.findOne({
      name: countyName,
    });

    if (!county) {
      return res.status(404).json({ message: "شهرستان یافت نشد." });
    }

    if (newData.name && newData.name !== county.name) {
      const existingCountyName = await County.findOne({
        name: newData.name,
      });
      if (existingCountyName) {
        return res
          .status(400)
          .json({ message: "این نام انگلیسی قبلاً ثبت شده است." });
      }
    }

    if (newData.faName && newData.faName !== county.faName) {
      const existingCountyFaName = await County.findOne({
        faName: newData.faName,
      });
      if (existingCountyFaName) {
        return res
          .status(400)
          .json({ message: "این نام فارسی قبلاً ثبت شده است." });
      }
    }

    if (newData.provinceName && newData.provinceName !== county.provinceName) {
      const existingProvinceName = await Province.findOne({
        name: newData.provinceName,
      });
      if (!existingProvinceName) {
        return res
          .status(400)
          .json({ message: "استان انتخاب شده وجود ندارد." });
      }
    }
    const updatedCounty = await County.findOneAndUpdate(
      {
        name: countyName,
      },
      newData,
      { new: true }
    );

    await county.save();
    res.status(200).json({ message: "شهرستان ویرایش شد.", updatedCounty });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش شهرستان", error: error.message });
  }
};

exports.deleteCounty = async (req, res) => {
  const { countyName } = req.params;

  try {
    const county = await County.findOneAndDelete({
      name: countyName,
    });

    if (!county) {
      return res.status(404).json({ message: "شهرستان یافت نشد." });
    }

    const name = county.name;
    const faName = county.faName;
    res.status(200).json({ message: "شهرستان حذف شد.", name, faName });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف شهرستان", error: error.message });
  }
};

exports.searchCounty = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const counties = await County.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { faName: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(counties);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی شهرستان ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "county";
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
        name,
        faName,
        provinceName,
        city,
        isNewCounty,
        population,
        description,
      } = row;
      await County.findOneAndUpdate(
        { _id: name },
        {
          name,
          faName,
          provinceName,
          city,
          isNewCounty,
          population,
          description,
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
