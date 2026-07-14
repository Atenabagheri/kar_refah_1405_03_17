const express = require("express");
const router = express.Router();
const positionController = require("../controllers/positionController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-position", positionController.addPosition);

router.get("/get-positions", auth, positionController.getPositions);

router.get(
  "/get-position-with-position-code/:positionCode",
  positionController.getPositionWithCode
);

router.put("/edit-position/:positionCode", positionController.updatePosition);

router.patch(
  "/add-position-to-employee/:nationalId",
  positionController.addPositionToEmployee
);

router.delete(
  "/delete-position/:positionCode",
  positionController.deletePosition
);

router.get("/search", positionController.searchPosition);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  positionController.uploadExcel
);

module.exports = router;
