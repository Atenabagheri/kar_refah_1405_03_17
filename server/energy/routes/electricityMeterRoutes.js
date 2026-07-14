const express = require("express");
const router = express.Router();
const electricityMeterController = require("../controllers/electricityMeterController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");
const { uploadForModel } = require("../../middleware/upload");

router.use(auth);

router.post(
  "/add-electricity-meter",
  uploadForModel("electricity-meter").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 5 }, // حداکثر 5 عکس برای گالری
  ]),

  electricityMeterController.addElectricityMeter,
);

router.get(
  "/get-electricity-meters",
  auth,
  electricityMeterController.getElectricityMeters,
);

router.get(
  "/get-electricity-meter-with-serial-number/:serialNumber",
  electricityMeterController.getElectricityMeterWithSerialNumber,
);

router.put(
  "/edit-electricity-meter/:serialNumber",
  electricityMeterController.updateElectricityMeterWithSerialNumber,
);

router.delete(
  "/delete-electricity-meter/:serialNumber",
  electricityMeterController.deleteElectricityMeter,
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  electricityMeterController.uploadExcel,
);

module.exports = router;
