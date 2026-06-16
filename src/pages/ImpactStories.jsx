import { Quote, Sparkles } from 'lucide-react';
import { useLanguageTheme } from '../context/LanguageThemeContext';


const translationDict = {
  en: {
    realStories: "Real Stories",
    impactStories: "Impact Stories",
    bannerDesc: "Every contribution translates directly to a dream taking flight. Here are some of our community milestones.",
    keyMilestone: "{t.keyMilestone}",
    
    // Stories content
    story1Name: 'Priya Verma',
    story1Tag: 'Livelihood (Project Swabalamban)',
    story1Quote: 'I used to take up daily farm wages. Through the 4-month tailoring school setup by NayePankh, I now run my own dress boutique in Noida and support my child\'s education.',
    story1Metrics: 'Income rose from ₹3,000/mo to ₹18,000/mo',
    
    story2Name: 'Sunny Yadav',
    story2Tag: 'Education (Project Shiksha)',
    story2Quote: 'I was helping collect scrap because of school drops. The NayePankh team enrolled me in basic remedial school, got me books, and this year I scored 84% in my grade 5 board exams.',
    story2Metrics: 'Scored 84% in Grade 5 exams',
    
    story3Name: 'Nisha Bano',
    story3Tag: 'Health (Project Swasthya)',
    story3Quote: 'Lack of sanitary pad supplies forced my daughters to skip school. NayePankh health camps distribute hygiene blocks monthly and gave us free anemia checkups.',
    story3Metrics: '100% School Attendance of her daughters'
  },
  hi: {
    realStories: "वास्तविक कहानियाँ",
    impactStories: "प्रभाव की कहानियाँ",
    bannerDesc: "हर योगदान सीधे एक सपने को उड़ान देने में मदद करता है। यहाँ हमारे सामुदायिक मील के पत्थर के कुछ क्षण दिए गए हैं।",
    keyMilestone: "मुख्य मील का पत्थर",
    
    // Stories content
    story1Name: 'प्रिया वर्मा',
    story1Tag: 'आजीविका (प्रोजेक्ट स्वावलंबन)',
    story1Quote: 'मैं पहले दैनिक कृषि मजदूरी करती थी। नयेपंख द्वारा स्थापित 4 महीने के सिलाई स्कूल के माध्यम से, मैं अब नोएडा में अपना खुद का ड्रेस बुटीक चलाती हूँ और अपने बच्चे की शिक्षा का समर्थन करती हूँ।',
    story1Metrics: 'आय ₹3,000/माह से बढ़कर ₹18,000/माह हो गई',
    
    story2Name: 'सनी यादव',
    story2Tag: 'शिक्षा (प्रोजेक्ट शिक्षा)',
    story2Quote: 'स्कूल छूटने के कारण मैं कबाड़ इकट्ठा करने में मदद कर रहा था। नयेपंख टीम ने मुझे बुनियादी उपचारात्मक स्कूल में नामांकित किया, मुझे किताबें दिलाईं, और इस साल मैंने अपनी कक्षा 5 की बोर्ड परीक्षाओं में 84% अंक प्राप्त किए।',
    story2Metrics: 'कक्षा 5 की परीक्षा में 84% अंक प्राप्त किए',
    
    story3Name: 'निशा बानो',
    story3Tag: 'स्वास्थ्य (प्रोजेक्ट स्वास्थ्य)',
    story3Quote: 'सनेटरी पैड की आपूर्ति की कमी के कारण मेरी बेटियों को स्कूल छोड़ना पड़ता था। नयेपंख स्वास्थ्य शिविर हर महीने स्वच्छता ब्लॉक वितरित करते हैं और हमें मुफ्त एनीमिया जांच प्रदान करते हैं।',
    story3Metrics: 'उनकी बेटियों की 100% स्कूल उपस्थिति'
  }
};


export default function ImpactStories() {
  const { lang, isDarkMode } = useLanguageTheme();
  const t = translationDict[lang];

  const stories = [
    {
      name: t.story1Name,
      tag: t.story1Tag,
      quote: t.story1Quote,
      metrics: t.story1Metrics,
      bgGradient: 'from-orange-500 to-amber-500'
    },
    {
      name: t.story2Name,
      tag: t.story2Tag,
      quote: t.story2Quote,
      metrics: t.story2Metrics,
      bgGradient: 'from-emerald-500 to-teal-500'
    },
    {
      name: t.story3Name,
      tag: t.story3Tag,
      quote: t.story3Quote,
      metrics: t.story3Metrics,
      bgGradient: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-77 md:py-82 overflow-hidden bg-cover bg-[center_25%] bg-no-repeat border-b border-slate-200 dark:border-slate-800 pt-36 md:pt-44"
        style={{ backgroundImage: "url('/impact-stories-bg.jpg')" }}
      >
        {/* Semi-transparent light overlay for image visibility and text readability */}
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-[2px] z-0" />
        
        {/* Soft decorative gradient glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary-500/10 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[100px] z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <img 
            src="/logo.png" 
            className="h-20 w-20 object-contain mx-auto bg-white rounded-3xl p-1 shadow-lg mb-4 border border-slate-100 transition-transform duration-300 hover:scale-105" 
            alt="NayePankh Logo" 
          />
          <div className="flex justify-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-3.5 py-1.5 rounded-full border border-primary-100 dark:border-primary-900/30">
              {t.realStories}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-[#132a13] dark:text-[#a3b899] drop-shadow-sm">
            {t.impactStories}
          </h1>
          <p className="text-slate-800 dark:text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-bold">
            {t.bannerDesc}
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between overflow-hidden hover:shadow-lg hover:border-transparent transition-all duration-300 group"
              >
                <div className={`h-36 bg-gradient-to-tr ${story.bgGradient} p-6 flex flex-col justify-between text-white relative`}>
                  <Sparkles className="absolute right-4 top-4 h-10 w-10 text-white/10" />
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-lg w-max backdrop-blur-md">
                    {story.tag}
                  </span>
                  <h3 className="text-xl font-bold font-display">{story.name}</h3>
                </div>

                <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <Quote className="h-8 w-8 text-primary-500/35 dark:text-primary-400/35" />
                    <p className="text-slate-600 text-sm italic leading-relaxed">
                      "{story.quote}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
                      Key Milestone
                    </span>
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {story.metrics}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
