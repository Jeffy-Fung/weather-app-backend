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
      response = serialize_result_data(result)
      return res.status(200).json(response);
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

const serialize_result_data = (result) => {
  const { data, cached, timestamp, source, language } = result;

  const rainfallData = data.rainfall.data;
  const functionalRainfall = rainfallData.filter(item => item.main == "FALSE");
  const averageRainfall = functionalRainfall.reduce((acc, item) => acc + item.max, 0) / functionalRainfall.length;

  const allUsedUnit = rainfallData.map(item => item.unit);
  const uniqueUnits = [...new Set(allUsedUnit)];
  if (uniqueUnits.length > 1) throw new Error('Rainfall data has multiple units');

  return {
    data: {
      averageRainfall: {
        unit: uniqueUnits[0],
        value: averageRainfall,
        startTime: data.rainfall.startTime,
        endTime: data.rainfall.endTime
      },
      temperature: {
        // TODO: better retrieve result from data collected from specific location
        ...data.temperature.data[1],
        recordTime: data.temperature.recordTime,
      },
      specialWxTips: data.specialWxTips,
      warningMessage: data.warningMessage,
      uvindex: {
        ...data.uvindex.data[0],
        recordDesc: data.uvindex.recordDesc,
      },
      humidity: {
        ...data.humidity.data[0],
        recordTime: data.humidity.recordTime,
      },
      updateTime: data.updateTime,
      tcmessage: data.tcmessage,
    },
    cached: cached || false,
    timestamp: timestamp,
    source: source,
    language: language
  }
}

module.exports = {
  getCurrentWeather
};
