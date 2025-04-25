# 🎬 Movie API

## 🚀 Hızlı Başlangıç

```bash
# Tek komutla başlat
docker-compose up -d

# API Adresi: http://localhost:3000, this will redirect you to below,
# Swagger: http://localhost:3000/docs

# Test et
curl http://localhost:3000/api/movies
```

## 📱 API Kullanımı

### Movies

```bash
GET    /api/movies         # Tüm filmleri listele
GET    /api/movies/:id     # Film detayı
POST   /api/movies         # Yeni film ekle
PUT    /api/movies/:id     # Film güncelle
DELETE /api/movies/:id     # Film sil
```

### Directors

```bash
GET    /api/directors         # Tüm yönetmenleri listele
GET    /api/directors/:id     # Yönetmen detayı
POST   /api/directors         # Yeni yönetmen ekle
PUT    /api/directors/:id     # Yönetmen güncelle
DELETE /api/directors/:id     # Yönetmen sil
```

## 🛠️ Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme modunda çalıştır
npm run dev

# Test verileri ekle
npm run seed
```

### Ortam Değişkenleri (.env)

```
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=movie-db
NODE_ENV=development
API_PREFIX=/api
REDIS_URL=redis://redis:6379
```

## 🔄 Redis Önbellek

```bash
# Redis CLI'a bağlan
docker-compose exec redis redis-cli

# Komutlar
KEYS *               # Tüm önbellek anahtarları
GET "movie:id:1"     # Anahtarın değerini görüntüle
TTL "movie:id:1"     # Kalan süre (saniye)
FLUSHALL             # Tüm önbelleği temizle

# Önbellek süreleri
- Filmler & Yönetmenler: 15 dakika
- Genel önbellek: 60 dakika
```

## 🐳 Docker Komutları

```bash
docker-compose up -d          # Başlat
docker-compose down           # Durdur
docker-compose logs -f        # Logları izle
docker-compose ps             # Durumu göster
docker-compose restart        # Yeniden başlat
```

## 🔮 Sonraki Adımlar

### 📊 Loglama ve Monitoring

**Loki ve Grafana ile Merkezi Loglama Sistemi**

## 📄 Lisans

MIT