const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const auth = require("../../middleware/auth");

router.use(auth);

router.get("/", dashboardController.getDashboardInfo);
router.get(
  "/electricity-meters",
  dashboardController.getElectricityMetersWithLastBill
);

router.get("/water-meters", dashboardController.getWaterMetersWithLastBill);
router.get("/gas-meters", dashboardController.getGasMetersWithLastBill);

router.get("/province/:provinceName", dashboardController.getProvinceDetails);

module.exports = router;
