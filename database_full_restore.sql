-- QR Menu Database Recreation Script
-- Tüm tablolar silinmiş durumdan tam geri yükleme

-- 1. USERS Tablosu
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    restaurant_id INT4,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. RESTAURANTS Tablosu
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

-- 3. CATEGORIES Tablosu
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    restaurant_id INT4 NOT NULL,
    sort_order INT4 DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. MENU_ITEMS Tablosu
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    category_id INT4 NOT NULL,
    restaurant_id INT4 NOT NULL,
    allergens TEXT,
    is_available BOOLEAN DEFAULT true,
    sort_order INT4 DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. RESTAURANT_VIEWS Tablosu
CREATE TABLE restaurant_views (
    id SERIAL PRIMARY KEY,
    restaurant_id INT4 NOT NULL,
    view_date DATE DEFAULT CURRENT_DATE,
    view_count INT4 DEFAULT 1,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. MENU_VIEWS Tablosu
CREATE TABLE menu_views (
    id SERIAL PRIMARY KEY,
    restaurant_id INT4 NOT NULL,
    menu_item_id INT4 NOT NULL,
    view_date DATE DEFAULT CURRENT_DATE,
    view_count INT4 DEFAULT 1,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foreign Key Constraints Ekleme
ALTER TABLE users ADD CONSTRAINT fk_users_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
ALTER TABLE categories ADD CONSTRAINT fk_categories_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
ALTER TABLE menu_items ADD CONSTRAINT fk_menu_items_category FOREIGN KEY (category_id) REFERENCES categories(id);
ALTER TABLE menu_items ADD CONSTRAINT fk_menu_items_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
ALTER TABLE restaurant_views ADD CONSTRAINT fk_restaurant_views_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
ALTER TABLE menu_views ADD CONSTRAINT fk_menu_views_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
ALTER TABLE menu_views ADD CONSTRAINT fk_menu_views_menu_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id);

-- Indexes Ekleme
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_restaurant_id ON users(restaurant_id);
CREATE INDEX idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_restaurant_views_restaurant_id ON restaurant_views(restaurant_id);
CREATE INDEX idx_restaurant_views_date ON restaurant_views(view_date);
CREATE INDEX idx_menu_views_restaurant_id ON menu_views(restaurant_id);
CREATE INDEX idx_menu_views_menu_item_id ON menu_views(menu_item_id);
CREATE INDEX idx_menu_views_date ON menu_views(view_date);

-- Test Verileri Ekleme
-- Superadmin user
INSERT INTO users (username, email, password, role) VALUES 
('superadmin', 'admin@menuben.com', '$2b$10$rH8Qz9J5K4nP2xL7wE6yTOXxE8D3v.A2mF9nC6sB5gV4hR2tY8zWe', 'superadmin');

-- Test restaurant
INSERT INTO restaurants (name, description, address, phone, email, qr_code, is_active) VALUES 
('MSSCAFE VE RESTORANT', 'Kaliteli yemek ve hizmet anlayışımızla sizlere hizmet veriyoruz', 'Test Mahallesi Test Sokak No:1', '+90 555 123 4567', 'info@msscafe.com', 'msscafe-qr-2024', true);

-- Test restaurant admin
INSERT INTO users (username, email, password, role, restaurant_id) VALUES 
('saydam', 'saydam@msscafe.com', '$2b$10$rH8Qz9J5K4nP2xL7wE6yTOXxE8D3v.A2mF9nC6sB5gV4hR2tY8zWe', 'restaurant_admin', 1);

-- Test kategoriler
INSERT INTO categories (name, restaurant_id, sort_order, is_active) VALUES 
('Ana Yemek', 1, 1, true),
('İçecekler', 1, 2, true),
('Tatlı', 1, 3, true);

-- Test menü öğeleri
INSERT INTO menu_items (name, description, price, category_id, restaurant_id, is_available, sort_order) VALUES 
('Izgara Köfte', 'Özel baharatlarımızla hazırlanmış ev yapımı köfte', 45.00, 1, 1, true, 1),
('Tavuk Şiş', 'Marine edilmiş tavuk göğsü', 42.00, 1, 1, true, 2),
('Çay', 'Taze demlenen bergamot çayı', 8.00, 2, 1, true, 1),
('Ayran', 'Ev yapımı ayran', 12.00, 2, 1, true, 2),
('Sütlaç', 'Geleneksel sütlaç', 25.00, 3, 1, true, 1),
('Baklava', '2 dilim antep fıstıklı baklava', 35.00, 3, 1, true, 2);

COMMENT ON TABLE users IS 'Sistem kullanıcıları';
COMMENT ON TABLE restaurants IS 'Restoran bilgileri';
COMMENT ON TABLE categories IS 'Menü kategorileri';
COMMENT ON TABLE menu_items IS 'Menü öğeleri';
COMMENT ON TABLE restaurant_views IS 'Restoran görüntüleme istatistikleri';
COMMENT ON TABLE menu_views IS 'Menü öğesi görüntüleme istatistikleri';