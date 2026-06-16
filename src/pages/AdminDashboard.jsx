import { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  Calendar, 
  UserCheck, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Award, 
  Sparkles,
  Copy,
  AlertCircle,
  Loader2,
  Download,
  TrendingUp,
  Leaf,
  Utensils,
  Upload,
  Mail
} from 'lucide-react';
import { 
  generateSocialPost, 
  generateDonationAppeal, 
  generateEventReport, 
  generateVolunteerThankYou,
  generateCertificateCitation
} from '../services/gemini';
import { db, isConfigured } from '../firebase/config';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [users, setUsers] = useState([
    { id: 'usr-1', name: 'Amit Kumar', email: 'amit@gmail.com', role: 'user' },
    { id: 'usr-2', name: 'Priya Sharma', email: 'priya@nayepankh.org', role: 'admin' },
    { id: 'usr-3', name: 'Rahul Varma', email: 'rahul@gmail.com', role: 'volunteer' },
    { id: 'usr-4', name: 'Sneha Patel', email: 'sneha@nayepankh.org', role: 'admin' },
  ]);

  const [volunteers, setVolunteers] = useState([
    { id: 'vol-1', name: 'Ramesh Singh', email: 'ramesh@gmail.com', phone: '9876543210', city: 'Noida', program: 'Education', status: 'pending' },
    { id: 'vol-2', name: 'Anjali Gupta', email: 'anjali@gmail.com', phone: '9123456789', city: 'Delhi', program: 'Healthcare', status: 'approved' },
    { id: 'vol-3', name: 'Vikram Rao', email: 'vikram@gmail.com', phone: '8877665544', city: 'Mumbai', program: 'Livelihood', status: 'pending' },
  ]);

  const [donations, setDonations] = useState([
    { id: 'don-1', donor: 'Suresh Raina', email: 'suresh@gmail.com', amount: 1500, frequency: 'one-time', method: 'UPI', date: '2026-06-12' },
    { id: 'don-2', donor: 'Meera Das', email: 'meera@gmail.com', amount: 3000, frequency: 'monthly', method: 'Card', date: '2026-06-11' },
    { id: 'don-3', donor: 'Karan Johar', email: 'karan@gmail.com', amount: 500, frequency: 'one-time', method: 'Netbanking', date: '2026-06-10' },
    { id: 'don-4', donor: 'Rohit Sharma', email: 'rohit@gmail.com', amount: 6000, frequency: 'one-time', method: 'UPI', date: '2026-06-09' },
  ]);

  const [events, setEvents] = useState([
    { id: 'cloth-drive', title: 'Noida Winter Clothes & Blanket Drive', date: '2026-12-20', location: 'Sector 62 Community Center, Noida', image: '/winter-camp.jpg', status: 'upcoming' },
    { id: 'health-camp', title: 'Project Swasthya Free Medical Health Camp', date: '2027-01-10', location: 'Government High School, Chhalera, UP', image: '/medical-camp.jpg', status: 'upcoming' },
    { id: 'career-fair', title: 'Swabalamban Youth Skill & Career Fair', date: '2027-02-15', location: 'Youth Center, Sector 15, Noida', image: '/career-fair.jpg', status: 'upcoming' },
  ]);

  const [registrations, setRegistrations] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', desc: '', type: 'Drive Campaign', rawType: 'drive', image: '', status: 'upcoming' });
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);

  const [mealsServedOffset, setMealsServedOffset] = useState(0);
  const [treesPlantedOffset, setTreesPlantedOffset] = useState(0);
  const [beneficiariesOffset, setBeneficiariesOffset] = useState(0);
  const [simulatedDonationsOffset, setSimulatedDonationsOffset] = useState(0);

  const [aiTool, setAiTool] = useState('social');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const [socialInputs, setSocialInputs] = useState({ title: '', platform: 'Twitter', tone: 'inspiring', achievements: '' });
  const [appealInputs, setAppealInputs] = useState({ cause: '', targetAmount: '', targetAudience: '' });
  const [reportInputs, setReportInputs] = useState({ eventName: '', reachCount: '', hoursContributed: '', summaries: '' });
  const [appreciationInputs, setAppreciationInputs] = useState({ volunteerEmail: '', volunteerName: '', contributions: '', program: 'Project Shiksha' });

  const [certInputs, setCertInputs] = useState({
    volunteerEmail: '',
    volunteerName: '',
    eventTitle: 'Noida Winter Clothes & Blanket Drive',
    contributions: '',
    hours: '6',
    date: new Date().toISOString().split('T')[0]
  });
  const [certUploading, setCertUploading] = useState(false);
  const [certUploaded, setCertUploaded] = useState(false);

  const [sendingAppreciationEmail, setSendingAppreciationEmail] = useState(false);
  const [appreciationEmailSent, setAppreciationEmailSent] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('naye_pankh_admin_notifications') || '[]');
    setNotifications(logs);
    if (logs.length > 0 && !selectedNotification) {
      setSelectedNotification(logs[0]);
    }
  }, [activeTab]);

  const handleClearNotifications = () => {
    localStorage.removeItem('naye_pankh_admin_notifications');
    setNotifications([]);
    setSelectedNotification(null);
    alert("Notifications logs cleared successfully!");
  };

  const handleSendAppreciationEmail = async () => {
    if (!appreciationInputs.volunteerEmail || !aiOutput) return;
    setSendingAppreciationEmail(true);
    setAppreciationEmailSent(false);

    try {
      const subject = encodeURIComponent("Thank You for Your Support - NayePankh Foundation");
      const body = encodeURIComponent(aiOutput);
      const mailtoUrl = `mailto:${appreciationInputs.volunteerEmail}?subject=${subject}&body=${body}`;
      
      window.location.href = mailtoUrl;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSendingAppreciationEmail(false);
      setAppreciationEmailSent(true);
      alert(`Success! Opened your email client with a pre-filled appreciation draft for ${appreciationInputs.volunteerName} (${appreciationInputs.volunteerEmail}).`);
    } catch (err) {
      console.error("Error launching mail client:", err);
      setSendingAppreciationEmail(false);
    }
  };

  const [sigImage, setSigImage] = useState(() => localStorage.getItem('naye_pankh_signature') || '');
  const [stampImage, setStampImage] = useState(() => localStorage.getItem('naye_pankh_stamp') || '');

  const handleUploadSignature = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSigImage(reader.result);
        localStorage.setItem('naye_pankh_signature', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadStamp = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStampImage(reader.result);
        localStorage.setItem('naye_pankh_stamp', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetAssets = () => {
    setSigImage('');
    setStampImage('');
    localStorage.removeItem('naye_pankh_signature');
    localStorage.removeItem('naye_pankh_stamp');
  };

  // Load Firestore and localStorage data
  useEffect(() => {
    // 1. Fetch Users
    if (isConfigured) {
      getDocs(collection(db, 'users'))
        .then(snap => {
          const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (list.length > 0) setUsers(list);
        })
        .catch(err => console.error("Error fetching users:", err));
    }

    // 2. Fetch Donations
    if (isConfigured) {
      getDocs(collection(db, 'donations'))
        .then(snap => {
          const list = snap.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              donor: data.donor || data.name || data.userEmail?.split('@')[0] || 'Anonymous',
              email: data.email || data.userEmail || 'guest@example.com',
              amount: data.amount || 0,
              frequency: data.frequency || 'one-time',
              method: data.paymentMethod || data.method || 'UPI',
              date: data.timestamp?.toDate ? data.timestamp.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            };
          });
          if (list.length > 0) setDonations(list);
        })
        .catch(err => console.error("Error fetching donations:", err));
    }

    // 3. Fetch other collections in independent blocks
    async function loadDashboardData() {
      let regList = [];
      let certList = [];
      let eventList = [];
      let volList = [];

      if (isConfigured) {
        // Fetch eventRegistrations
        try {
          const regSnap = await getDocs(collection(db, 'eventRegistrations'));
          regList = regSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
          console.error("Error fetching Firestore registrations:", err);
        }

        // Fetch certificates
        try {
          const certSnap = await getDocs(collection(db, 'certificates'));
          certList = certSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
          console.error("Error fetching Firestore certificates:", err);
        }

        // Fetch events
        try {
          const eventSnap = await getDocs(collection(db, 'events'));
          eventList = eventSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
          console.error("Error fetching Firestore events:", err);
        }

        // Fetch volunteers
        try {
          const volSnap = await getDocs(collection(db, 'volunteers'));
          volList = volSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
          console.error("Error fetching Firestore volunteers:", err);
        }
      }

      // Merge eventRegistrations
      const savedRegs = JSON.parse(localStorage.getItem('naye_pankh_event_registrations') || '[]');
      const combinedRegs = [...regList];
      savedRegs.forEach(s => {
        if (!combinedRegs.some(c => c.id === s.id || (c.eventId === s.eventId && c.email === s.email))) {
          combinedRegs.push(s);
        }
      });
      setRegistrations(combinedRegs);

      // Merge certificates
      const savedCerts = JSON.parse(localStorage.getItem('naye_pankh_certificates') || '[]');
      const combinedCerts = [...certList];
      savedCerts.forEach(sc => {
        if (!combinedCerts.some(c => c.certificateId === sc.certificateId)) {
          combinedCerts.push(sc);
        }
      });
      setCertificates(combinedCerts);

      // Merge events
      const defaultEvents = [
        { id: 'cloth-drive', title: 'Noida Winter Clothes & Blanket Drive', date: '2026-12-20', location: 'Sector 62 Community Center, Noida', image: '/winter-camp.jpg', status: 'upcoming' },
        { id: 'health-camp', title: 'Project Swasthya Free Medical Health Camp', date: '2027-01-10', location: 'Government High School, Chhalera, UP', image: '/medical-camp.jpg', status: 'upcoming' },
        { id: 'career-fair', title: 'Swabalamban Youth Skill & Career Fair', date: '2027-02-15', location: 'Youth Center, Sector 15, Noida', image: '/career-fair.jpg', status: 'upcoming' },
      ];
      const savedEvents = JSON.parse(localStorage.getItem('naye_pankh_events') || '[]');
      const combinedEvents = [...eventList];
      savedEvents.forEach(se => {
        if (!combinedEvents.some(e => e.id === se.id)) {
          combinedEvents.push(se);
        }
      });
      defaultEvents.forEach(de => {
        if (!combinedEvents.some(e => e.id === de.id || e.title === de.title)) {
          combinedEvents.push(de);
        }
      });
      if (combinedEvents.length > 0) {
        setEvents(combinedEvents);
      }

      // Merge volunteers
      const defaultVolunteers = [
        { id: 'vol-1', name: 'Ramesh Singh', email: 'ramesh@gmail.com', phone: '9876543210', city: 'Noida', program: 'Education', status: 'pending' },
        { id: 'vol-2', name: 'Anjali Gupta', email: 'anjali@gmail.com', phone: '9123456789', city: 'Delhi', program: 'Healthcare', status: 'approved' },
        { id: 'vol-3', name: 'Vikram Rao', email: 'vikram@gmail.com', phone: '8877665544', city: 'Mumbai', program: 'Livelihood', status: 'pending' },
      ];
      const savedVolunteers = JSON.parse(localStorage.getItem('naye_pankh_volunteers') || '[]');
      const combinedVolunteers = [...volList];
      savedVolunteers.forEach(sv => {
        const idx = combinedVolunteers.findIndex(v => v.id === sv.id || v.email === sv.email);
        if (idx !== -1) {
          combinedVolunteers[idx] = { ...combinedVolunteers[idx], ...sv };
        } else {
          combinedVolunteers.push(sv);
        }
      });
      defaultVolunteers.forEach(dv => {
        const idx = combinedVolunteers.findIndex(v => v.id === dv.id || v.email === dv.email);
        if (idx !== -1) {
          // keep existing if already merged (e.g. from local storage status updates)
        } else {
          combinedVolunteers.push(dv);
        }
      });
      if (combinedVolunteers.length > 0) {
        setVolunteers(combinedVolunteers);
      }
    }
    loadDashboardData();
  }, []);

  const handleToggleRole = async (id) => {
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;
    const nextRole = userToUpdate.role === 'admin' ? 'user' : userToUpdate.role === 'user' ? 'volunteer' : 'admin';

    if (isConfigured) {
      try {
        await updateDoc(doc(db, 'users', id), { role: nextRole });
        setUsers(users.map(u => u.id === id ? { ...u, role: nextRole } : u));
      } catch (err) {
        console.error("Error updating role in Firestore:", err);
      }
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, role: nextRole } : u));
    }
  };

  const handleApproveVolunteer = (id) => {
    // Optimistic UI update & localStorage persistence
    const updatedVolunteers = volunteers.map(v => v.id === id ? { ...v, status: 'approved' } : v);
    setVolunteers(updatedVolunteers);
    localStorage.setItem('naye_pankh_volunteers', JSON.stringify(updatedVolunteers));

    if (isConfigured && !id.startsWith('vol-') && !id.startsWith('local-')) {
      updateDoc(doc(db, 'volunteers', id), { status: 'approved' })
        .then(() => console.log("Volunteer approved in Firestore"))
        .catch(err => console.error("Error approving volunteer in Firestore:", err));
    }
  };

  const handleRejectVolunteer = (id) => {
    // Optimistic UI update & localStorage persistence
    const updatedVolunteers = volunteers.map(v => v.id === id ? { ...v, status: 'rejected' } : v);
    setVolunteers(updatedVolunteers);
    localStorage.setItem('naye_pankh_volunteers', JSON.stringify(updatedVolunteers));

    if (isConfigured && !id.startsWith('vol-') && !id.startsWith('local-')) {
      updateDoc(doc(db, 'volunteers', id), { status: 'rejected' })
        .then(() => console.log("Volunteer rejected in Firestore"))
        .catch(err => console.error("Error rejecting volunteer in Firestore:", err));
    }
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.image) {
      alert("Please upload a showcase picture for this event.");
      return;
    }
    if (newEvent.title && newEvent.date && newEvent.location) {
      const eventToSave = {
        title: newEvent.title,
        date: newEvent.date,
        location: newEvent.location,
        desc: newEvent.desc || 'Join our campaign to support the community.',
        type: newEvent.type || 'Drive Campaign',
        rawType: newEvent.rawType || 'drive',
        image: newEvent.image,
        status: newEvent.status || 'upcoming'
      };

      const docId = `evt-${Date.now()}`;

      // Optimistic UI update & localStorage persistence
      const updatedEvents = [...events, { ...eventToSave, id: docId }];
      setEvents(updatedEvents);
      localStorage.setItem('naye_pankh_events', JSON.stringify(updatedEvents));
      window.dispatchEvent(new Event('naye_pankh_local_events_update'));
      setNewEvent({ title: '', date: '', location: '', desc: '', type: 'Drive Campaign', rawType: 'drive', image: '', status: 'upcoming' });

      // Non-blocking Firestore write
      if (isConfigured) {
        addDoc(collection(db, 'events'), {
          ...eventToSave,
          timestamp: serverTimestamp()
        })
        .then(docRef => console.log("Event created in Firestore with ID:", docRef.id))
        .catch(err => console.error("Error creating event in Firestore:", err));
      }
    }
  };

  const handleDeleteEvent = (id) => {
    // Optimistic UI update & localStorage persistence
    const updatedEvents = events.filter(e => e.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('naye_pankh_events', JSON.stringify(updatedEvents));
    window.dispatchEvent(new Event('naye_pankh_local_events_update'));

    // Non-blocking Firestore deletion
    if (isConfigured && !id.startsWith('evt-') && !id.startsWith('local-') && id !== 'cloth-drive' && id !== 'health-camp' && id !== 'career-fair') {
      deleteDoc(doc(db, 'events', id))
        .then(() => console.log("Event deleted from Firestore"))
        .catch(err => console.error("Error deleting event in Firestore:", err));
    }
  };

  const handleDeleteRegistration = async (id) => {
    if (isConfigured) {
      try {
        await deleteDoc(doc(db, 'eventRegistrations', id));
        setRegistrations(registrations.filter(r => r.id !== id));
      } catch (err) {
        console.error("Error deleting registration in Firestore:", err);
      }
    } else {
      const filtered = registrations.filter((r, idx) => r.id !== id && idx !== id);
      setRegistrations(filtered);
      localStorage.setItem('naye_pankh_event_registrations', JSON.stringify(filtered));
    }
  };

  const handleMarkAttended = async (reg) => {
    // eslint-disable-next-line react-hooks/purity
    const certId = 'CERT-EVT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    
    if (isConfigured && reg.id && !String(reg.id).startsWith('local-')) {
      try {
        await updateDoc(doc(db, 'eventRegistrations', reg.id), { status: 'attended' });
      } catch (err) {
        console.error("Error marking attended in Firestore:", err);
      }
    }
    
    const updatedRegs = registrations.map(r => 
      (r.id === reg.id || (r.eventId === reg.eventId && r.email === reg.email)) 
        ? { ...r, status: 'attended' } 
        : r
    );
    setRegistrations(updatedRegs);
    localStorage.setItem('naye_pankh_event_registrations', JSON.stringify(updatedRegs));

    const certData = {
      certificateId: certId,
      userId: reg.userId || 'guest',
      name: reg.name,
      email: reg.email,
      eventId: reg.eventId,
      eventTitle: reg.eventTitle || 'NayePankh Campaign Drive',
      date: formattedDate,
      hours: 6,
      signatureUrl: sigImage || '',
      stampUrl: stampImage || ''
    };

    if (isConfigured) {
      try {
        await addDoc(collection(db, 'certificates'), {
          ...certData,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Error creating certificate in Firestore:", err);
      }
    }

    const savedCerts = JSON.parse(localStorage.getItem('naye_pankh_certificates') || '[]');
    savedCerts.push(certData);
    localStorage.setItem('naye_pankh_certificates', JSON.stringify(savedCerts));
    
    setCertificates(prev => [...prev, certData]);
    
    alert(`Success! ${reg.name} has been marked as attended. Certificate ${certId} generated.`);
  };

  const handleViewCertificate = (reg) => {
    const cert = certificates.find(c => 
      c.email === reg.email && c.eventId === reg.eventId
    );
    if (cert) {
      setSelectedCertificate(cert);
      setShowCertModal(true);
    } else {
      const tempCert = {
        // eslint-disable-next-line react-hooks/purity
        certificateId: 'CERT-TMP-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        userId: reg.userId || 'guest',
        name: reg.name,
        email: reg.email,
        eventId: reg.eventId,
        eventTitle: reg.eventTitle || 'NayePankh Campaign Drive',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        hours: 6
      };
      setSelectedCertificate(tempCert);
      setShowCertModal(true);
    }
  };

  const handleSelectVolunteerForCert = (email) => {
    const vol = volunteers.find(v => v.email === email);
    if (vol) {
      setCertInputs({
        ...certInputs,
        volunteerEmail: vol.email,
        volunteerName: vol.name
      });
    } else {
      setCertInputs({
        ...certInputs,
        volunteerEmail: email,
        volunteerName: ''
      });
    }
  };

  const handleUploadCertFromAi = async () => {
    if (!certInputs.volunteerName || !certInputs.volunteerEmail || !aiOutput) return;
    setCertUploading(true);
    setCertUploaded(false);

    const certId = 'CERT-AI-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const formattedDate = new Date(certInputs.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const certData = {
      certificateId: certId,
      userId: 'guest',
      name: certInputs.volunteerName,
      email: certInputs.volunteerEmail,
      eventId: 'evt-' + Date.now(),
      eventTitle: certInputs.eventTitle,
      date: formattedDate,
      hours: parseInt(certInputs.hours) || 6,
      citation: aiOutput,
      signatureUrl: sigImage || '',
      stampUrl: stampImage || ''
    };

    if (isConfigured) {
      try {
        await addDoc(collection(db, 'certificates'), {
          ...certData,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Error saving certificate in Firestore:", err);
      }
    }

    const savedCerts = JSON.parse(localStorage.getItem('naye_pankh_certificates') || '[]');
    savedCerts.push(certData);
    localStorage.setItem('naye_pankh_certificates', JSON.stringify(savedCerts));
    setCertificates(prev => [...prev, certData]);

    setCertUploading(false);
    setCertUploaded(true);
    alert(`Success! Certificate ${certId} created and uploaded to ${certInputs.volunteerName}'s profile.`);
  };

  const handleGenerateContent = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError('');
    setAiOutput('');
    setCopied(false);
    setCertUploaded(false);
    setAppreciationEmailSent(false);

    try {
      let result = '';
      if (aiTool === 'social') {
        if (!socialInputs.title || !socialInputs.achievements) throw new Error('Please enter campaign title and key achievements.');
        result = await generateSocialPost(socialInputs.title, socialInputs.platform, socialInputs.tone, socialInputs.achievements);
      } else if (aiTool === 'appeal') {
        if (!appealInputs.cause || !appealInputs.targetAmount) throw new Error('Please specify fundraising cause and target amount.');
        result = await generateDonationAppeal(appealInputs.cause, appealInputs.targetAmount, appealInputs.targetAudience || 'General Donors');
      } else if (aiTool === 'report') {
        if (!reportInputs.eventName || !reportInputs.reachCount) throw new Error('Please fill out event name and reach counts.');
        result = await generateEventReport(reportInputs.eventName, reportInputs.reachCount, reportInputs.hoursContributed || '0', reportInputs.summaries);
      } else if (aiTool === 'appreciation') {
        if (!appreciationInputs.volunteerName || !appreciationInputs.contributions) throw new Error('Please specify volunteer name and contributions.');
        result = await generateVolunteerThankYou(appreciationInputs.volunteerName, appreciationInputs.contributions, appreciationInputs.program);
      } else if (aiTool === 'certificate') {
        if (!certInputs.volunteerName || !certInputs.volunteerEmail || !certInputs.eventTitle) {
          throw new Error('Please enter volunteer name, email and event title.');
        }
        result = await generateCertificateCitation(certInputs.volunteerName, certInputs.eventTitle, certInputs.contributions || 'their dedicated service');
      }
      setAiOutput(result);
    } catch (err) {
      setAiError(err.message || 'An error occurred during generation.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (aiOutput) {
      navigator.clipboard.writeText(aiOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalDonationSum = donations.reduce((acc, curr) => acc + curr.amount, 0) + 1245000 + simulatedDonationsOffset;
  const totalVolunteersCount = volunteers.length + 2480;
  const totalEventsCount = events.length + 9;
  const totalBeneficiariesCount = 15200 + beneficiariesOffset + donations.length * 12 + volunteers.length * 15;
  const totalTreesCount = 4200 + treesPlantedOffset;
  const totalMealsCount = 8500 + mealsServedOffset;

  return (
    <div className="min-h-screen bg-slate-50 pt-36 md:pt-44 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Title Banner */}
        <div className="bg-white text-slate-900 border border-slate-200/80 rounded-3xl p-8 mb-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-80 h-80 bg-primary-100/30 rounded-full blur-3xl" />
          <div className="flex items-center space-x-3 mb-4 relative z-10">
            <img src="/logo.png" className="h-12 w-12 object-contain bg-white rounded-2xl p-0.5 shadow-sm border border-slate-200" alt="NayePankh Logo" />
            <div>
              <h1 className="text-3xl font-black font-display text-slate-900">Admin Hub</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">80G & 12A Certified Foundation</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-2 relative z-10">Monitor donations, manage roles, audit volunteer signups, and utilize Gemini AI writing engines.</p>
        </div>

        {/* Analytics KPIs Row */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Donations</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">₹{totalDonationSum.toLocaleString('en-IN')}</h3>
                <p className="text-[10px] text-emerald-500 font-bold mt-0.5">+12.4% from last month</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-secondary-50 text-secondary-600 rounded-xl">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Volunteers</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{totalVolunteersCount.toLocaleString()}</h3>
                <p className="text-[10px] text-emerald-500 font-bold mt-0.5">+48 registered this week</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-accent-50 text-accent-600 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Registered Users</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{users.length + 3840}</h3>
                <p className="text-[10px] text-emerald-500 font-bold mt-0.5">+120 since system launch</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Campaigns</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{totalEventsCount}</h3>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">3 items scheduled soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Tabs Nav */}
        <div className="flex space-x-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
          {['overview', 'analytics', 'users', 'volunteers', 'donations', 'events', 'registrations', 'certificates', 'ai-assistant', 'notifications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-bold capitalize transition-all duration-200 shrink-0 border-b-2 rounded-t-lg -mb-px flex items-center space-x-1.5 ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'ai-assistant' && <Sparkles className="h-4 w-4 text-accent-500 shrink-0" />}
              {tab === 'notifications' && <Mail className="h-4 w-4 text-primary-500 shrink-0" />}
              <span>
                {tab === 'ai-assistant' 
                  ? 'Gemini AI Hub' 
                  : tab === 'registrations' 
                    ? 'Event Registrations' 
                    : tab === 'certificates' 
                      ? 'Event Certificates' 
                      : tab === 'analytics'
                        ? 'Live Analytics'
                        : tab === 'notifications'
                          ? 'Admin Notifications'
                          : tab}
              </span>
            </button>
          ))}
        </div>

        {/* Dashboard Panels */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
          
          {/* Tab 1: Overview Panel */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 font-display">System Status Overview</h2>
                <span className="text-xs font-bold text-slate-400 uppercase">Updates live</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="border border-slate-200/80 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                    Recent Sponsorship Transactions
                  </h3>
                  <div className="divide-y divide-slate-100">
                    {donations.map(don => (
                      <div key={don.id} className="py-3 flex justify-between items-center text-sm">
                        <div>
                          <p className="font-bold text-slate-800">{don.donor}</p>
                          <p className="text-slate-400 text-xs">{don.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">₹{don.amount.toLocaleString()}</p>
                          <span className="text-[10px] uppercase font-bold text-primary-500">{don.frequency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200/80 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                    Recent Volunteer Submissions
                  </h3>
                  <div className="divide-y divide-slate-100">
                    {volunteers.map(vol => (
                      <div key={vol.id} className="py-3 flex justify-between items-center text-sm">
                        <div>
                          <p className="font-bold text-slate-800">{vol.name}</p>
                          <p className="text-slate-400 text-xs">{vol.city} · {vol.program}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                          vol.status === 'approved' 
                            ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                            : vol.status === 'rejected'
                              ? 'bg-red-50 text-red-500 border border-red-100'
                              : 'bg-amber-50 text-amber-500 border border-amber-100'
                        }`}>
                          {vol.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1.5: Live Analytics Panel */}
          {activeTab === 'analytics' && (
            <div className="space-y-10">
              
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">Live Impact Analytics</h2>
                  <p className="text-xs text-slate-500 mt-1">Real-time indicators, target progressions, and ground activity statistics.</p>
                </div>
              </div>

              {/* Counter Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Donations</span>
                    <TrendingUp className="h-4.5 w-4.5 text-primary-500" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-black text-slate-900 leading-tight">₹{totalDonationSum.toLocaleString('en-IN')}</h3>
                    <p className="text-[9px] text-emerald-500 font-bold mt-1">Live from payment ledger</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Volunteers</span>
                    <Users className="h-4.5 w-4.5 text-secondary-500" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{totalVolunteersCount.toLocaleString()}</h3>
                    <p className="text-[9px] text-emerald-500 font-bold mt-1">Active crew base</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Campaign Drives</span>
                    <Calendar className="h-4.5 w-4.5 text-accent-500" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{totalEventsCount}</h3>
                    <p className="text-[9px] text-slate-500 font-bold mt-1">Completed / Scheduled</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Beneficiaries</span>
                    <Heart className="h-4.5 w-4.5 text-rose-500" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{totalBeneficiariesCount.toLocaleString()}</h3>
                    <p className="text-[9px] text-primary-500 font-bold mt-1">Direct support reach</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Trees Planted</span>
                    <Leaf className="h-4.5 w-4.5 text-emerald-500" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{totalTreesCount.toLocaleString()}</h3>
                    <p className="text-[9px] text-emerald-500 font-bold mt-1">Project Green wing</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/60 p-4.5 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Meals Served</span>
                    <Utensils className="h-4.5 w-4.5 text-amber-500" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{totalMealsCount.toLocaleString()}</h3>
                    <p className="text-[9px] text-amber-500 font-bold mt-1">Nutrition distribution</p>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Donation Growth Trend Area Chart */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">Donation Revenue Growth Trend</h3>
                    <p className="text-[11px] text-slate-450 mt-0.5">Cumulative monthly fundraising ledger comparison (Jan - Jun 2026).</p>
                  </div>
                  <div className="h-[220px] w-full pt-4">
                    <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity="0.25"/>
                          <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0.00"/>
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="50" y1="40" x2="450" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="50" y1="100" x2="450" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="50" y1="160" x2="450" y2="160" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="50" y1="180" x2="450" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
                      <line x1="50" y1="40" x2="50" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                      {/* Y-Axis labels */}
                      <text x="12" y="44" className="text-[9px] fill-slate-400 font-bold">1.5M</text>
                      <text x="12" y="104" className="text-[9px] fill-slate-400 font-bold">1.0M</text>
                      <text x="12" y="164" className="text-[9px] fill-slate-400 font-bold">0.5M</text>

                      {/* Area Path */}
                      <path
                        d={`M 50,180 L 50,${180 - (180000 / 1500000) * 140} L 130,${180 - (220000 / 1500000) * 140} L 210,${180 - (195000 / 1500000) * 140} L 290,${180 - (260000 / 1500000) * 140} L 370,${180 - (290000 / 1500000) * 140} L 450,${180 - (Math.min(1500000, totalDonationSum) / 1500000) * 140} L 450,180 Z`}
                        fill="url(#donationGradient)"
                      />

                      {/* Line Path */}
                      <path
                        d={`M 50,${180 - (180000 / 1500000) * 140} L 130,${180 - (220000 / 1500000) * 140} L 210,${180 - (195000 / 1500000) * 140} L 290,${180 - (260000 / 1500000) * 140} L 370,${180 - (290000 / 1500000) * 140} L 450,${180 - (Math.min(1500000, totalDonationSum) / 1500000) * 140}`}
                        fill="none"
                        stroke="rgb(236, 72, 153)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Dots */}
                      <circle cx="50" cy={180 - (180000 / 1500000) * 140} r="4.5" fill="white" stroke="rgb(236, 72, 153)" strokeWidth="2.5" />
                      <circle cx="130" cy={180 - (220000 / 1500000) * 140} r="4.5" fill="white" stroke="rgb(236, 72, 153)" strokeWidth="2.5" />
                      <circle cx="210" cy={180 - (195000 / 1500000) * 140} r="4.5" fill="white" stroke="rgb(236, 72, 153)" strokeWidth="2.5" />
                      <circle cx="290" cy={180 - (260000 / 1500000) * 140} r="4.5" fill="white" stroke="rgb(236, 72, 153)" strokeWidth="2.5" />
                      <circle cx="370" cy={180 - (290000 / 1500000) * 140} r="4.5" fill="white" stroke="rgb(236, 72, 153)" strokeWidth="2.5" />
                      <circle cx="450" cy={180 - (Math.min(1500000, totalDonationSum) / 1500000) * 140} r="4.5" fill="white" stroke="rgb(236, 72, 153)" strokeWidth="2.5" />

                      {/* X-Axis Labels */}
                      <text x="50" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Jan</text>
                      <text x="130" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Feb</text>
                      <text x="210" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Mar</text>
                      <text x="290" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Apr</text>
                      <text x="370" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">May</text>
                      <text x="450" y="196" textAnchor="middle" className="text-[10px] fill-slate-500 font-bold">Jun</text>
                    </svg>
                  </div>
                </div>

                {/* Target Progress Bar Chart */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-display">Social Impact Targets</h3>
                    <p className="text-[11px] text-slate-455 mt-0.5">Progression of active drives towards annual target milestones.</p>
                  </div>

                  <div className="space-y-5">
                    {/* Beneficiaries Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800">Beneficiaries Helped</span>
                        <span className="text-slate-500 font-bold">{totalBeneficiariesCount.toLocaleString()} / 20,000</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="h-full bg-rose-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (totalBeneficiariesCount / 20000) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Trees Planted Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800">Trees Planted</span>
                        <span className="text-slate-500 font-bold">{totalTreesCount.toLocaleString()} / 5,000</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (totalTreesCount / 5000) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Meals Served Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800">Meals Served</span>
                        <span className="text-slate-500 font-bold">{totalMealsCount.toLocaleString()} / 10,000</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (totalMealsCount / 10000) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-500/5 border border-primary-500/10 p-4 rounded-xl text-xs text-primary-750 font-semibold space-y-1">
                    <p className="font-bold text-slate-850">🎯 Milestone Target Progress Overview</p>
                    <p className="text-slate-500 font-medium text-[11px] leading-relaxed">
                      Projected timelines estimate hitting all 3 target milestones by November 2026 based on the current volunteer support indices.
                    </p>
                  </div>
                </div>

              </div>

              {/* Real-time stats simulator control panel */}
              <div className="bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="h-5.5 w-5.5 text-accent-400 shrink-0 animate-pulse" />
                  <div>
                    <h3 className="text-base font-bold font-display">Real-Time Stats Simulator</h3>
                    <p className="text-xs text-slate-400 font-medium">Trigger simulated volunteer activities to watch live counters and SVG charts increment instantly.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  <button
                    onClick={() => {
                      setMealsServedOffset(prev => prev + 500);
                      setBeneficiariesOffset(prev => prev + 120);
                      alert("Simulated Ground Food Drive: +500 Meals Served, +120 Beneficiaries Helped!");
                    }}
                    className="p-4 bg-slate-800 border border-slate-700/60 hover:bg-slate-750 rounded-2xl text-center text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm flex flex-col items-center justify-center space-y-2 text-white"
                  >
                    <Utensils className="h-5 w-5 text-amber-400" />
                    <span>Food Drive (+500 Meals)</span>
                  </button>

                  <button
                    onClick={() => {
                      setTreesPlantedOffset(prev => prev + 100);
                      setBeneficiariesOffset(prev => prev + 30);
                      alert("Simulated Tree Plantation Drive: +100 Trees Planted, +30 Beneficiaries Helped!");
                    }}
                    className="p-4 bg-slate-800 border border-slate-700/60 hover:bg-slate-750 rounded-2xl text-center text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm flex flex-col items-center justify-center space-y-2 text-white"
                  >
                    <Leaf className="h-5 w-5 text-emerald-400" />
                    <span>Tree Planting (+100 Trees)</span>
                  </button>

                  <button
                    onClick={() => {
                      setBeneficiariesOffset(prev => prev + 250);
                      alert("Simulated Health Camp Drive: +250 Beneficiaries Helped!");
                    }}
                    className="p-4 bg-slate-800 border border-slate-700/60 hover:bg-slate-750 rounded-2xl text-center text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm flex flex-col items-center justify-center space-y-2 text-white"
                  >
                    <Heart className="h-5 w-5 text-rose-400" />
                    <span>Health Camp (+250 People)</span>
                  </button>

                  <button
                    onClick={() => {
                      setSimulatedDonationsOffset(prev => prev + 25000);
                      alert("Simulated Corporate Grant Received: +₹25,000 Total Donations!");
                    }}
                    className="p-4 bg-slate-800 border border-slate-700/60 hover:bg-slate-750 rounded-2xl text-center text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm flex flex-col items-center justify-center space-y-2 text-white"
                  >
                    <TrendingUp className="h-5 w-5 text-primary-400" />
                    <span>Corporate Grant (+₹25K)</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: User Management Panel */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 font-display">User Role Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="pb-3 pr-4">User Details</th>
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Current Role</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="py-4 font-bold text-slate-800">{u.name}</td>
                        <td className="py-4 text-slate-500">{u.email}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                            u.role === 'admin' 
                              ? 'bg-primary-50 text-primary-600 border border-primary-100'
                              : u.role === 'volunteer'
                                ? 'bg-secondary-50 text-secondary-600 border border-secondary-100'
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleToggleRole(u.id)}
                            className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Cycle Role
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Volunteer Management Panel */}
          {activeTab === 'volunteers' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 font-display">Volunteer Applications Auditing</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 pr-4">Contact Info</th>
                      <th className="pb-3 pr-4">City / Program</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 text-right">Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {volunteers.map(v => (
                      <tr key={v.id} className="hover:bg-slate-50/50">
                        <td className="py-4 font-bold text-slate-800">{v.name}</td>
                        <td className="py-4 text-xs text-slate-500 space-y-0.5">
                          <p>{v.email}</p>
                          <p>{v.phone}</p>
                        </td>
                        <td className="py-4 text-slate-500">{v.city} · <span className="font-semibold text-slate-700">{v.program}</span></td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                            v.status === 'approved' 
                              ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                              : v.status === 'rejected'
                                ? 'bg-red-50 text-red-500 border border-red-100'
                                : 'bg-amber-50 text-amber-500 border border-amber-100'
                          }`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {v.status === 'pending' ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleApproveVolunteer(v.id)}
                                className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-150 rounded-lg transition-colors"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectVolunteer(v.id)}
                                className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-150 rounded-lg transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 uppercase">Audited</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Donations Panel */}
          {activeTab === 'donations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 font-display">Donation Ledger</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="pb-3 pr-4">Donor Name</th>
                      <th className="pb-3 pr-4">Email</th>
                      <th className="pb-3 pr-4">Amount (INR)</th>
                      <th className="pb-3 pr-4">Type</th>
                      <th className="pb-3 pr-4">Method / Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {donations.map(don => (
                      <tr key={don.id} className="hover:bg-slate-50/50">
                        <td className="py-4 font-bold text-slate-800">{don.donor}</td>
                        <td className="py-4 text-slate-500">{don.email}</td>
                        <td className="py-4 font-extrabold text-slate-900">₹{don.amount.toLocaleString()}</td>
                        <td className="py-4">
                          <span className="text-xs uppercase font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                            {don.frequency}
                          </span>
                        </td>
                        <td className="py-4 text-xs text-slate-500">
                          <p>{don.method}</p>
                          <p>{don.date}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5: Event Management Panel */}
          {activeTab === 'events' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 font-display">Campaign & Event Manager</h2>
                <span className="text-xs text-slate-400 font-bold uppercase">{events.length} Active Items</span>
              </div>

              <form onSubmit={handleAddEvent} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Event Title</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="e.g. Slum Health drive"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    required
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="e.g. Sector 5, Noida"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Event Description</label>
                  <input
                    type="text"
                    required
                    value={newEvent.desc}
                    onChange={(e) => setNewEvent({ ...newEvent, desc: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Short description showcasing the event's goals..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Event Type</label>
                  <select
                    value={newEvent.rawType}
                    onChange={(e) => {
                      const val = e.target.value;
                      const typeMap = {
                        drive: 'Drive Campaign',
                        medical: 'Medical Camp',
                        skill: 'Skill Development'
                      };
                      setNewEvent({ ...newEvent, rawType: val, type: typeMap[val] });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                  >
                    <option value="drive">Drive Campaign</option>
                    <option value="medical">Medical Camp</option>
                    <option value="skill">Skill Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Showcase Image (Required)</label>
                  <input
                    type="file"
                    accept="image/*"
                    required={!newEvent.image}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewEvent(prev => ({ ...prev, image: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-1.5 text-xs focus:outline-none focus:border-primary-500 transition-colors file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 cursor-pointer"
                  />
                </div>

                {newEvent.image && (
                  <div className="sm:col-span-4 flex items-center space-x-3 bg-white border border-slate-200 p-2.5 rounded-xl">
                    <img src={newEvent.image} className="h-14 w-20 object-cover rounded-lg border border-slate-200 shadow-sm" alt="Preview" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-emerald-600">✓ Image Loaded Successfully</p>
                      <button 
                        type="button" 
                        onClick={() => setNewEvent(prev => ({ ...prev, image: '' }))} 
                        className="text-[10px] text-red-500 font-bold hover:underline"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="sm:col-span-4 flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-brand-navy hover:bg-brand-plum text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Campaign</span>
                  </button>
                </div>
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="pb-3 pr-4">Event Campaign</th>
                      <th className="pb-3 pr-4">Scheduled Date</th>
                      <th className="pb-3 pr-4">Location</th>
                      <th className="pb-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {events.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50/50">
                        <td className="py-4 font-bold text-slate-800 flex items-center space-x-3">
                          {e.image && (
                            <img src={e.image} alt={e.title} className="h-8 w-11 object-cover rounded-lg border border-slate-200 shadow-sm shrink-0" />
                          )}
                          <span>{e.title}</span>
                        </td>
                        <td className="py-4 text-slate-500">{e.date}</td>
                        <td className="py-4 text-slate-500 font-semibold">{e.location}</td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteEvent(e.id)}
                            className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 rounded-lg transition-colors inline-flex"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5.5: Event Registrations Panel */}
          {activeTab === 'registrations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 font-display">Event Registrations</h2>
                <span className="text-xs text-slate-400 font-bold uppercase">{registrations.length} Total Registrations</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="pb-3 pr-4">Registrant Info</th>
                      <th className="pb-3 pr-4">Contact Details</th>
                      <th className="pb-3 pr-4">Event Campaign</th>
                      <th className="pb-3 pr-4">Special Notes</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-400 text-sm">
                          No event registrations found.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((reg, idx) => (
                        <tr key={reg.id || idx} className="hover:bg-slate-50/50">
                          <td className="py-4 font-bold text-slate-800">{reg.name}</td>
                          <td className="py-4 text-xs text-slate-500 space-y-0.5">
                            <p>{reg.email}</p>
                            <p>{reg.phone}</p>
                          </td>
                          <td className="py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-primary-50 text-primary-600 border border-primary-100">
                              {reg.eventTitle || reg.eventId}
                            </span>
                          </td>
                          <td className="py-4 text-slate-650 text-xs max-w-xs truncate" title={reg.notes}>
                            {reg.notes || <span className="text-slate-350 italic">None</span>}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end items-center space-x-2">
                              {reg.status === 'attended' ? (
                                <>
                                  <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 px-2 py-1 rounded-lg">
                                    <Award className="h-3 w-3 shrink-0" />
                                    <span>Attended</span>
                                  </span>
                                  <button
                                    onClick={() => handleViewCertificate(reg)}
                                    title="View/Download Certificate"
                                    className="p-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-100 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Award className="h-4 w-4" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleMarkAttended(reg)}
                                  title="Mark Attended & Generate Cert"
                                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors inline-flex items-center space-x-1 cursor-pointer"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Mark Attended</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteRegistration(reg.id || idx)}
                                className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 rounded-lg transition-colors inline-flex cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 5.6: Event Certificates Ledger Panel */}
          {activeTab === 'certificates' && (
            <div className="space-y-8">
              
              {/* Asset Upload Section */}
              <div className="bg-slate-50 border border-slate-250/60 p-6 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <Award className="h-4.5 w-4.5 text-primary-500" />
                    <span>Official Certificate Branding Assets</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Upload the digital signature of the Founder and the Foundation stamp to be embedded on all generated certificates.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Founder's Digital Signature Upload */}
                  <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm flex flex-col justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Founder's Digital Signature</label>
                      <p className="text-[10px] text-slate-400 mb-3">Upload a clean scanned signature. A white/transparent background works best.</p>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleUploadSignature}
                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 cursor-pointer w-full"
                      />
                    </div>
                    {sigImage ? (
                      <div className="flex items-center justify-between mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <img src={sigImage} className="h-10 object-contain max-w-[150px] mix-blend-multiply" alt="Founder Signature" />
                        <span className="text-[10px] text-emerald-600 font-bold">✓ Signature Uploaded</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 italic mt-2">No custom signature uploaded. Falling back to handwriting style font.</div>
                    )}
                  </div>

                  {/* Foundation Stamp Upload */}
                  <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm flex flex-col justify-between">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Foundation Stamp</label>
                      <p className="text-[10px] text-slate-400 mb-3">Upload the official circular stamp image of the foundation.</p>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleUploadStamp}
                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 cursor-pointer w-full"
                      />
                    </div>
                    {stampImage ? (
                      <div className="flex items-center justify-between mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <img src={stampImage} className="h-10 object-contain max-w-[100px] mix-blend-multiply" alt="Foundation Stamp" />
                        <span className="text-[10px] text-emerald-600 font-bold">✓ Stamp Uploaded</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 italic mt-2">No custom stamp uploaded. Falling back to signature labels.</div>
                    )}
                  </div>

                </div>

                {(sigImage || stampImage) && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleResetAssets}
                      className="text-xs font-bold text-red-500 hover:text-red-650 px-3 py-1.5 bg-red-50 hover:bg-red-100/50 rounded-lg border border-red-100 transition-colors cursor-pointer"
                    >
                      Reset to Default Assets
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900 font-display">Event Certificates Ledger</h2>
                  <span className="text-xs text-slate-400 font-bold uppercase">{certificates.length} Total Issued</span>
                </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="pb-3 pr-4">Certificate ID</th>
                      <th className="pb-3 pr-4">Volunteer Info</th>
                      <th className="pb-3 pr-4">Event Campaign</th>
                      <th className="pb-3 pr-4">Hours / Date</th>
                      <th className="pb-3 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {certificates.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-400 text-sm">
                          No event certificates issued yet. Mark event registrations as attended to generate.
                        </td>
                      </tr>
                    ) : (
                      [...certificates].reverse().map((cert, idx) => (
                        <tr key={cert.certificateId || idx} className="hover:bg-slate-50/50">
                          <td className="py-4 font-mono font-bold text-xs text-slate-600 uppercase">{cert.certificateId}</td>
                          <td className="py-4 font-bold text-slate-800">
                            <p>{cert.name}</p>
                            <p className="text-slate-400 text-xs font-normal">{cert.email}</p>
                          </td>
                          <td className="py-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                              {cert.eventTitle}
                            </span>
                          </td>
                          <td className="py-4 text-xs text-slate-500 space-y-0.5">
                            <p className="font-bold text-slate-700">{cert.hours} Hours Logged</p>
                            <p>{cert.date}</p>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedCertificate(cert);
                                setShowCertModal(true);
                              }}
                              className="text-xs font-bold text-primary-600 hover:text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center space-x-1 cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>Download</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          )}

          {/* Tab 6: Gemini AI Assistant Panel */}
          {activeTab === 'ai-assistant' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-950 font-display flex items-center space-x-2">
                  <Sparkles className="h-5.5 w-5.5 text-accent-500 animate-pulse" />
                  <span>Gemini AI Content Engine</span>
                </h2>
                <span className="text-xs font-bold text-slate-400 uppercase">Powered by Gemini 1.5 Flash</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Form & Tools Selector */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Tool Selection Tabs */}
                  <div className="bg-slate-50 border border-slate-200/80 p-2 rounded-2xl flex flex-wrap gap-1.5 justify-center">
                    {[
                      { id: 'social', name: 'Social Post', icon: Sparkles },
                      { id: 'appeal', name: 'Donation Appeal', icon: Heart },
                      { id: 'report', name: 'Event Report', icon: Calendar },
                      { id: 'appreciation', name: 'Appreciation', icon: UserCheck },
                      { id: 'certificate', name: 'AI Certificate', icon: Award }
                    ].map((tool) => {
                      const Icon = tool.icon;
                      const isSelected = aiTool === tool.id;
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => {
                            setAiTool(tool.id);
                            setAiError('');
                            setAiOutput('');
                            setCertUploaded(false);
                          }}
                          className={`flex-grow sm:flex-grow-0 flex items-center justify-center space-x-1.5 py-2.5 px-3.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{tool.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Input Form */}
                  <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <form onSubmit={handleGenerateContent} className="space-y-5">
                      
                      {aiTool === 'social' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Campaign / Event Title</label>
                            <input
                              type="text"
                              required
                              value={socialInputs.title}
                              onChange={(e) => setSocialInputs({ ...socialInputs, title: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                              placeholder="e.g. Noida Slum Food Drive"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Platform</label>
                              <select
                                value={socialInputs.platform}
                                onChange={(e) => setSocialInputs({ ...socialInputs, platform: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                              >
                                <option>Twitter</option>
                                <option>Instagram</option>
                                <option>LinkedIn</option>
                                <option>Facebook</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Tone</label>
                              <select
                                value={socialInputs.tone}
                                onChange={(e) => setSocialInputs({ ...socialInputs, tone: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                              >
                                <option>inspiring</option>
                                <option>professional</option>
                                <option>urgent</option>
                                <option>informative</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Achievements to Highlight</label>
                            <textarea
                              required
                              rows="4"
                              value={socialInputs.achievements}
                              onChange={(e) => setSocialInputs({ ...socialInputs, achievements: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                              placeholder="e.g. Fed over 350 street children and distributed healthy snacks."
                            />
                          </div>
                        </div>
                      )}

                      {aiTool === 'appeal' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Cause / Category</label>
                            <input
                              type="text"
                              required
                              value={appealInputs.cause}
                              onChange={(e) => setAppealInputs({ ...appealInputs, cause: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                              placeholder="e.g. Project Shiksha (Education)"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Target Amount (INR)</label>
                              <input
                                type="number"
                                required
                                value={appealInputs.targetAmount}
                                onChange={(e) => setAppealInputs({ ...appealInputs, targetAmount: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="e.g. 50000"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Target Audience</label>
                              <input
                                type="text"
                                value={appealInputs.targetAudience}
                                onChange={(e) => setAppealInputs({ ...appealInputs, targetAudience: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="e.g. Corporate CSR"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {aiTool === 'report' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Event Name</label>
                            <input
                              type="text"
                              required
                              value={reportInputs.eventName}
                              onChange={(e) => setReportInputs({ ...reportInputs, eventName: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                              placeholder="e.g. Noida Health Camp"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Reach Count</label>
                              <input
                                type="text"
                                required
                                value={reportInputs.reachCount}
                                onChange={(e) => setReportInputs({ ...reportInputs, reachCount: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="e.g. 150 families"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Volunteer Hours</label>
                              <input
                                type="number"
                                value={reportInputs.hoursContributed}
                                onChange={(e) => setReportInputs({ ...reportInputs, hoursContributed: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="e.g. 30"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Event Summaries / Notes</label>
                            <textarea
                              rows="3"
                              value={reportInputs.summaries}
                              onChange={(e) => setReportInputs({ ...reportInputs, summaries: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                              placeholder="Key activities and outcomes..."
                            />
                          </div>
                        </div>
                      )}

                      {aiTool === 'appreciation' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Select Volunteer Account</label>
                            <select
                              value={appreciationInputs.volunteerEmail || ''}
                              onChange={(e) => {
                                const vol = volunteers.find(v => v.email === e.target.value);
                                if (vol) {
                                  setAppreciationInputs({
                                    ...appreciationInputs,
                                    volunteerEmail: vol.email,
                                    volunteerName: vol.name
                                  });
                                } else {
                                  setAppreciationInputs({
                                    ...appreciationInputs,
                                    volunteerEmail: e.target.value
                                  });
                                }
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                            >
                              <option value="">-- Manual / Select Volunteer --</option>
                              {volunteers.map(v => (
                                <option key={v.id} value={v.email}>{v.name} ({v.email})</option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Volunteer Name</label>
                              <input
                                type="text"
                                required
                                value={appreciationInputs.volunteerName}
                                onChange={(e) => setAppreciationInputs({ ...appreciationInputs, volunteerName: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="Ramesh Singh"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Volunteer Email</label>
                              <input
                                type="email"
                                required
                                value={appreciationInputs.volunteerEmail || ''}
                                onChange={(e) => setAppreciationInputs({ ...appreciationInputs, volunteerEmail: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="ramesh@gmail.com"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Program / Wing</label>
                            <input
                              type="text"
                              required
                              value={appreciationInputs.program}
                              onChange={(e) => setAppreciationInputs({ ...appreciationInputs, program: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                              placeholder="e.g. Project Shiksha (Education)"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Key Contributions</label>
                            <textarea
                              required
                              rows="3"
                              value={appreciationInputs.contributions}
                              onChange={(e) => setAppreciationInputs({ ...appreciationInputs, contributions: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                              placeholder="Specific work done..."
                            />
                          </div>
                        </div>
                      )}

                      {aiTool === 'certificate' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Select Volunteer Account</label>
                            <select
                              value={certInputs.volunteerEmail}
                              onChange={(e) => handleSelectVolunteerForCert(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary-500"
                            >
                              <option value="">-- Manual / Select Volunteer --</option>
                              {volunteers.map(v => (
                                <option key={v.id} value={v.email}>{v.name} ({v.email})</option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Volunteer Name</label>
                              <input
                                type="text"
                                required
                                value={certInputs.volunteerName}
                                onChange={(e) => setCertInputs({ ...certInputs, volunteerName: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="Ramesh Singh"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Volunteer Email</label>
                              <input
                                type="email"
                                required
                                value={certInputs.volunteerEmail}
                                onChange={(e) => setCertInputs({ ...certInputs, volunteerEmail: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                                placeholder="ramesh@gmail.com"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Campaign / Event Title</label>
                            <input
                              type="text"
                              required
                              value={certInputs.eventTitle}
                              onChange={(e) => setCertInputs({ ...certInputs, eventTitle: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                              placeholder="Noida Winter Clothes & Blanket Drive"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Logged Hours</label>
                              <input
                                type="number"
                                required
                                value={certInputs.hours}
                                onChange={(e) => setCertInputs({ ...certInputs, hours: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Date</label>
                              <input
                                type="date"
                                required
                                value={certInputs.date}
                                onChange={(e) => setCertInputs({ ...certInputs, date: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 transition-colors"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Key Contributions (for Gemini citation)</label>
                            <textarea
                              rows="3"
                              value={certInputs.contributions}
                              onChange={(e) => setCertInputs({ ...certInputs, contributions: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-500 resize-none"
                              placeholder="e.g. coordinating distribution logistics and managing volunteer registrations"
                            />
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={aiLoading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-xs shadow transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer"
                      >
                        {aiLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Generating content...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 fill-white text-white" />
                            <span>Generate with Gemini</span>
                          </>
                        )}
                      </button>

                    </form>
                  </div>

                </div>

                {/* Right Column: AI Output / Preview Frame */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {aiError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5 text-red-600 text-xs font-semibold">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                      <span>{aiError}</span>
                    </div>
                  )}

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[460px] flex flex-col justify-between text-slate-900 shadow-sm relative">
                    
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-3.5 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
                        {aiTool === 'certificate' ? 'Certificate Document Preview' : 'Gemini AI Draft Output'}
                      </span>

                      {aiOutput && aiTool !== 'certificate' && (
                        <button
                          onClick={handleCopyToClipboard}
                          className="flex items-center space-x-1.5 text-slate-700 hover:text-primary-650 hover:bg-primary-50/20 text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-all cursor-pointer shadow-sm"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600 animate-bounce" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 text-slate-500" />
                              <span>Copy Draft</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Output display or certificate rendering */}
                    <div className="flex-grow flex flex-col justify-center">
                      {aiOutput ? (
                        aiTool === 'certificate' ? (
                          <div className="space-y-6">
                            
                            {/* Certificate Template Card */}
                            <div className="bg-amber-50/15 border-4 border-double border-amber-600 p-6 text-center rounded-2xl relative font-serif shadow-inner mx-auto max-w-md" style={{ backgroundColor: '#fffdfb' }}>
                              <div className="absolute top-2 left-2 text-amber-600/40 text-xs">✥</div>
                              <div className="absolute top-2 right-2 text-amber-600/40 text-xs">✥</div>
                              <div className="absolute bottom-2 left-2 text-amber-600/40 text-xs">✥</div>
                              <div className="absolute bottom-2 right-2 text-amber-600/40 text-xs">✥</div>

                              <div className="space-y-4">
                                <img src="/logo.png" className="h-10 w-10 mx-auto object-contain bg-white p-1 rounded-xl border border-amber-100 shadow-sm" alt="NayePankh Logo" />
                                <h2 className="text-sm font-extrabold text-[#132a13] uppercase tracking-widest font-display">Certificate of Participation</h2>
                                <p className="text-slate-400 text-[8px] uppercase tracking-widest font-sans font-bold">This is proudly presented to</p>
                                <h3 className="text-lg font-extrabold text-slate-900 font-display italic my-1">{certInputs.volunteerName}</h3>
                                <p className="text-slate-650 text-[11px] leading-relaxed font-sans px-2">
                                  {aiOutput}
                                </p>

                                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-amber-200/40 max-w-xs mx-auto font-sans text-[9px]">
                                  <div>
                                    <p className="font-semibold text-slate-400 uppercase tracking-widest text-[7px]">Date</p>
                                    <p className="font-bold text-slate-800">{new Date(certInputs.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-400 uppercase tracking-widest text-[7px]">Hours Logged</p>
                                    <p className="font-bold text-slate-850">{certInputs.hours} Hours</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-2.5 max-w-xs mx-auto font-sans text-[9px] relative border-t border-amber-100/50">
                                  {/* Foundation Stamp (absolute center overlay) */}
                                  {stampImage && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                      <img 
                                        src={stampImage} 
                                        className="w-10 h-10 object-contain mix-blend-multiply opacity-85 rotate-[-8deg] -translate-y-1.5" 
                                        alt="Foundation Stamp" 
                                      />
                                    </div>
                                  )}

                                  <div className="text-center flex flex-col items-center relative min-h-[36px] justify-end">
                                    {sigImage ? (
                                      <img 
                                        src={sigImage} 
                                        className="absolute bottom-3.5 h-6 object-contain max-w-[80px] mix-blend-multiply" 
                                        alt="Founder Signature" 
                                      />
                                    ) : (
                                      <span className="font-serif italic text-[8px] text-slate-500 absolute bottom-3.5">Prashant Shukla</span>
                                    )}
                                    <div className="w-10 h-px bg-slate-300 my-0.5"></div>
                                    <p className="text-[6px] text-slate-400 font-sans uppercase font-bold">Founder President</p>
                                  </div>
                                  
                                  <div className="text-center flex flex-col items-center relative min-h-[36px] justify-end">
                                    <span className="font-serif italic text-[8px] text-slate-500 absolute bottom-3.5">Anjali Gupta</span>
                                    <div className="w-10 h-px bg-slate-300 my-0.5"></div>
                                    <p className="text-[6px] text-slate-400 font-sans uppercase font-bold">National Coordinator</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action Button: Upload to Profile */}
                            <div className="flex justify-center pt-2">
                              <button
                                type="button"
                                onClick={handleUploadCertFromAi}
                                disabled={certUploading || certUploaded}
                                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${
                                  certUploaded
                                    ? 'bg-emerald-500 text-white cursor-default'
                                    : 'bg-slate-950 hover:bg-slate-850 text-white'
                                }`}
                              >
                                {certUploading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Uploading Certificate...</span>
                                  </>
                                ) : certUploaded ? (
                                  <>
                                    <Check className="h-4 w-4" />
                                    <span>Uploaded to Volunteer Profile!</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4" />
                                    <span>Upload to Volunteer Profile</span>
                                  </>
                                )}
                              </button>
                            </div>

                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="text-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[300px] p-4 bg-white rounded-xl border border-slate-200 w-full text-left">
                              {aiOutput}
                            </div>
                            {aiTool === 'appreciation' && (
                              <div className="flex justify-center pt-2">
                                <button
                                  type="button"
                                  onClick={handleSendAppreciationEmail}
                                  disabled={sendingAppreciationEmail || appreciationEmailSent}
                                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${
                                    appreciationEmailSent
                                      ? 'bg-emerald-500 text-white cursor-default'
                                      : 'bg-slate-950 hover:bg-slate-850 text-white'
                                  }`}
                                >
                                  {sendingAppreciationEmail ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      <span>Sending Email...</span>
                                    </>
                                  ) : appreciationEmailSent ? (
                                    <>
                                      <Check className="h-4 w-4" />
                                      <span>Email Sent!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Mail className="h-4 w-4" />
                                      <span>Send Email to Volunteer</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center text-slate-400 py-12 space-y-4">
                          <div className="p-3.5 bg-slate-100 rounded-full">
                            <Sparkles className="h-8 w-8 text-slate-350 opacity-40" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-700">No content generated yet</p>
                            <p className="text-[11px] text-slate-450 max-w-xs leading-relaxed">Adjust parameters on the left and click "Generate with Gemini" to output custom campaigns and documents.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-200/60 pt-3.5 mt-4 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Please review generated text for correctness before publishing.</span>
                      <span className="font-semibold text-slate-400">NayePankh AI Assistant</span>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          )}

          {/* Tab 7: Admin Notifications Mock Inbox */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 font-display flex items-center space-x-2">
                    <Mail className="h-5.5 w-5.5 text-primary-500" />
                    <span>Admin Notifications Log</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Simulating emails routed to <strong className="text-slate-800 font-semibold">admintestsprojects@gmail.com</strong>
                  </p>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearNotifications}
                    className="px-4 py-2 bg-red-50 text-red-650 hover:bg-red-100 border border-red-150 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Inbox Logs</span>
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <div className="p-4 bg-primary-50 rounded-full mb-4">
                    <Mail className="h-10 w-10 text-primary-550 opacity-60" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Inbox is empty</h3>
                  <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                    Whenever a volunteer registration, internship application, career inquiry, or donation succeeds, notifications will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left Column: Email list */}
                  <div className="lg:col-span-5 border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[600px] bg-slate-50">
                    <div className="p-3.5 bg-white border-b border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Messages ({notifications.length})</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-600">Local Cache</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-150">
                      {notifications.map((notif) => {
                        const isSelected = selectedNotification?.id === notif.id;
                        let badgeColor = '';
                        if (notif.type === 'volunteer') badgeColor = 'bg-sky-50 text-sky-600 border border-sky-100';
                        else if (notif.type === 'internship') badgeColor = 'bg-indigo-50 text-indigo-600 border border-indigo-100';
                        else if (notif.type === 'work') badgeColor = 'bg-amber-50 text-amber-600 border border-amber-100';
                        else if (notif.type === 'donation') badgeColor = 'bg-emerald-50 text-emerald-600 border border-emerald-100';

                        return (
                          <div
                            key={notif.id}
                            onClick={() => setSelectedNotification(notif)}
                            className={`p-4 transition-colors cursor-pointer text-left ${
                              isSelected 
                                ? 'bg-white border-l-4 border-l-primary-500 shadow-sm' 
                                : 'hover:bg-slate-100/70 bg-slate-50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1.5">
                              <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md ${badgeColor}`}>
                                {notif.type}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{notif.subject}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                              To: {notif.recipient}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Email Preview Frame */}
                  <div className="lg:col-span-7 border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-[600px] bg-white">
                    {selectedNotification ? (
                      <div className="flex flex-col h-full">
                        {/* Header details */}
                        <div className="p-4 bg-slate-50 border-b border-slate-150 text-left">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900">{selectedNotification.subject}</h3>
                              <p className="text-xs text-slate-500 mt-1">
                                <span className="font-semibold text-slate-400">To:</span> {selectedNotification.recipient}
                              </p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">
                              {new Date(selectedNotification.timestamp).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Email HTML content body */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-100/50 flex justify-center">
                          <div 
                            className="w-full max-w-full bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200"
                            dangerouslySetInnerHTML={{ __html: selectedNotification.html }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 py-12 space-y-3">
                        <div className="p-3 bg-slate-50 rounded-full border border-slate-100">
                          <Mail className="h-6 w-6 text-slate-300" />
                        </div>
                        <p className="text-xs font-bold text-slate-700">No message selected</p>
                        <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                          Select an email notification from the left list pane to view the formatted HTML content.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
      
      {showCertModal && selectedCertificate && (
        <div id="printable-certificate-container" className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative border border-slate-200">
            {/* Modal actions - hidden when printing */}
            <div className="flex justify-between items-center mb-6 no-print">
              <h4 className="text-lg font-bold text-slate-950 font-display flex items-center space-x-2">
                <Award className="h-5 w-5 text-amber-500" />
                <span>Volunteer Event Certificate</span>
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
                    setShowCertModal(false);
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
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#132a13] uppercase tracking-widest font-display">Certificate of Participation</h2>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-sans font-bold">This is proudly presented to</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-wide font-display italic my-2">{selectedCertificate.name}</h3>
                <p className="text-slate-650 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-sans">
                  for outstanding volunteer contributions and active participation in the event <strong className="text-slate-950">"{selectedCertificate.eventTitle}"</strong> on <strong className="text-slate-950">{selectedCertificate.date}</strong>, logging <strong className="text-slate-950">{selectedCertificate.hours} hours</strong> of community service.
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-amber-250/60 max-w-sm mx-auto font-sans">
                  <div className="text-center">
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest font-sans">Issued Date</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{selectedCertificate.date}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest font-sans">Certificate ID</p>
                    <p className="text-xs font-bold text-slate-850 mt-1 font-mono uppercase">{selectedCertificate.certificateId}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-6 max-w-sm mx-auto font-sans relative">
                  {/* Foundation Stamp (absolute center overlay) */}
                  {(selectedCertificate.stampUrl || stampImage) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <img 
                        src={selectedCertificate.stampUrl || stampImage} 
                        className="w-16 h-16 object-contain mix-blend-multiply opacity-85 rotate-[-8deg] -translate-y-2" 
                        alt="Foundation Stamp" 
                      />
                    </div>
                  )}

                  <div className="text-center flex flex-col items-center relative min-h-[48px] justify-end">
                    {selectedCertificate.signatureUrl || sigImage ? (
                      <img 
                        src={selectedCertificate.signatureUrl || sigImage} 
                        className="absolute bottom-5 h-10 object-contain max-w-[120px] mix-blend-multiply" 
                        alt="Founder Signature" 
                      />
                    ) : (
                      <span className="font-serif italic text-xs text-slate-750 font-bold absolute bottom-5">Prashant Shukla</span>
                    )}
                    <div className="w-16 h-px bg-slate-300 my-1"></div>
                    <p className="text-[8px] text-slate-400 font-sans uppercase font-bold">Founder President</p>
                  </div>
                  
                  <div className="text-center flex flex-col items-center relative min-h-[48px] justify-end">
                    <span className="font-serif italic text-xs text-slate-750 font-bold absolute bottom-5">Anjali Gupta</span>
                    <div className="w-16 h-px bg-slate-300 my-1"></div>
                    <p className="text-[8px] text-slate-400 font-sans uppercase font-bold">National Coordinator</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Embedded styles for print layout */}
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
          </div>
        </div>
      )}
    </div>
  );
}
