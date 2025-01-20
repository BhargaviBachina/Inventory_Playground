const express = require('express');
const router = express.Router();
const productRoutes = require('./auth/productRoutes'); 

const authRoutes = require('./auth/auth.routes');
const profileRoutes = require('./auth/profile.routes');

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/products', productRoutes);

module.exports = router;
