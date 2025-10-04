# 🚀 Hızlı Test Rehberi

## 📋 Önkoşullar
✅ Backend çalışıyor: http://localhost:5000
✅ Frontend çalışıyor: http://localhost:5173
✅ PostgreSQL veritabanı aktif

## 🎯 5 Dakikalık Hızlı Test

### Test 1: Süper Admin Girişi (2 dakika)
1. **Giriş Yap**
   - URL: http://localhost:5173
   - Email: `admin@system.com`
   - Şifre: `admin123`
   - ✅ Beklenen: Süper Admin Dashboard'a yönlendirilmeli

2. **Restoran Ekle**
   - Sol menüden "Restoranlar"a tıkla
   - "Yeni Restoran" butonuna bas
   - Form doldur:
     * Ad: "Test Restoran"
     * Açıklama: "Test için oluşturuldu"
     * Telefon: "0555 123 4567"
     * Email: "test@restoran.com"
     * Adres: "Test Mahallesi No:1"
     * Tema Rengi: Herhangi bir renk seç
   - "Oluştur" butonuna bas
   - ✅ Beklenen: "Restoran oluşturuldu" mesajı, listede görünmeli

3. **Restoran Düzenle**
   - Oluşturduğun restoranın satırındaki düzenle (kalem) ikonuna tıkla
   - Adı değiştir: "Test Restoran - Güncellenmiş"
   - "Güncelle" butonuna bas
   - ✅ Beklenen: "Restoran güncellendi" mesajı, yeni ad görünmeli

4. **QR Kod Görüntüle**
   - QR Code ikonuna tıkla
   - ✅ Beklenen: Modal açılmalı, QR kod gösterilmeli
   - QR kod metnini kopyala (örn: REST-ABC123)

5. **Kullanıcı Ekle**
   - Sol menüden "Kullanıcılar"a tıkla
   - "Yeni Kullanıcı" butonuna bas
   - Form doldur:
     * Ad Soyad: "Test Admin"
     * Email: "testadmin@restaurant.com"
     * Şifre: "test123"
     * Rol: "Restoran Admin"
     * Restoran: Az önce oluşturduğun restoranı seç
   - "Oluştur" butonuna bas
   - ✅ Beklenen: Kullanıcı listesinde görünmeli

6. **Çıkış Yap**
   - Sağ üstteki avatar ikonuna tıkla
   - "Çıkış Yap" seçeneğine tıkla
   - ✅ Beklenen: Login sayfasına yönlendirilmeli

---

### Test 2: Restoran Admin Girişi (3 dakika)
1. **Giriş Yap**
   - Email: `demo@restaurant.com` (veya az önce oluşturduğun)
   - Şifre: `demo123` (veya `test123`)
   - ✅ Beklenen: Restoran Dashboard'a yönlendirilmeli
   - ✅ AppBar tema renginde olmalı

2. **Dashboard Kontrolü**
   - QR kodun gösterildiğini doğrula
   - Restoran adının gösterildiğini doğrula
   - ✅ Beklenen: Restoran bilgileri ve QR kod görünmeli

3. **Kategori Ekle**
   - Sol menüden "Kategoriler"e tıkla
   - "Yeni Kategori" butonuna bas
   - Form doldur:
     * Kategori Adı: "Tatlılar"
     * Açıklama: "Ev yapımı tatlılar"
   - "Oluştur" butonuna bas
   - ✅ Beklenen: Liste güncellenmeli

4. **Kategori Düzenle**
   - Düzenle (kalem) ikonuna tıkla
   - Açıklamayı değiştir
   - "Güncelle" butonuna bas
   - ✅ Beklenen: "Kategori güncellendi" mesajı

5. **Menü Ürünü Ekle**
   - Sol menüden "Menü"ye tıkla
   - "Yeni Ürün" butonuna bas
   - Form doldur:
     * Kategori: Az önce oluşturduğun kategoriyi seç
     * Ürün Adı: "Baklava"
     * Açıklama: "Antep fıstıklı baklava"
     * Fiyat: "120"
     * Alerjen Bilgisi: "Fındık içerir"
   - (İstersen) Fotoğraf Yükle butonuna basıp bir resim seç
   - ✅ Beklenen: Fotoğraf önizlemesi gösterilmeli
   - "Oluştur" butonuna bas
   - ✅ Beklenen: Card view'da ürün görünmeli

6. **Menü Ürünü Düzenle**
   - Ürün kartındaki düzenle (kalem) ikonuna tıkla
   - Fiyatı değiştir: "150"
   - "Güncelle" butonuna bas
   - ✅ Beklenen: Yeni fiyat kartda görünmeli

7. **Tema Değiştir**
   - Sol menüden "Tema"ya tıkla
   - Yeni bir renk seç (örn: mor, yeşil)
   - "Kaydet" butonuna bas
   - ✅ Beklenen: AppBar rengi anında değişmeli

8. **Restoran Ayarları**
   - Sol menüden "Ayarlar"a tıkla
   - Restoran açıklamasını değiştir
   - (İstersen) Logo yükle
   - ✅ Beklenen: Logo önizlemesi gösterilmeli
   - "Güncelle" butonuna bas
   - ✅ Beklenen: "Restoran güncellendi" mesajı

9. **İstatistikler**
   - Sol menüden "Raporlar"a tıkla
   - ✅ Beklenen: Kategori sayısı, ürün sayısı, erişim grafiği görünmeli

---

### Test 3: Public Menü (1 dakika)
1. **QR Kod ile Erişim**
   - Yeni bir sekme aç
   - URL: `http://localhost:5173/menu/[QR_CODE]`
     (QR_CODE yerine restoran QR kodunu yaz, örn: REST-ABC123)
   - ✅ Beklenen: Menü sayfası açılmalı

2. **Menü Görünümü**
   - Restoran adı görünmeli
   - Logo (varsa) görünmeli
   - Tema rengi uygulanmış olmalı
   - Kategoriler listelenmeli
   - Ürünler card'larda görünmeli
   - Fiyatlar doğru gösterilmeli
   - Fotoğraflar (varsa) yüklenmeli
   - ✅ Beklenen: Tüm bilgiler eksiksiz görünmeli

---

## 🔍 Detaylı Kontrol Listesi

### Backend Kontrolü
```bash
# Terminal'de backend loglarını kontrol et
# Hata olmamalı, sadece başarılı istekler loglanmalı
```

### Frontend Kontrolü
```bash
# Browser Console'u aç (F12)
# Hata olmamalı
# Network sekmesinde tüm istekler 200/201 dönmeli
```

### Database Kontrolü
```sql
-- PostgreSQL'de kontrol et
SELECT COUNT(*) FROM restaurants;  -- En az 2 olmalı
SELECT COUNT(*) FROM users;        -- En az 3 olmalı
SELECT COUNT(*) FROM categories;   -- En az 4 olmalı
SELECT COUNT(*) FROM menu_items;   -- En az 12 olmalı
SELECT COUNT(*) FROM access_logs;  -- Public menü her açılışta artar
```

---

## ✅ Test Başarı Kriterleri

### Must Have (Olmazsa Olmaz)
- [x] Giriş/Çıkış çalışıyor
- [x] Restoran CRUD çalışıyor
- [x] Kategori CRUD çalışıyor
- [x] Menü CRUD çalışıyor
- [x] Kullanıcı CRUD çalışıyor
- [x] QR kod gösteriliyor
- [x] Public menü erişilebilir
- [x] Tema rengi çalışıyor
- [x] Dosya upload çalışıyor

### Should Have (İyi Olurdu)
- [x] Modal'lar alert yerine kullanılıyor
- [x] Snackbar bildirimleri çalışıyor
- [x] Loading state'ler gösteriliyor
- [x] Fotoğraf önizlemeleri çalışıyor
- [x] İstatistikler gösteriliyor

### Nice to Have (Bonus)
- [x] Responsive design
- [x] Smooth animations
- [x] Icon kullanımı
- [x] Color coding (success, error, warning)

---

## 🐛 Sık Karşılaşılan Sorunlar

### Problem: Login çalışmıyor
**Çözüm:**
- Backend çalıştığından emin ol: http://localhost:5000
- Database bağlantısını kontrol et
- Demo data çalıştırıldı mı: `npm run init-db`

### Problem: Fotoğraflar yüklenmiyor
**Çözüm:**
- Backend'de `uploads` klasörü oluşturulmuş mu kontrol et
- File permission'ları kontrol et
- Browser console'da network hatalarına bak

### Problem: Public menü 404 veriyor
**Çözüm:**
- QR kod doğru mu kontrol et
- Restoran is_active=true mu kontrol et
- Backend route'lar doğru çalışıyor mu

### Problem: Tema rengi güncellenmiyor
**Çözüm:**
- Sayfayı yenile (F5)
- Restoran bilgisi yeniden yükleniyor mu kontrol et
- Database'de theme_color güncellenmiş mi kontrol et

---

## 📊 Beklenen Sonuçlar

### ✅ TÜM TESTLERİ GEÇERSE
```
✅ Backend: BAŞARILI
✅ Frontend: BAŞARILI
✅ Database: BAŞARILI
✅ CRUD: BAŞARILI
✅ Auth: BAŞARILI
✅ Upload: BAŞARILI
✅ QR Code: BAŞARILI
✅ Public Menu: BAŞARILI
✅ Theme: BAŞARILI

🎉 SİSTEM PRODUCTION-READY! 🎉
```

### ❌ TEST BAŞARISIZ OLURSA
- Terminal loglarını kontrol et
- Browser console'u kontrol et
- Network sekmesinde hatalı istekleri bul
- Error mesajlarını oku ve düzelt

---

## 🚀 Production Deployment Checklist

Testler başarılı olduktan sonra:

- [ ] .env dosyalarını güvenli hale getir
- [ ] JWT_SECRET güçlü bir değer kullan
- [ ] Database password'ü değiştir
- [ ] CORS ayarlarını production domain'e göre ayarla
- [ ] Build komutlarını çalıştır
- [ ] Nginx/Apache reverse proxy ayarla
- [ ] SSL sertifikası ekle
- [ ] Database backup stratejisi oluştur
- [ ] Log monitoring sistemini kur
- [ ] Error tracking ekle (Sentry vb.)

---

## 📞 Destek

Herhangi bir sorun yaşarsan:
1. Terminal loglarını kontrol et
2. Browser console'u kontrol et
3. TEST_PLAN.md dosyasındaki detaylı test senaryolarına bak
4. KULLANIM_KILAVUZU.md dosyasındaki troubleshooting bölümüne bak

**Sistem Bilgileri:**
- Backend Port: 5000
- Frontend Port: 5173
- Database: PostgreSQL
- Framework: React + TypeScript + Node.js + Express
