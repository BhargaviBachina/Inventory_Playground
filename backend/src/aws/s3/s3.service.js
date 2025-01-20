const multer = require('multer');
const multerS3 = require('multer-s3');
const { s3 } = require('./s3.config');
require('dotenv').config();


const uploadProfilePicture = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    // acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      if (!req.user) {
        return cb(new Error('Unauthorized: User not authenticated'));
      }
      const userId = req.user.user_id;
      const folderName = 'profile-pictures';
      const fileName = `${userId}-${Date.now()}-${file.originalname}`;
      cb(null, `${folderName}/${fileName}`);
    },
  }),
});

// Upload Product Image
const uploadProductImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      // You can implement authorization logic here if needed (e.g. verify if the user has permission to upload a product image)
      const folderName = 'product-images';
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, `${folderName}/${fileName}`);
    },
  }),
});

// Upload General Files (Documents, PDFs, etc.)
const uploadFile = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      // Create a new folder 'general-files' or adjust the folder name as needed
      const folderName = 'general-files';
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, `${folderName}/${fileName}`);
    },
  }),
});


module.exports = { uploadProfilePicture, uploadProductImage, uploadFile };

