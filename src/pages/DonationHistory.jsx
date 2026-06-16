import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  Download, 
  History, 
  Award, 
  TrendingUp, 
  CreditCard,
  Loader2,
  Lock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  X,
  Trophy,
  Shield,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db, isConfigured } from '../firebase/config';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

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

export default function DonationHistory() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [publicDonations, setPublicDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage] = useState(null);

  const [volunteerApp, setVolunteerApp] = useState(null);
  const [demoHourMode, setDemoHourMode] = useState(() => localStorage.getItem('naye_pankh_demo_hours') || '32');
  const [demoStatusMode, setDemoStatusMode] = useState(() => localStorage.getItem('naye_pankh_demo_status') || 'approved');
  const [demoHasDonated, setDemoHasDonated] = useState(() => localStorage.getItem('naye_pankh_demo_donated') === 'true');
  const [activeBadgeDetails, setActiveBadgeDetails] = useState(null);
  const [unlockedToast, setUnlockedToast] = useState(null);
  const [copyToast, setCopyToast] = useState(false);

  const hasDonatedInit = donations.length > 0 || (localStorage.getItem('naye_pankh_demo_donated') === 'true');
  const totalCompletedHoursInit = ((localStorage.getItem('naye_pankh_demo_hours') || '32') === '32' ? MOCK_PAST_ACTIVITIES_2 : MOCK_PAST_ACTIVITIES_1).reduce((sum, act) => sum + act.hours, 0);
  const isApprovedInit = (volunteerApp?.status || (localStorage.getItem('naye_pankh_demo_status') || 'approved')) === 'approved';

  const prevBadgesRef = useRef({
    firstDonation: hasDonatedInit,
    superVolunteer: totalCompletedHoursInit >= 30 && isApprovedInit,
    eventChampion: ((localStorage.getItem('naye_pankh_demo_hours') || '32') === '32' ? MOCK_PAST_ACTIVITIES_2 : MOCK_PAST_ACTIVITIES_1).length >= 3 && isApprovedInit,
    communityHero: hasDonatedInit && totalCompletedHoursInit >= 30 && isApprovedInit
  });

  useEffect(() => {
    if (user) {
      if (isConfigured) {
        getDocs(query(collection(db, 'volunteers'), where('userId', '==', user.uid)))
          .then(snap => {
            if (!snap.empty) {
              setVolunteerApp({ id: snap.docs[0].id, ...snap.docs[0].data() });
            }
          })
          .catch(err => console.error("Error reading volunteer status:", err));
      }
      const savedApps = JSON.parse(localStorage.getItem('naye_pankh_volunteers') || '[]');
      const localApp = savedApps.find(app => app.email === user.email || app.userId === user.uid);
      if (localApp) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVolunteerApp(prev => prev || localApp);
      }
    }
  }, [user]);


  useEffect(() => {
    const fetchDonationData = async () => {
      setLoading(true);
      setError(null);

      let userLogs = [];
      let publicLogs = [];

      // 1. Fetch personal donations if logged in
      if (user) {
        let fetchedFromDb = false;
        if (isConfigured) {
          try {
            const q = query(
              collection(db, 'donations'),
              where('userId', '==', user.uid)
            );
            const snapshot = await getDocs(q);
            userLogs = snapshot.docs.map(doc => {
              const data = doc.data();
              const dateObj = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp || 0);
              return {
                id: doc.id,
                ...data,
                dateStr: dateObj.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }),
                dateTime: dateObj.getTime()
              };
            });
            fetchedFromDb = true;
          } catch (err) {
            console.warn("Firestore personal donations read failed, using localStorage fallback:", err);
          }
        }

        if (!fetchedFromDb) {
          // Mock read from localstorage
          const localLogs = JSON.parse(localStorage.getItem('naye_pankh_donations') || '[]');
          userLogs = localLogs
            .filter(item => item.userId === user.uid || item.email === user.email)
            .map((item, idx) => {
              const dateObj = new Date(item.timestamp || Date.now());
              return {
                id: item.id || `mock-${idx}`,
                ...item,
                dateStr: dateObj.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }),
                dateTime: dateObj.getTime()
              };
            });
        }

        userLogs.sort((a, b) => b.dateTime - a.dateTime);
        setDonations(userLogs);
      }

      // 2. Fetch recent public donations (for wall of supporters)
      let fetchedPublicFromDb = false;
      if (isConfigured) {
        try {
          const qPublic = query(
            collection(db, 'donations'),
            limit(10)
          );
          const snapPublic = await getDocs(qPublic);
          publicLogs = snapPublic.docs.map(doc => {
            const data = doc.data();
            const dateObj = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp || 0);
            return {
              id: doc.id,
              userName: data.userName || data.name || 'Anonymous Supporter',
              amount: data.amount,
              dateStr: dateObj.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }),
              dateTime: dateObj.getTime()
            };
          });
          fetchedPublicFromDb = true;
        } catch (err) {
          console.warn("Firestore public donations read failed, using default mock supporters:", err);
        }
      }

      if (!fetchedPublicFromDb) {
        // Default mock supporters
        publicLogs = [
          { id: 'p1', userName: 'Rohan Mehta', amount: 3000, dateStr: '12 Jun 2026' },
          { id: 'p2', userName: 'Aanya Sharma', amount: 1500, dateStr: '10 Jun 2026' },
          { id: 'p3', userName: 'Kabir Verma', amount: 500, dateStr: '08 Jun 2026' }
        ];
      } else {
        publicLogs.sort((a, b) => b.dateTime - a.dateTime);
      }

      setPublicDonations(publicLogs.slice(0, 5));
      setLoading(false);
    };

    fetchDonationData();
  }, [user]);

  const hasDonatedVal = donations.length > 0 || demoHasDonated;
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

  const displayDonations = donations.length > 0 
    ? donations 
    : (demoHasDonated ? [
        {
          id: 'sim-donation-1',
          amount: 5000,
          paymentId: 'rzp_test_simulated80G',
          paymentMethod: 'UPI / NetBanking',
          frequency: 'one-time',
          dateStr: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          dateTime: new Date().getTime(),
          timestamp: new Date(),
          userName: user?.name || 'Supporter',
          category: 'Project Shiksha (Education)'
        }
      ] : []);

  // Compute donor stats
  const totalDonated = displayDonations.reduce((sum, item) => sum + parseInt(item.amount || 0), 0);
  const totalCount = displayDonations.length;

  // Compute Donor badge/tier
  let tier = 'Bronze Sponsor';
  let badgeColor = 'bg-amber-600/10 text-amber-700 border-amber-500/20';
  
  if (totalDonated >= 15000) {
    tier = 'Platinum Sponsor';
    badgeColor = 'bg-indigo-550/15 text-indigo-700 border-indigo-500/25';
  } else if (totalDonated >= 5000) {
    tier = 'Gold Sponsor';
    badgeColor = 'bg-yellow-500/15 text-yellow-700 border-yellow-500/25';
  } else if (totalDonated >= 1500) {
    tier = 'Silver Sponsor';
    badgeColor = 'bg-slate-400/15 text-slate-700 border-slate-500/25';
  }

  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const g = (n) => {
      if (n < 20) return a[n];
      const digit = n % 10;
      return b[Math.floor(n / 10)] + (digit ? '-' + a[digit] : '');
    };
    
    const c = (n) => {
      let str = '';
      if (n >= 100) {
        str += a[Math.floor(n / 100)] + 'Hundred ';
        n %= 100;
      }
      if (n > 0) {
        str += g(n);
      }
      return str;
    };

    if (num === 0) return 'Zero';
    let words = '';
    if (Math.floor(num / 10000000) > 0) {
      words += c(Math.floor(num / 10000000)) + 'Crore ';
      num %= 10000000;
    }
    if (Math.floor(num / 100000) > 0) {
      words += c(Math.floor(num / 100000)) + 'Lakh ';
      num %= 100000;
    }
    if (Math.floor(num / 1000) > 0) {
      words += c(Math.floor(num / 1000)) + 'Thousand ';
      num %= 1000;
    }
    if (num > 0) {
      words += c(num);
    }
    return words.trim() + ' Rupees Only';
  };

  const handleDownloadReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowReceiptModal(true);
  };

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

  const pastActivities = demoHourMode === '32' ? MOCK_PAST_ACTIVITIES_2 : MOCK_PAST_ACTIVITIES_1;
  const completedHoursFromHistory = pastActivities.reduce((sum, act) => sum + act.hours, 0);
  const totalCompletedHours = completedHoursFromHistory;

  const hasDonated = donations.length > 0 || demoHasDonated;

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

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <section 
        className="relative py-89 md:py-99 overflow-hidden bg-cover bg-[center_35%] bg-no-repeat border-b border-slate-200 pt-44 md:pt-54"
        style={{ backgroundImage: "url('/donation-history-bg.jpg')" }}
      >
        {/* Semi-transparent light overlay for image visibility and text readability */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-0" />
        
        {/* Soft decorative gradient glows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary-500/10 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[100px] z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="flex justify-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 bg-primary-50 px-3.5 py-1.5 rounded-full border border-primary-100">
              Donor Center
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-slate-900 drop-shadow-sm">
            Donation History
          </h1>
          <p className="text-slate-800 text-sm max-w-xl mx-auto leading-relaxed font-bold">
            Track your financial contributions, download official 80G tax certificates, and review your cumulative impact with NayePankh.
          </p>
        </div>
      </section>

      {/* Main Panel Section */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-5 right-5 bg-slate-900/90 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-2 border border-slate-700/50 z-50 animate-bounce">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold">{toastMessage}</span>
            </div>
          )}

          {user && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold shadow-sm mb-8">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <p className="font-bold">🔬 Developer Demo Control Panel</p>
                  <p className="text-slate-500 font-medium text-[11px] mt-0.5">Toggle hours and review state to test dashboard progress & badge triggers.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button 
                  type="button"
                  onClick={() => {
                    const nextHours = demoHourMode === '32' ? '14' : '32';
                    setDemoHourMode(nextHours);
                    localStorage.setItem('naye_pankh_demo_hours', nextHours);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-amber-200 hover:bg-slate-50 text-slate-800 transition shadow-sm cursor-pointer"
                >
                  Simulate: {demoHourMode === '32' ? '14 Hours (Locked)' : '32 Hours (Unlocked)'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const nextStatus = demoStatusMode === 'approved' ? 'pending' : 'approved';
                    setDemoStatusMode(nextStatus);
                    localStorage.setItem('naye_pankh_demo_status', nextStatus);
                    setVolunteerApp(prev => prev ? { ...prev, status: nextStatus } : null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-amber-200 hover:bg-slate-50 text-slate-800 transition shadow-sm cursor-pointer"
                >
                  Simulate Status: {demoStatusMode === 'approved' ? 'Pending Review' : 'Approved'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    const nextDonated = !demoHasDonated;
                    setDemoHasDonated(nextDonated);
                    localStorage.setItem('naye_pankh_demo_donated', String(nextDonated));
                    alert(nextDonated ? "Simulated Donation: Unlocked First Donation and Community Hero achievements!" : "Simulated Donation Reset!");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-amber-200 hover:bg-slate-50 text-slate-800 transition shadow-sm cursor-pointer"
                >
                  Simulate Donation: {demoHasDonated ? 'Yes (Donated)' : 'No (Not Donated)'}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Personal History (8 cols if logged in, otherwise 8 cols explanation) */}
            <div className="lg:col-span-8 space-y-8">
              
              {!user ? (
                /* Login Required Card */
                <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-lg text-center space-y-6">
                  <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mx-auto border border-primary-100">
                    <Lock className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-950 font-display">Personal Dashboard is Locked</h2>
                    <p className="text-slate-550 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                      To safeguard tax invoices and track your historical contributions, please log in with your registered volunteer/donor credentials.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                    <Link
                      to="/login"
                      className="px-8 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow transition-colors flex items-center space-x-2 cursor-pointer w-full sm:w-auto justify-center"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/register"
                      className="px-8 py-3.5 rounded-xl border-2 border-primary-500 text-primary-500 hover:bg-primary-50 font-bold text-sm transition-colors w-full sm:w-auto justify-center"
                    >
                      Register Account
                    </Link>
                  </div>
                </div>
              ) : loading ? (
                /* Loading State */
                <div className="bg-white border border-slate-200/85 rounded-3xl p-20 shadow-sm flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
                  <p className="text-slate-500 text-sm font-semibold">Retrieving your donor history...</p>
                </div>
              ) : error ? (
                /* Error State */
                <div className="bg-white border border-slate-200/85 rounded-3xl p-12 shadow-sm text-center space-y-4">
                  <p className="text-rose-600 font-bold text-sm">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                  >
                    Retry Fetching
                  </button>
                </div>
              ) : displayDonations.length === 0 ? (
                /* Empty Donations State */
                <div className="bg-white border border-slate-200/85 rounded-3xl p-12 sm:p-16 shadow-sm text-center space-y-6">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <History className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 font-display">No past contributions found</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                      We couldn't find any completed sponsorships logged under <strong className="text-slate-800">{user.email}</strong>.
                    </p>
                  </div>
                  <Link
                    to="/donate"
                    className="inline-flex items-center space-x-1.5 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-xs shadow transition-colors cursor-pointer"
                  >
                    <Heart className="h-4 w-4 fill-white" />
                    <span>Make Your First Sponsorship</span>
                  </Link>
                </div>
              ) : (
                /* Personal Donations List */
                <div className="space-y-6">
                  {/* Summary row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Stat 1: Total Donated */}
                    <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm flex items-start space-x-4">
                      <div className="p-3 bg-primary-50 border border-primary-100 rounded-xl text-primary-500 shrink-0">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Impact</span>
                        <h4 className="text-2xl font-black text-slate-900 mt-1 font-display">
                          ₹{totalDonated.toLocaleString('en-IN')}
                        </h4>
                      </div>
                    </div>

                    {/* Stat 2: Sponorships Count */}
                    <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm flex items-start space-x-4">
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-650 shrink-0">
                        <History className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Contributions</span>
                        <h4 className="text-2xl font-black text-slate-900 mt-1 font-display">
                          {totalCount} Cycles
                        </h4>
                      </div>
                    </div>

                    {/* Stat 3: Badge Status */}
                    <div className="bg-white border border-slate-200/85 p-6 rounded-2xl shadow-sm flex items-start space-x-4">
                      <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-550 shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Donor Tier</span>
                        <div className={`inline-flex px-2 py-0.5 border rounded-md text-[10px] font-black uppercase mt-1.5 ${badgeColor}`}>
                          {tier}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logs Table Container */}
                  <div className="bg-white border border-slate-200/85 rounded-3xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-950 font-display">Completed Payments</h3>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">
                        Auto-Synced
                      </span>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-slate-450 text-[10px] font-bold uppercase tracking-wider">
                            <th className="py-4 px-6">Date</th>
                            <th className="py-4 px-6">Payment ID</th>
                            <th className="py-4 px-6">Frequency</th>
                            <th className="py-4 px-6">Method</th>
                            <th className="py-4 px-6 text-right">Amount</th>
                            <th className="py-4 px-6 text-center">Invoice</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                          {displayDonations.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4.5 px-6 font-semibold text-slate-900">{item.dateStr}</td>
                              <td className="py-4.5 px-6 font-mono text-xs text-slate-500">{item.paymentId}</td>
                              <td className="py-4.5 px-6 capitalize">
                                <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                  item.frequency === 'monthly' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-650'
                                }`}>
                                  {item.frequency}
                                </span>
                              </td>
                              <td className="py-4.5 px-6 capitalize text-xs font-medium text-slate-550 flex items-center space-x-1.5 mt-2 border-0">
                                <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                                <span>{item.paymentMethod}</span>
                              </td>
                              <td className="py-4.5 px-6 text-right font-black text-slate-905">
                                ₹{item.amount.toLocaleString('en-IN')}
                              </td>
                              <td className="py-4.5 px-6 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDownloadReceipt(item)}
                                  className="p-1.5 bg-slate-50 hover:bg-primary-50 text-slate-500 hover:text-primary-600 rounded-lg border border-slate-200 hover:border-primary-200 transition-all cursor-pointer"
                                  title="View / Print Receipt"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card List View */}
                    <div className="sm:hidden divide-y divide-slate-100">
                      {displayDonations.map((item) => (
                        <div key={item.id} className="p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs text-slate-400 font-bold">{item.dateStr}</p>
                              <p className="text-xs font-mono text-slate-500 mt-1 font-semibold">{item.paymentId}</p>
                            </div>
                            <span className="text-base font-black text-slate-900">
                              ₹{item.amount.toLocaleString('en-IN')}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center space-x-3">
                              <span className="capitalize px-2 py-0.5 rounded bg-slate-100 font-bold text-[10px] text-slate-600">
                                {item.frequency}
                              </span>
                              <span className="capitalize font-semibold text-slate-500 flex items-center space-x-1">
                                <CreditCard className="h-3.5 w-3.5 text-slate-450" />
                                <span>{item.paymentMethod}</span>
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDownloadReceipt(item)}
                              className="px-3 py-1.5 bg-slate-50 text-slate-650 hover:text-primary-600 hover:bg-primary-50/30 border border-slate-200 rounded-lg font-bold text-[10px] flex items-center space-x-1 cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Receipt</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Public Impact Wall & Certificate Download */}
            <div className="lg:col-span-4 space-y-8">
              
              {user && (
                /* Achievements & Badges Card */
                <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200/60">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-primary-500" />
                      <h3 className="text-base font-bold text-slate-900 font-display">Impact Achievements</h3>
                    </div>
                    <span className="text-[10px] bg-primary-50 text-primary-655 border border-primary-100 px-2.5 py-0.5 rounded-md font-extrabold">
                      {earnedBadgesCount} / 4 Earned
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    {/* Badge 1: First Donation */}
                    <button
                      type="button"
                      onClick={() => handleOpenBadgeDetails('firstDonation')}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-300 flex flex-col items-center text-center space-y-1.5 relative group cursor-pointer hover:-translate-y-1 hover:shadow-md ${
                        hasDonatedVal 
                          ? 'bg-rose-50/40 border-rose-150 shadow-sm hover:shadow-md hover:scale-105' 
                          : 'bg-slate-50 border-slate-200/60 opacity-60 dashed-border'
                      }`}
                    >
                      <div className={`p-2 rounded-lg border ${
                        hasDonatedVal 
                          ? 'bg-rose-100 border-rose-200 text-rose-600' 
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        <Heart className={`h-5 w-5 ${hasDonatedVal ? 'fill-rose-500' : ''}`} />
                      </div>
                      <div className="w-full">
                        <h4 className="font-bold text-slate-800 text-[11px]">{badges.firstDonation.name}</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">{badges.firstDonation.desc}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-[8px] font-bold text-slate-400">
                            <span>Progress</span>
                            <span>{hasDonatedVal ? '1/1' : '0/1'}</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                            <div className="bg-rose-500 h-full transition-all duration-350" style={{ width: hasDonatedVal ? '100%' : '0%' }} />
                          </div>
                        </div>
                      </div>
                      {hasDonatedVal ? (
                        <span className="absolute top-1 right-2 text-[8px] font-bold text-rose-500 uppercase tracking-widest">Unlocked</span>
                      ) : (
                        <Lock className="absolute top-1.5 right-2 h-2.5 w-2.5 text-slate-350" />
                      )}
                    </button>

                    {/* Badge 2: Super Volunteer */}
                    <button
                      type="button"
                      onClick={() => handleOpenBadgeDetails('superVolunteer')}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-300 flex flex-col items-center text-center space-y-1.5 relative group cursor-pointer hover:-translate-y-1 hover:shadow-md ${
                        totalCompletedHoursVal >= 30 && isApprovedVal
                          ? 'bg-amber-50/40 border-amber-150 shadow-sm hover:shadow-md hover:scale-105' 
                          : 'bg-slate-50 border-slate-200/60 opacity-60 dashed-border'
                      }`}
                    >
                      <div className={`p-2 rounded-lg border ${
                        totalCompletedHoursVal >= 30 && isApprovedVal
                          ? 'bg-amber-100 border-amber-200 text-amber-600' 
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="w-full">
                        <h4 className="font-bold text-slate-800 text-[11px]">{badges.superVolunteer.name}</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">{badges.superVolunteer.desc}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-[8px] font-bold text-slate-400">
                            <span>Progress</span>
                            <span>{totalCompletedHoursVal} / 30 hrs</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full transition-all duration-350" style={{ width: `${Math.min(100, (totalCompletedHoursVal / 30) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                      {totalCompletedHoursVal >= 30 && isApprovedVal ? (
                        <span className="absolute top-1 right-2 text-[8px] font-bold text-amber-600 uppercase tracking-widest">Unlocked</span>
                      ) : (
                        <Lock className="absolute top-1.5 right-2 h-2.5 w-2.5 text-slate-350" />
                      )}
                    </button>

                    {/* Badge 3: Event Champion */}
                    <button
                      type="button"
                      onClick={() => handleOpenBadgeDetails('eventChampion')}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-300 flex flex-col items-center text-center space-y-1.5 relative group cursor-pointer hover:-translate-y-1 hover:shadow-md ${
                        eventCountVal >= 3 && isApprovedVal
                          ? 'bg-emerald-50/40 border-emerald-150 shadow-sm hover:shadow-md hover:scale-105' 
                          : 'bg-slate-50 border-slate-200/60 opacity-60 dashed-border'
                      }`}
                    >
                      <div className={`p-2 rounded-lg border ${
                        eventCountVal >= 3 && isApprovedVal
                          ? 'bg-emerald-100 border-emerald-200 text-emerald-600' 
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div className="w-full">
                        <h4 className="font-bold text-slate-800 text-[11px]">{badges.eventChampion.name}</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">{badges.eventChampion.desc}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-[8px] font-bold text-slate-400">
                            <span>Progress</span>
                            <span>{eventCountVal} / 3 drives</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-350" style={{ width: `${Math.min(100, (eventCountVal / 3) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                      {eventCountVal >= 3 && isApprovedVal ? (
                        <span className="absolute top-1 right-2 text-[8px] font-bold text-emerald-650 uppercase tracking-widest">Unlocked</span>
                      ) : (
                        <Lock className="absolute top-1.5 right-2 h-2.5 w-2.5 text-slate-350" />
                      )}
                    </button>

                    {/* Badge 4: Community Hero */}
                    <button
                      type="button"
                      onClick={() => handleOpenBadgeDetails('communityHero')}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-300 flex flex-col items-center text-center space-y-1.5 relative group cursor-pointer hover:-translate-y-1 hover:shadow-md ${
                        hasDonatedVal && totalCompletedHoursVal >= 30 && isApprovedVal
                          ? 'bg-indigo-50/40 border-indigo-150 shadow-sm hover:shadow-md hover:scale-105' 
                          : 'bg-slate-50 border-slate-200/60 opacity-60 dashed-border'
                      }`}
                    >
                      <div className={`p-2 rounded-lg border ${
                        hasDonatedVal && totalCompletedHoursVal >= 30 && isApprovedVal
                          ? 'bg-indigo-100 border-indigo-200 text-indigo-600' 
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        <Shield className="h-5 w-5" />
                      </div>
                      <div className="w-full">
                        <h4 className="font-bold text-slate-800 text-[11px]">{badges.communityHero.name}</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">{badges.communityHero.desc}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-[8px] font-bold text-slate-400">
                            <span>Tasks</span>
                            <span>{((hasDonatedVal ? 1 : 0) + (totalCompletedHoursVal >= 30 && isApprovedVal ? 1 : 0))} / 2</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full transition-all duration-350" style={{ width: `${((hasDonatedVal ? 1 : 0) + (totalCompletedHoursVal >= 30 && isApprovedVal ? 1 : 0)) * 50}%` }} />
                          </div>
                        </div>
                      </div>
                      {hasDonatedVal && totalCompletedHoursVal >= 30 && isApprovedVal ? (
                        <span className="absolute top-1 right-2 text-[8px] font-bold text-indigo-600 uppercase tracking-widest">Unlocked</span>
                      ) : (
                        <Lock className="absolute top-1.5 right-2 h-2.5 w-2.5 text-slate-350" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Public Wall of Supporters */}
              <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-slate-900 font-display">Supporters Wall</h3>
                  <p className="text-slate-450 text-xs leading-relaxed">
                    Live feed of recent NayePankh contributions from around the country.
                  </p>
                </div>

                <div className="space-y-4">
                  {publicDonations.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">{item.userName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{item.dateStr}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3.5 w-3.5 text-primary-500 fill-primary-500" />
                        <span className="font-black text-slate-905">₹{item.amount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SSL/Tax Certification Box */}
              <div className="bg-[#083344] border border-[#0d9488] rounded-3xl p-6 sm:p-8 text-white space-y-5">
                <div className="p-3 bg-white/10 rounded-2xl w-fit">
                  <ShieldCheck className="h-6 w-6 text-primary-350" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-black font-display text-white">Govt. Tax Deductions</h4>
                  <p className="text-secondary-100/75 text-xs leading-relaxed">
                    NayePankh Foundation is a government certified 12A & 80G nonprofit organisation. Indian passport holders are eligible for 50% tax deductions on all contributions.
                  </p>
                </div>
                <div className="pt-2">
                  <Link 
                    to="/about" 
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-350 hover:underline"
                  >
                    <span>View Certifications</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
          
        </div>
      </section>

      {/* Printable Receipt CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-receipt-content, #printable-receipt-content * {
            visibility: visible !important;
          }
          #printable-receipt-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 800px !important;
            z-index: 99999 !important;
            background: white !important;
            padding: 30px !important;
            margin: 0 auto !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div id="printable-receipt-container" className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative border border-slate-200">
            {/* Modal Actions - hidden when printing */}
            <div className="flex justify-between items-center mb-6 no-print">
              <h4 className="text-lg font-bold text-slate-955 font-display flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-primary-600" />
                <span>Tax Exemption Receipt (80G)</span>
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-750 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-sm animate-pulse"
                >
                  <Download className="h-4 w-4" />
                  <span>Print Receipt / PDF</span>
                </button>
                <button
                  onClick={() => {
                    setShowReceiptModal(false);
                    setSelectedReceipt(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-450 hover:text-slate-700 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Printable Content Frame */}
            <div id="printable-receipt-content" className="bg-white border-2 border-slate-300 p-8 sm:p-12 text-slate-800 rounded-2xl relative font-sans text-sm" style={{ minHeight: '600px', color: '#1e293b' }}>
              {/* Receipt Header Grid */}
              <div className="grid grid-cols-12 gap-4 border-b-2 border-slate-200 pb-6 items-center">
                <div className="col-span-3">
                  <img src="/logo.png" className="h-20 w-20 object-contain bg-white rounded-2xl p-1 border border-slate-100 shadow-sm" alt="NayePankh Logo" />
                </div>
                <div className="col-span-9 text-right font-semibold">
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 font-display uppercase">NayePankh Foundation</h2>
                  <p className="text-xs font-bold text-primary-600 mt-0.5">80G Tax-Exempt Contribution Receipt</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">
                    Registered office: 12A/45, Kidwai Nagar, Kanpur, Uttar Pradesh - 208011<br />
                    Email: contact@nayepankh.com | Website: www.nayepankh.com<br />
                    Govt Registration No: URN-AAATN1234F21GP01 (Sec 80G Approval)
                  </p>
                </div>
              </div>

              {/* Title Section */}
              <div className="my-6 text-center bg-slate-55 border border-slate-200 py-2.5 rounded-xl">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-900">
                  Receipt for Donation under Section 80G of Income Tax Act, 1961
                </span>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-slate-100 pb-6 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Receipt Number</span>
                  <span className="font-mono font-bold text-slate-900">REC-{selectedReceipt.paymentId?.substring(selectedReceipt.paymentId.length - 8).toUpperCase() || 'MOCK'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Date of Donation</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.dateStr}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Donor Name</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.userName || user?.name || 'Valued Donor'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Donor Email</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.userEmail || user?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Payment Method</span>
                  <span className="font-bold text-slate-900 capitalize">{selectedReceipt.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Transaction Reference ID</span>
                  <span className="font-mono text-xs text-slate-600 font-bold">{selectedReceipt.paymentId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Dedicated Cause / Category</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.category || 'General Support'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">PAN (Income Tax Dept)</span>
                  <span className="font-mono text-slate-500 font-semibold italic border-b border-slate-300 border-dashed pb-0.5 min-w-[120px] inline-block">As per profile record</span>
                </div>
              </div>

              {/* Amount Statement block */}
              <div className="py-6 border-b border-slate-200 space-y-3">
                <div className="flex justify-between items-center bg-[#10b981]/5 border border-[#10b981]/20 p-4 rounded-xl">
                  <span className="text-sm font-bold text-slate-800">Total Amount Received:</span>
                  <span className="text-xl font-black text-[#059669] font-display">₹{selectedReceipt.amount?.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="text-xs">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Amount in Words</span>
                  <span className="font-bold text-slate-800 text-sm">{numberToWords(selectedReceipt.amount)}</span>
                </div>
              </div>

              {/* Signatures & Seal section */}
              <div className="pt-8 flex justify-between items-center">
                {/* Stamp */}
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-dashed border-[#059669]/60 text-center select-none rotate-[-6deg]">
                  <div className="text-[9px] font-black uppercase text-[#059669] p-1 tracking-tighter leading-none">
                    NayePankh Foundation<br />
                    <span className="text-[7px] font-bold text-slate-500">Sec 80G Certified</span><br />
                    ★ KANPUR ★
                  </div>
                </div>

                {/* Signatory */}
                <div className="text-right space-y-1">
                  <span className="font-serif italic font-bold text-[#059669] text-xl block pb-1 border-b border-slate-200">Prashant Shukla</span>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Authorized Signatory</span>
                  <span className="text-xs font-bold text-slate-900 block">Founder & President</span>
                  <span className="text-[10px] text-slate-500 block">NayePankh Foundation</span>
                </div>
              </div>

              {/* Exemption Note */}
              <div className="mt-8 pt-6 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed text-center space-y-1">
                <p className="font-bold text-slate-700">
                  Donations to NayePankh Foundation are eligible for tax deduction under Section 80G(5)(vi) of the Income Tax Act, 1961.
                </p>
                <p>
                  This is a computer-generated document and does not require a physical signature.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Badge Details Modal */}
      {activeBadgeDetails && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-200 overflow-hidden">
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

              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 text-left space-y-3">
                <p className="text-xs text-slate-550 font-semibold leading-relaxed">
                  <strong className="text-slate-800 font-bold">Criteria:</strong> {activeBadgeDetails.requirement}
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
                  <div className="border border-slate-150 bg-slate-50 p-4 rounded-xl text-left relative">
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
