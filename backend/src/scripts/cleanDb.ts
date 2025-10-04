import { query } from '../config/database';
import bcrypt from 'bcryptjs';

async function cleanDatabase() {
  try {
    console.log('\n🧹 VERİTABANI TEMİZLENİYOR...\n');
    
    // Tüm tabloları temizle (foreign key sırasına göre)
    console.log('🗑️  1. Access logs temizleniyor...');
    await query('DELETE FROM access_logs');
    console.log('   ✅ Access logs temizlendi');
    
    console.log('\n🗑️  2. Menu items temizleniyor...');
    await query('DELETE FROM menu_items');
    console.log('   ✅ Menu items temizlendi');
    
    console.log('\n🗑️  3. Categories temizleniyor...');
    await query('DELETE FROM categories');
    console.log('   ✅ Categories temizlendi');
    
    console.log('\n🗑️  4. Restaurants temizleniyor...');
    await query('DELETE FROM restaurants');
    console.log('   ✅ Restaurants temizlendi');
    
    console.log('\n🗑️  5. Users temizleniyor (süper admin hariç)...');
    await query("DELETE FROM users WHERE email != 'admin@system.com'");
    console.log('   ✅ Diğer kullanıcılar temizlendi');
    
    // Sadece süper admin kullanıcısını koru veya yeniden oluştur
    console.log('\n👤 6. Süper Admin kontrolü...');
    const adminCheck = await query(
      "SELECT id FROM users WHERE email = 'admin@system.com'"
    );
    
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await query(
        `INSERT INTO users (email, password, full_name, role, is_active)
         VALUES ($1, $2, $3, $4, $5)`,
        ['admin@system.com', hashedPassword, 'Süper Admin', 'super_admin', true]
      );
      console.log('   ✅ Süper Admin oluşturuldu');
    } else {
      console.log('   ✅ Süper Admin mevcut');
    }
    
    // Sequence'leri sıfırla
    console.log('\n🔄 7. ID sequence\'leri sıfırlanıyor...');
    await query('ALTER SEQUENCE restaurants_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE menu_items_id_seq RESTART WITH 1');
    await query('ALTER SEQUENCE access_logs_id_seq RESTART WITH 1');
    console.log('   ✅ Sequence\'ler sıfırlandı');
    
    // Kontrol
    console.log('\n📊 8. Son durum kontrolü...');
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM restaurants) as restaurants,
        (SELECT COUNT(*) FROM categories) as categories,
        (SELECT COUNT(*) FROM menu_items) as menu_items,
        (SELECT COUNT(*) FROM access_logs) as access_logs
    `);
    
    const counts = stats.rows[0];
    console.log(`   👤 Kullanıcılar: ${counts.users} (sadece süper admin)`);
    console.log(`   🏢 Restoranlar: ${counts.restaurants}`);
    console.log(`   📁 Kategoriler: ${counts.categories}`);
    console.log(`   🍽️  Menü Öğeleri: ${counts.menu_items}`);
    console.log(`   📊 Erişim Logları: ${counts.access_logs}`);
    
    console.log('\n✅ VERİTABANI TEMİZLENDİ!\n');
    console.log('━'.repeat(70));
    console.log('🎯 SİSTEM TAMAMEN TEMİZ VE DİNAMİK!');
    console.log('━'.repeat(70));
    console.log('\n📝 Süper Admin ile giriş yapabilirsiniz:');
    console.log('   Email: admin@system.com');
    console.log('   Şifre: admin123');
    console.log('\n🚀 Artık her şeyi sıfırdan oluşturabilirsiniz!');
    console.log('   1. Restoran ekleyin');
    console.log('   2. Restoran için kullanıcı oluşturun');
    console.log('   3. Kategoriler ekleyin');
    console.log('   4. Menü ürünleri ekleyin');
    console.log('   5. Tema rengini ayarlayın');
    console.log('   6. Logo yükleyin\n');
    
  } catch (error) {
    console.error('❌ HATA:', error);
    throw error;
  }
  
  process.exit(0);
}

cleanDatabase();
