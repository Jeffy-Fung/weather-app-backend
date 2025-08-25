const express = require('express');
const router = express.Router();
const { getCurrentWeather } = require('../controllers/weatherController');

/**
 * @route   GET /api/v1/weather/current
 * @desc    Get current weather data from Hong Kong Observatory
 * @access  Public
 * @param   {string} lang - Language parameter (tc, sc, en)
 */
router.get('/current', getCurrentWeather);

module.exports = router;
