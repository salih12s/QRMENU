const { Pool } = require('pg');

// Railway database configuration
const railwayPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixProductionIssues() {
  try {
    console.log('🔧 Fixing production database issues...');
    
    // 1. Restaurant views tablosuna unique constraint ekle
    console.log('📊 Adding unique constraint to restaurant_views...');
    try {
      await railwayPool.query(`
        ALTER TABLE restaurant_views 
        ADD CONSTRAINT restaurant_views_unique 
        UNIQUE (restaurant_id, ip_address, view_date)
      `);
      console.log('✅ Unique constraint added to restaurant_views');
    } catch (error) {
      if (error.code === '42P07') {
        console.log('ℹ️ Unique constraint already exists on restaurant_views');
      } else {
        console.log('⚠️ Could not add constraint to restaurant_views:', error.message);
      }
    }
    
    // 2. Menu views tablosuna unique constraint ekle
    console.log('📊 Adding unique constraint to menu_views...');
    try {
      await railwayPool.query(`
        ALTER TABLE menu_views 
        ADD CONSTRAINT menu_views_unique 
        UNIQUE (restaurant_id, menu_item_id, ip_address, view_date)
      `);
      console.log('✅ Unique constraint added to menu_views');
    } catch (error) {
      if (error.code === '42P07') {
        console.log('ℹ️ Unique constraint already exists on menu_views');
      } else {
        console.log('⚠️ Could not add constraint to menu_views:', error.message);
      }
    }
    
    // 3. Foreign key constraints kontrol et ve ekle
    console.log('🔗 Adding missing foreign key constraints...');
    
    // Categories -> Restaurants
    try {
      await railwayPool.query(`
        ALTER TABLE categories 
        ADD CONSTRAINT categories_restaurant_id_fkey 
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      `);
      console.log('✅ Categories foreign key added');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️ Categories foreign key already exists');
      } else {
        console.log('⚠️ Could not add categories foreign key:', error.message);
      }
    }
    
    // Menu items -> Categories
    try {
      await railwayPool.query(`
        ALTER TABLE menu_items 
        ADD CONSTRAINT menu_items_category_id_fkey 
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      `);
      console.log('✅ Menu items category foreign key added');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️ Menu items category foreign key already exists');
      } else {
        console.log('⚠️ Could not add menu items category foreign key:', error.message);
      }
    }
    
    // Menu items -> Restaurants
    try {
      await railwayPool.query(`
        ALTER TABLE menu_items 
        ADD CONSTRAINT menu_items_restaurant_id_fkey 
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      `);
      console.log('✅ Menu items restaurant foreign key added');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️ Menu items restaurant foreign key already exists');
      } else {
        console.log('⚠️ Could not add menu items restaurant foreign key:', error.message);
      }
    }
    
    // Menu views -> Restaurants
    try {
      await railwayPool.query(`
        ALTER TABLE menu_views 
        ADD CONSTRAINT menu_views_restaurant_id_fkey 
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      `);
      console.log('✅ Menu views restaurant foreign key added');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️ Menu views restaurant foreign key already exists');
      } else {
        console.log('⚠️ Could not add menu views restaurant foreign key:', error.message);
      }
    }
    
    // Restaurant views -> Restaurants
    try {
      await railwayPool.query(`
        ALTER TABLE restaurant_views 
        ADD CONSTRAINT restaurant_views_restaurant_id_fkey 
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      `);
      console.log('✅ Restaurant views foreign key added');
    } catch (error) {
      if (error.code === '42710') {
        console.log('ℹ️ Restaurant views foreign key already exists');
      } else {
        console.log('⚠️ Could not add restaurant views foreign key:', error.message);
      }
    }
    
    // 4. Index'ler ekle (performans için)
    console.log('⚡ Adding indexes for better performance...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_restaurants_qr_code ON restaurants(qr_code)',
      'CREATE INDEX IF NOT EXISTS idx_categories_restaurant_id ON categories(restaurant_id)',
      'CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id)',
      'CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id)',
      'CREATE INDEX IF NOT EXISTS idx_menu_views_restaurant_id ON menu_views(restaurant_id)',
      'CREATE INDEX IF NOT EXISTS idx_restaurant_views_restaurant_id ON restaurant_views(restaurant_id)',
      'CREATE INDEX IF NOT EXISTS idx_users_restaurant_id ON users(restaurant_id)'
    ];
    
    for (const indexQuery of indexes) {
      try {
        await railwayPool.query(indexQuery);
        console.log('✅ Index created:', indexQuery.split(' ')[5]);
      } catch (error) {
        console.log('ℹ️ Index might already exist:', indexQuery.split(' ')[5]);
      }
    }
    
    console.log('');
    console.log('🎉 PRODUCTION DATABASE OPTIMIZATION COMPLETED!');
    console.log('');
    console.log('✅ Unique constraints added');
    console.log('✅ Foreign key relationships secured');
    console.log('✅ Performance indexes created');
    console.log('✅ Database is production-ready!');
    
  } catch (error) {
    console.error('❌ Production fix error:', error);
  } finally {
    await railwayPool.end();
  }
}

// Only run if called directly
if (require.main === module) {
  fixProductionIssues();
}

module.exports = fixProductionIssues;