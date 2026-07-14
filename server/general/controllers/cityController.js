const City = require("../models/cityModel");
const County = require("../models/countyModel");
const XLSX = require("xlsx");
const fs = require("fs");
const Province = require("../models/provinceModel");

exports.addCity = async (req, res) => {
  const { name, faName, provinceName, countyName } = req.body;

  if (!name || !faName || !provinceName || !countyName) {
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
      name: countyName,
      city: true,
    });
    if (!existingCountyName) {
      return res
        .status(400)
        .json({ message: "شهرستان انتخاب شده وجود/قابلیت شهر را ندارد." });
    }

    const existingCityName = await City.findOne({
      name,
    });
    if (existingCityName) {
      return res
        .status(400)
        .json({ message: "این نام انگلیسی را قبلاً ثبت کرده اید." });
    }

    const existingCityFaName = await City.findOne({
      faName,
    });
    if (existingCityFaName) {
      return res
        .status(400)
        .json({ message: "این نام فارسی را قبلاً ثبت کرده اید." });
    }

    const newCity = new City({
      _id: name,
      name,
      faName,
      countyName,
      provinceName,
    });

    await newCity.save();
    res.status(201).json({
      message: "شهر جدید اضافه شد.",
      City: newCity,
    });
  } catch (error) {
    res.status(500).json({ message: "خطا در ایجاد شهر", error: error.message });
  }
};

exports.getCities = async (req, res) => {
  try {
    const cities = await City.find()
      .sort({
        createdAt: -1,
      })
      .sort({ provinceName: 1 });

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شهر ها",
      error: error.message,
    });
  }
};

exports.getCityWithName = async (req, res) => {
  const { name } = req.params;
  try {
    const city = await City.findOne({ name: name })
      .populate("provinceName", "name faName")
      .populate("countyName", "name faName");

    if (!city)
      return res.status(404).json({ message: "شهر مورد نظر یافت نشد" });

    res.status(200).json(city);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شهر ها",
      error: error.message,
    });
  }
};

exports.getCitiesWithProvince = async (req, res) => {
  const { provinceName } = req.params;
  try {
    const province = await Province.findOne({ name: provinceName });
    if (!province)
      return res.status(404).json({ message: "استان مورد نظر یافت نشد" });

    const cities = await City.find({ provinceName });

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شهر ها",
      error: error.message,
    });
  }
};

exports.getCitiesWithCounty = async (req, res) => {
  const { countyName } = req.params;
  try {
    const county = await County.findOne({ name: countyName });
    if (!county)
      return res.status(404).json({ message: "شهرستان مورد نظر یافت نشد" });

    const cities = await City.find({ countyName });

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شهر ها",
      error: error.message,
    });
  }
};

exports.updateCity = async (req, res) => {
  const { cityName } = req.params;
  const { name, faName, provinceName, countyName } = req.body;

  try {
    const city = await City.findOne({
      name: cityName,
    });

    if (!city) {
      return res.status(404).json({ message: "شهر یافت نشد." });
    }

    if (name && name !== city.name) {
      const Name = await City.findOne({
        name,
      });
      if (Name) {
        return res
          .status(400)
          .json({ message: "این نام انگلیسی قبلاً ثبت شده است." });
      }
    }

    if (faName && faName !== city.faName) {
      const existingCityFaName = await City.findOne({
        faName,
      });
      if (existingCityFaName) {
        return res
          .status(400)
          .json({ message: "این نام فارسی قبلاً ثبت شده است." });
      }
    }

    const existingProvinceName = await Province.findOne({
      name: provinceName,
    });
    if (!existingProvinceName) {
      return res.status(400).json({ message: "استان انتخاب شده وجود ندارد." });
    }

    city.name = name || city.name;
    city.faName = faName || city.faName;
    city.provinceName = provinceName || city.provinceName;
    city.countyName = countyName || city.countyName;

    await city.save();
    res.status(200).json({ message: "شهر ویرایش شد.", city });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش شهر", error: error.message });
  }
};

exports.deleteCity = async (req, res) => {
  const { cityName } = req.params;

  try {
    const city = await City.findOneAndDelete({
      name: cityName,
    });

    if (!city) {
      return res.status(404).json({ message: "شهر یافت نشد." });
    }

    const name = city.name;
    const faName = city.faName;
    res.status(200).json({ message: "شهر حذف شد.", name, faName });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف شهر", error: error.message });
  }
};

exports.searchCity = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const cities = await City.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { faName: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی شهر ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "city";
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
      const { name, faName, provinceName, countyName } = row;
      await City.findOneAndUpdate(
        { _id: name },
        {
          name,
          faName,
          provinceName,
          countyName,
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
