const XLSX = require("xlsx");
const fs = require("fs");
const Vehicle = require("../models/vehicleModel");
const VehicleBrand = require("../models/vehicleBrandModel");
const Insurance = require("../models/insuranceModel");
const Maintenance = require("../models/maintenanceModel");
const removeUploaded = require("../../middleware/removeUploaded");
const removeAnyUploaded = require("../../middleware/removeAnyUploaded");

exports.addVehicle = async (req, res) => {
  const {
    creator,
    type,
    vehicleType,
    brand,
    model,
    year,
    vin,
    engineNumber,
    licensePlate,
    color,
    fuelType,
    transmission,
    engineCapacity,
    horsepower,
    seats,
    doors,
    mileage,
    status,
    price,
    description,
    wheelman,
    operatorType,
    operatorSpecial,
    operatorGeneral,
    province,
    county,
  } = req.body;

  if (!type || !brand || !model || !vin || !licensePlate || !engineNumber) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear(); // سال فعلی
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // ماه فعلی (01 تا 12)
    const gallery = [];
    let image = null;

    if (req.files["image"]) {
      image = `/uploads/vehicles/${year}/${month}/${req.files["image"][0].filename}`;
    }

    // تنظیم مسیر فایل‌های گالری
    if (req.files["gallery"]) {
      req.files["gallery"].forEach((file) => {
        gallery.push(`/uploads/vehicles/${year}/${month}/${file.filename}`);
      });
    }

    const existingVin = await Vehicle.findOne({
      vin,
    });

    if (existingVin) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res
        .status(400)
        .json({ message: "وسیله نقلیه با این شماره شاسی قبلا ثبت شده است." });
    }

    const existingEngineNumber = await Vehicle.findOne({
      engineNumber,
    });

    if (existingEngineNumber) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res
        .status(400)
        .json({ message: "وسیله نقلیه با این شماره موتور قبلا ثبت شده است." });
    }

    const existingVehicleBrand = await VehicleBrand.findOne({
      name: brand,
    });

    if (!existingVehicleBrand) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res
        .status(400)
        .json({ message: "برند وسیله نقلیه با این نام وجود ندارد." });
    }

    const newVehicle = new Vehicle({
      _id: vin,
      creator,
      type,
      vehicleType,
      brand,
      model,
      year,
      vin,
      engineNumber,
      licensePlate,
      color,
      fuelType,
      transmission,
      engineCapacity,
      horsepower,
      seats,
      doors,
      mileage,
      status,
      price,
      image,
      gallery,
      description,
      wheelman,
      operatorType,
      operatorSpecial,
      operatorGeneral,
      province,
      county,
      image,
      gallery,
    });

    await newVehicle.save();
    res.status(201).json({
      message: "وسیله نقلیه جدید اضافه شد.",
      Vehicle: newVehicle,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد وسیله نقلیه", error: error.message });
  }
};

exports.getVehicles = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const province = req.query.province;

  const skip = (page - 1) * limit;
  try {
    const vehicles = await Vehicle.find(province)
      .select(
        "model color vin engineNumber licensePlate wheelman operatorType operatorSpecial operatorGeneral vehicleType",
      )
      .populate("wheelman", "firstName lastName nationalId")
      .populate("operatorSpecial", "firstName lastName nationalId")
      .populate("operatorGeneral", "code faName")
      .populate("vehicleType", "faName")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const totalVehicles = await Vehicle.countDocuments(province);

    const data = {
      data: vehicles,
      total: totalVehicles,
      totalPages: Math.ceil(totalVehicles / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست وسایل نقلیه",
      error: error.message,
    });
  }
};

exports.getVehicleWithVin = async (req, res) => {
  const { vin } = req.params;

  try {
    const user = req.employee;
    const MHQO = user?.roles === "MHQO";
    const MPO = user?.roles === "MPO";

    const vehicle = await Vehicle.findOne({
      vin,
    })
      .populate("brand", "name faName")
      .populate("vehicleType", "name faName")
      .populate("wheelman", "firstName lastName nationalId")
      .populate({
        path: "operatorSpecial",
        model: "Employee",
        select: "firstName lastName nationalId positionCode",
        populate: {
          path: "positionCode",
          model: "Position",
          select: "title code",
        },
      })
      .populate("operatorGeneral", "code faName")
      .sort({
        createdAt: -1,
      });

    if (
      (vehicle && vehicle.type !== "province" && user.roles !== "MHQO") ||
      (vehicle &&
        vehicle.type === "province" &&
        user.roles === "MPO" &&
        vehicle.province !== user.province)
    )
      return res.status(403).json({ message: "شما به این بخش دسترسی ندارید" });

    if (!vehicle) {
      return res
        .status(400)
        .json({ message: "وسیله نقلیه انتخاب شده وجود ندارد." });
    }

    const insurance = await Insurance.find({ vehicle: vin });
    const maintenance = await Maintenance.find({ vehicle: vin });

    res.status(200).json({ vehicle, insurance, maintenance });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست وسایل نقلیه",
      error: error.message,
    });
  }
};

exports.getVehiclesWithBrand = async (req, res) => {
  const { brandName } = req.params;
  try {
    const existingVehicleBrand = await VehicleBrand.findOne({
      name: brandName,
    });

    if (!existingVehicleBrand) {
      return res
        .status(400)
        .json({ message: "برند وسیله نقلیه با این نام وجود ندارد." });
    }

    const existingVehicles = await Vehicle.find({
      brand: brandName,
    })
      .populate("brand", "name faName")
      .populate("wheelman", "firstName lastName nationalId")
      .populate("operatorSpecial", "firstName lastName nationalId")
      .populate("operatorGeneral", "code faName")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(existingVehicles);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست وسایل نقلیه",
      error: error.message,
    });
  }
};

exports.updateVehicleWithVin = async (req, res) => {
  const { vin } = req.params;

  try {
    const newData = req.body;
    const existingVehicle = await Vehicle.findOne({
      vin,
    });

    if (!existingVehicle) {
      return res
        .status(400)
        .json({ message: "وسیله نقلیه انتخاب شده وجود ندارد." });
    }

    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { vin: vin },
      newData,
      {
        new: true,
      },
    );

    res.status(200).json({ message: "اطلاعات ویرایش شد.", updatedVehicle });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  const { vin } = req.params;

  try {
    const existingVehicle = await Vehicle.findOne({
      vin,
    });

    if (!existingVehicle) {
      return res
        .status(400)
        .json({ message: "وسیله نقلیه انتخاب شده وجود ندارد." });
    }

    const vehicle = await Vehicle.findOneAndDelete({
      vin,
    });

    res.status(200).json({ message: "اطلاعات وسیله نقلیه حذف شد.", vehicle });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف وسیله نقلیه", error: error.message });
  }
};

exports.getVehiclesWithType = async (req, res) => {
  const user = req.employee;
  const MHQO = user?.roles === "MHQO";
  const MPO = user?.roles === "MPO";

  const type = req.query.type;
  const province = req.query.province;
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
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
            { vin: { $regex: pattern, $options: "i" } },
            { model: { $regex: pattern, $options: "i" } },
            { licensePlate: { $regex: pattern, $options: "i" } },
            { engineNumber: { $regex: pattern, $options: "i" } },
          ],
        };
      });
    }

    const vehicles = await Vehicle.find(searchConditions)
      .select(
        "model color vin engineNumber licensePlate wheelman operatorType operatorSpecial operatorGeneral vehicleType",
      )
      .populate("wheelman", "firstName lastName nationalId")
      .populate("operatorSpecial", "firstName lastName nationalId")
      .populate("operatorGeneral", "code faName")
      .populate("vehicleType", "faName")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const totalVehicles = await Vehicle.countDocuments(searchConditions);

    const data = {
      data: vehicles,
      total: totalVehicles,
      totalPages: Math.ceil(totalVehicles / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست وسایل نقلیه",
      error: error.message,
    });
  }
};

exports.getInfoDashboard = async (req, res) => {
  try {
    const result = await Vehicle.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          general: [
            { $match: { operatorType: "general" } },
            { $count: "count" },
          ],
          special: [
            { $match: { operatorType: "special" } },
            { $count: "count" },
          ],
          carType: [{ $match: { vehicleType: "car" } }, { $count: "count" }],
          pickupType: [
            { $match: { vehicleType: "pickup" } },
            { $count: "count" },
          ],
          hqs: [{ $match: { type: "hqs" } }, { $count: "count" }],
          province: [{ $match: { type: "province" } }, { $count: "count" }],
        },
      },
    ]);

    const data = {
      total: result[0].total[0]?.count || 0,
      general: result[0].general[0]?.count || 0,
      special: result[0].special[0]?.count || 0,
      carType: result[0].carType[0]?.count || 0,
      pickupType: result[0].pickupType[0]?.count || 0,
      hqs: result[0].hqs[0]?.count || 0,
      province: result[0].province[0]?.count || 0,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست وسایل نقلیه",
      error: error.message,
    });
  }
};

exports.searchVehicle = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const vehicles = await Vehicle.find({
      $or: [
        { vin: { $regex: query, $options: "i" } },
        { licensePlate: { $regex: query, $options: "i" } },
      ],
    }).select("vin image model licensePlate");

    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی خوردو ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "vehicle";
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
        creator,
        type,
        vehicleType,
        brand,
        model,
        year,
        vin,
        engineNumber,
        licensePlate,
        color,
        fuelType,
        transmission,
        engineCapacity,
        horsepower,
        seats,
        doors,
        mileage,
        employee,
        status,
        price,
        image,
        gallery,
        description,
        wheelman,
        operatorType,
        operatorSpecial,
        operatorGeneral,
        province,
        county,
      } = row;

      const galleryArray = gallery
        ? gallery.split(",").map((u) => u.trim())
        : [];

      await Vehicle.findOneAndUpdate(
        { _id: vin },
        {
          creator,
          type,
          vehicleType,
          brand,
          model,
          year,
          vin,
          engineNumber,
          licensePlate,
          color,
          fuelType,
          transmission,
          engineCapacity,
          horsepower,
          seats,
          doors,
          mileage,
          employee,
          status,
          price,
          image,
          gallery: galleryArray,
          description,
          wheelman,
          operatorType,
          operatorSpecial,
          operatorGeneral,
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
