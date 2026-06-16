import { Link } from 'react-router-dom';
import { BookOpen, HeartPulse, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguageTheme } from '../context/LanguageThemeContext';

const translationDict = {
  en: {
    ourWork: "Our Work",
    keyPrograms: "Our Key Programs",
    bannerDesc: "Targeted solutions built with local stakeholders to bring tangible social and health upgrades.",
    sponsorProg: "Sponsor This Program",
    getInvolved: "Get Involved",
    auditedCert: "Audited and certified by government outreach committees.",
    watchAction: "Watch Program in Action",
    benefitsHeading: "Program Benefits Include:",
    shikshaTitle: "Project Shiksha (Education)",
    shikshaTag: "Illuminating minds with education and supplies.",
    shikshaDesc: "Project Shiksha focuses on reducing dropout rates in primary government schools. We establish mobile digital libraries, supply yearly textbooks, bags, uniforms, and provide weekly tutor training.",
    shikshaMetrics: ['15,000+ Students Supported', '40+ Smart Libraries Setup', '85% Improvement in Attendance'],
    shikshaBenefits: ['Free school kits (stationary, bags, bottles)', 'Basic computer literacy workshops', 'Post-school remedial support centers'],
    
    swasthyaTitle: "Project Swasthya (Healthcare)",
    swasthyaTag: "Ensuring wellness and healthy childhoods.",
    swasthyaDesc: "Project Swasthya addresses malnutrition and lack of primary sanitation in slums. We operate mobile medical units for periodic health screenings, distribute maternal nutrition kits, and hold awareness drives.",
    swasthyaMetrics: ['20,000+ General Consultations', '10,000+ Hygiene Kits Distributed', '5,050+ Eye Screenings Performed'],
    swasthyaBenefits: ['Free prescription medicines & supplements', 'Monthly general and pediatric health checkups', 'Sanitary pads and hygiene kit distribution'],
    
    swabalambanTitle: "Project Swabalamban (Livelihood)",
    swabalambanTag: "Empowering youth and women through skills.",
    swabalambanDesc: "Project Swabalamban designs and executes job-oriented courses for underrepresented youth and women. We run skill centers offering sewing, basic computer operation, retail sales, and communications.",
    swabalambanMetrics: ['1,200+ Women Trained', '70% Employment Rate', '20+ Micro-businesses Supported'],
    swabalambanBenefits: ['Govt-accredited skill certificate courses', 'Soft skills & interview preparation sessions', 'Sponsorship loans for starting micro-enterprises']
  },
  hi: {
    ourWork: "हमारा कार्य",
    keyPrograms: "हमारे प्रमुख कार्यक्रम",
    bannerDesc: "ठोस सामाजिक और स्वास्थ्य उन्नयन लाने के लिए स्थानीय हितधारकों के साथ बनाए गए लक्षित समाधान।",
    sponsorProg: "इस कार्यक्रम को प्रायोजित करें",
    getInvolved: "शामिल हों",
    auditedCert: "सरकारी आउटरीच समितियों द्वारा ऑडिट और प्रमाणित।",
    watchAction: "कार्यक्रम को क्रियान्वित देखें",
    benefitsHeading: "कार्यक्रम के लाभों में शामिल हैं:",
    shikshaTitle: "प्रोजेक्ट शिक्षा (शिक्षा)",
    shikshaTag: "शिक्षा और आपूर्ति के साथ दिमाग को रोशन करना।",
    shikshaDesc: "प्रोजेक्ट शिक्षा प्राथमिक सरकारी स्कूलों में ड्रॉपआउट दर को कम करने पर केंद्रित है। हम मोबाइल डिजिटल पुस्तकालय स्थापित करते हैं, वार्षिक पाठ्यपुस्तकें, बैग, वर्दी प्रदान करते हैं, और साप्ताहिक ट्यूटर प्रशिक्षण प्रदान करते हैं।",
    shikshaMetrics: ['15,000+ छात्र समर्थित', '40+ स्मार्ट पुस्तकालय स्थापित', '85% उपस्थिति में सुधार'],
    shikshaBenefits: ['मुफ्त स्कूल किट (स्टेशनरी, बैग, बोतलें)', 'बुनियादी कंप्यूटर साक्षरता कार्यशालाएं', 'स्कूल के बाद उपचारात्मक सहायता केंद्र'],
    
    swasthyaTitle: "प्रोजेक्ट स्वास्थ्य (स्वास्थ्य सेवा)",
    swasthyaTag: "कल्याण और स्वस्थ बचपन सुनिश्चित करना।",
    swasthyaDesc: "प्रोजेक्ट स्वास्थ्य मलिन बस्तियों में कुपोषण और प्राथमिक स्वच्छता की कमी को दूर करता है। हम समय-समय पर स्वास्थ्य जांच के लिए मोबाइल मेडिकल इकाइयाँ संचालित करते हैं, मातृ पोषण किट वितरित करते हैं, और जागरूकता अभियान चलाते हैं।",
    swasthyaMetrics: ['20,000+ सामान्य परामर्श', '10,000+ स्वच्छता किट वितरित', '5,050+ नेत्र जांच की गई'],
    swasthyaBenefits: ['मुफ्त पर्चे की दवाएं और पूरक', 'मासिक सामान्य और बाल रोग स्वास्थ्य जांच', 'सैनिटरी पैड और स्वच्छता किट वितरण'],
    
    swabalambanTitle: "प्रोजेक्ट स्वावलंबन (आजीविका)",
    swabalambanTag: "कौशल के माध्यम से युवाओं और महिलाओं को सशक्त बनाना।",
    swabalambanDesc: "प्रोजेक्ट स्वावलंबन वंचित युवाओं और महिलाओं के लिए रोजगारोन्मुख पाठ्यक्रम तैयार और निष्पादित करता है। हम सिलाई, बुनियादी कंप्यूटर संचालन, खुदरा बिक्री और संचार की पेशकश करने वाले कौशल केंद्र चलाते हैं।",
    swabalambanMetrics: ['1,200+ महिलाएं प्रशिक्षित', '70% रोजगार दर', '20+ सूक्ष्म-व्यवसाय समर्थित'],
    swabalambanBenefits: ['सरकारी मान्यता प्राप्त कौशल प्रमाणपत्र पाठ्यक्रम', 'सॉफ्ट स्किल्स और साक्षात्कार तैयारी सत्र', 'सूक्ष्म उद्यम शुरू करने के लिए प्रायोजन ऋण']
  }
};

export default function Programs() {
  const { lang } = useLanguageTheme();
  const t = translationDict[lang];

  const programs = [
    {
      id: 'shiksha',
      title: t.shikshaTitle,
      icon: BookOpen,
      color: 'text-primary-500 bg-primary-50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/30',
      tagline: t.shikshaTag,
      desc: t.shikshaDesc,
      metrics: t.shikshaMetrics,
      benefits: t.shikshaBenefits,
      image: '/shiksha.jpg',
      videoUrl: 'https://www.youtube.com/embed/j6Jop6K5ag8'
    },
    {
      id: 'swasthya',
      title: t.swasthyaTitle,
      icon: HeartPulse,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30',
      tagline: t.swasthyaTag,
      desc: t.swasthyaDesc,
      metrics: t.swasthyaMetrics,
      benefits: t.swasthyaBenefits,
      image: '/swasthya.jpg',
      videoUrl: 'https://www.youtube.com/embed/BMgAM-PG0_I'
    },
    {
      id: 'swabalamban',
      title: t.swabalambanTitle,
      icon: UserCheck,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30',
      tagline: t.swabalambanTag,
      desc: t.swabalambanDesc,
      metrics: t.swabalambanMetrics,
      benefits: t.swabalambanBenefits,
      image: '/swabalamban.jpg'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-70 md:py-82 overflow-hidden bg-cover bg-[center_15%] bg-no-repeat border-b border-slate-200 dark:border-slate-800 pt-36 md:pt-44"
        style={{ backgroundImage: "url('/programs-bg.jpg')" }}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-[2px] z-0" />
        
        {/* Soft decorative gradient glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary-500/10 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-purple-500/10 rounded-full blur-[100px] z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <img 
            src="/logo.png" 
            className="h-20 w-20 object-contain mx-auto bg-white rounded-3xl p-1 shadow-lg mb-4 border border-slate-100 transition-transform duration-300 hover:scale-105" 
            alt="NayePankh Logo" 
          />
          <div className="flex justify-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-3.5 py-1.5 rounded-full border border-primary-100 dark:border-primary-900/30">
              {t.ourWork}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-[#132a13] dark:text-[#a3b899] drop-shadow-sm">
            {t.keyPrograms}
          </h1>
          <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-bold">
            {t.bannerDesc}
          </p>
        </div>
      </section>

      {/* Program Details List */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {programs.map((prog, idx) => {
            const Icon = prog.icon;
            return (
              <div 
                key={prog.id} 
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center p-6 sm:p-10 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Details Column */}
                <div className={`lg:col-span-6 space-y-5 ${idx % 2 === 1 ? 'lg:order-last' : ''}`}>
                  <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border ${prog.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                    <span className="text-xs font-bold tracking-wide">{prog.title}</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white font-display leading-tight">
                    {prog.tagline}
                  </h2>
                  
                  <p className="text-slate-605 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    {prog.desc}
                  </p>

                  {/* Stats Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2.5 py-3 border-y border-slate-200/60 dark:border-slate-700 my-4">
                    {prog.metrics.map((metric, mIdx) => {
                      const parts = metric.split(' ');
                      const value = parts[0];
                      const label = parts.slice(1).join(' ');
                      return (
                        <div key={mIdx} className="text-center p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-750 shadow-sm animate-fadeIn">
                          <div className="text-sm sm:text-base font-extrabold text-primary-655 dark:text-primary-400 font-display">{value}</div>
                          <div className="text-[9.5px] text-slate-500 dark:text-slate-400 font-bold leading-tight mt-0.5">{label}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t.benefitsHeading}</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {prog.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-center space-x-2 text-xs sm:text-sm text-slate-650 dark:text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-700">
                    <Link
                      to="/donate"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-xs sm:text-sm text-center shadow transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      {t.sponsorProg}
                    </Link>
                    <Link 
                      to="/get-involved"
                      className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-705 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm text-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-305"
                    >
                      {t.getInvolved}
                    </Link>
                  </div>

                  <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center space-x-1.5 pt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                    <span>{t.auditedCert}</span>
                  </div>
                </div>

                {/* Media Column (Photo on top, Video below) */}
                <div className="lg:col-span-6 w-full max-w-md mx-auto space-y-6">
                  {prog.image && (
                    /* Photo card */
                    <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 p-2">
                      <img 
                        src={prog.image} 
                        alt={prog.title} 
                        className="w-full h-auto object-contain rounded-xl" 
                      />
                    </div>
                  )}
                  
                  {prog.videoUrl && (
                    /* Video card */
                    <div className="space-y-2">
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow border border-slate-200 dark:border-slate-700 bg-black">
                        <iframe 
                          src={prog.videoUrl} 
                          title={`${prog.title} Video`} 
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          allowFullScreen
                        />
                      </div>
                      <p className="text-[9.5px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center leading-normal">
                        {t.watchAction}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
