# 🚨 Railway Database Init Sorunu - Çözüm

## 🔍 Sorun Tespiti
- ✅ Backend Railway'de çalışıyor: https://qrmenu-production-857b.up.railway.app
- ✅ API endpoint'leri yanıt veriyor
- ❌ Login başarısız: **Database'de kullanıcı yok!**

## 🛠️ ÇÖZÜM: Railway'de Database'i Initialize Et

### **Adım 1: Railway Dashboard'a Git**
1. https://railway.app/ → Login
2. `qrmenu-production` projesini aç
3. Backend service'i seç

### **Adım 2: Run Command ile Database Init**
Railway'de terminal açıp komutu çalıştır:

**Yöntem A - Deploy'dan Sonra Run Command:**
```bash
cd backend && npm run db:init
```

**Yöntem B - Manuel SQL Çalıştır (PostgreSQL Tab):**
Railway → Database → Query kısmına şu SQL'i yapıştır:

```sql
-- 1. Tables oluştur
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    theme_color VARCHAR(7) DEFAULT '#1976d2',
    qr_code VARCHAR(255) UNIQUE,
    qr_code_image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS access_logs (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    qr_code VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Super Admin Kullanıcı Ekle
-- Şifre: admin123 (bcrypt hash)
INSERT INTO users (email, password, role)
VALUES (
    'admin@system.com',
    '$2a$10$YourBcryptHashHere',  -- Bu hash'i değiştirmen gerekecek!
    'super_admin'
) ON CONFLICT (email) DO NOTHING;
```

### **Adım 3: Bcrypt Hash Oluştur**
Lokal bilgisayarında:

```bash
cd C:\Users\salih\Desktop\Restoran\backend
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

Çıkan hash'i kopyala ve yukarıdaki SQL'deki `$2a$10$YourBcryptHashHere` yerine yapıştır.

### **Adım 4: Railway'de SQL'i Çalıştır**
1. Railway → PostgreSQL Database → Query
2. SQL'i yapıştır (hash'i düzelttikten sonra)
3. Execute/Run

---

## ⚡ HIZLI ÇÖZÜM (Tavsiye Edilen)

Railway Dashboard → Backend Service → Settings → Custom Start Command:

```bash
npm run db:init && npm start
```

Bu şekilde her deploy'da database otomatik initialize olur.

---

## 🧪 Test Et

Deploy bittikten sonra:

```bash
# PowerShell
Invoke-RestMethod -Uri "https://qrmenu-production-857b.up.railway.app/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@system.com","password":"admin123"}'
```

✅ Başarılı response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "email": "admin@system.com",
      "role": "super_admin"
    }
  }
}
```

---

## 🎯 Son Adım: Frontend'i Tekrar Test Et

Railway database init edildikten sonra:

1. `https://menuben.com` aç
2. Login yap:
   - Email: `admin@system.com`
   - Password: `admin123`
3. ✅ Dashboard'a yönlenmeli!

---

## 📌 Notlar

- Railway'de environment variable'lar doğru set edilmiş ✅
- CORS ayarları menuben.com için yapılmış ✅
- Sadece database initialization eksik ❌

Database init edildikten sonra her şey çalışacak! 🚀
