-- QR Menu Database Schema

-- Users table (super_admin ve restaurant_admin için)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('super_admin', 'restaurant_admin')) NOT NULL,
    restaurant_id INTEGER DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants table
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    logo_url TEXT,
    qr_code VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table (başlangıçlar, ana yemekler, tatlılar, içecekler)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    allergens TEXT,
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu views table (raporlama için)
CREATE TABLE menu_views (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    view_date DATE DEFAULT CURRENT_DATE,
    view_count INTEGER DEFAULT 1,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurant views table (genel restoran görüntülenmeleri)
CREATE TABLE restaurant_views (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    view_date DATE DEFAULT CURRENT_DATE,
    view_count INTEGER DEFAULT 1,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foreign key constraints
ALTER TABLE users ADD CONSTRAINT fk_users_restaurant 
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);
CREATE INDEX idx_menu_views_restaurant ON menu_views(restaurant_id);
CREATE INDEX idx_menu_views_date ON menu_views(view_date);
CREATE INDEX idx_restaurant_views_restaurant ON restaurant_views(restaurant_id);
CREATE INDEX idx_restaurant_views_date ON restaurant_views(view_date);

-- Default super admin user (password: 12345)
INSERT INTO users (username, email, password, role) VALUES 
('superadmin', 'admin@qrmenu.com', '$2a$10$K8YyR4.KE5VN7C2B6XYVUO2eZNEYYQKJYXJ9YMl4FXN7x8F6v3lFO', 'super_admin');

-- Sample restaurant
INSERT INTO restaurants (name, description, address, phone, email, qr_code) VALUES 
('Örnek Restoran', 'Lezzetli yemekler sunan örnek restoran', 'İstanbul, Türkiye', '+90 555 123 4567', 'ornek@restaurant.com', 'QR_001_SAMPLE');

-- Sample categories
INSERT INTO categories (name, restaurant_id, sort_order) VALUES 
('Başlangıçlar', 1, 1),
('Ana Yemekler', 1, 2),
('Tatlılar', 1, 3),
('İçecekler', 1, 4);

-- Sample menu items
INSERT INTO menu_items (name, description, price, category_id, restaurant_id, sort_order) VALUES 
('Çorba', 'Günün çorbası', 25.00, 1, 1, 1),
('Salata', 'Mevsim salatası', 35.00, 1, 1, 2),
('Izgara Tavuk', 'Özel soslu ızgara tavuk', 85.00, 2, 1, 1),
('Köfte', 'Ev yapımı köfte', 75.00, 2, 1, 2),
('Baklava', 'Antep fıstıklı baklava', 45.00, 3, 1, 1),
('Ayran', 'Ev yapımı ayran', 15.00, 4, 1, 1),
('Çay', 'Demli çay', 10.00, 4, 1, 2);

-- Super Admin kullanıcısı oluştur (şifre: 12345)
INSERT INTO users (username, email, password, role) VALUES 
('superadmin', 'admin@qrmenu.com', '$2a$10$8K6H7.YR2aL8z7jFQVhF5.ePJDLLfN7T3eJP.J4KJn8bLyKcYxLhe', 'super_admin');