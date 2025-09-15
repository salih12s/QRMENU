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

async function resetSuperAdmin() {
  try {
    // Önce mevcut kullanıcıyı sil
    await pool.query('DELETE FROM users WHERE username = $1', ['superadmin']);
    console.log('Mevcut super admin kullanıcısı silindi.');

    // Şifreyi hashle (12345)
    const hashedPassword = await bcrypt.hash('12345', 10);
    console.log('Hashlenen şifre:', hashedPassword);

    // Super admin kullanıcısını yeniden oluştur
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      ['superadmin', 'admin@qrmenu.com', hashedPassword, 'super_admin']
    );

    console.log('Super admin kullanıcısı başarıyla oluşturuldu!');
    console.log('Kullanıcı Adı: superadmin');
    console.log('Şifre: 12345');
    console.log('Kullanıcı bilgileri:', result.rows[0]);
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await pool.end();
  }
}

resetSuperAdmin();