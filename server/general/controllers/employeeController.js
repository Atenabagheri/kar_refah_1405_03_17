const Employee = require("../models/employeeModel");
const XLSX = require("xlsx");
const fs = require("fs");
const Position = require("../models/positionModel");
const Asset = require("../models/assetModel");
const Vehicle = require("../../support/models/vehicleModel");
const bcrypt = require("bcryptjs");
const removeUploaded = require("../../middleware/removeUploaded");
const removeAnyUploaded = require("../../middleware/removeAnyUploaded");

exports.addEmployee = async (req, res) => {
  const {
    firstName,
    lastName,
    nationalId,
    phone,
    address,
    positionCode,
    password,
    roomNumber,
    roles,
    province,
    county,
  } = req.body;

  const currentDate = new Date();
  const year = currentDate.getFullYear(); // سال فعلی
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // ماه فعلی (01 تا 12)
  const gallery = [];
  let image = null;

  if (req?.files["image"]) {
    image = `/uploads/employee/${year}/${month}/${req.files["image"][0].filename}`;
  }

  // تنظیم مسیر فایل‌های گالری
  if (req?.files["gallery"]) {
    req.files["gallery"].forEach((file) => {
      gallery.push(`/uploads/employee/${year}/${month}/${file.filename}`);
    });
  }

  if (!firstName || !lastName || !nationalId || !password) {
    return res.status(400).json({ message: "مقادیر لازم الزامی هستند." });
  }

  try {
    const existingEmployee = await Employee.findOne({
      nationalId,
    });
    if (existingEmployee) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res.status(409).json({
        message: "این پرسنل با کد ملی را قبلاً ثبت کرده اید.",
        status: 409,
      });
    }

    if (positionCode) {
      const position = await Position.findOne({
        code: positionCode,
      });
      if (!position) {
        if (image) {
          removeUploaded(image); // حذف تصویر
        }

        if (gallery.length > 0) {
          removeAnyUploaded(gallery); // حذف گالری
        }
        return res.status(400).json({ message: "کد پست وجود ندارد.." });
      }
    }

    //check password
    if (password.length < 6) {
      if (image) {
        removeUploaded(image); // حذف تصویر
      }

      if (gallery.length > 0) {
        removeAnyUploaded(gallery); // حذف گالری
      }
      return res.status(400).json({ msg: "کمله عبور کمتر از 6 کارکتر است!" });
    }

    //hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newEmployee = new Employee({
      _id: nationalId,
      firstName,
      lastName,
      nationalId,
      phone,
      address,
      positionCode,
      password: hashPassword,
      roomNumber,
      roles,
      province,
      county,
      image,
      gallery,
    });

    await newEmployee.save();
    res.status(201).json({
      message: "پرسنل جدید اضافه شد.",
      employee: newEmployee,
      status: 201,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد پرسنل", error: error.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const user = req.employee;
    const MHQO = user?.roles === "MHQO";
    const MPO = user?.roles === "MPO";
    if (!MHQO) {
      return res.status(403).json({ message: "شما به این بخش دسترسی ندارید" });
    }

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
            { firstName: { $regex: pattern, $options: "i" } },
            { lastName: { $regex: pattern, $options: "i" } },
            { nationalId: { $regex: search } },
            { phone: { $regex: search } },
          ],
        };
      });
    }

    const employees = await Employee.find(searchConditions)
      .select(
        "-roomNumber -updatedAt -createdAt -__v -province -password -county -address -roles",
      )
      .populate("positionCode", "title code")
      .skip(skip)
      .limit(limit);

    const totalEmployees = await Employee.countDocuments(searchConditions);

    const data = {
      data: employees,
      total: totalEmployees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پرسنل ها",
      error: error.message,
    });
  }
};

exports.getEmployeesForFrom = async (req, res) => {
  try {
    const user = req.employee;
    const MHQO = user?.roles === "MHQO";
    const MPO = user?.roles === "MPO";
    if (!MHQO) {
      return res.status(403).json({ message: "شما به این بخش دسترسی ندارید" });
    }

    const search = req.query.search;

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
            { firstName: { $regex: pattern, $options: "i" } },
            { lastName: { $regex: pattern, $options: "i" } },
            { nationalId: { $regex: search } },
            { phone: { $regex: search } },
          ],
        };
      });
    }

    const employees = await Employee.find(searchConditions).select(
      "firstName lastName nationalId",
    );

    const data = {
      data: employees,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست پرسنل ها",
      error: error.message,
    });
  }
};

exports.getEmployeeWithNationalId = async (req, res) => {
  const { nationalId } = req.params;
  try {
    const user = req.employee;
    const MHQO = user?.roles === "MHQO";
    const MPO = user?.roles === "MPO";
    if (!MHQO) {
      return res.status(403).json({ message: "شما به این بخش دسترسی ندارید" });
    }
    const employee = await Employee.findOne({
      nationalId: nationalId,
    })
      .populate("positionCode", "title code")
      .populate("roomNumber", "name roomNumber number")
      .populate("province", "name faName")
      .populate("county", "name faName")
      .select("-password -roles");

    if (!employee)
      return res.status(404).json({ message: "پرسنل مورد نظر یافت نشد" });

    const assets = await Asset.find(
      { employee: employee.nationalId },
      "name serialNumber category",
    ).populate({
      path: "category",
      model: "AssetCategory",
      select: "name code",
    });

    const vehicle = await Vehicle.find(
      { operatorType: "special", operatorSpecial: employee.nationalId },
      "brand model licensePlate vin",
    ).populate({
      path: "brand",
      model: "VehicleBrand",
      select: "name faName",
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

    res.status(200).json({ ...employee.toObject(), assetsCategory, vehicle });
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات پرسنل",
      error: error.message,
    });
  }
};

exports.updateEmployee = async (req, res) => {
  const { nationalId } = req.params;
  const newData = req.body;

  try {
    const employee = await Employee.findOne({
      nationalId: nationalId,
    });

    if (!employee) {
      return res.status(404).json({ message: "پرسنل یافت نشد." });
    }

    if (nationalId && nationalId !== employee.nationalId) {
      const existingEmployeeNatioanlId = await Employee.findOne({
        nationalId,
      });
      if (existingEmployeeNatioanlId) {
        return res
          .status(400)
          .json({ message: "یک پرسنل با این ملی قبلاً ثبت شده است." });
      }
    }

    if (newData.password) {
      //hash password
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(newData.password, salt);

      newData.password = hashPassword;
    }
    const updatedEmployee = await Employee.findOneAndUpdate(
      { nationalId: nationalId },
      newData,
      {
        new: true,
      },
    );

    res.status(200).json({ message: "پرسنل ویرایش شد.", updatedEmployee });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش پرسنل", error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { nationalId } = req.params;

  try {
    const employee = await Employee.findOneAndDelete({
      nationalId: nationalId,
    });

    if (!employee) {
      return res.status(404).json({ message: "پرسنل یافت نشد." });
    }

    const firstName = employee.firstName;
    const lastName = employee.lastName;
    res
      .status(200)
      .json({ message: "پرسنل حذف شد.", firstName, lastName, nationalId });
  } catch (error) {
    res.status(500).json({ message: "خطا در حذف پرسنل", error: error.message });
  }
};

exports.searchEmployee = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو وارد کنید." });
  }

  try {
    const employees = await Employee.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { nationalId: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی پرسنل ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "employee";
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
        firstName,
        lastName,
        nationalId,
        phone,
        address,
        positionCode,
        password,
        roomNumber,
        roles,
        province,
        county,
      } = row;
      //hash password
      const salt = await bcrypt.genSalt();
      const hashPassword = password ? await bcrypt.hash(password, salt) : null;
      // roles change to array
      // const rolesArray = roles?.split(",").map((role) => role.trim());
      await Employee.findOneAndUpdate(
        { _id: nationalId },
        {
          nationalId,
          firstName,
          lastName,
          phone,
          address,
          positionCode,
          password: hashPassword,
          roomNumber,
          roles,
          province,
          county,
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
