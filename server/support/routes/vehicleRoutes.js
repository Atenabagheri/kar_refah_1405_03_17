const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");
const { uploadForModel } = require("../../middleware/upload");

router.use(auth);

router.post(
  "/add-vehicle",
  uploadForModel("vehicles").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 5 }, // حداکثر 5 عکس برای گالری
  ]),
  vehicleController.addVehicle,
);

router.get("/get-vehicles", vehicleController.getVehicles);
router.get("/get-info-dashboard", vehicleController.getInfoDashboard);

router.get(
  "/get-vehicles-with-type",
  auth,
  vehicleController.getVehiclesWithType,
);

router.get(
  "/get-vehicle-with-vin/:vin",
  auth,
  vehicleController.getVehicleWithVin,
);

router.get(
  "/get-vehicles-with-brand/:brandName",
  vehicleController.getVehiclesWithBrand,
);

router.put("/edit-vehicle/:vin", vehicleController.updateVehicleWithVin);

router.delete("/delete-vehicle/:vin", vehicleController.deleteVehicle);

router.get("/search", vehicleController.searchVehicle);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  vehicleController.uploadExcel,
);

module.exports = router;
