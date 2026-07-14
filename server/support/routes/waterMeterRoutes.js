const express = require("express");
const router = express.Router();
const waterMeterController = require("../controllers/waterMeterController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");
const { uploadForModel } = require("../../middleware/upload");

router.use(auth);

router.post(
  "/add-water-meter",
  uploadForModel("water-meter").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 5 }, // حداکثر 5 عکس برای گالری
  ]),
  waterMeterController.addWaterMeter,
);

router.get("/get-water-meters", auth, waterMeterController.getWaterMeters);

router.get(
  "/get-water-meter-with-serial-number/:serialNumber",
  waterMeterController.getWaterMeterWithSerialNumber,
);

router.put(
  "/edit-water-meter/:serialNumber",
  waterMeterController.updateWaterMeterWithSerialNumber,
);

router.delete(
  "/delete-water-meter/:serialNumber",
  waterMeterController.deleteWaterMeter,
);

router.get("/search", waterMeterController.searchWaterMeter);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  waterMeterController.uploadExcel,
);

module.exports = router;
