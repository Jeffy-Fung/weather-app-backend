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
   * Clear cache for specific language or all weather data
   * @param {string} lang - Language parameter (optional, if not provided clears all)
   */
  async clearCache(lang = null) {
    if (!redisClient.isRedisConnected()) {
      throw new Error('Redis client not connected');
    }

    try {
      if (lang) {
        // Clear cache for specific language
        const cacheKey = this.generateCacheKey(lang);
        await redisClient.del(cacheKey);
        console.log(`Cleared cache for language: ${lang}`);
      } else {
        // Clear all weather cache keys
        const client = redisClient.getClient();
        const keys = await client.keys('weather:hongkong:*');
        
        if (keys.length > 0) {
          await client.del(keys);
          console.log(`Cleared ${keys.length} weather cache keys`);
        } else {
          console.log('No weather cache keys found to clear');
        }
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  /**
   * Get cache status and information
   * @param {string} lang - Language parameter
   */
  async getCacheInfo(lang = 'tc') {
    if (!redisClient.isRedisConnected()) {
      return {
        connected: false,
        message: 'Redis client not connected'
      };
    }

    try {
      const cacheKey = this.generateCacheKey(lang);
      const client = redisClient.getClient();
      
      // Check if key exists and get TTL
      const exists = await client.exists(cacheKey);
      const ttl = exists ? await client.ttl(cacheKey) : -1;
      
      return {
        connected: true,
        key: cacheKey,
        exists: exists === 1,
        ttl: ttl > 0 ? ttl : null,
        ttlFormatted: ttl > 0 ? `${Math.floor(ttl / 60)}m ${ttl % 60}s` : null
      };
    } catch (error) {
      console.error('Error getting cache info:', error);
      return {
        connected: true,
        error: error.message
      };
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
