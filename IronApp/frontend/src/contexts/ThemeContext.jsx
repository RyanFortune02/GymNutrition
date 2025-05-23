import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../features/auth/api';


/*
  This context is used to manage the theme of the application. It allows the user to toggle between light and dark mode.
*/
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from user profile or system preference
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Get theme from user profile
        const response = await api.get('/api/user/profile/');
        const profileTheme = response.data.dark_mode_enabled ? 'dark' : 'light';
        setTheme(profileTheme);
        applyTheme(profileTheme);
      } catch (error) {
        // Fall back to localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        applyTheme(initialTheme);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  // Apply theme to document and localStorage
  const applyTheme = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Toggle theme and save to backend
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    try {
      setTheme(newTheme);
      applyTheme(newTheme);
      
      // Save to backend
      await api.patch('/api/user/profile/', {
        dark_mode_enabled: newTheme === 'dark'
      });
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const value = {
    theme,
    toggleTheme,
    isLoading
  };

  // Provide theme context to children
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 