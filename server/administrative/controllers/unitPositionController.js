const UnitPosition = require("../models/unitPositionModel");
const XLSX = require("xlsx");
const fs = require("fs");
const County = require("../../general/models/countyModel");
const Province = require("../../general/models/provinceModel");
const City = require("../../general/models/cityModel");
const DateCategory = require("../../administrative/models/dateCategoryModel");
const Organization = require("../models/organizationModel");

exports.addUnitPosition = async (req, res) => {
  const {
    dateCategory,
    provinceName,
    countyName,
    cityName,
    unitType,
    WithTenure,
    WithoutTenure,
    officeComplex,
    description,
    population,
    distance,
    updateDescription,
    isUpdate,
    creator,
  } = req.body;

  if (!dateCategory || !provinceName || !countyName || !unitType) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    // const writerAccess = await Employee.findOne({
    //   nationalId: req.employee.nationalId,
    // });

    // if (writerAccess?.county && writerAccess?.county !== countyName) {
    //   return res
    //     .status(400)
    //     .json({ message: "دسترسی شما به این شهرستان بسته است." });
    // }

    // if (writerAccess?.province !== provinceName) {
    //   return res
    //     .status(400)
    //     .json({ message: "دسترسی شما به این استان بسته است." });
    // }

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

    const existingCountyName = await County.findOne({
      name: countyName,
      provinceName: provinceName,
    });
    if (!existingCountyName) {
      return res
        .status(400)
        .json({ message: "شهرستان انتخاب شده وجود ندارد." });
    }

    if (cityName) {
      const existingCityName = await City.findOne({
        name: cityName,
        countyName: countyName,
        provinceName: provinceName,
      });
      if (!existingCityName) {
        return res.status(400).json({ message: "شهر انتخاب شده وجود ندارد." });
      }

      const existingCityNameInUnitPosition = await UnitPosition.findOne({
        provinceName: provinceName,
        countyName: countyName,
        cityName,
        dateCategory,
      });
      if (existingCityNameInUnitPosition) {
        return res
          .status(400)
          .json({ message: "این شهر را قبلاً اضافه کرده اید." });
      }
    }

    const existingCountyNameInUnitPosition = await UnitPosition.findOne({
      provinceName: provinceName,
      countyName: countyName,
      cityName: null,
      dateCategory,
    });

    if (existingCountyNameInUnitPosition) {
      return res
        .status(400)
        .json({ message: "این شهرستان را قبلاً اضافه کرده اید." });
    }

    const newUnitPosition = new UnitPosition({
      _id:
        (cityName && cityName + "-" + dateCategory) ||
        (countyName && countyName + "-" + dateCategory),
      dateCategory,
      provinceName,
      countyName,
      cityName,
      unitType,
      WithTenure,
      WithoutTenure,
      officeComplex,
      description,
      population,
      distance,
      updateDescription,
      isUpdate,
      creator,
      // creator: writerAccess.nationalId,
    });

    await newUnitPosition.save();
    res.status(201).json({
      message: "پست واحد جدید اضافه شد.",
      UnitPosition: newUnitPosition,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد پست واحد", error: error.message });
  }
};

exports.getUnitPositions = async (req, res) => {
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

    const unitPositions = await UnitPosition.find({ dateCategory })
      .select({
        provinceName: 1,
        countyName: 1,
        cityName: 1,
        unitType: 1,
        WithTenure: 1,
        WithoutTenure: 1,
        officeComplex: 1,
      })
      .populate("provinceName", "name faName")
      .populate("countyName", "name faName")
      .populate("cityName", "name faName")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(unitPositions);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پست های واحد",
      error: error.message,
    });
  }
};

exports.getUnitPositionsWithProvinceForWriter = async (req, res) => {
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

    const unitPositions = await UnitPosition.find({
      dateCategory,
      provinceName,
    })
      .select({
        provinceName: 1,
        countyName: 1,
        cityName: 1,
        unitType: 1,
        WithTenure: 1,
        WithoutTenure: 1,
        officeComplex: 1,
      })
      .populate("provinceName", "name faName")
      .populate("countyName", "name faName")
      .populate("cityName", "name faName")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(unitPositions);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پست های واحد",
      error: error.message,
    });
  }
};

exports.getTotalUnitPositionsWithProvinceAndOrganization = async (req, res) => {
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
            WithTenure: { $sum: "$WithTenure" },
            WithoutTenure: { $sum: "$WithoutTenure" },
          },
        },
      ]);

      const unitPositionData = await UnitPosition.aggregate([
        { $match: { provinceName: province.name, dateCategory } },
        {
          $group: {
            _id: "$provinceName",
            WithTenure: { $sum: "$WithTenure" },
            WithoutTenure: { $sum: "$WithoutTenure" },
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
            : { WithTenure: 0, WithoutTenure: 0 },
        unitPositions:
          unitPositionData.length > 0
            ? unitPositionData[0]
            : {
                managementCount: 0,
                departmentCount: 0,
                agencyCount: 0,
                WithTenure: 0,
                WithoutTenure: 0,
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

exports.getUnitPositionsWithProvince = async (req, res) => {
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

    const unitPositions = await UnitPosition.find({
      dateCategory,
      provinceName,
    })
      .select({
        provinceName: 1,
        countyName: 1,
        cityName: 1,
        unitType: 1,
        WithTenure: 1,
        WithoutTenure: 1,
        officeComplex: 1,
        description: 1,
      })
      .populate("provinceName", "name faName")
      .populate("countyName", "name faName isNewCounty")
      .populate("cityName", "name faName")
      .sort({
        createdAt: -1,
      });

    const totalWithTenure = unitPositions.reduce(
      (acc, item) => acc + (item.WithTenure || 0),
      0
    );
    const totalWithoutTenure = unitPositions.reduce(
      (acc, item) => acc + (item.WithoutTenure || 0),
      0
    );

    const totalManagement = unitPositions.reduce(
      (acc, item) => acc + (item.unitType === "Management" ? 1 : 0),
      0
    );
    const totalDepartment = unitPositions.reduce(
      (acc, item) => acc + (item.unitType === "Department" ? 1 : 0),
      0
    );
    const totalAgency = unitPositions.reduce(
      (acc, item) => acc + (item.unitType === "Agency" ? 1 : 0),
      0
    );

    const totalOrganizationTenure = await Organization.findOne({
      provinceName,
    });

    const data = {
      data: unitPositions,
      headquarter: {
        WithTenure: totalOrganizationTenure
          ? totalOrganizationTenure?.WithTenure
          : 0,
        WithoutTenure: totalOrganizationTenure
          ? totalOrganizationTenure?.WithoutTenure
          : 0,
        total: totalOrganizationTenure
          ? totalOrganizationTenure?.WithTenure +
            totalOrganizationTenure?.WithoutTenure
          : 0,
      },
      totalManagement,
      totalDepartment,
      totalAgency,
      totalWithTenure: totalOrganizationTenure
        ? totalWithTenure + totalOrganizationTenure.WithTenure
        : totalWithTenure,
      totalWithoutTenure: totalOrganizationTenure
        ? totalWithoutTenure + totalOrganizationTenure.WithoutTenure
        : totalWithoutTenure,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پست های واحد",
      error: error.message,
    });
  }
};

exports.getUnitPositionWithCountyName = async (req, res) => {
  const { dateCategory, countyName } = req.params;
  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }

    const unitPosition = await UnitPosition.findOne({
      dateCategory,
      countyName: countyName,
      cityName: null,
    })
      .sort({ provinceName: -1 })
      .populate("provinceName", "name faName")
      .populate("countyName", "name faName isNewCounty city")
      .populate("dateCategory", "title code")
      .populate("creator", "firstName lastName nationalId");

    if (!unitPosition)
      return res
        .status(404)
        .json({ message: "شهر یا شهرستان مورد نظر یافت نشد" });

    res.status(200).json(unitPosition);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات پست واحد",
      error: error.message,
    });
  }
};

exports.getUnitPositionWithCityName = async (req, res) => {
  const { dateCategory, cityName } = req.params;
  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }

    const unitPosition = await UnitPosition.findOne({
      dateCategory,
      cityName,
    })
      .sort({ provinceName: -1 })
      .populate("provinceName", "name faName")
      .populate("countyName", "name faName isNewCounty city")
      .populate("cityName", "name faName")
      .populate("dateCategory", "title code")
      .populate("creator", "firstName lastName nationalId");

    if (!unitPosition)
      return res.status(404).json({ message: "شهر مورد نظر یافت نشد" });

    res.status(200).json(unitPosition);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات پست واحد",
      error: error.message,
    });
  }
};

exports.updateUnitPositionWithCounty = async (req, res) => {
  const { dateCategory, countyName } = req.params;

  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }

    const existingCountyName = await County.findOne({
      name: countyName,
    });
    if (!existingCountyName) {
      return res
        .status(400)
        .json({ message: "شهرستان انتخاب شده وجود ندارد." });
    }

    const updateData = req.body;

    const updatedUnitPosition = await UnitPosition.findOneAndUpdate(
      { dateCategory: dateCategory, countyName: countyName },
      updateData,
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ message: "اطلاعات ویرایش شد.", updatedUnitPosition });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.updateUnitPositionWithCity = async (req, res) => {
  const { dateCategory, cityName } = req.params;

  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }

    const existingCityName = await City.findOne({
      name: cityName,
    });
    if (!existingCityName) {
      return res.status(400).json({ message: "شهر انتخاب شده وجود ندارد." });
    }

    const updateData = req.body;

    const updatedUnitPosition = await UnitPosition.findOneAndUpdate(
      { dateCategory: dateCategory, cityName: cityName },
      updateData,
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ message: "اطلاعات ویرایش شد.", updatedUnitPosition });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteUnitPosition = async (req, res) => {
  const { dateCategory, countyName } = req.params;

  try {
    const existingDateCategory = await DateCategory.findOne({
      code: dateCategory,
    });

    if (!existingDateCategory) {
      return res
        .status(400)
        .json({ message: "تاریخ/زمان انتخاب شده وجود ندارد." });
    }

    const unitPost = await UnitPosition.findOneAndDelete({
      dateCategory,
      countyName,
    });

    if (!unitPost) {
      return res.status(404).json({ message: "شهرستان یافت نشد." });
    }

    res.status(200).json({ message: "اطلاعات پست واحد حذف شد.", countyName });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف پست واحد", error: error.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
        const fileName = "unit-position";
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
        provinceName,
        countyName,
        cityName,
        unitType,
        WithTenure,
        WithoutTenure,
        officeComplex,
        population,
        distance,
        isUpdate,
        updateDescription,
        description,
        creator,
      } = row;
      await UnitPosition.findOneAndUpdate(
        {
          _id:
            (cityName && cityName + "-" + dateCategory) ||
            (countyName && countyName + "-" + dateCategory),
        },
        {
          dateCategory,
          provinceName,
          countyName,
          cityName,
          unitType,
          WithTenure,
          WithoutTenure,
          officeComplex,
          population,
          distance,
          isUpdate,
          updateDescription,
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
