const Building = require("../models/buildingModel");
const XLSX = require("xlsx");
const fs = require("fs");
const ElectricityMeter = require("../../energy/models/electricityMeterModel");
const Room = require("../models/roomModel");
const Province = require("../models/provinceModel");
const County = require("../models/countyModel");
const Employee = require("../models/employeeModel");
const WaterMeter = require("../../support/models/waterMeterModel");
const GasMeter = require("../../support/models/gasMeterModel");
const removeUploaded = require("../../middleware/removeUploaded");
const removeAnyUploaded = require("../../middleware/removeAnyUploaded");

exports.addBuilding = async (req, res) => {
  const {
    site,
    province,
    county,
    city,
    postalCode,
    name,
    description,
    address,
    number,
    division,
    type,
    usage,
    longitude,
    latitude,
    meterage,
    ownership,
    floors,
    landArea,
    builtArea,
    priority,
    numberBuilding,
  } = req.body;

  if (
    !province ||
    !county ||
    !postalCode ||
    !name ||
    !number ||
    !address ||
    !type ||
    !usage ||
    !ownership
  ) {
    return res.status(400).json({ message: "مقادیر لازم الزامی هستند." });
  }

  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear(); // سال فعلی
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // ماه فعلی (01 تا 12)
    const gallery = [];
    let image = null;

    if (req?.files["image"]) {
      image = `/uploads/buildings/${year}/${month}/${req.files["image"][0].filename}`;
    }

    // تنظیم مسیر فایل‌های گالری
    if (req?.files["gallery"]) {
      req.files["gallery"].forEach((file) => {
        gallery.push(`/uploads/buildings/${year}/${month}/${file.filename}`);
      });
    }

    if (postalCode.length !== 10) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res.status(400).json({ message: "کد پستی باید 10 رقم باشد." });
    }

    if (numberBuilding) {
      const existingNumberBuilding = await Building.findOne({
        postalCode: postalCode + "_" + numberBuilding,
      });
      if (existingNumberBuilding) {
        if (image) {
          removeUploaded(image); // حذف تصویر
        }

        if (gallery.length > 0) {
          removeAnyUploaded(gallery); // حذف گالری
        }
        return res.status(400).json({
          message: "این ساختمان با این کد پستی را قبلاً ثبت کرده اید.",
        });
      }
    } else {
      const existingBuilding = await Building.findOne({
        postalCode: postalCode,
      });
      if (existingBuilding) {
        if (image) {
          removeUploaded(image); // حذف تصویر
        }

        if (gallery.length > 0) {
          removeAnyUploaded(gallery); // حذف گالری
        }
        return res.status(400).json({
          message: "این ساختمان با این کد پستی را قبلاً ثبت کرده اید.",
        });
      }
    }
    const existingProvince = await Province.findOne({
      name: province,
    });
    if (!existingProvince) {
      return res.status(400).json({ message: "استان انتخاب شده وجود ندارد." });
    }

    const existingCounty = await County.findOne({
      name: county,
    });
    if (!existingCounty) {
      return res
        .status(400)
        .json({ message: "شهرستان انتخاب شده وجود ندارد." });
    }

    // image = image; // اضافه کردن تصویر به داده‌ها
    // gallery = gallery; // اضافه کردن گالری به داده‌ها

    const newBuilding = new Building({
      _id: numberBuilding ? postalCode + "_" + numberBuilding : postalCode,
      site,
      province,
      county,
      city,
      name,
      description,
      number,
      address,
      postalCode: numberBuilding
        ? postalCode + "_" + numberBuilding
        : postalCode,
      division,
      type,
      usage,
      longitude,
      latitude,
      meterage,
      ownership,
      floors,
      image,
      gallery,
      landArea,
      builtArea,
      priority,
      numberBuilding,
    });

    await newBuilding.save();
    res.status(201).json({
      message: "ساختمان جدید اضافه شد.",
      building: newBuilding,
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
      .json({ message: "خطا در ایجاد ساختمان", error: error.message });
  }
};

exports.getBuildings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const buildings = await Building.find()
      .select("-address -meterage -number -description -latitude -longitude")
      .sort({
        createdAt: -1,
      })
      .populate("site", "name postalCode")
      .populate("division", "faName code")
      .populate("province", "name faName code")
      .populate("county", "name faName code")
      .populate("city", "name faName code")
      .skip(skip)
      .limit(limit);

    const totalBuildings = await Building.countDocuments();

    const data = {
      data: buildings,
      total: totalBuildings,
      totalPages: Math.ceil(totalBuildings / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست ساختمان ها",
      error: error.message,
    });
  }
};

exports.getBuildingsWithRoles = async (req, res) => {
  try {
    const user = req.employee;
    const MHQO = user?.roles === "MHQO";
    const MPO = user?.roles === "MPO";

    const type = req.query.type;
    const province = req.query.province;
    const search = req.query.search;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    let searchConditions = {};
    if (MHQO && type) searchConditions.type = type;
    if (MHQO && province) searchConditions.province = province;
    if (MPO) searchConditions.type = "province";
    if (MPO) searchConditions.province = user.province;

    if (search) {
      const normalize = (str) =>
        str
          .replace(/\s+/g, "")
          .replace(/\u200C/g, "")
          .toLowerCase();

      const keywords = search
        .trim()
        .split(/\s+/)
        .map((k) => normalize(k));

      searchConditions.$and = keywords.map((word) => {
        const pattern = word.split("").join("\\s*");
        return {
          $or: [
            { name: { $regex: pattern, $options: "i" } },
            { postalCode: { $regex: search } },
          ],
        };
      });
    }

    const buildings = await Building.find(searchConditions)
      .select(
        "-address -meterage -number -description -latitude -longitude -landArea -builtArea -floors -gallery -ownership -updatedAt -createdAt -__v",
      )
      .sort({
        type: 1,
        priority: 1,
        name: -1,
      })
      .populate("site", "name postalCode")
      .populate("division", "faName code")
      .populate("province", "name faName code")
      .populate("county", "name faName code")
      .populate("city", "name faName code")
      .skip(skip)
      .limit(limit);

    const totalBuildings = await Building.countDocuments(searchConditions);
    const data = {
      data: buildings,
      total: totalBuildings,
      totalPages: Math.ceil(totalBuildings / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست ساختمان ها",
      error: error.message,
    });
  }
};

exports.getBuildingsWithSite = async (req, res) => {
  const { site } = req.params;
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const existingSite = await Building.findOne({ postalCode: site });
    if (!existingSite)
      return res.status(404).json({ message: "سایت مورد نظر یافت نشد" });

    const buildings = await Building.find({ site })
      .select("-address -meterage -number -description -latitude -longitude")
      .sort({
        createdAt: -1,
      })
      .populate("site", "name postalCode")
      .populate("division", "faName code")
      .populate("province", "name faName code")
      .populate("county", "name faName code")
      .populate("city", "name faName code")
      .skip(skip)
      .limit(limit);

    const totalBuildings = await Building.countDocuments();

    const data = {
      data: buildings,
      total: totalBuildings,
      totalPages: Math.ceil(totalBuildings / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست ساختمان ها",
      error: error.message,
    });
  }
};

exports.getBuildingWithPostalCode = async (req, res) => {
  const { postalCode } = req.params;
  try {
    const user = req.employee;

    let building;

    building = await Building.findOne({
      postalCode,
    });
    if (building && building.type !== "province" && user.roles !== "MHQO")
      return res.status(403).json({ message: "شما به این بخش دسترسی ندارید" });

    if (
      building &&
      building.type === "province" &&
      user.roles === "MPO" &&
      user.province !== building.province
    )
      return res.status(403).json({ message: "شما به این بخش دسترسی ندارید" });

    if (user.roles === "MHQO") {
      building = await Building.findOne({
        postalCode,
      })
        .populate("site", "name postalCode")
        .populate("division", "faName code")
        .populate("province", "name faName code")
        .populate("county", "name faName code")
        .populate("city", "name faName code");
    } else if (user.roles === "MPO") {
      building = await Building.findOne({
        postalCode,
        type: "province",
        province: user.province,
      })
        .populate("site", "name postalCode")
        .populate("division", "faName code")
        .populate("province", "name faName code")
        .populate("county", "name faName code")
        .populate("city", "name faName code");
    }

    if (!building)
      return res.status(404).json({ message: "ساختمان مورد نظر یافت نشد" });

    const electricityMeters = await ElectricityMeter.find(
      { building: postalCode },
      "serialNumber billIdentifier",
    );

    const waterMeters = await WaterMeter.find(
      { building: postalCode },
      "serialNumber billIdentifier",
    );

    const gasMeters = await GasMeter.find(
      { building: postalCode },
      "serialNumber billIdentifier",
    );

    const rooms = await Room.find(
      { building: postalCode },
      "name number floor",
    );

    const roomsWithEmployees = await Promise.all(
      rooms.map(async (room) => {
        const employees = await Employee.find(
          { roomNumber: room.number },
          "nationalId firstName lastName",
        );
        return {
          ...room.toObject(),
          employees,
        };
      }),
    );

    res.status(200).json({
      ...building.toObject(),
      electricityMeters,
      waterMeters,
      gasMeters,
      rooms: roomsWithEmployees,
    });

    // res.status(200).json({ ...building.toObject(), electricityMeters, rooms });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات ساختمان",
      error: error.message,
    });
  }
};

exports.getInfoDashboard = async (req, res) => {
  try {
    const result = await Building.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          owner: [{ $match: { ownership: "owner" } }, { $count: "count" }],
          leased: [{ $match: { ownership: "leased" } }, { $count: "count" }],
          other: [{ $match: { ownership: "other" } }, { $count: "count" }],
          special: [
            { $match: { operatorType: "special" } },
            { $count: "count" },
          ],
          hqs: [{ $match: { type: "hqs" } }, { $count: "count" }],
          province: [{ $match: { type: "province" } }, { $count: "count" }],
        },
      },
    ]);

    const data = {
      total: result[0].total[0]?.count || 0,
      ownership: {
        owner: result[0].owner[0]?.count || 0,
        leased: result[0].leased[0]?.count || 0,
        other: result[0].other[0]?.count || 0,
      },
      hqs: result[0].hqs[0]?.count || 0,
      province: result[0].province[0]?.count || 0,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست ساختمان‌ها",
      error: error.message,
    });
  }
};

exports.updateBuilding = async (req, res) => {
  const { postalCode } = req.params;
  const newData = req.body;

  try {
    const building = await Building.findOne({
      postalCode,
    });

    if (!building) {
      return res.status(404).json({ message: "ساختمان یافت نشد." });
    }

    if (postalCode && postalCode !== building.postalCode) {
      const existingBuildingPostalCode = await Building.findOne({
        postalCode,
      });
      if (existingBuildingPostalCode) {
        return res
          .status(400)
          .json({ message: "یک ساختمان با این شماره پلاک قبلاً ثبت شده است." });
      }
    }

    const updatedBuilding = await Building.findOneAndUpdate(
      { postalCode: postalCode },
      newData,
      {
        new: true,
      },
    );

    res.status(200).json({ message: "ساختمان ویرایش شد.", updatedBuilding });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش ساختمان", error: error.message });
  }
};

exports.deleteBuilding = async (req, res) => {
  const { postalCode } = req.params;

  try {
    const building = await Building.findOneAndDelete({
      postalCode,
    });

    if (!building) {
      return res.status(404).json({ message: "ساختمان یافت نشد." });
    }

    const name = building.name;
    res.status(200).json({ message: "ساختمان حذف شد.", name, postalCode });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف ساختمان", error: error.message });
  }
};

exports.searchBuilding = async (req, res) => {
  const { query, county } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const buildings = await Building.find({
      county,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { postalCode: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(buildings);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی ساختمان ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "building";
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
        site,
        province,
        county,
        city,
        name,
        description,
        address,
        number,
        postalCode,
        division,
        type,
        usage,
        longitude,
        latitude,
        meterage,
        ownership,
        floors,
        image,
        gallery,
        landArea,
        builtArea,
        priority,
        numberBuilding,
      } = row;

      const usageArray = usage ? usage.split(",").map((u) => u.trim()) : [];
      const galleryArray = gallery
        ? gallery.split(",").map((u) => u.trim())
        : [];
      await Building.findOneAndUpdate(
        { _id: postalCode },
        {
          site,
          province,
          county,
          city,
          name,
          description,
          address,
          number,
          postalCode,
          division,
          type,
          usage: usageArray,
          longitude,
          latitude,
          meterage,
          ownership,
          floors,
          image,
          gallery: galleryArray,
          landArea,
          builtArea,
          priority,
          numberBuilding,
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
