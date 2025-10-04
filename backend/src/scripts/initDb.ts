import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

async function initDatabase() {
  const client = await pool.connect();
  
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
        cover_image_url VARCHAR(500),
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
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints 
          WHERE constraint_name = 'users_restaurant_id_fkey'
        ) THEN
          ALTER TABLE users 
          ADD CONSTRAINT users_restaurant_id_fkey 
          FOREIGN KEY (restaurant_id) 
          REFERENCES restaurants(id) 
          ON DELETE CASCADE;
        END IF;
      END $$;
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

    console.log('\n━'.repeat(35));
    console.log('🎉 VERİTABANI BAŞARIYLA OLUŞTURULDU!');
    console.log('━'.repeat(35));
    console.log('\n📋 Giriş Bilgileri:');
    console.log('   Email: admin@system.com');
    console.log('   Şifre: admin123');
    console.log('\n🚀 Sistem kullanıma hazır!');
    console.log('   - Süper admin ile giriş yapın');
    console.log('   - İlk restoranınızı oluşturun');
    console.log('   - Restoran admin kullanıcısı ekleyin');
    console.log('   - Menünüzü dinamik olarak oluşturun\n');

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

export default initDatabase;
