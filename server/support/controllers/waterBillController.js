const XLSX = require("xlsx");
const fs = require("fs");
const WaterBill = require("../models/waterBillModel");
const WaterMeter = require("../models/waterMeterModel");
const convertJalaliToDate = require("../../utils/convertJalaliToDate");
const removeUploaded = require("../../middleware/removeUploaded");
const removeAnyUploaded = require("../../middleware/removeAnyUploaded");

exports.addWaterBill = async (req, res) => {
  const {
    serialNumber, // شماره بدنه قبض‌
    billIdentifier, // شناسه پرداخت
    paymentIdentifier, // شناسه قبض
    totalBillDebt, // مبلغ پرداخت
    totalPeriod,
    averageThirtyDay,
    totalDays,
    paymentDeadLine,
    currentReading,
    previousReading,
    period,
    description,
    creator,
  } = req.body;

  const currentDate = new Date();
  const year = currentDate.getFullYear(); // سال فعلی
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // ماه فعلی (01 تا 12)
  const gallery = [];
  let image = null;

  if (req?.files["image"]) {
    image = `/uploads/water-bill/${year}/${month}/${req.files["image"][0].filename}`;
  }

  // تنظیم مسیر فایل‌های گالری
  if (req?.files["gallery"]) {
    req.files["gallery"].forEach((file) => {
      gallery.push(`/uploads/water-bill/${year}/${month}/${file.filename}`);
    });
  }

  if (
    !serialNumber ||
    !billIdentifier ||
    !paymentIdentifier ||
    !totalBillDebt
  ) {
    if (image) {
      removeUploaded(image); // حذف تصویر
    }

    if (gallery.length > 0) {
      removeAnyUploaded(gallery); // حذف گالری
    }
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    const existingPaymentIdentifier = await WaterBill.findOne({
      paymentIdentifier,
    });

    if (existingPaymentIdentifier) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res
        .status(400)
        .json({ message: "شناسه پرداخت انتخاب شده قبلا ثبت شده است." });
    }

    const existingSerialNumber = await WaterMeter.findOne({
      serialNumber,
    });

    if (!existingSerialNumber) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res
        .status(400)
        .json({ message: "شماره قبض‌ انتخاب شده وجود ندارد." });
    }

    const newWaterBill = new WaterBill({
      _id: paymentIdentifier,
      serialNumber, // شماره بدنه قبض‌
      billIdentifier, // شناسه قبض
      paymentIdentifier, // پرداخت قبض
      totalBillDebt, // مبلغ پرداخت
      totalPeriod,
      averageThirtyDay,
      totalDays,
      paymentDeadLine,
      currentReading,
      previousReading,
      period,
      description,
      creator,
      image,
      gallery,
      // creator: writerAccess.nationalId,
    });

    await newWaterBill.save();
    res.status(201).json({
      message: "قبض‌ آب جدید اضافه شد.",
      WaterBill: newWaterBill,
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
      .json({ message: "خطا در ایجاد قبض‌ آب", error: error.message });
  }
};
// دریافت لیست همه قبض ها
exports.getWaterBills = async (req, res) => {
  try {
    const waterBill = await WaterBill.find()
      .populate("serialNumber", "serialNumber description")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(waterBill);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های آب",
      error: error.message,
    });
  }
};
// دریافت همه قبض ها مرتبط با یک کنتور
exports.getWaterBillsWithSerialNumber = async (req, res) => {
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

    const waterBills = await WaterBill.find({ serialNumber })
      .populate("serialNumber", "serialNumber description")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(waterBills);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های آب",
      error: error.message,
    });
  }
};
// دریافت اطلاعات یک قبض با شناسه پرداخت قبض
exports.getWaterBillWithPaymentIdentifier = async (req, res) => {
  const { paymentIdentifier } = req.params;
  try {
    const existingWaterBill = await WaterBill.findOne({
      paymentIdentifier,
    })
      .populate({
        path: "serialNumber",
        select: "serialNumber",
        populate: {
          path: "building",
          model: "Building",
          select: "address name",
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
        },
      })
      .populate("creator", "firstName lastName")
      .sort({
        createdAt: -1,
      });

    if (!existingWaterBill) {
      return res
        .status(400)
        .json({ message: "شناسه پرداخت انتخاب شده وجود ندارد." });
    }

    res.status(200).json(existingWaterBill);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های آب",
      error: error.message,
    });
  }
};
// دریافت لیست تاریخ تمام قبض های یک کنتور
exports.getDateWaterBills = async (req, res) => {
  const { billIdentifier } = req.params;

  try {
    const existingWaterMeter = await WaterMeter.findOne({
      billIdentifier,
    })
      .populate("site", "name postalCode")
      .populate("building", "name postalCode")
      .populate("buildingsCover", "name postalCode");

    if (!existingWaterMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    const dateWaterBills = await WaterBill.find({ billIdentifier })
      .select({
        currentReading: 1,
        previousReading: 1,
        period: 1,
        paymentIdentifier: 1,
        totalBillDebt: 1,
        totalPeriod: 1,
        averageThirtyDay: 1,
        totalDays: 1,
      })
      .sort({
        period: -1,
      });

    const groupedByYear = dateWaterBills.reduce((acc, bill) => {
      if (!bill.period) {
        const unknownKey = "unknown";
        if (!acc[unknownKey]) {
          acc[unknownKey] = [];
        }
        acc[unknownKey].push(bill);
        return acc;
      }

      const [year] = bill.period.split("-");
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(bill);
      return acc;
    }, {});

    const result = Object.keys(groupedByYear)
      .sort((a, b) => {
        if (a === "unknown") return 1; // گروه unknown بره آخر
        if (b === "unknown") return -1;
        return b - a; // سال‌ها به صورت نزولی
      })
      .map((year) => ({
        year,
        bills: groupedByYear[year],
      }));

    res.status(200).json({
      result: result,
      site: existingWaterMeter.site,
      building: existingWaterMeter.building,
      buildingsCover: existingWaterMeter.buildingsCover,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های آب",
      error: error.message,
    });
  }
};

exports.updateWaterBillWithPaymentIdentifier = async (req, res) => {
  const { paymentIdentifier } = req.params;

  try {
    const updateData = req.body;
    const existingWaterBill = await WaterBill.findOne({
      paymentIdentifier,
    });

    if (!existingWaterBill) {
      return res
        .status(400)
        .json({ message: "شناسه پرداخت انتخاب شده وجود ندارد." });
    }

    if (
      updateData.serialNumber &&
      updateData.serialNumber !== existingWaterBill.serialNumber
    ) {
      const existingWaterMeter = await WaterMeter.findOne({
        serialNumber: updateData.serialNumber,
      });

      if (!existingWaterMeter) {
        return res
          .status(400)
          .json({ message: "شماره کتور انتخاب شده وجود ندارد." });
      }
    }

    const updatedWaterBill = await WaterBill.findOneAndUpdate(
      { paymentIdentifier: paymentIdentifier },
      updateData,
      {
        new: true,
      },
    );

    res.status(200).json({ message: "اطلاعات ویرایش شد.", updatedWaterBill });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteWaterBill = async (req, res) => {
  const { paymentIdentifier } = req.params;

  try {
    const existingWaterBill = await WaterBill.findOne({
      paymentIdentifier,
    });

    if (!existingWaterBill) {
      return res
        .status(400)
        .json({ message: "شناسه پرداخت انتخاب شده وجود ندارد." });
    }

    const waterBill = await WaterBill.findOneAndDelete({
      paymentIdentifier,
    });

    res.status(200).json({ message: "اطلاعات قبض‌ آب حذف شد.", waterBill });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف قبض‌ آب", error: error.message });
  }
};

exports.getWaterBillsComparison = async (req, res) => {
  const { firstYear, secondYear } = req.query;
  const { billIdentifier } = req.params;
  try {
    if (firstYear === secondYear)
      return res
        .status(400)
        .json({ message: "لطفا دو سال متفاوت ارسال کنید." });

    let sortDate = { firstYear, secondYear };
    if (firstYear > secondYear) {
      sortDate = { firstYear: secondYear, secondYear: firstYear };
    }

    const first = sortDate?.firstYear;
    const second = sortDate?.secondYear;

    const existingWaterMeter = await WaterMeter.findOne({
      billIdentifier,
    });

    if (!existingWaterMeter) {
      return res
        .status(400)
        .json({ message: "شناسه قبض انتخاب شده وجود ندارد." });
    }

    const waterBills = await WaterBill.find({
      billIdentifier,
      period: { $regex: new RegExp(`^(${first}|${second})-`) },
    }).sort({ period: 1 });

    const grouped = {};
    let totalFirstYear = 0;
    let totalSecondYear = 0;

    waterBills.forEach((bill) => {
      const [year, month] = bill.period.split("-");
      const key = month; //  "02", "04", ...
      if (!grouped[key]) {
        grouped[key] = {
          firstPeriod: null,
          firstDays: null,
          secendPeriod: null,
          secendDays: null,
        };
      }

      const consumption = bill.averageThirtyDay * bill.totalDays;
      if (year === first) {
        grouped[key].firstPeriod = bill.averageThirtyDay;
        grouped[key].firstDays = bill.totalDays;

        totalFirstYear += consumption;
      } else if (year === second) {
        grouped[key].secendPeriod = bill.averageThirtyDay;
        grouped[key].secendDays = bill.totalDays;

        totalSecondYear += consumption;
      }
    });

    const formattedData = Object.keys(grouped)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((month, index) => ({
        name: `${first}-${month} / ${second}-${month}`,
        firstPeriod: grouped[month].firstPeriod || 0,
        firstDays: grouped[month].firstDays || 0,

        secendPeriod: grouped[month].secendPeriod || 0,
        secendDays: grouped[month].secendDays || 0,

        label: `${first}-${month} / ${second}-${month}`,
      }));

    res.status(200).json({
      formattedData,
      total: {
        firstYear: {
          year: first,
          value: totalFirstYear,
        },
        secondYear: {
          year: second,
          value: totalSecondYear,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست مقایسه‌ای قبض‌ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "waterBill";
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
        billIdentifier,
        paymentIdentifier,
        totalBillDebt,
        totalPeriod,
        averageThirtyDay,
        totalDays,
        paymentDeadLine,
        currentReading,
        previousReading,
        serialNumber,
        period,
        description,
        creator,
      } = row;
      const deadlineDate = paymentDeadLine
        ? convertJalaliToDate(paymentDeadLine)
        : null;
      const currentDate = convertJalaliToDate(currentReading);
      const previousDate = convertJalaliToDate(previousReading);

      await WaterBill.findOneAndUpdate(
        { _id: paymentIdentifier },
        {
          billIdentifier,
          paymentIdentifier,
          totalBillDebt,
          totalPeriod,
          averageThirtyDay,
          totalDays,
          paymentDeadLine: deadlineDate,
          currentReading: currentDate,
          previousReading: previousDate,
          serialNumber,
          period,
          description,
          creator,
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

