import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Menu, X, Heart, User, LogOut, ArrowRight, Cloud } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguageTheme } from '../context/LanguageThemeContext';

const translationDict = {
  en: {
    govReg: "UP GOVERNMENT, 80G & 12A Registered NGO",
    hi: "Hi",
    logout: "Logout",
    login: "Login",
    register: "Register",
    donateNow: "Donate Now",
    volunteer: "Volunteer",
    internships: "Internships",
    partner: "Be Our Partner",
    work: "Work With Us",
    nav: {
      'Home': 'Home',
      'About': 'About',
      'Programs': 'Programs',
      'Events': 'Events',
      'Impact Stories': 'Impact Stories',
      'Gallery': 'Gallery',
      'Donation History': 'Donation History',
      'Get Involved': 'Get Involved',
      'Contact': 'Contact',
      'AI Assistant': 'AI Assistant',
      'Admin Hub': 'Admin Hub'
    }
  },
  hi: {
    govReg: "यूपी सरकार, 80G और 12A पंजीकृत एनजीओ",
    hi: "नमस्ते",
    logout: "लॉगआउट",
    login: "लॉगिन",
    register: "पंजीकरण",
    donateNow: "अभी दान करें",
    volunteer: "स्वयंसेवक",
    internships: "इंटर्नशिप",
    partner: "हमारे भागीदार बनें",
    work: "हमारे साथ काम करें",
    nav: {
      'Home': 'होम',
      'About': 'हमारे बारे में',
      'Programs': 'कार्यक्रम',
      'Events': 'आयोजन',
      'Impact Stories': 'प्रभाव की कहानियां',
      'Gallery': 'गैलरी',
      'Donation History': 'दान का इतिहास',
      'Get Involved': 'शामिल हों',
      'Contact': 'संपर्क करें',
      'AI Assistant': 'एआई सहायक',
      'Admin Hub': 'एडमिन हब'
    }
  }
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { lang, isDarkMode } = useLanguageTheme();
  const t = translationDict[lang];

  const [showGetInvolvedSublinks, setShowGetInvolvedSublinks] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    if (location.pathname === '/get-involved') {
      setShowGetInvolvedSublinks(true);
    } else {
      setShowGetInvolvedSublinks(false);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.nav['Home'], rawName: 'Home', path: '/' },
    { name: t.nav['About'], rawName: 'About', path: '/about' },
    { name: t.nav['Programs'], rawName: 'Programs', path: '/programs' },
    { name: t.nav['Events'], rawName: 'Events', path: '/events' },
    { name: t.nav['Impact Stories'], rawName: 'Impact Stories', path: '/impact-stories' },
    { name: t.nav['Gallery'], rawName: 'Gallery', path: '/gallery' },
    { name: t.nav['Donation History'], rawName: 'Donation History', path: '/donation-history' },
    { name: t.nav['Get Involved'], rawName: 'Get Involved', path: '/get-involved' },
    { name: t.nav['Contact'], rawName: 'Contact', path: '/contact' },
  ];

  if (user && (user.role === 'admin' || user.role === 'volunteer')) {
    navLinks.push({ name: t.nav['AI Assistant'], rawName: 'AI Assistant', path: '/ai-assistant' });
  }

  if (user && user.role === 'admin') {
    navLinks.push({ name: t.nav['Admin Hub'], rawName: 'Admin Hub', path: '/admin' });
  }

  const isActive = (path) => location.pathname === path;

  const isLightNavbar = location.pathname !== '/';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 md:py-5 ${
        isLightNavbar 
          ? (isScrolled 
              ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 text-slate-750 dark:text-slate-200' 
              : 'bg-transparent border-b border-transparent shadow-none text-slate-800 dark:text-slate-200')
          : 'bg-[#3a5a40] border-b border-[#0d9488]/30 text-slate-300 backdrop-blur-md shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo and Brand Name */}
            <Link to="/" className="flex items-center space-x-3.5 group">
              <img 
                src="/logo.png" 
                className="h-16 w-16 md:h-20 md:w-20 object-contain rounded-2xl bg-white p-1 shadow-md border border-slate-100 transition-transform duration-300 group-hover:scale-105" 
                alt="NayePankh Logo" 
              />
              <div className="flex flex-col">
                <span className={`text-2xl md:text-3xl font-black tracking-wider select-none leading-none ${
                  isLightNavbar ? 'text-primary-600' : 'text-primary-400'
                }`}>
                  Naye<span className={isLightNavbar ? 'text-slate-850 dark:text-white' : 'text-white'}>Pankh</span>
                </span>
                <span className={`text-[8px] md:text-[9.5px] font-bold tracking-wide mt-1 select-none ${
                  isLightNavbar ? 'text-slate-500 dark:text-slate-400' : 'text-white/80'
                }`}>
                  {t.govReg}
                </span>
              </div>
            </Link>

            {/* Desktop Actions and Menu Trigger */}
            <div className="flex items-center space-x-3.5 md:space-x-5">
              {/* Desktop Auth Actions */}
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3.5">
                    <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border ${
                      isLightNavbar 
                        ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' 
                        : 'bg-[#083344] border-[#0d9488]'
                    }`}>
                      <User className={`h-4 w-4 ${isLightNavbar ? 'text-primary-600' : 'text-primary-400'}`} />
                      <span className={`text-xs font-semibold ${isLightNavbar ? 'text-slate-700 dark:text-slate-200' : 'text-secondary-100/90'}`}>
                        {t.hi}, {user.name.split(' ')[0]} ({user.role})
                      </span>
                    </div>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className={`flex items-center space-x-1 text-xs font-semibold transition-colors duration-200 ${
                        isLightNavbar ? 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400' : 'text-white hover:text-primary-400'
                      }`}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/login"
                      className={`px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                        isLightNavbar 
                          ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white' 
                          : 'text-slate-300 hover:bg-[#083344] hover:text-white'
                      }`}
                    >
                      {t.login}
                    </Link>
                    <Link
                      to="/register"
                      className={`px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 border ${
                        isLightNavbar 
                          ? 'border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20' 
                          : 'border-primary-400 text-primary-300 hover:bg-primary-500 hover:text-white'
                      }`}
                    >
                      {t.register}
                    </Link>
                  </div>
                )}
              </div>

              {/* Direct Donate Button (Visible on all screens) */}
              <Link
                to="/donate"
                className="relative group overflow-hidden px-4 py-2.5 md:px-5 md:py-3 rounded-xl font-bold text-xs md:text-sm text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-1.5"
              >
                <Heart className="h-4 w-4 fill-white" />
                <span>{t.donateNow}</span>
              </Link>

              {/* 3-Line Menu Hamburger Button */}
              <button
                onClick={() => setIsOpen(true)}
                className={`p-2.5 md:p-3 rounded-xl border transition-all duration-200 ${
                  isLightNavbar 
                    ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600' 
                    : 'bg-[#083344] border-[#0d9488] text-white hover:bg-primary-500/10 hover:text-primary-400'
                }`}
                aria-label="Toggle menu"
              >
                <Menu className="h-5.5 w-5.5 md:h-6 md:w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Sidebar Drawer Panel */}
      <div 
        className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-slate-900 border-l dark:border-slate-800 shadow-2xl z-50 p-8 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex justify-between items-center pb-6 border-b border-slate-100 dark:border-slate-800">
            <Link to="/" className="flex items-center space-x-2.5" onClick={() => setIsOpen(false)}>
              <img 
                src="/logo.png" 
                className="h-10 w-10 object-contain rounded-lg bg-white p-0.5 shadow-sm border border-slate-100" 
                alt="NayePankh Logo" 
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-wider text-primary-600 leading-none">
                  Naye<span className="text-slate-850 dark:text-white">Pankh</span>
                </span>
                <span className="text-[7.5px] font-bold text-slate-500 dark:text-slate-400 tracking-wide mt-1 select-none">
                  {t.govReg}
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-450 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Drawer Nav Links */}
          <div className="py-8 space-y-1">
            {navLinks.map((link) => {
              const isGetInvolved = link.rawName === 'Get Involved';
              return (
                <div key={link.path} className="space-y-1">
                  {isGetInvolved ? (
                    <button
                      onClick={() => setShowGetInvolvedSublinks(!showGetInvolvedSublinks)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 group ${
                        isActive(link.path) || showGetInvolvedSublinks
                          ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-650 dark:text-primary-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-650 dark:hover:text-primary-400'
                      }`}
                    >
                      <span>{link.name}</span>
                      <svg
                        className={`h-4 w-4 transform transition-transform duration-200 text-primary-500 ${
                          showGetInvolvedSublinks ? 'rotate-90' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 group ${
                        isActive(link.path)
                          ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-650 dark:text-primary-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary-650 dark:hover:text-primary-400'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-4px] group-hover:translate-x-0 text-primary-500" />
                    </Link>
                  )}

                  {isGetInvolved && showGetInvolvedSublinks && (
                    <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
                      {[
                        { name: t.volunteer, tab: 'volunteer' },
                        { name: t.internships, tab: 'internship' },
                        { name: t.partner, tab: 'partner' },
                        { name: t.work, tab: 'work' }
                      ].map((sub) => {
                        const isSubActive = location.pathname === '/get-involved' && searchParams.get('tab') === sub.tab;
                        return (
                          <Link
                            key={sub.tab}
                            to={`/get-involved?tab=${sub.tab}`}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                              isSubActive
                                ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-650 dark:text-primary-400'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                          >
                            <span>{sub.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Drawer Bottom Actions */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="md:hidden space-y-4">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 px-2">
                  <User className="h-5 w-5 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                    {t.hi}, {user.name} ({user.role})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl border border-primary-205 dark:border-primary-900/50 text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 font-bold transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t.logout}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 font-bold transition-all duration-200 border border-slate-200 dark:border-slate-700"
                >
                  {t.login}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-3 rounded-xl border border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 font-bold transition-all duration-200"
                >
                  {t.register}
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/donate"
            onClick={() => setIsOpen(false)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-sm text-center shadow-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <Heart className="h-4.5 w-4.5 fill-white" />
            <span>{t.donateNow}</span>
          </Link>
        </div>
      </div>

      {/* Beautiful Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowLogoutModal(false)}
          />
          
          {/* Glassmorphic card */}
          <div className="relative z-10 w-full max-w-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transform transition-all duration-300 scale-100 flex flex-col items-center text-center space-y-6 overflow-hidden">
            {/* Soft background glow decoration */}
            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-primary-100/30 dark:bg-primary-950/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* Cloud Icon with micro-animation */}
            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center border border-primary-100 dark:border-primary-900/30 shadow-sm relative z-10 animate-bounce">
              <Cloud className="h-9 w-9 animate-pulse" />
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Cloud Backup Sync</h3>
              <p className="text-slate-650 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                we'll save the login info for <span className="text-primary-600 dark:text-primary-400 font-extrabold">{user?.name || 'User'}</span> to your devic's cloud backup so you wont need to enter it on this device next time you log in 
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full relative z-10 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="py-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  await logout();
                }}
                className="py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                Got it, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
