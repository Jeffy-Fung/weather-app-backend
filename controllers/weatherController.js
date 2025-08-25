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

/**
 * Clear weather cache
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const clearCache = async (req, res) => {
  try {
    const { lang } = req.query;
    
    // Validate language parameter if provided
    if (lang && !weatherService.isValidLanguage(lang)) {
      return res.status(422).json({
        error: 'Invalid language parameter',
        message: 'Language must be one of: tc, sc, en',
      });
    }

    await weatherService.clearCache(lang);
    
    return res.status(200).json({
      message: lang ? `Cache cleared for language: ${lang}` : 'All weather cache cleared',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Clear cache error:', error);
    return res.status(500).json({
      error: 'Failed to clear cache',
      message: error.message,
    });
  }
};

/**
 * Get cache information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCacheInfo = async (req, res) => {
  try {
    const { lang = 'tc' } = req.query;
    
    // Validate language parameter
    if (!weatherService.isValidLanguage(lang)) {
      return res.status(422).json({
        error: 'Invalid language parameter',
        message: 'Language must be one of: tc, sc, en',
      });
    }

    const cacheInfo = await weatherService.getCacheInfo(lang);
    
    return res.status(200).json({
      cacheInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get cache info error:', error);
    return res.status(500).json({
      error: 'Failed to get cache info',
      message: error.message,
    });
  }
};

module.exports = {
  getCurrentWeather,
  clearCache,
  getCacheInfo
};
