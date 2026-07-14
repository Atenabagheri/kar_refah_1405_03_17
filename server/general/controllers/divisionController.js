const Division = require("../models/divisionModel");
const XLSX = require("xlsx");
const fs = require("fs");

exports.addDivision = async (req, res) => {
  const { code, faName } = req.body;

  if (!code || !faName) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    // const existingProvinceName = await Province.findOne({
    //   name: provinceName,
    // });
    // if (!existingProvinceName) {
    //   return res.status(400).json({ message: "استان انتخاب شده وجود ندارد." });
    // }

    const existingDivisionName = await Division.findOne({
      code,
    });
    if (existingDivisionName) {
      return res.status(400).json({ message: "این کد را قبلاً ثبت کرده اید." });
    }

    const existingDivisionFaName = await Division.findOne({
      faName,
    });
    if (existingDivisionFaName) {
      return res
        .status(400)
        .json({ message: "این نام فارسی را قبلاً ثبت کرده اید." });
    }

    const newDivision = new Division({
      _id: code,
      code,
      faName,
    });

    await newDivision.save();
    res.status(201).json({
      message: "حوزه جدید اضافه شد.",
      Division: newDivision,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد حوزه", error: error.message });
  }
};

exports.getDivisions = async (req, res) => {
  try {
    const divisions = await Division.find()
      .sort({
        createdAt: 1,
      })
      .sort({ provinceName: 1 });

    res.status(200).json(divisions);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست حوزه ها",
      error: error.message,
    });
  }
};

exports.getDivisionWithCode = async (req, res) => {
  const { divisionCode } = req.params;
  try {
    const division = await Division.findOne({ code: divisionCode });

    if (!division)
      return res.status(404).json({ message: "حوزه مورد نظر یافت نشد" });

    res.status(200).json(division);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست حوزه ها",
      error: error.message,
    });
  }
};

exports.updateDivision = async (req, res) => {
  const { divisionCode } = req.params;
  // const { name, faName, provinceName } = req.body;
  const newData = req.body;
  try {
    const division = await Division.findOne({
      code: divisionCode,
    });

    if (!division) {
      return res.status(404).json({ message: "حوزه یافت نشد." });
    }

    if (newData.code && newData.code !== division.code) {
      const existingDivisionName = await Division.findOne({
        code: newData.code,
      });
      if (existingDivisionName) {
        return res.status(400).json({ message: "این کد قبلاً ثبت شده است." });
      }
    }

    if (newData.faName && newData.faName !== division.faName) {
      const existingDivisionFaName = await Division.findOne({
        faName: newData.faName,
      });
      if (existingDivisionFaName) {
        return res
          .status(400)
          .json({ message: "این نام فارسی قبلاً ثبت شده است." });
      }
    }

    // if (
    //   newData.provinceName &&
    //   newData.provinceName !== division.provinceName
    // ) {
    //   const existingProvinceName = await Province.findOne({
    //     name: newData.provinceName,
    //   });
    //   if (!existingProvinceName) {
    //     return res
    //       .status(400)
    //       .json({ message: "استان انتخاب شده وجود ندارد." });
    //   }
    // }
    const updatedDivision = await Division.findOneAndUpdate(
      {
        code: divisionCode,
      },
      newData,
      { new: true }
    );

    await division.save();
    res.status(200).json({ message: "حوزه ویرایش شد.", updatedDivision });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش حوزه", error: error.message });
  }
};

exports.deleteDivision = async (req, res) => {
  const { divisionCode } = req.params;

  try {
    const division = await Division.findOneAndDelete({
      code: divisionCode,
    });

    if (!division) {
      return res.status(404).json({ message: "حوزه یافت نشد." });
    }

    const faName = division.faName;
    res.status(200).json({ message: "حوزه حذف شد.", divisionCode, faName });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف حوزه", error: error.message });
  }
};

exports.searchDivision = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const divisions = await Division.find({
      $or: [
        { code: { $regex: query, $options: "i" } },
        { faName: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(divisions);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی حوزه ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "division";
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
      const { code, faName, provinceName } = row;
      await Division.findOneAndUpdate(
        { _id: code },
        {
          code,
          faName,
          provinceName,
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
