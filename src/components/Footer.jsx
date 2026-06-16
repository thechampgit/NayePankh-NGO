import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import { useLanguageTheme } from '../context/LanguageThemeContext';

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const translationDict = {
  en: {
    desc: "\"NayePankh Foundation\" is a non governmental organisation with a strong desire to help the society and make it a better place for all, by doing everything in our power and to make our vision successful we would require your vital support. Service to mankind is the service to god. Let’s revolutionise the society together!.",
    colQuickLinks: "Quick Links",
    colContactInfo: "Contact Info",
    colNewsletter: "Our Newsletter",
    newsletterDesc: "Subscribe to stay updated on our upcoming charity events and impact achievements.",
    placeholderEmail: "Your Email",
    newsletterSuccess: "Thank you for subscribing!",
    rightsReserved: "All Rights Reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    sitemap: "Sitemap",
    quickLinks: {
      'Cancellation and Refund': 'Cancellation and Refund',
      'Shipping and Exchange': 'Shipping and Exchange',
      'Terms and Conditions': 'Terms and Conditions',
      'Privacy and Policy': 'Privacy and Policy',
      'Contact Us': 'Contact Us'
    }
  },
  hi: {
    desc: "\"नयेपंख फाउंडेशन\" एक गैर सरकारी संगठन है जिसमें समाज की मदद करने और इसे सभी के लिए एक बेहतर जगह बनाने की तीव्र इच्छा है, हमारी शक्ति में सब कुछ करके और हमारे दृष्टिकोण को सफल बनाने के लिए हमें आपके महत्वपूर्ण समर्थन की आवश्यकता होगी। मानव जाति की सेवा ही ईश्वर की सेवा है। आइए मिलकर समाज में क्रांति लाएं!.",
    colQuickLinks: "त्वरित लिंक",
    colContactInfo: "संपर्क जानकारी",
    colNewsletter: "हमारा समाचार पत्र",
    newsletterDesc: "हमारे आगामी धर्मार्थ कार्यक्रमों और प्रभाव उपलब्धियों के बारे में अपडेट रहने के लिए सदस्यता लें।",
    placeholderEmail: "आपका ईमेल",
    newsletterSuccess: "सदस्यता लेने के लिए धन्यवाद!",
    rightsReserved: "सर्वाधिकार सुरक्षित।",
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    sitemap: "साइटमैप",
    quickLinks: {
      'Cancellation and Refund': 'रद्दीकरण और धनवापसी',
      'Shipping and Exchange': 'शिपिंग और एक्सचेंज',
      'Terms and Conditions': 'नियम और शर्तें',
      'Privacy and Policy': 'गोपनीयता नीति',
      'Contact Us': 'संपर्क करें'
    }
  }
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { lang } = useLanguageTheme();
  const t = translationDict[lang];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#3a5a40] text-slate-300 pt-16 pb-8 border-t border-[#0d9488]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & About Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <img 
                src="/logo.png" 
                className="h-9 w-9 object-contain rounded-lg bg-white p-0.5 border border-[#0d9488]/30 shadow-sm" 
                alt="NayePankh Logo" 
              />
              <span className="text-xl font-black tracking-wider text-white">
                Naye<span className="text-primary-500">Pankh</span>
              </span>
            </Link>
            <p className="text-secondary-100/70 text-sm leading-relaxed">
              {t.desc}
            </p>
            <div className="flex space-x-3 pt-2">
              {[
                { name: 'facebook', url: 'https://www.facebook.com/nayepankhfoundation', icon: FacebookIcon },
                { name: 'twitter', url: 'https://x.com/nayepankh', icon: TwitterIcon },
                { name: 'instagram', url: 'https://www.instagram.com/nayepankhfoundation', icon: InstagramIcon },
                { name: 'linkedin', url: 'https://www.linkedin.com/company/nayepankh/', icon: LinkedinIcon },
                { name: 'youtube', url: 'https://www.youtube.com/@nayepankhfoundation', icon: YoutubeIcon }
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 rounded-lg bg-[#083344] border border-[#0d9488] hover:bg-primary-500 hover:text-white flex items-center justify-center transition-all duration-300 text-secondary-100/80 shadow-sm"
                    aria-label={social.name}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-primary-500 pl-3">
              {t.colQuickLinks}
            </h3>
            <ul className="space-y-3">
              {[
                { name: t.quickLinks['Cancellation and Refund'], path: '/cancellation-refund' },
                { name: t.quickLinks['Shipping and Exchange'], path: '/shipping-exchange' },
                { name: t.quickLinks['Terms and Conditions'], path: '/terms-conditions' },
                { name: t.quickLinks['Privacy and Policy'], path: '/privacy-policy' },
                { name: t.quickLinks['Contact Us'], path: '/contact' }
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white transition-colors duration-200 group"
                  >
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform -translate-x-1 group-hover:translate-x-0" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-primary-500 pl-3">
              {t.colContactInfo}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300 leading-relaxed">
                  123 Wings Avenue, Sector 5, Noida, UP - 201301, India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-500 shrink-0" />
                <span className="text-sm text-slate-300"> +91-8318500748</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-500 shrink-0" />
                <span className="text-sm text-slate-300">contact@nayepankh.com</span>
              </li>
            </ul>
          </div>

          {/* Our Newsletter Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-primary-500 pl-3">
              {t.colNewsletter}
            </h3>
            <p className="text-secondary-100/70 text-sm mb-4">
              {t.newsletterDesc}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder={t.placeholderEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#083344] border border-[#0d9488] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-all duration-200 text-white placeholder-secondary-100/40 shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-primary-500 hover:bg-primary-600 text-white p-1.5 rounded-lg transition-colors duration-200"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
            {subscribed && (
              <p className="text-emerald-400 text-xs mt-2 font-medium">
                {t.newsletterSuccess}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#0d9488] my-8" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} NayePankh Foundation. {t.rightsReserved}</p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">{t.privacyPolicy}</Link>
            <Link to="/terms-conditions" className="hover:text-white transition-colors">{t.termsOfService}</Link>
            <a href="#" className="hover:text-white transition-colors">{t.sitemap}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
