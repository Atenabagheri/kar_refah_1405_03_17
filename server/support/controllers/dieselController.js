const XLSX = require("xlsx");
const fs = require("fs");
const Building = require("../../general/models/buildingModel");
const Site = require("../../general/models/siteModel");
const Diesel = require("../models/dieselModel");
const convertJalaliToDate = require("../../utils/convertJalaliToDate");
const removeUploaded = require("../../middleware/removeUploaded");
const removeAnyUploaded = require("../../middleware/removeAnyUploaded");

exports.addDiesel = async (req, res) => {
  const {
    building,
    site,
    province,
    county,
    description,
    creator,
    type,
    invoiceNumber,
    documentNumber,
    purchaseDate,
    amount,
    quantity,
  } = req.body;

  const currentDate = new Date();
  const year = currentDate.getFullYear(); // سال فعلی
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // ماه فعلی (01 تا 12)
  const gallery = [];
  let image = null;

  if (req?.files["image"]) {
    image = `/uploads/diesel/${year}/${month}/${req.files["image"][0].filename}`;
  }

  // تنظیم مسیر فایل‌های گالری
  if (req?.files["gallery"]) {
    req.files["gallery"].forEach((file) => {
      gallery.push(`/uploads/diesel/${year}/${month}/${file.filename}`);
    });
  }

  if ((!documentNumber, !purchaseDate || !amount || !quantity)) {
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
        postalCode: building,
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

    const existingDocumentNumber = await Diesel.findOne({
      documentNumber,
    });

    if (existingDocumentNumber) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res
        .status(400)
        .json({ message: "شماره نیاز انتخاب شده قبلا ثبت شده است." });
    }

    const newDiesel = new Diesel({
      _id: documentNumber,
      building,
      site,
      province,
      county,
      description,
      creator,
      type,
      invoiceNumber,
      documentNumber,
      purchaseDate,
      amount,
      quantity,
      // creator: writerAccess.nationalId,
    });

    await newDiesel.save();
    res.status(201).json({
      message: "فاکتور گازوئیل جدید اضافه شد.",
      Diesel: newDiesel,
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
      .json({ message: "خطا در ایجاد فاکتور گازوئیل", error: error.message });
  }
};

exports.getDiesels = async (req, res) => {
  try {
    const user = req.employee;
    const MHQO = user.roles === "MHQO";
    const MPO = user.roles === "MPO";

    const type = req.query.type;
    const province = req.query.province;
    const postalCode = req.query.postalCode;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    let searchConditions = {};
    if (MHQO && type) searchConditions.type = type;
    if (MHQO && province) searchConditions.province = province;
    if (MPO) searchConditions.type = "province";
    if (MPO) searchConditions.province = user.province;

    if (postalCode) {
      searchConditions.building = postalCode;
    }

    const diesels = await Diesel.aggregate([
      { $match: searchConditions },

      // populate building
      {
        $lookup: {
          from: "buildings",
          localField: "building",
          foreignField: "postalCode",
          as: "building",
        },
      },
      { $unwind: "$building" },

      // populate province داخل building
      {
        $lookup: {
          from: "provinces",
          localField: "building.province",
          foreignField: "name",
          as: "building.province",
        },
      },
      {
        $unwind: {
          path: "$building.province",
          preserveNullAndEmptyArrays: true,
        },
      },

      // populate county داخل building
      {
        $lookup: {
          from: "counties",
          localField: "building.county",
          foreignField: "name",
          as: "building.county",
        },
      },
      {
        $unwind: { path: "$building.county", preserveNullAndEmptyArrays: true },
      },

      // populate site
      {
        $lookup: {
          from: "sites",
          localField: "site",
          foreignField: "postalCode",
          as: "site",
        },
      },
      { $unwind: { path: "$site", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 1,
          type: 1,
          amount: 1, // مثلا مقدار فاکتور
          documentNumber: 1,
          purchaseDate: 1,
          quantity: 1,
          createdAt: 1,
          building: {
            name: 1,
            postalCode: 1,
            priority: 1,
            address: 1,
            province: { faName: 1 },
            county: { faName: 1 },
          },
          site: {
            name: 1,
            postalCode: 1,
            province: { faName: 1 },
            county: { faName: 1 },
          },
        },
      },

      // صفحه‌بندی و مرتب‌سازی فاکتورها
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalDiesels = await Diesel.countDocuments(searchConditions);

    const buildingConditions = {};

    if (MPO) {
      buildingConditions.type = "province";
      buildingConditions.province = user.province;
    }

    const uniqueBuildings = await Diesel.aggregate([
      { $match: buildingConditions },
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
        $group: {
          _id: "$building._id",
          name: { $first: "$building.name" },
          postalCode: { $first: "$building.postalCode" },
          priority: { $first: "$building.priority" },
        },
      },
      { $sort: { priority: 1 } },
    ]);

    const data = {
      data: diesels, // فاکتورها
      buildings: uniqueBuildings, // لیست ساختمان‌هایی که حداقل یک فاکتور دارن
      total: totalDiesels,
      totalPages: Math.ceil(totalDiesels / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست فاکتور گازوئیل",
      error: error.message,
    });
  }
};

exports.getDieselWithDocumentNumber = async (req, res) => {
  const { documentNumber } = req.params;
  try {
    const existingDiesel = await Diesel.findOne({ documentNumber })
      .populate("province", "faName")
      .populate("county", "faName")
      .populate("building", "postalCode name address")
      .populate("site", "postalCode name");

    if (!existingDiesel) {
      return res
        .status(400)
        .json({ message: "شماره نیاز انتخاب شده وجود ندارد." });
    }

    res.status(200).json(existingDiesel);
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.updateDieselWithDocumentNumber = async (req, res) => {
  const { documentNumber } = req.params;
  try {
    const updateData = req.body;
    const existingDiesel = await Diesel.findOne({ documentNumber });

    if (!existingDiesel) {
      return res
        .status(400)
        .json({ message: "اطلاعات درخواست شده وجود ندارد." });
    }

    const updatedDiesel = await Diesel.findOneAndUpdate(
      { documentNumber: documentNumber },
      updateData,
      {
        new: true,
      },
    );

    res.status(200).json({ message: "اطلاعات ویرایش شد.", updatedDiesel });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteDiesel = async (req, res) => {
  const { documentNumber } = req.params;

  try {
    const existingDiesel = await Diesel.findOne({
      documentNumber,
    });

    if (!existingDiesel) {
      return res
        .status(400)
        .json({ message: "شماره نیاز انتخاب شده وجود ندارد." });
    }

    const diesel = await Diesel.findOneAndDelete({
      documentNumber,
    });

    res.status(200).json({ message: "اطلاعات فاکتور گازوئیل حذف شد.", diesel });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف فاکتور گازوئیل", error: error.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "diesel";
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
        province,
        county,
        description,
        creator,
        type,
        invoiceNumber,
        documentNumber,
        purchaseDate,
        amount,
        quantity,
      } = row;

      const date = convertJalaliToDate(purchaseDate);
      await Diesel.findOneAndUpdate(
        { _id: documentNumber },
        {
          building,
          site,
          province,
          county,
          description,
          creator,
          type,
          invoiceNumber,
          documentNumber,
          purchaseDate: date,
          amount,
          quantity,
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
