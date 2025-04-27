// useAuth: Centralized authentication logic for login, logout, and token state
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import api from "../../auth/api";

/**
 * Custom hook for authentication logic.
 * Handles login, logout, and authentication state.
 * Usage: const { isAuthenticated, login, logout, register } = useAuth();
 */
export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check token presence on mount
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    setIsAuthenticated(!!token);
  }, []);

  // Login: store tokens and update state
  const login = useCallback((access, refresh) => {
    localStorage.setItem(ACCESS_TOKEN, access);
    localStorage.setItem(REFRESH_TOKEN, refresh);
    setIsAuthenticated(true);
  }, []);

  // Logout: clear tokens and update state
  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setIsAuthenticated(false);
    navigate("/login");
  }, [navigate]);

  // Register: create a new user and auto-login
  const register = useCallback(async (payload) => {
    await api.post("/api/user/register/", payload);
    // Auto-login after registration
    const loginRes = await api.post("/api/token/", { username: payload.username, password: payload.password });
    login(loginRes.data.access, loginRes.data.refresh);
  }, [login]);

  return { isAuthenticated, login, logout, register };
}
