const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// Production için environment variables yükle
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.production' });
} else {
  require('dotenv').config();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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

    // Şifreyi hashle (123456)
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Super admin kullanıcısını oluştur
    await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
      ['superadmin', 'admin@menuben.com', hashedPassword, 'super_admin']
    );

    console.log('Super admin kullanıcısı başarıyla oluşturuldu!');
    console.log('Email: admin@menuben.com');
    console.log('Kullanıcı Adı: superadmin');
    console.log('Şifre: 123456');
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await pool.end();
  }
}

createSuperAdmin();