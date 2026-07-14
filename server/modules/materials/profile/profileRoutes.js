const express = require("express");
const router = express.Router();
const profileController = require("./profileController");

router.post("/add-profile", profileController.addProfile);
router.get("/get-profiles", profileController.getProfiles);
router.get("/get-profile/:code", profileController.getProfileByCode);

module.exports = router;
