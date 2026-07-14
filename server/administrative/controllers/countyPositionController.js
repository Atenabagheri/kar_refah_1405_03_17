const CountyPosition = require("../models/countyPositionModel");
const XLSX = require("xlsx");
const fs = require("fs");
const County = require("../../general/models/countyModel");
const Province = require("../../general/models/provinceModel");
const City = require("../../general/models/cityModel");
const DateCategory = require("../models/dateCategoryModel");

exports.addCountyPosition = async (req, res) => {
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

      const existingCityNameInCountyPosition = await CountyPosition.findOne({
        provinceName: provinceName,
        countyName: countyName,
        cityName,
      });
      if (existingCityNameInCountyPosition) {
        return res
          .status(400)
          .json({ message: "این شهر را قبلاً اضافه کرده اید." });
      }
    }

    const existingCountyNameInCountyPosition = await CountyPosition.findOne({
      provinceName: provinceName,
      countyName: countyName,
      cityName: null,
    });

    if (existingCountyNameInCountyPosition) {
      return res
        .status(400)
        .json({ message: "این شهرستان را قبلاً اضافه کرده اید." });
    }

    const newCountyPosition = new CountyPosition({
      _id: cityName || countyName,
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

    await newCountyPosition.save();
    res.status(201).json({
      message: "آمار پست شهرستان جدید اضافه شد.",
      CountyPosition: newCountyPosition,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد آمار پست شهرستان", error: error.message });
  }
};

exports.getCountyPositions = async (req, res) => {
  try {
    const countyPositions = await CountyPosition.find()
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

    res.status(200).json(countyPositions);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست آمار های پست شهرستان",
      error: error.message,
    });
  }
};

exports.getCountyPositionsWithProvinceForWriter = async (req, res) => {
  const { provinceName } = req.params;
  try {
    const province = await Province.findOne({ name: provinceName });
    if (!province)
      return res.status(404).json({ message: "استان مورد نظر یافت نشد" });

    const countyPositions = await CountyPosition.find({ provinceName })
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

    res.status(200).json(countyPositions);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست آمار های پست شهرستان",
      error: error.message,
    });
  }
};

exports.getCountyPositionsWithProvince = async (req, res) => {
  const { provinceName } = req.params;
  try {
    const province = await Province.findOne({ name: provinceName });
    if (!province)
      return res.status(404).json({ message: "استان مورد نظر یافت نشد" });

    const countyPositions = await CountyPosition.find({ provinceName })
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

    const totalWithTenure = countyPositions.reduce(
      (acc, item) => acc + (item.WithTenure || 0),
      0
    );
    const totalWithoutTenure = countyPositions.reduce(
      (acc, item) => acc + (item.WithoutTenure || 0),
      0
    );

    const totalManagement = countyPositions.reduce(
      (acc, item) => acc + (item.unitType === "Management" ? 1 : 0),
      0
    );
    const totalDepartment = countyPositions.reduce(
      (acc, item) => acc + (item.unitType === "Department" ? 1 : 0),
      0
    );
    const totalAgency = countyPositions.reduce(
      (acc, item) => acc + (item.unitType === "Agency" ? 1 : 0),
      0
    );

    const data = {
      data: countyPositions,
      totalManagement,
      totalDepartment,
      totalAgency,
      totalWithTenure,
      totalWithoutTenure,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست آمار های پست شهرستان",
      error: error.message,
    });
  }
};

exports.getCountyPositionWithCountyName = async (req, res) => {
  const { countyName } = req.params;
  try {
    const countyPosition = await CountyPosition.findOne({
      countyName: countyName,
      cityName: null,
    })
      .sort({ provinceName: -1 })
      .populate("provinceName", "name faName")
      .populate("countyName", "name faName isNewCounty city")
      .populate("dateCategory", "title code")
      .populate("creator", "firstName lastName nationalId");

    if (!countyPosition)
      return res
        .status(404)
        .json({ message: "شهر یا شهرستان مورد نظر یافت نشد" });

    res.status(200).json(countyPosition);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات آمار پست شهرستان",
      error: error.message,
    });
  }
};

exports.getCountyPositionWithCityName = async (req, res) => {
  const { cityName } = req.params;
  try {
    const countyPosition = await CountyPosition.findOne({
      cityName,
    })
      .sort({ provinceName: -1 })
      .populate("provinceName", "name faName")
      .populate("countyName", "name faName isNewCounty city")
      .populate("cityName", "name faName")
      .populate("dateCategory", "title code")
      .populate("creator", "firstName lastName nationalId");

    if (!countyPosition)
      return res.status(404).json({ message: "شهر مورد نظر یافت نشد" });

    res.status(200).json(countyPosition);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات آمار پست شهرستان",
      error: error.message,
    });
  }
};

exports.updateCountyPositionWithCounty = async (req, res) => {
  const { countyName } = req.params;

  try {
    const existingCountyName = await County.findOne({
      name: countyName,
    });
    if (!existingCountyName) {
      return res
        .status(400)
        .json({ message: "شهرستان انتخاب شده وجود ندارد." });
    }

    const updateData = req.body;

    const updatedCountyPosition = await CountyPosition.findOneAndUpdate(
      { countyName: countyName },
      updateData,
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ message: "اطلاعات ویرایش شد.", updatedCountyPosition });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.updateCountyPositionWithCity = async (req, res) => {
  const { cityName } = req.params;

  try {
    const existingCityName = await City.findOne({
      name: cityName,
    });
    if (!existingCityName) {
      return res.status(400).json({ message: "شهر انتخاب شده وجود ندارد." });
    }

    const updateData = req.body;

    const updatedCountyPosition = await CountyPosition.findOneAndUpdate(
      { cityName: cityName },
      updateData,
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ message: "اطلاعات ویرایش شد.", updatedCountyPosition });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteCountyPosition = async (req, res) => {
  const { countyName } = req.params;

  try {
    const countyPost = await CountyPosition.findOneAndDelete({
      countyName,
    });

    if (!countyPost) {
      return res.status(404).json({ message: "شهرستان یافت نشد." });
    }

    res
      .status(200)
      .json({ message: "اطلاعات آمار پست شهرستان حذف شد.", countyName });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف آمار پست شهرستان", error: error.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "county-position";

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
    const jsonData = XLSX.utils.sheet_to_json(sheet);

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
      await CountyPosition.findOneAndUpdate(
        { _id: cityName || countyName },
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
