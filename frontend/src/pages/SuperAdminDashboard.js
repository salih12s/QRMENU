import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RestaurantManagement from './admin/RestaurantManagement';
import UserManagement from './admin/UserManagement';
import SystemReports from './admin/SystemReports';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/restaurants', label: 'Restoranlar', icon: '🏪' },
    { path: '/admin/users', label: 'Kullanıcılar', icon: '👥' },
    { path: '/admin/reports', label: 'Raporlar', icon: '📊' }
  ];

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🔰 Süper Admin</h2>
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
          <Route path="/" element={<AdminHome />} />
          <Route path="/restaurants" element={<RestaurantManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/reports" element={<SystemReports />} />
        </Routes>
      </main>
    </div>
  );
};

const AdminHome = () => {
  return (
    <div className="admin-home">
      <div className="welcome-card">
        <h1>Süper Admin Paneli</h1>
        <p>QR Menu Yönetim Sistemi'ne hoş geldiniz</p>
        
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">🏪</div>
            <div className="stat-info">
              <h3>Restoranlar</h3>
              <p>Restoran yönetimi</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Kullanıcılar</h3>
              <p>Kullanıcı yönetimi</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Raporlar</h3>
              <p>Sistem istatistikleri</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;