const express = require("express");
const router = express.Router();
const dateCategoryController = require("../controllers/dateCategoryController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-date-category", dateCategoryController.addDateCategory);

router.get("/get-date-categories", dateCategoryController.getDateCategories);

router.get(
  "/get-date-category-with-code/:dateCategoryCode",
  dateCategoryController.getDateCategoryWithCode
);

router.put(
  "/edit-date-category/:dateCategoryCode",
  dateCategoryController.updateDateCategory
);

router.delete(
  "/delete-date-category/:dateCategoryCode",
  dateCategoryController.deleteDateCategory
);

router.get("/search", dateCategoryController.searchDateCategory);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  dateCategoryController.uploadExcel
);

module.exports = router;
