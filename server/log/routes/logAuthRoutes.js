const express = require("express");
const router = express.Router();
const logAuthController = require("../controllers/logAuthController");

router.get("/get-logs-auth", logAuthController.getLogsAuth);

module.exports = router;
