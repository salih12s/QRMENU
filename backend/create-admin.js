const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function createSuperAdmin() {
  try {
    // Önce kullanıcının var olup olmadığını kontrol et
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      ['superadmin']
    );

    if (existingUser.rows.length > 0) {
      console.log('Super admin kullanıcısı zaten mevcut.');
      return;
    }

    // Şifreyi hashle (12345)
    const hashedPassword = await bcrypt.hash('12345', 10);

    // Super admin kullanıcısını oluştur
    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
      ['superadmin', 'admin@qrmenu.com', hashedPassword, 'super_admin']
    );

    console.log('Super admin kullanıcısı başarıyla oluşturuldu!');
    console.log('Kullanıcı Adı: superadmin');
    console.log('Şifre: 12345');
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await pool.end();
  }
}

createSuperAdmin();