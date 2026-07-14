const Vehicle = require("../../support/models/vehicleModel");
const VehicleType = require("../../support/models/vehicleTypeModel");
const Building = require("../../general/models/buildingModel");
const ElectricityMeter = require("../../energy/models/electricityMeterModel");
const WaterMeter = require("../../support/models/waterMeterModel");
const GasMeter = require("../../support/models/gasMeterModel");
const Asset = require("../../general/models/assetModel");
const AssetCategory = require("../../general/models/assetCategoryModel");
const Province = require("../../general/models/provinceModel");
const County = require("../../general/models/countyModel");

exports.getDashboardInfo = async (req, res) => {
  try {
    // دریافت آمار هر بخش
    const [vehicles, meters, buildings, assets] = await Promise.all([
      getVehicleStats(),
      getMeterStats(),
      getBuildingStats(),
      getAssetStats(),
    ]);

    res.status(200).json({
      vehicles,
      meters,
      buildings,
      assets,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات داشبورد",
      error: error.message,
    });
  }
};

// 🔹 تابع آمار وسایل نقلیه
async function getVehicleStats() {
  const total = await Vehicle.countDocuments();

  const vehicleTypes = await VehicleType.find().lean().sort({ priority: 1 });

  const typeStats = await Promise.all(
    vehicleTypes.map(async (type) => {
      const count = await Vehicle.countDocuments({ vehicleType: type.name });
      return { name: type.name, faName: type.faName, count };
    })
  );

  const [general, special, hqs, province] = await Promise.all([
    Vehicle.countDocuments({ operatorType: "general" }),
    Vehicle.countDocuments({ operatorType: "special" }),
    Vehicle.countDocuments({ type: "hqs" }),
    Vehicle.countDocuments({ type: "province" }),
  ]);
  return {
    total,
    byType: typeStats,
    general,
    special,
    hqs,
    province,
  };
}

// 🔹 تابع آمار ساختمان‌ها
async function getBuildingStats() {
  const [total, owner, leased, other, hqs, province, sportsBuildings] =
    await Promise.all([
      Building.countDocuments(),
      Building.countDocuments({ ownership: "owner" }),
      Building.countDocuments({ ownership: "leased" }),
      Building.countDocuments({ ownership: "other" }),
      Building.countDocuments({ type: "hqs" }),
      Building.countDocuments({ type: "province" }),
      Building.find({ usage: "sports" }),
    ]);
  return { total, owner, leased, other, hqs, province, sportsBuildings };
}

// 🔹 تابع آمار کنتورها
async function getMeterStats() {
  const [
    totalElectric,
    totalWater,
    totalGas,
    electricHqs,
    electricProvince,
    waterHqs,
    waterProvince,
    gasHqs,
    gasProvince,
  ] = await Promise.all([
    ElectricityMeter.countDocuments(),
    WaterMeter.countDocuments(),
    GasMeter.countDocuments(),
    ElectricityMeter.countDocuments({ type: "hqs" }),
    ElectricityMeter.countDocuments({ type: "province" }),
    WaterMeter.countDocuments({ type: "hqs" }),
    WaterMeter.countDocuments({ type: "province" }),
    GasMeter.countDocuments({ type: "hqs" }),
    GasMeter.countDocuments({ type: "province" }),
  ]);

  return {
    total: totalElectric + totalWater + totalGas,
    electric: totalElectric,
    water: totalWater,
    gas: totalGas,
    hqs: electricHqs + waterHqs + gasHqs,
    province: electricProvince + waterProvince + gasProvince,
  };
}

// 🔹 تابع آمار وسایل نقلیه
async function getAssetStats() {
  const [totalCategory, total, active, deactive, hqs, province] =
    await Promise.all([
      AssetCategory.countDocuments(),
      Asset.countDocuments(),
      Asset.countDocuments({ isActive: true }),
      Asset.countDocuments({ isActive: false }),
      Asset.countDocuments({ type: "hqs" }),
      Asset.countDocuments({ type: "province" }),
    ]);
  return { totalCategory, total, active, deactive, hqs, province };
}

// 🔹 آمار آخرین مصرف کنتور برق ساختمان
exports.getElectricityMetersWithLastBill = async (req, res) => {
  try {
    const result = await ElectricityMeter.aggregate([
      // مرحله ۱: جوین با قبض‌ها برای پیدا کردن آخرین قبض هر کنتور
      { $match: { type: "hqs" } },
      {
        $lookup: {
          from: "electricitybills",
          localField: "billIdentifier",
          foreignField: "billIdentifier",
          as: "bills",
        },
      },
      { $unwind: { path: "$bills", preserveNullAndEmptyArrays: true } },
      { $sort: { "bills.issueDate": -1 } },
      {
        $group: {
          _id: "$_id",
          billIdentifier: { $first: "$billIdentifier" },
          serialNumber: { $first: "$serialNumber" },
          building: { $first: "$building" },
          site: { $first: "$site" },
          lastBill: { $first: "$bills" },
        },
      },

      // مرحله ۲: جوین با ساختمان‌ها
      {
        $lookup: {
          from: "buildings",
          localField: "building",
          foreignField: "_id",
          as: "buildingData",
        },
      },
      { $unwind: { path: "$buildingData", preserveNullAndEmptyArrays: true } },
      // { $sort: { "building.priority": 1 } },

      // مرحله ۳: جوین با سایت‌ها
      {
        $lookup: {
          from: "sites",
          localField: "site",
          foreignField: "_id",
          as: "siteData",
        },
      },
      { $unwind: { path: "$siteData", preserveNullAndEmptyArrays: true } },

      // مرحله ۴: افزودن فیلدهای name و postalCode بر اساس نوع مرجع (building یا site)
      {
        $addFields: {
          name: {
            $cond: {
              if: { $ifNull: ["$buildingData.name", false] },
              then: "$buildingData.name",
              else: "$siteData.name",
            },
          },
          postalCode: {
            $cond: {
              if: { $ifNull: ["$buildingData.postalCode", false] },
              then: "$buildingData.postalCode",
              else: "$siteData.postalCode",
            },
          },
          priority: {
            $cond: {
              if: { $ifNull: ["$buildingData.priority", false] },
              then: "$buildingData.priority",
              else: "$siteData.priority",
            },
          },
        },
      },

      // مرحله ۵: انتخاب فیلدهای خروجی نهایی
      {
        $project: {
          _id: 0,
          billIdentifier: 1,
          serialNumber: 1,
          name: 1,
          priority: 1,
          postalCode: 1,
          "lastBill.avgCost": 1,
          "lastBill.readingDate": 1,
        },
      },
    ]).sort({ priority: 1, name: 1 });

    // مرحله ۶: تمیزسازی خروجی برای ارسال پاسخ JSON
    const formatted = result.map((item) => ({
      billIdentifier: item.billIdentifier,
      serialNumber: item.serialNumber,
      name: item.name || "—",
      postalCode: item.postalCode || "—",
      readingDate: item.lastBill?.readingDate || 0,
      avgCost: item.lastBill?.avgCost || null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "خطا در دریافت لیست کنتورهای برق",
      error: error.message,
    });
  }
};

// 🔹 آمار آخرین مصرف کنتور آب ساختمان
exports.getWaterMetersWithLastBill = async (req, res) => {
  try {
    const result = await WaterMeter.aggregate([
      { $match: { type: "hqs" } },
      // مرحله ۱: جوین با قبض‌ها برای پیدا کردن آخرین قبض هر کنتور
      {
        $lookup: {
          from: "waterbills",
          localField: "serialNumber",
          foreignField: "serialNumber",
          as: "bills",
        },
      },
      { $unwind: { path: "$bills", preserveNullAndEmptyArrays: true } },
      { $sort: { "bills.currentReading": -1 } },
      {
        $group: {
          _id: "$_id",
          serialNumber: { $first: "$serialNumber" },
          building: { $first: "$building" },
          site: { $first: "$site" },
          lastBill: { $first: "$bills" },
        },
      },

      // مرحله ۲: جوین با ساختمان‌ها
      {
        $lookup: {
          from: "buildings",
          localField: "building",
          foreignField: "_id",
          as: "buildingData",
        },
      },
      { $unwind: { path: "$buildingData", preserveNullAndEmptyArrays: true } },

      // مرحله ۳: جوین با سایت‌ها
      {
        $lookup: {
          from: "sites",
          localField: "site",
          foreignField: "_id",
          as: "siteData",
        },
      },
      { $unwind: { path: "$siteData", preserveNullAndEmptyArrays: true } },

      // مرحله ۴: افزودن فیلدهای name و postalCode بر اساس نوع مرجع (building یا site)
      {
        $addFields: {
          name: {
            $cond: {
              if: { $ifNull: ["$buildingData.name", false] },
              then: "$buildingData.name",
              else: "$siteData.name",
            },
          },
          postalCode: {
            $cond: {
              if: { $ifNull: ["$buildingData.postalCode", false] },
              then: "$buildingData.postalCode",
              else: "$siteData.postalCode",
            },
          },
          priority: {
            $cond: {
              if: { $ifNull: ["$buildingData.priority", false] },
              then: "$buildingData.priority",
              else: "$siteData.priority",
            },
          },
        },
      },

      // مرحله ۵: انتخاب فیلدهای خروجی نهایی
      {
        $project: {
          _id: 0,
          serialNumber: 1,
          name: 1,
          postalCode: 1,
          priority: 1,
          "lastBill.totalPeriod": 1,
          "lastBill.period": 1,
        },
      },
    ]).sort({ priority: 1, name: 1 });

    // مرحله ۶: تمیزسازی خروجی برای ارسال پاسخ JSON
    const formatted = result.map((item) => ({
      serialNumber: item.serialNumber,
      name: item.name || "—",
      postalCode: item.postalCode || "—",
      totalPeriod: item.lastBill?.totalPeriod || 0,
      period: item.lastBill?.period || null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "خطا در دریافت لیست کنتورهای آب",
      error: error.message,
    });
  }
};

// 🔹 آمار آخرین مصرف کنتور گاز ساختمان
exports.getGasMetersWithLastBill = async (req, res) => {
  try {
    const result = await GasMeter.aggregate([
      { $match: { type: "hqs" } },
      // مرحله ۱: جوین با قبض‌ها برای پیدا کردن آخرین قبض هر کنتور
      {
        $lookup: {
          from: "gasbills",
          localField: "serialNumber",
          foreignField: "serialNumber",
          as: "bills",
        },
      },
      { $unwind: { path: "$bills", preserveNullAndEmptyArrays: true } },
      { $sort: { "bills.currentReading": -1 } },
      {
        $group: {
          _id: "$_id",
          serialNumber: { $first: "$serialNumber" },
          building: { $first: "$building" },
          site: { $first: "$site" },
          lastBill: { $first: "$bills" },
        },
      },

      // مرحله ۲: جوین با ساختمان‌ها
      {
        $lookup: {
          from: "buildings",
          localField: "building",
          foreignField: "_id",
          as: "buildingData",
        },
      },
      { $unwind: { path: "$buildingData", preserveNullAndEmptyArrays: true } },

      // مرحله ۳: جوین با سایت‌ها
      {
        $lookup: {
          from: "sites",
          localField: "site",
          foreignField: "_id",
          as: "siteData",
        },
      },
      { $unwind: { path: "$siteData", preserveNullAndEmptyArrays: true } },

      // مرحله ۴: افزودن فیلدهای name و postalCode بر اساس نوع مرجع (building یا site)
      {
        $addFields: {
          name: {
            $cond: {
              if: { $ifNull: ["$buildingData.name", false] },
              then: "$buildingData.name",
              else: "$siteData.name",
            },
          },
          postalCode: {
            $cond: {
              if: { $ifNull: ["$buildingData.postalCode", false] },
              then: "$buildingData.postalCode",
              else: "$siteData.postalCode",
            },
          },
          priority: {
            $cond: {
              if: { $ifNull: ["$buildingData.priority", false] },
              then: "$buildingData.priority",
              else: "$siteData.priority",
            },
          },
        },
      },

      // مرحله ۵: انتخاب فیلدهای خروجی نهایی
      {
        $project: {
          _id: 0,
          serialNumber: 1,
          name: 1,
          postalCode: 1,
          priority: 1,
          "lastBill.totalPeriod": 1,
          "lastBill.period": 1,
        },
      },
    ]).sort({ priority: 1, name: 1 });

    // مرحله ۶: تمیزسازی خروجی برای ارسال پاسخ JSON
    const formatted = result.map((item) => ({
      serialNumber: item.serialNumber,
      name: item.name || "—",
      postalCode: item.postalCode || "—",
      totalPeriod: item.lastBill?.totalPeriod || 0,
      period: item.lastBill?.period || null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "خطا در دریافت لیست کنتورهای گاز",
      error: error.message,
    });
  }
};


// 🔹 جزئیات استان
exports.getProvinceDetails = async (req, res) => {
  try {
    const { provinceName } = req.params;

    const [buildings, vehicles, meters] = await Promise.all([
      getProvinceBuildingStats({ provinceName }),
      getProvinceVehicleStats({ provinceName }),
      getProvinceMeterStats({ provinceName }),
    ]);

    const province = await Province.findOne({ name: provinceName });

    const totalCounty = await County.countDocuments({
      provinceName: provinceName,
    });

    const sportsBuildings = await Building.find({
      type: "province",
      province: provinceName,
      usage: "sports",
    });

    res.status(200).json({
      info: { ...province.toObject(), totalCounty },
      buildings,
      sportsBuildings,
      vehicles,
      meters,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "خطا در دریافت اطلاعات استان",
      error: error.message,
    });
  }
};

async function getProvinceBuildingStats({ provinceName }) {
  const [total, owner, leased, other] = await Promise.all([
    Building.countDocuments({ type: "province", province: provinceName }),
    Building.countDocuments({
      type: "province",
      province: provinceName,
      ownership: "owner",
    }),
    Building.countDocuments({
      type: "province",
      province: provinceName,
      ownership: "leased",
    }),
    Building.countDocuments({
      type: "province",
      province: provinceName,
      ownership: "other",
    }),
  ]);
  return { total, owner, leased, other };
}

async function getProvinceVehicleStats({ provinceName }) {
  const total = await Vehicle.countDocuments({ province: provinceName });

  const vehicleTypes = await VehicleType.find().lean().sort({ priority: 1 });

  const typeStats = await Promise.all(
    vehicleTypes.map(async (type) => {
      const count = await Vehicle.countDocuments({
        province: provinceName,
        vehicleType: type.name,
      });
      return { name: type.name, faName: type.faName, count };
    })
  );

  const [general, special] = await Promise.all([
    Vehicle.countDocuments({
      province: provinceName,
      operatorType: "general",
    }),
    Vehicle.countDocuments({
      province: provinceName,
      operatorType: "special",
    }),
  ]);
  return { total, byType: typeStats, general, special };
}

async function getProvinceMeterStats({ provinceName }) {
  const building = await Building.find({
    type: "province",
    province: provinceName,
  });

  const postalCode = building.map((b) => b.postalCode);

  const [totalElectric, totalWater, totalGas] = await Promise.all([
    building
      ? ElectricityMeter.countDocuments({
          type: "province",
          building: { $in: postalCode },
        })
      : 0,
    building
      ? WaterMeter.countDocuments({
          type: "province",
          building: { $in: postalCode },
        })
      : 0,
    building
      ? GasMeter.countDocuments({
          type: "province",
          building: { $in: postalCode },
        })
      : 0,
  ]);

  return {
    total: totalElectric + totalWater + totalGas,
    totalElectric,
    totalWater,
    totalGas,
  };
}
