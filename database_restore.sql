-- QR Menu Database Schema Recreation
-- All tables for the QRMenu system

-- 1. Users table (Super Admin, Restaurant Admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'restaurant_admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Restaurants table
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    admin_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Menu Items table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. QR Codes table
CREATE TABLE qr_codes (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number VARCHAR(20) NOT NULL,
    qr_code_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(restaurant_id, table_number)
);

-- 6. Menu Views/Analytics table
CREATE TABLE menu_views (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number VARCHAR(20),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address INET
);

-- 7. Orders table (optional for future use)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number VARCHAR(20),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Order Items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    notes TEXT
);

-- Insert default Super Admin user
INSERT INTO users (username, password, email, role) VALUES 
('superadmin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@menuben.com', 'super_admin');

-- Insert demo restaurant admin
INSERT INTO users (username, password, email, role) VALUES 
('saydam', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'saydam@menuben.com', 'restaurant_admin');

-- Insert demo restaurant
INSERT INTO restaurants (name, description, address, phone, email, admin_user_id) VALUES 
('MSSCAFE VE RESTORANT', 'Modern ve lezzetli yemeklerin buluşma noktası', 'İstanbul, Türkiye', '+90 555 123 4567', 'info@msscafe.com', 2);

-- Insert demo categories
INSERT INTO categories (restaurant_id, name, description, display_order) VALUES 
(1, 'Ana Yemek', 'Nefis ana yemek çeşitleri', 1),
(1, 'İçecekler', 'Sıcak ve soğuk içecek seçenekleri', 2),
(1, 'Tatlı', 'Ağızda dağılan lezzetli tatlılar', 3);

-- Insert demo menu items
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_available, display_order) VALUES 
-- Ana Yemek
(1, 1, 'Izgara Köfte', 'Özel baharatlarla hazırlanmış nefis ızgara köfte', 45.50, true, 1),
(1, 1, 'Tavuk Şiş', 'Marine edilmiş tavuk göğsü ızgara', 38.00, true, 2),
(1, 1, 'Adana Kebap', 'Geleneksel Adana usulü acılı kebap', 52.00, true, 3),

-- İçecekler
(1, 2, 'Türk Kahvesi', 'Geleneksel Türk kahvesi', 12.00, true, 1),
(1, 2, 'Çay', 'Demli Türk çayı', 8.00, true, 2),
(1, 2, 'Fresh Limonata', 'Taze sıkılmış limon suyu', 15.00, true, 3),
(1, 2, 'Coca Cola', 'Soğuk kola', 10.00, true, 4),

-- Tatlı
(1, 3, 'Baklava', 'Geleneksel Türk baklavası', 25.00, true, 1),
(1, 3, 'Sütlaç', 'Ev yapımı sütlaç', 18.00, true, 2),
(1, 3, 'Tiramisu', 'İtalyan usulü tiramisu', 28.00, true, 3);

-- Insert demo QR codes
INSERT INTO qr_codes (restaurant_id, table_number, is_active) VALUES 
(1, '1', true),
(1, '2', true),
(1, '3', true),
(1, '4', true),
(1, '5', true);

-- Create indexes for better performance
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX idx_qr_codes_restaurant_id ON qr_codes(restaurant_id);
CREATE INDEX idx_menu_views_restaurant_id ON menu_views(restaurant_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;