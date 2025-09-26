const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Production environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initializeProduction() {
  try {
    console.log('🚀 Production initialization starting...');
    
    // Check if super admin exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      ['admin@menuben.com', 'superadmin']
    );

    if (existingUser.rows.length > 0) {
      console.log('✅ Super admin user already exists');
      console.log('Email: admin@menuben.com');
      console.log('Username: superadmin');
      console.log('Password: 123456');
      return;
    }

    // Create super admin user
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
      ['superadmin', 'admin@menuben.com', hashedPassword, 'super_admin']
    );

    console.log('✅ Super admin user created successfully!');
    console.log('Email: admin@menuben.com');
    console.log('Username: superadmin');  
    console.log('Password: 123456');
    
    // Create a test restaurant
    const restaurant = await pool.query(
      'INSERT INTO restaurants (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id',
      ['Test Restaurant', 'Test restaurant for demo', 1]
    );
    
    console.log('✅ Test restaurant created with ID:', restaurant.rows[0].id);
    
  } catch (error) {
    console.error('❌ Production initialization error:', error);
  } finally {
    await pool.end();
  }
}

// Only run if called directly (not imported)
if (require.main === module) {
  initializeProduction();
}

module.exports = initializeProduction;