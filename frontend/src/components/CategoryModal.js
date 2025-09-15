import React, { useState, useEffect } from 'react';
import './CategoryModal.css';

const CategoryModal = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    sort_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        sort_order: category.sort_order || 0,
        is_active: category.is_active !== false
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSave(formData);
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
          <h2>{category ? 'Kategori Düzenle' : 'Yeni Kategori'}</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Kategori Adı *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="ör. Ana Yemekler, Tatlılar"
            />
          </div>

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
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                disabled={loading}
              />
              Aktif
            </label>
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

export default CategoryModal;