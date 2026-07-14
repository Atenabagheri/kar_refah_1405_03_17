const express = require("express");
const router = express.Router();
const buildingController = require("../controllers/buildingController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");
const { uploadForModel } = require("../../middleware/upload");

router.use(auth);

router.post(
  "/add-building",
  uploadForModel("buildings").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 5 }, // حداکثر 5 عکس برای گالری
  ]),
  buildingController.addBuilding,
);

router.get("/get-buildings", buildingController.getBuildings);

router.get("/get-info-dashboard", buildingController.getInfoDashboard);

router.get(
  "/get-buildings-with-roles",
  auth,
  buildingController.getBuildingsWithRoles,
);

router.get(
  "/get-buildings-with-site/:site",
  buildingController.getBuildingsWithSite,
);

router.get(
  "/get-building-with-postal-code/:postalCode",
  auth,
  buildingController.getBuildingWithPostalCode,
);

router.put("/edit-building/:postalCode", buildingController.updateBuilding);

router.delete(
  "/delete-building/:postalCode",
  buildingController.deleteBuilding,
);

router.get("/search", buildingController.searchBuilding);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  buildingController.uploadExcel,
);

module.exports = router;
