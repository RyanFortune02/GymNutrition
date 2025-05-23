import React from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-[color:var(--primary-color-blue)] dark:text-blue-300 mb-2">
          Theme Preference
        </label>
        <div className="w-full p-4 rounded-lg border-2 border-gray-300 bg-gray-100 animate-pulse">
          <div className="h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-[color:var(--primary-color-blue)] dark:text-blue-300 mb-2">
        Theme Preference
      </label>
      <button
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className={`
          relative w-full p-4 rounded-lg border-2 transition-all duration-300 font-medium
          ${theme === 'dark' 
            ? 'bg-gray-800 border-gray-600 text-white shadow-lg' 
            : 'bg-white border-gray-300 text-gray-900 shadow-md hover:shadow-lg'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {theme === 'dark' ? (
              <MoonIcon className="w-6 h-6 text-blue-400" />
            ) : (
              <SunIcon className="w-6 h-6 text-yellow-500" />
            )}
            <span className="text-lg">
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <div className={`
            flex items-center w-14 h-7 rounded-full p-1 transition-colors duration-300
            ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}
          `}>
            <div className={`
              w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300
              ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}
            `} />
          </div>
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle; 