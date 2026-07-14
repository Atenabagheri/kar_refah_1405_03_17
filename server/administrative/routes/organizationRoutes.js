const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post("/add-organization", organizationController.addOrganization);

router.get(
  "/get-organizations/:dateCategory",
  organizationController.getOrganizations
);

router.get(
  "/get-organizations-in-province/:dateCategory",
  organizationController.getOrganizationsInProvance
);

router.get(
  "/get-organization-with-province/:dateCategory/:provinceName",
  organizationController.getOrganizationWithProvince
);

router.put(
  "/edit-organization-with-province/:dateCategory/:provinceName",
  organizationController.updateOrganizationWithProvince
);

router.delete(
  "/delete-organization/:dateCategory/:provinceName",
  organizationController.deleteOrganization
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  organizationController.uploadExcel
);

module.exports = router;
