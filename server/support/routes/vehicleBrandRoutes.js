const express = require("express");
const router = express.Router();
const vehicleBrandController = require("../controllers/vehicleBrandController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-vehicle-brand", vehicleBrandController.addVehicleBrand);

router.get("/get-vehicle-brands", vehicleBrandController.getVehicleBrands);

router.get(
  "/get-vehicle-brand-with-name/:brandName",
  vehicleBrandController.getVehicleBrandWithBrandName
);

router.put(
  "/edit-vehicle-brand/:brandName",
  vehicleBrandController.updateVehicleBrandWithBrandName
);

router.delete(
  "/delete-vehicle-brand/:brandName",
  vehicleBrandController.deleteVehicleBrand
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  vehicleBrandController.uploadExcel
);

module.exports = router;
