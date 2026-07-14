const express = require("express");
const router = express.Router();
const assetCategoryController = require("../controllers/assetCategoryController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-asset-category", assetCategoryController.addAssetCategory);

router.get("/get-asset-categories", assetCategoryController.getAssetCategories);

router.get(
  "/get-asset-category-with-code/:assetCategoryCode",
  assetCategoryController.getAssetCategoryWithCode
);

router.put("/edit-asset-category/:assetCategoryCode", assetCategoryController.updateAssetCategory);

router.delete(
  "/delete-asset-category/:assetCategoryCode",
  assetCategoryController.deleteAssetCategory
);

router.get("/search", assetCategoryController.searchAssetCategory);

router.post("/upload", uploadXlsx.single("file"), assetCategoryController.uploadExcel);

module.exports = router;
