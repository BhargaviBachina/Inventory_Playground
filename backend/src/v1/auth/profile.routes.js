const express = require('express');
const { updateProfilePicture } = require('./profile.controller');
const { uploadProfilePicture } = require('../../aws/s3/s3.service');
const verifyToken = require('../../middleware/jwt/jwt');

const router = express.Router();

router.post('/upload-profile-picture', verifyToken, uploadProfilePicture.single('profilePicture'), updateProfilePicture);

module.exports = router;
