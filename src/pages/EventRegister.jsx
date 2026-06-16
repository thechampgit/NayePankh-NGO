import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, User, Mail, Phone, MessageSquare, CheckCircle2, ArrowLeft, Loader2, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db, isConfigured } from '../firebase/config';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguageTheme } from '../context/LanguageThemeContext';

const translationDict = {
  en: {
    backToEvents: "Back to Events",
    registerTitle: "Register",
    attendeeInfo: "Attendee Information",
    formInstructions: "Please fill in your details to secure a slot. If you are registered as a volunteer, please use the same email address.",
    fullName: "Full Name",
    emailAddr: "Email Address",
    phoneNum: "Phone Number",
    specialNotes: "Special Notes / Dietary / Transport requirements (Optional)",
    notesPlaceholder: "Let us know if you need pick-up assistance or have other questions...",
    btnSubmitting: "Submitting Registration...",
    btnSubmit: "Confirm Event Registration",
    regConfirmed: "Registration Confirmed!",
    thankYou: "Thank you",
    receivedMsg: "Your registration has been successfully received. We will contact you with coordination details.",
    loadingDetails: "Loading event details...",
    eventNotFound: "Event Not Found",
    eventNotFoundDesc: "The event you are trying to register for does not exist or has been removed.",
    notFoundBtn: "Back to Events",
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
    event3Type: "skill"
  },
  hi: {
    backToEvents: "कार्यक्रमों पर वापस जाएं",
    registerTitle: "पंजीकरण",
    attendeeInfo: "प्रतिभागी की जानकारी",
    formInstructions: "स्थान सुरक्षित करने के लिए कृपया अपना विवरण भरें। यदि आप एक स्वयंसेवक के रूप में पंजीकृत हैं, तो कृपया उसी ईमेल पते का उपयोग करें।",
    fullName: "पूरा नाम",
    emailAddr: "ईमेल पता",
    phoneNum: "फ़ोन नंबर",
    specialNotes: "विशेष नोट्स / आहार / परिवहन आवश्यकताएं (वैकल्पिक)",
    notesPlaceholder: "हमें बताएं कि क्या आपको पिक-अप सहायता की आवश्यकता है या कोई अन्य प्रश्न हैं...",
    btnSubmitting: "पंजीकरण जमा किया जा रहा है...",
    btnSubmit: "पंजीकरण की पुष्टि करें",
    regConfirmed: "पंजीकरण की पुष्टि हो गई!",
    thankYou: "धन्यवाद",
    receivedMsg: "आपका पंजीकरण सफलतापूर्वक प्राप्त हो गया है। हम समन्वय विवरण के साथ आपसे संपर्क करेंगे।",
    loadingDetails: "घटना का विवरण लोड हो रहा है...",
    eventNotFound: "घटना नहीं मिली",
    eventNotFoundDesc: "जिस घटना के लिए आप पंजीकरण करने का प्रयास कर रहे हैं वह मौजूद नहीं है या हटा दी गई है।",
    notFoundBtn: "कार्यक्रमों पर वापस जाएं",
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
    event3Type: "कौशल मेला"
  }
};




export default function EventRegister() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const { lang, isDarkMode } = useLanguageTheme();
  const t = translationDict[lang];

  const staticEvents = [
    {
      id: 'cloth-drive',
      title: t.event1Title,
      date: t.event1Date,
      time: t.event1Time,
      location: t.event1Location,
      desc: t.event1Desc,
      type: t.event1Type
    },
    {
      id: 'health-camp',
      title: t.event2Title,
      date: t.event2Date,
      time: t.event2Time,
      location: t.event2Location,
      desc: t.event2Desc,
      type: t.event2Type
    },
    {
      id: 'career-fair',
      title: t.event3Title,
      date: t.event3Date,
      time: t.event3Time,
      location: t.event3Location,
      desc: t.event3Desc,
      type: t.event3Type
    }
  ];

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    notes: ''
  });

  // 1. Fetch Event Details
  useEffect(() => {
    async function fetchEvent() {
      setLoadingEvent(true);
      
      // Try finding in static events first
      const foundStatic = staticEvents.find(e => e.id === eventId);
      if (foundStatic) {
        setEvent(foundStatic);
        setLoadingEvent(false);
        return;
      }

      // Try finding in local storage next
      const savedEvents = JSON.parse(localStorage.getItem('naye_pankh_events') || '[]');
      const foundLocal = savedEvents.find(e => e.id === eventId);
      if (foundLocal) {
        setEvent({
          ...foundLocal,
          image: foundLocal.image || '/winter-camp.jpg'
        });
        setLoadingEvent(false);
        return;
      }

      // If not in static/local and database is configured, try fetching from Firestore
      if (isConfigured) {
        try {
          const docRef = doc(db, 'events', eventId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setEvent({
              id: docSnap.id,
              title: data.title,
              date: data.date,
              time: data.time || 'TBD',
              location: data.location,
              desc: data.desc || 'No description provided.',
              type: data.type || 'general',
              image: data.image || '/winter-camp.jpg'
            });
          } else {
            console.warn(`Event ${eventId} not found in Firestore.`);
          }
        } catch (error) {
          console.error("Error fetching event from Firestore:", error);
        }
      }
      
      setLoadingEvent(false);
    }
    fetchEvent();
  }, [eventId, lang]);

  // Update form if user details become available later
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    setSubmitting(true);

    if (isConfigured) {
      try {
        await addDoc(collection(db, 'eventRegistrations'), {
          eventId: eventId,
          eventTitle: event?.title || 'Unknown Event',
          userId: user?.uid || 'guest',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes,
          timestamp: serverTimestamp()
        });
        setSubmitted(true);
      } catch (error) {
        console.error("Error saving event registration to Firestore:", error);
        // Save to local storage mock fallback in case of Firestore error
        saveToLocalStorageFallback();
        setSubmitted(true);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Mock mode
      setTimeout(() => {
        saveToLocalStorageFallback();
        setSubmitted(true);
        setSubmitting(false);
      }, 1000);
    }
  };

  const saveToLocalStorageFallback = () => {
    const key = 'naye_pankh_event_registrations';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({
      eventId,
      eventTitle: event?.title || 'Unknown Event',
      userId: user?.uid || 'guest',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      notes: formData.notes,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(key, JSON.stringify(existing));
  };

  if (loadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 mx-auto" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t.loadingDetails}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-24">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div className="text-red-500 text-5xl font-black">404</div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Event Not Found</h2>
          <p className="text-slate-500 text-sm">
            The event you are trying to register for does not exist or has been removed.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 bg-slate-950 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-850 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.backToEvents}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Banner Header */}
      <section className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 py-70 relative overflow-hidden pt-36 md:pt-44">
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-emerald-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white text-sm font-bold mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Events</span>
          </Link>
          <div className="space-y-4">
            <span className={`inline-flex items-center text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full ${
              event.type === 'drive'
                ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-500 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30'
                : event.type === 'medical'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
                  : 'bg-purple-50 dark:bg-purple-950/20 text-purple-500 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30'
            }`}>
              {event.type}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-slate-955 dark:text-white">
              {t.registerTitle}: {event.title}
            </h1>
            <p className="text-slate-600 text-base max-w-3xl leading-relaxed">
              {event.desc}
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm font-semibold text-slate-600 dark:text-slate-400 pt-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary-500 shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary-500 shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary-500 shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Registration Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-slate-50 dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg text-slate-800 dark:text-slate-100">
            
            {submitted ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-900/30">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white font-display">{t.regConfirmed}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-base max-w-md mx-auto leading-relaxed">
                  {t.thankYou}, <strong className="text-slate-900 dark:text-white">{formData.name}</strong>. {t.receivedMsg} <strong className="text-slate-900 dark:text-white">{formData.email}</strong>.
                </p>
                <div className="flex justify-center space-x-4 pt-4">
                  <Link
                    to="/events"
                    className="px-6 py-3 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-slate-850 transition-colors shadow"
                  >
                    {t.notFoundBtn}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {event.image && (
                  <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 mb-6">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{t.attendeeInfo}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  {t.formInstructions}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.fullName}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-slate-400">
                        <User className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-800 dark:text-slate-100"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.emailAddr}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-slate-400">
                        <Mail className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-800 dark:text-slate-100"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.phoneNum}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400">
                      <Phone className="h-4.5 w-4.5" />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-800 dark:text-slate-100"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.specialNotes}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400">
                      <MessageSquare className="h-4.5 w-4.5" />
                    </span>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="4"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-800 dark:text-slate-100"
                      placeholder={t.notesPlaceholder}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-base shadow transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{t.btnSubmitting}</span>
                    </>
                  ) : (
                    <span>{t.btnSubmit}</span>
                  )}
                </button>
              </form>
            )}
            
          </div>
        </div>
      </section>
    </div>
  );
}
