const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-section", sectionController.addSection);

router.get("/get-sections", sectionController.getSections);

router.get(
  "/get-section-with-code/:sectionCode",
  sectionController.getSectionWithCode
);

router.get(
  "/get-sections-with-division/:divisionCode",
  sectionController.getSectionsWithDivision
);

router.put("/edit-section/:sectionCode", sectionController.updateSection);

router.delete("/delete-section/:sectionCode", sectionController.deleteSection);

router.get("/search", sectionController.searchSection);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  sectionController.uploadExcel
);

module.exports = router;
