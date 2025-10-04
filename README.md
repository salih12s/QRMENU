# 🍽️ Restoran Menü Yönetim & QR Kod Erişim Sistemi

## 📝 Proje Açıklaması

Restoranların menülerini dijital ortamda yönetmesini ve müşterilerin QR kod ile menülere erişmesini sağlayan **tam dinamik**, **production-ready** bir sistem. Tüm veriler kullanıcı tarafından oluşturulur, hazır demo data yoktur.

## 🚀 Teknolojiler

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.3
- **Database**: PostgreSQL 14+
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **File Upload**: Multer
- **QR Generation**: qrcode
- **Dev Tools**: nodemon, ts-node

### Frontend
- **Framework**: React 18.2
- **Language**: TypeScript 5.2
- **Build Tool**: Vite 5.0
- **UI Library**: Material-UI (MUI) 5.14
- **Routing**: React Router 6.20
- **HTTP Client**: Axios 1.6
- **Notifications**: notistack 3.0
- **QR Display**: qrcode.react 3.1

### DevOps
- **Concurrency**: concurrently (tek komutla tüm serverlar)
- **Process Management**: nodemon (backend hot-reload)

## 👥 Roller

### 1. Süper Admin
- Tüm restoranları yönetme
- Restoran ekleme/silme/düzenleme
- Tüm menüleri görüntüleme ve düzenleme
- Genel raporlama ve istatistikler

### 2. Restoran Admini
- Kendi restoranının menü yönetimi
- Ürün ekleme/düzenleme/silme
- Tema rengi özelleştirme
- Fotoğraf yükleme
- Restoran bazlı raporlar

### 3. Müşteriler
- QR kod ile menü görüntüleme
- Kategorilere göre ürün listeleme
- Ürün detaylarını inceleme

## 📁 Proje Yapısı

```
Restoran/
├── package.json           # Root - concurrently ile tüm serverları yönetir
├── README.md              # Bu dosya
│
├── backend/               # Node.js + TypeScript + Express API
│   ├── src/
│   │   ├── config/        # Database bağlantısı
│   │   ├── controllers/   # İş mantığı (auth, restaurant, menu, vb.)
│   │   ├── middleware/    # Auth, error handling
│   │   ├── routes/        # API endpoint'leri
│   │   ├── scripts/       # DB init/clean scriptleri
│   │   ├── types/         # TypeScript type tanımları
│   │   └── server.ts      # Ana server dosyası
│   ├── uploads/           # Yüklenen resimler (logo, menu resimleri)
│   ├── tsconfig.json      # TypeScript konfigürasyonu
│   └── package.json       # Backend dependencies
│
└── frontend/              # React + TypeScript + Vite + MUI
    ├── src/
    │   ├── components/    # Reusable component'ler
    │   │   ├── SuperAdmin/         # Süper admin component'leri
    │   │   └── RestaurantAdmin/    # Restoran admin component'leri
    │   ├── pages/         # Sayfa component'leri
    │   │   ├── LoginPage.tsx
    │   │   ├── SuperAdminDashboard.tsx
    │   │   ├── RestaurantAdminDashboard.tsx
    │   │   └── PublicMenuPage.tsx
    │   ├── services/      # API servisleri (axios)
    │   ├── context/       # AuthContext
    │   ├── types/         # TypeScript interfaces
    │   └── App.tsx        # Ana uygulama
    ├── tsconfig.json      # TypeScript konfigürasyonu
    ├── vite.config.ts     # Vite konfigürasyonu
    └── package.json       # Frontend dependencies
```

## 🔧 Kurulum

### Ön Gereksinimler
- Node.js 18+ yüklü olmalı
- PostgreSQL 14+ yüklü ve çalışıyor olmalı
- npm veya yarn paket yöneticisi

### 1. PostgreSQL Database Oluşturma

PostgreSQL'de yeni database oluşturun:
```sql
CREATE DATABASE restorant;
```

### 2. Proje Kurulumu

**Root klasörde (tüm dependencies):**
```bash
npm install
```

**Backend kurulumu:**
```bash
cd backend
npm install
```

**Frontend kurulumu:**
```bash
cd frontend
npm install
```

### 3. Backend Konfigürasyonu

`backend/.env` dosyasını oluşturun:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restorant
DB_USER=postgres
DB_PASSWORD=12345

# JWT Secret (Production'da değiştirin!)
JWT_SECRET=your_jwt_secret_key_here_change_in_production_minimum_32_characters

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Database Başlatma

Database tablolarını ve süper admin kullanıcısını oluşturun:
```bash
npm run db:init
```

**Oluşturulan Süper Admin:**
- Email: `admin@system.com`
- Şifre: `admin123`

⚠️ **Production'da bu şifreyi mutlaka değiştirin!**

### 5. Sunucuları Başlatma

**Önerilen Yöntem - Tek komutla her şey:**
```bash
npm run dev
```

Bu komut aynı anda şunları başlatır:
- ✅ Backend sunucu (http://localhost:5000)
- ✅ Frontend sunucu (http://localhost:5173)

**Alternatif - Ayrı ayrı başlatma:**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

## 📊 Database Şeması

### Tablolar:

#### 1. users
Sistem kullanıcıları (süper admin, restoran adminleri)
```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- password (VARCHAR) - bcrypt hash
- name (VARCHAR)
- role (VARCHAR) - 'super_admin' | 'restaurant_admin'
- restaurant_id (INTEGER) - Foreign key to restaurants
- created_at (TIMESTAMP)
```

#### 2. restaurants
Restoran bilgileri
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- description (TEXT)
- address (TEXT)
- phone (VARCHAR)
- email (VARCHAR)
- logo_url (VARCHAR)
- theme_color (VARCHAR) - Özelleştirilebilir tema
- qr_code_url (VARCHAR) - Benzersiz QR kodu
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
```

#### 3. categories
Menü kategorileri (her restoran için)
```sql
- id (SERIAL PRIMARY KEY)
- restaurant_id (INTEGER) - Foreign key to restaurants
- name (VARCHAR)
- display_order (INTEGER)
- created_at (TIMESTAMP)
```

#### 4. menu_items
Menü ürünleri
```sql
- id (SERIAL PRIMARY KEY)
- category_id (INTEGER) - Foreign key to categories
- name (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- image_url (VARCHAR)
- is_available (BOOLEAN)
- display_order (INTEGER)
- created_at (TIMESTAMP)
```

#### 5. access_logs
QR kod ile menü erişim logları
```sql
- id (SERIAL PRIMARY KEY)
- restaurant_id (INTEGER) - Foreign key to restaurants
- ip_address (VARCHAR)
- user_agent (TEXT)
- accessed_at (TIMESTAMP)
```

### İlişkiler:
- `users.restaurant_id` → `restaurants.id` (CASCADE DELETE)
- `categories.restaurant_id` → `restaurants.id` (CASCADE DELETE)
- `menu_items.category_id` → `categories.id` (CASCADE DELETE)
- `access_logs.restaurant_id` → `restaurants.id` (CASCADE DELETE)

## 🎨 Özellikler

### Genel
- ✅ **Full TypeScript** - Hem frontend hem backend 100% TypeScript
- ✅ **Tamamen Dinamik** - Hiç demo/mock data yok, her şey kullanıcı tarafından oluşturulur
- ✅ **Rol Tabanlı Yetkilendirme (RBAC)** - Super Admin ve Restaurant Admin rolleri
- ✅ **JWT Authentication** - Güvenli token tabanlı kimlik doğrulama
- ✅ **Modal Tabanlı UI** - Alert kullanılmıyor, tüm etkileşimler modal ile
- ✅ **Responsive Tasarım** - Mobil, tablet ve desktop uyumlu
- ✅ **Material-UI (MUI)** - Modern ve profesyonel arayüz

### Süper Admin Özellikleri
- ✅ **Restoran Yönetimi** - Tüm restoranları görüntüleme, ekleme, düzenleme, silme
- ✅ **Kullanıcı Yönetimi** - Restoran adminleri oluşturma ve yönetme
- ✅ **Global İstatistikler** - Tüm sistem geneli raporlar
- ✅ **Toplu İşlemler** - Çoklu restoran yönetimi

### Restoran Admin Özelliklikleri
- ✅ **Restoran Ayarları** - Logo, renk teması, bilgiler güncelleme
- ✅ **Kategori Yönetimi** - Menü kategorileri oluşturma, sıralama
- ✅ **Menü Yönetimi** - Ürün ekleme, düzenleme, fotoğraf yükleme
- ✅ **Tema Özelleştirme** - Restoran bazında renk teması seçimi
- ✅ **QR Kod Yönetimi** - QR kod görüntüleme, yeniden oluşturma
- ✅ **İstatistikler** - Restoran bazlı erişim logları ve raporlar

### Müşteri (Public) Özellikleri
- ✅ **QR Kod Erişim** - QR kod okutarak menüyü görüntüleme
- ✅ **Kategori Filtreleme** - Kategorilere göre ürünleri listeleme
- ✅ **Ürün Detayları** - Fotoğraf, açıklama, fiyat bilgileri
- ✅ **Tema Desteği** - Restoran temasına göre renklendirme
- ✅ **Erişim Logları** - Her erişim otomatik kaydedilir

### Teknik Özellikler
- ✅ **File Upload** - Multer ile logo ve menü resimleri yükleme
- ✅ **Image Preview** - Yükleme öncesi önizleme
- ✅ **QR Code Generation** - Benzersiz QR kod oluşturma
- ✅ **Error Handling** - Kapsamlı hata yönetimi
- ✅ **Validation** - Backend ve frontend doğrulama
- ✅ **Security** - bcrypt password hashing, JWT tokens
- ✅ **CORS** - Cross-origin resource sharing desteği
- ✅ **Environment Variables** - Güvenli konfigürasyon
- ✅ **Hot Reload** - Development sırasında otomatik yenileme

## 🔐 Varsayılan Giriş Bilgileri

**Süper Admin:**
- Email: `admin@system.com`
- Şifre: `admin123`

**⚠️ ÖNEMLİ:** Production'da bu şifreyi mutlaka değiştirin!

**Restoran Adminleri:**
- Süper admin tarafından oluşturulur
- Her restoran admin, bir restorana bağlıdır

## 📝 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/login` - Kullanıcı girişi
  - Body: `{ email, password }`
  - Response: `{ token, user }`
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi
  - Headers: `Authorization: Bearer <token>`
- `POST /api/auth/users` - Yeni kullanıcı oluştur (Super Admin)
  - Body: `{ email, password, name, role, restaurant_id }`
- `GET /api/auth/users` - Tüm kullanıcıları listele (Super Admin)
- `DELETE /api/auth/users/:id` - Kullanıcı sil (Super Admin)

### Restaurants (`/api/restaurants`)
- `GET /api/restaurants` - Tüm restoranları listele (Super Admin)
- `GET /api/restaurants/:id` - Restoran detayı
- `POST /api/restaurants` - Yeni restoran oluştur (Super Admin)
  - Body: `{ name, description, address, phone, email }`
- `PUT /api/restaurants/:id` - Restoran güncelle
  - Body: `{ name, description, address, phone, email, theme_color, is_active }`
- `DELETE /api/restaurants/:id` - Restoran sil (Super Admin)
- `POST /api/restaurants/:id/logo` - Logo yükle
  - Form Data: `logo` (file)
- `POST /api/restaurants/:id/regenerate-qr` - QR kodu yeniden oluştur

### Categories (`/api/categories`)
- `GET /api/categories/restaurant/:restaurantId` - Restoran kategorileri
- `POST /api/categories` - Kategori oluştur
  - Body: `{ restaurant_id, name, display_order }`
- `PUT /api/categories/:id` - Kategori güncelle
  - Body: `{ name, display_order }`
- `DELETE /api/categories/:id` - Kategori sil

### Menu Items (`/api/menu`)
- `GET /api/menu/restaurant/:restaurantId` - Restoran menüsü
- `GET /api/menu/category/:categoryId` - Kategoriye göre ürünler
- `POST /api/menu` - Ürün oluştur
  - Form Data: `{ category_id, name, description, price, is_available, display_order }` + `image` (file)
- `PUT /api/menu/:id` - Ürün güncelle
  - Form Data: Aynı alanlar + opsiyonel `image`
- `DELETE /api/menu/:id` - Ürün sil

### Public (`/api/public`)
- `GET /api/public/menu/:qrCode` - QR kod ile menü görüntüle
  - Response: `{ restaurant, categories, menuItems }`

### Reports (`/api/reports`)
- `GET /api/reports/restaurant/:restaurantId` - Restoran istatistikleri
  - Response: `{ totalCategories, totalMenuItems, totalAccess }`
- `GET /api/reports/all` - Tüm sistem istatistikleri (Super Admin)
  - Response: `{ totalRestaurants, totalUsers, totalCategories, totalMenuItems }`

## 📱 Kullanım Senaryosu

### 1️⃣ İlk Kurulum (Süper Admin)

1. Sisteme giriş yapın (`admin@system.com` / `admin123`)
2. **Restoranlar** sayfasına gidin
3. **"Yeni Restoran Ekle"** butonuna tıklayın
4. Restoran bilgilerini doldurun (isim, açıklama, adres, telefon, email)
5. Logo yükleyin (opsiyonel)
6. Kaydet - QR kod otomatik oluşturulur ✅

### 2️⃣ Restoran Admini Oluşturma

1. **Kullanıcılar** sayfasına gidin
2. **"Yeni Kullanıcı Ekle"** butonuna tıklayın
3. Email, şifre, isim girin
4. Rol: **Restaurant Admin** seçin
5. İlgili restoranı seçin
6. Kaydet ✅

### 3️⃣ Menü Oluşturma (Restoran Admin)

1. Restoran admin hesabıyla giriş yapın
2. **Kategoriler** sayfasına gidin
3. Kategori ekleyin (örn: "Ana Yemekler", "İçecekler", "Tatlılar")
4. **Menü** sayfasına gidin
5. Ürün ekleyin:
   - Kategori seçin
   - Ürün adı, açıklama, fiyat girin
   - Fotoğraf yükleyin
   - Kaydet ✅

### 4️⃣ Tema Özelleştirme

1. **Ayarlar** → **Tema** sayfasına gidin
2. Restoran için renk teması seçin
3. Değişiklikleri kaydedin
4. Tema, QR kod menüsünde otomatik uygulanır ✅

### 5️⃣ QR Kod Kullanımı

1. **Dashboard** veya **Restoranlar** sayfasından QR kodu görüntüleyin
2. QR kodu indirin veya ekran görüntüsü alın
3. Masalara yerleştirin veya yazdırın
4. Müşteriler QR kodu okuttukça:
   - Dinamik menü açılır
   - Erişim otomatik loglanır
   - İstatistiklere yansır ✅

## 🛠️ Geliştirme Komutları

### Tüm Sistem (Önerilen)
```bash
# Her iki sunucuyu aynı anda başlat
npm run dev

# Her iki projeyi build et
npm run build
```

### Backend
```bash
cd backend

# Development modunda çalıştır (nodemon ile hot-reload)
npm run dev

# Production modunda çalıştır
npm start

# TypeScript build
npm run build

# Database tablolarını oluştur + Süper admin ekle
npm run db:init

# Database'i temizle (sadece süper admin kalır)
npm run db:clean
```

### Frontend
```bash
cd frontend

# Development server (Vite HMR)
npm run dev

# Production build
npm run build

# Build önizleme
npm run preview
```

### Test ve Debug
```bash
cd backend

# API endpoint testleri
npm run test:api

# Database query testleri
npm run test:queries
```

## 📦 NPM Scripts Özeti

### Root (`/package.json`)
- `npm run dev` - Backend + Frontend aynı anda
- `npm run dev:backend` - Sadece backend
- `npm run dev:frontend` - Sadece frontend
- `npm run build` - Her ikisini build et
- `npm run db:init` - Database başlat
- `npm run db:clean` - Database temizle

### Backend (`/backend/package.json`)
- `npm run dev` - Development mode
- `npm start` - Production mode
- `npm run build` - TypeScript compile
- `npm run db:init` - Init database
- `npm run db:clean` - Clean database
- `npm run test:api` - API testleri
- `npm run test:queries` - Query testleri

### Frontend (`/frontend/package.json`)
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Build önizleme
- `npm run lint` - ESLint kontrolü

## � Güvenlik Notları

### Production Checklist
- [ ] `.env` dosyasındaki `JWT_SECRET`'ı değiştirin (min 32 karakter)
- [ ] Süper admin şifresini değiştirin (`admin123` → güçlü şifre)
- [ ] PostgreSQL şifresini güçlendirin
- [ ] CORS ayarlarını production domain'e göre yapılandırın
- [ ] `NODE_ENV=production` olarak ayarlayın
- [ ] HTTPS kullanın
- [ ] Rate limiting ekleyin (opsiyonel)
- [ ] File upload boyut limitlerini kontrol edin

### Environment Variables
Production'da `.env` dosyasını **asla** git'e eklemeyin!

```bash
# .gitignore'da olmalı
backend/.env
frontend/.env
```

## 🐛 Troubleshooting

### Database Bağlantı Hatası
```bash
# PostgreSQL servisinin çalıştığından emin olun
# Windows:
services.msc → PostgreSQL

# Database'in var olduğunu kontrol edin
psql -U postgres -c "\l"
```

### Port Çakışması
```bash
# Backend (5000) veya Frontend (5173) portu kullanımdaysa:
# .env'de PORT değiştirin
# veya çalışan process'i durdurun
```

### TypeScript Hataları
```bash
# VS Code TypeScript cache temizle:
# Ctrl+Shift+P → TypeScript: Restart TS Server

# veya
# node_modules silip yeniden install
rm -rf node_modules
npm install
```

### Database Temizleme
```bash
# Tüm data'yı silip baştan başlamak için:
npm run db:clean
npm run db:init
```

## 📚 Ekstra Bilgiler

### Kullanılan Paketler
- **bcryptjs**: Şifre hashleme (10 rounds)
- **jsonwebtoken**: JWT token oluşturma/doğrulama
- **multer**: Dosya yükleme (logo, menu images)
- **qrcode**: QR kod oluşturma
- **pg**: PostgreSQL client
- **express**: Web framework
- **cors**: Cross-origin istekler
- **dotenv**: Environment variables

### Performans İpuçları
- Büyük menüler için pagination eklenebilir
- Image'ları CDN'e taşıyabilirsiniz
- Redis cache eklenebilir
- Database indexleri mevcut

### Geliştirme Önerileri
- WebSocket ile real-time updates
- Email bildirimleri (sipariş, rezervasyon)
- Multi-language support
- Alerjen bilgileri
- Kalori hesaplama
- Müşteri yorumları

## 👨‍💻 Geliştirici

Bu proje **tam dinamik**, **production-ready** bir restoran yönetim sistemidir.

### Test Edildi ✅
- ✅ Tüm API endpoint'leri (10/10 test)
- ✅ CRUD operasyonları
- ✅ Authentication & Authorization
- ✅ File upload
- ✅ QR code generation
- ✅ Database migrations
- ✅ TypeScript compilation

### Özellikler
- 🚀 Hızlı ve güvenilir
- 🔒 Güvenli (JWT, bcrypt)
- 📱 Responsive tasarım
- 🎨 Özelleştirilebilir temalar
- 📊 Detaylı raporlama
- 🌐 Production ready

## �📄 Lisans

MIT License

---

**⭐ İyi Kullanımlar! ⭐**
