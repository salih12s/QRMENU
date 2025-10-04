# 🚀 RAILWAY DATABASE INIT - ADIM ADIM REHBER

## ❌ SORUN
Login çalışmıyor çünkü Railway database'inde tablolar ve super admin kullanıcısı yok!

---

## ✅ ÇÖZÜM (3 Yöntem)

### 🎯 **YÖNTEM 1: Railway Dashboard SQL Query (EN KOLAY - TAVSİYE EDİLEN)**

#### Adım 1: Railway'e Git
1. https://railway.app/ 'e giriş yap
2. **qrmenu-production** projesini aç

#### Adım 2: PostgreSQL Database'i Seç
- Sol menüden **PostgreSQL** (Database) servisine tıkla

#### Adım 3: Query Tab'ını Aç
- Üst menüden **"Query"** veya **"Data"** tab'ına tıkla
- SQL editor açılacak

#### Adım 4: SQL Komutunu Kopyala
`railway-init.sql` dosyasını aç ve **tamamını** kopyala

#### Adım 5: SQL'i Yapıştır ve Çalıştır
1. Railway SQL editor'a yapıştır
2. **"Execute"** veya **"Run"** butonuna tıkla
3. ✅ Başarılı mesajı görmeli ve en sonda kullanıcı listesi görünmeli:

```
id | email              | role        | created_at
---+--------------------+-------------+-------------------
 1 | admin@system.com   | super_admin | 2025-10-04 02:30:00
```

---

### 🎯 **YÖNTEM 2: Railway CLI (Terminal)**

```bash
# Railway CLI kur (PowerShell - Admin olarak)
iwr https://railway.app/install.ps1 | iex

# Login yap
railway login

# Projeye bağlan
railway link

# PostgreSQL'e bağlan
railway connect postgres

# SQL dosyasını çalıştır
\i C:/Users/salih/Desktop/Restoran/railway-init.sql

# Çık
\q
```

---

### 🎯 **YÖNTEM 3: Backend Deploy ile Otomatik Init**

#### Adım 1: package.json'da start script'i değiştir
```json
{
  "scripts": {
    "start": "npm run db:init:safe && node dist/server.js",
    "db:init:safe": "ts-node src/scripts/initDb.ts || echo 'DB already initialized'"
  }
}
```

#### Adım 2: Railway'de Redeploy
- Railway Dashboard → Backend Service → **"Redeploy"**

---

## 🧪 TEST - Railway Init Başarılı mı?

### Test 1: Railway SQL Query ile
```sql
SELECT * FROM users;
```
✅ Super admin kullanıcısı görünmeli

### Test 2: API Endpoint ile (PowerShell)
```powershell
Invoke-RestMethod -Uri "https://qrmenu-production-857b.up.railway.app/api/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@system.com","password":"admin123"}'
```

✅ Başarılı response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "email": "admin@system.com",
      "role": "super_admin"
    }
  },
  "message": "Giriş başarılı"
}
```

### Test 3: Frontend'den Login (menuben.com)
1. `https://menuben.com` aç
2. Login:
   - Email: `admin@system.com`
   - Password: `admin123`
3. ✅ Dashboard'a yönlenmeli!

---

## 📋 KONTROL LİSTESİ

Database Init Sonrası:
- [ ] Railway SQL Query ile `SELECT * FROM users;` çalıştır → Super admin görünmeli
- [ ] API login test et → Token dönmeli
- [ ] Frontend menuben.com'dan login yap → Dashboard açılmalı
- [ ] Restoran oluştur → Başarılı olmalı
- [ ] QR kod oluştur → QR kod gösterilmeli
- [ ] Public menu test et → `/menu/[QR_CODE]` çalışmalı

---

## 🚨 SORUN YAŞARSAN

**Hata: "relation 'users' does not exist"**
→ SQL komutu çalışmamış, tekrar dene

**Hata: "Giriş işlemi başarısız"**
→ Şifre hash'i yanlış, bcrypt hash'i yeniden oluştur

**Hata: "CORS policy error"**
→ Backend `.env` dosyasında `ALLOWED_ORIGIN=https://menuben.com` kontrol et

---

## ⚡ SONRAKI ADIMLAR

Database init edildikten sonra:

1. ✅ Railway backend çalışıyor
2. ✅ Frontend Hostinger'da yayında
3. ✅ API endpoint'leri erişilebilir
4. ✅ Login çalışıyor
5. 🎯 **Frontend'i tekrar test et ve QR kod oluştur!**

---

## 📌 HATIRLATMA

- Super Admin:
  - Email: `admin@system.com`
  - Password: `admin123`
  
- Production URLs:
  - Frontend: `https://menuben.com`
  - Backend: `https://qrmenu-production-857b.up.railway.app`
  - Public Menu: `https://menuben.com/menu/[QR_CODE]`

**Database init edildikten sonra her şey çalışmaya hazır! 🚀**
