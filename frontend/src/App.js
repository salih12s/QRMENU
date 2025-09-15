import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import RestaurantAdminDashboard from './pages/RestaurantAdminDashboard';
import PublicMenu from './pages/PublicMenu';
import ApiTest from './components/ApiTest';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/menu/:qrCode" element={<PublicMenu />} />
            <Route path="/test-api" element={<ApiTest />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requireSuperAdmin={true}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/restaurant/*" 
              element={
                <ProtectedRoute>
                  <RestaurantAdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;