# 🎬 Movie API

> **English summary:**
> This project is a Node.js REST API for managing movies and directors, featuring MongoDB for storage, Redis for caching, and Loki/Grafana for logging and monitoring.

Bu proje, film ve yönetmen bilgilerini yönetmek için REST API sunan, MongoDB, Redis ve Loki/Grafana entegrasyonu ile geliştirilmiş bir Node.js uygulamasıdır.

## 🚀 Hızlı Başlangıç

```bash
# Tek komutla başlat
docker-compose up -d

# Erişim Noktaları
- API: http://localhost:3000
- Swagger UI: http://localhost:3000/docs
- Grafana Monitoring: http://localhost:3001 (admin/admin)

# Test et
curl http://localhost:3000/api/movies
```

## 📱 API Kullanımı

> Tüm endpoint'leri ve örnek istekleri Swagger UI üzerinden de test edebilirsiniz: http://localhost:3000/docs

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
LOG_PATH=/var/log/app/app.log
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

## 📊 Loglama ve Monitoring

### 🔍 Grafana ve Loki

```bash
# Erişim
Grafana: http://localhost:3001 (admin/admin)

# Log Görüntüleme
1. Grafana'da sol menüden "Explore" seçeneğine tıklayın
2. Data source olarak "Loki" seçin
3. LogQL sorgusu yazın, örneğin:
   {job="movie-api"}                     # Tüm uygulama logları
   {job="movie-api"} |= "error"          # Hata logları
   {job="movie-api"} |= "request completed" # API istekleri
```

### 🔧 Promtail Yapılandırması

Promtail, uygulama loglarını `/var/log/app/*.log` konumundan okur ve Loki'ye gönderir.

```bash
# Log Dosyaları
./logs/app.log                # Host üzerinde
/var/log/app/app.log          # Container içinde (aynı dosya)

# Promtail Durumunu Kontrol Et
docker-compose logs promtail
```

### 🚨 Yaşanabilecek Sorunlar ve Çözümleri

#### "no org id" Hatası (401 Unauthorized)

Grafana'dan Loki'ye bağlanırken "no org id" hatası alırsanız:

1. Grafana arayüzünde, sol menüden **Connections(ya da Configuration) > Data sources** seçin
2. **Loki** veri kaynağını açın
3. "HTTP" başlığı altında, **Custom HTTP Headers** kısmını bulun
4. "Add header" butonuna tıklayın ve şu değerleri girin:
   - Header: `X-Scope-OrgID`
   - Value: `1`
5. "Save & Test" butonuna tıklayın
6. Çalışan bir bağlantı için "Data source is working" mesajını görmelisiniz

> **Not:** Bu header, Loki'nin multi-tenancy özelliği için gereklidir. Projemizde `grafana-datasource.yml` dosyasında otomatik tanımlanmış olsa da, bazen bu yapılandırma doğru uygulanmayabilir. Bu durumda yukarıdaki adımları izleyerek UI üzerinden eklemeniz gerekebilir.

## 🐳 Docker Komutları

```bash
docker-compose up -d          # Başlat
docker-compose up -d --build  # Yeniden build ederek başlat
docker-compose build          # Sadece build et
docker-compose pull           # En güncel imajları çek
docker-compose down           # Durdur
docker-compose logs -f        # Logları izle
docker-compose ps             # Durumu göster
docker-compose restart        # Yeniden başlat

# Özel Servisler için Loglar
docker-compose logs -f app     # Uygulama logları
docker-compose logs -f loki    # Loki logları
docker-compose logs -f grafana # Grafana logları

# Tek Servis Build Et
docker-compose build app       # Sadece app servisini build et
```

## 🧹 Temizlik ve Bakım

```bash
# Loki Veritabanını Temizle
docker-compose down -v
docker volume rm movie-api_loki_data
docker-compose up -d

# Positions Dosyasını Sıfırla (Log takibi)
docker-compose exec promtail rm /tmp/positions.yaml
docker-compose restart promtail

# Sistem Temizliği
docker system prune -a        # Kullanılmayan tüm imaj, container ve networkleri temizle (dikkatli kullanın!)
```

## 📄 Lisans

MIT