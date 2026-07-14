const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const auth = require("../../middleware/auth");
const { uploadForModel } = require("../../middleware/upload");

router.use(auth);

router.post(
  "/add-employee",
  uploadForModel("employee").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 5 }, // حداکثر 5 عکس برای گالری
  ]),
  employeeController.addEmployee,
);

router.get("/get-employees", auth, employeeController.getEmployees);
router.get("/get-employees-form", auth, employeeController.getEmployeesForFrom);

router.get(
  "/get-employee-with-national-id/:nationalId",
  auth,
  employeeController.getEmployeeWithNationalId,
);

router.put("/edit-employee/:nationalId", employeeController.updateEmployee);

router.delete(
  "/delete-employee/:nationalId",
  employeeController.deleteEmployee,
);

router.get("/search", employeeController.searchEmployee);

router.post(
  "/upload",
  uploadXlsx.single("file"),
  employeeController.uploadExcel,
);

module.exports = router;
