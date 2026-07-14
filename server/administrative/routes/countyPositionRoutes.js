const express = require("express");
const router = express.Router();
const countyPositionController = require("../controllers/countyPositionController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-county-position", countyPositionController.addCountyPosition);

router.get("/get-county-positions", countyPositionController.getCountyPositions);

router.get(
  "/get-county-positions-with-province/:provinceName",
  countyPositionController.getCountyPositionsWithProvince
);

router.get(
  "/get-county-position-with-county-name/:countyName",
  countyPositionController.getCountyPositionWithCountyName
);

router.get(
  "/get-county-position-with-city-name/:cityName",
  countyPositionController.getCountyPositionWithCityName
);

router.put(
  "/edit-county-position-with-county/:countyName",
  countyPositionController.updateCountyPositionWithCounty
);

router.put(
  "/edit-county-position-with-city/:cityName",
  countyPositionController.updateCountyPositionWithCity
);

router.delete(
  "/delete-county-position/:countyName",
  countyPositionController.deleteCountyPosition
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  countyPositionController.uploadExcel
);

module.exports = router;
