const XLSX = require("xlsx");
const fs = require("fs");
const Building = require("../../general/models/buildingModel");
const GasMeter = require("../models/gasMeterModel");
const removeUploaded = require("../../middleware/removeUploaded");
const removeAnyUploaded = require("../../middleware/removeAnyUploaded");

exports.addGasMeter = async (req, res) => {
  const {
    building,
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
    image = `/uploads/gas-meter/${year}/${month}/${req.files["image"][0].filename}`;
  }

  // تنظیم مسیر فایل‌های گالری
  if (req?.files["gallery"]) {
    req.files["gallery"].forEach((file) => {
      gallery.push(`/uploads/gas-meter/${year}/${month}/${file.filename}`);
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

    const existingSerialNumber = await GasMeter.findOne({
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

    const newGasMeter = new GasMeter({
      _id: serialNumber,
      building,
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

    await newGasMeter.save();
    res.status(201).json({
      message: "کنتور گاز جدید اضافه شد.",
      GasMeter: newGasMeter,
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
      .json({ message: "خطا در ایجاد کنتور گاز", error: error.message });
  }
};

exports.getGasMeters = async (req, res) => {
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

    const gasMeters = await GasMeter.aggregate([
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

    const totalGasMeters = await GasMeter.countDocuments(searchConditions);

    const data = {
      data: gasMeters,
      total: totalGasMeters,
      totalPages: Math.ceil(totalGasMeters / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست کنتورهای گاز",
      error: error.message,
    });
  }
};

exports.getGasMeterWithSerialNumber = async (req, res) => {
  const { serialNumber } = req.params;
  try {
    const existingGasMeter = await GasMeter.findOne({
      serialNumber,
    })
      .populate("building", "name postalCode")
      .sort({
        createdAt: -1,
      });

    if (!existingGasMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    res.status(200).json(existingGasMeter);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست کنتورهای گاز",
      error: error.message,
    });
  }
};

exports.updateGasMeterWithSerialNumber = async (req, res) => {
  const { serialNumber } = req.params;

  try {
    const updateData = req.body;
    const existingGasMeter = await GasMeter.findOne({
      serialNumber,
    });

    if (!existingGasMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    if (
      updateData.building &&
      updateData.building !== existingGasMeter.building
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

    const updatedGasMeter = await GasMeter.findOneAndUpdate(
      { serialNumber: serialNumber },
      updateData,
      {
        new: true,
      },
    );

    // await existingGasMeter.updateOne(
    //   updateData,
    //   {
    //     new: true,
    //   }
    // );

    res.status(200).json({ message: "اطلاعات ویرایش شد.", updatedGasMeter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteGasMeter = async (req, res) => {
  const { serialNumber } = req.params;

  try {
    const existingGasMeter = await GasMeter.findOne({
      serialNumber,
    });

    if (!existingGasMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    const gasMeter = await GasMeter.findOneAndDelete({
      serialNumber,
    });

    res.status(200).json({ message: "اطلاعات کنتور گاز حذف شد.", gasMeter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف کنتور گاز", error: error.message });
  }
};

exports.searchGasMeter = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const GasMeters = await GasMeter.find({
      $or: [
        { billIdentifier: { $regex: query, $options: "i" } },
        { serialNumber: { $regex: query, $options: "i" } },
        { building: { $regex: query, $options: "i" } },
      ],
    })
      .populate("building", "name postalCode")
      .select("building billIdentifier serialNumber");

    res.status(200).json(GasMeters);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی کنتور ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "gasMeter";
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
        serialNumber,
        billIdentifier,
        description,
        creator,
        type,
        province,
        county,
      } = row;
      await GasMeter.findOneAndUpdate(
        { _id: serialNumber },
        {
          building,
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
