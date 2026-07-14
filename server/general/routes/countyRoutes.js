const express = require("express");
const router = express.Router();
const countyController = require("../controllers/countyController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-county", countyController.addCounty);

router.get("/get-counties", countyController.getCounties);

router.get("/get-county-with-name/:name", countyController.getCountyWithName);

router.get(
  "/get-counties-with-province/:provinceName",
  countyController.getCountiesWithProvince
);

router.get("/get-counties-for-cities", countyController.getCountiesForCities);

router.get(
  "/get-counties-with-province-and-city/:provinceName",
  countyController.getCountiesWithProvinceAndCity
);

router.put("/edit-county/:countyName", countyController.updateCounty);

router.delete("/delete-county/:countyName", countyController.deleteCounty);

router.get("/search", countyController.searchCounty);

router.post("/upload", uploadXlsx.single("file"), countyController.uploadExcel);

module.exports = router;
