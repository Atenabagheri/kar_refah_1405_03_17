const Asset = require("../models/assetModel");
const XLSX = require("xlsx");
const fs = require("fs");
const AssetCategory = require("../models/assetCategoryModel");
const Employee = require("../models/employeeModel");

exports.addAsset = async (req, res) => {
  const {
    name,
    description,
    category,
    serialNumber,
    roomNumber,
    employee,
    creator,
    type,
    isActive,
  } = req.body;

  if (!name || !description || !category || !serialNumber) {
    return res.status(400).json({ message: "مقادیر لازم الزامی هستند." });
  }

  try {
    const existingAsset = await Asset.findOne({
      serialNumber,
    });
    if (existingAsset) {
      return res
        .status(400)
        .json({ message: "این دارایی با این سریال را قبلاً ثبت کرده اید." });
    }

    const existingAssetCategory = await AssetCategory.find({
      code: category,
    });
    if (existingAssetCategory) {
      return res
        .status(400)
        .json({ message: `دسته بندی دارایی با کد ${category} وجود ندارد.` });
    }

    const newAsset = new Asset({
      _id: serialNumber,
      name,
      description,
      serialNumber,
      category,
      roomNumber,
      employee,
      creator,
      type,
      isActive,
    });

    await newAsset.save();
    res.status(201).json({
      message: "دارایی جدید اضافه شد.",
      asset: newAsset,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد دارایی", error: error.message });
  }
};

exports.getAssets = async (req, res) => {
  try {
    const user = req.employee;
    const MHQO = user?.roles === "MHQO";
    console.log({ assets: user, MHQO });

    const search = req.query.search;
    const category = req.query.category;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    let searchConditions = {};

    if(category) {
      searchConditions.category = category
    }
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
            { name: { $regex: pattern, $options: "i" } },
          ],
        };
      });
    }
    const assets = await Asset.find(searchConditions)
      .sort({
        createdAt: -1,
      })
      .select("-roomNumber -updatedAt -createdAt -__v")
      .populate("category", "name code")
      .skip(skip)
      .limit(limit);

    const totalAssets = await Asset.countDocuments(searchConditions);

    const data = {
      data: assets,
      total: totalAssets,
      totalPages: Math.ceil(totalAssets / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست دارایی ها",
      error: error.message,
    });
  }
};

exports.getInfoDashboard = async (req, res) => {
  try {
    const result = await Asset.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          active: [{ $match: { isActive: true } }, { $count: "count" }],
          deactive: [{ $match: { isActive: false } }, { $count: "count" }],
          hqs: [{ $match: { type: "hqs" } }, { $count: "count" }],
          province: [{ $match: { type: "province" } }, { $count: "count" }],
        },
      },
    ]);

    const totalCategory = await AssetCategory.countDocuments();

    const data = {
      totalCategory,
      total: result[0].total[0]?.count || 0,
      active: result[0].active[0]?.count || 0,
      deactive: result[0].deactive[0]?.count || 0,
      hqs: result[0].hqs[0]?.count || 0,
      province: result[0].province[0]?.count || 0,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست اموال",
      error: error.message,
    });
  }
};

exports.getAssetWithSerialNumber = async (req, res) => {
  const { assetSerialNumber } = req.params;
  try {
    const asset = await Asset.findOne({
      serialNumber: assetSerialNumber,
    })
      .populate("employee", "firstName lastName nationalId")
      .populate("category", "name code")
      .populate("roomNumber", "name number");

    if (!asset)
      return res.status(404).json({ message: "دارایی مورد نظر یافت نشد" });

    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات دارایی",
      error: error.message,
    });
  }
};

exports.updateAsset = async (req, res) => {
  const { assetSerialNumber } = req.params;
  const newData = req.body;

  try {
    const asset = await Asset.findOne({
      serialNumber: assetSerialNumber,
    });

    if (!asset) {
      return res.status(404).json({ message: "دارایی یافت نشد." });
    }

    if (assetSerialNumber && assetSerialNumber !== asset.serialNumber) {
      const existingAssetSerialNumber = await Asset.findOne({
        serialNumber: assetSerialNumber,
      });
      if (existingAssetSerialNumber) {
        return res.status(400).json({
          message: "یک دارایی با این کد قبلاً ثبت شده است.",
        });
      }
    }

    const updatedAsset = await Asset.findOneAndUpdate(
      { serialNumber: assetSerialNumber },
      newData,
      {
        new: true,
      }
    );

    res.status(200).json({ message: "دارایی ویرایش شد.", updatedAsset });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ویرایش دارایی", error: error.message });
  }
};

exports.addAssetToEmployee = async (req, res) => {
  const { nationalId } = req.params;
  const { assetSerialNumber } = req.body;

  try {
    const asset = await Asset.findOne({
      serialNumber: assetSerialNumber,
    });

    if (!asset) {
      return res.status(404).json({ message: "دارایی یافت نشد." });
    }

    const employee = await Employee.findOne({
      nationalId: nationalId,
    });

    if (!employee) {
      return res.status(404).json({ message: "پرسنل یافت نشد." });
    }

    if (asset.employee) {
      return res.status(400).json({
        message: "این دارایی در اختیار پرسنل دیگری می باشد.",
      });
    }

    // await employee.updateOne({ $addToSet: { assets: assetSerialNumber } });

    await asset.updateOne({ employee: employee.nationalId });

    res.status(200).json({ message: "دارایی به اموال پرسنل اضافه شد.", asset });
  } catch (error) {
    res.status(500).json({
      message: "خطا در اضافه کردن دارایی به پرسنل",
      error: error.message,
    });
  }
};

exports.removeAssetFromEmployee = async (req, res) => {
  const { nationalId } = req.params;
  const { assetSerialNumber } = req.body;

  try {
    const asset = await Asset.findOne({
      serialNumber: assetSerialNumber,
    });

    if (!asset) {
      return res.status(404).json({ message: "دارایی یافت نشد." });
    }

    const employee = await Employee.findOne({
      nationalId: nationalId,
    });

    if (!employee) {
      return res.status(404).json({ message: "پرسنل یافت نشد." });
    }

    if (!employee.assets.includes(assetSerialNumber)) {
      return res.status(400).json({
        message: "این دارایی به این پرسنل اختصاص داده نشده است.",
      });
    }

    // await employee.updateOne({ $pull: { assets: assetSerialNumber } });

    await asset.updateOne({ $unset: { employee: null } });

    res.status(200).json({ message: "دارایی از اموال پرسنل حذف شد.", asset });
  } catch (error) {
    res.status(500).json({
      message: "خطا در حذف کردن دارایی از پرسنل",
      error: error.message,
    });
  }
};

exports.deleteAsset = async (req, res) => {
  const { assetSerialNumber } = req.params;

  try {
    const asset = await Asset.findOneAndDelete({
      serialNumber: assetSerialNumber,
    });

    if (!asset) {
      return res.status(404).json({ message: "دارایی یافت نشد." });
    }

    const name = asset.name;
    const serialNumber = asset.serialNumber;
    res.status(200).json({
      message: "دارایی حذف شد.",
      name,
      serialNumber,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در حذف دارایی", error: error.message });
  }
};

exports.searchAsset = async (req, res) => {
  const { query, category } = req.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  if (!query && !category) {
    return res
      .status(400)
      .json({ message: "لطفاً یک مقدار برای جستجو یا دسته‌بندی وارد کنید." });
  }

  try {
    let searchConditions = {};

    if (query) {
      searchConditions.$or = [
        { name: { $regex: query, $options: "i" } },
        { serialNumber: { $regex: query, $options: "i" } },
      ];
    }

    if (category) {
      searchConditions.category = category;
    }

    const assets = await Asset.find(searchConditions)
      .select("-roomNumber -updatedAt -createdAt -__v")
      .populate("category", "name code")
      .skip(skip)
      .limit(limit);

    const totalAssets = await Asset.countDocuments(searchConditions);

    const data = {
      data: assets,
      total: totalAssets,
      totalPages: Math.ceil(totalAssets / limit),
      currentPage: page,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "خطا در جستجوی دارایی ها",
      error: error.message,
    });
  }
};

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = "asset";
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
        serialNumber,
        roomNumber,
        category,
        employee,
        creator,
        type,
        isActive,
      } = row;

      await Asset.findOneAndUpdate(
        { _id: serialNumber },
        {
          serialNumber,
          name,
          description,
          roomNumber,
          category,
          employee,
          creator,
          type,
          isActive,
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
