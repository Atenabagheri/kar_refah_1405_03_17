const express = require("express");
const router = express.Router();
const greenBillController = require("../controllers/greenBillController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");

router.use(auth);

router.post(
  "/add-green-bill",
  greenBillController.addGreenBill
);

router.get(
  "/get-green-bills",
  greenBillController.getGreenBills
);

router.post("/get-bill", greenBillController.getBill);

router.get(
  "/get-green-bills-comparison/:serialNumber",
  greenBillController.getGreenBillsComparison
);

router.get(
  "/get-green-bills-with-serial-number/:serialNumber",
  greenBillController.getGreenBillsWithSerialNumber
);

router.get(
  "/get-date-green-bills/:serialNumber",
  greenBillController.getDateGreenBills
);

router.get(
  "/get-green-bill-with-payment-identifier/:paymentIdentifier",
  greenBillController.getGreenBillWithPaymentIdentifier
);

router.put(
  "/edit-green-bill/:paymentIdentifier",
  greenBillController.updateGreenBillWithPaymentIdentifier
);

router.delete(
  "/delete-green-bill/:_id",
  greenBillController.deleteGreenBill
);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  greenBillController.uploadExcel
);

module.exports = router;
