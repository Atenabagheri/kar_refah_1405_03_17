const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-asset", assetController.addAsset);

router.get("/get-assets", auth, assetController.getAssets);

router.get("/get-info-dashboard", assetController.getInfoDashboard);

router.get(
  "/get-asset-with-serial-number/:assetSerialNumber",
  assetController.getAssetWithSerialNumber
);

router.put("/edit-asset/:assetSerialNumber", assetController.updateAsset);

router.patch(
  "/add-asset-to-employee/:nationalId",
  assetController.addAssetToEmployee
);

router.patch(
  "/remove-asset-from-employee/:nationalId",
  assetController.removeAssetFromEmployee
);

router.delete("/delete-asset/:assetSerialNumber", assetController.deleteAsset);

router.get("/search", assetController.searchAsset);

router.post("/upload", uploadXlsx.single("file"), assetController.uploadExcel);

module.exports = router;
