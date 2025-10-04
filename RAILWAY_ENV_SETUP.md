# 🚂 RAILWAY ENVIRONMENT VARIABLES KURULUM REHBERİ

## ❌ SORUN
Railway backend `localhost:5432` PostgreSQL'e bağlanmaya çalışıyor ama Railway database `ballast.proxy.rlwy.net:17619` adresinde!

**Hata:**
```
ECONNREFUSED 127.0.0.1:5432
```

## ✅ ÇÖZÜM
Railway Dashboard'da environment variables ayarla.

---

## 📋 RAILWAY DASHBOARD'DA MANUEL KURULUM

### Adım 1: Railway Dashboard'a Git
1. https://railway.app adresine git
2. Login ol
3. `qrmenu-production-857b` projesine tıkla

### Adım 2: Variables Sekmesine Git
- Sol menüden **"Variables"** sekmesine tıkla
- **"New Variable"** butonuna tıkla

### Adım 3: Her Bir Variable'ı Ekle

**Database Variables:**
```
DB_HOST = ballast.proxy.rlwy.net
DB_PORT = 17619
DB_NAME = railway
DB_USER = postgres
DB_PASSWORD = rmqlueVKPBRSJwNxZezqsvrnCZvMjKth
```

**Security:**
```
JWT_SECRET = Pp65KS6wRyD0dEFfaro4gz7NbT-IdZACZeqDU3GRDlfjyD42y3tAndG2M6qLLaTB
```

**Server Config:**
```
PORT = 5000
NODE_ENV = production
```

**Frontend URLs:**
```
FRONTEND_URL = https://menuben.com
ALLOWED_ORIGIN = https://menuben.com
```

### Adım 4: Deploy Tetikle
- Environment variables ekledikten sonra Railway **otomatik redeploy** başlatacak
- Veya manuel olarak: **"Deploy"** → **"Redeploy"**

---

## 🔍 DOĞRULAMA

### 1. Variables Kontrol
Railway Variables sekmesinde 10 variable görmelisin:
- ✅ DB_HOST
- ✅ DB_PORT
- ✅ DB_NAME
- ✅ DB_USER
- ✅ DB_PASSWORD
- ✅ JWT_SECRET
- ✅ PORT
- ✅ NODE_ENV
- ✅ FRONTEND_URL
- ✅ ALLOWED_ORIGIN

### 2. Deployment Logları
Deploy bitince **"View Logs"** tıkla, şunu görmeli:
```
✅ Server çalışıyor (Production): https://qrmenu-production-857b.up.railway.app
🌐 Frontend URL: https://menuben.com
📊 Environment: production
🗄️  Database: railway
```

### 3. Health Check Test
PowerShell'de:
```powershell
Invoke-WebRequest -Uri "https://qrmenu-production-857b.up.railway.app/api/health"
```

Yanıt:
```json
{"success":true,"message":"Server is running","environment":"production"}
```

### 4. Login Test
```powershell
$body = @{
    email = "admin@system.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://qrmenu-production-857b.up.railway.app/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

Başarılı yanıt:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "email": "admin@system.com",
      "role": "super_admin"
    }
  }
}
```

---

## ⚠️ ÖNEMLİ NOTLAR

1. **Variables ekledikten sonra mutlaka redeploy olacak** (2-3 dakika sürer)
2. **DB_PASSWORD'de boşluk yok**, tam kopyala: `rmqlueVKPBRSJwNxZezqsvrnCZvMjKth`
3. **PORT=5000** Railway otomatik atayacak ama yine de ekle
4. **NODE_ENV=production** çok önemli! Yoksa CORS çalışmaz

---

## 🎯 BAŞARI SONRASI

Railway variables ayarlandıktan ve deploy bittikten sonra:

1. `https://menuben.com` aç
2. Login dene:
   - Email: `admin@system.com`
   - Password: `admin123`
3. ✅ Başarılı giriş → Dashboard görmeli

---

## 🐛 SORUN GİDERME

### Hala ECONNREFUSED hatası?
- Variables'ı tekrar kontrol et
- Redeploy tetikle: Deploy → Redeploy
- Logs'u kontrol et: View Logs

### "Invalid credentials" hatası?
- Database'de user var mı kontrol et (DBeaver)
- Password hash doğru mu: `$2a$10$p8o8KQgD28OPe72.Syj1v...`

### CORS hatası?
- `ALLOWED_ORIGIN=https://menuben.com` doğru mu?
- `FRONTEND_URL=https://menuben.com` doğru mu?

---

## 📞 YARDIM

Sorun devam ederse Railway logs'tan şu bilgileri paylaş:
1. Deployment logs (ilk 50 satır)
2. Runtime logs (son 20 satır)
3. Variables screenshot
