const Position = require("../models/positionModel");
const XLSX = require("xlsx");
const fs = require("fs");
const Employee = require("../models/employeeModel");

exports.addPosition = async (req, res) => {
  const { title, description, code, maxEmployees } = req.body;

  if (!title || !code) {
    return res.status(400).json({ message: "مقادیر لازم الزامی هستند." });
  }

  try {
    const existingPosition = await Position.findOne({
      code,
    });
    if (existingPosition) {
      return res
        .status(400)
        .json({ message: "این پست با کد را قبلاً ثبت کرده اید." });
    }

    const newPosition = new Position({
      _id: code,
      title,
      description,
      code,
      maxEmployees,
    });

    await newPosition.save();
    res.status(201).json({
      message: "پست جدید اضافه شد.",
      position: newPosition,
    });
  } catch (error) {
    res.status(500).json({ message: "خطا در ایجاد پست", error: error.message });
  }
};

exports.getPositions = async (req, res) => {
  try {
    const user = req.employee;
    const MHQO = user?.roles === "MHQO";
    console.log(user);

    const search = req.query.search;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    let searchConditions = {};

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
            { code: { $regex: pattern, $options: "i" } },
            { title: { $regex: pattern, $options: "i" } },
          ],
        };
      });
    }

    const positions = await Position.find(searchConditions)
      .select("-updatedAt -createdAt -__v")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const totalPositions = await Position.countDocuments(searchConditions);

    const data = {
      data: positions,
      total: totalPositions,
      totalPages: Math.ceil(totalPositions / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پست ها",
      error: error.message,
    });
  }
};

exports.getPositionWithCode = async (req, res) => {
  const { positionCode } = req.params;
  try {
    const position = await Position.findOne({ code: positionCode });

    if (!position)
      return res.status(404).json({ message: "پست مورد نظر یافت نشد" });

    const employee = await Employee.find(
      { positionCode: position.code },
      "firstName lastName nationalId",
    );

    res.status(200).json({ ...position.toObject(), employee });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات پست",
      error: error.message,
    });
  }
};

exports.updatePosition = async (req, res) => {
  const { positionCode } = req.params;
  const newData = req.body;

  try {
    const position = await Position.findOne({
      code: positionCode,
    });

    if (!position) {
      return res.status(404).json({ message: "پست یافت نشد." });
    }

    if (positionCode && positionCode !== position.code) {
      const existingPositionCode = await Position.findOne({
        code: positionCode,
      });
      if (existingPositionCode) {
        return res
          .status(400)
          .json({ message: "یک پست با این کد قبلاً ثبت شده است." });
      }
    }

    const updatedPosition = await Position.findOneAndUpdate(
      { code: positionCode },
      newData,
      {
        new: true,
      },
    );

    res.status(200).json({ message: "پست ویرایش شد.", updatedPosition });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش پست", error: error.message });
  }
};

exports.addPositionToEmployee = async (req, res) => {
  const { nationalId } = req.params;
  const { positionCode } = req.body;

  try {
    const position = await Position.findOne({
      code: positionCode,
    });

    if (!position) {
      return res.status(404).json({ message: "پست یافت نشد." });
    }

    const employee = await Employee.findOne({
      nationalId: nationalId,
    });

    if (!employee) {
      return res.status(404).json({ message: "پرسنل یافت نشد." });
    }

    if (employee.positionCode) {
      return res.status(400).json({
        message: "این پرسنل دارای پست دیگری می باشد.",
      });
    }

    await employee.updateOne({ positionCode: position.code });

    res.status(200).json({ message: "این پست به پرسنل اضافه شد.", position });
  } catch (error) {
    res.status(500).json({
      message: "خطا در اضافه کردن پست به پرسنل",
      error: error.message,
    });
  }
};

exports.deletePosition = async (req, res) => {
  const { positionCode } = req.params;

  try {
    const position = await Position.findOneAndDelete({
      code: positionCode,
    });

    if (!position) {
      return res.status(404).json({ message: "پست یافت نشد." });
    }

    const title = position.title;
    res.status(200).json({ message: "پست حذف شد.", title, positionCode });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف پست", error: error.message });
  }
};

exports.searchPosition = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const positions = await Position.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(positions);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی پست ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "position";
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
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    for (const row of jsonData) {
      const { title, description, code, maxEmployees } = row;
      await Position.findOneAndUpdate(
        { _id: code },
        { title, description, code, maxEmployees },
        { upsert: true, new: true },
      );
    }

    fs.unlinkSync(filePath);
    res.json({ message: "اطلاعات بارگذاری و بروزرسانی شد.", jsonData });
  } catch (error) {
    res.status(500).json({ message: "در پردازش اطلاعات خطا رخ داد.", error });
  }
};
