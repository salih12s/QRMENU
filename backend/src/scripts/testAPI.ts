import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
}

const results: TestResult[] = [];

async function testAPI() {
  console.log('\n🧪 API ENDPOINT TESTLERİ BAŞLIYOR...\n');
  
  let token = '';
  let restaurantId = 0;
  
  // TEST 1: Login - Super Admin
  try {
    console.log('📝 Test 1: Super Admin Login...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@system.com',
      password: 'admin123'
    });
    
    if (response.data.success && response.data.data.token) {
      token = response.data.data.token;
      console.log('   ✅ BAŞARILI - Token alındı');
      results.push({ name: 'Super Admin Login', status: 'PASS', message: 'Token alındı' });
    } else {
      throw new Error('Token alınamadı');
    }
  } catch (error: any) {
    console.log('   ❌ BAŞARISIZ:', error.message);
    results.push({ name: 'Super Admin Login', status: 'FAIL', message: error.message });
    return;
  }
  
  // TEST 2: Get All Restaurants
  try {
    console.log('\n📝 Test 2: Get All Restaurants...');
    const response = await axios.get(`${API_URL}/restaurants`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success && response.data.data.length > 0) {
      restaurantId = response.data.data[0].id;
      console.log(`   ✅ BAŞARILI - ${response.data.data.length} restoran bulundu`);
      results.push({ name: 'Get All Restaurants', status: 'PASS', message: `${response.data.data.length} restoran` });
    } else {
      throw new Error('Restoran bulunamadı');
    }
  } catch (error: any) {
    console.log('   ❌ BAŞARISIZ:', error.message);
    results.push({ name: 'Get All Restaurants', status: 'FAIL', message: error.message });
  }
  
  // TEST 3: Get Restaurant by ID
  try {
    console.log('\n📝 Test 3: Get Restaurant by ID...');
    const response = await axios.get(`${API_URL}/restaurants/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success && response.data.data.id === restaurantId) {
      console.log(`   ✅ BAŞARILI - ${response.data.data.name}`);
      results.push({ name: 'Get Restaurant by ID', status: 'PASS', message: response.data.data.name });
    } else {
      throw new Error('Restoran bilgisi alınamadı');
    }
  } catch (error: any) {
    console.log('   ❌ BAŞARISIZ:', error.message);
    results.push({ name: 'Get Restaurant by ID', status: 'FAIL', message: error.message });
  }
  
  // TEST 4: Get All Users
  try {
    console.log('\n📝 Test 4: Get All Users...');
    const response = await axios.get(`${API_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success && response.data.data.length > 0) {
      console.log(`   ✅ BAŞARILI - ${response.data.data.length} kullanıcı bulundu`);
      results.push({ name: 'Get All Users', status: 'PASS', message: `${response.data.data.length} kullanıcı` });
    } else {
      throw new Error('Kullanıcı bulunamadı');
    }
  } catch (error: any) {
    console.log('   ❌ BAŞARISIZ:', error.message);
    results.push({ name: 'Get All Users', status: 'FAIL', message: error.message });
  }
  
  // TEST 5: Login - Restaurant Admin
  try {
    console.log('\n📝 Test 5: Restaurant Admin Login...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'demo@restaurant.com',
      password: 'demo123'
    });
    
    if (response.data.success && response.data.data.token) {
      token = response.data.data.token;
      restaurantId = response.data.data.user.restaurant_id; // Demo kullanıcısının restoran ID'si
      console.log('   ✅ BAŞARILI - Restaurant Admin token alındı');
      console.log(`      - Restaurant ID: ${restaurantId}`);
      results.push({ name: 'Restaurant Admin Login', status: 'PASS', message: 'Token alındı' });
    } else {
      throw new Error('Token alınamadı');
    }
  } catch (error: any) {
    console.log('   ❌ BAŞARISIZ:', error.message);
    results.push({ name: 'Restaurant Admin Login', status: 'FAIL', message: error.message });
  }
  
  // TEST 6: Get Categories
  try {
    console.log('\n📝 Test 6: Get Categories...');
    const response = await axios.get(`${API_URL}/categories/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success && response.data.data.length > 0) {
      console.log(`   ✅ BAŞARILI - ${response.data.data.length} kategori bulundu`);
      results.push({ name: 'Get Categories', status: 'PASS', message: `${response.data.data.length} kategori` });
    } else {
      throw new Error('Kategori bulunamadı');
    }
  } catch (error: any) {
    console.log('   ❌ BAŞARISIZ:', error.message);
    results.push({ name: 'Get Categories', status: 'FAIL', message: error.message });
  }
  
  // TEST 7: Get Menu Items
  try {
    console.log('\n📝 Test 7: Get Menu Items...');
    const response = await axios.get(`${API_URL}/menu/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success && response.data.data.length > 0) {
      console.log(`   ✅ BAŞARILI - ${response.data.data.length} menü öğesi bulundu`);
      results.push({ name: 'Get Menu Items', status: 'PASS', message: `${response.data.data.length} öğe` });
    } else {
      throw new Error('Menü öğesi bulunamadı');
    }
  } catch (error: any) {
    console.log('   ❌ BAŞARISIZ:', error.message);
    results.push({ name: 'Get Menu Items', status: 'FAIL', message: error.message });
  }
  
  // TEST 8: Get Restaurant Stats
  try {
    console.log('\n📝 Test 8: Get Restaurant Stats...');
    const response = await axios.get(`${API_URL}/reports/restaurant/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success && response.data.data) {
      console.log(`   ✅ BAŞARILI - İstatistikler alındı`);
      console.log(`      - Kategoriler: ${response.data.data.totalCategories}`);
      console.log(`      - Ürünler: ${response.data.data.totalItems}`);
      results.push({ name: 'Get Restaurant Stats', status: 'PASS', message: 'İstatistikler alındı' });
    } else {
      throw new Error('İstatistik alınamadı');
    }
  } catch (error: any) {
    console.log('   ❌ BAŞARISIZ:', error.message);
    results.push({ name: 'Get Restaurant Stats', status: 'FAIL', message: error.message });
  }
  
  // TEST 9: Public Menu Access (QR Code)
  try {
    console.log('\n📝 Test 9: Public Menu Access (QR Code)...');
    const response = await axios.get(`${API_URL}/public/menu/DEMO-1759538315779`);
    
    if (response.data.success && response.data.data.restaurant) {
      console.log(`   ✅ BAŞARILI - Public menü erişilebilir`);
      console.log(`      - Restoran: ${response.data.data.restaurant.name}`);
      console.log(`      - Kategori sayısı: ${response.data.data.categories.length}`);
      results.push({ name: 'Public Menu Access', status: 'PASS', message: 'Public menü erişilebilir' });
    } else {
      throw new Error('Public menü erişilemedi');
    }
  } catch (error: any) {
    console.log('   ❌ BAŞARISIZ:', error.message);
    results.push({ name: 'Public Menu Access', status: 'FAIL', message: error.message });
  }
  
  // TEST 10: Create Category
  try {
    console.log('\n📝 Test 10: Create Category...');
    const response = await axios.post(`${API_URL}/categories`, {
      restaurant_id: restaurantId,
      name: 'Test Kategori',
      description: 'API test için oluşturuldu',
      display_order: 99
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success && response.data.data.id) {
      const newCategoryId = response.data.data.id;
      console.log(`   ✅ BAŞARILI - Yeni kategori oluşturuldu (ID: ${newCategoryId})`);
      results.push({ name: 'Create Category', status: 'PASS', message: `ID: ${newCategoryId}` });
      
      // Temizlik: Oluşturulan kategoriyi sil
      await axios.delete(`${API_URL}/categories/${newCategoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('      ♻️  Test kategorisi silindi');
    } else {
      throw new Error('Kategori oluşturulamadı');
    }
  } catch (error: any) {
    console.log('   ❌ BAŞARISIZ:', error.message);
    results.push({ name: 'Create Category', status: 'FAIL', message: error.message });
  }
  
  // SONUÇ TABLOSU
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 TEST SONUÇLARI ÖZETI');
  console.log('='.repeat(70));
  
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  
  results.forEach((result, index) => {
    const icon = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${icon} ${index + 1}. ${result.name.padEnd(35)} ${result.message}`);
  });
  
  console.log('='.repeat(70));
  console.log(`✅ Başarılı: ${passCount}/${results.length}`);
  console.log(`❌ Başarısız: ${failCount}/${results.length}`);
  console.log('='.repeat(70));
  
  if (failCount === 0) {
    console.log('\n🎉 TÜM API TESTLERİ BAŞARILI! BACKEND TAM ÇALIŞIYOR! 🎉\n');
  } else {
    console.log('\n⚠️  Bazı testler başarısız oldu. Lütfen kontrol edin.\n');
  }
}

testAPI().catch(console.error);
