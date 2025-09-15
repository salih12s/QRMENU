# QR Menu - Restoran Menü Yönetim Sistemi

Restoranlar için QR kod tabanlı menü yönetim sistemi. Müşteriler QR kod okutarak menüyü görüntüleyebilir, restaurant yöneticileri menülerini yönetebilir.

## Özellikler

- 🏢 **Super Admin Paneli**: Tüm restoranları yönetme
- 🍽️ **Restaurant Admin Paneli**: Menü ve kategori yönetimi
- 📱 **QR Kod Sistemi**: Müşteriler için kolay erişim
- 🖼️ **Resim Desteği**: Menü öğeleri için base64 resim kaydetme
- 📊 **Raporlama**: Restaurant görüntülenme istatistikleri
- 🔐 **Güvenlik**: JWT tabanlı authentication ve role-based yetkilendirme

## Teknolojiler

### Backend
- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- QR Code generation

### Frontend
- React.js
- React Router
- Axios
- CSS3

## Kurulum

### Gereksinimler
- Node.js (v14+)
- PostgreSQL
- npm veya yarn

### Backend Kurulumu

```bash
cd backend
npm install
```

.env dosyası oluşturun:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=qrmenu_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

Veritabanını oluşturun:
```sql
-- PostgreSQL'de database oluşturun
CREATE DATABASE qrmenu_db;
```

Backend'i başlatın:
```bash
npm start
```

### Frontend Kurulumu

```bash
cd frontend
npm install
npm start
```

## Veritabanı Şeması

- **users**: Kullanıcı bilgileri (super_admin, restaurant_admin)
- **restaurants**: Restoran bilgileri
- **categories**: Menü kategorileri
- **menu_items**: Menü öğeleri (base64 resim desteği ile)
- **restaurant_views**: Restoran görüntülenme kayıtları
- **menu_views**: Menü görüntülenme kayıtları

## Kullanım

1. Super admin olarak giriş yapın (superadmin/12345)
2. Yeni restoranlar oluşturun
3. Restaurant admin'leri atayın
4. Restaurant admin olarak menü kategorileri ve öğeleri ekleyin
5. QR kodunu paylaşın
6. Müşteriler QR kod ile menüye erişir

## API Endpoints

### Authentication
- `POST /api/auth/login` - Giriş
- `POST /api/auth/register` - Kayıt

### Restaurant Management
- `GET /api/restaurants` - Tüm restoranlar
- `POST /api/restaurants` - Yeni restoran
- `PUT /api/restaurants/:id` - Restoran güncelle

### Menu Management
- `GET /api/menu/restaurant/:id` - Restoran menüsü
- `POST /api/menu/categories/:id/items` - Yeni menü öğesi
- `PUT /api/menu/items/:id` - Menü öğesi güncelle

### Public Access
- `GET /api/menu/qr/:qrCode` - QR kod ile menü görüntüleme

## Lisans

MIT License

## Katkı

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun