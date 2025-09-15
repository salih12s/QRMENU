import React, { useState, useEffect } from 'react';
import { restaurantService } from '../../services/restaurantService';
import { authService } from '../../services/authService';
import RestaurantModal from '../../components/RestaurantModal';
import QRCodeModal from '../../components/QRCodeModal';
import './RestaurantManagement.css';

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getAllRestaurants();
      setRestaurants(response.restaurants);
    } catch (error) {
      setError('Restoranlar yüklenirken hata oluştu');
      console.error('Load restaurants error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedRestaurant(null);
    setShowModal(true);
  };

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu restoranı silmek istediğinizden emin misiniz?')) {
      try {
        await restaurantService.deleteRestaurant(id);
        await loadRestaurants();
      } catch (error) {
        alert('Restoran silinirken hata oluştu');
        console.error('Delete restaurant error:', error);
      }
    }
  };

  const handleSave = async (restaurantData) => {
    try {
      if (selectedRestaurant) {
        await restaurantService.updateRestaurant(selectedRestaurant.id, restaurantData);
      } else {
        await restaurantService.createRestaurant(restaurantData);
      }
      setShowModal(false);
      await loadRestaurants();
    } catch (error) {
      throw error;
    }
  };

  const handleGenerateQR = async (restaurant) => {
    try {
      const response = await restaurantService.generateQRCode(restaurant.id);
      setQrData({ ...response, restaurant });
      setShowQRModal(true);
    } catch (error) {
      alert('QR kod oluşturulurken hata oluştu');
      console.error('Generate QR error:', error);
    }
  };

  const handleCreateAdmin = async (restaurant) => {
    const username = prompt('Restoran admin kullanıcı adı:');
    const email = prompt('Restoran admin email:');
    const password = prompt('Restoran admin şifresi:');

    if (username && email && password) {
      try {
        await authService.register({
          username,
          email,
          password,
          role: 'restaurant_admin',
          restaurant_id: restaurant.id
        });
        alert('Restoran admini başarıyla oluşturuldu');
      } catch (error) {
        alert('Admin oluşturulurken hata oluştu: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
      }
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="restaurant-management">
      <div className="page-header">
        <h1>Restoran Yönetimi</h1>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Yeni Restoran
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <div className="restaurant-header">
              <h3>{restaurant.name}</h3>
              <span className={`status ${restaurant.is_active ? 'active' : 'inactive'}`}>
                {restaurant.is_active ? 'Aktif' : 'Pasif'}
              </span>
            </div>

            <div className="restaurant-info">
              <p><strong>Açıklama:</strong> {restaurant.description || 'Belirtilmemiş'}</p>
              <p><strong>Adres:</strong> {restaurant.address || 'Belirtilmemiş'}</p>
              <p><strong>Telefon:</strong> {restaurant.phone || 'Belirtilmemiş'}</p>
              <p><strong>Email:</strong> {restaurant.email || 'Belirtilmemiş'}</p>
              <p><strong>Menü Öğeleri:</strong> {restaurant.menu_items_count || 0}</p>
              <p><strong>Toplam Görüntülenme:</strong> {restaurant.total_views || 0}</p>
            </div>

            <div className="restaurant-actions">
              <button onClick={() => handleEdit(restaurant)} className="btn btn-secondary btn-sm">
                ✏️ Düzenle
              </button>
              <button onClick={() => handleGenerateQR(restaurant)} className="btn btn-info btn-sm">
                📱 QR Kod
              </button>
              <button onClick={() => handleCreateAdmin(restaurant)} className="btn btn-success btn-sm">
                👤 Admin Oluştur
              </button>
              <button onClick={() => handleDelete(restaurant.id)} className="btn btn-danger btn-sm">
                🗑️ Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {restaurants.length === 0 && !loading && (
        <div className="empty-state">
          <h3>Henüz restoran bulunmuyor</h3>
          <p>İlk restoranı oluşturmak için yukarıdaki butona tıklayın</p>
        </div>
      )}

      {showModal && (
        <RestaurantModal
          restaurant={selectedRestaurant}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {showQRModal && qrData && (
        <QRCodeModal
          qrData={qrData}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};

export default RestaurantManagement;