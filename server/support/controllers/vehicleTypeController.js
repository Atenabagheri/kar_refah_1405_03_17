const XLSX = require("xlsx");
const fs = require("fs");
const VehicleType = require("../models/vehicleTypeModel");

exports.addVehicleType = async (req, res) => {
  const { creator, priority, name, faName, description } = req.body;

  if (!creator || !name || !faName) {
    return res.status(400).json({ message: "تمام فیلدها الزامی هستند." });
  }

  try {
    const existingName = await VehicleType.findOne({
      name,
    });

    if (existingName) {
      return res.status(400).json({
        message: "نوع وسیله نقلیه با این نام انگلیسی قبلا ثبت شده است.",
      });
    }

    const newVehicleType = new VehicleType({
      _id: name,
      creator,
      priority,
      name,
      faName,
      description,
    });

    await newVehicleType.save();
    res.status(201).json({
      message: "نوع وسیله نقلیه جدید اضافه شد.",
      VehicleType: newVehicleType,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد نوع وسیله نقلیه", error: error.message });
  }
};

exports.getVehicleTypes = async (req, res) => {
  try {
    const vehicleTypes = await VehicleType.find().sort({
      createdAt: -1,
    });

    res.status(200).json(vehicleTypes);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست نوع وسایل نقلیه",
      error: error.message,
    });
  }
};

exports.getVehicleTypeWithName = async (req, res) => {
  const { typeName } = req.params;
  try {
    const existingVehicleType = await VehicleType.findOne({
      name: typeName,
    }).sort({
      createdAt: -1,
    });

    if (!existingVehicleType) {
      return res
        .status(400)
        .json({ message: "نوع وسیله نقلیه انتخاب شده وجود ندارد." });
    }

    res.status(200).json(existingVehicleType);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست نوع وسایل نقلیه",
      error: error.message,
    });
  }
};

exports.updateVehicleTypeWithName = async (req, res) => {
  const { typeName } = req.params;

  try {
    const newData = req.body;
    const existingVehicleType = await VehicleType.findOne({
      name: typeName,
    });

    if (!existingVehicleType) {
      return res
        .status(400)
        .json({ message: "نوع وسیله نقلیه انتخاب شده وجود ندارد." });
    }

    const updatedVehicleType = await VehicleType.findOneAndUpdate(
      { name: typeName },
      newData,
      {
        new: true,
      }
    );

    res.status(200).json({ message: "اطلاعات ویرایش شد.", updatedVehicleType });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اطلاعات", error: error.message });
  }
};

exports.deleteVehicleType = async (req, res) => {
  const { typeName } = req.params;

  try {
    const existingVehicleType = await VehicleType.findOne({
      name: typeName,
    });

    if (!existingVehicleType) {
      return res
        .status(400)
        .json({ message: "نوع وسیله نقلیه انتخاب شده وجود ندارد." });
    }

    const vehicleType = await VehicleType.findOneAndDelete({
      name: typeName,
    });

    res
      .status(200)
      .json({ message: "اطلاعات نوع وسیله نقلیه حذف شد.", vehicleType });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف نوع وسیله نقلیه", error: error.message });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "vehicleType";
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
      const { creator, priority, name, faName, description } = row;
      await VehicleType.findOneAndUpdate(
        { _id: name },
        {
          creator,
          priority,
          name,
          faName,
          description,
        },
        { upsert: true, new: true }
      );
    }

    fs.unlinkSync(filePath);
    res.json({ message: "اطلاعات بارگذاری و بروزرسانی شد.", jsonData });
  } catch (error) {
    res.status(500).json({ message: "در پردازش اطلاعات خطا رخ داد.", error });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log(filePath)

    res.json({ message: "فایل بارگزاری شد شد.", filePath });
  } catch (error) {
    res.status(500).json({ message: "در بارگزاری فایل خطا رخ داد.", error });
  }
};