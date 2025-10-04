# 🚀 KULLANIM KILAVUZU

## ✅ Kurulum Tamamlandı!

Sistem başarıyla kuruldu ve çalışıyor. Aşağıdaki adımları takip ederek kullanmaya başlayabilirsiniz.

## 📋 Erişim Bilgileri

### Süper Admin
- **Email:** admin@system.com
- **Şifre:** admin123
- **Yetkiler:** Tüm sistem yönetimi

### Demo Restoran Admin
- **Email:** demo@restaurant.com
- **Şifre:** demo123
- **Yetkiler:** Sadece Demo Restaurant yönetimi

## 🌐 URL'ler

- **Frontend (Kullanıcı Arayüzü):** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Login Sayfası:** http://localhost:5173/login
- **Demo Menü (QR Kod):** http://localhost:5173/menu/DEMO-[timestamp]

## 🎯 Özellikler ve Kullanım

### 1️⃣ SÜPER ADMIN PANELİ

#### Giriş Yapma
1. http://localhost:5173/login adresine gidin
2. admin@system.com / admin123 ile giriş yapın
3. Otomatik olarak admin paneline yönlendirileceksiniz

#### Restoran Yönetimi
- **Yeni Restoran Ekleme:**
  1. Sol menüden "Restoranlar" seçin
  2. Sağ üstteki "Yeni Restoran" butonuna tıklayın
  3. Formu doldurun:
     - Restoran Adı (zorunlu)
     - Açıklama
     - Telefon
     - E-posta
     - Adres
     - Tema Rengi (renk seçici ile)
     - Logo (opsiyonel - resim yüklenebilir)
  4. "Oluştur" butonuna tıklayın
  5. Sistem otomatik QR kod oluşturacak

- **QR Kod Görüntüleme:**
  1. Restoran listesinde QR kod ikonuna tıklayın
  2. QR kodu görüntüleyin, indirebilir veya yazdırabilirsiniz
  3. Bu QR kodu masalara yerleştirin

- **Restoran Silme:**
  1. Silmek istediğiniz restoranın yanındaki çöp kutusu ikonuna tıklayın
  2. Onaylayın

#### İstatistikler
- **Dashboard:** Genel sistem istatistikleri
  - Toplam restoran sayısı
  - Toplam menü erişim sayısı
  - Son 30 gün erişim sayısı
  - Restoran bazlı detaylı erişim bilgileri

#### Kullanıcı Yönetimi
- Yeni restoran admini oluşturma
- Kullanıcı rolleri atama
- Şifre sıfırlama

### 2️⃣ RESTORAN ADMIN PANELİ

#### Giriş Yapma
1. http://localhost:5173/login adresine gidin
2. Kendi restoran email ve şifreniz ile giriş yapın
3. Sadece kendi restoranınızın yönetim paneline erişebilirsiniz

#### Dashboard
- Restoran bilgilerinizi görüntüleyin
- QR kodunuzu görün ve indirin
- Logo, iletişim bilgileri

#### Kategori Yönetimi
1. Sol menüden "Kategoriler" seçin
2. **Yeni Kategori Ekle:**
   - "Yeni Kategori" butonuna tıklayın
   - Kategori adı girin (ör: Başlangıçlar, Ana Yemekler, Tatlılar, İçecekler)
   - Açıklama ekleyin (opsiyonel)
   - "Oluştur" butonuna tıklayın

3. **Kategori Silme:**
   - Silmek istediğiniz kategorinin yanındaki çöp kutusu ikonuna tıklayın
   - Onaylayın (kategori ile birlikte içindeki ürünler de silinir)

#### Menü Yönetimi
1. Sol menüden "Menü" seçin
2. **Yeni Ürün Ekle:**
   - "Yeni Ürün" butonuna tıklayın
   - Formu doldurun:
     - Kategori seçin
     - Ürün adı
     - Açıklama
     - Fiyat (TL)
     - Alerjen bilgisi (opsiyonel)
     - Fotoğraf yükle (opsiyonel - jpeg, jpg, png, gif, webp)
   - "Oluştur" butonuna tıklayın

3. **Ürün Silme:**
   - Ürün kartındaki çöp kutusu ikonuna tıklayın
   - Onaylayın

#### Tema Ayarları
1. Sol menüden "Tema" seçin
2. Renk seçici ile tema renginizi seçin
3. Önizleme kutusunda rengi görün
4. "Kaydet" butonuna tıklayın
5. Bu renk:
   - Restoran admin panelinizdeki başlık çubuğunda
   - Müşterilerin gördüğü menü sayfasında başlık ve fiyat etiketlerinde kullanılır

#### Logo ve Restoran Bilgileri Güncelleme
1. Dashboard'dan veya Tema ayarlarından logo yükleyebilirsiniz
2. İletişim bilgilerini güncelleyebilirsiniz
3. Restoran açıklaması ekleyebilirsiniz

#### Raporlar
1. Sol menüden "Raporlar" seçin
2. Görüntüleyin:
   - Toplam menü erişim sayısı
   - Toplam kategori sayısı
   - Toplam ürün sayısı
   - Günlük erişim grafikleri (yakında)
   - Popüler ürünler (yakında)

### 3️⃣ MÜŞTERİ DENEYİMİ (QR KOD İLE MENÜ)

#### Müşteri Olarak Menü Görüntüleme
1. Restoran masasındaki QR kodu telefonla okutun
2. Tarayıcıda menü sayfası otomatik açılır
3. Görüntüleyin:
   - Restoran logosu ve bilgileri
   - Kategorilere ayrılmış ürünler
   - Her ürünün:
     - Adı
     - Açıklaması
     - Fiyatı (TL)
     - Fotoğrafı (varsa)
     - Alerjen bilgisi (varsa)
4. Hiçbir kayıt veya giriş gerektirmez
5. Anlık güncel menü - restorandaki değişiklikler hemen yansır

## 🎨 Tasarım Özellikleri

- **Material-UI (MUI):** Modern ve profesyonel arayüz
- **Responsive:** Mobil, tablet ve masaüstü uyumlu
- **Modal Kullanımı:** Alert yerine kullanıcı dostu modallar
- **Snackbar Bildirimleri:** Sağ üst köşede otomatik kapanan bildirimler
- **Tema Özelleştirme:** Her restoran kendi rengini seçebilir
- **Sade Renkler:** Profesyonel ve göze hoş renk paleti

## 📊 Database Yapısı

### Tablolar
- **users:** Kullanıcılar (süper admin, restoran adminleri)
- **restaurants:** Restoranlar ve tema ayarları
- **categories:** Menü kategorileri
- **menu_items:** Menü ürünleri
- **access_logs:** QR kod erişim logları (raporlama için)

## 🔧 Geliştirici Notları

### Backend Çalıştırma
```bash
cd backend
npm install
npm run db:init  # İlk kurulumda
npm run dev      # Development
npm run build    # Production build
npm start        # Production
```

### Frontend Çalıştırma
```bash
cd frontend
npm install
npm run dev      # Development
npm run build    # Production build
npm run preview  # Production preview
```

### API Endpoints

#### Authentication
- POST `/api/auth/login` - Giriş
- GET `/api/auth/me` - Kullanıcı bilgisi
- POST `/api/auth/register` - Yeni kullanıcı (süper admin)

#### Restaurants
- GET `/api/restaurants` - Tüm restoranlar
- GET `/api/restaurants/:id` - Restoran detayı
- POST `/api/restaurants` - Yeni restoran
- PUT `/api/restaurants/:id` - Restoran güncelle
- DELETE `/api/restaurants/:id` - Restoran sil
- POST `/api/restaurants/:id/regenerate-qr` - QR kod yenile

#### Categories
- GET `/api/categories/:restaurantId` - Kategoriler
- POST `/api/categories` - Yeni kategori
- PUT `/api/categories/:id` - Kategori güncelle
- DELETE `/api/categories/:id` - Kategori sil

#### Menu
- GET `/api/menu/:restaurantId` - Menü ürünleri
- POST `/api/menu` - Yeni ürün
- PUT `/api/menu/:id` - Ürün güncelle
- DELETE `/api/menu/:id` - Ürün sil

#### Public
- GET `/api/public/menu/:qrCode` - QR kod ile menü (auth gerektirmez)

#### Reports
- GET `/api/reports/restaurant/:restaurantId` - Restoran istatistikleri
- GET `/api/reports/all` - Tüm restoranlar (süper admin)

## 🔐 Güvenlik

- JWT token tabanlı authentication
- Rol bazlı yetkilendirme (RBAC)
- Şifreler bcrypt ile hashlenir
- Her restoran sadece kendi verilerine erişebilir
- SQL injection koruması (parametreli sorgular)
- CORS koruması
- File upload güvenlik kontrolleri

## 🐛 Sorun Giderme

### Backend başlamıyor
```bash
# Database bağlantısını kontrol edin
# .env dosyasındaki bilgileri kontrol edin
# PostgreSQL'in çalıştığından emin olun
```

### Frontend başlamıyor
```bash
# Backend'in çalıştığından emin olun
# Port 5173 kullanımda olabilir
```

### QR kod çalışmıyor
- QR kod URL'sinin doğru olduğundan emin olun
- Backend'in çalıştığından emin olun
- Restaurant'ın aktif olduğunu kontrol edin

## 📞 Destek

Herhangi bir sorun veya öneriniz için issue açabilirsiniz.

## 📝 Lisans

MIT License
