import { useState, useEffect } from 'react';
import { useLanguageTheme } from '../context/LanguageThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Users, 
  BookOpen, 
  HeartPulse, 
  TrendingUp, 
  CheckCircle2, 
  Gift,
  ChevronLeft,
  ChevronRight,
  MapPin
} from 'lucide-react';

const slides = [
  { url: '/slide1.jpg', alt: 'Underprivileged school children smiling with notebooks' },
  { url: '/slide2.jpg', alt: 'Empowered rural women raising hands and celebrating' },
  { url: '/slide4.jpg', alt: 'Children holding a Thanks for sponsoring me sign' },
  { url: '/slide5.jpg', alt: 'Group of happy school children with books' },
  
  { url: '/slide7.jpg', alt: 'Mother holding a baby with a woman smiling' },
  { url: '/slide8.jpg', alt: 'Happy children giving thumbs up' },
  { url: '/slide9.jpg', alt: 'Happy children saluting outdoors' }
];

const bgSlides = [
  { 
    url1: '/bg-slide1.jpg', 
    alt1: 'Happy boy smiling holding a sunflower',
    tilt1: 'rotate-2 md:rotate-3',
    url2: '/bg-slide4.jpg',
    alt2: 'Two laughing school girls sharing a moment',
    tilt2: '-rotate-2 md:-rotate-3',
    text: 'NayePankh Foundation promotes the culture of kindness and wants to instill the sense of giving back to the society amongst modern youth ..',
    layout: 'left'
  },
  { 
    url1: '/bg-slide2.jpg', 
    alt1: 'Boy washing hands at a water pump',
    tilt1: 'rotate-1 md:rotate-2',
    url2: '/bg-slide5.jpg',
    alt2: 'Girl focused on drawing artwork with crayons',
    tilt2: '-rotate-1 md:-rotate-2',
    text: 'NayePankh Foundation works with a vision to create a society where children can prosper to their complete potential and enjoy equality in its true essence.',
    layout: 'right'
  },
  { 
    url1: '/bg-slide3.jpg', 
    alt1: 'School girls smiling with slate boards in classroom',
    tilt1: 'rotate-2 md:rotate-3',
    url2: '/bg-slide6.jpg',
    alt2: 'Young girl eating traditional food close-up',
    tilt2: '-rotate-2 md:-rotate-3',
    text: 'NayePankh Foundation works with a vision to create a society where children can prosper to their complete potential and enjoy equality in its true essence.',
    layout: 'left'
  }
];

const translationDict = {
  en: {
    heroTitlePart1: "It's that easy to bring a",
    heroTitlePart2: "Smile on Their Faces.",
    heroDesc: "We don't ask for much, just help us with what you can - Be it Money, Skill or Your Time.",
    sponsorBtn: "Sponsor a Cause",
    involvedBtn: "Get Involved",
    taxExempt: "80G Tax Exemption Certified",
    impactAudits: "100% Direct Impact Audits",
    
    // Stats Section
    statEducated: "Children Educated",
    statEducatedDesc: "Enrolled in primary schools",
    statCamps: "Medical Camps Held",
    statCampsDesc: "Free health support provided",
    statVolunteers: "Active Volunteers",
    statVolunteersDesc: "Nationwide network of youth",
    statSuccess: "Success Stories",
    statSuccessDesc: "Positive community feedback",
    
    // Active Programs Section
    activeProgSpan: "Active Programs",
    activeProgTitle: "Featured Community Wings",
    activeProgDesc: "We create targeted, audit-backed structures targeting core areas of deprivation.",
    shikshaTitle: "Project Shiksha (Education)",
    shikshaTag: "Bridging digital and literacy gaps",
    shikshaDesc: "Empowering children with smart classrooms, school kits, and direct mentoring programs.",
    swasthyaTitle: "Project Swasthya (Healthcare)",
    swasthyaTag: "Delivering medical consultation & aid",
    swasthyaDesc: "Setting up rural diagnostic setups and providing clinical checkups to underprivileged communities.",
    swabalambanTitle: "Project Swabalamban (Livelihood)",
    swabalambanTag: "Skill training for women & youth",
    swabalambanDesc: "Providing vocational tailoring courses and computing workshops for sustainable livelihoods.",
    detailsBtn: "View Program Details",
    
    // Donation CTA Section
    donationSpan: "Sponsor a Change",
    donationTitle: "Every Contribution Creates Opportunities",
    donationDesc: "Choose a direct sponsorship package. Our audits guarantee that 100% of public sponsorships are routed straight to site supplies.",
    donationExempt: "80G Receipt sent instantly to email",
    donationImpactTitle: "Impact Description",
    preset1: "Sponsors 1 basic school kit",
    preset2: "Covers health screening + medicine",
    preset3: "Funds 1 sewing machine training cycle",
    proceedSponsor: "Proceed to Sponsor",
    
    // Volunteer Section
    volunteerSpan: "Join our team",
    volunteerTitle: "Want to make a change on the ground? Become a NayePankh Volunteer.",
    volunteerDesc: "Lend your skills and voice. We coordinate weekend classroom tutoring, health checking setups, and blanket distribution drives across major city centers.",
    volunteerPoint1: "Flexible schedules (2-4 hrs/week)",
    volunteerPoint2: "Signed work experience certificates",
    volunteerPoint3: "Leadership opportunities at site centers",
    volunteerJoinBtn: "Join Now",
    initiative: "Initiative",
    funded: "Funded",
    of: "of",
    
    // Reach Section
    reachTitle: "Our Reach 2024-25",
    reachSubtitle: "Spanning across India to deliver education, healthcare, and livelihood support where it is needed most.",
    reachLabel1: "Activities in",
    reachVal1: "26",
    reachDesc1: "states & union territories",
    reachLabel2: "Children reached",
    reachVal2: "8M",
    reachDesc2: "through direct programs and government partnerships",
    reachLabel3: "Girls and women reached",
    reachVal3: "270K",
    reachDesc3: "through mothers' groups and second chance program",
    reachLabel4: "Youth reached",
    reachVal4: "124K",
    reachDesc4: "through vocational/non-vocational courses"
  },
  hi: {
    heroTitlePart1: "उनके चेहरों पर",
    heroTitlePart2: "मुस्कान लाना इतना आसान है।",
    heroDesc: "हम बहुत कुछ नहीं मांगते, बस जो आप कर सकते हैं उससे हमारी मदद करें - चाहे वह पैसा हो, कौशल हो या आपका समय।",
    sponsorBtn: "एक कारण को प्रायोजित करें",
    involvedBtn: "शामिल हों",
    taxExempt: "80G टैक्स छूट प्रमाणित",
    impactAudits: "100% प्रत्यक्ष प्रभाव ऑडिट",
    
    // Stats Section
    statEducated: "शिक्षित बच्चे",
    statEducatedDesc: "प्राथमिक विद्यालयों में नामांकित",
    statCamps: "आयोजित चिकित्सा शिविर",
    statCampsDesc: "मुफ्त स्वास्थ्य सहायता प्रदान की गई",
    statVolunteers: "सक्रिय स्वयंसेवक",
    statVolunteersDesc: "युवाओं का देशव्यापी नेटवर्क",
    statSuccess: "सफलता की कहानियां",
    statSuccessDesc: "सकारात्मक सामुदायिक प्रतिक्रिया",
    
    // Active Programs Section
    activeProgSpan: "सक्रिय कार्यक्रम",
    activeProgTitle: "विशेष रुप से प्रदर्शित सामुदायिक विंग्स",
    activeProgDesc: "हम अभाव के मुख्य क्षेत्रों को लक्षित करते हुए लक्षित, ऑडिट-समर्थित संरचनाएं बनाते हैं।",
    shikshaTitle: "प्रोजेक्ट शिक्षा (शिक्षा)",
    shikshaTag: "डिजिटल और साक्षरता अंतराल को पाटना",
    shikshaDesc: "स्मार्ट क्लासरूम, स्कूल किट और प्रत्यक्ष सलाह कार्यक्रमों के साथ बच्चों को सशक्त बनाना।",
    swasthyaTitle: "प्रोजेक्ट स्वास्थ्य (स्वास्थ्य सेवा)",
    swasthyaTag: "चिकित्सा परामर्श और सहायता प्रदान करना",
    swasthyaDesc: "ग्रामीण नैदानिक सेटअप स्थापित करना और वंचित समुदायों को नैदानिक जांच प्रदान करना।",
    swabalambanTitle: "प्रोजेक्ट स्वावलंबन (आजीविका)",
    swabalambanTag: "महिलाओं और युवाओं के लिए कौशल प्रशिक्षण",
    swabalambanDesc: "सतत आजीविका के लिए व्यावसायिक सिलाई पाठ्यक्रम और कंप्यूटिंग कार्यशालाएं प्रदान करना।",
    detailsBtn: "कार्यक्रम का विवरण देखें",
    
    // Donation CTA Section
    donationSpan: "प्रायोजन बदलें",
    donationTitle: "प्रत्येक योगदान अवसर पैदा करता है",
    donationDesc: "एक सीधा प्रायोजन पैकेज चुनें। हमारे ऑडिट गारंटी देते हैं कि 100% सार्वजनिक प्रायोजन सीधे साइट आपूर्ति के लिए भेजे जाते हैं।",
    donationExempt: "80G रसीद तुरंत ईमेल पर भेजी गई",
    donationImpactTitle: "प्रभाव विवरण",
    preset1: "1 बुनियादी स्कूल किट प्रायोजित करता है",
    preset2: "स्वास्थ्य जांच + दवा शामिल है",
    preset3: "1 सिलाई मशीन प्रशिक्षण चक्र को निधि देता है",
    proceedSponsor: "प्रायोजित करने के लिए आगे बढ़ें",
    
    // Volunteer Section
    volunteerSpan: "हमारी टीम से जुड़ें",
    volunteerTitle: "जमीनी स्तर पर बदलाव लाना चाहते हैं? नयेपंख स्वयंसेवक बनें।",
    volunteerDesc: "अपने कौशल और आवाज का योगदान दें। हम प्रमुख शहर केंद्रों में सप्ताहांत कक्षा शिक्षण, स्वास्थ्य जांच सेटअप और कंबल वितरण अभियान का समन्वय करते हैं।",
    volunteerPoint1: "लचीला कार्यक्रम (2-4 घंटे/सप्ताह)",
    volunteerPoint2: "हस्ताक्षरित कार्य अनुभव प्रमाणपत्र",
    volunteerPoint3: "साइट केंद्रों पर नेतृत्व के अवसर",
    volunteerJoinBtn: "अभी जुड़ें",
    initiative: "पहल",
    funded: "वित्तपोषित",
    of: "में से",
    
    // Reach Section
    reachTitle: "हमारी पहुँच 2024-25",
    reachSubtitle: "शिक्षा, स्वास्थ्य सेवा और आजीविका सहायता प्रदान करने के लिए समुदायों तक व्यापक पहुँच।",
    reachLabel1: "गतिविधियाँ",
    reachVal1: "26",
    reachDesc1: "राज्यों और केंद्र शासित प्रदेशों में",
    reachLabel2: "बच्चों तक पहुँच",
    reachVal2: "8M",
    reachDesc2: "प्रत्यक्ष कार्यक्रमों और सरकारी भागीदारी के माध्यम से",
    reachLabel3: "लड़कियों और महिलाओं तक पहुँच",
    reachVal3: "270K",
    reachDesc3: "मातृ समूहों और द्वितीय अवसर कार्यक्रमों के माध्यम से",
    reachLabel4: "युवाओं तक पहुँच",
    reachVal4: "124K",
    reachDesc4: "व्यावसायिक और गैर-व्यावसायिक पाठ्यक्रमों के माध्यम से"
  }
};

export default function Home() {
  const navigate = useNavigate();
  const [activePreset, setActivePreset] = useState(1500);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgSlideIndex, setBgSlideIndex] = useState(0);
  const [isFirstPhotoFront, setIsFirstPhotoFront] = useState(true);
  const [isVolPhotoFront, setIsVolPhotoFront] = useState(true);
  const { lang, isDarkMode } = useLanguageTheme();

  const t = translationDict[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgSlideIndex((prev) => (prev + 1) % bgSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFirstPhotoFront((prev) => !prev);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVolPhotoFront((prev) => !prev);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { 
      label: t.statEducated, 
      value: '15,000+', 
      desc: t.statEducatedDesc,
      icon: BookOpen, 
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/30',
      glowColor: 'hover:shadow-primary-500/10 hover:border-primary-400/50 dark:hover:border-primary-500/30',
      gradient: 'from-primary-600 to-primary-500'
    },
    { 
      label: t.statCamps, 
      value: '450+', 
      desc: t.statCampsDesc,
      icon: HeartPulse, 
      color: 'text-secondary-600 dark:text-secondary-400',
      bgColor: 'bg-secondary-50 dark:bg-secondary-950/20 border-secondary-100 dark:border-secondary-900/30',
      glowColor: 'hover:shadow-secondary-500/10 hover:border-secondary-400/50 dark:hover:border-secondary-500/30',
      gradient: 'from-secondary-600 to-secondary-500'
    },
    { 
      label: t.statVolunteers, 
      value: '2,500+', 
      desc: t.statVolunteersDesc,
      icon: Users, 
      color: 'text-accent-600 dark:text-accent-400',
      bgColor: 'bg-accent-50 dark:bg-accent-950/20 border-accent-100 dark:border-accent-900/30',
      glowColor: 'hover:shadow-accent-500/10 hover:border-accent-400/50 dark:hover:border-accent-500/30',
      gradient: 'from-accent-600 to-accent-500'
    },
    { 
      label: t.statSuccess, 
      value: '98%', 
      desc: t.statSuccessDesc,
      icon: Award, 
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30',
      glowColor: 'hover:shadow-rose-500/10 hover:border-rose-400/50 dark:hover:border-rose-500/30',
      gradient: 'from-rose-600 to-rose-500'
    },
  ];

  const reachStats = [
    { 
      label: t.reachLabel1, 
      value: t.reachVal1, 
      desc: t.reachDesc1,
      icon: MapPin, 
      color: 'from-primary-600 to-primary-500',
      bgColor: 'text-primary-600 bg-primary-50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/30' 
    },
    { 
      label: t.reachLabel2, 
      value: t.reachVal2, 
      desc: t.reachDesc2,
      icon: Heart, 
      color: 'from-secondary-600 to-secondary-500',
      bgColor: 'text-secondary-600 bg-secondary-50 dark:bg-secondary-950/20 border-secondary-100 dark:border-secondary-900/30' 
    },
    { 
      label: t.reachLabel3, 
      value: t.reachVal3, 
      desc: t.reachDesc3,
      icon: Users, 
      color: 'from-accent-600 to-accent-500',
      bgColor: 'text-accent-600 bg-accent-50 dark:bg-accent-950/20 border-accent-100 dark:border-accent-900/30' 
    },
    { 
      label: t.reachLabel4, 
      value: t.reachVal4, 
      desc: t.reachDesc4,
      icon: BookOpen, 
      color: 'from-rose-600 to-rose-500',
      bgColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30' 
    },
  ];

  const highlights = [
    {
      id: 'shiksha',
      title: t.shikshaTitle,
      tagline: t.shikshaTag,
      desc: t.shikshaDesc,
      progress: 82,
      raised: '₹8,20,000',
      target: '₹10,00,000',
      color: 'primary',
      icon: BookOpen,
      image: '/shiksha-wing.jpg',
    },
    {
      id: 'swasthya',
      title: t.swasthyaTitle,
      tagline: t.swasthyaTag,
      desc: t.swasthyaDesc,
      progress: 68,
      raised: '₹5,44,000',
      target: '₹8,00,000',
      color: 'secondary',
      icon: HeartPulse,
      image: '/swasthya-wing.jpg',
    },
    {
      id: 'swabalamban',
      title: t.swabalambanTitle,
      tagline: t.swabalambanTag,
      desc: t.swabalambanDesc,
      progress: 91,
      raised: '₹4,55,000',
      target: '₹5,00,000',
      color: 'accent',
      icon: Users,
      image: '/swabalamban-wing.png',
    },
  ];

  const presets = [
    { value: 500, label: '₹500', desc: t.preset1 },
    { value: 1500, label: '₹1,500', desc: t.preset2 },
    { value: 3000, label: '₹3,000', desc: t.preset3 },
  ];

  const handleQuickDonate = () => {
    navigate('/donate');
  };

  return (
    <div className={`relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* 1. Hero Section (Full-bleed Background Slideshow) */}
      <section className="relative min-h-[90vh] flex items-center pt-36 md:pt-42 pb-140 overflow-hidden bg-slate-950">
        
        {/* Slideshow Background Layer */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.url}
                alt={slide.alt}
                className={`w-full h-full object-cover transition-transform duration-[4500ms] ease-out ${
                  idx === currentSlide ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Readability Overlay Mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/30 dark:from-slate-950/95 dark:via-slate-950/75 dark:to-slate-950/45 z-10" />

        {/* Floating background grids/glows */}
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none z-10" />
        <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-secondary-500/10 rounded-full blur-[120px] pointer-events-none z-10" />

        {/* Left/Right navigation arrows (absolute screen edges) */}
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none hover:scale-105 active:scale-95 cursor-pointer opacity-40 hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none hover:scale-105 active:scale-95 cursor-pointer opacity-40 hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Bottom Right Slogan Overlay */}
        <div className="absolute bottom-16 right-8 md:right-16 z-30 text-right pointer-events-none select-none">
          <p className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none opacity-90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]">
            Think global,<br />Act local.
          </p>
        </div>

        {/* Bottom dot indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2 backdrop-blur-md bg-black/30 border border-white/10 px-4 py-2.5 rounded-full">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 w-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide 
                  ? 'bg-white w-5 shadow-sm' 
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-8 text-left text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display leading-[1.12] tracking-tight">
              {t.heroTitlePart1}<br />
              <span className="bg-gradient-to-r from-primary-400 via-brand-orange to-brand-yellow bg-clip-text text-transparent">
                {t.heroTitlePart2}
              </span>
            </h1>

            <p className="text-lg sm:text-xl leading-relaxed text-slate-200">
              {t.heroDesc}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/donate"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#ad2831] via-[#d00000] to-[#ad2831] bg-[length:200%_auto] hover:bg-right text-white font-bold text-base shadow-lg hover:shadow-[#ad2831]/40 transition-all duration-500 transform hover:-translate-y-1 flex items-center justify-center space-x-2 border border-white/10"
              >
                <Heart className="h-5 w-5 fill-white animate-pulse" />
                <span>{t.sponsorBtn}</span>
              </Link>
              <Link
                to="/get-involved"
                className="px-8 py-4 rounded-xl backdrop-blur-md bg-white/10 hover:bg-white/20 border-2 border-white/25 hover:border-white text-white font-bold text-base transition-all duration-300 shadow-md hover:shadow-white/10 transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <span>{t.involvedBtn}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex items-center flex-wrap gap-4 pt-4 text-xs font-bold text-slate-300">
              <div className="flex items-center space-x-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-colors cursor-default">
                <ShieldCheck className="h-5 w-5 text-secondary-400" />
                <span>{t.taxExempt}</span>
              </div>
              <div className="flex items-center space-x-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-colors cursor-default">
                <TrendingUp className="h-5 w-5 text-primary-400" />
                <span>{t.impactAudits}</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 2. Statistics Cards Section */}
      <section className={`py-20 border-y relative z-10 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className={`relative p-8 rounded-3xl border transition-all duration-500 flex flex-col items-start overflow-hidden group hover:-translate-y-2.5 ${stat.glowColor} ${
                    isDarkMode 
                      ? 'bg-slate-900/70 backdrop-blur-md border-slate-850 shadow-lg shadow-black/25' 
                      : 'bg-white border-slate-200/70 shadow-md shadow-slate-100/50 hover:shadow-xl'
                  }`}
                >
                  {/* Subtle colored glow circles inside stat card */}
                  <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-[45px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${stat.gradient}`} />

                  {/* Faint background watermark icon */}
                  <Icon className={`absolute right-[-10px] bottom-[-10px] h-28 w-28 opacity-[0.03] dark:opacity-[0.015] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none ${stat.color}`} />
                  
                  {/* Left border gradient highlight strip on hover */}
                  <div className={`absolute left-0 inset-y-0 w-1 bg-gradient-to-b ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Icon sphere */}
                  <div className={`p-3.5 rounded-2xl border ${stat.bgColor} transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-sm mb-5`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div>
                    <h4 className={`text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </h4>
                    <p className={`text-sm font-extrabold mt-2 transition-colors duration-300 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                      {stat.label}
                    </p>
                    <p className={`text-xs mt-1 leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {stat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Programs Section */}
      <section className={`py-24 relative transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-950/20 px-3.5 py-1.5 rounded-full border border-primary-100 dark:border-primary-900/35">
              {t.activeProgSpan}
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black font-display tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {t.activeProgTitle}
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.activeProgDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((program) => {
              const Icon = program.icon;
              const barColor = {
                primary: 'bg-primary-500',
                secondary: 'bg-secondary-500',
                accent: 'bg-accent-500',
              }[program.color];

              const programHover = {
                primary: 'hover:border-primary-400/55 dark:hover:border-primary-500/30 hover:shadow-primary-500/10',
                secondary: 'hover:border-secondary-400/55 dark:hover:border-secondary-500/30 hover:shadow-secondary-500/10',
                accent: 'hover:border-accent-400/55 dark:hover:border-accent-500/30 hover:shadow-accent-500/10',
              }[program.color];

              return (
                <div 
                  key={program.id} 
                  className={`rounded-3xl border hover:shadow-2xl shadow-sm transition-all duration-500 flex flex-col justify-between overflow-hidden group hover:-translate-y-1.5 ${programHover} ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'}`}
                >
                  <div>
                    {program.image && (
                      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                        <img 
                          src={program.image} 
                          alt={program.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none" />
                      </div>
                    )}
                    
                    <div className="p-8 space-y-5">
                      <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-xl border ${isDarkMode ? 'border-slate-800 bg-slate-800/50 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {t.initiative}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className={`text-xl font-bold font-display transition-colors ${isDarkMode ? 'text-white group-hover:text-primary-400' : 'text-slate-950 group-hover:text-primary-600'}`}>
                          {program.title}
                        </h3>
                        <p className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{program.tagline}</p>
                      </div>

                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-605'}`}>
                        {program.desc}
                      </p>

                      <div className={`space-y-2 pt-2 border-t ${isDarkMode ? 'border-slate-850' : 'border-slate-100'}`}>
                        <div className={`flex justify-between text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span>{t.funded} ({program.progress}%)</span>
                          <span>{program.raised} {t.of} {program.target}</span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-850' : 'bg-slate-100'}`}>
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${program.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 pb-8">
                    <Link
                      to="/programs"
                      className={`w-full py-3 rounded-xl border font-bold text-xs text-center block transition-all duration-300 ${isDarkMode ? 'border-slate-700 hover:border-primary-500 hover:bg-primary-950/20 text-slate-300 hover:text-primary-400' : 'border-slate-200 hover:border-primary-600 hover:bg-primary-50 text-slate-700 hover:text-primary-600'}`}
                    >
                      {t.detailsBtn}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3.25 Background Slideshow Section (Carousel with Green Background) */}
      <section className="relative h-[480px] md:h-[580px] overflow-hidden bg-gradient-to-br from-[#1b3622] via-[#3a5a40] to-[#132a13] flex items-center justify-center">
        {/* Slides Layer */}
        <div className="absolute inset-0 z-0">
          {bgSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full flex items-center justify-center p-6 md:p-12 transition-opacity duration-1000 ease-in-out ${
                idx === bgSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className="max-w-6xl mx-auto px-6 md:px-12 w-full h-full flex items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full">
                  {/* Overlapping Photos Stack Column */}
                  <div className={`relative w-full max-w-[420px] aspect-[4/3] sm:aspect-square mx-auto flex items-center justify-center transition-all duration-700 ${
                    slide.layout === 'left' ? 'order-1 md:order-1' : 'order-1 md:order-2'
                  } ${idx === bgSlideIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    
                    {/* Photo 1 (Behind, angled left) */}
                    <img
                      src={slide.url1}
                      alt={slide.alt1}
                      className={`absolute top-[5%] left-[5%] w-[62%] aspect-[4/5] object-cover rounded-2xl border-4 transition-all duration-700 cursor-pointer ${
                        isFirstPhotoFront
                          ? 'z-20 scale-102 rotate-[-2deg] border-white opacity-100 shadow-xl'
                          : 'z-10 scale-95 rotate-[-8deg] border-white/85 opacity-75 shadow-md'
                      }`}
                      onClick={() => setIsFirstPhotoFront(true)}
                    />
                    
                    {/* Photo 2 (In front, angled right) */}
                    <img
                      src={slide.url2}
                      alt={slide.alt2}
                      className={`absolute bottom-[5%] right-[5%] w-[62%] aspect-[4/5] object-cover rounded-2xl border-4 transition-all duration-700 cursor-pointer ${
                        isFirstPhotoFront
                          ? 'z-10 scale-95 rotate-[8deg] border-white/85 opacity-75 shadow-md'
                          : 'z-20 scale-102 rotate-[2deg] border-white opacity-100 shadow-xl'
                      }`}
                      onClick={() => setIsFirstPhotoFront(false)}
                    />
                    
                  </div>

                  {/* Glassmorphic Quote Card Column */}
                  <div className={`flex justify-center transition-all duration-700 ${
                    slide.layout === 'left' ? 'order-2 md:order-2' : 'order-2 md:order-1'
                  }`}>
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl shadow-xl space-y-6 max-w-lg w-full text-left">
                      {/* Card Header Tag and Quotes */}
                      <div className="flex items-center justify-between">
                        <span className="text-secondary-300 font-serif text-7xl leading-none select-none opacity-80">“</span>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary-300/90 bg-white/5 px-3.5 py-1 rounded-full border border-white/5 select-none">
                          {slide.layout === 'left' ? 'Culture of Kindness' : 'Our Vision'}
                        </span>
                      </div>
                      
                      {/* Quote Text */}
                      <p className="font-display text-xl sm:text-2xl md:text-2xl lg:text-3xl font-light italic leading-relaxed tracking-wide text-white/95 pl-2">
                        {slide.text}
                      </p>
                      
                      {/* Accent Bar */}
                      <div className="w-12 h-0.5 bg-gradient-to-r from-secondary-400 to-transparent ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left/Right navigation arrows */}
        <button
          type="button"
          onClick={() => setBgSlideIndex((prev) => (prev === 0 ? bgSlides.length - 1 : prev - 1))}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-25 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none hover:scale-105 active:scale-95 cursor-pointer opacity-75 hover:opacity-100"
          aria-label="Previous background slide"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <button
          type="button"
          onClick={() => setBgSlideIndex((prev) => (prev + 1) % bgSlides.length)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-25 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white flex items-center justify-center shadow-lg transition-all duration-300 focus:outline-none hover:scale-105 active:scale-95 cursor-pointer opacity-75 hover:opacity-100"
          aria-label="Next background slide"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        {/* Bottom dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 flex space-x-2.5 backdrop-blur-md bg-black/20 border border-white/10 px-4 py-2.5 rounded-full">
          {bgSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBgSlideIndex(idx)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === bgSlideIndex 
                  ? 'bg-white w-5 shadow-sm' 
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to background slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 3.5 Reach 2025-26 Section */}
      <section className={`py-24 relative overflow-hidden border-t transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.015] pointer-events-none text-slate-400 dark:text-slate-600">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-primary-100/30 dark:bg-primary-950/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-secondary-100/20 dark:bg-secondary-950/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-950/20 px-3.5 py-1.5 rounded-full border border-primary-100 dark:border-primary-900/35">
              Impact Overview
            </span>
            <h2 className={`text-4xl sm:text-5xl font-black font-display tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {t.reachTitle}
            </h2>
            <p className={`text-base leading-relaxed transition-colors duration-300 max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.reachSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {reachStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx}
                  className={`relative p-8 rounded-3xl border transition-all duration-500 group flex flex-col items-center text-center overflow-hidden hover:-translate-y-2.5 ${
                    isDarkMode 
                      ? 'bg-slate-900/70 backdrop-blur-md border-slate-850 shadow-lg shadow-black/25' 
                      : 'bg-white border-slate-200/70 shadow-md shadow-slate-100/50 hover:shadow-xl'
                  }`}
                >
                  {/* Subtle colored glow circles inside reach card */}
                  <div className={`absolute -top-12 -right-12 w-28 h-28 rounded-full blur-[45px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${stat.color}`} />

                  <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${stat.color} opacity-80`} />
                  
                  <div className={`p-4 rounded-2xl border ${stat.bgColor} transition-all duration-500 group-hover:scale-110 mb-6 shadow-sm`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <span className={`text-xs font-extrabold uppercase tracking-wider mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {stat.label}
                  </span>

                  <h3 className={`text-5xl sm:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent transition-transform duration-500 group-hover:scale-[1.05]`}>
                    {stat.value}
                  </h3>

                  <p className={`text-xs font-semibold leading-relaxed transition-colors duration-300 mt-auto ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-655'
                  }`}>
                    {stat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Donation Call-to-Action */}
      <section 
        className={`py-24 relative overflow-hidden bg-cover bg-center bg-no-repeat border-y ${isDarkMode ? 'border-slate-900' : 'border-slate-150'}`}
       
      >
        {/* Soft edge gradients and overlay */}
        <div className={`absolute inset-x-0 top-0 h-16 bg-gradient-to-b pointer-events-none z-0 ${isDarkMode ? 'from-slate-950 to-transparent' : 'from-white to-transparent'}`} />
        <div className={`absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t pointer-events-none z-0 ${isDarkMode ? 'from-slate-950 to-transparent' : 'from-white to-transparent'}`} />
        <div className={`absolute inset-0 pointer-events-none z-0 ${isDarkMode ? 'bg-slate-950/75 backdrop-blur-[1px]' : 'bg-white/45 backdrop-blur-[1px]'}`} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`border rounded-3xl p-8 sm:p-12 shadow-lg ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/60'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column Description */}
              <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-accent-50 text-accent-600 text-xs font-bold uppercase border border-accent-100">
                  <Gift className="h-3.5 w-3.5" />
                  <span>{t.donationSpan}</span>
                </span>
                <h2 className={`text-3xl font-black font-display leading-tight ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>
                  {t.donationTitle}
                </h2>
                <p className={`text-sm leading-relaxed max-w-md mx-auto lg:mx-0 ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                  {t.donationDesc}
                </p>
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 justify-center lg:justify-start">
                  <ShieldCheck className="h-4.5 w-4.5 text-secondary-500" />
                  <span>{t.donationExempt}</span>
                </div>
              </div>

              {/* Middle Column Interactive Presets */}
              <div className={`lg:col-span-4 space-y-6 p-6 sm:p-8 rounded-3xl border transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'bg-slate-950/40 backdrop-blur-md border-slate-850 shadow-lg' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                <div className="grid grid-cols-3 gap-3">
                  {presets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setActivePreset(preset.value)}
                      className={`py-3.5 rounded-xl border text-sm font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md ${
                        activePreset === preset.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 shadow-sm font-black scale-[1.02]'
                          : (isDarkMode ? 'border-slate-700 bg-slate-900 text-slate-350 hover:border-slate-500 hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-650 hover:border-slate-350 hover:bg-slate-50')
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className={`p-4 rounded-xl border text-center shadow-inner transition-all duration-300 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-250/80'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.donationImpactTitle}</p>
                  <p className={`text-sm font-bold mt-1 leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {presets.find(p => p.value === activePreset)?.desc}
                  </p>
                </div>

                <button
                  onClick={handleQuickDonate}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-sm text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Heart className="h-4.5 w-4.5 fill-white animate-pulse" />
                  <span>{t.proceedSponsor} (₹{activePreset.toLocaleString('en-IN')})</span>
                </button>
              </div>

              {/* Right Column: YouTube Shorts Embed */}
              <div className="lg:col-span-3 w-full flex justify-center">
                <div className="relative group w-full max-w-[260px] aspect-[9/16]">
                  {/* Decorative Glow */}
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-500 via-brand-orange to-brand-red rounded-3xl blur-[12px] opacity-35 group-hover:opacity-65 transition duration-500 animate-pulse" />
                  
                  {/* Video Container */}
                  <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border bg-black transition-all duration-500 group-hover:scale-[1.03] ${isDarkMode ? 'border-slate-800 group-hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)]' : 'border-slate-200 group-hover:shadow-[0_20px_50px_rgba(173,40,49,0.25)]'}`}>
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/B2jB7Vwgq8c"
                      title="NayePankh Foundation Campaign"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. Volunteer Section */}
      <section className={`py-24 border-t relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'}`}>
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #000000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
        <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-secondary-100/40 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase border border-slate-200">
                  <Users className="h-4 w-4 text-primary-500" />
                  <span>{t.volunteerSpan}</span>
                </span>
                <h2 className={`text-3xl sm:text-4xl font-black font-display leading-tight tracking-tight transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {t.volunteerTitle}
                </h2>
                <p className={`text-base max-w-2xl leading-relaxed mx-auto lg:mx-0 transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-650'}`}>
                  {t.volunteerDesc}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-stretch sm:items-center justify-center lg:justify-start">
                <div className={`p-6 rounded-2xl border space-y-3 shadow-sm transition-colors duration-300 text-left w-full sm:max-w-md ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className={`flex items-center space-x-2.5 text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}>
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-secondary-600" />
                    <span>{t.volunteerPoint1}</span>
                  </div>
                  <div className={`flex items-center space-x-2.5 text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}>
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-secondary-600" />
                    <span>{t.volunteerPoint2}</span>
                  </div>
                  <div className={`flex items-center space-x-2.5 text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}>
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-secondary-600" />
                    <span>{t.volunteerPoint3}</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <Link
                    to="/get-involved"
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-secondary-550 hover:bg-secondary-600 text-slate-950 font-bold text-sm text-center shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap flex items-center justify-center"
                  >
                    {t.volunteerJoinBtn}
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 w-full flex justify-center">
              <div className="relative group w-full max-w-[320px] aspect-[2/3] min-h-[380px] sm:min-h-[460px]">
                {/* Subtle soft gradient backdrop glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-secondary-400 to-primary-500 rounded-3xl blur-[12px] opacity-20 group-hover:opacity-35 transition duration-500 animate-pulse pointer-events-none" />
                
                {/* Volunteer Photo 1 (Behind, angled left) */}
                <img
                  src="/volunteer1.png"
                  alt="Volunteer interacting with child"
                  className={`absolute top-0 left-0 w-[78%] aspect-[2/3] object-cover rounded-2xl border-4 transition-all duration-700 cursor-pointer ${
                    isVolPhotoFront
                      ? 'z-20 scale-102 rotate-[-2deg] border-white opacity-100 shadow-xl'
                      : 'z-10 scale-95 rotate-[-8deg] border-white/85 opacity-75 shadow-md'
                  }`}
                  onClick={() => setIsVolPhotoFront(true)}
                />
                
                {/* Volunteer Photo 2 (In front, angled right) */}
                <img
                  src="/volunteer2.png"
                  alt="Volunteer carrying child on shoulders"
                  className={`absolute bottom-0 right-0 w-[78%] aspect-[2/3] object-cover rounded-2xl border-4 transition-all duration-700 cursor-pointer ${
                    isVolPhotoFront
                      ? 'z-10 scale-95 rotate-[8deg] border-white/85 opacity-75 shadow-md'
                      : 'z-20 scale-102 rotate-[2deg] border-white opacity-100 shadow-xl'
                  }`}
                  onClick={() => setIsVolPhotoFront(false)}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
