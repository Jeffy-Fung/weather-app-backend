# Docker Setup Guide for Weather App Backend

This guide will help you set up the Weather App Backend with Redis using Docker and Docker Compose.

## Prerequisites

1. **Docker Desktop** (includes Docker Engine and Docker Compose)
   - [Download for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - [Download for Mac](https://docs.docker.com/desktop/install/mac-install/)
   - [Download for Linux](https://docs.docker.com/desktop/install/linux-install/)

2. **Verify Installation**
   ```bash
   docker --version
   docker-compose --version
   ```

## Quick Start

### Option 1: Automated Setup (Recommended)

**Windows:**
```cmd
scripts\docker-setup.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh
```

### Option 2: Manual Setup

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Start in development mode (with hot reloading):**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Start in background:**
   ```bash
   docker-compose up --build -d
   ```

## Available Services

| Service | Port | Description |
|---------|------|-------------|
| `weather-app` | `${PORT:-3000}` | Node.js API backend |
| `redis` | 6379 | Redis cache server |
| `redis-commander` | 8081 | Redis management UI (optional) |

## Useful Commands

### Service Management
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f weather-app
docker-compose logs -f redis
```

### Development Commands
```bash
# Start development mode
docker-compose -f docker-compose.dev.yml up --build

# Rebuild containers
docker-compose build --no-cache

# Clean up everything
docker-compose down -v --remove-orphans
```

### NPM Scripts
```bash
npm run docker:dev      # Development mode
npm run docker:prod     # Production mode
npm run docker:down     # Stop services
npm run docker:logs     # View logs
npm run docker:clean    # Clean up
```

## Testing the Setup

1. **Health Check:**
   ```bash
   curl http://localhost:${PORT:-3000}/health
   ```

2. **Weather API:**
   ```bash
   curl http://localhost:${PORT:-3000}/api/v1/weather/current?lang=en
   ```

4. **Redis Commander (if enabled):**
   - Open http://localhost:8081 in your browser

## Configuration

### Environment Variables

Create a `.env` file in the project root:
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Redis Configuration
REDIS_URL=redis://redis:6379
```

### Redis Configuration

The Redis service is configured with:
- **Persistence**: AOF (Append Only File) enabled
- **Memory Limit**: 256MB
- **Eviction Policy**: LRU (Least Recently Used)
- **Port**: 6379 (accessible from host)

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :3000  # Windows
   lsof -i :3000                 # Mac/Linux
   
   # Stop conflicting services or change ports in docker-compose.yml
   ```

2. **Redis connection failed:**
   ```bash
   # Check Redis logs
   docker-compose logs redis
   
   # Test Redis connection
   docker exec -it weather-app-redis redis-cli ping
   ```

3. **Container won't start:**
   ```bash
   # Check container logs
   docker-compose logs weather-app
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **Permission issues (Linux/Mac):**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Debugging

1. **Access container shell:**
   ```bash
   docker exec -it weather-app-backend sh
   ```

2. **Check Redis from container:**
   ```bash
   docker exec -it weather-app-redis redis-cli
   ```

3. **Monitor Redis:**
   ```bash
   docker exec -it weather-app-redis redis-cli monitor
   ```

## Production Deployment

For production deployment, consider:

1. **Use production Docker Compose:**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

2. **Set proper environment variables:**
   ```bash
   NODE_ENV=production
   REDIS_URL=redis://your-redis-host:6379
   ```

3. **Use external Redis service:**
   - Redis Cloud
   - AWS ElastiCache
   - Azure Cache for Redis

4. **Configure reverse proxy (nginx):**
   - Load balancing
   - SSL termination
   - Rate limiting

## Performance Optimization

1. **Redis Configuration:**
   - Adjust memory limits based on usage
   - Configure appropriate eviction policies
   - Enable Redis persistence for data durability

2. **Application Configuration:**
   - Adjust cache TTL based on data freshness requirements
   - Monitor cache hit rates
   - Implement cache warming strategies

## Monitoring

1. **Application Health:**
   - http://localhost:3000/health
   - Check Redis connection status

2. **Redis Monitoring:**
   - http://localhost:8081 (Redis Commander)
   - Monitor memory usage and hit rates

3. **Container Monitoring:**
   ```bash
   docker stats
   docker-compose ps
   ```

## Cleanup

To completely remove all containers, volumes, and images:
```bash
docker-compose down -v --remove-orphans
docker system prune -a
```

This will remove all unused containers, networks, images, and volumes.
