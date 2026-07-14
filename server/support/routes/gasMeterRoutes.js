const express = require("express");
const router = express.Router();
const gasMeterController = require("../controllers/gasMeterController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");
const { uploadForModel } = require("../../middleware/upload");

router.use(auth);

router.post(
  "/add-gas-meter",
  uploadForModel("gas-meter").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 5 }, // حداکثر 5 عکس برای گالری
  ]),
  gasMeterController.addGasMeter,
);

router.get("/get-gas-meters", auth, gasMeterController.getGasMeters);

router.get(
  "/get-gas-meter-with-serial-number/:serialNumber",
  gasMeterController.getGasMeterWithSerialNumber,
);

router.put(
  "/edit-gas-meter/:serialNumber",
  gasMeterController.updateGasMeterWithSerialNumber,
);

router.delete(
  "/delete-gas-meter/:serialNumber",
  gasMeterController.deleteGasMeter,
);

router.get("/search", gasMeterController.searchGasMeter);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  gasMeterController.uploadExcel,
);

module.exports = router;
