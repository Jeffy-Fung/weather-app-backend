# Weather App Backend

A Node.js Express API backend for weather applications with Redis caching support.

## Features
- Express.js server
- CORS enabled
- Security headers with Helmet
- Request logging with Morgan
- Environment variable support
- Health check endpoint
- **Redis caching with 5-minute TTL**
- **Cache management endpoints**

## Installation

### Option 1: Docker (Recommended)

**Prerequisites:**
- Docker and Docker Compose installed
- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

**Quick Start:**
```bash
# Run the setup script (Linux/Mac)
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh

# Or run the setup script (Windows)
scripts/docker-setup.bat

# Or manually start with Docker Compose
docker-compose up --build
```

**Development Mode (with hot reloading):**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Available Docker Commands:**
```bash
npm run docker:dev      # Start in development mode
npm run docker:prod     # Start in production mode
npm run docker:down     # Stop all services
npm run docker:logs     # View logs
npm run docker:clean    # Clean up volumes and containers
```

### Option 2: Local Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. **Redis Setup** (Optional but recommended for caching):
   - Install Redis locally or use a cloud service
   - For local installation: https://redis.io/download
   - For cloud services: Redis Cloud, AWS ElastiCache, etc.

3. Create a .env file with your configuration:
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Or create manually with your settings:
   # Server Configuration
   PORT=3000
   
   # Redis Configuration (Optional)
   REDIS_URL=redis://localhost:6379
   # For cloud Redis: REDIS_URL=redis://username:password@host:port
   ```

4. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Core Endpoints
- GET / - Welcome message with Redis status
- GET /health - Health check with Redis status
- GET /api - API status

### Weather Endpoints
- GET /api/v1/weather/current - Get current weather data
  - Query params: `lang` (tc, sc, en) - default: tc
  - Returns cached data if available (5-minute TTL)

**Data Source:** This weather API integrates with the [Hong Kong Observatory Open Data API](https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data_API_Documentation_tc.pdf) to provide real-time weather information for Hong Kong.


## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `REDIS_URL` - Redis connection URL (default: redis://localhost:6379)

## Redis Configuration Examples

```bash
# Local Redis
REDIS_URL=redis://localhost:6379

# Redis with password
REDIS_URL=redis://:password@localhost:6379

# Redis Cloud
REDIS_URL=redis://default:password@redis-12345.c123.us-east-1-1.ec2.cloud.redislabs.com:12345

# AWS ElastiCache
REDIS_URL=redis://your-cluster.xxxxx.cache.amazonaws.com:6379
```

## Caching Behavior

- Weather data is cached for **5 minutes** by default
- Cache keys follow the pattern: `weather:hongkong:rhrread:{language}`
- If Redis is unavailable, the service continues to work without caching
- Cache status is included in API responses (`cached: true/false`)

## Scripts

### Local Development
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Docker Commands
- `npm run docker:dev` - Start in development mode with hot reloading
- `npm run docker:prod` - Start in production mode
- `npm run docker:down` - Stop all services
- `npm run docker:logs` - View logs
- `npm run docker:clean` - Clean up volumes and containers

## Docker Services

The application runs with the following services:

- **weather-app**: Node.js backend API (port ${PORT:-3000})
- **redis**: Redis cache server (port 6379)
- **redis-commander**: Redis management UI (port 8081, optional)

### Redis Commander (Optional)

To enable Redis Commander for Redis management UI:
```bash
docker-compose --profile tools up
```

Access Redis Commander at: http://localhost:8081
