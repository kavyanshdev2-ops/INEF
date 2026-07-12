
const express = require('express');
const router = express.Router();
const paymentRoutes = require('./payment');
const cmsRoutes = require('./cms');

router.use('/payment', paymentRoutes);
router.use('/cms', cmsRoutes);

module.exports = router;
