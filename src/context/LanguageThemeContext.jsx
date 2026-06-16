import { createContext, useContext, useState, useEffect } from 'react';

const LanguageThemeContext = createContext();

export function LanguageThemeProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('naye_pankh_lang') || 'en');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('naye_pankh_dark_mode') === 'true');

  useEffect(() => {
    localStorage.setItem('naye_pankh_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('naye_pankh_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <LanguageThemeContext.Provider value={{ lang, setLang, toggleLang, isDarkMode, setIsDarkMode, toggleDarkMode }}>
      {children}
    </LanguageThemeContext.Provider>
  );
}

export function useLanguageTheme() {
  const context = useContext(LanguageThemeContext);
  if (!context) {
    throw new Error('useLanguageTheme must be used within a LanguageThemeProvider');
  }
  return context;
}
