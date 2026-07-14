const Profile = require("./profileModel");

exports.addProfile = async (req, res) => {
  const { name, description, code, creator, isActive } = req.body;

  if (!name || !code) {
    return res.status(400).json({ message: "مقادیر لازم الزامی هستند." });
  }

  try {
    const existingProfile = await Profile.findOne({
      code,
    });
    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "این کد تجهیز را قبلاً ثبت کرده اید." });
    }

    const newProfile = new Profile({
      _id: code,
      code,
      name,
      description,
      creator,
      isActive,
    });

    await newProfile.save();
    res.status(201).json({
      message: "شناسنامه تجهیز جدید اضافه شد.",
      asset: newProfile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطا در ایجاد شناسنامه تجهیز", error: error.message });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().sort({
      createdAt: -1,
    });

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شناسنامه ها",
      error: error.message,
    });
  }
};

exports.getProfileByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const profile = await Profile.findOne({ code });

    if (!profile)
      return res.status(404).json({ message: "شناسنامه مورد نظر یافت نشد" });

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت لیست شناسنامه ها",
      error: error.message,
    });
  }
};
