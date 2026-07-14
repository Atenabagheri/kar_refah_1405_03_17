const express = require("express");
const router = express.Router();
const vehicleTypeController = require("../controllers/vehicleTypeController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const uploadFile = require("../../middleware/uploadFile");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-vehicle-type", vehicleTypeController.addVehicleType);

router.get("/get-vehicle-types", vehicleTypeController.getVehicleTypes);

router.get(
  "/get-vehicle-type-with-name/:typeName",
  vehicleTypeController.getVehicleTypeWithName
);

router.put(
  "/edit-vehicle-type/:typeName",
  vehicleTypeController.updateVehicleTypeWithName
);

router.delete(
  "/delete-vehicle-type/:typeName",
  vehicleTypeController.deleteVehicleType
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  vehicleTypeController.uploadExcel
);

router.post(
  "/upload-file",
  uploadFile.single("file"),
  vehicleTypeController.uploadFile
);

module.exports = router;
