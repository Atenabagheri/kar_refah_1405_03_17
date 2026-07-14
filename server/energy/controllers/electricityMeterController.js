const XLSX = require("xlsx");
const fs = require("fs");
const Building = require("../../general/models/buildingModel");
const Site = require("../../general/models/siteModel");
const ElectricityMeter = require("../models/electricityMeterModel");
const removeUploaded = require("../../middleware/removeUploaded");
const removeAnyUploaded = require("../../middleware/removeAnyUploaded");

exports.addElectricityMeter = async (req, res) => {
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
    companyName,
    customerName,
    phase,
    amper,
    serviceAdd,
    tariffTypeName,
  } = req.body;

  const currentDate = new Date();
  const year = currentDate.getFullYear(); // سال فعلی
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // ماه فعلی (01 تا 12)
  const gallery = [];
  let image = null;

  if (req?.files["image"]) {
    image = `/uploads/electricity-meter/${year}/${month}/${req.files["image"][0].filename}`;
  }

  // تنظیم مسیر فایل‌های گالری
  if (req?.files["gallery"]) {
    req.files["gallery"].forEach((file) => {
      gallery.push(
        `/uploads/electricity-meter/${year}/${month}/${file.filename}`,
      );
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
    if (building) {
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

    const existingSerialNumber = await ElectricityMeter.findOne({
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

    const newElectricityMeter = new ElectricityMeter({
      _id: serialNumber,
      building,
      buildingsCover,
      site,
      serialNumber,
      billIdentifier,
      description,
      creator,
      type,
      province,
      county,
      companyName,
      customerName,
      phase,
      amper,
      serviceAdd,
      tariffTypeName,
      image,
      gallery,

      // creator: writerAccess.nationalId,
    });

    await newElectricityMeter.save();
    res.status(201).json({
      message: "کنتور برق جدید اضافه شد.",
      ElectricityMeter: newElectricityMeter,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد کنتور برق", error: error.message });
  }
};

// get electricity meters on server
exports.getElectricityMetersOld = async (req, res) => {
  try {
    const type = req.query.type;
    const province = req.query.province;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    let searchConditions = {};
    if (type) {
      searchConditions.type = type;
    }
    if (province) {
      searchConditions.province = province;
    }

    const electricityMeter = await ElectricityMeter.find(searchConditions)
      .populate("buildingsCover", "name postalCode")
      .populate({
        path: "site",
        model: "Site",
        select: "name postalCode",
        populate: [
          {
            path: "province",
            model: "Province",
            select: "name faName",
          },
          {
            path: "county",
            model: "County",
            select: "name faName",
          },
          {
            path: "city",
            model: "City",
            select: "name faName",
          },
        ],
      })
      .populate({
        path: "building",
        model: "Building",
        select: "name postalCode priority",
        populate: [
          {
            path: "province",
            model: "Province",
            select: "name faName",
          },
          {
            path: "county",
            model: "County",
            select: "name faName",
          },
          {
            path: "city",
            model: "City",
            select: "name faName",
          },
        ],
      })
      .skip(skip)
      .limit(limit)
      .sort({
        createdAt: 1,
      });

    const totalElectricityMeters =
      await ElectricityMeter.countDocuments(searchConditions);

    const data = {
      data: electricityMeter.sort(
        (a, b) => a.building.priority - b.building.priority,
      ),
      total: totalElectricityMeters,
      totalPages: Math.ceil(totalElectricityMeters / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست کنتورهای برق",
      error: error.message,
    });
  }
};

// get electricity meters on database
exports.getElectricityMeters = async (req, res) => {
  try {
    const user = req.employee;
    const MHQO = user.roles === "MHQO";
    const MPO = user.roles === "MPO";

    // 🟢 گرفتن پارامترهای ورودی از query string
    const type = req.query.type;
    const province = req.query.province;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 🟢 محاسبه‌ی تعداد رکوردهایی که باید رد کنیم برای صفحه‌بندی
    const skip = (page - 1) * limit;

    // 🟢 ساخت شرط جستجو برای فیلتر کردن کنتورها
    let searchConditions = {};
    if (MHQO && type) searchConditions.type = type;
    if (MHQO && province) searchConditions.province = province;
    if (MPO) searchConditions.type = "province";
    if (MPO) searchConditions.province = user.province;

    // ⚙️ اجرای aggregate pipeline در MongoDB
    const electricityMeter = await ElectricityMeter.aggregate([
      // 1️⃣ فیلتر اولیه – فقط کنتورهایی که شرایط مورد نظر رو دارن
      { $match: searchConditions },

      // 2️⃣ اتصال (join) با کالکشن ساختمان‌ها
      {
        $lookup: {
          from: "buildings", // اسم collection مربوط به ساختمان‌ها
          localField: "building", // فیلدی از کنتور که اشاره به ساختمان داره
          foreignField: "postalCode", // فیلدی در ساختمان که باید با localField برابر باشه
          as: "building", // اسم فیلدی که نتیجه join درونش ذخیره می‌شه
        },
      },

      // 3️⃣ باز کردن آرایه building تا تبدیل به آبجکت بشه
      { $unwind: "$building" },

      // 4️⃣ اتصال ساختمان به استان (join دوم)
      {
        $lookup: {
          from: "provinces", // اسم collection مربوط به استان‌ها
          localField: "building.province", // مقدار داخل ساختمان که به استان اشاره می‌کنه
          foreignField: "name", // فیلدی در collection استان‌ها برای match شدن
          as: "building.province", // نتیجه در این فیلد قرار می‌گیره
        },
      },

      // 5️⃣ اتصال ساختمان به شهرستان (join سوم)
      {
        $lookup: {
          from: "counties", // collection شهرستان‌ها
          localField: "building.county", // فیلد درون ساختمان که اسم شهرستان رو داره
          foreignField: "name", // فیلد مقصد در collection شهرستان‌ها
          as: "building.county", // نتیجه در این فیلد ذخیره می‌شه
        },
      },

      // 6️⃣ باز کردن نتایج lookup استان و شهرستان (چون آرایه هستن)
      {
        $unwind: {
          path: "$building.province", // مسیر فیلدی که باید باز بشه
          preserveNullAndEmptyArrays: true, // اگر null بود، حذف نکن
        },
      },
      {
        $unwind: {
          path: "$building.county",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 7️⃣ مرتب‌سازی بر اساس priority ساختمان
      { $sort: { "building.type": 1, "building.priority": 1 } }, // 1=صعودی، -1=نزولی

      // 8️⃣ اعمال صفحه‌بندی
      { $skip: skip }, // رد کردن رکوردهای قبلی
      { $limit: limit }, // تعداد رکوردهای مورد نیاز در هر صفحه

      // 9️⃣ انتخاب فیلدهایی که می‌خوای توی خروجی نمایش داده بشن
      {
        $project: {
          _id: 1, // شناسه کنتور
          type: 1, // نوع کنتور
          serialNumber: 1, // سریال کنتور
          billIdentifier: 1, // شناسه قبض
          createdAt: 1, // تاریخ ثبت کنتور

          // فیلدهای مربوط به ساختمان
          "building._id": 1,
          "building.name": 1,
          "building.postalCode": 1,
          "building.priority": 1,

          // فیلدهای مربوط به استان و شهرستان ساختمان
          "building.province.faName": 1,
          "building.county.faName": 1,
        },
      },
    ]);

    // 🔢 محاسبه‌ی کل رکوردها برای صفحه‌بندی (تعداد کل کنتورها)
    const totalElectricityMeters =
      await ElectricityMeter.countDocuments(searchConditions);

    // 📦 آماده‌سازی داده خروجی
    const data = {
      data: electricityMeter, // لیست کنتورهای مرتب‌شده و محدودشده
      total: totalElectricityMeters, // تعداد کل
      totalPages: Math.ceil(totalElectricityMeters / limit), // تعداد صفحات
      currentPage: page, // شماره صفحه فعلی
    };

    // ✅ ارسال پاسخ موفق به کلاینت
    res.status(200).json(data);
  } catch (error) {
    // ❌ در صورت بروز خطا، پاسخ خطا برگردون
    res.status(500).json({
      message: "خطا در دریافت لیست کنتورهای برق",
      error: error.message,
    });
  }
};

exports.getElectricityMeterWithSerialNumber = async (req, res) => {
  const { serialNumber } = req.params;
  try {
    const existingElectricityMeter = await ElectricityMeter.findOne({
      serialNumber,
    })
      .populate("site", "name postalCode")
      .populate("building", "name postalCode")
      .populate("buildingsCover", "name postalCode")
      .sort({
        createdAt: -1,
      });

    if (!existingElectricityMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    res.status(200).json(existingElectricityMeter);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست کنتورهای برق",
      error: error.message,
    });
  }
};

exports.updateElectricityMeterWithSerialNumber = async (req, res) => {
  const { serialNumber } = req.params;

  try {
    const updateData = req.body;
    const existingElectricityMeter = await ElectricityMeter.findOne({
      serialNumber,
    });

    if (!existingElectricityMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    if (
      updateData.building &&
      updateData.building !== existingElectricityMeter.building
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

    const updatedElectricityMeter = await ElectricityMeter.findOneAndUpdate(
      { serialNumber: serialNumber },
      updateData,
      {
        new: true,
      },
    );

    // await existingElectricityMeter.updateOne(
    //   updateData,
    //   {
    //     new: true,
    //   }
    // );

    res
      .status(200)
      .json({ message: "اطلاعات ویرایش شد.", updatedElectricityMeter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteElectricityMeter = async (req, res) => {
  const { serialNumber } = req.params;

  try {
    const existingElectricityMeter = await ElectricityMeter.findOne({
      serialNumber,
    });

    if (!existingElectricityMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    const electricityMeter = await ElectricityMeter.findOneAndDelete({
      serialNumber,
    });

    res
      .status(200)
      .json({ message: "اطلاعات کنتور برق حذف شد.", electricityMeter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف کنتور برق", error: error.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "electricityMeter";
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
        buildingsCover,
        site,
        serialNumber,
        billIdentifier,
        description,
        creator,
        type,
        province,
        county,
        companyName,
        customerName,
        phase,
        amper,
        serviceAdd,
        tariffTypeName,
      } = row;
      const buildingsCoverArray = buildingsCover
        ? buildingsCover.split(",").map((b) => b.trim())
        : [];
      await ElectricityMeter.findOneAndUpdate(
        { _id: serialNumber },
        {
          building,
          buildingsCover: buildingsCoverArray,
          site,
          serialNumber,
          billIdentifier,
          description,
          creator,
          type,
          province,
          county,
          companyName,
          customerName,
          phase,
          amper,
          serviceAdd,
          tariffTypeName,
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
