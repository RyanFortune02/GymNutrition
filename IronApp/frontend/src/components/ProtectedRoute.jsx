// Wrapper for routes that require authentication, to not allow someone to access another url on the frontend without being authenticated
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false)); //If there is an error in auth, set isAuthorized to false
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const response = await api.post("/api/token/refresh/", {
        //api.post passes in the BASE_URL from the .env file and the endpoint
        refresh: refreshToken,
      });
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };
  /**
   *Look at access token and see if it is expired
   *If it is expired, refresh the token
   */
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };
  // Check if the user is authorized
  if (isAuthorized === null) {
    return <>Loading...</>;
  }
  // If the user is auth pass children, but if not redirect to the login page
  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
