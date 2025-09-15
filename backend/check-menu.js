const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkMenuItems() {
  try {
    // SAYDAMS restoranını bul
    const restaurant = await pool.query('SELECT * FROM restaurants WHERE name = $1', ['SAYDAMS']);
    console.log('SAYDAMS Restoranı:', restaurant.rows[0]);
    
    if (restaurant.rows.length === 0) {
      console.log('SAYDAMS restoranı bulunamadı!');
      return;
    }
    
    const restaurantId = restaurant.rows[0].id;
    
    // Kategorileri kontrol et
    const categories = await pool.query('SELECT * FROM categories WHERE restaurant_id = $1', [restaurantId]);
    console.log('\nKategoriler:');
    console.table(categories.rows);
    
    // Menü öğelerini kontrol et
    const menuItems = await pool.query('SELECT * FROM menu_items WHERE restaurant_id = $1', [restaurantId]);
    console.log('\nMenü Öğeleri:');
    console.table(menuItems.rows);
    
    if (menuItems.rows.length === 0) {
      console.log('\n⚠️  SAYDAMS restoranında hiç menü öğesi yok!');
      console.log('Önce Super Admin panelinden menü öğeleri eklemeniz gerekiyor.');
    }
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await pool.end();
  }
}

checkMenuItems();