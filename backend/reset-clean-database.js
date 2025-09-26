const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Railway database configuration
const railwayPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function resetDatabaseWithOnlySuperAdmin() {
  try {
    console.log('🚀 Resetting database with only superadmin...');
    
    // Drop all existing tables
    console.log('🗑️ Dropping all existing tables...');
    await railwayPool.query('DROP TABLE IF EXISTS menu_views CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS restaurant_views CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS menu_items CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS categories CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS restaurants CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('✅ All tables dropped');
    
    // Create Users table
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
    
    // Create Restaurants table
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
    
    // Create Categories table
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
    
    // Create Menu Items table
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
    
    // Create Menu Views table
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
    
    // Create Restaurant Views table
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
    
    // Insert ONLY superadmin user
    console.log('👤 Creating superadmin user...');
    
    const hashedPassword = await bcrypt.hash('123456', 10);
    await railwayPool.query(`
      INSERT INTO users (id, username, email, password, role, restaurant_id, created_at, updated_at) 
      VALUES (1, 'superadmin', 'admin@menuben.com', $1, 'super_admin', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [hashedPassword]);
    
    // Reset user sequence
    await railwayPool.query('ALTER SEQUENCE users_id_seq RESTART WITH 2');
    
    console.log('');
    console.log('🎉 DATABASE RESET COMPLETED!');
    console.log('');
    console.log('📊 Database Summary:');
    console.log('✅ Tables: 6 empty tables created');
    console.log('✅ Users: 1 (only superadmin)');
    console.log('✅ Restaurants: 0');
    console.log('✅ Categories: 0');
    console.log('✅ Menu Items: 0');
    console.log('');
    console.log('🔐 Login Credentials:');
    console.log('Email: admin@menuben.com');
    console.log('Username: superadmin');
    console.log('Password: 123456');
    console.log('Role: super_admin');
    console.log('');
    console.log('✨ Ready for fresh start!');
    
  } catch (error) {
    console.error('❌ Database reset error:', error);
  } finally {
    await railwayPool.end();
  }
}

// Only run if called directly
if (require.main === module) {
  resetDatabaseWithOnlySuperAdmin();
}

module.exports = resetDatabaseWithOnlySuperAdmin;