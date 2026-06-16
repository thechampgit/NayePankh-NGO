import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { useLanguageTheme } from '../context/LanguageThemeContext';

// ScrollToTop component to reset page scroll position on routing
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function RootLayout() {
  const { lang, toggleLang, isDarkMode, toggleDarkMode } = useLanguageTheme();

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'
    }`}>
      <ScrollToTop />
      
      {/* Navbar */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Floating Language & Theme Controls in the corner */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center space-x-2">
        <button
          onClick={toggleLang}
          className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-750' 
              : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
          }`}
          title={lang === 'en' ? 'Change to Hindi' : 'अंग्रेजी में बदलें'}
        >
          A/अ
        </button>
        <button
          onClick={toggleDarkMode}
          className={`h-12 w-12 rounded-xl flex items-center justify-center text-lg shadow-lg border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-750' 
              : 'bg-white border-slate-200 text-slate-850 hover:bg-slate-50'
          }`}
          title={lang === 'en' ? (isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode') : (isDarkMode ? 'लाइट मोड पर स्विच करें' : 'डार्क मोड पर स्विच करें')}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Floating Chatbot */}
      <Chatbot />

      {/* Footer */}
      <Footer />
    </div>
  );
}
