const DateCategory = require("../models/dateCategoryModel");
const XLSX = require("xlsx");
const fs = require("fs");

exports.addDateCategory = async (req, res) => {
  const { title, description, code } = req.body;

  if (!code || !title) {
    return res.status(400).json({ message: "کد الزامی می باشد." });
  }

  try {
    const existingDateCategory = await DateCategory.findOne({
      code,
    });
    if (existingDateCategory) {
      return res.status(400).json({ message: "این کد را قبلاً ثبت کرده اید." });
    }

    const newDateCategory = new DateCategory({
      _id: code,
      title,
      description,
      code,
    });

    await newDateCategory.save();
    res.status(201).json({
      message: "دسته بندی تاریخ/زمان جدید اضافه شد.",
      dateCategory: newDateCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در ایجاد دسته بندی تاریخ/زمان",
      error: error.message,
    });
  }
};

exports.getDateCategories = async (req, res) => {
  try {
    const dateCategories = await DateCategory.find().sort({
      createdAt: -1,
    });

    res.status(200).json(dateCategories);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست دسته بندی تاریخ/زمان ها",
      error: error.message,
    });
  }
};

exports.getDateCategoryWithCode = async (req, res) => {
  const { dateCategoryCode } = req.params;
  try {
    const dateCategory = await DateCategory.findOne({
      code: dateCategoryCode,
    });

    if (!dateCategory)
      return res
        .status(404)
        .json({ message: "دسته بندی تاریخ/زمان مورد نظر یافت نشد" });

    res.status(200).json(dateCategory);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات دسته بندی تاریخ/زمان",
      error: error.message,
    });
  }
};

exports.updateDateCategory = async (req, res) => {
  const { dateCategoryCode } = req.params;
  const newData = req.body;

  try {
    const dateCategory = await DateCategory.findOne({
      code: dateCategoryCode,
    });

    if (!dateCategory) {
      return res
        .status(404)
        .json({ message: "دسته بندی تاریخ/زمان یافت نشد." });
    }

    if (dateCategoryCode && dateCategoryCode !== dateCategory.code) {
      const existingDateCategoryCode = await DateCategory.findOne({
        code: dateCategoryCode,
      });
      if (existingDateCategoryCode) {
        return res.status(400).json({
          message: "یک دسته بندی تاریخ/زمان با این کد قبلاً ثبت شده است.",
        });
      }
    }

    const updatedDateCategory = await DateCategory.findOneAndUpdate(
      { code: dateCategoryCode },
      newData,
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "دسته بندی تاریخ/زمان ویرایش شد.",
      updatedDateCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در ویرایش دسته بندی تاریخ/زمان",
      error: error.message,
    });
  }
};

exports.deleteDateCategory = async (req, res) => {
  const { dateCategoryCode } = req.params;

  try {
    const dateCategory = await DateCategory.findOneAndDelete({
      code: dateCategoryCode,
    });

    if (!dateCategory) {
      return res
        .status(404)
        .json({ message: "دسته بندی تاریخ/زمان یافت نشد." });
    }

    res.status(200).json({
      message: "دسته بندی تاریخ/زمان حذف شد.",
      dateCategoryCode,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در حذف دسته بندی تاریخ/زمان",
      error: error.message,
    });
  }
};

exports.searchDateCategory = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const dateCategorys = await DateCategory.find({
      $or: [
        { code: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(dateCategorys);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی دسته بندی تاریخ/زمان ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "date-category";
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
      const { code, title, description } = row;
      await DateCategory.findOneAndUpdate(
        { _id: code },
        { code, title, description },
        { upsert: true, new: true }
      );
    }

    fs.unlinkSync(filePath);
    res.json({ message: "اطلاعات بارگذاری و بروزرسانی شد.", jsonData });
  } catch (error) {
    res.status(500).json({ message: "در پردازش اطلاعات خطا رخ داد.", error });
  }
};
