const axios = require('axios');
const redisClient = require('../../config/redis');

class HongKongObservatoryWeatherService {
  constructor() {
    this.baseURL = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php';
    this.dataType = 'rhrread';
    this.cacheTTL = 300; // 5 minutes in seconds
  }

  /**
   * Generate cache key for weather data
   * @param {string} lang - Language parameter
   * @returns {string} Cache key
   */
  generateCacheKey(lang) {
    return `weather:hongkong:${this.dataType}:${lang}`;
  }

  /**
   * Fetch current weather data from Hong Kong Observatory with Redis caching
   * @param {string} lang - Language parameter (tc, sc, en)
   * @returns {Promise<Object>} Weather data
   */
  async getCurrentWeather(lang = 'tc') {
    const cacheKey = this.generateCacheKey(lang);
    
    try {
      // Try to get data from cache first
      if (redisClient.isRedisConnected()) {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          return {
            ...cachedData,
            cached: true,
            cacheKey: cacheKey
          };
        }
      }

      // If not in cache, fetch from API
      const url = `${this.baseURL}?dataType=${this.dataType}&lang=${lang}`;
      
      console.log(`Fetching weather data from: ${url}`);
      
      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'Weather-App-Backend/1.0',
          'Accept': 'application/json'
        }
      });

      const weatherData = {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
        source: 'Hong Kong Observatory',
        language: lang,
        cached: false
      };

      // Cache the result if Redis is available
      if (redisClient.isRedisConnected()) {
        try {
          await redisClient.set(cacheKey, weatherData, this.cacheTTL);
        } catch (cacheError) {
          console.warn('Failed to cache weather data:', cacheError.message);
          // Continue without caching - don't fail the request
        }
      }

      return weatherData;

    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      
      const errorData = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        source: 'Hong Kong Observatory',
        language: lang,
        cached: false
      };

      return errorData;
    }
  }

  /**
   * Get available languages
   * @returns {Array} Available language options
   */
  getAvailableLanguages() {
    return [
      { code: 'tc', name: 'Traditional Chinese', description: '繁體中文' },
      { code: 'sc', name: 'Simplified Chinese', description: '简体中文' },
      { code: 'en', name: 'English', description: 'English' }
    ];
  }

  /**
   * Validate language parameter
   * @param {string} lang - Language code to validate
   * @returns {boolean} Whether language is valid
   */
  isValidLanguage(lang) {
    const validLanguages = this.getAvailableLanguages().map(l => l.code);
    return validLanguages.includes(lang);
  }
}

module.exports = HongKongObservatoryWeatherService;
