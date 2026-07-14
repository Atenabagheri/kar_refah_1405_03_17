const express = require("express");
const router = express.Router();
const unitPositionController = require("../controllers/unitPositionController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-unit-position", unitPositionController.addUnitPosition);

router.get(
  "/get-unit-positions/:dateCategory",
  unitPositionController.getUnitPositions
);

router.get(
  "/get-total-unit-positions-with-province-and-organization/:dateCategory",
  unitPositionController.getTotalUnitPositionsWithProvinceAndOrganization
);

router.get(
  "/get-unit-positions-with-province/:dateCategory/:provinceName",
  unitPositionController.getUnitPositionsWithProvince
);

router.get(
  "/get-unit-position-with-county-name/:dateCategory/:countyName",
  unitPositionController.getUnitPositionWithCountyName
);

router.get(
  "/get-unit-position-with-city-name/:dateCategory/:cityName",
  unitPositionController.getUnitPositionWithCityName
);

router.put(
  "/edit-unit-position-with-county/:dateCategory/:countyName",
  unitPositionController.updateUnitPositionWithCounty
);

router.put(
  "/edit-unit-position-with-city/:dateCategory/:cityName",
  unitPositionController.updateUnitPositionWithCity
);

router.delete(
  "/delete-unit-position/:dateCategory/:countyName",
  unitPositionController.deleteUnitPosition
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  unitPositionController.uploadExcel
);

module.exports = router;
