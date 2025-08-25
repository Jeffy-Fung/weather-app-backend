const HongKongObservatoryWeatherService = require('../services/hongkong-observatory/weatherService');

// Initialize weather service
const weatherService = new HongKongObservatoryWeatherService();

/**
 * Get current weather data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCurrentWeather = async (req, res) => {
  try {
    const { lang = 'tc' } = req.query;
    
    // Validate language parameter
    if (!weatherService.isValidLanguage(lang)) {
      return res.status(422).json({
        error: 'Invalid language parameter',
        message: 'Language must be one of: tc, sc, en',
      });
    }

    // Fetch weather data
    const result = await weatherService.getCurrentWeather(lang);
    
    if (result.success) {
      return res.status(200).json({
        data: result.data,
        cached: result.cached || false,
        timestamp: result.timestamp,
        source: result.source,
        language: result.language
      });
    } else {
      return res.status(500).json({
        error: 'Failed to fetch weather data',
        message: result.error,
      });
    }

  } catch (error) {
    console.error('Controller error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request',
    });
  }
};

module.exports = {
  getCurrentWeather
};
