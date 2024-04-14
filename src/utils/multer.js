const multer = require('multer');
const { dirname } = require('node:path');

/*const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${dirname(__dirname)}/public/images`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

exports.uploader = multer({ storage });

const multer = require('multer');
const { dirname, join } = require('node:path');*/


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = '';
    switch (file.fieldname) {
      case 'profile':
        folder = 'profiles';
        break;
      case 'thumbnails':
        folder = 'products';
        break;
      case 'updateThumbnails':
        folder = 'products';
        break;
      case 'document':
        folder = 'documents';
        break;
      case 'identificacion':
        folder = 'documents';
        break;
      case 'domicilio':
        folder = 'documents';
        break;
      case 'cuenta':
        folder = 'documents';
        break;
      default:
        folder = 'others';
    }
    cb(null, `${dirname(__dirname)}/public/files/${folder}`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

exports.uploader = multer({ storage });
