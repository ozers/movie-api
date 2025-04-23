# movie-api

## Quick Start with Docker Compose

1. **Build and Run the Services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the Application:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be redirected to [http://localhost:3000/docs](http://localhost:3000/docs)

## Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Locally:**
   ```bash
   npm start
   ```

3. **Visit:**
   - [http://localhost:3000](http://localhost:3000) will redirect you to the main documentation page.

## Requirements

- Docker and Docker Compose installed on your machine.

## MongoDB

- MongoDB is set up in Docker Compose and is accessible at `mongodb://mongo:27017/movie-db`.
- Data is persisted using a Docker volume named `movie-db-data`.