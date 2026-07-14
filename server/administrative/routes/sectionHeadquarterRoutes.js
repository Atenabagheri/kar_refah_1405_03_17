const express = require("express");
const router = express.Router();
const sectionHeadquarterController = require("../controllers/sectionHeadquarterController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post(
  "/add-section-headquarter",
  sectionHeadquarterController.addSectionHeadquarter
);

router.get(
  "/get-section-headquarters/:dateCategory",
  sectionHeadquarterController.getSectionHeadquarters
);

router.get(
  "/get-section-headquarter-with-section/:dateCategory/:sectionCode",
  sectionHeadquarterController.getSectionHeadquarterWithSection
);

router.get(
  "/get-section-headquarters-with-division/:dateCategory/:divisionCode",
  sectionHeadquarterController.getSectionHeadquartersWithDivision
);

router.get(
  "/get-total-section-headquarters-for-division/:dateCategory",
  sectionHeadquarterController.getTotalSectionHeadquartersForDivision
);

router.get(
  "/get-total-section-headquarters/:dateCategory",
  sectionHeadquarterController.getTotalSectionHeadquarters
);

router.put(
  "/edit-section-headquarter/:dateCategory/:sectionCode",
  sectionHeadquarterController.updateSectionHeadquarterWithSection
);

router.delete(
  "/delete-section-headquarter/:dateCategory/:sectionCode",
  sectionHeadquarterController.deleteSectionHeadquarter
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  sectionHeadquarterController.uploadExcel
);

module.exports = router;
