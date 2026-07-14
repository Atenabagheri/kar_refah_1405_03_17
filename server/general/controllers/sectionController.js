const Section = require("../models/sectionModel");
const XLSX = require("xlsx");
const fs = require("fs");
const Division = require("../models/divisionModel");

exports.addSection = async (req, res) => {
  const { code, faName, divisionCode } = req.body;

  if (!code || !faName || !divisionCode) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    const existingDivisionCode = await Division.findOne({
      code: divisionCode,
    });
    if (!existingDivisionCode) {
      return res.status(400).json({ message: "حوزه انتخاب شده وجود ندارد." });
    }

    const existingSectionName = await Section.findOne({
      code,
    });
    if (existingSectionName) {
      return res.status(400).json({ message: "این کد را قبلاً ثبت کرده اید." });
    }

    const existingSectionFaName = await Section.findOne({
      faName,
    });
    if (existingSectionFaName) {
      return res
        .status(400)
        .json({ message: "این نام فارسی را قبلاً ثبت کرده اید." });
    }

    const newSection = new Section({
      _id: code,
      code,
      faName,
      divisionCode,
    });

    await newSection.save();
    res.status(201).json({
      message: "واحد جدید اضافه شد.",
      Section: newSection,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد واحد", error: error.message });
  }
};

exports.getSections = async (req, res) => {
  try {
    const sections = await Section.find().sort({
      createdAt: -1,
    });

    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست واحد ها",
      error: error.message,
    });
  }
};

exports.getSectionWithCode = async (req, res) => {
  const { sectionCode } = req.params;
  try {
    const section = await Section.findOne({ code: sectionCode }).populate(
      "divisionCode"
    );

    if (!section)
      return res.status(404).json({ message: "واحد مورد نظر یافت نشد" });

    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست واحد ها",
      error: error.message,
    });
  }
};

exports.getSectionsWithDivision = async (req, res) => {
  const { divisionCode } = req.params;
  try {
    const division = await Division.findOne({ code: divisionCode });
    if (!division)
      return res.status(404).json({ message: "حوزه مورد نظر یافت نشد" });

    const sections = await Section.find({ division: divisionCode }).populate(
      "divisionCode"
    );
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست واحد ها",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  const { sectionCode } = req.params;
  // const { name, faName, provinceName } = req.body;
  const newData = req.body;
  try {
    const section = await Section.findOne({
      code: sectionCode,
    });

    if (!section) {
      return res.status(404).json({ message: "واحد یافت نشد." });
    }

    const existingDivisionCode = await Division.findOne({
      code: newData.divisionCode,
    });
    if (!existingDivisionCode) {
      return res.status(400).json({ message: "حوزه انتخاب شده وجود ندارد." });
    }

    if (newData.code && newData.code !== section.code) {
      const existingSectionName = await Section.findOne({
        code: newData.code,
      });
      if (existingSectionName) {
        return res.status(400).json({ message: "این کد قبلاً ثبت شده است." });
      }
    }

    if (newData.faName && newData.faName !== section.faName) {
      const existingSectionFaName = await Section.findOne({
        faName: newData.faName,
      });
      if (existingSectionFaName) {
        return res
          .status(400)
          .json({ message: "این نام فارسی قبلاً ثبت شده است." });
      }
    }

    // if (newData.provinceName && newData.provinceName !== section.provinceName) {
    //   const existingProvinceName = await Province.findOne({
    //     name: newData.provinceName,
    //   });
    //   if (!existingProvinceName) {
    //     return res
    //       .status(400)
    //       .json({ message: "استان انتخاب شده وجود ندارد." });
    //   }
    // }
    const updatedSection = await Section.findOneAndUpdate(
      {
        name: sectionCode,
      },
      newData,
      { new: true }
    );

    await section.save();
    res.status(200).json({ message: "واحد ویرایش شد.", updatedSection });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش واحد", error: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  const { sectionCode } = req.params;

  try {
    const section = await Section.findOneAndDelete({
      code: sectionCode,
    });

    if (!section) {
      return res.status(404).json({ message: "واحد یافت نشد." });
    }

    const faName = section.faName;
    res.status(200).json({ message: "واحد حذف شد.", sectionCode, faName });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف واحد", error: error.message });
  }
};

exports.searchSection = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const sections = await Section.find({
      $or: [
        { code: { $regex: query, $options: "i" } },
        { faName: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی واحد ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "section";
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
      const { code, faName, divisionCode } = row;
      await Section.findOneAndUpdate(
        { _id: code },
        {
          code,
          faName,
          divisionCode,
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
