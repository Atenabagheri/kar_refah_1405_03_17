// routes/settings.js
const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const admin = require("../../middleware/admin");

// همه مسیرها نیاز به لاگین ادمین دارند
// router.use(verifyToken, verifyAdmin);

router.get("/", settingsController.getAllSettings);
router.get("/:key", settingsController.getSettingByKey);
router.put("/", admin, settingsController.updateSetting); // یا POST
router.delete("/:key", settingsController.deleteSetting);

module.exports = router;
