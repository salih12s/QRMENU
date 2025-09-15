import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { menuService } from '../../services/menuService';
import MenuItemModal from '../../components/MenuItemModal';
import CategoryModal from '../../components/CategoryModal';
import './RestaurantMenuManagement.css';

const RestaurantMenuManagement = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryForItem, setSelectedCategoryForItem] = useState(null);

  useEffect(() => {
    if (user?.restaurant_id) {
      loadMenu();
    }
  }, [user]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const response = await menuService.getRestaurantMenu(user.restaurant_id);
      setCategories(response.categories);
    } catch (error) {
      setError('Menü yüklenirken hata oluştu');
      console.error('Load menu error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Bu kategoriyi ve içindeki tüm ürünleri silmek istediğinizden emin misiniz?')) {
      try {
        await menuService.deleteCategory(categoryId);
        await loadMenu();
      } catch (error) {
        alert('Kategori silinirken hata oluştu');
        console.error('Delete category error:', error);
      }
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (selectedCategory) {
        await menuService.updateCategory(selectedCategory.id, categoryData);
      } else {
        await menuService.createCategory(user.restaurant_id, categoryData);
      }
      setShowCategoryModal(false);
      await loadMenu();
    } catch (error) {
      throw error;
    }
  };

  const handleCreateItem = (category) => {
    setSelectedItem(null);
    setSelectedCategoryForItem(category);
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setSelectedCategoryForItem(null);
    setShowItemModal(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await menuService.deleteMenuItem(itemId);
        await loadMenu();
      } catch (error) {
        alert('Ürün silinirken hata oluştu');
        console.error('Delete item error:', error);
      }
    }
  };

  const handleSaveItem = async (itemData) => {
    try {
      if (selectedItem) {
        await menuService.updateMenuItem(selectedItem.id, itemData);
      } else {
        await menuService.createMenuItem(selectedCategoryForItem.id, itemData);
      }
      setShowItemModal(false);
      await loadMenu();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="menu-management">
      <div className="page-header">
        <h1>Menü Yönetimi</h1>
        <button onClick={handleCreateCategory} className="btn btn-primary">
          ➕ Yeni Kategori
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="menu-categories">
        {categories.map((category) => (
          <div key={category.id} className="category-section">
            <div className="category-header">
              <div className="category-info">
                <h3>{category.name}</h3>
                <span className={`status ${category.is_active ? 'active' : 'inactive'}`}>
                  {category.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="category-actions">
                <button 
                  onClick={() => handleCreateItem(category)} 
                  className="btn btn-success btn-sm"
                >
                  ➕ Ürün Ekle
                </button>
                <button 
                  onClick={() => handleEditCategory(category)} 
                  className="btn btn-secondary btn-sm"
                >
                  ✏️ Düzenle
                </button>
                <button 
                  onClick={() => handleDeleteCategory(category.id)} 
                  className="btn btn-danger btn-sm"
                >
                  🗑️ Sil
                </button>
              </div>
            </div>

            <div className="menu-items">
              {category.menu_items.length === 0 ? (
                <div className="empty-category">
                  <p>Bu kategoride henüz ürün bulunmuyor</p>
                </div>
              ) : (
                <div className="items-grid">
                  {category.menu_items.map((item) => (
                    <div key={item.id} className="menu-item-card">
                      <div className="item-header">
                        <h4>{item.name}</h4>
                        <div className="item-price">₺{parseFloat(item.price).toFixed(2)}</div>
                      </div>
                      
                      <div className="item-info">
                        <p className="item-description">{item.description || 'Açıklama yok'}</p>
                        {item.allergens && (
                          <p className="item-allergens">
                            <strong>Alerjenler:</strong> {item.allergens}
                          </p>
                        )}
                        <div className="item-status">
                          <span className={`availability ${item.is_available ? 'available' : 'unavailable'}`}>
                            {item.is_available ? 'Mevcut' : 'Mevcut Değil'}
                          </span>
                        </div>
                      </div>

                      <div className="item-actions">
                        <button 
                          onClick={() => handleEditItem(item)} 
                          className="btn btn-secondary btn-sm"
                        >
                          ✏️ Düzenle
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)} 
                          className="btn btn-danger btn-sm"
                        >
                          🗑️ Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !loading && (
        <div className="empty-state">
          <h3>Henüz kategori bulunmuyor</h3>
          <p>İlk kategoriyi oluşturmak için yukarıdaki butona tıklayın</p>
        </div>
      )}

      {showCategoryModal && (
        <CategoryModal
          category={selectedCategory}
          onSave={handleSaveCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {showItemModal && (
        <MenuItemModal
          item={selectedItem}
          category={selectedCategoryForItem}
          onSave={handleSaveItem}
          onClose={() => setShowItemModal(false)}
        />
      )}
    </div>
  );
};

export default RestaurantMenuManagement;