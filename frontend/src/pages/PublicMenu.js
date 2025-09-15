import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { menuService } from '../services/menuService';
import './PublicMenu.css';

const PublicMenu = () => {
  const { qrCode } = useParams();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (qrCode) {
      loadMenu();
    }
  }, [qrCode]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      console.log('Loading menu for QR code:', qrCode);
      const response = await menuService.getMenuByQR(qrCode);
      console.log('Menu response:', response);
      setMenuData(response);
      if (response.categories.length > 0) {
        setSelectedCategory(response.categories[0].id);
      }
    } catch (error) {
      console.error('Load menu error:', error);
      console.error('Error response:', error.response);
      setError('Menü bulunamadı veya erişim sağlanamadı');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="public-menu-loading">
        <div className="loading-spinner"></div>
        <p>Menü yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-menu-error">
        <div className="error-icon">❌</div>
        <h2>Menü Bulunamadı</h2>
        <p>{error}</p>
      </div>
    );
  }

  const selectedCategoryData = menuData.categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="public-menu">
      <header className="menu-header">
        <div className="restaurant-info">
          {menuData.restaurant.logo_url && (
            <img 
              src={menuData.restaurant.logo_url} 
              alt={menuData.restaurant.name} 
              className="restaurant-logo"
            />
          )}
          <div className="restaurant-details">
            <h1>{menuData.restaurant.name}</h1>
            {menuData.restaurant.description && (
              <p className="restaurant-description">{menuData.restaurant.description}</p>
            )}
          </div>
        </div>
      </header>

      <div className="menu-content">
        <nav className="category-nav">
          <div className="category-buttons">
            {menuData.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </nav>

        <main className="menu-items-section">
          {selectedCategoryData && (
            <>
              <div className="category-header">
                <h2>{selectedCategoryData.name}</h2>
              </div>

              <div className="menu-items-grid">
                {selectedCategoryData.menu_items.length === 0 ? (
                  <div className="empty-category">
                    <p>Bu kategoride henüz ürün bulunmuyor</p>
                  </div>
                ) : (
                  selectedCategoryData.menu_items.map((item) => (
                    <div key={item.id} className="menu-item">
                      <div className="item-content">
                        <div className="item-header">
                          <h3 className="item-name">{item.name}</h3>
                          <div className="item-price">₺{parseFloat(item.price).toFixed(2)}</div>
                        </div>
                        
                        {item.description && (
                          <p className="item-description">{item.description}</p>
                        )}
                        
                        {item.allergens && (
                          <div className="item-allergens">
                            <span className="allergens-label">Alerjenler:</span>
                            <span className="allergens-list">{item.allergens}</span>
                          </div>
                        )}
                      </div>
                      
                      {item.image_url && (
                        <div className="item-image">
                          <img src={item.image_url} alt={item.name} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <footer className="menu-footer">
        <div className="footer-content">
          <p>QR Menu sistemi ile hazırlanmıştır</p>
          <p className="visit-time">
            Ziyaret zamanı: {new Date().toLocaleString('tr-TR')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicMenu;