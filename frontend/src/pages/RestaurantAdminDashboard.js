import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RestaurantMenuManagement from './restaurant/RestaurantMenuManagement';
import RestaurantInfo from './restaurant/RestaurantInfo';
import RestaurantReports from './restaurant/RestaurantReports';
import './RestaurantAdminDashboard.css';

const RestaurantAdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/restaurant/info', label: 'Restoran Bilgileri', icon: '🏪' },
    { path: '/restaurant/menu', label: 'Menü Yönetimi', icon: '📋' },
    { path: '/restaurant/reports', label: 'Raporlar', icon: '📊' }
  ];

  return (
    <div className="restaurant-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🍽️ Restoran Admin</h2>
          <p>{user?.username}</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            🚪 Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<RestaurantHome />} />
          <Route path="/info" element={<RestaurantInfo />} />
          <Route path="/menu" element={<RestaurantMenuManagement />} />
          <Route path="/reports" element={<RestaurantReports />} />
        </Routes>
      </main>
    </div>
  );
};

const RestaurantHome = () => {
  const { user } = useAuth();

  return (
    <div className="restaurant-home">
      <div className="welcome-card">
        <h1>Restoran Yönetim Paneli</h1>
        <p>Hoş geldiniz, {user?.username}</p>
        
        <div className="quick-actions">
          <Link to="/restaurant/menu" className="action-card">
            <div className="action-icon">📋</div>
            <div className="action-info">
              <h3>Menü Yönetimi</h3>
              <p>Menünüzü düzenleyin</p>
            </div>
          </Link>
          
          <Link to="/restaurant/info" className="action-card">
            <div className="action-icon">🏪</div>
            <div className="action-info">
              <h3>Restoran Bilgileri</h3>
              <p>Bilgilerinizi güncelleyin</p>
            </div>
          </Link>
          
          <Link to="/restaurant/reports" className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-info">
              <h3>Raporlar</h3>
              <p>İstatistikleri görüntüleyin</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAdminDashboard;