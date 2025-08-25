const express = require('express');
const router = express.Router();

// GET /api
router.get('/', (req, res) => {
  res.json({ message: 'Weather API is working!' });
});

// GET /api/weather
router.get('/weather', (req, res) => {
  res.json({
    weather: 'sunny',
    temperature: 25,
    humidity: 60,
    location: 'New York'
  });
});

module.exports = router;
