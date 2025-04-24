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

2. **Environment Variables:**
   Create a .env file with the following content:
   ```
   MONGO_HOST=localhost
   MONGO_PORT=27017
   MONGO_DATABASE=movie-db
   NODE_ENV=development
   API_PREFIX=/api
   ```

3. **Run Locally:**
   ```bash
   npm start
   ```

4. **Visit:**
   - [http://localhost:3000](http://localhost:3000) will redirect you to the main documentation page.

## Database Setup

1. **Seed the Database:**
   - When running locally:
     ```bash
     npm run seed
     ```
   - When using Docker:
     ```bash
     docker-compose exec app npm run seed
     ```

## Requirements

- Docker and Docker Compose installed on your machine.

## MongoDB

- MongoDB is set up in Docker Compose and is accessible at `mongodb://mongo:27017/movie-db`.
- Data is persisted using a Docker volume named `movie-db-data`.