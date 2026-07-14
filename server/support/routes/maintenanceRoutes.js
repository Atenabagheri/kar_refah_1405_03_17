const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post(
  "/add-maintenance",
  maintenanceController.addMaintenance
);

router.get(
  "/get-maintenances",
  maintenanceController.getMaintenances
);

router.get(
  "/get-maintenance-by-document-number/:financialDocumentNumber",
  maintenanceController.getMaintenanceByDocumentNumber
);

router.put(
  "/edit-maintenance/:financialDocumentNumber",
  maintenanceController.updateMaintenance
);

router.delete(
  "/delete-maintenance/:financialDocumentNumber",
  maintenanceController.deleteMaintenance
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  maintenanceController.uploadExcel
);

module.exports = router;
