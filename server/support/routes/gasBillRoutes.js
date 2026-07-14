const express = require("express");
const router = express.Router();
const gasBillController = require("../controllers/gasBillController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const { uploadForModel } = require("../../middleware/upload");
const auth = require("../../middleware/auth");

router.use(auth);

router.post(
  "/add-gas-bill",
  uploadForModel("gas-bill").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 5 }, // حداکثر 5 عکس برای گالری
  ]),

  gasBillController.addGasBill,
);

router.get("/get-gas-bills", gasBillController.getGasBills);

router.get(
  "/get-gas-bills-comparison/:billIdentifier",
  gasBillController.getGasBillsComparison,
);

router.get(
  "/get-gas-bills-with-serial-number/:serialNumber",
  gasBillController.getGasBillsWithSerialNumber,
);

router.get(
  "/get-date-gas-bills/:billIdentifier",
  gasBillController.getDateGasBills,
);

router.get(
  "/get-gas-bill-with-payment-identifier/:paymentIdentifier",
  gasBillController.getGasBillWithPaymentIdentifier,
);

router.put(
  "/edit-gas-bill/:paymentIdentifier",
  gasBillController.updateGasBillWithPaymentIdentifier,
);

router.delete(
  "/delete-gas-bill/:paymentIdentifier",
  gasBillController.deleteGasBill,
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  gasBillController.uploadExcel,
);

module.exports = router;
