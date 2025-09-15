const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkUsers() {
  try {
    const result = await pool.query('SELECT * FROM users');
    console.log('Veritabanındaki tüm kullanıcılar:');
    console.table(result.rows);
    
    // Superadmin kullanıcısını özel olarak kontrol et
    const superadmin = await pool.query('SELECT * FROM users WHERE username = $1', ['superadmin']);
    console.log('\nSuperadmin kullanıcısı:');
    console.log(superadmin.rows[0]);
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await pool.end();
  }
}

checkUsers();