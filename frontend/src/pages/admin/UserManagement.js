import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { restaurantService } from '../../services/restaurantService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'restaurant_admin',
    restaurant_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [restaurantsResponse] = await Promise.all([
        restaurantService.getAllRestaurants()
      ]);
      setRestaurants(restaurantsResponse.restaurants);
      // Not: User listesi için API endpoint'i eklenebilir
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(formData);
      alert('Kullanıcı başarıyla oluşturuldu');
      setShowCreateForm(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'restaurant_admin',
        restaurant_id: ''
      });
    } catch (error) {
      alert('Kullanıcı oluşturulurken hata: ' + (error.response?.data?.message || 'Bilinmeyen hata'));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>Kullanıcı Yönetimi</h1>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)} 
          className="btn btn-primary"
        >
          ➕ Yeni Kullanıcı
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form">
          <h3>Yeni Kullanıcı Oluştur</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Kullanıcı Adı:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Şifre:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="restaurant_admin">Restoran Admin</option>
                  <option value="super_admin">Süper Admin</option>
                </select>
              </div>
            </div>

            {formData.role === 'restaurant_admin' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Restoran:</label>
                  <select 
                    name="restaurant_id" 
                    value={formData.restaurant_id} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Restoran Seçin</option>
                    {restaurants.map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Oluştur</button>
              <button 
                type="button" 
                onClick={() => setShowCreateForm(false)}
                className="btn btn-secondary"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="info-card">
        <h3>Kullanıcı Yönetimi</h3>
        <p>Bu sayfada sistemde kayıtlı kullanıcıları yönetebilirsiniz.</p>
        <p>Yeni restoran admini oluşturmak için yukarıdaki formu kullanın.</p>
      </div>
    </div>
  );
};

export default UserManagement;