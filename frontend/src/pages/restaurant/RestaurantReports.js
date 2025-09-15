import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { reportsService } from '../../services/reportsService';

const RestaurantReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (user?.restaurant_id) {
      loadReports();
    }
  }, [user]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await reportsService.getRestaurantReports(
        user.restaurant_id,
        dateRange.startDate,
        dateRange.endDate
      );
      setReports(data);
    } catch (error) {
      console.error('Load reports error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="restaurant-reports">
      <div className="page-header">
        <h1>Raporlar</h1>
      </div>

      <div className="date-filter">
        <div className="form-group">
          <label>Başlangıç Tarihi:</label>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="form-group">
          <label>Bitiş Tarihi:</label>
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
          />
        </div>
        <button onClick={loadReports} className="btn btn-primary">
          Filtrele
        </button>
      </div>

      {reports && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Toplam Görüntülenme</h3>
              <div className="stat-value">{reports.stats.total_views}</div>
            </div>
            
            <div className="stat-card">
              <h3>Aktif Günler</h3>
              <div className="stat-value">{reports.stats.active_days}</div>
            </div>
            
            <div className="stat-card">
              <h3>Menü Öğeleri</h3>
              <div className="stat-value">{reports.stats.total_menu_items}</div>
            </div>
            
            <div className="stat-card">
              <h3>Kategoriler</h3>
              <div className="stat-value">{reports.stats.total_categories}</div>
            </div>
          </div>

          <div className="reports-grid">
            <div className="report-section">
              <h3>Popüler Ürünler</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th>Kategori</th>
                      <th>Fiyat</th>
                      <th>Görüntülenmeler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.popularItems.slice(0, 10).map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.category_name}</td>
                        <td>₺{parseFloat(item.price).toFixed(2)}</td>
                        <td>{item.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="report-section">
              <h3>Kategori Performansı</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Kategori</th>
                      <th>Ürün Sayısı</th>
                      <th>Toplam Görüntülenme</th>
                      <th>Ortalama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.categoryPerformance.map((category, index) => (
                      <tr key={index}>
                        <td>{category.category_name}</td>
                        <td>{category.item_count}</td>
                        <td>{category.total_views}</td>
                        <td>{parseFloat(category.avg_views_per_item).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantReports;