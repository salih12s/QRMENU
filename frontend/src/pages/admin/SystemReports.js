import React, { useState, useEffect } from 'react';
import { reportsService } from '../../services/reportsService';

const SystemReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await reportsService.getSuperAdminReports(
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

  const handleRefresh = () => {
    loadReports();
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="system-reports">
      <div className="page-header">
        <h1>Sistem Raporları</h1>
        <button onClick={handleRefresh} className="btn btn-primary">
          🔄 Yenile
        </button>
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
        <button onClick={loadReports} className="btn btn-secondary">
          Filtrele
        </button>
      </div>

      {reports && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Toplam Restoran</h3>
              <div className="stat-value">{reports.systemStats.total_restaurants}</div>
              <div className="stat-subtitle">Aktif: {reports.systemStats.active_restaurants}</div>
            </div>
            
            <div className="stat-card">
              <h3>Menü Öğeleri</h3>
              <div className="stat-value">{reports.systemStats.total_menu_items}</div>
            </div>
            
            <div className="stat-card">
              <h3>Kategoriler</h3>
              <div className="stat-value">{reports.systemStats.total_categories}</div>
            </div>
            
            <div className="stat-card">
              <h3>Toplam Görüntülenme</h3>
              <div className="stat-value">{reports.systemStats.total_views}</div>
            </div>
          </div>

          <div className="reports-grid">
            <div className="report-section">
              <h3>Restoran Performansı</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Restoran</th>
                      <th>Durum</th>
                      <th>Menü Öğeleri</th>
                      <th>Görüntülenmeler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.restaurantPerformance.slice(0, 10).map((restaurant) => (
                      <tr key={restaurant.id}>
                        <td>{restaurant.name}</td>
                        <td>
                          <span className={`status ${restaurant.is_active ? 'active' : 'inactive'}`}>
                            {restaurant.is_active ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td>{restaurant.menu_items_count}</td>
                        <td>{restaurant.total_views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="report-section">
              <h3>Popüler Menü Öğeleri</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th>Restoran</th>
                      <th>Kategori</th>
                      <th>Görüntülenmeler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.topMenuItems.slice(0, 10).map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.restaurant_name}</td>
                        <td>{item.category_name}</td>
                        <td>{item.views}</td>
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

export default SystemReports;