import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Navigation } from 'lucide-react';
import { useLanguageTheme } from '../context/LanguageThemeContext';

const translationDict = {
  en: {
    reachOut: "Reach Out",
    contactUs: "Contact Us",
    bannerDesc: "Have questions about donations, corporate sponsorships, or volunteering drives? Write to us directly.",
    writeToUs: "Write to Us",
    labelName: "Name",
    labelEmail: "Email",
    labelSubject: "Subject",
    labelMessage: "Message",
    phName: "Your Name",
    phEmail: "yourname@example.com",
    phSubject: "e.g. Donation Receipt inquiry",
    phMessage: "Type your message here...",
    btnSend: "Send Message",
    successTitle: "Message Sent!",
    successDescPre: "Thank you for reaching out, ",
    successDescPost: ". Our communications team has received your message and will reply to ",
    successDescEnd: " shortly.",
    btnSendAnother: "Send Another Message",
    officeDetails: "Office Details",
    ourLocation: "Our Location",
    hqTitle: "NayePankh Foundation HQ",
    hqLoc: "Sector 5, Noida, UP, India",
    hqDirections: "Get Directions",
    mapInteractive: "Interactive Map",
    mapLocateTitle: "Locate NayePankh Foundation HQ",
    mapLocateDesc: "Visit our headquarters in Sector 5, Noida. Click on the map to interact, zoom, or get step-by-step directions from your current location."
  },
  hi: {
    reachOut: "संपर्क करें",
    contactUs: "हमसे संपर्क करें",
    bannerDesc: "दान, कॉर्पोरेट प्रायोजन, या स्वयंसेवी अभियानों के बारे में प्रश्न हैं? हमें सीधे लिखें।",
    writeToUs: "हमें लिखें",
    labelName: "नाम",
    labelEmail: "ईमेल",
    labelSubject: "विषय",
    labelMessage: "संदेश",
    phName: "आपका नाम",
    phEmail: "yourname@example.com",
    phSubject: "उदा. दान रसीद पूछताछ",
    phMessage: "अपना संदेश यहाँ टाइप करें...",
    btnSend: "संदेश भेजें",
    successTitle: "संदेश भेजा गया!",
    successDescPre: "संपर्क करने के लिए धन्यवाद, ",
    successDescPost: "। हमारी संचार टीम को आपका संदेश मिल गया है और जल्द ही ",
    successDescEnd: " पर उत्तर देगी।",
    btnSendAnother: "दूसरा संदेश भेजें",
    officeDetails: "कार्यालय विवरण",
    ourLocation: "हमारा स्थान",
    hqTitle: "नयेपंख फाउंडेशन मुख्यालय",
    hqLoc: "सेक्टर 5, नोएडा, यूपी, भारत",
    hqDirections: "दिशा-निर्देश प्राप्त करें",
    mapInteractive: "इंटरैक्टिव मानचित्र",
    mapLocateTitle: "नयेपंख फाउंडेशन मुख्यालय का पता लगाएं",
    mapLocateDesc: "सेक्टर 5, नोएडा में हमारे मुख्यालय पर जाएँ। मानचित्र पर क्लिक करें, ज़ूम करें या अपने वर्तमान स्थान से चरण-दर-चरण दिशा-निर्देश प्राप्त करें।",
  }
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { lang } = useLanguageTheme();
  const t = translationDict[lang];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-80 md:py-100 overflow-hidden bg-cover bg-[center_12%] bg-no-repeat border-b border-slate-200 dark:border-slate-800 pt-36 md:pt-44"
        style={{ backgroundImage: "url('/contact-bg.jpg')" }}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-[2px] z-0" />
        
        {/* Soft decorative gradient glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary-500/10 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[100px] z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <img 
            src="/logo.png" 
            className="h-20 w-20 object-contain mx-auto bg-white rounded-3xl p-1 shadow-lg mb-4 border border-slate-100 transition-transform duration-300 hover:scale-105" 
            alt="NayePankh Logo" 
          />
          <div className="flex justify-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-3.5 py-1.5 rounded-full border border-primary-100 dark:border-primary-900/30">
              {t.reachOut}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-slate-900 dark:text-white drop-shadow-sm">
            {t.contactUs}
          </h1>
          <p className="text-slate-800 dark:text-slate-200 text-xl sm:text-base max-w-2xl mx-auto leading-relaxed font-bold">
            {t.bannerDesc}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-450 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/30">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{t.successTitle}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-base max-w-md mx-auto">
                    {t.successDescPre}<strong className="text-slate-900 dark:text-white">{formData.name}</strong>{t.successDescPost}<strong className="text-slate-900 dark:text-white">{formData.email}</strong>{t.successDescEnd}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="px-6 py-3 rounded-xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-850 dark:hover:bg-slate-200 transition-colors"
                  >
                    {t.btnSendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{t.writeToUs}</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.labelName}</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-slate-900 dark:text-slate-105 transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder={t.phName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.labelEmail}</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-slate-900 dark:text-slate-105 transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder={t.phEmail}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.labelSubject}</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-slate-900 dark:text-slate-105 transition-colors placeholder-slate-400 dark:placeholder-slate-500"
                      placeholder={t.phSubject}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.labelMessage}</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-slate-900 dark:text-slate-105 transition-colors resize-none placeholder-slate-400 dark:placeholder-slate-500"
                      placeholder={t.phMessage}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-base shadow transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>{t.btnSend}</span>
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-l-4 border-primary-500 pl-3 font-display">
                  {t.officeDetails}
                </h3>

                <div className="space-y-4 text-sm text-slate-605 dark:text-slate-300">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                    <span>123 Wings Avenue, Sector 5, Noida, UP - 201301, India</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary-500 shrink-0" />
                    <span>+91- 8318500748</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary-500 shrink-0" />
                    <span>contact@nayepankh.com</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white border-l-4 border-primary-500 pl-3 font-display">
                  {t.ourLocation}
                </h3>
                
                <div className="h-64 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative overflow-hidden flex items-center justify-center text-center p-6">
                  <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]" style={{
                    backgroundImage: 'radial-gradient(circle, #000000 1.5px, transparent 1.5px)',
                    backgroundSize: '24px 24px'
                  }} />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="h-12 w-12 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-sm">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.hqTitle}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{t.hqLoc}</p>
                    </div>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-200 text-xs font-bold transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>{t.hqDirections}</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-700 p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle, #000000 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px'
            }} />
            
            <div className="relative z-10 space-y-8">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <div className="flex justify-center">
                  <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 text-xs font-extrabold uppercase border border-primary-100 dark:border-primary-900/30">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{t.mapInteractive}</span>
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">
                  {t.mapLocateTitle}
                </h2>
                <p className="text-slate-500 dark:text-slate-405 text-sm max-w-xl mx-auto leading-relaxed">
                  {t.mapLocateDesc}
                </p>
              </div>

              <div className="w-full aspect-[21/9] min-h-[350px] sm:min-h-[450px] rounded-3xl overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-700 relative group bg-slate-100 dark:bg-slate-950">
                <iframe
                  title="NayePankh Foundation Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5620137353913!2d77.31326447630046!3d28.612911275674723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce45f3dfd96c1%3A0x2a1cf906c74b8822!2sSector%205%2C%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0 grayscale-[15%] dark:grayscale-[30%] contrast-[110%] group-hover:grayscale-0 transition-all duration-700"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
