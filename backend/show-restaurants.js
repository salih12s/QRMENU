const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function showRestaurants() {
  try {
    const result = await pool.query('SELECT id, name, qr_code FROM restaurants');
    console.log('Restoranlarınız:');
    console.table(result.rows);
    
    result.rows.forEach(restaurant => {
      console.log(`\n${restaurant.name} menüsü için link:`);
      console.log(`http://localhost:3000/menu/${restaurant.qr_code}`);
    });
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await pool.end();
  }
}

showRestaurants();