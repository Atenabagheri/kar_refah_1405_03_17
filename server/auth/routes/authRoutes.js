const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../../middleware/auth");

router.post("/signing", authController.signing);
router.post("/access", authController.access);
router.get("/me", auth, authController.getMe);
router.patch("/update-password", auth, authController.updatePassword);
router.get("/signout", authController.signout);
module.exports = router;
