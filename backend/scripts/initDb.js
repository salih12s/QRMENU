const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  const client = await db.pool.connect();
  
  try {
    console.log('🔧 Veritabanı tabloları oluşturuluyor...\n');

    // Users tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'restaurant_admin')),
        restaurant_id INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users tablosu oluşturuldu');

    // Restaurants tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        logo_url VARCHAR(500),
        contact_phone VARCHAR(50),
        contact_email VARCHAR(255),
        address TEXT,
        theme_color VARCHAR(7) DEFAULT '#1976d2',
        qr_code VARCHAR(100) UNIQUE NOT NULL,
        qr_code_image TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Restaurants tablosu oluşturuldu');

    // Categories tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Categories tablosu oluşturuldu');

    // Menu Items tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        allergen_info TEXT,
        is_available BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Menu Items tablosu oluşturuldu');

    // Access Logs tablosu
    await client.query(`
      CREATE TABLE IF NOT EXISTS access_logs (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        qr_code VARCHAR(100) NOT NULL,
        table_number VARCHAR(50),
        ip_address VARCHAR(50),
        user_agent TEXT,
        accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Access Logs tablosu oluşturuldu');

    // Foreign key constraint ekle
    await client.query(`
      ALTER TABLE users 
      DROP CONSTRAINT IF EXISTS users_restaurant_id_fkey;
      
      ALTER TABLE users 
      ADD CONSTRAINT users_restaurant_id_fkey 
      FOREIGN KEY (restaurant_id) 
      REFERENCES restaurants(id) 
      ON DELETE CASCADE;
    `);
    console.log('✅ Foreign key constraints eklendi');

    // Süper Admin oluştur
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO users (email, password, full_name, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING;
    `, ['admin@system.com', hashedPassword, 'Süper Admin', 'super_admin']);
    console.log('✅ Süper Admin oluşturuldu (email: admin@system.com, şifre: admin123)');

    // Demo restoran oluştur
    const qrCode = 'DEMO-' + Date.now();
    const restaurantResult = await client.query(`
      INSERT INTO restaurants (name, description, contact_phone, contact_email, address, theme_color, qr_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (qr_code) DO NOTHING
      RETURNING id;
    `, [
      'Demo Restaurant',
      'Hoş geldiniz! Bu bir demo restorandır.',
      '+90 555 123 4567',
      'demo@restaurant.com',
      'İstanbul, Türkiye',
      '#2196f3',
      qrCode
    ]);

    if (restaurantResult.rows.length > 0) {
      const restaurantId = restaurantResult.rows[0].id;
      console.log('✅ Demo Restaurant oluşturuldu');

      // Demo restoran admini oluştur
      const adminPassword = await bcrypt.hash('demo123', 10);
      await client.query(`
        INSERT INTO users (email, password, full_name, role, restaurant_id)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING;
      `, ['demo@restaurant.com', adminPassword, 'Demo Restaurant Admin', 'restaurant_admin', restaurantId]);
      console.log('✅ Demo Restaurant Admin oluşturuldu (email: demo@restaurant.com, şifre: demo123)');

      // Demo kategoriler oluştur
      const categories = [
        { name: 'Başlangıçlar', description: 'Lezzetli başlangıç çeşitleri', order: 1 },
        { name: 'Ana Yemekler', description: 'Özel ana yemek menümüz', order: 2 },
        { name: 'Tatlılar', description: 'Ev yapımı tatlılarımız', order: 3 },
        { name: 'İçecekler', description: 'Sıcak ve soğuk içecekler', order: 4 }
      ];

      for (const cat of categories) {
        const catResult = await client.query(`
          INSERT INTO categories (restaurant_id, name, description, display_order)
          VALUES ($1, $2, $3, $4)
          RETURNING id;
        `, [restaurantId, cat.name, cat.description, cat.order]);

        const categoryId = catResult.rows[0].id;

        // Her kategoriye örnek ürünler ekle
        if (cat.name === 'Başlangıçlar') {
          await client.query(`
            INSERT INTO menu_items (restaurant_id, category_id, name, description, price, display_order)
            VALUES 
              ($1, $2, 'Çorba', 'Günün çorbası', 45.00, 1),
              ($1, $2, 'Salata', 'Mevsim yeşillikleri', 65.00, 2);
          `, [restaurantId, categoryId]);
        } else if (cat.name === 'Ana Yemekler') {
          await client.query(`
            INSERT INTO menu_items (restaurant_id, category_id, name, description, price, display_order)
            VALUES 
              ($1, $2, 'Izgara Tavuk', 'Özel soslu ızgara tavuk', 180.00, 1),
              ($1, $2, 'Köfte', 'El yapımı köfte', 195.00, 2);
          `, [restaurantId, categoryId]);
        } else if (cat.name === 'Tatlılar') {
          await client.query(`
            INSERT INTO menu_items (restaurant_id, category_id, name, description, price, display_order)
            VALUES 
              ($1, $2, 'Künefe', 'Sıcak künefe', 120.00, 1),
              ($1, $2, 'Baklava', 'Antep fıstıklı baklava', 95.00, 2);
          `, [restaurantId, categoryId]);
        } else if (cat.name === 'İçecekler') {
          await client.query(`
            INSERT INTO menu_items (restaurant_id, category_id, name, description, price, display_order)
            VALUES 
              ($1, $2, 'Ayran', 'Ev yapımı ayran', 25.00, 1),
              ($1, $2, 'Çay', 'Demlik çay', 15.00, 2);
          `, [restaurantId, categoryId]);
        }
      }
      console.log('✅ Demo kategoriler ve ürünler oluşturuldu');
    }

    console.log('\n🎉 Veritabanı başarıyla oluşturuldu!\n');
    console.log('📋 Giriş Bilgileri:');
    console.log('   Süper Admin: admin@system.com / admin123');
    console.log('   Demo Admin: demo@restaurant.com / demo123\n');

  } catch (error) {
    console.error('❌ Hata:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Script olarak çalıştırılırsa
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('✅ İşlem tamamlandı');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ İşlem başarısız:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;
