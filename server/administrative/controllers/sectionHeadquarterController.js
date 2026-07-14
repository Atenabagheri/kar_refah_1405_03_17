const XLSX = require("xlsx");
const fs = require("fs");
const DateCategory = require("../models/dateCategoryModel");
const Section = require("../../general/models/sectionModel");
const Division = require("../../general/models/divisionModel");
const SectionHeadquarter = require("../models/sectionHeadquarterModel");

exports.addSectionHeadquarter = async (req, res) => {
  // const { dateCategory } = req.params;
  const {
    divisionCode,
    sectionCode,
    dateCategory,
    sectionDeputy,
    sectionCenter,
    sectionGeneral,
    sectionOffice,
    sectionManagement,
    sectionDepartment,
    description,
    creator,
  } = req.body;

  if (!divisionCode || !sectionCode) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }

    const existingDivisionCode = await Division.findOne({
      code: divisionCode,
    });
    if (!existingDivisionCode) {
      return res.status(400).json({ message: "حوزه انتخاب شده وجود ندارد." });
    }

    const existingSectionCode = await Section.findOne({
      code: sectionCode,
    });
    if (!existingSectionCode) {
      return res.status(400).json({ message: "واحد انتخاب شده وجود ندارد." });
    }

    const newSectionHeadquarter = new SectionHeadquarter({
      _id: sectionCode + "-" + dateCategory,
      dateCategory,
      divisionCode,
      sectionCode,
      sectionDeputy,
      sectionCenter,
      sectionGeneral,
      sectionOffice,
      sectionManagement,
      sectionDepartment,
      description,
      creator,
      // creator: writerAccess.nationalId,
    });

    await newSectionHeadquarter.save();
    res.status(201).json({
      message: "پست ستاد جدید اضافه شد.",
      SectionHeadquarter: newSectionHeadquarter,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد پست ستاد", error: error.message });
  }
};

exports.getSectionHeadquarters = async (req, res) => {
  const { dateCategory } = req.params;

  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }
    const sectionHeadquarters = await SectionHeadquarter.find({ dateCategory })
      .populate("divisionCode", "code faName")
      .populate("sectionCode", "code faName")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(sectionHeadquarters);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پست های ستاد",
      error: error.message,
    });
  }
};

exports.getSectionHeadquarterWithSection = async (req, res) => {
  const { dateCategory, sectionCode } = req.params;
  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }
    const section = await Section.findOne({ code: sectionCode });
    if (!section)
      return res.status(404).json({ message: "واحد مورد نظر یافت نشد" });

    const sectionHeadquarters = await SectionHeadquarter.find({
      sectionCode,
      dateCategory,
    })
      .populate("divisionCode", "code faName")
      .populate("sectionCode", "code faName")
      .populate("dateCategory", "title code")
      .populate("creator", "firstName lastName nationalId")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(sectionHeadquarters);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پست های ستاد",
      error: error.message,
    });
  }
};

exports.getSectionHeadquartersWithDivision = async (req, res) => {
  const { dateCategory, divisionCode } = req.params;
  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }
    const division = await Division.findOne({ code: divisionCode });
    if (!division)
      return res.status(404).json({ message: "حوزه مورد نظر یافت نشد" });

    const sectionHeadquarters = await SectionHeadquarter.find({
      divisionCode,
      dateCategory,
    })
      .select({
        divisionCode: 1,
        sectionCenter: 1,
        sectionDepartment: 1,
        sectionDeputy: 1,
        sectionGeneral: 1,
        sectionManagement: 1,
        sectionOffice: 1,
        description: 1,
        sectionCode: 1,
      })
      .populate("divisionCode", "code faName")
      .populate("sectionCode", "code faName")
      .sort({
        createdAt: 1,
      });

    // const sectionDeputy = sectionHeadquarters.reduce(
    //   (acc, item) => acc + (item.sectionDeputy || 0),
    //   0
    // );
    // const sectionCenter = sectionHeadquarters.reduce(
    //   (acc, item) => acc + (item.sectionCenter || 0),
    //   0
    // );
    // const sectionGeneral = sectionHeadquarters.reduce(
    //   (acc, item) => acc + (item.sectionGeneral || 0),
    //   0
    // );
    // const sectionOffice = sectionHeadquarters.reduce(
    //   (acc, item) => acc + (item.sectionOffice || 0),
    //   0
    // );
    // const sectionManagement = sectionHeadquarters.reduce(
    //   (acc, item) => acc + (item.sectionManagement || 0),
    //   0
    // );
    // const sectionDepartment = sectionHeadquarters.reduce(
    //   (acc, item) => acc + (item.sectionDepartment || 0),
    //   0
    // );

    const totals = sectionHeadquarters.reduce(
      (acc, item) => {
        acc.sectionDeputy += item.sectionDeputy || 0;
        acc.sectionCenter += item.sectionCenter || 0;
        acc.sectionGeneral += item.sectionGeneral || 0;
        acc.sectionOffice += item.sectionOffice || 0;
        acc.sectionManagement += item.sectionManagement || 0;
        acc.sectionDepartment += item.sectionDepartment || 0;
        return acc;
      },
      {
        sectionDeputy: 0,
        sectionCenter: 0,
        sectionGeneral: 0,
        sectionOffice: 0,
        sectionManagement: 0,
        sectionDepartment: 0,
      }
    );

    // add all descriptions to array
    const descriptions = [
      ...new Set(
        sectionHeadquarters
          .map((item) => item.description)
          .filter((desc) => desc && desc.trim() !== "")
      ),
    ];

    // delete description from sectionHeadquarters
    const cleanedData = sectionHeadquarters.map((item) => {
      const obj = item.toObject();
      delete obj.description;
      return obj;
    });

    const data = {
      data: cleanedData,
      division: division.faName,
      total: totals,
      descriptions,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پست های ستاد",
      error: error.message,
    });
  }
};

exports.getTotalSectionHeadquarters = async (req, res) => {
  const { dateCategory } = req.params;

  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }

    const sectionHeadquarters = await SectionHeadquarter.find({ dateCategory })
      .select({
        divisionCode: 1,
        sectionCode: 1,
        sectionCenter: 1,
        sectionDepartment: 1,
        sectionDeputy: 1,
        sectionGeneral: 1,
        sectionManagement: 1,
        sectionOffice: 1,
        description: 1,
      })
      .populate("divisionCode", "code faName")
      .populate("sectionCode", "code faName")
      .sort({
        divisionCode: -1,
      });

    const groupedByDivisionCode = sectionHeadquarters.reduce((acc, current) => {
      if (!acc[current.divisionCode.code]) {
        acc[current.divisionCode.code] = {
          divisionCode: current.divisionCode,
          sections: [],
        };
      }
      acc[current.divisionCode.code].sections.push(current);
      return acc;
    }, {});

    const result = Object.values(groupedByDivisionCode);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پست های ستاد",
      error: error.message,
    });
  }
};

exports.getTotalSectionHeadquartersForDivision = async (req, res) => {
  const { dateCategory } = req.params;
  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }
    const divisions = await Division.aggregate([
      {
        $lookup: {
          from: "sectionheadquarters",
          localField: "code",
          foreignField: "divisionCode",
          as: "sectionHeadquarter",
        },
      },
      {
        $addFields: {
          sectionDeputySum: { $sum: "$sectionHeadquarter.sectionDeputy" },
          sectionCenterSum: { $sum: "$sectionHeadquarter.sectionCenter" },
          sectionGeneralSum: { $sum: "$sectionHeadquarter.sectionGeneral" },
          sectionOfficeSum: { $sum: "$sectionHeadquarter.sectionOffice" },
          sectionManagementSum: {
            $sum: "$sectionHeadquarter.sectionManagement",
          },
          sectionDepartmentSum: {
            $sum: "$sectionHeadquarter.sectionDepartment",
          },
        },
      },
      {
        $project: {
          faName: 1,
          sectionDeputySum: 1,
          sectionCenterSum: 1,
          sectionGeneralSum: 1,
          sectionOfficeSum: 1,
          sectionManagementSum: 1,
          sectionDepartmentSum: 1,
        },
      },
    ]);

    res.status(200).json(divisions);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پست های ستاد",
      error: error.message,
    });
  }
};

exports.updateSectionHeadquarterWithSection = async (req, res) => {
  const { dateCategory, sectionCode } = req.params;
  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }

    const existingSectionCode = await Section.findOne({
      code: sectionCode,
    });
    if (!existingSectionCode) {
      return res.status(400).json({ message: "واحد انتخاب شده وجود ندارد." });
    }

    const updateData = req.body;

    const updatedSectionHeadquarter = await SectionHeadquarter.findOneAndUpdate(
      { dateCategory: dateCategory, sectionCode: sectionCode },
      updateData,
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ message: "اطلاعات ویرایش شد.", updatedSectionHeadquarter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteSectionHeadquarter = async (req, res) => {
  const { dateCategory, sectionCode } = req.params;

  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }
    const sectionHeadquarterPost = await SectionHeadquarter.findOneAndDelete({
      sectionCode,
    });

    if (!sectionHeadquarterPost) {
      return res.status(404).json({ message: "استان یافت نشد." });
    }

    res.status(200).json({ message: "اطلاعات پست ستاد حذف شد.", sectionCode });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف پست ستاد", error: error.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "section-headquarter";
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
        dateCategory,
        divisionCode,
        sectionCode,
        sectionDeputy,
        sectionCenter,
        sectionGeneral,
        sectionOffice,
        sectionManagement,
        sectionDepartment,
        description,
        creator,
      } = row;
      await SectionHeadquarter.findOneAndUpdate(
        { _id: sectionCode + "-" + dateCategory },
        {
          dateCategory,
          divisionCode,
          sectionCode,
          sectionDeputy,
          sectionCenter,
          sectionGeneral,
          sectionOffice,
          sectionManagement,
          sectionDepartment,
          description,
          creator,
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
