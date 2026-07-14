const express = require("express");
const router = express.Router();
const insuranceController = require("../controllers/insuranceController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const { uploadForModel } = require("../../middleware/upload");
const auth = require("../../middleware/auth");

router.use(auth);

router.post(
  "/add-insurance",
  uploadForModel("insurance").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 10 }, // حداکثر 5 عکس برای گالری
  ]),
  insuranceController.addInsurance,
);

router.get("/get-insurances", insuranceController.getInsurances);

router.get(
  "/get-insurance-with-invonce-number/:insuranceCode",
  insuranceController.getInsuranceByInsuranceCode,
);

router.put(
  "/edit-insurance/:insuranceCode",
  insuranceController.updateInsurance,
);

router.delete(
  "/delete-insurance/:insuranceCode",
  insuranceController.deleteInsurance,
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  insuranceController.uploadExcel,
);

module.exports = router;
