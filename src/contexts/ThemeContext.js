import React, { createContext, useContext, useState, useEffect } from 'react';
import APIService from '../services/api';

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

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const settings = await APIService.getSystemSettings();
      if (settings?.themeMode) {
        applyTheme(settings.themeMode);
      }
    } catch (error) {
      console.error('Failed to load theme settings');
    }
  };

  const applyTheme = (themeMode) => {
    setTheme(themeMode);
    
    if (themeMode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', themeMode);
    }
  };

  const updateTheme = (newTheme) => {
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};