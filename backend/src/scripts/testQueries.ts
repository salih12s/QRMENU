import { query } from '../config/database';

async function testQueries() {
  try {
    console.log('\n🧪 TEST BAŞLIYOR...\n');
    
    // 1. Restoranları kontrol et
    console.log('📊 1. RESTORAN KONTROLÜ:');
    const restaurants = await query('SELECT id, name, qr_code, is_active FROM restaurants');
    console.log(`   ✅ Toplam ${restaurants.rows.length} restoran bulundu`);
    restaurants.rows.forEach((r: any) => {
      console.log(`   - ${r.name} (QR: ${r.qr_code}, Aktif: ${r.is_active})`);
    });
    
    // 2. Kullanıcıları kontrol et
    console.log('\n👥 2. KULLANICI KONTROLÜ:');
    const users = await query('SELECT id, email, full_name, role FROM users');
    console.log(`   ✅ Toplam ${users.rows.length} kullanıcı bulundu`);
    users.rows.forEach((u: any) => {
      console.log(`   - ${u.full_name} (${u.email}) - ${u.role}`);
    });
    
    // 3. Kategorileri kontrol et
    console.log('\n📁 3. KATEGORİ KONTROLÜ:');
    const categories = await query('SELECT COUNT(*) as total FROM categories');
    console.log(`   ✅ Toplam ${categories.rows[0].total} kategori bulundu`);
    
    // 4. Menü öğelerini kontrol et
    console.log('\n🍽️  4. MENÜ ÖĞELERİ KONTROLÜ:');
    const menuItems = await query('SELECT COUNT(*) as total FROM menu_items');
    console.log(`   ✅ Toplam ${menuItems.rows[0].total} menü öğesi bulundu`);
    
    // 5. İlk restoranın menüsünü kontrol et
    if (restaurants.rows.length > 0) {
      const firstRestaurant = restaurants.rows[0];
      console.log(`\n📋 5. ${firstRestaurant.name.toUpperCase()} MENÜSÜ:`);
      
      const menu = await query(`
        SELECT c.name as category, m.name as item, m.price, m.image_url
        FROM categories c
        LEFT JOIN menu_items m ON c.id = m.category_id
        WHERE c.restaurant_id = $1
        ORDER BY c.display_order, m.display_order
        LIMIT 10
      `, [firstRestaurant.id]);
      
      menu.rows.forEach((item: any) => {
        if (item.item) {
          console.log(`   - [${item.category}] ${item.item} - ₺${item.price}`);
        }
      });
      
      const frontendUrl = process.env.FRONTEND_URL || 'https://menuben.com';
      console.log(`\n🔗 Public Menü URL: ${frontendUrl}/menu/${firstRestaurant.qr_code}`);
    }
    
    // 6. Access logs kontrol et
    console.log('\n📊 6. ERİŞİM LOGLARI:');
    const accessLogs = await query('SELECT COUNT(*) as total FROM access_logs');
    console.log(`   ✅ Toplam ${accessLogs.rows[0].total} erişim kaydı`);
    
    console.log('\n✅ TÜM TESTLER BAŞARILI!\n');
    
  } catch (error) {
    console.error('❌ HATA:', error);
  }
  
  process.exit(0);
}

testQueries();
