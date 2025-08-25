const express = require('express');
const router = express.Router();
const { getCurrentWeather, clearCache, getCacheInfo } = require('../controllers/weatherController');

/**
 * @route   GET /api/v1/weather/current
 * @desc    Get current weather data from Hong Kong Observatory
 * @access  Public
 * @param   {string} lang - Language parameter (tc, sc, en)
 */
router.get('/current', getCurrentWeather);

/**
 * @route   DELETE /api/v1/weather/cache
 * @desc    Clear weather cache
 * @access  Public
 * @param   {string} lang - Language parameter (optional, if not provided clears all)
 */
router.delete('/cache', clearCache);

/**
 * @route   GET /api/v1/weather/cache
 * @desc    Get cache information
 * @access  Public
 * @param   {string} lang - Language parameter (tc, sc, en)
 */
router.get('/cache', getCacheInfo);

module.exports = router;
