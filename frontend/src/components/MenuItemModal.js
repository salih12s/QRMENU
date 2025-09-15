import React, { useState, useEffect } from 'react';
import './MenuItemModal.css';

const MenuItemModal = ({ item, category, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    allergens: '',
    sort_order: 0,
    is_available: true
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        allergens: item.allergens || '',
        sort_order: item.sort_order || 0,
        is_available: item.is_available !== false
      });
      // Mevcut resim varsa önizleme olarak göster (base64 formatında)
      if (item.image_url) {
        setImagePreview(item.image_url);
        setImageData(item.image_url);
      }
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Sadece resim dosyaları yüklenebilir');
        return;
      }
      
      // Base64'e çevir ve önizleme oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImagePreview(base64String);
        setImageData(base64String);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageData(null);
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      // Base64 image data varsa ekle
      if (imageData) {
        dataToSave.image_data = imageData;
      }
      
      await onSave(dataToSave);
    } catch (error) {
      setError(error.response?.data?.message || 'Kayıt sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{item ? 'Ürün Düzenle' : `Yeni Ürün${category ? ` - ${category.name}` : ''}`}</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Ürün Adı *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="ör. Izgara Tavuk"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Fiyat (₺) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={loading}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Açıklama</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              disabled={loading}
              placeholder="Ürün açıklaması..."
            />
          </div>

          {/* Fotoğraf Upload Alanı */}
          <div className="form-group">
            <label htmlFor="image">Ürün Fotoğrafı</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
              className="file-input"
            />
            <small>Maksimum 5MB, JPG, PNG, GIF formatları desteklenir</small>
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Önizleme" />
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="remove-image-btn"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="allergens">Alerjenler</label>
            <input
              type="text"
              id="allergens"
              name="allergens"
              value={formData.allergens}
              onChange={handleChange}
              disabled={loading}
              placeholder="ör. Gluten, Süt, Yumurta"
            />
            <small>Alerjen bilgilerini virgülle ayırın</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sort_order">Sıralama</label>
              <input
                type="number"
                id="sort_order"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleChange}
                disabled={loading}
                min="0"
              />
              <small>Düşük sayı önce görünür</small>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                  disabled={loading}
                />
                Mevcut
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              İptal
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemModal;