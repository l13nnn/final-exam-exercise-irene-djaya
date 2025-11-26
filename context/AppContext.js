import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  selectedMajor: '',
  setSelectedMajor: () => {},
  userName: 'Guest', 
  isLoggedIn: false
});

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [selectedMajor, setSelectedMajor] = useState(''); 
  
  const [userName] = useState('Irene');
  const [isLoggedIn] = useState(true);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const contextValue = {
    theme,
    toggleTheme,
    selectedMajor,
    setSelectedMajor,
    userName,
    isLoggedIn,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}