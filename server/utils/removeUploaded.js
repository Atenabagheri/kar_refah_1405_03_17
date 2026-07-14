const path = require("path");
const fs = require("fs");

const removeUploaded = async (imagePath) => {
  const fullPath = path.join(__dirname, "..", imagePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};
module.exports = removeUploaded;
