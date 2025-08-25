const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const redisClient = require('./config/redis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Redis connection
async function initializeRedis() {
  try {
    await redisClient.connect();
    console.log('✅ Redis connection established');
  } catch (error) {
    console.warn('⚠️  Redis connection failed:', error.message);
    console.log('📝 Weather service will work without caching');
  }
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Weather App Backend!',
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    redis: redisClient.isRedisConnected() ? 'connected' : 'disconnected'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    redis: redisClient.isRedisConnected() ? 'connected' : 'disconnected'
  });
});

// API routes
app.use('/api', require('./routes/index'));

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await redisClient.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await redisClient.disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, async () => {
  console.log('🚀 Server is running on port ' + PORT);
  console.log('🏥 Health check: http://localhost:' + PORT + '/health');
  
  // Initialize Redis after server starts
  await initializeRedis();
});
