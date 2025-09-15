const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function fixRestaurant() {
  try {
    // SAYDAMS restoranını aktif hale getir
    const result = await pool.query(
      'UPDATE restaurants SET is_active = true WHERE name = $1 RETURNING *',
      ['SAYDAMS']
    );
    
    console.log('SAYDAMS restoranı güncellendi:');
    console.log(result.rows[0]);
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await pool.end();
  }
}

fixRestaurant();