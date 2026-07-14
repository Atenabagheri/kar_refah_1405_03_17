const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-city", cityController.addCity);

router.get("/get-cities", cityController.getCities);

router.get("/get-city-with-name/:name", cityController.getCityWithName);

router.get(
  "/get-cities-with-province/:provinceName",
  cityController.getCitiesWithProvince
);

router.get(
  "/get-cities-with-county/:countyName",
  cityController.getCitiesWithCounty
);

router.put("/edit-city/:cityName", cityController.updateCity);

router.delete("/delete-city/:cityName", cityController.deleteCity);

router.get("/search", cityController.searchCity);

router.post("/upload", uploadXlsx.single("file"), cityController.uploadExcel);

module.exports = router;
