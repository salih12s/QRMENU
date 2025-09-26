const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Railway database configuration
const railwayPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createExactDatabase() {
  try {
    console.log('🚀 Creating exact database structure from screenshots...');
    
    // Drop all existing tables
    console.log('🗑️ Dropping existing tables...');
    await railwayPool.query('DROP TABLE IF EXISTS menu_views CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS restaurant_views CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS menu_items CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS categories CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS restaurants CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS users CASCADE');
    
    // Create Users table exactly as shown
    console.log('👥 Creating users table...');
    await railwayPool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        restaurant_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create Restaurants table exactly as shown
    console.log('🏪 Creating restaurants table...');
    await railwayPool.query(`
      CREATE TABLE restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT,
        phone VARCHAR(255),
        email VARCHAR(255),
        logo_url VARCHAR(255),
        qr_code VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create Categories table exactly as shown
    console.log('📂 Creating categories table...');
    await railwayPool.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        restaurant_id INTEGER NOT NULL,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create Menu Items table exactly as shown
    console.log('🍽️ Creating menu_items table...');
    await railwayPool.query(`
      CREATE TABLE menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        category_id INTEGER NOT NULL,
        restaurant_id INTEGER NOT NULL,
        allergens TEXT,
        is_available BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create Menu Views table exactly as shown
    console.log('📊 Creating menu_views table...');
    await railwayPool.query(`
      CREATE TABLE menu_views (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER NOT NULL,
        menu_item_id INTEGER,
        view_date DATE,
        view_count INTEGER DEFAULT 1,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create Restaurant Views table exactly as shown
    console.log('📈 Creating restaurant_views table...');
    await railwayPool.query(`
      CREATE TABLE restaurant_views (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER NOT NULL,
        view_date DATE,
        view_count INTEGER DEFAULT 1,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ All tables created successfully!');
    
    // Insert Users data from screenshot
    console.log('👤 Inserting users data...');
    
    // User 1: superadmin
    const hashedPassword1 = await bcrypt.hash('123456', 10);
    await railwayPool.query(`
      INSERT INTO users (id, username, email, password, role, restaurant_id, created_at, updated_at) 
      VALUES (1, 'superadmin', 'admin@qrmenu.com', $1, 'super_admin', NULL, '2025-09-16 00:32:53.876', '2025-09-16 00:32:53.876')
    `, [hashedPassword1]);
    
    // User 2: saydam
    const hashedPassword2 = await bcrypt.hash('123456', 10);
    await railwayPool.query(`
      INSERT INTO users (id, username, email, password, role, restaurant_id, created_at, updated_at) 
      VALUES (2, 'saydam', 'salihsaydam81@hotmail.com', $1, 'restaurant_admin', 2, '2025-09-16 00:50:22.915', '2025-09-16 00:50:22.915')
    `, [hashedPassword2]);
    
    // User 3: mss81
    const hashedPassword3 = await bcrypt.hash('123456', 10);
    await railwayPool.query(`
      INSERT INTO users (id, username, email, password, role, restaurant_id, created_at, updated_at) 
      VALUES (3, 'mss81', 'msuatkuf19@gmail.com', $1, 'restaurant_admin', 3, '2025-09-16 12:10:34.995', '2025-09-16 12:10:34.995')
    `, [hashedPassword3]);
    
    // Insert Restaurants data from screenshot
    console.log('🏪 Inserting restaurants data...');
    
    await railwayPool.query(`
      INSERT INTO restaurants (id, name, description, address, phone, email, logo_url, qr_code, is_active, created_at, updated_at) 
      VALUES 
      (1, 'Örnek Restoran', 'Lezzetli yemekler sunan örnek restoran', 'İstanbul, Türkiye', '+90 555 123 4567', 'ornek@restaurant.com', NULL, 'QR_001_SAMPLE', true, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (2, 'SAYDAMS', 'ABABAB', 'ABABABABA', '05454545454', 'salihsaydam81@hotmail.com', NULL, 'QR_175797289644_50hzmör', true, '2025-09-16 00:49:49.645', '2025-09-16 00:58:28.771'),
      (3, 'MSSCAFE', 'MSSCAFE VE RESTORANT', 'Fevziçakmak mahallesi dere sokak demir apartmanı no:1', '05458351361', 'msuatkuf19@gmail.com', NULL, 'QR_175801395917_gydIo5ga9', true, '2025-09-16 12:09:55.918', '2025-09-16 12:09:55.918')
    `);
    
    // Insert Categories data from screenshot
    console.log('📂 Inserting categories data...');
    
    await railwayPool.query(`
      INSERT INTO categories (id, name, restaurant_id, sort_order, is_active, created_at, updated_at) 
      VALUES 
      (1, 'Başlangıçlar', 1, 1, true, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (2, 'Ana Yemekler', 1, 2, true, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (3, 'Tatlılar', 1, 3, true, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (4, 'İçecekler', 1, 4, true, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (5, 'Ana yemek', 2, 1, true, '2025-09-16 00:52:56.023', '2025-09-16 00:52:56.023'),
      (6, 'Tatlı', 2, 2, true, '2025-09-16 01:22:51.255', '2025-09-16 01:22:51.255'),
      (7, 'Ana Yemek', 3, 0, true, '2025-09-16 12:44:01.487', '2025-09-16 12:44:01.487'),
      (8, 'Tatlı', 3, 0, true, '2025-09-16 12:44:06.963', '2025-09-16 12:44:06.963'),
      (9, 'İçecekler', 3, 0, true, '2025-09-16 12:44:12.836', '2025-09-16 12:44:12.836')
    `);
    
    // Insert Menu Items data from screenshot
    console.log('🍽️ Inserting menu_items data...');
    
    await railwayPool.query(`
      INSERT INTO menu_items (id, name, description, price, image_url, category_id, restaurant_id, allergens, is_available, sort_order, created_at, updated_at) 
      VALUES 
      (1, 'Çorba', 'Günün çorbası', 25.00, NULL, 1, 1, NULL, true, 1, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (2, 'Salata', 'Mevsim salatası', 35.00, NULL, 1, 1, NULL, true, 2, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (3, 'Izgara Tavuk', 'Özel soslu ızgara tavuk', 85.00, NULL, 2, 1, NULL, true, 1, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (4, 'Köfte', 'Ev yapımı köfte', 75.00, NULL, 2, 1, NULL, true, 2, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (5, 'Baklava', 'Antep fıstıklı baklava', 45.00, NULL, 3, 1, NULL, true, 1, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (6, 'Ayran', 'Ev yapımı ayran', 15.00, NULL, 4, 1, NULL, true, 1, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (7, 'Çay', 'Demli çay', 10.00, NULL, 4, 1, NULL, true, 2, '2025-09-16 00:25:37.136', '2025-09-16 00:25:37.136'),
      (8, 'Izgara Tavuk', 'Izgara tavuk menüye özel malzemeler', 250.00, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBD...', 5, 2, NULL, true, 2, '2025-09-16 01:21:40.659', '2025-09-16 01:21:40.659'),
      (9, 'çorba', 'hvjhvj', 180.00, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBD...', 5, 2, NULL, true, 2, '2025-09-16 01:23:22.191', '2025-09-16 01:23:22.191'),
      (10, 'Magnolia', 'Magnolia', 280.00, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAOAAQAB/9j/4...', 6, 2, NULL, true, 0, '2025-09-16 01:23:22.191', '2025-09-16 01:23:22.191'),
      (11, 'Izgara Tavuk', 'Izgara Tavuk , Kanat , Közlenmiş domates , biber', 350.00, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAOAAQAB/9j/4...', 7, 3, NULL, true, 0, '2025-09-16 12:45:45.770', '2025-09-16 12:45:45.770'),
      (12, 'Kola', NULL, 64.99, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAOAAQAB/9j/4...', 9, 3, NULL, true, 0, '2025-09-16 12:58:59.007', '2025-09-16 12:58:59.007'),
      (13, 'Fanta', NULL, 75.00, 'data:image/jpeg;base64,/vBORw0KGgoAAAANSUhEUgA...', 9, 3, NULL, true, 0, '2025-09-16 12:59:13.820', '2025-09-16 12:59:13.820'),
      (14, 'Magnolia', NULL, 350.00, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAOAAQAB/9j/4...', 8, 3, NULL, true, 0, '2025-09-16 12:59:34.976', '2025-09-16 12:59:34.976')
    `);
    
    // Insert Restaurant Views data from screenshot
    console.log('📈 Inserting restaurant_views data...');
    
    await railwayPool.query(`
      INSERT INTO restaurant_views (id, restaurant_id, view_date, view_count, ip_address, user_agent, created_at) 
      VALUES 
      (1, 2, '2025-09-16', 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', '2025-09-16 12:40:48')
    `);
    
    // Reset sequences to match the data
    console.log('🔄 Resetting sequences...');
    await railwayPool.query('ALTER SEQUENCE users_id_seq RESTART WITH 4');
    await railwayPool.query('ALTER SEQUENCE restaurants_id_seq RESTART WITH 4');
    await railwayPool.query('ALTER SEQUENCE categories_id_seq RESTART WITH 10');
    await railwayPool.query('ALTER SEQUENCE menu_items_id_seq RESTART WITH 15');
    await railwayPool.query('ALTER SEQUENCE menu_views_id_seq RESTART WITH 1');
    await railwayPool.query('ALTER SEQUENCE restaurant_views_id_seq RESTART WITH 2');
    
    console.log('');
    console.log('🎉 DATABASE CREATED EXACTLY AS SHOWN IN SCREENSHOTS!');
    console.log('');
    console.log('📊 Database Summary:');
    console.log('✅ Users: 3 (superadmin, saydam, mss81)');
    console.log('✅ Restaurants: 3 (Örnek Restoran, SAYDAMS, MSSCAFE)');
    console.log('✅ Categories: 9 categories across all restaurants');
    console.log('✅ Menu Items: 14 items with exact data from screenshots');
    console.log('✅ Views: Restaurant views data included');
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('Super Admin: admin@qrmenu.com / 123456');
    console.log('Saydam: salihsaydam81@hotmail.com / 123456');
    console.log('MSS81: msuatkuf19@gmail.com / 123456');
    
  } catch (error) {
    console.error('❌ Database creation error:', error);
  } finally {
    await railwayPool.end();
  }
}

// Only run if called directly
if (require.main === module) {
  createExactDatabase();
}

module.exports = createExactDatabase;