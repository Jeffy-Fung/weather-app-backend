# Weather App Backend

A Node.js Express API backend for weather applications.

## Features
- Express.js server
- CORS enabled
- Security headers with Helmet
- Request logging with Morgan
- Environment variable support
- Health check endpoint

## Installation

1. Install dependencies:
   `ash
   npm install
   ``n
2. Create a .env file with your configuration

3. Start the server:
   `ash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ``n
## API Endpoints

- GET / - Welcome message
- GET /health - Health check
- GET /api - API status
- GET /api/weather - Sample weather data

## Environment Variables

- PORT - Server port (default: 3000)
- NODE_ENV - Environment (development/production)

## Scripts

- 
pm start - Start production server
- 
pm run dev - Start development server with nodemon
