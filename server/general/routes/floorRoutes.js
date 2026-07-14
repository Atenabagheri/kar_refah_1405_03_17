const express = require("express");
const router = express.Router();
const floorController = require("../controllers/floorController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-floor", floorController.addFloor);

router.get("/get-floors", floorController.getFloors);

router.get(
  "/get-floor-with-number/:number",
  floorController.getFloorWithNumber
);

router.put("/edit-floor/:number", floorController.updateFloor);

router.delete("/delete-floor/:number", floorController.deleteFloor);

router.get("/search", floorController.searchFloor);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  floorController.uploadExcel
);

module.exports = router;
