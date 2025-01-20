const express = require('express');
const { registerController, loginController,getUserController, getVendorsController, uploadFileController,getUserFilesController } = require('./auth.controller');
const verifyToken = require('../../middleware/jwt/jwt');
const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/user', verifyToken, getUserController);
router.get('/vendors', verifyToken, getVendorsController);
router.post('/upload-file', verifyToken, uploadFileController);
// Get files uploaded by the authenticated user
router.get('/user-files', verifyToken, getUserFilesController);
module.exports = router;
