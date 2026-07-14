const express = require("express");
const router = express.Router();
const greenMeterController = require("../controllers/greenMeterController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-green-meter", greenMeterController.addGreenMeter);

router.get("/get-green-meters", greenMeterController.getGreenMeters);

router.get(
  "/get-green-meter-with-serial-number/:serialNumber",
  greenMeterController.getGreenMeterWithSerialNumber,
);

router.put(
  "/edit-green-meter/:serialNumber",
  greenMeterController.updateGreenMeterWithSerialNumber,
);

router.delete(
  "/delete-green-meter/:serialNumber",
  greenMeterController.deleteGreenMeter,
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  greenMeterController.uploadExcel,
);

module.exports = router;
