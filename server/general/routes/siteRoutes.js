const express = require("express");
const router = express.Router();
const siteController = require("../controllers/siteController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-site", siteController.addSite);

router.get("/get-sites", siteController.getSites);

router.get(
  "/get-site-with-postal-code/:postalCode",
  siteController.getSiteWithPostalCode
);

router.put("/edit-site/:postalCode", siteController.updateSite);

router.delete("/delete-site/:postalCode", siteController.deleteSite);

router.get("/search", siteController.searchSite);

router.post("/upload", uploadXlsx.single("file"), siteController.uploadExcel);

module.exports = router;
