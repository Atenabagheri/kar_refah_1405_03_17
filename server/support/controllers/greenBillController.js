const XLSX = require("xlsx");
const fs = require("fs");
const GreenBill = require("../models/greenBillModel");
const GreenMeter = require("../models/greenMeterModel");
const convertJalaliToDate = require("../../utils/convertJalaliToDate");
const axios = require("axios");
const { fetchBillsFromBargheMan } = require("../../services/bargheMan");

exports.addGreenBill = async (req, res) => {
  const {
    serialNumber, // شماره بدنه قبض‌
    billIdentifier, // شناسه پرداخت
    totalPeriod,
    totalDays,
    currentReading,
    previousReading,
    period,
    description,
    creator,
  } = req.body;

  if (!serialNumber || !billIdentifier) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    const existingBillIdentifier = await GreenBill.findOne({
      billIdentifier,
    });

    if (existingBillIdentifier) {
      return res
        .status(400)
        .json({ message: "شناسه قبض انتخاب شده قبلا ثبت شده است." });
    }

    const existingSerialNumber = await GreenMeter.findOne({
      serialNumber,
    });

    if (!existingSerialNumber) {
      return res
        .status(400)
        .json({ message: "شماره قبض‌ انتخاب شده وجود ندارد." });
    }

    const newGreenBill = new GreenBill({
      _id: billIdentifier + "_" + period,
      serialNumber, // شماره بدنه قبض‌
      billIdentifier, // شناسه قبض
      totalPeriod,
      totalDays,
      currentReading,
      previousReading,
      period,
      description,
      creator,
      // creator: writerAccess.nationalId,
    });

    await newGreenBill.save();
    res.status(201).json({
      message: "قبض‌ برق جدید اضافه شد.",
      GreenBill: newGreenBill,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد قبض‌ برق", error: error.message });
  }
};
// دریافت لیست همه قبض ها
exports.getGreenBills = async (req, res) => {
  try {
    const greenBill = await GreenBill.find()
      .populate("serialNumber", "serialNumber description")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(greenBill);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های برق",
      error: error.message,
    });
  }
};

exports.getBill = async (req, res) => {
  try {
    const { token, payload } = req.body;
    const bills = await fetchBillsFromBargheMan({
      payload,
      token,
    });
    res.json(bills);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// دریافت همه قبض ها مرتبط با یک کنتور
exports.getGreenBillsWithSerialNumber = async (req, res) => {
  const { serialNumber } = req.params;

  try {
    const existingGreenMeter = await GreenMeter.findOne({
      serialNumber,
    });

    if (!existingGreenMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    const greenBills = await GreenBill.find({ serialNumber })
      .populate("serialNumber", "serialNumber description")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(greenBills);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های برق",
      error: error.message,
    });
  }
};

// دریافت اطلاعات یک قبض با شناسه پرداخت قبض
exports.getGreenBillWithPaymentIdentifier = async (req, res) => {
  const { paymentIdentifier } = req.params;
  try {
    const existingGreenBill = await GreenBill.findOne({
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

    if (!existingGreenBill) {
      return res
        .status(400)
        .json({ message: "شناسه پرداخت انتخاب شده وجود ندارد." });
    }

    res.status(200).json(existingGreenBill);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های برق",
      error: error.message,
    });
  }
};

// دریافت لیست تاریخ تمام قبض های یک کنتور
exports.getDateGreenBills = async (req, res) => {
  const { serialNumber } = req.params;

  try {
    const existingGreenMeter = await GreenMeter.findOne({
      serialNumber,
    })
      .populate("site", "name postalCode")
      .populate("building", "name postalCode")
      .populate("buildingsCover", "name postalCode");

    if (!existingGreenMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    const dateGreenBills = await GreenBill.find({ serialNumber })
      .select({
        currentReading: 1,
        previousReading: 1,
        period: 1,
        billIdentifier: 1,
        serialNumber: 1,
        totalPeriod: 1,
        totalDays: 1,
      })
      .sort({
        period: -1,
      });

    const groupedByYear = dateGreenBills.reduce((acc, bill) => {
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
      site: existingGreenMeter.site,
      building: existingGreenMeter.building,
      buildingsCover: existingGreenMeter.buildingsCover,
      billIdentifier: existingGreenMeter.billIdentifier,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های برق",
      error: error.message,
    });
  }
};

exports.updateGreenBillWithPaymentIdentifier = async (req, res) => {
  const { PaymentIdentifier } = req.params;

  try {
    const updateData = req.body;
    const existingGreenBill = await GreenBill.findOne({
      PaymentIdentifier,
    });

    if (!existingGreenBill) {
      return res
        .status(400)
        .json({ message: "شناسه پرداخت انتخاب شده وجود ندارد." });
    }

    if (
      updateData.serialNumber &&
      updateData.serialNumber !== existingGreenBill.serialNumber
    ) {
      const existingGreenMeter = await GreenMeter.findOne({
        serialNumber: updateData.serialNumber,
      });

      if (!existingGreenMeter) {
        return res
          .status(400)
          .json({ message: "شماره کتور انتخاب شده وجود ندارد." });
      }
    }

    const updatedGreenBill = await GreenBill.findOneAndUpdate(
      { PaymentIdentifier: PaymentIdentifier },
      updateData,
      {
        new: true,
      },
    );

    res.status(200).json({ message: "اطلاعات ویرایش شد.", updatedGreenBill });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteGreenBill = async (req, res) => {
  const { _id } = req.params;

  try {
    const existingGreenBill = await GreenBill.findOne({
      _id,
    });

    if (!existingGreenBill) {
      return res
        .status(400)
        .json({ message: "شناسه پرداخت انتخاب شده وجود ندارد." });
    }

    const greenBill = await GreenBill.findOneAndDelete({
      _id,
    });

    res.status(200).json({ message: "اطلاعات قبض‌ برق حذف شد.", greenBill });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف قبض‌ برق", error: error.message });
  }
};

exports.getGreenBillsComparison = async (req, res) => {
  const { firstYear, secondYear } = req.query;
  const { serialNumber } = req.params;
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

    const existingGreenMeter = await GreenMeter.findOne({
      serialNumber,
    });

    if (!existingGreenMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    const greenBills = await GreenBill.find({
      period: { $regex: new RegExp(`^(${first}|${second})-`) },
    }).sort({ period: 1 });

    const grouped = {};

    greenBills.forEach((bill) => {
      const [year, month] = bill.period.split("-");
      const key = month; //  "02", "04", ...
      if (!grouped[key]) {
        grouped[key] = { firstPeriod: null, secendPeriod: null };
      }
      if (year === first) {
        grouped[key].firstPeriod = bill.averageThirtyDay;
      } else if (year === second) {
        grouped[key].secendPeriod = bill.averageThirtyDay;
      }
    });

    const formattedData = Object.keys(grouped)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((month, index) => ({
        name: `${first}-${month} / ${second}-${month}`,
        firstPeriod: grouped[month].firstPeriod || 0,
        secendPeriod: grouped[month].secendPeriod || 0,
        label: `${first}-${month} / ${second}-${month}`,
      }));

    res.status(200).json(formattedData);
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
    const fileName = "greenBill";
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
        totalPeriod,
        totalDays,
        currentReading,
        previousReading,
        serialNumber,
        period,
        description,
        creator,
      } = row;
      const currentDate = convertJalaliToDate(currentReading);
      const previousDate = convertJalaliToDate(previousReading);

      await GreenBill.findOneAndUpdate(
        { _id: billIdentifier + "_" + period },
        {
          billIdentifier,
          totalPeriod,
          totalDays,
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
