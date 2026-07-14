const bcrypt = require("bcryptjs");
const Employee = require("../../general/models/employeeModel");
const createToken = require("../../utils/createToken");
const jwt = require("jsonwebtoken");
const { logAuthActivity } = require("../../log/controllers/logAuthController");
// const Redis = require("ioredis");

const isProd = process.env.NODE_ENV === "production";
// const CACHED_TOKEN_KEY = "saapa:jwt";
// const redis = new Redis();
exports.signing = async (req, res) => {
  try {
    //get cred
    const { nationalId, password } = req.body;

    //check field
    if (!nationalId || !password)
      return res.status(400).json({ message: "لطفا اطلاعات را وارد کنید!" });

    //check nationalId
    const employee = await Employee.findOne({ nationalId });
    if (!employee)
      return res.status(400).json({ message: "این پرسنل وجود ندارد!" });

    if (!employee.password)
      return res
        .status(400)
        .json({ message: "برای این پرسنل کلمه عبور تعریف نشده است!" });

    //check password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      await logAuthActivity(req, "login", "failure", {
        nationalId,
        message: "کلمه عبور اشتباه است!",
      });
      return res.status(400).json({ message: "کلمه عبور اشتباه است!" });
    }

    //refresh token
    const rf_token = createToken.refresh({
      nationalId: employee.nationalId,
      roles: employee.roles,
      province: employee.province,
      isAdmin: employee.isAdmin,
      // county: employee.county,
    });

    res.cookie("_apprftoken", rf_token, {
      signed: true,
      sameSite: isProd ? "None" : "Lax",
      httpOnly: true,
      secure: isProd,
      ...(isProd && { domain: "kar-server.liara.run" }),
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 24h
    });

    // in cookie
    // await redis.set(
    //   CACHED_TOKEN_KEY,
    //   JSON.stringify({ cookie: rf_token }),
    //   "EX",
    //   60 * 60
    // );

    // await redis.set(CACHED_TOKEN_KEY, rf_token, "EX", 60 * 60)

    const ac_token = createToken.access({
      nationalId: employee.nationalId,
      roles: employee.roles,
      // province: employee.province,
      // county: employee.county,
    });

    await logAuthActivity(req, "login", "success", {
      nationalId,
    });

    //signing success
    res.status(200).json({
      message: "با موفقیت وارد شدید.",
      ac_token: ac_token,
    });
  } catch (err) {
    await logAuthActivity(req, "login", "failure", { error: err.message });
    res.status(500).json({ message: err.message });
  }
};

exports.access = async (req, res) => {
  try {
    // const t = await redis.get(CACHED_TOKEN_KEY);
    //rf token
    // const rf_token = req.headers.cookie.split("_apprftoken=")[1];
    const rf_token = req.signedCookies._apprftoken;
    if (!rf_token) return res.status(401).json({ message: "لطفا وارد شوید!" });

    //validate
    if (rf_token) {
      jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, employee) => {
        if (err)
          return res.status(400).json({ message: "لطفا مجدد وارد شوید!" });
        //create access token
        const ac_token = createToken.access({
          nationalId: employee.nationalId,
          roles: employee.roles,
          province: employee.province,
          isAdmin: employee.isAdmin,
          // county: employee.county,
        });
        //access token
        res.status(200).json({ ac_token });
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const me = await Employee.findOne({
      nationalId: req.employee.nationalId,
    })
      .populate("positionCode", "title code")
      .populate("roomNumber", "name roomNumber number")
      .populate("province", "name faName")
      .populate("county", "name faName")
      .select("-password");

    if (!me)
      return res.status(404).json({ message: "پرسنل مورد نظر یافت نشد" });

    res.status(200).json(me);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت اطلاعات پرسنل",
      error: error.message,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    //get password
    const { oldPassword, newPassword } = req.body;
    //check employee
    const employee = await Employee.findById(req.employee.nationalId);
    if (!employee) return res.status(400).json({ message: "پرسنل یافت نشد!" });

    //check password
    const isMatch = await bcrypt.compare(oldPassword, employee.password);
    if (!isMatch) {
      await logAuthActivity(req, "update-password", "failure", {
        nationalId,
        message: "کلمه عبور اشتباه است!",
      });
      return res.status(400).json({ message: "کلمه عبور اشتباه است!" });
    }
    //hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(newPassword, salt);

    //update password
    await employee.updateOne({ password: hashPassword });

    await logAuthActivity(req, "update-password", "success", {});

    //success
    res.status(200).json({ message: "کلمه عبور تغییر کرد." });
  } catch (err) {
    await logAuthActivity(req, "update-password", "failure", {
      error: err.message,
    });
    res.status(500).json({ message: err.message });
  }
};

exports.signout = async (req, res) => {
  let nationalId;
  let token =
    req.headers.authorization?.split(" ")[1] ||
    req.headers.Authorization?.split(" ")[1];

  //validate
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, employee) => {
      if (!err) {
        nationalId = employee.nationalId;
      }
    });
  }

  await logAuthActivity(req, "logout", "success", { nationalId });

  try {
    //clear cookie
    res.clearCookie("_apprftoken", {
      path: "/",
    });

    //success
    return res.status(200).json({ message: "با موفقیت خارج شدید." });
  } catch (err) {
    await logAuthActivity(req, "logout", "failure", {
      error: err.message,
    });
    res.status(500).json({ message: err.message });
  }
};
