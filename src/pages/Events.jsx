import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Check } from 'lucide-react';
import { db, isConfigured } from '../firebase/config';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { useLanguageTheme } from '../context/LanguageThemeContext';

const translationDict = {
  en: {
    getInvolved: "Get Involved",
    upcomingEvents: "Upcoming Events",
    bannerDesc: "Participate in our local events and contribute hands-on to bringing joy and clinical support.",
    registered: "Registered",
    registerBtn: "Register for Event",
    loadingEvents: "Loading events in list view...",
    event1Title: "Noida Winter Clothes & Blanket Drive",
    event1Date: "December 20, 2026",
    event1Time: "10:00 AM - 4:00 PM",
    event1Location: "Sector 62 Community Center, Noida",
    event1Desc: "Collecting blankets, warm clothes, sweaters, and kids jackets to distribute across 15 shelter homes during cold waves.",
    event1Type: "drive",
    
    event2Title: "Project Swasthya Free Medical Health Camp",
    event2Date: "January 10, 2027",
    event2Time: "09:00 AM - 3:00 PM",
    event2Location: "Government High School, Chhalera, UP",
    event2Desc: "Conducting general health screenings, eye tests, distributing free multivitamin syrups, and primary medication to slum clusters.",
    event2Type: "medical",
    
    event3Title: "Swabalamban Youth Skill & Career Fair",
    event3Date: "February 15, 2027",
    event3Time: "11:00 AM - 5:00 PM",
    event3Location: "Youth Center, Sector 15, Noida",
    event3Desc: "Matching vocational school graduates and self-taught women tailors/computer operators with local MSME recruiters.",
    event3Type: "skill",

    pastEventsTitle: "Previous Events Held",
    pastEventsDesc: "Take a look at our recently completed ground campaigns, guest visits, and impact results.",
    chiefGuest: "Chief Guest",
    vipDonors: "VIP Donors",
    goalsAchieved: "Goals Achieved",
    keyContributions: "Key Contributions",
    location: "Location",
    time: "Time",
    pastEvent1Title: "Project Swasthya Health & Dental Camp",
    pastEvent1Guest: "Dr. Alok Nath (Chief Medical Officer, Kanpur)",
    pastEvent1Donors: "Tata Group CSR, Singhania Textiles",
    pastEvent1Goals: "Provided free diagnostics and dental screenings to over 1,200 kids; distributed 800 free vitamin kits.",
    pastEvent1Contrib: "12 registered doctors volunteered; ₹2,50,000 worth of free medications distributed.",
    
    pastEvent2Title: "Mega Winter Blanket & Support Drive",
    pastEvent2Guest: "Smt. Meenakshi Lekhi (Social Activist)",
    pastEvent2Donors: "Reliance Foundation, Delhi Citizen Forum",
    pastEvent2Goals: "Distributed 2,500 high-quality thermal blankets and 1,000 warm kids jackets during peak winter waves.",
    pastEvent2Contrib: "50+ youth volunteers coordinated logistics; ₹4,80,000 raised via public crowdfunding.",

    pastEvent3Title: "Project Shiksha Computer Lab Launch",
    pastEvent3Guest: "Shri Rajeev Chandrasekhar (Ex-MoS IT)",
    pastEvent3Donors: "HCL Foundation, Intel Volunteers",
    pastEvent3Goals: "Setup 15 smart workstations with computing access and internet capability for local slum youth.",
    pastEvent3Contrib: "HCL donated refurbished systems; 3 digital literacy modules designed by tech experts."
  },
  hi: {
    getInvolved: "शामिल हों",
    upcomingEvents: "आगामी कार्यक्रम",
    bannerDesc: "हमारे स्थानीय कार्यक्रमों में भाग लें और खुशी और स्वास्थ्य सहायता लाने में व्यावहारिक योगदान दें।",
    registered: "पंजीकृत",
    registerBtn: "कार्यक्रम के लिए पंजीकरण करें",
    loadingEvents: "आयोजन सूची लोड हो रही है...",
    event1Title: "नोएडा शीतकालीन कपड़े और कंबल वितरण अभियान",
    event1Date: "20 दिसंबर, 2026",
    event1Time: "सुबह 10:00 - शाम 4:00 बजे",
    event1Location: "सेक्टर 62 सामुदायिक केंद्र, नोएडा",
    event1Desc: "शीत लहर के दौरान 15 आश्रय गृहों में वितरित करने के लिए कंबल, गर्म कपड़े, स्वेटर और बच्चों के जैकेट एकत्र करना।",
    event1Type: "अभियान",
    
    event2Title: "प्रोजेक्ट स्वास्थ्य मुफ्त चिकित्सा स्वास्थ्य शिविर",
    event2Date: "10 जनवरी, 2027",
    event2Time: "सुबह 09:00 - दोपहर 3:00 बजे",
    event2Location: "सरकारी हाई स्कूल, छलेरा, यूपी",
    event2Desc: "मलिन बस्तियों में सामान्य स्वास्थ्य जांच, नेत्र परीक्षण, मुफ्त मल्टीविटामिन सिरप और प्राथमिक दवाएं वितरित करना।",
    event2Type: "चिकित्सा शिविर",
    
    event3Title: "स्वावलंबन युवा कौशल और करियर मेला",
    event3Date: "15 फरवरी, 2027",
    event3Time: "सुबह 11:00 - शाम 5:00 बजे",
    event3Location: "युवा केंद्र, सेक्टर 15, नोएडा",
    event3Desc: "व्यावसायिक स्कूल के स्नातकों और स्व-प्रशिक्षित महिला दर्जियों/कंप्यूटर ऑपरेटरों को स्थानीय एमएसएमई नियोक्ताओं के साथ जोड़ना।",
    event3Type: "कौशल मेला",

    pastEventsTitle: "आयोजित पिछले कार्यक्रम",
    pastEventsDesc: "हाल ही में पूरे किए गए हमारे जमीनी अभियानों, अतिथि दौरों और प्रभाव परिणामों पर एक नज़र डालें।",
    chiefGuest: "मुख्य अतिथि",
    vipDonors: "वीआईपी दाता",
    goalsAchieved: "हासिल किए गए लक्ष्य",
    keyContributions: "मुख्य योगदान",
    location: "स्थान",
    time: "समय",
    pastEvent1Title: "प्रोजेक्ट स्वास्थ्य और दंत चिकित्सा शिविर",
    pastEvent1Guest: "डॉ. आलोक नाथ (मुख्य चिकित्सा अधिकारी, कानपुर)",
    pastEvent1Donors: "टाटा समूह सीएसआर, सिंघानिया टेक्सटाइल",
    pastEvent1Goals: "1,200 से अधिक बच्चों को मुफ्त निदान और दंत चिकित्सा जांच प्रदान की गई; 800 मुफ्त विटामिन किट वितरित किए गए।",
    pastEvent1Contrib: "12 पंजीकृत डॉक्टरों ने स्वेच्छा से काम किया; ₹2,50,000 मूल्य की मुफ्त दवाएं वितरित की गईं।",
    
    pastEvent2Title: "महा शीतकालीन कंबल और सहायता अभियान",
    pastEvent2Guest: "श्रीमती मीनाक्षी लेखी (सामाजिक कार्यकर्ता)",
    pastEvent2Donors: "रिलायंस फाउंडेशन, दिल्ली सिटीजन फोरम",
    pastEvent2Goals: "तीव्र शीत लहर के दौरान 2,500 उच्च गुणवत्ता वाले थर्मल कंबल और 1,000 गर्म बच्चों के जैकेट वितरित किए गए।",
    pastEvent2Contrib: "50+ युवा स्वयंसेवकों ने रसद का समन्वय किया; सार्वजनिक क्राउडफंडिंग के माध्यम से ₹4,80,000 जुटाए गए।",

    pastEvent3Title: "प्रोजेक्ट शिक्षा कंप्यूटर लैब का शुभारंभ",
    pastEvent3Guest: "श्री राजीव चंद्रशेखर (पूर्व आईटी राज्य मंत्री)",
    pastEvent3Donors: "एचसीएल फाउंडेशन, इंटेल स्वयंसेवक",
    pastEvent3Goals: "स्थानीय मलिन बस्तियों के युवाओं के लिए कंप्यूटिंग पहुंच और इंटरनेट क्षमता वाले 15 स्मार्ट वर्कस्टेशन स्थापित किए गए।",
    pastEvent3Contrib: "एचसीएल ने नवीनीकृत सिस्टम दान किए; तकनीकी विशेषज्ञों द्वारा 3 डिजिटल साक्षरता मॉड्यूल डिजाइन किए गए।"
  }
};

export default function Events() {
  const navigate = useNavigate();
  const [registeredEvents, setRegisteredEvents] = useState({});
  const { lang } = useLanguageTheme();
  const t = translationDict[lang];

  const staticEvents = [
    {
      id: 'cloth-drive',
      title: t.event1Title,
      date: t.event1Date,
      time: t.event1Time,
      location: t.event1Location,
      desc: t.event1Desc,
      type: t.event1Type,
      rawType: 'drive',
      image: '/winter-camp.jpg'
    },
    {
      id: 'health-camp',
      title: t.event2Title,
      date: t.event2Date,
      time: t.event2Time,
      location: t.event2Location,
      desc: t.event2Desc,
      type: t.event2Type,
      rawType: 'medical',
      image: '/medical-camp.jpg'
    },
    {
      id: 'career-fair',
      title: t.event3Title,
      date: t.event3Date,
      time: t.event3Time,
      location: t.event3Location,
      desc: t.event3Desc,
      type: t.event3Type,
      rawType: 'skill',
      image: '/career-fair.jpg'
    }
  ];

  const [events, setEvents] = useState(staticEvents);

  useEffect(() => {
    const key = 'naye_pankh_event_registrations';
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    const registeredMap = {};
    saved.forEach(reg => {
      registeredMap[reg.eventId] = true;
    });
    setRegisteredEvents(registeredMap);

    let unsubscribeFirestore = null;

    const loadEvents = (dbList = []) => {
      const savedEvents = JSON.parse(localStorage.getItem('naye_pankh_events') || '[]');
      const combined = [...staticEvents];
      
      const addEventUnique = (item) => {
        if (!combined.some(e => e.id === item.id || e.title.toLowerCase() === item.title.toLowerCase())) {
          combined.push({
            id: item.id,
            title: item.title,
            date: item.date,
            time: item.time || '10:00 AM - 4:00 PM',
            location: item.location,
            desc: item.desc || 'Join our campaign to support the community.',
            type: item.type || 'drive',
            rawType: item.rawType || 'drive',
            image: item.image || '/winter-camp.jpg'
          });
        }
      };

      dbList.forEach(addEventUnique);
      savedEvents.forEach(addEventUnique);
      setEvents(combined);
    };

    if (isConfigured) {
      try {
        unsubscribeFirestore = onSnapshot(collection(db, 'events'), (snap) => {
          const dbList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          loadEvents(dbList);
        }, (error) => {
          console.error("Error listening to events in real-time:", error);
          loadEvents([]);
        });
      } catch (err) {
        console.error("Error setting up real-time event listener:", err);
        loadEvents([]);
      }
    } else {
      loadEvents([]);
    }

    const handleStorageChange = (e) => {
      if (e.key === 'naye_pankh_events') {
        loadEvents([]);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handleLocalUpdate = () => {
      loadEvents([]);
    };
    window.addEventListener('naye_pankh_local_events_update', handleLocalUpdate);

    return () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('naye_pankh_local_events_update', handleLocalUpdate);
    };
  }, [lang]);

  const handleRegister = (id) => {
    navigate(`/events/register/${id}`);
  };

  const pastEvents = [
    {
      id: 'past-1',
      title: t.pastEvent1Title,
      date: 'May 10, 2026',
      time: '10:00 AM - 5:00 PM',
      location: 'Government School Ground, Kanpur, UP',
      guest: () => t.pastEvent1Guest,
      donors: () => t.pastEvent1Donors,
      goals: () => t.pastEvent1Goals,
      contributions: () => t.pastEvent1Contrib,
      image: '/medical-camp.jpg'
    },
    {
      id: 'past-2',
      title: t.pastEvent2Title,
      date: 'January 15, 2026',
      time: '08:00 AM - 6:00 PM',
      location: 'Rain Basera Shelter Clusters, Delhi NCR',
      guest: () => t.pastEvent2Guest,
      donors: () => t.pastEvent2Donors,
      goals: () => t.pastEvent2Goals,
      contributions: () => t.pastEvent2Contrib,
      image: '/winter-camp.jpg'
    },
    {
      id: 'past-3',
      title: t.pastEvent3Title,
      date: 'November 14, 2025',
      time: '11:00 AM - 2:00 PM',
      location: 'NayePankh Learning Center, Noida',
      guest: () => t.pastEvent3Guest,
      donors: () => t.pastEvent3Donors,
      goals: () => t.pastEvent3Goals,
      contributions: () => t.pastEvent3Contrib,
      image: '/career-fair.jpg'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-70 md:py-82 overflow-hidden bg-cover bg-[center_20%] bg-no-repeat border-b border-slate-200 dark:border-slate-800 pt-36 md:pt-44"
        style={{ backgroundImage: "url('/events-bg.jpg')" }}
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
              {t.getInvolved}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-[#132a13] dark:text-[#a3b899] drop-shadow-sm">
            {t.upcomingEvents}
          </h1>
          <p className="text-slate-800 dark:text-slate-205 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-bold">
            {t.bannerDesc}
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {events.map((event) => {
              const isRegistered = !!registeredEvents[event.id];
              return (
                <div key={event.id} className="bg-slate-50 dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {event.image && (
                      <div className="w-full sm:w-64 h-80 sm:h-80 shrink-0 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5 transition-all duration-300 hover:shadow-xl hover:border-slate-350 dark:hover:border-slate-500 group">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.05]" 
                        />
                      </div>
                    )}
                    <div className="space-y-4 flex-grow">
                      <span className={`inline-flex items-center text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                        event.rawType === 'drive'
                          ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-500 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30'
                          : event.rawType === 'medical'
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                            : 'bg-purple-50 dark:bg-purple-950/20 text-purple-500 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30'
                      }`}>
                        {event.type}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">{event.title}</h3>
                      <p className="text-slate-550 dark:text-slate-300 text-sm leading-relaxed">{event.desc}</p>
                      
                      <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-primary-500 shrink-0" />
                          <span>{event.date} ({event.time})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRegister(event.id)}
                    className={`w-full md:w-auto shrink-0 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                      isRegistered
                        ? 'bg-emerald-500 text-white shadow flex items-center justify-center space-x-1.5'
                        : 'bg-slate-950 dark:bg-slate-100 hover:bg-slate-850 dark:hover:bg-slate-200 text-white dark:text-slate-900 hover:shadow'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>{t.registered}</span>
                      </>
                    ) : (
                      t.registerBtn
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Previous Events Held Section */}
      <section className="py-24 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600 bg-primary-50 dark:bg-primary-950/20 px-3.5 py-1.5 rounded-full border border-primary-100 dark:border-primary-900/35">
              Archive & Legacy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white">
              {t.pastEventsTitle}
            </h2>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
              {t.pastEventsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pastEvents.map((evt) => (
              <div 
                key={evt.id} 
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/85 dark:border-slate-800 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    <span className="absolute bottom-4 left-4 bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      Completed
                    </span>
                  </div>

                  <div className="p-6 space-y-4 text-left">
                    <h3 className="font-bold text-lg font-display text-slate-900 dark:text-white leading-tight">
                      {evt.title}
                    </h3>
                    
                    <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <p className="flex items-center space-x-1.5">
                        <Calendar className="h-4 w-4 text-primary-500 shrink-0" />
                        <span>{evt.date} ({evt.time})</span>
                      </p>
                      <p className="flex items-start space-x-1.5">
                        <MapPin className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{evt.location}</span>
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-850 dark:text-slate-200 block uppercase tracking-wider text-[9px] mb-0.5">{t.chiefGuest}</span>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">{evt.guest()}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-850 dark:text-slate-200 block uppercase tracking-wider text-[9px] mb-0.5">{t.vipDonors}</span>
                        <p className="text-slate-600 dark:text-slate-400 font-medium">{evt.donors()}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-850 dark:text-slate-200 block uppercase tracking-wider text-[9px] mb-0.5">{t.goalsAchieved}</span>
                        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{evt.goals()}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-850 dark:text-slate-200 block uppercase tracking-wider text-[9px] mb-0.5">{t.keyContributions}</span>
                        <p className="text-slate-550 dark:text-slate-400 font-medium leading-relaxed italic">{evt.contributions()}</p>
                      </div>
                    </div>
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
