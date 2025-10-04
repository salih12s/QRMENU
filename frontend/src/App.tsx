import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import RestaurantAdminDashboard from './pages/RestaurantAdminDashboard';
import PublicMenuPage from './pages/PublicMenuPage';

function App() {
  const { isAuthenticated, isSuperAdmin, isRestaurantAdmin } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/menu/:qrCode" element={<PublicMenuPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route
        path="/admin/*"
        element={
          isAuthenticated ? (
            isSuperAdmin ? (
              <SuperAdminDashboard />
            ) : isRestaurantAdmin ? (
              <RestaurantAdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Default Redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/admin" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
