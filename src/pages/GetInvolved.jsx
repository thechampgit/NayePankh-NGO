import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Users, 
  Award, 
  ShieldAlert, 
  CheckCircle2, 
  Briefcase, 
  Calendar,
  User,
  Phone,
  Download,
  History,
  X,
  ArrowRight,
  Heart,
  Trophy,
  Shield,
  Lock
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db, isConfigured } from '../firebase/config';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { sendAdminNotification } from '../services/notifications';
import { useLanguageTheme } from '../context/LanguageThemeContext';

const translationDict = {
  en: {
    joinMovement: "Join the Movement",
    getInvolved: "Get Involved",
    bannerDesc: "Gain meaningful leadership experience, build relationships, and directly serve communities in need.",
    volName: "Volunteer",
    volDesc: "Become a volunteer",
    intName: "Internships",
    intDesc: "Certified social internship",
    partnerName: "Be Our Partner",
    partnerDesc: "Corporate/institutional link",
    workName: "Work With Us",
    workDesc: "Professional non-profit career",
    volPortal: "Volunteer Portal",
    volPortalDesc: "Manage your active projects, timeline history, and download service certifications.",
    volDetails: "Volunteer Details",
    pendingReview: "Pending Review",
    approvedVolunteer: "Approved Volunteer",
    skillsSelected: "Selected Skills",
    interestsSelected: "Selected Interests",
    noSkillsYet: "No skills selected yet. Click Edit Profile below.",
    noInterestsYet: "No interests selected yet. Click Edit Profile below.",
    editProfileBtn: "Edit Skills & Interests",
    historyTitle: "Volunteer Activity History",
    historyCompleted: "Completed Projects",
    hoursLogged: "Hours Logged",
    certMilestones: "Milestone Rewards",
    certTitle: "Experience Certificate",
    issuedDate: "Issued Date",
    certId: "Certificate ID",
    founderPresident: "Founder President",
    nationalCoordinator: "National Coordinator",
    loadingVolunteerData: "Loading volunteer data...",
    whyVol: "Why Volunteer with Us?",
    whyInt: "Why Intern with Us?",
    partnerWithNaye: "Partner with NayePankh",
    careersWork: "Careers / Work with Us",
    proposalTitle: "Partnership Proposal",
    appTitle: "Application",
    fullName: "Full Name",
    emailAddr: "Email Address",
    phoneNum: "Phone Number",
    city: "City",
    prefProg: "Preferred Program",
    selectSkills: "Select Your Skills (Choose all that apply)",
    selectInterests: "Select Your Interests (Choose all that apply)",
    otherSkillsPh: "Please specify your other skills...",
    otherInterestsPh: "Please specify your other interests...",
    btnSubmitApp: "Submit Application",
    btnSubmitting: "Submitting...",
    appSubmitted: "Application Submitted!",
    submitAnother: "{t.submitAnother}",
    // New translations
    phoneEmail: "Phone & Email",
    cityLoc: "City Location",
    coreProgWing: "Core Program Wing",
    cancelBtn: "{t.cancelBtn}",
    saveChangesBtn: "Save Changes",
    savingBtn: "Saving...",
    completedHours: "Completed Hours",
    certUnlockedMsg: "Service certificate is unlocked and ready for download!",
    approveToUnlockMsg: "Approve application via Demo Controls to unlock download.",
    completeMoreHoursMsg1: "Complete ",
    completeMoreHoursMsg2: " more hours of active service setup to unlock your official signed certificate.",
    downloadCertBtn: "Download Service Certificate",
    impactAchievements: "Impact Achievements",
    earnedText: "Earned",
    progressText: "Progress",
    unlockedText: "Unlocked",
    registeredEventsTitle: "Registered Events",
    upcomingText: "Upcoming",
    noEventsMsg: "You have not registered for any upcoming charity campaigns yet.",
    browseEventsBtn: "Browse Events",
    activeSlotsText: "Active Slots",
    regAnotherEventBtn: "Register for another event",
    eventCertsTitle: "Event Certificates",
    noEventCertsMsg: "{t.noEventCertsMsg}",
    downloadPdfBtn: "Download PDF",
    partnerNotes: "Proposal & Partnership Notes",
    suitabilityNotes: "Tell us about your suitability",
    whyJoinNotes: "Why do you want to join us?",
    messagePlaceholder: "Share some details or your message with us...",
    faqTitle: "{t.faqTitle}",
    internshipTrack: "Internship Track",
    duration: "Duration",
    orgNameLabel: "Organization Name",
    contactPersonLabel: "Contact Person Name",
    partnerTypeLabel: "Partnership Type",
    positionApplied: "Position Applied For",
    expectedCtcLabel: "Expected CTC (INR, Optional)",
    volunteerPortalHeader: "Volunteer Portal",
    volunteerPortalDescText: "Manage your active projects, timeline history, and download service certifications.",
    attendeeInfoText: "Attendee Information"
  },
  hi: {
    joinMovement: "आंदोलन में शामिल हों",
    getInvolved: "शामिल हों",
    bannerDesc: "सार्थक नेतृत्व का अनुभव प्राप्त करें, संबंध बनाएं और सीधे जरूरतमंद समुदायों की सेवा करें।",
    volName: "स्वयंसेवक",
    volDesc: "स्वयंसेवक बनें",
    intName: "इंटर्नशिप",
    intDesc: "प्रमाणित सामाजिक इंटर्नशिप",
    partnerName: "हमारे भागीदार बनें",
    partnerDesc: "कॉर्पोरेट/संस्थागत लिंक",
    workName: "हमारे साथ काम करें",
    workDesc: "व्यावसायिक गैर-लाभकारी करियर",
    volPortal: "स्वयंसेवक पोर्टल",
    volPortalDesc: "अपनी सक्रिय परियोजनाओं, समयरेखा इतिहास को प्रबंधित करें और सेवा प्रमाणपत्र डाउनलोड करें।",
    volDetails: "स्वयंसेवक विवरण",
    pendingReview: "समीक्षा लंबित",
    approvedVolunteer: "स्वीकृत स्वयंसेवक",
    skillsSelected: "चयनित कौशल",
    interestsSelected: "चयनित रुचियां",
    noSkillsYet: "अभी तक कोई कौशल नहीं चुना गया है। नीचे प्रोफ़ाइल संपादित करें पर क्लिक करें।",
    noInterestsYet: "अभी तक कोई रुचियां नहीं चुनी गई हैं। नीचे प्रोफ़ाइल संपादित करें पर क्लिक करें।",
    editProfileBtn: "कौशल और रुचियां संपादित करें",
    historyTitle: "स्वयंसेवक गतिविधि इतिहास",
    historyCompleted: "पूर्ण परियोजनाएं",
    hoursLogged: "घंटे दर्ज किए गए",
    certMilestones: "मील का पत्थर पुरस्कार",
    certTitle: "अनुभव प्रमाण पत्र",
    issuedDate: "जारी करने की तिथि",
    certId: "प्रमाणपत्र आईडी",
    founderPresident: "संस्थापक अध्यक्ष",
    nationalCoordinator: "राष्ट्रीय समन्वयक",
    loadingVolunteerData: "स्वयंसेवक डेटा लोड हो रहा है...",
    whyVol: "हमारे साथ स्वयंसेवा क्यों करें?",
    whyInt: "हमारे साथ इंटर्नशिप क्यों करें?",
    partnerWithNaye: "नयेपंख के साथ साझेदारी करें",
    careersWork: "करियर / हमारे साथ काम करें",
    proposalTitle: "साझेदारी प्रस्ताव",
    appTitle: "आवेदन",
    fullName: "पूरा नाम",
    emailAddr: "ईमेल पता",
    phoneNum: "फ़ोन नंबर",
    city: "शहर",
    prefProg: "पसंदीदा कार्यक्रम",
    selectSkills: "अपने कौशल का चयन करें (लागू होने वाले सभी चुनें)",
    selectInterests: "अपनी रुचियों का चयन करें (लागू होने वाले सभी चुनें)",
    otherSkillsPh: "कृपया अपने अन्य कौशलों को निर्दिष्ट करें...",
    otherInterestsPh: "कृपया अपनी अन्य रुचियों को निर्दिष्ट करें...",
    btnSubmitApp: "आवेदन जमा करें",
    btnSubmitting: "जमा किया जा रहा है...",
    appSubmitted: "आवेदन जमा हो गया!",
    submitAnother: "दूसरा आवेदन जमा करें",
    // New translations
    phoneEmail: "फ़ोन और ईमेल",
    cityLoc: "शहर का स्थान",
    coreProgWing: "मुख्य कार्यक्रम विंग",
    cancelBtn: "रद्द करें",
    saveChangesBtn: "बदलाव सहेजें",
    savingBtn: "सहेजा जा रहा है...",
    completedHours: "पूर्ण किए गए घंटे",
    certUnlockedMsg: "सेवा प्रमाणपत्र अनलॉक है और डाउनलोड के लिए तैयार है!",
    approveToUnlockMsg: "डाउनलोड अनलॉक करने के लिए डेमो नियंत्रण के माध्यम से आवेदन स्वीकृत करें।",
    completeMoreHoursMsg1: "आधिकारिक हस्ताक्षरित प्रमाण पत्र अनलॉक करने के लिए ",
    completeMoreHoursMsg2: " और सक्रिय सेवा घंटे पूर्ण करें।",
    downloadCertBtn: "सेवा प्रमाणपत्र डाउनलोड करें",
    impactAchievements: "प्रभाव उपलब्धियां",
    earnedText: "अर्जित",
    progressText: "प्रगति",
    unlockedText: "अनलॉक किया गया",
    registeredEventsTitle: "पंजीकृत कार्यक्रम",
    upcomingText: "आगामी",
    noEventsMsg: "आपने अभी तक किसी भी आगामी चैरिटी अभियान के लिए पंजीकरण नहीं कराया है।",
    browseEventsBtn: "कार्यक्रमों को ब्राउज़ करें",
    activeSlotsText: "सक्रिय स्लॉट",
    regAnotherEventBtn: "दूसरे कार्यक्रम के लिए पंजीकरण करें",
    eventCertsTitle: "कार्यक्रम प्रमाण पत्र",
    noEventCertsMsg: "अभी तक कोई कार्यक्रम प्रमाणपत्र अर्जित नहीं किया गया है। एक बार जब आप किसी कार्यक्रम में भाग लेते हैं और व्यवस्थापक द्वारा चिह्नित हो जाते हैं, तो आपका प्रमाणपत्र यहाँ दिखाई देगा।",
    downloadPdfBtn: "पीडीएफ डाउनलोड करें",
    partnerNotes: "प्रस्ताव और साझेदारी नोट्स",
    suitabilityNotes: "अपनी उपयुक्तता के बारे में बताएं",
    whyJoinNotes: "आप हमसे क्यों जुड़ना चाहते हैं?",
    messagePlaceholder: "हमारे साथ कुछ विवरण या अपना संदेश साझा करें...",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    internshipTrack: "इंटर्नशिप ट्रैक",
    duration: "अवधि",
    orgNameLabel: "संगठन का नाम",
    contactPersonLabel: "संपर्क व्यक्ति का नाम",
    partnerTypeLabel: "साझेदारी का प्रकार",
    positionApplied: "पद जिसके लिए आवेदन किया गया",
    expectedCtcLabel: "अपेक्षित सीटीसी (INR, वैकल्पिक)",
    volunteerPortalHeader: "स्वयंसेवक पोर्टल",
    volunteerPortalDescText: "अपनी सक्रिय परियोजनाओं, समयरेखा इतिहास को प्रबंधित करें और सेवा प्रमाणपत्र डाउनलोड करें।",
    attendeeInfoText: "प्रतिभागी की जानकारी"
  }
};

const AVAILABLE_SKILLS = [
  'Teaching & Tutoring',
  'Content Writing & Blogging',
  'Social Media Marketing',
  'Healthcare & Medical Support',
  'Graphic Design & Media',
  'Event Logistics & Operations',
  'Fundraising & Outreach',
  'Others'
];

const AVAILABLE_INTERESTS = [
  'Child Education (Project Shiksha)',
  'Rural Healthcare (Project Swasthya)',
  'Women Livelihoods (Project Swabalamban)',
  'Environment & Tree Plantation',
  'Food & Clothes Distribution Drives',
  'Others'
];

const MOCK_PAST_ACTIVITIES_1 = [
  { id: 'act-1', eventTitle: 'Swabalamban Tailoring Workshop Setup', date: 'March 12, 2026', hours: 8, program: 'Project Swabalamban' },
  { id: 'act-2', eventTitle: 'Project Shiksha School Kit Distribution', date: 'April 18, 2026', hours: 6, program: 'Project Shiksha' }
];

const MOCK_PAST_ACTIVITIES_2 = [
  { id: 'act-1', eventTitle: 'Swabalamban Tailoring Workshop Setup', date: 'March 12, 2026', hours: 8, program: 'Project Swabalamban' },
  { id: 'act-2', eventTitle: 'Project Shiksha School Kit Distribution', date: 'April 18, 2026', hours: 6, program: 'Project Shiksha' },
  { id: 'act-3', eventTitle: 'Chhalera Village General Screening Camp', date: 'May 10, 2026', hours: 8, program: 'Project Swasthya' },
  { id: 'act-4', eventTitle: 'Weekend Slum Mentoring Session', date: 'June 01, 2026', hours: 10, program: 'Project Shiksha' }
];


export default function GetInvolved() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'volunteer';
  const { lang, isDarkMode } = useLanguageTheme();
  const t = translationDict[lang];

  const sigImage = localStorage.getItem('naye_pankh_signature') || '';
  const stampImage = localStorage.getItem('naye_pankh_stamp') || '';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    city: '',
    program: 'shiksha',
    skills: [],
    interests: [],
    otherSkills: '',
    otherInterests: '',
    internshipTrack: 'management',
    duration: '1-month',
    orgName: '',
    partnerType: 'csr',
    otherPartnerType: '',
    position: 'operations',
    otherPosition: '',
    expectedCtc: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [volunteerApp, setVolunteerApp] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [userRegistrations, setUserRegistrations] = useState([]);
  
  // Developer demo variables
  const [demoHourMode, setDemoHourMode] = useState(() => localStorage.getItem('naye_pankh_demo_hours') || '32'); // '32' or '14'
  const [demoStatusMode, setDemoStatusMode] = useState(() => localStorage.getItem('naye_pankh_demo_status') || 'pending'); // 'approved' or 'pending'
  const [demoHasDonated, setDemoHasDonated] = useState(() => localStorage.getItem('naye_pankh_demo_donated') === 'true');
  
  const [dbDonationCount, setDbDonationCount] = useState(0);
  const [localDonationCount, setLocalDonationCount] = useState(0);

  // Editing state for skills/interests on dashboard
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [eventCertificates, setEventCertificates] = useState([]);
  const [activeBadgeDetails, setActiveBadgeDetails] = useState(null);
  const [unlockedToast, setUnlockedToast] = useState(null);
  const [copyToast, setCopyToast] = useState(false);
  
  const hasDonatedInit = dbDonationCount > 0 || localDonationCount > 0 || demoHasDonated;
  const totalCompletedHoursInit = (demoHourMode === '32' ? MOCK_PAST_ACTIVITIES_2 : MOCK_PAST_ACTIVITIES_1).reduce((sum, act) => sum + act.hours, 0);
  const isApprovedInit = (volunteerApp?.status || demoStatusMode) === 'approved';
  const prevBadgesRef = useRef({
    firstDonation: hasDonatedInit,
    superVolunteer: totalCompletedHoursInit >= 30 && isApprovedInit,
    eventChampion: (demoHourMode === '32' ? MOCK_PAST_ACTIVITIES_2 : MOCK_PAST_ACTIVITIES_1).length >= 3 && isApprovedInit,
    communityHero: hasDonatedInit && totalCompletedHoursInit >= 30 && isApprovedInit
  });

  useEffect(() => {
    if (user) {
      if (isConfigured) {
        getDocs(query(collection(db, 'donations'), where('userId', '==', user.uid)))
          .then(snap => {
            setDbDonationCount(snap.size);
          })
          .catch(err => console.error("Error reading donations count:", err));
      }
      const localDonations = JSON.parse(localStorage.getItem('naye_pankh_donations') || '[]');
      const userDons = localDonations.filter(don => don.email === user.email || don.userId === user.uid);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalDonationCount(userDons.length);
    }
  }, [user]);

  const setActiveTab = (tabId) => {
    setSearchParams({ tab: tabId });
    setSubmitted(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Sync auth details to form
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

  // Fetch Volunteer Application and Event Registrations on Mount/User change
  useEffect(() => {
    async function checkVolunteerStatus() {
      if (!user) {
        setDbLoading(false);
        return;
      }
      
      let foundApp = null;
      
      if (isConfigured) {
        try {
          const q = query(
            collection(db, 'volunteers'),
            where('userId', '==', user.uid)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            foundApp = { id: docSnap.id, ...docSnap.data() };
          }
        } catch (error) {
          console.error("Error checking volunteer status in Firestore:", error);
        }
      }
      
      // Check local storage fallback always
      const savedApps = JSON.parse(localStorage.getItem('naye_pankh_volunteers') || '[]');
      const localApp = savedApps.find(app => app.email === user.email || app.userId === user.uid);
      if (localApp) {
        foundApp = foundApp || localApp;
      }
      
      if (foundApp) {
        setVolunteerApp(foundApp);
        setHasApplied(true);
        // Sync skills and interests to form data
        setFormData(prev => ({
          ...prev,
          name: foundApp.name || prev.name,
          email: foundApp.email || prev.email,
          phone: foundApp.phone || prev.phone,
          city: foundApp.city || prev.city,
          program: foundApp.program || prev.program,
          skills: Array.isArray(foundApp.skills) ? foundApp.skills : [],
          interests: Array.isArray(foundApp.interests) ? foundApp.interests : [],
          otherSkills: foundApp.otherSkills || '',
          otherInterests: foundApp.otherInterests || '',
          message: foundApp.message || prev.message
        }));
      }
      setDbLoading(false);
    }
    
    async function fetchRegistrations() {
      if (!user) return;
      
      let list = [];
      if (isConfigured) {
        try {
          const q = query(
            collection(db, 'eventRegistrations'),
            where('email', '==', user.email)
          );
          const querySnapshot = await getDocs(q);
          list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.error("Error fetching registrations:", error);
        }
      }
      
      // Fallback/sync from local storage
      const savedRegs = JSON.parse(localStorage.getItem('naye_pankh_event_registrations') || '[]');
      const localRegs = savedRegs.filter(reg => reg.email === user.email || reg.userId === user.uid);
      
      // Combine lists uniquely
      const combined = [...list];
      localRegs.forEach(lr => {
        if (!combined.some(c => c.eventId === lr.eventId)) {
          combined.push(lr);
        }
      });
      
      setUserRegistrations(combined);
    }
    
    async function fetchCertificates() {
      if (!user) return;
      
      let list = [];
      if (isConfigured) {
        try {
          const q = query(
            collection(db, 'certificates'),
            where('email', '==', user.email)
          );
          const querySnapshot = await getDocs(q);
          list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
          console.error("Error fetching event certificates:", error);
        }
      }
      
      // Fallback/sync from local storage
      const savedCerts = JSON.parse(localStorage.getItem('naye_pankh_certificates') || '[]');
      const localCerts = savedCerts.filter(c => c.email === user.email || c.userId === user.uid);
      
      // Combine lists uniquely
      const combined = [...list];
      localCerts.forEach(lc => {
        if (!combined.some(c => c.certificateId === lc.certificateId)) {
          combined.push(lc);
        }
      });
      
      setEventCertificates(combined);
    }
    
    checkVolunteerStatus();
    fetchRegistrations();
    fetchCertificates();
  }, [user, hasApplied]);

  const hasDonatedVal = dbDonationCount > 0 || localDonationCount > 0 || demoHasDonated;
  const volunteerStatusVal = volunteerApp?.status || demoStatusMode;
  const isApprovedVal = volunteerStatusVal === 'approved';
  const totalCompletedHoursVal = (demoHourMode === '32' ? MOCK_PAST_ACTIVITIES_2 : MOCK_PAST_ACTIVITIES_1).reduce((sum, act) => sum + act.hours, 0);
  const eventCountVal = (demoHourMode === '32' ? MOCK_PAST_ACTIVITIES_2 : MOCK_PAST_ACTIVITIES_1).length;

  useEffect(() => {
    if (!user) return;

    const currentUnlocks = {
      firstDonation: hasDonatedVal,
      superVolunteer: totalCompletedHoursVal >= 30 && isApprovedVal,
      eventChampion: eventCountVal >= 3 && isApprovedVal,
      communityHero: hasDonatedVal && totalCompletedHoursVal >= 30 && isApprovedVal
    };

    const names = {
      firstDonation: 'First Donation',
      superVolunteer: 'Super Volunteer',
      eventChampion: 'Event Champion',
      communityHero: 'Community Hero'
    };

    const descs = {
      firstDonation: 'Sponsored a community drive program.',
      superVolunteer: 'Logged 30+ service hours.',
      eventChampion: 'Participated in 3+ ground campaigns.',
      communityHero: 'Contributed as both donor and volunteer.'
    };

    Object.keys(currentUnlocks).forEach(key => {
      if (currentUnlocks[key] && !prevBadgesRef.current[key]) {
        setUnlockedToast({
          name: names[key],
          desc: descs[key]
        });
        
        setTimeout(() => {
          setUnlockedToast(null);
        }, 4000);
      }
    });

    prevBadgesRef.current = currentUnlocks;
  }, [hasDonatedVal, totalCompletedHoursVal, eventCountVal, isApprovedVal, user]);

  const handleToggleSkill = (skill) => {
    setFormData(prev => {
      const skills = prev.skills || [];
      const newSkills = skills.includes(skill)
        ? skills.filter(s => s !== skill)
        : [...skills, skill];
      return { ...prev, skills: newSkills };
    });
  };

  const handleToggleInterest = (interest) => {
    setFormData(prev => {
      const interests = prev.interests || [];
      const newInterests = interests.includes(interest)
        ? interests.filter(i => i !== interest)
        : [...interests, interest];
      return { ...prev, interests: newInterests };
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const updatedPayload = {
      skills: formData.skills || [],
      interests: formData.interests || [],
      otherSkills: (formData.skills || []).includes('Others') ? formData.otherSkills || '' : '',
      otherInterests: (formData.interests || []).includes('Others') ? formData.otherInterests || '' : '',
      phone: formData.phone,
      city: formData.city
    };
    
    if (isConfigured && volunteerApp?.id && !volunteerApp.id.startsWith('local-')) {
      try {
        const docRef = doc(db, 'volunteers', volunteerApp.id);
        await updateDoc(docRef, updatedPayload);
        setVolunteerApp(prev => ({ ...prev, ...updatedPayload }));
      } catch (error) {
        console.error("Error updating volunteer details in Firestore:", error);
      }
    }
    
    // Update in local storage
    const savedApps = JSON.parse(localStorage.getItem('naye_pankh_volunteers') || '[]');
    const appIndex = savedApps.findIndex(app => app.email === user.email || app.userId === user.uid);
    if (appIndex !== -1) {
      savedApps[appIndex] = { ...savedApps[appIndex], ...updatedPayload };
    } else {
      savedApps.push({
        userId: user.uid,
        name: user.name,
        email: user.email,
        status: demoStatusMode,
        ...updatedPayload
      });
    }
    localStorage.setItem('naye_pankh_volunteers', JSON.stringify(savedApps));
    
    setVolunteerApp(prev => prev ? { ...prev, ...updatedPayload } : {
      userId: user.uid,
      name: user.name,
      email: user.email,
      status: demoStatusMode,
      ...updatedPayload
    });
    
    setSubmitting(false);
    setIsEditingProfile(false);
    alert("Profile updated successfully!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab !== 'partner' && !formData.name) return;
    if (activeTab === 'partner' && !formData.orgName) return;
    if (!formData.email || !formData.phone) return;

    setSubmitting(true);

    const collectionMap = {
      volunteer: 'volunteers',
      internship: 'internships',
      partner: 'partnerships',
      work: 'careers'
    };

    const dbCollection = collectionMap[activeTab] || 'volunteers';

    const payload = {
      userId: user?.uid || 'anonymous',
      name: activeTab === 'partner' ? formData.orgName : formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      message: formData.message,
      status: 'pending',
      timestamp: serverTimestamp ? serverTimestamp() : new Date()
    };

    if (activeTab === 'volunteer') {
      payload.program = formData.program;
      payload.skills = formData.skills || [];
      payload.interests = formData.interests || [];
      payload.otherSkills = (formData.skills || []).includes('Others') ? formData.otherSkills || '' : '';
      payload.otherInterests = (formData.interests || []).includes('Others') ? formData.otherInterests || '' : '';
    } else if (activeTab === 'internship') {
      payload.internshipTrack = formData.internshipTrack;
      payload.duration = formData.duration;
      payload.applicantName = formData.name;
    } else if (activeTab === 'partner') {
      payload.orgName = formData.orgName;
      payload.contactPerson = formData.name;
      payload.partnerType = formData.partnerType === 'other' && formData.otherPartnerType ? `Other: ${formData.otherPartnerType}` : formData.partnerType;
    } else if (activeTab === 'work') {
      payload.position = formData.position === 'other' && formData.otherPosition ? `Other: ${formData.otherPosition}` : formData.position;
      payload.expectedCtc = formData.expectedCtc;
      payload.applicantName = formData.name;
    }

    if (isConfigured) {
      try {
        const docRef = await addDoc(collection(db, dbCollection), payload);
        const newApp = { id: docRef.id, ...payload };
        
        // Also save fallback so status is recognized locally immediately
        const savedApps = JSON.parse(localStorage.getItem('naye_pankh_volunteers') || '[]');
        savedApps.push(newApp);
        localStorage.setItem('naye_pankh_volunteers', JSON.stringify(savedApps));

        if (activeTab === 'volunteer') {
          setVolunteerApp(newApp);
          setHasApplied(true);
        }

        // Trigger admin email notification
        if (['volunteer', 'internship', 'work'].includes(activeTab)) {
          sendAdminNotification(activeTab, payload).catch(err => console.error("Notification failed:", err));
        }

        setSubmitted(true);
      } catch (error) {
        console.error("Firestore Save Error:", error);
        saveToLocalStorageFallback(payload);

        // Trigger admin email notification on fallback
        if (['volunteer', 'internship', 'work'].includes(activeTab)) {
          sendAdminNotification(activeTab, payload).catch(err => console.error("Notification failed:", err));
        }

        setSubmitted(true);
      } finally {
        setSubmitting(false);
      }
    } else {
      setTimeout(() => {
        saveToLocalStorageFallback(payload);

        // Trigger admin email notification on local fallback
        if (['volunteer', 'internship', 'work'].includes(activeTab)) {
          sendAdminNotification(activeTab, payload).catch(err => console.error("Notification failed:", err));
        }

        setSubmitted(true);
        setSubmitting(false);
      }, 1000);
    }
  };

  const saveToLocalStorageFallback = (payload) => {
    const savedApps = JSON.parse(localStorage.getItem('naye_pankh_volunteers') || '[]');
    const newApp = { ...payload, status: 'pending', id: 'local-' + Date.now() };
    savedApps.push(newApp);
    localStorage.setItem('naye_pankh_volunteers', JSON.stringify(savedApps));
    if (activeTab === 'volunteer') {
      setVolunteerApp(newApp);
      setHasApplied(true);
    }
  };

  const tabs = [
    { id: 'volunteer', name: t.volName, icon: Users, desc: t.volDesc },
    { id: 'internship', name: t.intName, icon: Sparkles, desc: t.intDesc },
    { id: 'partner', name: t.partnerName, icon: Award, desc: t.partnerDesc },
    { id: 'work', name: t.workName, icon: Briefcase, desc: t.workDesc }
  ];

  const tabContent = {
    volunteer: {
      title: t.whyVol,
      successMsg: lang === 'en' ? `Thank you for applying to volunteer, ${formData.name}. Our city coordinator will reach out within 48 hours.` : `स्वयंसेवा के लिए आवेदन करने के लिए धन्यवाद, ${formData.name}। हमारे शहर समन्वयक 48 घंटों के भीतर संपर्क करेंगे।`,
      benefits: [
        { title: lang === 'en' ? 'Passionate Network' : 'उत्साही नेटवर्क', desc: lang === 'en' ? 'Collaborate with fellow students and industry professionals sharing similar altruistic goals.' : 'समान परोपकारी लक्ष्यों को साझा करने वाले साथी छात्रों और पेशेवरों के साथ सहयोग करें।' },
        { title: lang === 'en' ? 'Skill Building' : 'कौशल निर्माण', desc: lang === 'en' ? 'Develop management, public speaking, teaching, and operations capabilities.' : 'प्रबंधन, सार्वजनिक बोलना, शिक्षण और संचालन क्षमताओं का विकास करें।' },
        { title: lang === 'en' ? 'Experience Certificates' : 'अनुभव प्रमाण पत्र', desc: lang === 'en' ? 'Active volunteers receive a signed work experience certificate from the NayePankh Foundation after 30 hours.' : 'सक्रिय स्वयंसेवकों को 30 घंटे के बाद नयेपंख फाउंडेशन से हस्ताक्षरित कार्य अनुभव प्रमाण पत्र प्राप्त होता है।' }
      ],
      faqs: [
        { q: lang === 'en' ? 'Is there a minimum time commitment?' : 'क्या कोई न्यूनतम समय प्रतिबद्धता है?', a: lang === 'en' ? 'No, we offer highly flexible options. You can volunteer for 2 hours on weekends, or take on longer remote tasks based on your availability.' : 'नहीं, हम अत्यधिक लचीले विकल्प प्रदान करते हैं। आप सप्ताहांत में 2 घंटे के लिए स्वयंसेवा कर सकते हैं, या अपनी उपलब्धता के आधार पर लंबे समय तक दूरस्थ कार्य कर सकते हैं।' },
        { q: lang === 'en' ? 'Can I volunteer remotely?' : 'क्या मैं दूरस्थ रूप से स्वयंसेवा कर सकता हूँ?', a: lang === 'en' ? 'Yes! We have opportunities in digital content creation, social media management, remote tutoring, and fundraiser coordinator operations.' : 'हाँ! हमारे पास डिजिटल सामग्री निर्माण, सोशल मीडिया प्रबंधन, दूरस्थ ट्यूशन और फंडरेज़र समन्वयक संचालन के अवसर हैं।' }
      ]
    },
    internship: {
      title: t.whyInt,
      successMsg: lang === 'en' ? `Thank you for applying for an internship, ${formData.name}. Our HR team will review your CV and message shortly.` : `इंटर्नशिप के लिए आवेदन करने के लिए धन्यवाद, ${formData.name}। हमारी मानव संसाधन टीम जल्द ही आपके बायोडाटा की समीक्षा करेगी और संदेश भेजेगी।`,
      benefits: [
        { title: lang === 'en' ? 'Structured Mentorship' : 'संरचित मेंटरशिप', desc: lang === 'en' ? 'Work directly under project heads and gain structured mentorship in the NGO sector.' : 'परियोजना प्रमुखों के अधीन सीधे काम करें और एनजीओ क्षेत्र में संरचित मेंटरशिप प्राप्त करें।' },
        { title: lang === 'en' ? 'Internship Certification' : 'इंटर्नशिप प्रमाणन', desc: lang === 'en' ? 'Obtain an official completion certificate and Letter of Recommendation (LOR) for top performance.' : 'उत्कृष्ट प्रदर्शन के लिए एक आधिकारिक पूर्णता प्रमाण पत्र और सिफारिश पत्र (LOR) प्राप्त करें।' },
        { title: lang === 'en' ? 'Social Leadership' : 'सामाजिक नेतृत्व', desc: lang === 'en' ? 'Lead community projects, track local setups, and present impact case reports.' : 'सामुदायिक परियोजनाओं का नेतृत्व करें, स्थानीय सेटअप को ट्रैक करें और प्रभाव केस रिपोर्ट प्रस्तुत करें।' }
      ],
      faqs: [
        { q: lang === 'en' ? 'What is the duration of internships?' : 'इंटर्नशिप की अवधि क्या है?', a: lang === 'en' ? 'We offer flexible tracks of 1 month, 2 months, or 3 months depending on academic requirements.' : 'हम शैक्षणिक आवश्यकताओं के आधार पर 1 महीने, 2 महीने या 3 महीने के लचीले ट्रैक प्रदान करते हैं।' },
        { q: lang === 'en' ? 'Who is eligible to apply?' : 'आवेदन करने के लिए कौन पात्र है?', a: lang === 'en' ? 'College students, school students (15+), and young professionals seeking corporate-social alignment are welcome.' : 'कॉलेज के छात्र, स्कूल के छात्र (15+) और कॉर्पोरेट-सामाजिक संरेखण चाहने वाले युवा पेशेवरों का स्वागत है।' }
      ]
    },
    partner: {
      title: t.partnerWithNaye,
      successMsg: lang === 'en' ? `Thank you for submitting a partnership query. Our partnerships coordinator will reach out to ${formData.email} shortly.` : `साझेदारी प्रश्न प्रस्तुत करने के लिए धन्यवाद। हमारे साझेदारी समन्वयक जल्द ही ${formData.email} पर संपर्क करेंगे।`,
      benefits: [
        { title: lang === 'en' ? 'CSR Compliance Audit' : 'सीएसआर अनुपालन ऑडिट', desc: lang === 'en' ? '100% compliant with Ministry of Corporate Affairs regulations for Corporate Social Responsibility (CSR).' : 'कॉर्पोरेट सामाजिक उत्तरदायित्व (CSR) के लिए कॉर्पोरेट मामलों के मंत्रालय के नियमों का 100% अनुपालन।' },
        { title: lang === 'en' ? 'Scalable Outreach Drive' : 'स्केलेबल आउटरीच अभियान', desc: lang === 'en' ? 'Collaboratively execute health setups, distribution drives, or educational campaigns at scale.' : 'बड़े पैमाने पर स्वास्थ्य सेटअप, वितरण अभियान या शैक्षिक अभियानों को सहयोगी रूप से निष्पादित करें।' },
        { title: lang === 'en' ? 'Direct Geo-Tagged Auditing' : 'प्रत्यक्ष जियो-टैग्ड ऑडिटिंग', desc: lang === 'en' ? 'Get live progress reports, geo-tagged photos, and transparent expense ledgers for all projects.' : 'सभी परियोजनाओं के लिए लाइव प्रगति रिपोर्ट, जियो-टैग की गई तस्वीरें और पारदर्शी व्यय बहीखाता प्राप्त करें।' }
      ],
      faqs: [
        { q: lang === 'en' ? 'Can corporate employees volunteer too?' : 'क्या कॉर्पोरेट कर्मचारी भी स्वयंसेवा कर सकते हैं?', a: lang === 'en' ? 'Yes! We run customized Corporate Employee Engagement programs to align corporate teams with ground campaigns.' : 'हाँ! हम कॉर्पोरेट टीमों को जमीनी अभियानों के साथ संरेखित करने के लिए अनुकूलित कॉर्पोरेट कर्मचारी जुड़ाव कार्यक्रम चलाते हैं।' },
        { q: lang === 'en' ? 'How do you verify donation utilization?' : 'आप दान के उपयोग को कैसे सत्यापित करते हैं?', a: lang === 'en' ? 'We share detailed project-wise accounts, invoice audits, and certified utilization certificates with partners.' : 'हम भागीदारों के साथ विस्तृत परियोजना-वार खाते, चालान ऑडिट और प्रमाणित उपयोग प्रमाण पत्र साझा करते हैं।' }
      ]
    },
    work: {
      title: t.careersWork,
      successMsg: lang === 'en' ? `Thank you for your application, ${formData.name}. Our HR head will review your details and contact you for initial interview rounds.` : `आपके आवेदन के लिए धन्यवाद, ${formData.name}। हमारे मानव संसाधन प्रमुख आपके विवरणों की समीक्षा करेंगे और प्रारंभिक साक्षात्कार दौर के लिए आपसे संपर्क करेंगे।`,
      benefits: [
        { title: lang === 'en' ? 'Ground Operations Leadership' : 'जमीनी संचालन नेतृत्व', desc: lang === 'en' ? 'Lead operations for city chapters, handle budget distributions, and coordinate drives.' : 'शहर के अध्यायों के लिए संचालन का नेतृत्व करें, बजट वितरण संभालें और अभियानों का समन्वय करें।' },
        { title: lang === 'en' ? 'Professional Growth' : 'पेशेवर विकास', desc: lang === 'en' ? 'Advance within a fast-scaling non-profit framework with competitive growth paths.' : 'प्रतिस्पर्धी विकास पथों के साथ तेजी से बढ़ते गैर-लाभकारी ढांचे के भीतर आगे बढ़ें।' },
        { title: lang === 'en' ? 'Dynamic Nationwide Team' : 'गतिशील राष्ट्रव्यापी टीम', desc: lang === 'en' ? 'Collaborate with a highly motivated team of national coordinators across 8+ states.' : '8+ राज्यों में राष्ट्रीय समन्वयकों की एक अत्यधिक प्रेरित टीम के साथ सहयोग करें।' }
      ],
      faqs: [
        { q: lang === 'en' ? 'Are these full-time or part-time roles?' : 'क्या ये पूर्णकालिक या अंशकालिक भूमिकाएँ हैं?', a: lang === 'en' ? 'We offer full-time positions at our Noida and Kanpur offices, as well as part-time city lead positions.' : 'हम अपने नोएडा और कानपुर कार्यालयों में पूर्णकालिक पदों के साथ-साथ अंशकालिक शहर प्रमुख पदों की पेशकश करते हैं।' },
        { q: lang === 'en' ? 'What is the selection process?' : 'चयन प्रक्रिया क्या है?', a: lang === 'en' ? 'Initial profile shortlisting followed by a telephone screen and a final technical/panel interview round.' : 'प्रारंभिक प्रोफ़ाइल शॉर्टलिस्टिंग के बाद एक टेलीफोन स्क्रीन और एक अंतिम तकनीकी/पैनल साक्षात्कार दौर होता है।' }
      ]
    }
  };

  const currentContent = tabContent[activeTab] || tabContent.volunteer;
  const pastActivities = demoHourMode === '32' ? MOCK_PAST_ACTIVITIES_2 : MOCK_PAST_ACTIVITIES_1;
  const completedHoursFromHistory = pastActivities.reduce((sum, act) => sum + act.hours, 0);
  const totalCompletedHours = completedHoursFromHistory;

  const hasDonated = dbDonationCount > 0 || localDonationCount > 0 || demoHasDonated;

  const badges = {
    firstDonation: {
      name: 'First Donation',
      desc: 'Sponsored a community drive program.',
      unlocked: hasDonated
    },
    superVolunteer: {
      name: 'Super Volunteer',
      desc: 'Logged 30+ service hours.',
      unlocked: totalCompletedHours >= 30 && (volunteerApp?.status || demoStatusMode) === 'approved'
    },
    eventChampion: {
      name: 'Event Champion',
      desc: 'Participated in 3+ ground campaigns.',
      unlocked: pastActivities.length >= 3 && (volunteerApp?.status || demoStatusMode) === 'approved'
    },
    communityHero: {
      name: 'Community Hero',
      desc: 'Contributed as both donor and volunteer.',
      unlocked: hasDonated && totalCompletedHours >= 30 && (volunteerApp?.status || demoStatusMode) === 'approved'
    }
  };

  const earnedBadgesCount = Object.values(badges).filter(b => b.unlocked).length;

  const handleOpenBadgeDetails = (key) => {
    const badgeMap = {
      firstDonation: {
        key: 'firstDonation',
        name: 'First Donation',
        requirement: 'Make at least 1 donation contribution to NayePankh.',
        theme: 'rose',
        unlocked: hasDonatedVal,
        progressText: hasDonatedVal ? '1 / 1 Completed' : '0 / 1 Pending',
        progressPct: hasDonatedVal ? '100%' : '0%',
        shareText: 'Proud to support NayePankh Foundation as a certified donor! 💖 Join me in building a brighter future: https://nayepankh.org'
      },
      superVolunteer: {
        key: 'superVolunteer',
        name: 'Super Volunteer',
        requirement: 'Complete 30 or more hours of active service drives.',
        theme: 'amber',
        unlocked: totalCompletedHoursVal >= 30 && isApprovedVal,
        progressText: `${totalCompletedHoursVal} / 30 hrs`,
        progressPct: `${Math.min(100, (totalCompletedHoursVal / 30) * 100)}%`,
        shareText: 'I just reached the Super Volunteer milestone with NayePankh Foundation, logging 30+ service hours! 🌟 Join the team: https://nayepankh.org'
      },
      eventChampion: {
        key: 'eventChampion',
        name: 'Event Champion',
        requirement: 'Participate in 3 or more ground campaign drives.',
        theme: 'emerald',
        unlocked: eventCountVal >= 3 && isApprovedVal,
        progressText: `${eventCountVal} / 3 drives`,
        progressPct: `${Math.min(100, (eventCountVal / 3) * 100)}%`,
        shareText: 'Excited to be recognized as an Event Champion with NayePankh Foundation! 🏆 Helping execute local food, clothes & education campaigns: https://nayepankh.org'
      },
      communityHero: {
        key: 'communityHero',
        name: 'Community Hero',
        requirement: 'Contribute as both an approved volunteer (30+ hours) and a donor.',
        theme: 'indigo',
        unlocked: hasDonatedVal && totalCompletedHoursVal >= 30 && isApprovedVal,
        progressText: `${(hasDonatedVal ? 1 : 0) + (totalCompletedHoursVal >= 30 && isApprovedVal ? 1 : 0)} / 2 Tasks`,
        progressPct: `${((hasDonatedVal ? 1 : 0) + (totalCompletedHoursVal >= 30 && isApprovedVal ? 1 : 0)) * 50}%`,
        shareText: 'Honored to be a certified Community Hero with NayePankh Foundation, supporting both on the ground and financially! 🛡️ Let\'s build a stronger community: https://nayepankh.org'
      }
    };
    setActiveBadgeDetails(badgeMap[key]);
  };

  const customAnimations = (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      .animate-slide-up {
        animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `}} />
  );

  const printStyles = (
    <style dangerouslySetInnerHTML={{ __html: `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #printable-certificate-container, #printable-certificate-container * {
          visibility: visible !important;
        }
        #printable-certificate-container {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 99999 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: white !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
        }
        .no-print {
          display: none !important;
        }
      }
    `}} />
  );

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-200 dark:text-slate-100 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-80 md:py-92 overflow-hidden bg-cover bg-[center_12%] bg-no-repeat border-b border-slate-200 dark:border-slate-800 pt-36 md:pt-44"
        style={{ backgroundImage: "url('/volunteer-bg.jpg')" }}
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
              {t.joinMovement}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-[#132a13] dark:text-[#a3b899] drop-shadow-sm">
            {t.getInvolved}
          </h1>
          <p className="text-slate-850 dark:text-slate-200 dark:text-slate-205 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-bold">
            {t.bannerDesc}
          </p>
        </div>
      </section>

      {/* Tabs Selector Row */}
      <section className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-primary-500 text-primary-650 dark:text-primary-400 shadow-md transform -translate-y-1'
                      : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-850 hover:border-slate-350 hover:text-slate-850 dark:hover:text-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl mb-2.5 ${isSelected ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-500 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-extrabold text-xs sm:text-sm tracking-wide">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {dbLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
              <p className="text-slate-500 text-sm font-semibold">Loading volunteer data...</p>
            </div>
          ) : activeTab === 'volunteer' && hasApplied ? (
            <div className="space-y-10">
              
              {/* Developer Demo Control Panel */}
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold shadow-sm">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="font-bold">🔬 Developer Demo Control Panel</p>
                    <p className="text-slate-500 font-medium text-[11px] mt-0.5">Toggle hours and review state to test dashboard progress & certificate triggers.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button 
                    onClick={() => {
                      const nextHours = demoHourMode === '32' ? '14' : '32';
                      setDemoHourMode(nextHours);
                      localStorage.setItem('naye_pankh_demo_hours', nextHours);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white border border-amber-200 hover:bg-slate-50 text-slate-850 dark:text-slate-200 transition shadow-sm cursor-pointer"
                  >
                    Simulate: {demoHourMode === '32' ? '14 Hours (Locked)' : '32 Hours (Unlocked)'}
                  </button>
                  <button 
                    onClick={() => {
                      const nextStatus = demoStatusMode === 'approved' ? 'pending' : 'approved';
                      setDemoStatusMode(nextStatus);
                      localStorage.setItem('naye_pankh_demo_status', nextStatus);
                      setVolunteerApp(prev => prev ? { ...prev, status: nextStatus } : null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white border border-amber-200 hover:bg-slate-50 text-slate-850 dark:text-slate-200 transition shadow-sm cursor-pointer"
                  >
                    Simulate Status: {demoStatusMode === 'approved' ? 'Pending Review' : 'Approved'}
                  </button>
                  <button 
                    onClick={() => {
                      const nextDonated = !demoHasDonated;
                      setDemoHasDonated(nextDonated);
                      localStorage.setItem('naye_pankh_demo_donated', String(nextDonated));
                      alert(nextDonated ? "Simulated Donation: Unlocked First Donation and Community Hero achievements!" : "Simulated Donation Reset!");
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white border border-amber-200 hover:bg-slate-50 text-slate-850 dark:text-slate-200 transition shadow-sm cursor-pointer"
                  >
                    Simulate Donation: {demoHasDonated ? 'Yes (Donated)' : 'No (Not Donated)'}
                  </button>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('naye_pankh_volunteers');
                      localStorage.removeItem('naye_pankh_demo_hours');
                      localStorage.removeItem('naye_pankh_demo_status');
                      localStorage.removeItem('naye_pankh_demo_donated');
                      setVolunteerApp(null);
                      setHasApplied(false);
                      setDemoHourMode('14');
                      setDemoStatusMode('pending');
                      setDemoHasDonated(false);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition shadow-sm cursor-pointer font-bold"
                  >
                    Reset Form / Simulation
                  </button>
                </div>
              </div>

              {/* Portal Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display">{t.volunteerPortalHeader}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.volunteerPortalDescText}</p>
                </div>
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Profile Card + Timeline */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Profile Details & Skills Card */}
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-8 rounded-3xl shadow-sm space-y-6 text-slate-850 dark:text-slate-100">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{t.volDetails}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">ID: NP-VOL-{String(volunteerApp?.id || 'LOCAL').substring(0, 8).toUpperCase()}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide border shadow-sm ${
                        (volunteerApp?.status || demoStatusMode) === 'approved'
                          ? 'bg-emerald-50 border-emerald-150 text-emerald-700'
                          : 'bg-amber-50 border-amber-150 text-amber-700'
                      }`}>
                        {(volunteerApp?.status || demoStatusMode) === 'approved' ? t.approvedVolunteer : t.pendingReview}
                      </span>
                    </div>

                    {isEditingProfile ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-slate-705 dark:text-slate-300 mb-2 uppercase tracking-wider">{t.phoneNum}</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="+91 9876543210"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-705 dark:text-slate-300 mb-2 uppercase tracking-wider">{t.city}</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="Noida / Delhi"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-xs font-bold text-slate-705 dark:text-slate-300 uppercase tracking-wider">{t.selectSkills}</label>
                          <div className="flex flex-wrap gap-2">
                            {AVAILABLE_SKILLS.map(skill => {
                              const isSelected = (formData.skills || []).includes(skill);
                              return (
                                <button
                                  type="button"
                                  key={skill}
                                  onClick={() => handleToggleSkill(skill)}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                    isSelected
                                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {skill}
                                </button>
                              );
                            })}
                          </div>
                          {(formData.skills || []).includes('Others') && (
                            <div className="mt-2 animate-fadeIn">
                              <input
                                type="text"
                                name="otherSkills"
                                value={formData.otherSkills || ''}
                                onChange={handleChange}
                                placeholder={t.otherSkillsPh}
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <label className="block text-xs font-bold text-slate-705 dark:text-slate-300 uppercase tracking-wider">{t.selectInterests}</label>
                          <div className="flex flex-wrap gap-2">
                            {AVAILABLE_INTERESTS.map(interest => {
                              const isSelected = (formData.interests || []).includes(interest);
                              return (
                                <button
                                  type="button"
                                  key={interest}
                                  onClick={() => handleToggleInterest(interest)}
                                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                    isSelected
                                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {interest}
                                </button>
                              );
                            })}
                          </div>
                          {(formData.interests || []).includes('Others') && (
                            <div className="mt-2 animate-fadeIn">
                              <input
                                type="text"
                                name="otherInterests"
                                value={formData.otherInterests || ''}
                                onChange={handleChange}
                                placeholder={t.otherInterestsPh}
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200/60">
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 transition text-xs font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-slate-100 hover:bg-slate-850 dark:hover:bg-slate-200 text-white dark:text-slate-900 transition text-xs font-bold cursor-pointer"
                          >
                            {submitting ? t.savingBtn : t.saveChangesBtn}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                            <p className="font-bold text-slate-850 dark:text-slate-200 dark:text-slate-200 mt-1">{volunteerApp?.name || user?.name}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone & Email</p>
                            <p className="font-bold text-slate-850 dark:text-slate-200 dark:text-slate-200 mt-1">{volunteerApp?.phone || formData.phone || 'TBD'}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{volunteerApp?.email || user?.email}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">City Location</p>
                            <p className="font-bold text-slate-850 dark:text-slate-200 dark:text-slate-200 mt-1">{volunteerApp?.city || formData.city || 'TBD'}</p>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core Program Wing</p>
                          <p className="font-bold text-slate-850 dark:text-slate-200 capitalize bg-slate-200/60 inline-block px-3 py-1 rounded-lg text-xs">
                            {volunteerApp?.program === 'shiksha' ? 'Project Shiksha (Education)' : volunteerApp?.program === 'swasthya' ? 'Project Swasthya (Healthcare)' : volunteerApp?.program === 'swabalamban' ? 'Project Swabalamban (Livelihoods)' : 'General Outreaches'}
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(volunteerApp?.skills) && volunteerApp.skills.length > 0 ? (
                              volunteerApp.skills.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-primary-50 text-primary-655 border border-primary-100 rounded-lg text-xs font-bold">
                                  {skill === 'Others' && volunteerApp.otherSkills ? `Others: ${volunteerApp.otherSkills}` : skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-450 dark:text-slate-500 italic">{t.noSkillsYet}</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Interests</p>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(volunteerApp?.interests) && volunteerApp.interests.length > 0 ? (
                              volunteerApp.interests.map(interest => (
                                <span key={interest} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold">
                                  {interest === 'Others' && volunteerApp.otherInterests ? `Others: ${volunteerApp.otherInterests}` : interest}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-450 dark:text-slate-500 italic">{t.noInterestsYet}</span>
                            )}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200/60 flex justify-end">
                          <button
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                phone: volunteerApp?.phone || prev.phone || '',
                                city: volunteerApp?.city || prev.city || '',
                                skills: volunteerApp?.skills || [],
                                interests: volunteerApp?.interests || [],
                                otherSkills: volunteerApp?.otherSkills || '',
                                otherInterests: volunteerApp?.otherInterests || ''
                              }));
                              setIsEditingProfile(true);
                            }}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs font-bold text-slate-850 dark:text-slate-200 flex items-center space-x-1.5 cursor-pointer"
                          >
                            <span>{t.editProfileBtn}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Activity History Timeline Card */}
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-8 rounded-3xl shadow-sm space-y-6 text-slate-800 dark:text-slate-200">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                      <div className="flex items-center space-x-2">
                        <History className="h-5.5 w-5.5 text-primary-500" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{t.historyTitle}</h3>
                      </div>
                      <span className="text-xs text-slate-400 font-bold uppercase">{pastActivities.length} {t.historyCompleted}</span>
                    </div>

                    <div className="relative pl-6 border-l border-slate-200 dark:border-slate-700 space-y-8 py-2">
                      {pastActivities.map((act) => (
                        <div key={act.id} className="relative group">
                          <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary-500 bg-white dark:bg-slate-900 group-hover:bg-primary-500 transition duration-300" />
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{act.date}</span>
                            <h4 className="font-bold text-slate-900 text-sm">{act.eventTitle}</h4>
                            <div className="flex items-center space-x-3 text-xs pt-1">
                              <span className="text-slate-500 font-semibold bg-slate-200/60 dark:bg-slate-750 px-2 py-0.5 rounded text-slate-800 dark:text-slate-300 text-[11px]">{act.program}</span>
                              <span className="text-primary-600 font-bold bg-primary-50 px-2 py-0.5 rounded text-[11px]">{act.hours} {t.hoursLogged}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: Certificates + Registered Events */}
                <div className="lg:col-span-5 space-y-8">
                  
                  {/* Experience Certificate Download Card */}
                  <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-900 p-8 rounded-3xl shadow-xl text-white space-y-6 relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-400">{t.certMilestones}</span>
                      <h3 className="text-xl font-bold font-display">{t.certTitle}</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>{t.completedHours}</span>
                        <span>{totalCompletedHours} / 30 hrs</span>
                      </div>
                      
                      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-850">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (totalCompletedHours / 30) * 100)}%` }}
                        />
                      </div>

                      {totalCompletedHours >= 30 && (volunteerApp?.status || demoStatusMode) === 'approved' ? (
                        <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                          <span>{t.certUnlockedMsg}</span>
                        </div>
                      ) : (volunteerApp?.status || demoStatusMode) !== 'approved' ? (
                        <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                          <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                          <span>{t.approveToUnlockMsg}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-slate-800/50 border border-slate-750 text-slate-350 text-xs font-medium leading-relaxed">
                          <span>{t.completeMoreHoursMsg1}{30 - totalCompletedHours}{t.completeMoreHoursMsg2}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCertificate(null);
                        setShowCertificateModal(true);
                      }}
                      disabled={totalCompletedHours < 35 && (totalCompletedHours < 30 || (volunteerApp?.status || demoStatusMode) !== 'approved')}
                      className={`w-full py-3.5 rounded-xl font-bold text-xs text-center flex items-center justify-center space-x-2 transition-all duration-300 ${
                        totalCompletedHours >= 30 && (volunteerApp?.status || demoStatusMode) === 'approved'
                          ? 'bg-primary-600 hover:bg-primary-750 text-white cursor-pointer shadow-lg hover:shadow-primary-600/15'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Download className="h-4 w-4" />
                      <span>{t.downloadCertBtn}</span>
                    </button>
                  </div>

                  {/* Achievements & Badges Card */}
                  <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-8 rounded-3xl shadow-sm space-y-6 text-slate-800 dark:text-slate-200">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-5.5 w-5.5 text-primary-500" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{t.impactAchievements}</h3>
                      </div>
                      <span className="text-xs bg-primary-50 text-primary-655 border border-primary-100 px-2.5 py-0.5 rounded-md font-extrabold">
                        {earnedBadgesCount} / 4 {t.earnedText}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Badge 1: First Donation */}
                      <button
                        type="button"
                        onClick={() => handleOpenBadgeDetails('firstDonation')}
                        className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col items-center text-center space-y-2 relative group cursor-pointer hover:-translate-y-1 hover:shadow-md ${
                          hasDonatedVal 
                            ? 'bg-rose-50/40 border-rose-150 shadow-sm hover:shadow-md hover:scale-105' 
                            : 'bg-slate-50 border-slate-200/60 opacity-60 dashed-border'
                        }`}
                      >
                        <div className={`p-3 rounded-xl border ${
                          hasDonatedVal 
                            ? 'bg-rose-100 border-rose-200 text-rose-600' 
                            : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}>
                          <Heart className={`h-6 w-6 ${hasDonatedVal ? 'fill-rose-500' : ''}`} />
                        </div>
                        <div className="w-full">
                          <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">{badges.firstDonation.name}</h4>
                          <p className="text-[10px] text-slate-450 mt-1 leading-normal">{badges.firstDonation.desc}</p>
                          <div className="mt-2.5 space-y-1">
                            <div className="flex justify-between text-[9px] font-bold text-slate-400">
                              <span>{t.progressText}</span>
                              <span>{hasDonatedVal ? '1/1' : '0/1'}</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                              <div className="bg-rose-500 h-full transition-all duration-350" style={{ width: hasDonatedVal ? '100%' : '0%' }} />
                            </div>
                          </div>
                        </div>
                        {hasDonatedVal ? (
                          <span className="absolute top-1 right-2 text-[9px] font-bold text-rose-500 uppercase tracking-widest">{t.unlockedText}</span>
                        ) : (
                          <Lock className="absolute top-1.5 right-2 h-3 w-3 text-slate-350" />
                        )}
                      </button>

                      {/* Badge 2: Super Volunteer */}
                      <button
                        type="button"
                        onClick={() => handleOpenBadgeDetails('superVolunteer')}
                        className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col items-center text-center space-y-2 relative group cursor-pointer hover:-translate-y-1 hover:shadow-md ${
                          totalCompletedHoursVal >= 30 && isApprovedVal
                            ? 'bg-amber-50/40 border-amber-150 shadow-sm hover:shadow-md hover:scale-105' 
                            : 'bg-slate-50 border-slate-200/60 opacity-60 dashed-border'
                        }`}
                      >
                        <div className={`p-3 rounded-xl border ${
                          totalCompletedHoursVal >= 30 && isApprovedVal
                            ? 'bg-amber-100 border-amber-200 text-amber-600' 
                            : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}>
                          <Award className="h-6 w-6" />
                        </div>
                        <div className="w-full">
                          <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">{badges.superVolunteer.name}</h4>
                          <p className="text-[10px] text-slate-455 mt-1 leading-normal">{badges.superVolunteer.desc}</p>
                          <div className="mt-2.5 space-y-1">
                            <div className="flex justify-between text-[9px] font-bold text-slate-400">
                              <span>Progress</span>
                              <span>{totalCompletedHoursVal} / 30 hrs</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full transition-all duration-350" style={{ width: `${Math.min(100, (totalCompletedHoursVal / 30) * 100)}%` }} />
                            </div>
                          </div>
                        </div>
                        {totalCompletedHoursVal >= 30 && isApprovedVal ? (
                          <span className="absolute top-1 right-2 text-[9px] font-bold text-amber-600 uppercase tracking-widest">{t.unlockedText}</span>
                        ) : (
                          <Lock className="absolute top-1.5 right-2 h-3 w-3 text-slate-350" />
                        )}
                      </button>

                      {/* Badge 3: Event Champion */}
                      <button
                        type="button"
                        onClick={() => handleOpenBadgeDetails('eventChampion')}
                        className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col items-center text-center space-y-2 relative group cursor-pointer hover:-translate-y-1 hover:shadow-md ${
                          eventCountVal >= 3 && isApprovedVal
                            ? 'bg-emerald-50/40 border-emerald-150 shadow-sm hover:shadow-md hover:scale-105' 
                            : 'bg-slate-50 border-slate-200/60 opacity-60 dashed-border'
                        }`}
                      >
                        <div className={`p-3 rounded-xl border ${
                          eventCountVal >= 3 && isApprovedVal
                            ? 'bg-emerald-100 border-emerald-200 text-emerald-600' 
                            : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}>
                          <Trophy className="h-6 w-6" />
                        </div>
                        <div className="w-full">
                          <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">{badges.eventChampion.name}</h4>
                          <p className="text-[10px] text-slate-455 mt-1 leading-normal">{badges.eventChampion.desc}</p>
                          <div className="mt-2.5 space-y-1">
                            <div className="flex justify-between text-[9px] font-bold text-slate-400">
                              <span>Progress</span>
                              <span>{eventCountVal} / 3 drives</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full transition-all duration-350" style={{ width: `${Math.min(100, (eventCountVal / 3) * 100)}%` }} />
                            </div>
                          </div>
                        </div>
                        {eventCountVal >= 3 && isApprovedVal ? (
                          <span className="absolute top-1 right-2 text-[9px] font-bold text-emerald-650 uppercase tracking-widest">{t.unlockedText}</span>
                        ) : (
                          <Lock className="absolute top-1.5 right-2 h-3 w-3 text-slate-350" />
                        )}
                      </button>

                      {/* Badge 4: Community Hero */}
                      <button
                        type="button"
                        onClick={() => handleOpenBadgeDetails('communityHero')}
                        className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col items-center text-center space-y-2 relative group cursor-pointer hover:-translate-y-1 hover:shadow-md ${
                          hasDonatedVal && totalCompletedHoursVal >= 30 && isApprovedVal
                            ? 'bg-indigo-50/40 border-indigo-150 shadow-sm hover:shadow-md hover:scale-105' 
                            : 'bg-slate-50 border-slate-200/60 opacity-60 dashed-border'
                        }`}
                      >
                        <div className={`p-3 rounded-xl border ${
                          hasDonatedVal && totalCompletedHoursVal >= 30 && isApprovedVal
                            ? 'bg-indigo-100 border-indigo-200 text-indigo-600' 
                            : 'bg-slate-100 border-slate-200 text-slate-400'
                        }`}>
                          <Shield className="h-6 w-6" />
                        </div>
                        <div className="w-full">
                          <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">{badges.communityHero.name}</h4>
                          <p className="text-[10px] text-slate-455 mt-1 leading-normal">{badges.communityHero.desc}</p>
                          <div className="mt-2.5 space-y-1">
                            <div className="flex justify-between text-[9px] font-bold text-slate-400">
                              <span>{t.progressText}</span>
                              <span>{((hasDonatedVal ? 1 : 0) + (totalCompletedHoursVal >= 30 && isApprovedVal ? 1 : 0))} / 2</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full transition-all duration-350" style={{ width: `${((hasDonatedVal ? 1 : 0) + (totalCompletedHoursVal >= 30 && isApprovedVal ? 1 : 0)) * 50}%` }} />
                            </div>
                          </div>
                        </div>
                        {hasDonatedVal && totalCompletedHoursVal >= 30 && isApprovedVal ? (
                          <span className="absolute top-1 right-2 text-[9px] font-bold text-indigo-600 uppercase tracking-widest">{t.unlockedText}</span>
                        ) : (
                          <Lock className="absolute top-1.5 right-2 h-3 w-3 text-slate-350" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Registered Events Widget */}
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-8 rounded-3xl shadow-sm space-y-6 text-slate-800 dark:text-slate-200">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5.5 w-5.5 text-primary-500" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{t.registeredEventsTitle}</h3>
                      </div>
                      <span className="text-xs text-slate-400 font-bold uppercase">{userRegistrations.length} {t.upcomingText}</span>
                    </div>

                    {userRegistrations.length === 0 ? (
                      <div className="text-center py-8 space-y-4">
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[220px] mx-auto">{t.noEventsMsg}</p>
                        <Link
                          to="/events"
                          className="inline-flex items-center space-x-1 px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-white transition text-xs font-bold rounded-xl text-slate-850 dark:text-slate-200"
                        >
                          <span>{t.browseEventsBtn}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userRegistrations.map((reg, idx) => (
                          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm space-y-3.5">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">{t.activeSlotsText}</span>
                              <h4 className="font-bold text-slate-900 text-sm mt-0.5">{reg.eventTitle || reg.eventId}</h4>
                            </div>
                            <div className="space-y-1.5 text-xs text-slate-500 font-semibold border-t border-slate-100 pt-2.5">
                              <p className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-primary-500 shrink-0" />
                                <span>{reg.name}</span>
                              </p>
                              <p className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-primary-500 shrink-0" />
                                <span>{reg.phone}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-slate-200/60 flex justify-end">
                          <Link
                            to="/events"
                            className="text-xs font-bold text-primary-650 hover:text-primary-750 flex items-center space-x-1"
                          >
                            <span>{t.regAnotherEventBtn}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Event Certificates Widget */}
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-8 rounded-3xl shadow-sm space-y-6 text-slate-800 dark:text-slate-200">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5.5 w-5.5 text-primary-500" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{t.eventCertsTitle}</h3>
                      </div>
                      <span className="text-xs text-slate-400 font-bold uppercase">{eventCertificates.length} {t.earnedText}</span>
                    </div>

                    {eventCertificates.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-slate-500 text-xs leading-relaxed max-w-[220px] mx-auto italic">
                          No event certificates earned yet. Once you attend an event and get marked by admin, your certificate will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {eventCertificates.map((cert, idx) => (
                          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm space-y-3">
                            <div>
                              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">{cert.certificateId}</span>
                              <h4 className="font-bold text-slate-900 text-sm mt-0.5">{cert.eventTitle}</h4>
                              <p className="text-[11px] text-slate-500 font-semibold mt-1">{cert.hours} Hours Logged · {cert.date}</p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedCertificate(cert);
                                setShowCertificateModal(true);
                              }}
                              className="w-full py-2 bg-primary-50 dark:bg-primary-950/20 hover:bg-primary-100 dark:hover:bg-primary-950/40 text-primary-650 dark:text-primary-400 hover:text-primary-750 border border-primary-100 dark:border-primary-900/30 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>{t.downloadPdfBtn}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-slate-850 dark:text-slate-100">
                {submitted ? (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{t.appSubmitted}</h3>
                    <p className="text-slate-650 text-base max-w-md mx-auto leading-relaxed">
                      {currentContent.successMsg}
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: '',
                          city: '',
                          program: 'shiksha',
                          skills: [],
                          interests: [],
                          internshipTrack: 'management',
                          duration: '1-month',
                          orgName: '',
                          partnerType: 'csr',
                          position: 'operations',
                          expectedCtc: '',
                          message: ''
                        });
                      }}
                      className="px-6 py-3 rounded-xl bg-slate-950 text-white font-bold text-sm hover:bg-slate-850 transition-colors"
                    >
                      Submit Another Application
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-display capitalize">
                      {activeTab === 'partner' ? t.proposalTitle : activeTab === 'volunteer' ? t.volName + ' ' + t.appTitle : activeTab === 'internship' ? t.intName + ' ' + t.appTitle : t.workName + ' ' + t.appTitle}
                    </h2>

                    {/* Tab Specific Form Fields */}
                    {activeTab === 'volunteer' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.fullName}</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.emailAddr}</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.phoneNum}</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="+91 9876543210"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.city}</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="Noida / Delhi / Mumbai"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.prefProg}</label>
                          <select
                            name="program"
                            value={formData.program}
                            onChange={handleChange}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                          >
                            <option value="shiksha">Project Shiksha (Education)</option>
                            <option value="swasthya">Project Swasthya (Healthcare)</option>
                            <option value="swabalamban">Project Swabalamban (Livelihood)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.selectSkills}</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {AVAILABLE_SKILLS.map(skill => {
                              const isSelected = (formData.skills || []).includes(skill);
                              return (
                                <button
                                  type="button"
                                  key={skill}
                                  onClick={() => handleToggleSkill(skill)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                                    isSelected
                                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-655 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
                                  }`}
                                >
                                  {skill}
                                </button>
                              );
                            })}
                          </div>
                          {(formData.skills || []).includes('Others') && (
                            <div className="mt-3 animate-fadeIn">
                              <input
                                type="text"
                                name="otherSkills"
                                value={formData.otherSkills || ''}
                                onChange={handleChange}
                                placeholder="Please specify your other skills..."
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.selectInterests}</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {AVAILABLE_INTERESTS.map(interest => {
                              const isSelected = (formData.interests || []).includes(interest);
                              return (
                                <button
                                  type="button"
                                  key={interest}
                                  onClick={() => handleToggleInterest(interest)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                                    isSelected
                                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-655 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
                                  }`}
                                >
                                  {interest}
                                </button>
                              );
                            })}
                          </div>
                          {(formData.interests || []).includes('Others') && (
                            <div className="mt-3 animate-fadeIn">
                              <input
                                type="text"
                                name="otherInterests"
                                value={formData.otherInterests || ''}
                                onChange={handleChange}
                                placeholder="Please specify your other interests..."
                                required
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'internship' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="+91 9876543210"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="Noida / Delhi / Mumbai"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.internshipTrack}</label>
                            <select
                              name="internshipTrack"
                              value={formData.internshipTrack}
                              onChange={handleChange}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                            >
                              <option value="management">NGO Management & Operations</option>
                              <option value="content">Content Writing & Blogging</option>
                              <option value="marketing">Fundraising & Marketing</option>
                              <option value="design">Graphic Design & Media</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.duration}</label>
                            <select
                              name="duration"
                              value={formData.duration}
                              onChange={handleChange}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                            >
                              <option value="1-month">1 Month</option>
                              <option value="2-months">2 Months</option>
                              <option value="3-months">3 Months</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'partner' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.orgNameLabel}</label>
                            <input
                              type="text"
                              name="orgName"
                              value={formData.orgName}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="e.g. Acme Corp"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.contactPersonLabel}</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="Your Name"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="contact@company.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="+91 9876543210"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="Noida / Delhi / Mumbai"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.partnerTypeLabel}</label>
                            <select
                              name="partnerType"
                              value={formData.partnerType}
                              onChange={handleChange}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                            >
                              <option value="csr">Corporate CSR Sponsorship</option>
                              <option value="collaboration">Event Collaboration</option>
                              <option value="chapter">School/College Chapter Setup</option>
                              <option value="other">Other Partnership Proposal</option>
                            </select>
                            {formData.partnerType === 'other' && (
                              <div className="mt-3 animate-fadeIn">
                                <input
                                  type="text"
                                  name="otherPartnerType"
                                  value={formData.otherPartnerType || ''}
                                  onChange={handleChange}
                                  placeholder="Specify partnership type..."
                                  required
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'work' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="+91 9876543210"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              required
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="Noida / Delhi / Mumbai"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.positionApplied}</label>
                            <select
                              name="position"
                              value={formData.position}
                              onChange={handleChange}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                            >
                              <option value="operations">City Operations Manager</option>
                              <option value="coordinator">Fundraising Coordinator</option>
                              <option value="specialist">Social Media Specialist</option>
                              <option value="executive">Finance Executive</option>
                              <option value="other">Others</option>
                            </select>
                            {formData.position === 'other' && (
                              <div className="mt-3 animate-fadeIn">
                                <input
                                  type="text"
                                  name="otherPosition"
                                  value={formData.otherPosition || ''}
                                  onChange={handleChange}
                                  placeholder="Specify position..."
                                  required
                                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                                />
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.expectedCtcLabel}</label>
                            <input
                              type="text"
                              name="expectedCtc"
                              value={formData.expectedCtc}
                              onChange={handleChange}
                              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                              placeholder="e.g. ₹3.6 LPA"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        {activeTab === 'partner' ? t.partnerNotes : activeTab === 'work' ? t.suitabilityNotes : t.whyJoinNotes}
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors text-slate-850 dark:text-slate-200 dark:text-slate-100"
                        placeholder={t.messagePlaceholder}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-base shadow transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      {submitting ? t.btnSubmitting : t.btnSubmitApp}
                    </button>
                  </form>
                )}
              </div>

              <div className="lg:col-span-5 space-y-12">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white border-l-4 border-primary-500 pl-3 font-display">
                    {currentContent.title}
                  </h3>
                  <div className="space-y-4">
                    {currentContent.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex space-x-3.5">
                        <div className="p-2 bg-primary-50 text-primary-500 rounded-lg shrink-0 h-9 w-9 flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{benefit.title}</h4>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 border-l-4 border-primary-500 pl-3 font-display">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {currentContent.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{faq.q}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {showCertificateModal && (
        <div id="printable-certificate-container" className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative border border-slate-200">
            {/* Modal actions - hidden when printing */}
            <div className="flex justify-between items-center mb-6 no-print">
              <h4 className="text-lg font-bold text-slate-950 font-display flex items-center space-x-2">
                <Award className="h-5 w-5 text-amber-500" />
                <span>{selectedCertificate ? 'Volunteer Event Certificate' : 'Your Digital Certificate'}</span>
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Print / PDF</span>
                </button>
                <button
                  onClick={() => {
                    setShowCertificateModal(false);
                    setSelectedCertificate(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-650 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Certificate Template */}
            <div className="bg-amber-50/20 border-8 border-double border-amber-600 p-8 sm:p-12 text-center rounded-2xl relative font-serif" style={{ backgroundColor: '#fffdf9' }}>
              <div className="absolute top-4 left-4 text-amber-600/60 text-xl">✥</div>
              <div className="absolute top-4 right-4 text-amber-600/60 text-xl">✥</div>
              <div className="absolute bottom-4 left-4 text-amber-600/60 text-xl">✥</div>
              <div className="absolute bottom-4 right-4 text-amber-600/60 text-xl">✥</div>
              
              <div className="space-y-6">
                <img src="/logo.png" className="h-16 w-16 mx-auto object-contain bg-white p-1.5 rounded-2xl border border-amber-100 shadow-sm" alt="NayePankh Logo" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#132a13] uppercase tracking-widest font-display">
                  {selectedCertificate ? 'Certificate of Participation' : 'Certificate of Appreciation'}
                </h2>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-sans font-bold">This is proudly presented to</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-wide font-display italic my-2">
                  {selectedCertificate ? selectedCertificate.name : (volunteerApp?.name || user?.name)}
                </h3>
                <p className="text-slate-650 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-sans">
                  {selectedCertificate ? (
                    <>
                      for outstanding volunteer contributions and active participation in the event <strong className="text-slate-950">"{selectedCertificate.eventTitle}"</strong> on <strong className="text-slate-950">{selectedCertificate.date}</strong>, logging <strong className="text-slate-950">{selectedCertificate.hours} hours</strong> of community service.
                    </>
                  ) : (
                    <>
                      for outstanding volunteer contributions and dedicated service of <strong className="text-slate-950">{totalCompletedHours} hours</strong> to the NayePankh Foundation programs.
                    </>
                  )}
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-amber-250/60 max-w-sm mx-auto font-sans">
                  <div className="text-center">
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest font-sans">Issued Date</p>
                    <p className="text-xs font-bold text-slate-850 dark:text-slate-200 dark:text-slate-200 mt-1">
                      {selectedCertificate ? selectedCertificate.date : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest font-sans">Certificate ID</p>
                    <p className="text-xs font-bold text-slate-850 dark:text-slate-100 mt-1 font-mono uppercase">
                      {selectedCertificate ? selectedCertificate.certificateId : `NP-VOL-${String(volunteerApp?.id || 'MOCK123').substring(0, 8).toUpperCase()}`}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-6 max-w-sm mx-auto font-sans font-sans relative">
                  {/* Foundation Stamp (absolute center overlay) */}
                  {((selectedCertificate && selectedCertificate.stampUrl) || stampImage) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <img 
                        src={(selectedCertificate && selectedCertificate.stampUrl) || stampImage} 
                        className="w-16 h-16 object-contain mix-blend-multiply opacity-85 rotate-[-8deg] -translate-y-2" 
                        alt="Foundation Stamp" 
                      />
                    </div>
                  )}

                  <div className="text-center flex flex-col items-center relative min-h-[48px] justify-end">
                    {((selectedCertificate && selectedCertificate.signatureUrl) || sigImage) ? (
                      <img 
                        src={(selectedCertificate && selectedCertificate.signatureUrl) || sigImage} 
                        className="absolute bottom-5 h-10 object-contain max-w-[120px] mix-blend-multiply" 
                        alt="Founder Signature" 
                      />
                    ) : (
                      <span className="font-serif italic text-xs text-slate-750 font-bold absolute bottom-5">Prashant Shukla</span>
                    )}
                    <div className="w-16 h-px bg-slate-355 my-1"></div>
                    <p className="text-[8px] text-slate-400 font-sans uppercase font-bold">Founder President</p>
                  </div>
                  
                  <div className="text-center flex flex-col items-center relative min-h-[48px] justify-end">
                    <span className="font-serif italic text-xs text-slate-750 font-bold absolute bottom-5">Anjali Gupta</span>
                    <div className="w-16 h-px bg-slate-355 my-1"></div>
                    <p className="text-[8px] text-slate-400 font-sans uppercase font-bold">National Coordinator</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Embedded styles for print layout */}
            {printStyles}
          </div>
        </div>
      )}

      {/* Badge Details Modal */}
      {activeBadgeDetails && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100">
            {/* Ambient Background Glow */}
            <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-20 ${
              activeBadgeDetails.theme === 'rose' ? 'bg-rose-500' :
              activeBadgeDetails.theme === 'amber' ? 'bg-amber-500' :
              activeBadgeDetails.theme === 'emerald' ? 'bg-emerald-500' :
              'bg-indigo-500'
            }`} />
            
            <button
              type="button"
              onClick={() => setActiveBadgeDetails(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-650 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-6 pt-4">
              <div className="relative inline-flex">
                <div className={`absolute inset-0 rounded-full blur-xl animate-pulse opacity-40 ${
                  activeBadgeDetails.theme === 'rose' ? 'bg-rose-500' :
                  activeBadgeDetails.theme === 'amber' ? 'bg-amber-500' :
                  activeBadgeDetails.theme === 'emerald' ? 'bg-emerald-500' :
                  'bg-indigo-500'
                }`} />
                <div className={`p-6 rounded-full border-2 relative z-10 ${
                  activeBadgeDetails.unlocked
                    ? activeBadgeDetails.theme === 'rose' ? 'bg-rose-100 border-rose-350 text-rose-600' :
                      activeBadgeDetails.theme === 'amber' ? 'bg-amber-100 border-amber-350 text-amber-600' :
                      activeBadgeDetails.theme === 'emerald' ? 'bg-emerald-100 border-emerald-350 text-emerald-600' :
                      'bg-indigo-100 border-indigo-350 text-indigo-650'
                    : 'bg-slate-100 border-slate-300 text-slate-400'
                }`}>
                  {activeBadgeDetails.key === 'firstDonation' && <Heart className={`h-12 w-12 ${activeBadgeDetails.unlocked ? 'fill-rose-500' : ''}`} />}
                  {activeBadgeDetails.key === 'superVolunteer' && <Award className="h-12 w-12" />}
                  {activeBadgeDetails.key === 'eventChampion' && <Trophy className="h-12 w-12" />}
                  {activeBadgeDetails.key === 'communityHero' && <Shield className="h-12 w-12" />}
                </div>
              </div>

              <div className="space-y-1">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                  activeBadgeDetails.theme === 'rose' ? 'text-rose-600' :
                  activeBadgeDetails.theme === 'amber' ? 'text-amber-600' :
                  activeBadgeDetails.theme === 'emerald' ? 'text-emerald-600' :
                  'text-indigo-600'
                }`}>
                  {activeBadgeDetails.unlocked ? 'Achievement Unlocked' : 'Locked Milestone'}
                </span>
                <h3 className="text-2xl font-black text-slate-900 font-display">{activeBadgeDetails.name}</h3>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-3">
                <p className="text-xs text-slate-550 font-semibold leading-relaxed">
                  <strong className="text-slate-850 dark:text-slate-200 font-bold">Criteria:</strong> {activeBadgeDetails.requirement}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-550">
                    <span>Your Progress</span>
                    <span>{activeBadgeDetails.progressText}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        activeBadgeDetails.theme === 'rose' ? 'bg-rose-500' :
                        activeBadgeDetails.theme === 'amber' ? 'bg-amber-500' :
                        activeBadgeDetails.theme === 'emerald' ? 'bg-emerald-500' :
                        'bg-indigo-500'
                      }`}
                      style={{ width: activeBadgeDetails.progressPct }}
                    />
                  </div>
                </div>
              </div>

              {activeBadgeDetails.unlocked ? (
                <div className="space-y-4">
                  <div className="border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-left relative">
                    <span className="absolute -top-2 left-3 bg-white px-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-wide border rounded">Post Draft</span>
                    <p className="text-xs text-slate-650 italic leading-relaxed pt-1">
                      "{activeBadgeDetails.shareText}"
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`Proudly earned the ${activeBadgeDetails.name} badge from NayePankh Foundation! Join me in making a difference: https://nayepankh.org`);
                      setCopyToast(true);
                      setTimeout(() => setCopyToast(false), 2500);
                    }}
                    className={`w-full py-3 rounded-xl text-xs font-bold text-white transition-all shadow-md cursor-pointer ${
                      activeBadgeDetails.theme === 'rose' ? 'bg-rose-650 hover:bg-rose-700' :
                      activeBadgeDetails.theme === 'amber' ? 'bg-amber-650 hover:bg-amber-700' :
                      activeBadgeDetails.theme === 'emerald' ? 'bg-emerald-650 hover:bg-emerald-700' :
                      'bg-indigo-650 hover:bg-indigo-700'
                    }`}
                  >
                    Copy & Share Achievement
                  </button>
                </div>
              ) : (
                <p className="text-slate-450 text-xs italic font-semibold">Continue contributing to earn this badge!</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Celebration Notification */}
      {unlockedToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl flex items-center space-x-4 border border-slate-800 z-50 animate-slide-up max-w-sm">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl shrink-0">
            <Trophy className="h-6 w-6 animate-bounce" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">🎉 Achievement Unlocked!</p>
            <h4 className="font-bold text-sm text-white">{unlockedToast.name}</h4>
            <p className="text-[11px] text-slate-400 leading-normal">{unlockedToast.desc}</p>
          </div>
          <button 
            type="button"
            onClick={() => setUnlockedToast(null)}
            className="p-1 hover:bg-slate-800 rounded text-slate-455 hover:text-white transition cursor-pointer self-start"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Clipboard Copy Toast */}
      {copyToast && (
        <div className="fixed bottom-6 left-6 bg-slate-900/95 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 border border-slate-800 z-50 animate-slide-up text-xs font-bold">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
          <span>Post draft copied to clipboard!</span>
        </div>
      )}

      {customAnimations}
    </div>
  );
}
