const express = require("express");
const router = express.Router();
const electricityBillController = require("../controllers/electricityBillController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");
const { uploadForModel } = require("../../middleware/upload");

router.use(auth);

router.post(
  "/add-electricity-bill",
  uploadForModel("electricity-bill").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 5 }, // حداکثر 5 عکس برای گالری
  ]),

  electricityBillController.addElectricityBill,
);

router.get(
  "/get-electricity-bills",
  electricityBillController.getElectricityBills,
);

router.post("/get-bill", auth, electricityBillController.getBill);

router.get(
  "/get-electricity-bills-comparison/:billIdentifier",
  electricityBillController.getElectricityBillsComparison,
);

router.get(
  "/get-electricity-bills-with-serial-number/:serialNumber",
  electricityBillController.getElectricityBillsWithSerialNumber,
);

router.get(
  "/get-date-electricity-bills/:billIdentifier",
  electricityBillController.getDateElectricityBills,
);

router.get(
  "/get-electricity-bill/:id",
  electricityBillController.getElectricityBillWithId,
);

router.put(
  "/edit-electricity-bill/:paymentIdentifier",
  electricityBillController.updateElectricityBillWithPaymentIdentifier,
);

router.delete(
  "/delete-electricity-bill/:paymentIdentifier",
  electricityBillController.deleteElectricityBill,
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  electricityBillController.uploadExcel,
);

module.exports = router;
