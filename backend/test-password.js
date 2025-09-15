const bcrypt = require('bcryptjs');

async function testPassword() {
  const plainPassword = '12345';
  const hashedPassword = '$2a$10$7Wr47eMT0ACEY31MKIzYm.oHro4N7gKHE5yJDEN.GQFALZA00Tn5q';
  
  console.log('Test edilen şifre:', plainPassword);
  console.log('Veritabanındaki hash:', hashedPassword);
  
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Şifre eşleşiyor mu?', isMatch);
  
  // Yeni hash oluştur test için
  const newHash = await bcrypt.hash(plainPassword, 10);
  console.log('Yeni oluşturulan hash:', newHash);
  
  const newMatch = await bcrypt.compare(plainPassword, newHash);
  console.log('Yeni hash eşleşiyor mu?', newMatch);
}

testPassword();