const Room = require("../models/roomModel");
const XLSX = require("xlsx");
const fs = require("fs");
const Employee = require("../models/employeeModel");
const Asset = require("../models/assetModel");

exports.addRoom = async (req, res) => {
  try {
    const { name, description, building, floor, number } = req.body;

    if (!name || !number || !building || !floor) {
      return res.status(400).json({ message: "مقادیر لازم الزامی هستند." });
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear(); // سال فعلی
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // ماه فعلی (01 تا 12)
    const gallery = [];
    let image = null;

    if (req.files["image"]) {
      image = `/uploads/rooms/${year}/${month}/${req.files["image"][0].filename}`;
    }

    // تنظیم مسیر فایل‌های گالری
    if (req.files["gallery"]) {
      req.files["gallery"].forEach((file) => {
        gallery.push(`/uploads/rooms/${year}/${month}/${file.filename}`);
      });
    }

    const existingRoom = await Room.findOne({
      number,
    });
    if (existingRoom) {
      return res
        .status(400)
        .json({ message: "این اتاق با این شماره را قبلاً ثبت کرده اید." });
    }

    const newRoom = new Room({
      _id: building + "_" + floor + "_" + number,
      name,
      description,
      number,
      building,
      floor,
      image,
      gallery,
    });

    await newRoom.save();
    res.status(201).json({
      message: "اتاق جدید اضافه شد.",
      room: newRoom,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد اتاق", error: error.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const rooms = await Room.find()
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const totalRooms = await Room.countDocuments();

    const data = {
      data: rooms,
      total: totalRooms,
      totalPages: Math.ceil(totalRooms / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست اتاق ها",
      error: error.message,
    });
  }
};

exports.getRoomWithNumber = async (req, res) => {
  const { number } = req.params;
  try {
    const room = await Room.findOne({
      number,
    })
      .populate("building", "name number address postalCode")
      .populate("floor", "name number");

    if (!room)
      return res.status(404).json({ message: "اتاق مورد نظر یافت نشد" });

    const employees = await Employee.find(
      { roomNumber: number },
      "firstName lastName nationalId positionCode"
    ).populate({
      path: "positionCode",
      model: "Position",
      select: "title",
    });

    const assets = await Asset.find(
      { roomNumber: number },
      "name serialNumber category"
    ).populate({
      path: "category",
      model: "AssetCategory",
      select: "name code",
    });

    const assetsByCategoryMap = {};
    assets.forEach((asset) => {
      const categoryCode = asset.category.code.toString();
      if (!assetsByCategoryMap[categoryCode]) {
        assetsByCategoryMap[categoryCode] = {
          name: asset.category.name,
          code: asset.category.code,
          assets: [],
        };
      }
      assetsByCategoryMap[categoryCode].assets.push({
        _id: asset._id,
        name: asset.name,
        serialNumber: asset.serialNumber,
      });
    });

    const assetsCategory = Object.values(assetsByCategoryMap);

    res.status(200).json({ ...room.toObject(), employees, assetsCategory });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات اتاق",
      error: error.message,
    });
  }
};

exports.updateRoom = async (req, res) => {
  const { number } = req.params;
  const newData = req.body;

  try {
    const room = await Room.findOne({
      number,
    });

    if (!room) {
      return res.status(404).json({ message: "اتاق یافت نشد." });
    }

    if (number && number !== room.number) {
      const existingRoomNumber = await Room.findOne({
        number,
      });
      if (existingRoomNumber) {
        return res
          .status(400)
          .json({ message: "یک اتاق با این شماره پلاک قبلاً ثبت شده است." });
      }
    }

    const updatedRoom = await Room.findOneAndUpdate(
      { number: number },
      newData,
      {
        new: true,
      }
    );

    res.status(200).json({ message: "اتاق ویرایش شد.", updatedRoom });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش اتاق", error: error.message });
  }
};

exports.addRoomToEmployee = async (req, res) => {
  const { nationalId } = req.params;
  const { roomNumber } = req.body;

  try {
    const room = await Room.findOne({
      number: roomNumber,
    });

    if (!room) {
      return res.status(404).json({ message: "اتاق یافت نشد." });
    }

    const employee = await Employee.findOne({
      nationalId: nationalId,
    });

    if (!employee) {
      return res.status(404).json({ message: "پرسنل یافت نشد." });
    }

    if (employee.roomNumber) {
      return res.status(400).json({
        message: "این پرسنل در اتاق دیگری حضور دارد.",
      });
    }

    await employee.updateOne({ roomNumber: roomNumber });

    res.status(200).json({ message: "پرسنل به اتاق اضافه شد.", room });
  } catch (error) {
    res.status(500).json({
      message: "خطا در اضافه کردن پرسنل به اتاق",
      error: error.message,
    });
  }
};

exports.removeRoomFromEmployee = async (req, res) => {
  const { nationalId } = req.params;
  const { roomNumber } = req.body;

  try {
    const room = await Room.findOne({
      number: roomNumber,
    });

    if (!room) {
      return res.status(404).json({ message: "اتاق یافت نشد." });
    }

    const employee = await Employee.findOne({
      nationalId: nationalId,
    });

    if (!employee) {
      return res.status(404).json({ message: "پرسنل یافت نشد." });
    }

    if (!employee.roomNumber.includes(roomNumber)) {
      return res.status(400).json({
        message: "این پرسنل به این اتاق اختصاص داده نشده است.",
      });
    }

    await employee.updateOne({ $unset: { roomNumber: null } });

    res.status(200).json({ message: "پرسنل از اتاق حذف شد.", room });
  } catch (error) {
    res.status(500).json({
      message: "خطا در حذف پرسنل از اتاق",
      error: error.message,
    });
  }
};

exports.addRoomToAsset = async (req, res) => {
  const { assetSerialNumber } = req.params;
  const { roomNumber } = req.body;

  try {
    const room = await Room.findOne({
      number: roomNumber,
    });

    if (!room) {
      return res.status(404).json({ message: "اتاق یافت نشد." });
    }

    const asset = await Asset.findOne({
      serialNumber: assetSerialNumber,
    });

    if (!asset) {
      return res.status(404).json({ message: "دارایی یافت نشد." });
    }

    if (asset.roomNumber) {
      return res.status(400).json({
        message: "این دارایی در اتاق دیگری حضور دارد.",
      });
    }

    await asset.updateOne({ roomNumber: roomNumber });

    res.status(200).json({ message: "دارایی به اتاق اضافه شد.", asset });
  } catch (error) {
    res.status(500).json({
      message: "خطا در اضافه کردن دارایی به اتاق",
      error: error.message,
    });
  }
};

exports.removeRoomFromAsset = async (req, res) => {
  const { assetSerialNumber } = req.params;
  const { roomNumber } = req.body;

  try {
    const room = await Room.findOne({
      number: roomNumber,
    });

    if (!room) {
      return res.status(404).json({ message: "اتاق یافت نشد." });
    }

    const asset = await Asset.findOne({
      serialNumber: assetSerialNumber,
    });

    if (!asset) {
      return res.status(404).json({ message: "دارایی یافت نشد." });
    }

    if (asset.roomNumber && asset.roomNumber === roomNumber) {
      return res.status(400).json({
        message: "این دارایی به این اتاق اختصاص داده نشده است.",
      });
    }

    await asset.updateOne({ $unset: { roomNumber: null } });

    res.status(200).json({ message: "دارایی از اتاق حذف شد.", room });
  } catch (error) {
    res.status(500).json({
      message: "خطا در حذف دارایی از اتاق",
      error: error.message,
    });
  }
};

exports.deleteRoom = async (req, res) => {
  const { number } = req.params;

  try {
    const room = await Room.findOneAndDelete({
      number,
    });

    if (!room) {
      return res.status(404).json({ message: "اتاق یافت نشد." });
    }

    const name = room.name;
    res.status(200).json({ message: "اتاق حذف شد.", name, number });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف اتاق", error: error.message });
  }
};

exports.searchRoom = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const rooms = await Room.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { number: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی اتاق ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "room";
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
        name,
        description,
        building,
        floor,
        number,
        image,
        gallery,
        creator,
      } = row;
      const galleryArray = gallery
        ? gallery.split(",").map((u) => u.trim())
        : [];
      await Room.findOneAndUpdate(
        { _id: number },
        {
          name,
          description,
          building,
          floor,
          number,
          image,
          gallery: galleryArray,
          creator,
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
