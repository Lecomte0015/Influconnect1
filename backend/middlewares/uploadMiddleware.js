const multer = require('multer');
const path = require('path');

//  Destination du fichier dans /public/conversations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/conversations'));
  },
  filename: function (req, file, cb) {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, safeName);
  }
});

// Export du middleware
const upload = multer({ storage });
module.exports = upload;
