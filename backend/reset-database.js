const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Production environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function resetDatabase() {
  try {
    console.log('🔄 Database reset starting...');
    
    // Drop all tables first
    console.log('Dropping existing tables...');
    await pool.query('DROP TABLE IF EXISTS menu_views CASCADE');
    await pool.query('DROP TABLE IF EXISTS restaurant_views CASCADE');
    await pool.query('DROP TABLE IF EXISTS menu_items CASCADE');
    await pool.query('DROP TABLE IF EXISTS categories CASCADE');
    await pool.query('DROP TABLE IF EXISTS restaurants CASCADE');
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    
    console.log('✅ All tables dropped');
    
    // Create tables
    console.log('Creating tables...');
    
    // Users table
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'restaurant_admin')),
        restaurant_id INTEGER DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Restaurants table
    await pool.query(`
      CREATE TABLE restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(100),
        logo_url VARCHAR(255),
        owner_id INTEGER REFERENCES users(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Categories table
    await pool.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Menu items table
    await pool.query(`
      CREATE TABLE menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(255),
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        is_available BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Menu views table
    await pool.query(`
      CREATE TABLE menu_views (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT
      )
    `);
    
    // Restaurant views table
    await pool.query(`
      CREATE TABLE restaurant_views (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT
      )
    `);
    
    console.log('✅ All tables created');
    
    // Create super admin user
    console.log('Creating super admin user...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
      ['superadmin', 'admin@menuben.com', hashedPassword, 'super_admin']
    );
    
    console.log('✅ Super admin user created successfully!');
    console.log('');
    console.log('🔐 LOGIN CREDENTIALS:');
    console.log('Email: admin@menuben.com');
    console.log('Username: superadmin');
    console.log('Password: 123456');
    console.log('');
    console.log('🚀 Database reset completed successfully!');
    
  } catch (error) {
    console.error('❌ Database reset error:', error);
  } finally {
    await pool.end();
  }
}

// Only run if called directly
if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;