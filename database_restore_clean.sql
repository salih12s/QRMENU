-- ====================================================
-- QR MENU DATABASE RESTORE SCRIPT
-- Tüm tabloları yeniden oluşturma
-- ====================================================

-- Önce varsa tüm tabloları sil (foreign key hatalarını önlemek için)
DROP TABLE IF EXISTS menu_views CASCADE;
DROP TABLE IF EXISTS restaurant_views CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;

-- ====================================================
-- TABLOLARI OLUŞTUR
-- ====================================================

-- 1. RESTAURANTS Tablosu
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    logo_url TEXT,
    qr_code VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS Tablosu
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('superadmin', 'restaurant_admin')),
    restaurant_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL
);

-- 3. CATEGORIES Tablosu
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    restaurant_id INTEGER NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- 4. MENU_ITEMS Tablosu
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    category_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    allergens TEXT,
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- 5. RESTAURANT_VIEWS Tablosu
CREATE TABLE restaurant_views (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL,
    view_date DATE DEFAULT CURRENT_DATE,
    view_count INTEGER DEFAULT 1,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- 6. MENU_VIEWS Tablosu
CREATE TABLE menu_views (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL,
    menu_item_id INTEGER NOT NULL,
    view_date DATE DEFAULT CURRENT_DATE,
    view_count INTEGER DEFAULT 1,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- ====================================================
-- INDEX'LERI OLUŞTUR
-- ====================================================

-- Users tablosu indexleri
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_restaurant_id ON users(restaurant_id);
CREATE INDEX idx_users_role ON users(role);

-- Categories tablosu indexleri
CREATE INDEX idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX idx_categories_active ON categories(is_active);

-- Menu Items tablosu indexleri
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_available ON menu_items(is_available);

-- Views tabloları indexleri
CREATE INDEX idx_restaurant_views_restaurant_id ON restaurant_views(restaurant_id);
CREATE INDEX idx_restaurant_views_date ON restaurant_views(view_date);
CREATE INDEX idx_menu_views_restaurant_id ON menu_views(restaurant_id);
CREATE INDEX idx_menu_views_menu_item_id ON menu_views(menu_item_id);
CREATE INDEX idx_menu_views_date ON menu_views(view_date);

-- ====================================================
-- TEST VERİLERİNİ EKLE
-- ====================================================

-- 1. Test Restoranı Ekle
INSERT INTO restaurants (name, description, address, phone, email, qr_code, is_active) VALUES 
('MSSCAFE VE RESTORANT', 'Kaliteli yemek ve hizmet anlayışımızla sizlere hizmet veriyoruz', 'Test Mahallesi Test Sokak No:1', '+90 555 123 4567', 'info@msscafe.com', 'msscafe-qr-2024', true);

-- 2. Superadmin Kullanıcısı Ekle
INSERT INTO users (username, email, password, role) VALUES 
('superadmin', 'admin@menuben.com', '$2b$10$rH8Qz9J5K4nP2xL7wE6yTOXxE8D3v.A2mF9nC6sB5gV4hR2tY8zWe', 'superadmin');

-- 3. Restaurant Admin Kullanıcısı Ekle
INSERT INTO users (username, email, password, role, restaurant_id) VALUES 
('saydam', 'saydam@msscafe.com', '$2b$10$rH8Qz9J5K4nP2xL7wE6yTOXxE8D3v.A2mF9nC6sB5gV4hR2tY8zWe', 'restaurant_admin', 1);

-- 4. Test Kategorileri Ekle
INSERT INTO categories (name, restaurant_id, sort_order, is_active) VALUES 
('Ana Yemek', 1, 1, true),
('İçecekler', 1, 2, true),
('Tatlı', 1, 3, true);

-- 5. Test Menü Öğeleri Ekle
INSERT INTO menu_items (name, description, price, category_id, restaurant_id, is_available, sort_order) VALUES 
('Izgara Köfte', 'Özel baharatlarımızla hazırlanmış ev yapımı köfte', 45.00, 1, 1, true, 1),
('Tavuk Şiş', 'Marine edilmiş tavuk göğsü', 42.00, 1, 1, true, 2),
('Adana Kebap', 'Acılı kıyma kebabı', 48.00, 1, 1, true, 3),
('Çay', 'Taze demlenen bergamot çayı', 8.00, 2, 1, true, 1),
('Ayran', 'Ev yapımı ayran', 12.00, 2, 1, true, 2),
('Kola', 'Soğuk kola', 15.00, 2, 1, true, 3),
('Sütlaç', 'Geleneksel sütlaç', 25.00, 3, 1, true, 1),
('Baklava', '2 dilim antep fıstıklı baklava', 35.00, 3, 1, true, 2),
('Künefe', 'Sıcak künefe', 40.00, 3, 1, true, 3);

-- ====================================================
-- TABLO YORUMLARI EKLE
-- ====================================================

COMMENT ON TABLE restaurants IS 'Restoran bilgileri tablosu';
COMMENT ON TABLE users IS 'Sistem kullanıcıları tablosu';
COMMENT ON TABLE categories IS 'Menü kategorileri tablosu';
COMMENT ON TABLE menu_items IS 'Menü öğeleri tablosu';
COMMENT ON TABLE restaurant_views IS 'Restoran görüntüleme istatistikleri';
COMMENT ON TABLE menu_views IS 'Menü öğesi görüntüleme istatistikleri';

-- ====================================================
-- BAŞARI MESAJI
-- ====================================================

DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'QR MENU DATABASE BAŞARIYLA OLUŞTURULDU!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Test Kullanıcıları:';
    RAISE NOTICE '- superadmin / 12345 (Super Admin)';
    RAISE NOTICE '- saydam / 12345 (Restaurant Admin)';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Toplam Tablo: 6';
    RAISE NOTICE 'Toplam Index: 14';
    RAISE NOTICE 'Test Verileri: Yüklendi';
    RAISE NOTICE '====================================================';
END $$;