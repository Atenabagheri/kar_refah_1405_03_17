const express = require("express");
const router = express.Router();
const dieselController = require("../controllers/dieselController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");
const { uploadForModel } = require("../../middleware/upload");

router.use(auth);

router.post(
  "/add-diesel",
  uploadForModel("diesel").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 5 }, // حداکثر 5 عکس برای گالری
  ]),
  dieselController.addDiesel,
);

router.get("/get-diesels", auth, dieselController.getDiesels);

router.get(
  "/get-diesel-with-document-number/:documentNumber",
  dieselController.getDieselWithDocumentNumber,
);

router.put(
  "/edit-diesel/:documentNumber",
  dieselController.updateDieselWithDocumentNumber,
);

router.delete("/delete-diesel/:documentNumber", dieselController.deleteDiesel);

router.post("/upload", uploadXlsx.single("file"), dieselController.uploadExcel);

module.exports = router;
