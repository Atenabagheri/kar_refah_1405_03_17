const express = require("express");
const router = express.Router();
const divisionController = require("../controllers/divisionController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-division", divisionController.addDivision);

router.get("/get-divisions", divisionController.getDivisions);

router.get(
  "/get-division-with-code/:divisionCode",
  divisionController.getDivisionWithCode
);

router.put("/edit-division/:divisionCode", divisionController.updateDivision);

router.delete(
  "/delete-division/:divisionCode",
  divisionController.deleteDivision
);

router.get("/search", divisionController.searchDivision);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  divisionController.uploadExcel
);

module.exports = router;
