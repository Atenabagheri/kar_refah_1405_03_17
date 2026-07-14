const XLSX = require("xlsx");
const fs = require("fs");
const Building = require("../../general/models/buildingModel");
const WaterMeter = require("../models/waterMeterModel");
const Site = require("../../general/models/siteModel");
const removeUploaded = require("../../middleware/removeUploaded");
const removeAnyUploaded = require("../../middleware/removeAnyUploaded");

exports.addWaterMeter = async (req, res) => {
  const {
    building,
    site,
    buildingsCover,
    serialNumber,
    billIdentifier,
    description,
    creator,
    type,
    province,
    county,
  } = req.body;

  const currentDate = new Date();
  const year = currentDate.getFullYear(); // سال فعلی
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // ماه فعلی (01 تا 12)
  const gallery = [];
  let image = null;

  if (req?.files["image"]) {
    image = `/uploads/water-meter/${year}/${month}/${req.files["image"][0].filename}`;
  }

  // تنظیم مسیر فایل‌های گالری
  if (req?.files["gallery"]) {
    req.files["gallery"].forEach((file) => {
      gallery.push(`/uploads/water-meter/${year}/${month}/${file.filename}`);
    });
  }

  if (!serialNumber || !billIdentifier) {
    if (image) {
      removeUploaded(image); // حذف تصویر
    }

    if (gallery.length > 0) {
      removeAnyUploaded(gallery); // حذف گالری
    }
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    const existingBuilding = await Building.findOne({
      postalCode: building,
    });

    if (!existingBuilding) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res
        .status(400)
        .json({ message: "ساختمان انتخاب شده وجود ندارد." });
    }

    if (site) {
      const existingSite = await Site.findOne({
        postalCode: site,
      });

      if (!existingSite) {
        if (image) {
          removeUploaded(image); // حذف تصویر
        }

        if (gallery.length > 0) {
          removeAnyUploaded(gallery); // حذف گالری
        }
        return res.status(400).json({ message: "سایت انتخاب شده وجود ندارد." });
      }
    }

    const existingSerialNumber = await WaterMeter.findOne({
      serialNumber,
    });

    if (existingSerialNumber) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده قبلا ثبت شده است." });
    }

    const newWaterMeter = new WaterMeter({
      _id: serialNumber,
      building,
      site,
      buildingsCover,
      serialNumber,
      billIdentifier,
      description,
      creator,
      type,
      province,
      county,
      image,
      gallery,
      // creator: writerAccess.nationalId,
    });

    await newWaterMeter.save();
    res.status(201).json({
      message: "کنتور آب جدید اضافه شد.",
      WaterMeter: newWaterMeter,
    });
  } catch (error) {
    if (image) {
      removeUploaded(image); // حذف تصویر
    }

    if (gallery.length > 0) {
      removeAnyUploaded(gallery); // حذف گالری
    }
    res
      .status(500)
      .json({ message: "خطا در ایجاد کنتور آب", error: error.message });
  }
};

exports.getWaterMeters = async (req, res) => {
  try {
    const user = req.employee;
    const MHQO = user.roles === "MHQO";
    const MPO = user.roles === "MPO";

    const type = req.query.type;
    const province = req.query.province;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    let searchConditions = {};

    if (MHQO && type) searchConditions.type = type;
    if (MHQO && province) searchConditions.province = province;
    if (MPO) searchConditions.type = "province";
    if (MPO) searchConditions.province = user.province;

    const waterMeters = await WaterMeter.aggregate([
      { $match: searchConditions },

      {
        $lookup: {
          from: "buildings",
          localField: "building",
          foreignField: "postalCode",
          as: "building",
        },
      },

      { $unwind: "$building" },

      {
        $lookup: {
          from: "provinces",
          localField: "building.province",
          foreignField: "name",
          as: "building.province",
        },
      },

      {
        $lookup: {
          from: "counties",
          localField: "building.county",
          foreignField: "name",
          as: "building.county",
        },
      },

      {
        $unwind: {
          path: "$building.province",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$building.county",
          preserveNullAndEmptyArrays: true,
        },
      },

      { $sort: { "building.type": 1, "building.priority": 1 } },

      { $skip: skip },
      { $limit: limit },

      {
        $project: {
          _id: 1,
          type: 1,
          serialNumber: 1,
          billIdentifier: 1,
          createdAt: 1,

          "building._id": 1,
          "building.name": 1,
          "building.postalCode": 1,
          "building.priority": 1,

          "building.province.faName": 1,
          "building.county.faName": 1,
        },
      },
    ]);
    const totalWaterMeters = await WaterMeter.countDocuments(searchConditions);

    const data = {
      data: waterMeters,
      total: totalWaterMeters,
      totalPages: Math.ceil(totalWaterMeters / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست کنتورهای آب",
      error: error.message,
    });
  }
};

exports.getWaterMeterWithSerialNumber = async (req, res) => {
  const { serialNumber } = req.params;
  try {
    const existingWaterMeter = await WaterMeter.findOne({
      serialNumber,
    })
      .populate("site", "name postalCode")
      .populate("building", "name postalCode")
      .populate("buildingsCover", "name postalCode")
      .sort({
        createdAt: -1,
      });

    if (!existingWaterMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    res.status(200).json(existingWaterMeter);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست کنتورهای آب",
      error: error.message,
    });
  }
};

exports.updateWaterMeterWithSerialNumber = async (req, res) => {
  const { serialNumber } = req.params;

  try {
    const updateData = req.body;
    const existingWaterMeter = await WaterMeter.findOne({
      serialNumber,
    });

    if (!existingWaterMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    if (
      updateData.building &&
      updateData.building !== existingWaterMeter.building
    ) {
      const existingBuilding = await Building.findOne({
        postalCode: updateData.building,
      });

      if (!existingBuilding) {
        return res
          .status(400)
          .json({ message: "ساختمان انتخاب شده وجود ندارد." });
      }
    }

    const updatedWaterMeter = await WaterMeter.findOneAndUpdate(
      { serialNumber: serialNumber },
      updateData,
      {
        new: true,
      },
    );

    // await existingWaterMeter.updateOne(
    //   updateData,
    //   {
    //     new: true,
    //   }
    // );

    res.status(200).json({ message: "اطلاعات ویرایش شد.", updatedWaterMeter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteWaterMeter = async (req, res) => {
  const { serialNumber } = req.params;

  try {
    const existingWaterMeter = await WaterMeter.findOne({
      serialNumber,
    });

    if (!existingWaterMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    const waterMeter = await WaterMeter.findOneAndDelete({
      serialNumber,
    });

    res.status(200).json({ message: "اطلاعات کنتور آب حذف شد.", waterMeter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف کنتور آب", error: error.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "waterMeter";
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
        building,
        site,
        buildingsCover,
        serialNumber,
        billIdentifier,
        description,
        creator,
        type,
        province,
        county,
      } = row;
      await WaterMeter.findOneAndUpdate(
        { _id: serialNumber },
        {
          building,
          site,
          buildingsCover,
          serialNumber,
          billIdentifier,
          description,
          creator,
          type,
          province,
          county,
        },
        { upsert: true, new: true },
      );
    }

    fs.unlinkSync(filePath);
    res.json({ message: "اطلاعات بارگذاری و بروزرسانی شد.", jsonData });
  } catch (error) {
    res.status(500).json({ message: "در پردازش اطلاعات خطا رخ داد.", error });
  }
};

exports.searchWaterMeter = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const waterMeters = await WaterMeter.aggregate([
      {
        $lookup: {
          from: "buildings", // نام کالکشن ساختمان‌ها در MongoDB
          localField: "building",
          foreignField: "_id",
          as: "buildingInfo",
        },
      },
      {
        $unwind: {
          path: "$buildingInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { billIdentifier: { $regex: query, $options: "i" } },
            { serialNumber: { $regex: query, $options: "i" } },
            { "buildingInfo.name": { $regex: query, $options: "i" } },
            { "buildingInfo.postalCode": { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          billIdentifier: 1,
          serialNumber: 1,
          building: {
            _id: "$buildingInfo._id",
            name: "$buildingInfo.name",
            postalCode: "$buildingInfo.postalCode",
          },
        },
      },
    ]);

    res.status(200).json(waterMeters);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی کنتور ها",
      error: error.message,
    });
  }
};

exports.searchWaterMeterOld = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const waterMeters = await WaterMeter.find({
      $or: [
        { billIdentifier: { $regex: query, $options: "i" } },
        { serialNumber: { $regex: query, $options: "i" } },
        { building: { $regex: query, $options: "i" } },
      ],
    })
      .populate("building", "name postalCode")
      .select("building billIdentifier serialNumber");

    res.status(200).json(waterMeters);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی کنتور ها",
      error: error.message,
    });
  }
};
