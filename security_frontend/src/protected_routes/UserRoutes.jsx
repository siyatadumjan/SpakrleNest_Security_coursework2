import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const UserRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('UserRoutes user:', user);

  return user != null ? <Outlet /> : <Navigate to={'/login'} />;
}

export default UserRoutes;
