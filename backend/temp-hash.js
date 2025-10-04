const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('='.repeat(60));
  console.log('YENİ BCRYPT HASH (admin123 için):');
  console.log('='.repeat(60));
  console.log(hash);
  console.log('');
  console.log('='.repeat(60));
  console.log('RAILWAY SQL KOMUTU:');
  console.log('='.repeat(60));
  console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@system.com';`);
  console.log('');
  
  // Test et
  const isMatch = await bcrypt.compare('admin123', hash);
  console.log('Test: admin123 şifresi doğru mu?', isMatch ? '✅ EVET' : '❌ HAYIR');
}

generateHash();
