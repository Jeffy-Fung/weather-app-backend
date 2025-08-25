const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Initialize Redis client
   */
  async connect() {
    try {
      // Create Redis client with default configuration
      // You can customize these settings based on your Redis server
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          connectTimeout: 10000,
          lazyConnect: true
        }
      });

      // Handle connection events
      this.client.on('connect', () => {
        console.log('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        console.error('Redis client error:', err);
        this.isConnected = false;
      });

      this.client.on('end', () => {
        console.log('Redis client disconnected');
        this.isConnected = false;
      });

      // Connect to Redis
      await this.client.connect();
      
      return this.client;
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  /**
   * Get Redis client instance
   */
  getClient() {
    return this.client;
  }

  /**
   * Check if Redis is connected
   */
  isRedisConnected() {
    return this.isConnected && this.client;
  }

  /**
   * Set key-value pair with TTL
   * @param {string} key - Cache key
   * @param {string} value - Value to cache
   * @param {number} ttl - Time to live in seconds
   */
  async set(key, value, ttl = 300) { // Default 5 minutes
    if (!this.isRedisConnected()) {
      throw new Error('Redis client not connected');
    }

    try {
      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, ttl, serializedValue);
      console.log(`Cached data with key: ${key}, TTL: ${ttl}s`);
    } catch (error) {
      console.error('Error setting cache:', error);
      throw error;
    }
  }

  /**
   * Get value by key
   * @param {string} key - Cache key
   */
  async get(key) {
    if (!this.isRedisConnected()) {
      throw new Error('Redis client not connected');
    }

    try {
      const value = await this.client.get(key);
      if (value) {
        console.log(`Cache hit for key: ${key}`);
        return JSON.parse(value);
      }
      console.log(`Cache miss for key: ${key}`);
      return null;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  }

  /**
   * Delete key from cache
   * @param {string} key - Cache key
   */
  async del(key) {
    if (!this.isRedisConnected()) {
      throw new Error('Redis client not connected');
    }

    try {
      await this.client.del(key);
      console.log(`Deleted cache key: ${key}`);
    } catch (error) {
      console.error('Error deleting cache:', error);
      throw error;
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
    }
  }
}

// Create singleton instance
const redisClient = new RedisClient();

module.exports = redisClient;
