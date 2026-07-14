const express = require("express");
const router = express.Router();
const waterBillController = require("../controllers/waterBillController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const { uploadForModel } = require("../../middleware/upload");
const auth = require("../../middleware/auth");

router.use(auth);

router.post(
  "/add-water-bill",
  uploadForModel("water-bill").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 5 }, // حداکثر 5 عکس برای گالری
  ]),

  waterBillController.addWaterBill,
);

router.get("/get-water-bills", waterBillController.getWaterBills);

router.get(
  "/get-water-bills-comparison/:billIdentifier",
  waterBillController.getWaterBillsComparison,
);

router.get(
  "/get-water-bills-with-serial-number/:serialNumber",
  waterBillController.getWaterBillsWithSerialNumber,
);

router.get(
  "/get-date-water-bills/:billIdentifier",
  waterBillController.getDateWaterBills,
);

router.get(
  "/get-water-bill-with-payment-identifier/:paymentIdentifier",
  waterBillController.getWaterBillWithPaymentIdentifier,
);

router.put(
  "/edit-water-bill/:paymentIdentifier",
  waterBillController.updateWaterBillWithPaymentIdentifier,
);

router.delete(
  "/delete-water-bill/:paymentIdentifier",
  waterBillController.deleteWaterBill,
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  waterBillController.uploadExcel,
);

module.exports = router;
