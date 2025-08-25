const express = require('express');
const router = express.Router();

// API v1 routes
router.use('/v1/weather', require('./weather'));

module.exports = router;
