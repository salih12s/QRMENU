const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testQRCode() {
  try {
    const qrCode = 'QR_1757972989644_5shjzmc8r';
    console.log('Testing QR code:', qrCode);
    
    // Restoran sorgusunu test et
    const result = await pool.query(
      'SELECT * FROM restaurants WHERE qr_code = $1 AND is_active = true',
      [qrCode]
    );
    
    console.log('Query result:', result.rows);
    
    if (result.rows.length === 0) {
      console.log('❌ Restoran bulunamadı!');
      
      // Tüm restoranları göster
      const allRestaurants = await pool.query('SELECT id, name, qr_code, is_active FROM restaurants');
      console.log('\nTüm restoranlar:');
      console.table(allRestaurants.rows);
    } else {
      console.log('✅ Restoran bulundu:', result.rows[0].name);
    }
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await pool.end();
  }
}

testQRCode();