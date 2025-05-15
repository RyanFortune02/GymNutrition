import React from 'react';
import { Navigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../features/auth/constants';

const Home = () => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  
  // If token exists, user is likely authenticated, redirect to dashboard
  // Otherwise, show LandingPage (which will be handled by the / route directly)
  // This component handles the redirect for authenticated users trying to access the home page.
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/welcome" replace />;  // Redirect to landing page if no token
};

export default Home;
