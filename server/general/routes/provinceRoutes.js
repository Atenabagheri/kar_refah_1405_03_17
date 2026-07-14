const express = require("express");
const router = express.Router();
const provinceController = require("../controllers/provinceController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-province", provinceController.addProvince);

router.get("/get-provinces", provinceController.getProvinces);

router.get(
  "/get-province-with-name/:name",
  provinceController.getProvinceWithName
);

router.put("/edit-province/:provinceName", provinceController.updateProvince);

router.delete(
  "/delete-province/:provinceName",
  provinceController.deleteProvince
);

router.get("/search", provinceController.searchProvince);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  provinceController.uploadExcel
);

module.exports = router;
