const axios = require('axios');

class HongKongObservatoryWeatherService {
  constructor() {
    this.baseURL = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php';
    this.dataType = 'rhrread';
  }

  /**
   * Fetch current weather data from Hong Kong Observatory
   * @param {string} lang - Language parameter (tc, sc, en)
   * @returns {Promise<Object>} Weather data
   */
  async getCurrentWeather(lang = 'tc') {
    try {
      const url = `${this.baseURL}?dataType=${this.dataType}&lang=${lang}`;
      
      console.log(`Fetching weather data from: ${url}`);
      
      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'Weather-App-Backend/1.0',
          'Accept': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
        source: 'Hong Kong Observatory',
        language: lang
      };

    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        source: 'Hong Kong Observatory',
        language: lang
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
