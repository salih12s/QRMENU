const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Local database configuration
const localPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'qrmenu',
  password: '123456',
  port: 5432,
});

// Railway database configuration
const railwayPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateDataToRailway() {
  try {
    console.log('🚀 Starting data migration from local to Railway...');
    
    // 1. Get all users from local
    console.log('📋 Exporting users...');
    const localUsers = await localPool.query('SELECT * FROM users ORDER BY id');
    console.log(`Found ${localUsers.rows.length} users`);
    
    // 2. Get all restaurants from local
    console.log('📋 Exporting restaurants...');
    const localRestaurants = await localPool.query('SELECT * FROM restaurants ORDER BY id');
    console.log(`Found ${localRestaurants.rows.length} restaurants`);
    
    // 3. Get all categories from local
    console.log('📋 Exporting categories...');
    const localCategories = await localPool.query('SELECT * FROM categories ORDER BY id');
    console.log(`Found ${localCategories.rows.length} categories`);
    
    // 4. Get all menu items from local
    console.log('📋 Exporting menu items...');
    const localMenuItems = await localPool.query('SELECT * FROM menu_items ORDER BY id');
    console.log(`Found ${localMenuItems.rows.length} menu items`);
    
    // 5. Clear Railway database and recreate structure
    console.log('🔄 Clearing Railway database...');
    await railwayPool.query('DROP TABLE IF EXISTS menu_views CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS restaurant_views CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS menu_items CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS categories CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS restaurants CASCADE');
    await railwayPool.query('DROP TABLE IF EXISTS users CASCADE');
    
    // Recreate tables
    console.log('🏗️  Creating tables in Railway...');
    
    // Users table
    await railwayPool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'superadmin', 'restaurant_admin')),
        restaurant_id INTEGER DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Restaurants table
    await railwayPool.query(`
      CREATE TABLE restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(100),
        logo_url VARCHAR(255),
        owner_id INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Categories table
    await railwayPool.query(`
      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        restaurant_id INTEGER,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Menu items table
    await railwayPool.query(`
      CREATE TABLE menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(255),
        category_id INTEGER,
        restaurant_id INTEGER,
        is_available BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Menu views table
    await railwayPool.query(`
      CREATE TABLE menu_views (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT
      )
    `);
    
    // Restaurant views table
    await railwayPool.query(`
      CREATE TABLE restaurant_views (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT
      )
    `);
    
    console.log('✅ Tables created in Railway');
    
    // 6. Import users
    console.log('📥 Importing users...');
    for (const user of localUsers.rows) {
      await railwayPool.query(
        'INSERT INTO users (id, username, email, password, role, restaurant_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [user.id, user.username, user.email, user.password, user.role, user.restaurant_id, user.created_at, user.updated_at]
      );
    }
    
    // Reset user sequence
    const maxUserId = await railwayPool.query('SELECT MAX(id) FROM users');
    const nextUserId = (maxUserId.rows[0].max || 0) + 1;
    await railwayPool.query(`ALTER SEQUENCE users_id_seq RESTART WITH ${nextUserId}`);
    
    // 7. Import restaurants
    console.log('📥 Importing restaurants...');
    for (const restaurant of localRestaurants.rows) {
      await railwayPool.query(
        'INSERT INTO restaurants (id, name, description, address, phone, email, logo_url, owner_id, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        [restaurant.id, restaurant.name, restaurant.description, restaurant.address, restaurant.phone, restaurant.email, restaurant.logo_url, restaurant.owner_id, restaurant.is_active, restaurant.created_at, restaurant.updated_at]
      );
    }
    
    // Reset restaurant sequence
    const maxRestaurantId = await railwayPool.query('SELECT MAX(id) FROM restaurants');
    const nextRestaurantId = (maxRestaurantId.rows[0].max || 0) + 1;
    await railwayPool.query(`ALTER SEQUENCE restaurants_id_seq RESTART WITH ${nextRestaurantId}`);
    
    // 8. Import categories
    console.log('📥 Importing categories...');
    for (const category of localCategories.rows) {
      await railwayPool.query(
        'INSERT INTO categories (id, name, description, restaurant_id, display_order, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [category.id, category.name, category.description, category.restaurant_id, category.display_order, category.is_active, category.created_at, category.updated_at]
      );
    }
    
    // Reset category sequence
    const maxCategoryId = await railwayPool.query('SELECT MAX(id) FROM categories');
    const nextCategoryId = (maxCategoryId.rows[0].max || 0) + 1;
    await railwayPool.query(`ALTER SEQUENCE categories_id_seq RESTART WITH ${nextCategoryId}`);
    
    // 9. Import menu items
    console.log('📥 Importing menu items...');
    for (const menuItem of localMenuItems.rows) {
      await railwayPool.query(
        'INSERT INTO menu_items (id, name, description, price, image_url, category_id, restaurant_id, is_available, display_order, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        [menuItem.id, menuItem.name, menuItem.description, menuItem.price, menuItem.image_url, menuItem.category_id, menuItem.restaurant_id, menuItem.is_available, menuItem.display_order, menuItem.created_at, menuItem.updated_at]
      );
    }
    
    // Reset menu item sequence
    const maxMenuItemId = await railwayPool.query('SELECT MAX(id) FROM menu_items');
    const nextMenuItemId = (maxMenuItemId.rows[0].max || 0) + 1;
    await railwayPool.query(`ALTER SEQUENCE menu_items_id_seq RESTART WITH ${nextMenuItemId}`);
    
    // 10. Add foreign key constraints
    console.log('🔗 Adding foreign key constraints...');
    await railwayPool.query('ALTER TABLE restaurants ADD CONSTRAINT restaurants_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(id)');
    await railwayPool.query('ALTER TABLE categories ADD CONSTRAINT categories_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE');
    await railwayPool.query('ALTER TABLE menu_items ADD CONSTRAINT menu_items_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE');
    await railwayPool.query('ALTER TABLE menu_items ADD CONSTRAINT menu_items_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE');
    await railwayPool.query('ALTER TABLE menu_views ADD CONSTRAINT menu_views_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE');
    await railwayPool.query('ALTER TABLE restaurant_views ADD CONSTRAINT restaurant_views_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE');
    
    console.log('');
    console.log('🎉 DATA MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('');
    console.log('📊 Migration Summary:');
    console.log(`✅ Users: ${localUsers.rows.length} imported`);
    console.log(`✅ Restaurants: ${localRestaurants.rows.length} imported`);
    console.log(`✅ Categories: ${localCategories.rows.length} imported`);
    console.log(`✅ Menu Items: ${localMenuItems.rows.length} imported`);
    console.log('');
    console.log('🔐 Login Credentials:');
    localUsers.rows.forEach(user => {
      console.log(`${user.role}: ${user.email} / ${user.username}`);
    });
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await localPool.end();
    await railwayPool.end();
  }
}

// Only run if called directly
if (require.main === module) {
  migrateDataToRailway();
}

module.exports = migrateDataToRailway;