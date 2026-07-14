const multer = require("multer");
const storage = multer.diskStorage({
    destination: "files/",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
module.exports = multer({ storage });