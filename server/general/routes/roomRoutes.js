const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const uploadXlsx = require("../../middleware/uploadXlsx");
const { uploadForModel } = require("../../middleware/upload");
const auth = require("../../middleware/auth");

router.use(auth);

router.post(
  "/add-room",
  uploadForModel("rooms").fields([
    { name: "image", maxCount: 1 }, // یک تصویر
    { name: "gallery", maxCount: 5 }, // حداکثر 5 عکس برای گالری
  ]),
  roomController.addRoom
);

router.get("/get-rooms", roomController.getRooms);

router.get("/get-room-with-number/:number", roomController.getRoomWithNumber);

router.put("/edit-room/:number", roomController.updateRoom);

router.patch(
  "/add-room-to-employee/:nationalId",
  roomController.addRoomToEmployee
);

router.patch(
  "/remove-room-from-employee/:nationalId",
  roomController.removeRoomFromEmployee
);

router.patch(
  "/add-room-to-asset/:assetSerialNumber",
  roomController.addRoomToAsset
);

router.patch(
  "/remove-room-from-asset/:assetSerialNumber",
  roomController.removeRoomFromAsset
);

router.delete("/delete-room/:number", roomController.deleteRoom);

router.get("/search", roomController.searchRoom);

router.post("/upload", uploadXlsx.single("file"), roomController.uploadExcel);

module.exports = router;
