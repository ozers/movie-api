# 🎬 Movie API

> **Summary:**
> This project is a Node.js REST API for managing movies and directors, featuring MongoDB for storage, Redis for caching, and Loki/Grafana for logging and monitoring.

## 🚀 Quick Start

```bash
# Start with a single command
docker-compose up -d

# Access Points
- API: http://localhost:3000
- Swagger UI: http://localhost:3000/docs
- Grafana Monitoring: http://localhost:3001 (admin/admin)

# Test
curl http://localhost:3000/api/movies
```

## 📱 API Usage

> You can test all endpoints and example requests through Swagger UI: http://localhost:3000/docs

### Movies

```bash
GET    /api/movies         # List all movies
GET    /api/movies/:id     # Movie details
POST   /api/movies         # Add new movie
PUT    /api/movies/:id     # Update movie
DELETE /api/movies/:id     # Delete movie
```

### Directors

```bash
GET    /api/directors         # List all directors
GET    /api/directors/:id     # Director details
POST   /api/directors         # Add new director
PUT    /api/directors/:id     # Update director
DELETE /api/directors/:id     # Delete director
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Add test data
npm run seed
```

### Environment Variables (.env)

```
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=movie-db
NODE_ENV=development
API_PREFIX=/api
REDIS_URL=redis://redis:6379
LOG_PATH=/var/log/app/app.log
```

## 🔄 Redis Cache

```bash
# Connect to Redis CLI
docker-compose exec redis redis-cli

# Commands
KEYS *               # All cache keys
GET "movie:id:1"     # View key value
TTL "movie:id:1"     # Remaining time (seconds)
FLUSHALL             # Clear all cache

# Cache durations
- Movies & Directors: 15 minutes
- General cache: 60 minutes
```

## 📊 Logging and Monitoring

### 🔍 Grafana and Loki

```bash
# Access
Grafana: http://localhost:3001 (admin/admin)

# View Logs
1. Click "Explore" from the left menu in Grafana
2. Select "Loki" as the data source
3. Write a LogQL query, for example:
   {job="movie-api"}                     # All application logs
   {job="movie-api"} |= "error"          # Error logs
   {job="movie-api"} |= "request completed" # API requests
```

### 🔧 Promtail Configuration

Promtail reads application logs from `/var/log/app/*.log` and sends them to Loki.

```bash
# Log Files
./logs/app.log                # On host
/var/log/app/app.log          # Inside container (same file)

# Check Promtail Status
docker-compose logs promtail
```

### 🚨 Common Issues and Solutions

#### "no org id" Error (401 Unauthorized)

If you get a "no org id" error when connecting from Grafana to Loki:

1. In Grafana interface, select **Connections(or Configuration) > Data sources** from the left menu
2. Open the **Loki** data source
3. Under the "HTTP" header, find the **Custom HTTP Headers** section
4. Click "Add header" and enter these values:
   - Header: `X-Scope-OrgID`
   - Value: `1`
5. Click "Save & Test"
6. You should see "Data source is working" message for a successful connection

> **Note:** This header is required for Loki's multi-tenancy feature. Although it's automatically defined in the `grafana-datasource.yml` file in our project, sometimes this configuration might not be applied correctly. In such cases, you may need to add it through the UI following the steps above.

## 🐳 Docker Commands

```bash
docker-compose up -d          # Start
docker-compose up -d --build  # Start with rebuild
docker-compose build          # Build only
docker-compose pull           # Pull latest images
docker-compose down           # Stop
docker-compose logs -f        # Watch logs
docker-compose ps             # Show status
docker-compose restart        # Restart

# Logs for Specific Services
docker-compose logs -f app     # Application logs
docker-compose logs -f loki    # Loki logs
docker-compose logs -f grafana # Grafana logs

# Build Single Service
docker-compose build app       # Build only app service
```

## 🧹 Cleanup and Maintenance

```bash
# Clear Loki Database
docker-compose down -v
docker volume rm movie-api_loki_data
docker-compose up -d

# Reset Positions File (Log tracking)
docker-compose exec promtail rm /tmp/positions.yaml
docker-compose restart promtail

# System Cleanup
docker system prune -a        # Clean all unused images, containers and networks (use with caution!)
```

## 📄 License

MIT