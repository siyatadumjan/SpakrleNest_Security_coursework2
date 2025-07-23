import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('AdminRoutes user:', user);

  return user != null && user.isAdmin ? <Outlet /> : <Navigate to={'/login'} />;
}

export default AdminRoutes;
