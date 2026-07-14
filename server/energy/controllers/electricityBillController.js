const XLSX = require("xlsx");
const fs = require("fs");
const ElectricityBill = require("../models/electricityBillModel");
const ElectricityMeter = require("../models/electricityMeterModel");
const convertJalaliToDate = require("../../utils/convertJalaliToDate");
const { fetchBillsFromBargheMan } = require("../../services/bargheMan");
const removeUploaded = require("../../middleware/removeUploaded");
const removeAnyUploaded = require("../../middleware/removeAnyUploaded");

exports.addElectricityBill = async (req, res) => {
  const {
    serialNumber, // شماره بدنه قبض‌
    billIdentifier, // شناسه قبض
    creator,
    description,

    avgCost,
    billAmt,
    billType,
    energyAmt,
    grossAmt,
    insuranceAmt,
    issueDate,
    lowCons,
    normalCons,
    patternMessage,
    peakCons,
    powerPaytollAmt,
    prevReadingDate,
    previousEnergyDebit,
    processStatus,
    readingDate,
    salePrd,
    saleYear,
    taxAmt,
    totalDays,
  } = req.body;

  const currentDate = new Date();
  const year = currentDate.getFullYear(); // سال فعلی
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // ماه فعلی (01 تا 12)
  const gallery = [];
  let image = null;

  if (req?.files["image"]) {
    image = `/uploads/electricity-bill/${year}/${month}/${req.files["image"][0].filename}`;
  }

  // تنظیم مسیر فایل‌های گالری
  if (req?.files["gallery"]) {
    req.files["gallery"].forEach((file) => {
      gallery.push(
        `/uploads/electricity-bill/${year}/${month}/${file.filename}`,
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
    const existingPaymentIdentifier = await ElectricityBill.findOne({
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

    const existingSerialNumber = await ElectricityMeter.findOne({
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

    const readingDateWithUnderline = readingDate.replaceAll("/", "_");

    const newElectricityBill = new ElectricityBill({
      _id: `${billIdentifier}_${readingDateWithUnderline}`,
      serialNumber, // شماره کنتور
      billIdentifier, // شناسه قبض
      description,
      creator,

      avgCost, //میانگین مصرف
      billAmt, //مبلغ قابل پرداخت
      billType, //نوع صورتحساب
      energyAmt,
      grossAmt,
      insuranceAmt,
      issueDate, //تاریخ صدور
      lowCons,
      normalCons,
      patternMessage, //الگوی مصرف
      peakCons,
      powerPaytollAmt, //عوارض برق
      prevReadingDate, //از تاریخ
      previousEnergyDebit, //بدهی پیشین
      processStatus, // وضعیت
      readingDate, // تا  تاریخ
      salePrd, // دوره
      saleYear, // سال
      taxAmt, // ارزش افزوده
      totalDays, //تعداد روز
      image,
      gallery,
    });

    await newElectricityBill.save();
    res.status(201).json({
      message: "قبض‌ برق جدید اضافه شد.",
      ElectricityBill: newElectricityBill,
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
      .json({ message: "خطا در ایجاد قبض‌ برق", error: error.message });
  }
};
// دریافت لیست همه قبض ها
exports.getElectricityBills = async (req, res) => {
  try {
    const electricityBill = await ElectricityBill.find()
      .populate("serialNumber", "serialNumber description")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(electricityBill);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های برق",
      error: error.message,
    });
  }
};

exports.getBill = async (req, res) => {
  try {
    const user = req.employee;
    const { tokenApi, payload } = req.body;

    const bills = await fetchBillsFromBargheMan({
      payload,
      token: tokenApi,
    });

    const billIdentifier = payload.bill_identifier;

    for (const bill of bills) {
      const readingDateWithUnderline = bill?.reading_date.replaceAll("/", "_");

      // بررسی اینکه آیا این قبض قبلا ثبت شده یا نه
      const exists = await ElectricityBill.findOne({
        _id: `${billIdentifier}_${readingDateWithUnderline}`,
        billIdentifier,
      });

      if (!exists) {
        const newBill = new ElectricityBill({
          _id: `${billIdentifier}_${readingDateWithUnderline}`,
          creator: user?.nationalId,
          billIdentifier: billIdentifier,

          avgCost: bill.avg_cost,
          billAmt: bill.bill_amt,
          billType: bill.bill_type,
          energyAmt: bill.energy_amt,
          grossAmt: bill.gross_amt,
          insuranceAmt: bill.insurance_amt,
          issueDate: bill.issue_date,
          lowCons: bill.low_cons,
          normalCons: bill.normal_cons,
          patternMessage: bill.pattern_message,
          peakCons: bill.peak_cons,
          powerPaytollAmt: bill.power_paytoll_amt,
          prevReadingDate: bill.prev_reading_date,
          previousEnergyDebit: bill.previous_energy_debit,
          processStatus: bill.process_status,
          readingDate: bill.reading_date,
          salePrd: bill.sale_prd,
          saleYear: bill.sale_year,
          taxAmt: bill.tax_amt,
          totalDays: bill.total_days,
        });

        await newBill.save();
        console.log(`قبض جدید ذخیره شد: ${bill.issue_date}`);
      } else {
        console.log(`قبض قبلا ثبت شده: ${bill.issue_date}`);
      }
    }
    res.status(200).json({ message: "بروزرسانی انجام شد." });
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// دریافت همه قبض ها مرتبط با یک کنتور
exports.getElectricityBillsWithSerialNumber = async (req, res) => {
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

    const electricityBills = await ElectricityBill.find({ serialNumber })
      .populate("serialNumber", "serialNumber description")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(electricityBills);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های برق",
      error: error.message,
    });
  }
};

// دریافت اطلاعات یک قبض با شناسه پرداخت قبض
exports.getElectricityBillWithId = async (req, res) => {
  const { id } = req.params;
  try {
    const existingElectricityBill = await ElectricityBill.findOne({
      _id: id,
    })
      .populate("creator", "firstName lastName")
      .sort({
        createdAt: -1,
      });

    if (!existingElectricityBill) {
      return res
        .status(400)
        .json({ message: "شناسه پرداخت انتخاب شده وجود ندارد." });
    }

    const electricityMeter = await ElectricityMeter.findOne({
      billIdentifier: existingElectricityBill.billIdentifier,
    }).populate({
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
    });
    res
      .status(200)
      .json({ electricityBill: existingElectricityBill, electricityMeter });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های برق",
      error: error.message,
    });
  }
};

// دریافت لیست تاریخ تمام قبض های یک کنتور
exports.getDateElectricityBills = async (req, res) => {
  const { billIdentifier } = req.params;

  try {
    const existingElectricityMeter = await ElectricityMeter.findOne({
      billIdentifier,
    })
      .populate("site", "name postalCode")
      .populate("building", "name postalCode")
      .populate("buildingsCover", "name postalCode");

    if (!existingElectricityMeter) {
      return res
        .status(400)
        .json({ message: "شماره کنتور انتخاب شده وجود ندارد." });
    }

    const bills = await ElectricityBill.find({
      billIdentifier,
    }).sort({
      salePrd: -1,
    });

    const grouped = bills.reduce((acc, bill) => {
      // const readingDate = bill?.readingDate.split("/");
      // const [year, month, day] = bill.saleYear;

      const year = bill.saleYear;

      if (!acc[year]) acc[year] = [];
      acc[year].push(bill);
      return acc;
    }, {});

    const groupedArray = Object.keys(grouped)
      .sort((a, b) => b - a)
      .map((year) => ({
        year,
        bills: grouped[year],
      }));

    res.status(200).json({
      result: groupedArray,
      site: existingElectricityMeter.site,
      building: existingElectricityMeter.building,
      buildingsCover: existingElectricityMeter.buildingsCover,
    });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست قبض‌های برق",
      error: error.message,
    });
  }
};

exports.updateElectricityBillWithPaymentIdentifier = async (req, res) => {
  const { PaymentIdentifier } = req.params;

  try {
    const updateData = req.body;
    const existingElectricityBill = await ElectricityBill.findOne({
      PaymentIdentifier,
    });

    if (!existingElectricityBill) {
      return res
        .status(400)
        .json({ message: "شناسه پرداخت انتخاب شده وجود ندارد." });
    }

    if (
      updateData.serialNumber &&
      updateData.serialNumber !== existingElectricityBill.serialNumber
    ) {
      const existingElectricityMeter = await ElectricityMeter.findOne({
        serialNumber: updateData.serialNumber,
      });

      if (!existingElectricityMeter) {
        return res
          .status(400)
          .json({ message: "شماره کتور انتخاب شده وجود ندارد." });
      }
    }

    const updatedElectricityBill = await ElectricityBill.findOneAndUpdate(
      { PaymentIdentifier: PaymentIdentifier },
      updateData,
      {
        new: true,
      },
    );

    res
      .status(200)
      .json({ message: "اطلاعات ویرایش شد.", updatedElectricityBill });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteElectricityBill = async (req, res) => {
  const { paymentIdentifier } = req.params;

  try {
    const existingElectricityBill = await ElectricityBill.findOne({
      paymentIdentifier,
    });

    if (!existingElectricityBill) {
      return res
        .status(400)
        .json({ message: "شناسه پرداخت انتخاب شده وجود ندارد." });
    }

    const electricityBill = await ElectricityBill.findOneAndDelete({
      paymentIdentifier,
    });

    res
      .status(200)
      .json({ message: "اطلاعات قبض‌ برق حذف شد.", electricityBill });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف قبض‌ برق", error: error.message });
  }
};

exports.getElectricityBillsComparison = async (req, res) => {
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

    const existingElectricityMeter = await ElectricityMeter.findOne({
      billIdentifier,
    });

    if (!existingElectricityMeter) {
      return res
        .status(400)
        .json({ message: "شناسه قبض انتخاب شده وجود ندارد." });
    }

    // const electricityBills = await ElectricityBill.find({
    //   billIdentifier,
    //   readingDate: { $in: [first, second] },
    // }).sort({ readingDate: 1 });

    const years = [first, second].filter(Boolean);

    const electricityBills = await ElectricityBill.find({
      billIdentifier,
      $or: years.map((y) => ({ readingDate: { $regex: `^${y}` } })),
    }).sort({ readingDate: 1 });

    const grouped = {};
    let totalFirstYear = 0;
    let totalSecondYear = 0;

    electricityBills.forEach((bill) => {
      const readingDateWithUnderline = bill?.readingDate.split("/");

      const [year, month, day] = readingDateWithUnderline;

      const key = month;
      if (!grouped[key]) {
        grouped[key] = {
          firstPeriod: null,
          firstDays: null,
          secendPeriod: null,
          secendDays: null,
        };
      }
      const consumption = bill.avgCost * bill.totalDays;

      if (year.toString() === first.toString()) {
        grouped[key].firstPeriod = bill.avgCost;
        grouped[key].firstDays = bill.totalDays;

        totalFirstYear += consumption;
      } else if (year.toString() === second.toString()) {
        grouped[key].secendPeriod = bill.avgCost;
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
    const fileName = "electricityBill";
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
        serialNumber,
        description,
        creator,

        avgCost,
        billAmt,
        billType,
        energyAmt,
        grossAmt,
        insuranceAmt,
        issueDate,
        lowCons,
        normalCons,
        patternMessage,
        peakCons,
        powerPaytollAmt,
        prevReadingDate,
        previousEnergyDebit,
        processStatus,
        readingDate,
        salePrd,
        saleYear,
        taxAmt,
        totalDays,
      } = row;
      const readingDateWithUnderline = readingDate.replaceAll("/", "_");
      // const deadlineDate = convertJalaliToDate(paymentDeadLine);
      // const currentDate = convertJalaliToDate(currentReading);
      // const previousDate = convertJalaliToDate(previousReading);

      await ElectricityBill.findOneAndUpdate(
        { _id: `${billIdentifier}_${readingDateWithUnderline}` },
        {
          billIdentifier,
          serialNumber,
          description,
          creator,

          avgCost,
          billAmt,
          billType,
          energyAmt,
          grossAmt,
          insuranceAmt,
          issueDate,
          lowCons,
          normalCons,
          patternMessage,
          peakCons,
          powerPaytollAmt,
          prevReadingDate,
          previousEnergyDebit,
          processStatus,
          readingDate,
          salePrd,
          saleYear,
          taxAmt,
          totalDays,
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
