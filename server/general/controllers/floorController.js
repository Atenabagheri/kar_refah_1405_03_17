const Floor = require("../models/floorModel");
const XLSX = require("xlsx");
const fs = require("fs");

exports.addFloor = async (req, res) => {
  const { name, description, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ message: "مقادیر لازم الزامی هستند." });
  }

  try {
    const existingFloor = await Floor.findOne({
      number,
    });
    if (existingFloor) {
      return res
        .status(400)
        .json({ message: "این طبقه با این شماره را قبلاً ثبت کرده اید." });
    }

    const newFloor = new Floor({
      _id: number,
      name,
      description,
      number,
    });

    await newFloor.save();
    res.status(201).json({
      message: "طبقه جدید اضافه شد.",
      floor: newFloor,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد طبقه", error: error.message });
  }
};

exports.getFloors = async (req, res) => {
  try {
    const floors = await Floor.find().sort({
      createdAt: -1,
    });

    res.status(200).json(floors);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست طبقه ها",
      error: error.message,
    });
  }
};

exports.getFloorWithNumber = async (req, res) => {
  const { number } = req.params;
  try {
    const floor = await Floor.findOne({
      number,
    });

    if (!floor)
      return res.status(404).json({ message: "طبقه مورد نظر یافت نشد" });

    res.status(200).json(floor);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات طبقه",
      error: error.message,
    });
  }
};

exports.updateFloor = async (req, res) => {
  const { number } = req.params;
  const newData = req.body;

  try {
    const floor = await Floor.findOne({
      number,
    });

    if (!floor) {
      return res.status(404).json({ message: "طبقه یافت نشد." });
    }

    if (number && number !== floor.number) {
      const existingFloorNumber = await Floor.findOne({
        number,
      });
      if (existingFloorNumber) {
        return res
          .status(400)
          .json({ message: "یک طبقه با این شماره پلاک قبلاً ثبت شده است." });
      }
    }

    const updatedFloor = await Floor.findOneAndUpdate(
      { number: number },
      newData,
      {
        new: true,
      }
    );

    res.status(200).json({ message: "طبقه ویرایش شد.", updatedFloor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش طبقه", error: error.message });
  }
};

exports.deleteFloor = async (req, res) => {
  const { number } = req.params;

  try {
    const floor = await Floor.findOneAndDelete({
      number,
    });

    if (!floor) {
      return res.status(404).json({ message: "طبقه یافت نشد." });
    }

    const name = floor.name;
    res.status(200).json({ message: "طبقه حذف شد.", name, number });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف طبقه", error: error.message });
  }
};

exports.searchFloor = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const floors = await Floor.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { number: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(floors);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی طبقه ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "floor";
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
      const { name, description, number } = row;
      await Floor.findOneAndUpdate(
        { _id: number },
        { name, description, number },
        { upsert: true, new: true }
      );
    }

    fs.unlinkSync(filePath);
    res.json({ message: "اطلاعات بارگذاری و بروزرسانی شد.", jsonData });
  } catch (error) {
    res.status(500).json({ message: "در پردازش اطلاعات خطا رخ داد.", error });
  }
};
