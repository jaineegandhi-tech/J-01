import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Don't track certain paths like edit/view pages in history
    const excludePaths = ['/users/edit/', '/users/view/', '/users/add'];
    const shouldTrack = !excludePaths.some(path => location.pathname.includes(path));
    
    if (shouldTrack) {
      setHistory(prev => {
        // Remove the current path if it already exists to avoid duplicates
        const filtered = prev.filter(path => path !== location.pathname);
        // Add current path to the beginning and keep only last 10 entries
        return [location.pathname, ...filtered].slice(0, 10);
      });
    }
  }, [location.pathname]);

  const getPreviousPath = () => {
    // Return the most recent path that's not the current one
    return history.length > 0 ? history[0] : '/users';
  };

  const getBackPath = (currentPath) => {
    // For user detail/edit pages, find the most recent user list page
    if (currentPath.includes('/users/view/') || currentPath.includes('/users/edit/')) {
      const userListPaths = ['/users/clients', '/users/agents', '/users/lenders', '/users/advertisers', '/users'];
      const lastUserListPath = history.find(path => userListPaths.includes(path));
      return lastUserListPath || '/users';
    }
    
    return getPreviousPath();
  };

  const value = {
    history,
    getPreviousPath,
    getBackPath
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};