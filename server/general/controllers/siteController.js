const Site = require("../models/siteModel");
const XLSX = require("xlsx");
const fs = require("fs");

exports.addSite = async (req, res) => {
  const { postalCode, name, province, county, city } = req.body;

  if (!postalCode || !name || !province || !county) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    const existingSiteName = await Site.findOne({
      postalCode,
    });
    if (existingSiteName) {
      return res
        .status(400)
        .json({ message: "این کد پستی را قبلاً ثبت کرده اید." });
    }

    const existingSiteFaName = await Site.findOne({
      name,
    });
    if (existingSiteFaName) {
      return res
        .status(400)
        .json({ message: "این نام فارسی را قبلاً ثبت کرده اید." });
    }

    const newSite = new Site({
      _id: postalCode,
      postalCode,
      name,
      province,
      county,
      city,
    });

    await newSite.save();
    res.status(201).json({
      message: "سایت جدید اضافه شد.",
      Site: newSite,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد سایت", error: error.message });
  }
};

exports.getSites = async (req, res) => {
  try {
    const sites = await Site.find()
      .sort({
        createdAt: 1,
      })
      .sort({ provinceName: 1 });

    res.status(200).json(sites);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست سایت ها",
      error: error.message,
    });
  }
};

exports.getSiteWithPostalCode = async (req, res) => {
  const { postalCode } = req.params;
  try {
    const site = await Site.findOne({ postalCode: postalCode });

    if (!site)
      return res.status(404).json({ message: "سایت مورد نظر یافت نشد" });

    res.status(200).json(site);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست سایت ها",
      error: error.message,
    });
  }
};

exports.updateSite = async (req, res) => {
  const { postalCode } = req.params;
  const newData = req.body;
  try {
    const site = await Site.findOne({
      postalCode: postalCode,
    });

    if (!site) {
      return res.status(404).json({ message: "سایت یافت نشد." });
    }

    if (newData.postalCode && newData.postalCode !== site.postalCode) {
      const existingPostalCode = await Site.findOne({
        postalCode: newData.copostalCodede,
      });
      if (existingPostalCode) {
        return res.status(400).json({ message: "این کد قبلاً ثبت شده است." });
      }
    }

    if (newData.name && newData.name !== site.name) {
      const existingSiteFaName = await Site.findOne({
        name: newData.name,
      });
      if (existingSiteFaName) {
        return res
          .status(400)
          .json({ message: "این نام فارسی قبلاً ثبت شده است." });
      }
    }

    const updatedSite = await Site.findOneAndUpdate(
      {
        postalCode: postalCode,
      },
      newData,
      { new: true }
    );

    await site.save();
    res.status(200).json({ message: "سایت ویرایش شد.", updatedSite });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش سایت", error: error.message });
  }
};

exports.deleteSite = async (req, res) => {
  const { postalCode } = req.params;

  try {
    const site = await Site.findOneAndDelete({
      postalCode: postalCode,
    });

    if (!site) {
      return res.status(404).json({ message: "سایت یافت نشد." });
    }

    const name = site.name;
    res.status(200).json({ message: "سایت حذف شد.", postalCode, name });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف سایت", error: error.message });
  }
};

exports.searchSite = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const sites = await Site.find({
      $or: [
        { postalCode: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(sites);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی سایت ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "site";
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
      const { postalCode, name, province, county, city } = row;
      await Site.findOneAndUpdate(
        { _id: postalCode },
        {
          postalCode,
          name,
          province,
          county,
          city,
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
