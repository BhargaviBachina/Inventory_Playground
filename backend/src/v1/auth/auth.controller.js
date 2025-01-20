const { register, login } = require('./auth.service');
const { getUserData } = require('./auth.service');
const db = require('../../../config/db');
const {uploadFile} = require('../../aws/s3/s3.service');

const registerController = (req, res) => {
  register(req.body)
    .then((response) => res.status(201).json(response))
    .catch((err) => res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' }));
};

const loginController = (req, res) => {
  login(req.body)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' }));
};

const getUserController = (req, res) => {
  const userId = req.user.user_id;  // Retrieve user_id from the decoded token

  getUserData(userId)  // Call service to get user data
    .then((userData) => {
      res.status(200).json(userData);  // Return the user data as response
    })
    .catch((err) => {
      res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
    });

    
};

const getVendorsController = (req, res) => {
  db('vendors')
    .select('vendor_id', 'vendor_name')
    .then((vendors) => {
      res.status(200).json(vendors);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to fetch vendors', error: err.message });
    });
};

// Upload General Files (Documents, PDFs, etc.)
const uploadFileController = (req, res) => {
  uploadFile.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: err.message || 'Failed to upload file' });
    }

    // Assuming req.user.user_id contains the authenticated user's ID
    const userId = req.user.user_id;
    const fileUrl = req.file.location; // URL of the uploaded file in S3
    const fileName = req.file.key; // The S3 key of the file

    // Save the file metadata (file URL and user ID) to the database
    db('user_files')
      .insert({
        user_id: userId,
        file_url: fileUrl,
        file_name: fileName,
        created_at: new Date(),
      })
      .then(() => {
        res.status(200).json({ message: 'File uploaded successfully', fileUrl: req.file.location });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Failed to save file metadata', error: err.message });
      });
  });
};

const getUserFilesController = (req, res) => {
  const userId = req.user.user_id; // Get the authenticated user's ID

  // Query the database to get all files uploaded by the user
  db('user_files')
    .select('file_url', 'file_name', 'created_at')
    .where('user_id', userId)
    .then((files) => {
      if (files.length > 0) {
        res.status(200).json({ message: 'User files retrieved successfully', files });
      } else {
        res.status(404).json({ message: 'No files found for this user' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Failed to retrieve user files', error: err.message });
    });
};

module.exports = { registerController, loginController,getUserController,getVendorsController, uploadFileController, getUserFilesController};
