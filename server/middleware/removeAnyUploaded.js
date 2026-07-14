const path = require("path");
const fs = require("fs");

const removeAnyUploaded = async (galleryPaths) => {
  galleryPaths.forEach((galleryPath) => {
    const fullPath = path.join(__dirname, "..", galleryPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  });
};
module.exports = removeAnyUploaded;
