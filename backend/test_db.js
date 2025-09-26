const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('🔄 PostgreSQL bağlantısı test ediliyor...');
    console.log(`📡 Host: ${process.env.DB_HOST}`);
    console.log(`🔌 Port: ${process.env.DB_PORT}`);
    console.log(`💾 Database: ${process.env.DB_NAME}`);
    console.log(`👤 User: ${process.env.DB_USER}`);
    
    const client = await pool.connect();
    console.log('✅ PostgreSQL bağlantısı başarılı!');
    
    // Test query
    const result = await client.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = $1', ['public']);
    console.log(`📊 Public schema'da ${result.rows[0].table_count} tablo bulundu`);
    
    // Tabloları listele
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Mevcut tablolar:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ Bağlantı hatası:', err.message);
    process.exit(1);
  }
}

testConnection();