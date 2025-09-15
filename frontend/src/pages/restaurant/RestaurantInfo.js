import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { restaurantService } from '../../services/restaurantService';

const RestaurantInfo = () => {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (user?.restaurant_id) {
      loadRestaurantInfo();
    }
  }, [user]);

  const loadRestaurantInfo = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getRestaurant(user.restaurant_id);
      setRestaurant(response.restaurant);
      setFormData({
        name: response.restaurant.name || '',
        description: response.restaurant.description || '',
        address: response.restaurant.address || '',
        phone: response.restaurant.phone || '',
        email: response.restaurant.email || ''
      });
    } catch (error) {
      console.error('Load restaurant info error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await restaurantService.updateRestaurant(user.restaurant_id, formData);
      await loadRestaurantInfo();
      alert('Restoran bilgileri güncellendi');
    } catch (error) {
      alert('Güncelleme sırasında hata oluştu');
      console.error('Update restaurant error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleGenerateQR = async () => {
    try {
      const response = await restaurantService.generateQRCode(user.restaurant_id);
      setQrData(response);
    } catch (error) {
      alert('QR kod oluşturulurken hata oluştu');
      console.error('Generate QR error:', error);
    }
  };

  const handleDownloadQR = () => {
    if (qrData) {
      const link = document.createElement('a');
      link.href = qrData.qrCode;
      link.download = `${restaurant.name}_QR.png`;
      link.click();
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="restaurant-info">
      <div className="page-header">
        <h1>Restoran Bilgileri</h1>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Temel Bilgiler</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Restoran Adı:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={updating}
              />
            </div>

            <div className="form-group">
              <label>Açıklama:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                disabled={updating}
              />
            </div>

            <div className="form-group">
              <label>Adres:</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                disabled={updating}
              />
            </div>

            <div className="form-group">
              <label>Telefon:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={updating}
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={updating}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Güncelleniyor...' : 'Bilgileri Güncelle'}
            </button>
          </form>
        </div>

        <div className="info-card">
          <h3>QR Kod</h3>
          <div className="qr-section">
            {qrData ? (
              <div className="qr-display">
                <img src={qrData.qrCode} alt="QR Kod" className="qr-image" />
                <div className="qr-actions">
                  <button onClick={handleDownloadQR} className="btn btn-secondary">
                    📥 İndir
                  </button>
                  <button onClick={handleGenerateQR} className="btn btn-primary">
                    🔄 Yenile
                  </button>
                </div>
                <div className="qr-url">
                  <strong>Menü URL:</strong>
                  <div>{qrData.menuUrl}</div>
                </div>
              </div>
            ) : (
              <div className="qr-generate">
                <p>QR kod oluşturmak için butona tıklayın</p>
                <button onClick={handleGenerateQR} className="btn btn-primary">
                  📱 QR Kod Oluştur
                </button>
              </div>
            )}
          </div>
        </div>

        {restaurant && (
          <div className="info-card">
            <h3>İstatistikler</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Toplam Menü Öğeleri:</span>
                <span className="stat-value">{restaurant.menu_items_count || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Toplam Görüntülenme:</span>
                <span className="stat-value">{restaurant.total_views || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Oluşturulma Tarihi:</span>
                <span className="stat-value">
                  {new Date(restaurant.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantInfo;