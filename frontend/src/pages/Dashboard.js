import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, isSuperAdmin, isRestaurantAdmin } = useAuth();

  if (isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (isRestaurantAdmin) {
    return <Navigate to="/restaurant" replace />;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Hoş geldiniz, {user?.username}</p>
    </div>
  );
};

export default Dashboard;