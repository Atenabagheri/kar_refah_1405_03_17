const AssetCategory = require("../models/assetCategoryModel");
const XLSX = require("xlsx");
const fs = require("fs");

exports.addAssetCategory = async (req, res) => {
  const { name, description, code } = req.body;

  if (!name || !description || !code) {
    return res.status(400).json({ message: "مقادیر لازم الزامی هستند." });
  }

  try {
    const existingAssetCategory = await AssetCategory.findOne({
      code,
    });
    if (existingAssetCategory) {
      return res
        .status(400)
        .json({ message: "این دسته بندی اموال با کد را قبلاً ثبت کرده اید." });
    }

    const newAssetCategory = new AssetCategory({
      _id: code,
      name,
      description,
      code,
    });

    await newAssetCategory.save();
    res.status(201).json({
      message: "دسته بندی اموال جدید اضافه شد.",
      assetCategory: newAssetCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد دسته بندی اموال", error: error.message });
  }
};

exports.getAssetCategories = async (req, res) => {
  try {
    const assetCategories = await AssetCategory.find()
      .select("name code")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(assetCategories);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست دسته بندی اموال ها",
      error: error.message,
    });
  }
};
// not completed and not route
exports.getAssetCategoriesAndAssetsForRoom = async (req, res) => {
  try {
    const assetCategories = await AssetCategory.find().sort({
      createdAt: -1,
    });

    res.status(200).json(assetCategories);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست دسته بندی اموال ها",
      error: error.message,
    });
  }
};

exports.getAssetCategoryWithCode = async (req, res) => {
  const { assetCategoryCode } = req.params;
  try {
    const assetCategory = await AssetCategory.findOne({
      code: assetCategoryCode,
    });

    if (!assetCategory)
      return res
        .status(404)
        .json({ message: "دسته بندی اموال مورد نظر یافت نشد" });

    res.status(200).json(assetCategory);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات دسته بندی اموال",
      error: error.message,
    });
  }
};

exports.updateAssetCategory = async (req, res) => {
  const { assetCategoryCode } = req.params;
  const newData = req.body;

  try {
    const assetCategory = await AssetCategory.findOne({
      code: assetCategoryCode,
    });

    if (!assetCategory) {
      return res.status(404).json({ message: "دسته بندی اموال یافت نشد." });
    }

    if (assetCategoryCode && assetCategoryCode !== assetCategory.code) {
      const existingAssetCategoryCode = await AssetCategory.findOne({
        code: assetCategoryCode,
      });
      if (existingAssetCategoryCode) {
        return res.status(400).json({
          message: "یک دسته بندی اموال با این کد قبلاً ثبت شده است.",
        });
      }
    }

    const updatedAssetCategory = await AssetCategory.findOneAndUpdate(
      { code: assetCategoryCode },
      newData,
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ message: "دسته بندی اموال ویرایش شد.", updatedAssetCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش دسته بندی اموال", error: error.message });
  }
};

exports.deleteAssetCategory = async (req, res) => {
  const { assetCategoryCode } = req.params;

  try {
    const assetCategory = await AssetCategory.findOneAndDelete({
      code: assetCategoryCode,
    });

    if (!assetCategory) {
      return res.status(404).json({ message: "دسته بندی اموال یافت نشد." });
    }

    const name = assetCategory.name;
    const code = assetCategory.code;
    res.status(200).json({
      message: "دسته بندی اموال حذف شد.",
      name,
      code,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف دسته بندی اموال", error: error.message });
  }
};

exports.searchAssetCategory = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const assetCategorys = await AssetCategory.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(assetCategorys);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی دسته بندی اموال ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "assetCategory";
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
      const { name, description, code } = row;
      await AssetCategory.findOneAndUpdate(
        { _id: code },
        { code, name, description },
        { upsert: true, new: true }
      );
    }

    fs.unlinkSync(filePath);
    res.json({ message: "اطلاعات بارگذاری و بروزرسانی شد.", jsonData });
  } catch (error) {
    res.status(500).json({ message: "در پردازش اطلاعات خطا رخ داد.", error });
  }
};
