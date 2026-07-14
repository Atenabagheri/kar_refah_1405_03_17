const Organization = require("../models/organizationModel");
const XLSX = require("xlsx");
const fs = require("fs");
const Province = require("../../general/models/provinceModel");
const DateCategory = require("../models/dateCategoryModel");
const UnitPosition = require("../models/unitPositionModel");

exports.addOrganization = async (req, res) => {
  const {
    dateCategory,
    provinceName,
    management,
    department,
    WithTenure,
    WithoutTenure,
    description,
    creator,
  } = req.body;

  if (!dateCategory || !provinceName) {
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

    const existingProvinceName = await Province.findOne({
      name: provinceName,
    });

    if (!existingProvinceName) {
      return res.status(400).json({ message: "استان انتخاب شده وجود ندارد." });
    }

    const newOrganization = new Organization({
      _id: provinceName + "-" + dateCategory,
      dateCategory,
      provinceName,
      WithTenure,
      WithoutTenure,
      management,
      department,
      description,
      creator,
      // creator: writerAccess.nationalId,
    });

    await newOrganization.save();
    res.status(201).json({
      message: "واحد سازمانی جدید اضافه شد.",
      Organization: newOrganization,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد واحد سازمانی", error: error.message });
  }
};

exports.getOrganizationsInProvance = async (req, res) => {
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

    const provinces = await Province.find().sort({
      faName: 1,
    });

    const result = [];

    for (const province of provinces) {
      const organizationData = await Organization.aggregate([
        { $match: { provinceName: province.name, dateCategory } },
        {
          $group: {
            _id: "$provinceName",
            management: { $sum: "$management" },
            department: { $sum: "$department" },
          },
        },
      ]);

      const unitPositionData = await UnitPosition.aggregate([
        { $match: { provinceName: province.name, dateCategory } },
        {
          $group: {
            _id: "$provinceName",
            managementCount: {
              $sum: { $cond: [{ $eq: ["$unitType", "Management"] }, 1, 0] },
            },
            departmentCount: {
              $sum: { $cond: [{ $eq: ["$unitType", "Department"] }, 1, 0] },
            },
            agencyCount: {
              $sum: { $cond: [{ $eq: ["$unitType", "Agency"] }, 1, 0] },
            },
          },
        },
      ]);

      const provinceData = {
        provinceName: province.faName,
        organization:
          organizationData.length > 0
            ? organizationData[0]
            : { management: 0, department: 0 },
        unitPositions:
          unitPositionData.length > 0
            ? unitPositionData[0]
            : {
                managementCount: 0,
                departmentCount: 0,
                agencyCount: 0,
              },
      };

      result.push(provinceData);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پست های واحد",
      error: error.message,
    });
  }
};

exports.getOrganizations = async (req, res) => {
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
    const organizations = await Organization.find({ dateCategory })
      .select({
        provinceName: 1,
        WithTenure: 1,
        WithoutTenure: 1,
        management: 1,
        department: 1,
      })
      .populate("provinceName", "name faName")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست واحد های سازمانی",
      error: error.message,
    });
  }
};

exports.getOrganizationWithProvince = async (req, res) => {
  const { dateCategory, provinceName } = req.params;
  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }
    const province = await Province.findOne({ name: provinceName });
    if (!province)
      return res.status(404).json({ message: "استان مورد نظر یافت نشد" });

    const organization = await Organization.find({
      dateCategory,
      provinceName,
    })
      .select({
        provinceName: 1,
        unitType: 1,
        WithTenure: 1,
        WithoutTenure: 1,
        description: 1,
        management: 1,
        department: 1,
      })
      .populate("provinceName", "name faName")
      .populate("dateCategory", "title code")
      .populate("creator", "firstName lastName nationalId")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست واحد های سازمانی",
      error: error.message,
    });
  }
};

exports.updateOrganizationWithProvince = async (req, res) => {
  const { dateCategory, provinceName } = req.params;

  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }
    const existingProvinceName = await Province.findOne({
      name: provinceName,
    });
    if (!existingProvinceName) {
      return res.status(400).json({ message: "واحد انتخاب شده وجود ندارد." });
    }

    const updateData = req.body;

    const updatedOrganization = await Organization.findOneAndUpdate(
      { dateCategory: dateCategory, provinceName: provinceName },
      updateData,
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ message: "اطلاعات ویرایش شد.", updatedOrganization });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteOrganization = async (req, res) => {
  const { dateCategory, provinceName } = req.params;

  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }

    const existingProvinceName = await Province.findOne({
      name: provinceName,
    });
    if (!existingProvinceName) {
      return res.status(400).json({ message: "استان انتخاب شده وجود ندارد." });
    }

    const existingOrganization = await Organization.findOne({
      dateCategory,
      provinceName,
    });
    if (!existingOrganization) {
      return res.status(400).json({ message: "سازمان انتخاب شده وجود ندارد." });
    }

    const organization = await Organization.findOneAndDelete({
      dateCategory,
      provinceName,
    });

    res
      .status(200)
      .json({ message: "اطلاعات واحد سازمانی حذف شد.", organization });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف واحد سازمانی", error: error.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "organization";
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
        management,
        department,
        provinceName,
        WithTenure,
        WithoutTenure,
        description,
        creator,
      } = row;
      await Organization.findOneAndUpdate(
        { _id: provinceName + "-" + dateCategory },
        {
          dateCategory,
          management,
          department,
          provinceName,
          WithTenure,
          WithoutTenure,
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
