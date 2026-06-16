import { useState, useEffect } from 'react';
import { Sparkles, Heart, FileText, Award, Copy, Check, Loader2, AlertCircle, Share2, Upload, Download, Mail } from 'lucide-react';
import { 
  generateSocialPost, 
  generateDonationAppeal, 
  generateEventReport, 
  generateVolunteerThankYou,
  generateCertificateCitation
} from '../services/gemini';
import { db, isConfigured } from '../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AiAssistant() {
  const [activeTab, setActiveTab] = useState('social');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  // Volunteers for selection
  const [volunteers, setVolunteers] = useState([]);

  // Fetch volunteers on mount
  useEffect(() => {
    async function loadVolunteers() {
      let volList = [];
      if (isConfigured) {
        try {
          const snap = await getDocs(collection(db, 'volunteers'));
          volList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (err) {
          console.error("Error fetching volunteers:", err);
        }
      }
      const defaultVolunteers = [
        { id: 'vol-1', name: 'Ramesh Singh', email: 'ramesh@gmail.com', phone: '9876543210', city: 'Noida', program: 'Education', status: 'pending' },
        { id: 'vol-2', name: 'Anjali Gupta', email: 'anjali@gmail.com', phone: '9123456789', city: 'Delhi', program: 'Healthcare', status: 'approved' },
        { id: 'vol-3', name: 'Vikram Rao', email: 'vikram@gmail.com', phone: '8877665544', city: 'Mumbai', program: 'Livelihood', status: 'pending' },
      ];
      const savedVolunteers = JSON.parse(localStorage.getItem('naye_pankh_volunteers') || '[]');
      const combined = [...volList];
      savedVolunteers.forEach(sv => {
        if (!combined.some(v => v.id === sv.id || v.email === sv.email)) {
          combined.push(sv);
        }
      });
      defaultVolunteers.forEach(dv => {
        if (!combined.some(v => v.id === dv.id || v.email === dv.email)) {
          combined.push(dv);
        }
      });
      setVolunteers(combined);
    }
    loadVolunteers();
  }, []);

  // Form states
  const [socialInputs, setSocialInputs] = useState({
    title: '',
    platform: 'Instagram',
    tone: 'Inspiring',
    achievements: ''
  });

  const [appealInputs, setAppealInputs] = useState({
    cause: 'Project Shiksha (Education)',
    targetAmount: '',
    targetAudience: 'General Public'
  });

  const [reportInputs, setReportInputs] = useState({
    eventName: '',
    reachCount: '',
    hoursContributed: '',
    summaries: ''
  });

  const [appreciationInputs, setAppreciationInputs] = useState({
    volunteerEmail: '',
    volunteerName: '',
    contributions: '',
    program: 'Project Shiksha (Education)'
  });

  const [certInputs, setCertInputs] = useState({
    volunteerEmail: '',
    volunteerName: '',
    eventTitle: 'Noida Winter Clothes & Blanket Drive',
    contributions: '',
    hours: '6',
    date: new Date().toISOString().split('T')[0]
  });

  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSendAppreciationEmail = async () => {
    if (!appreciationInputs.volunteerEmail || !output) return;
    setSendingEmail(true);
    setEmailSent(false);

    try {
      const subject = encodeURIComponent("Thank You for Your Support - NayePankh Foundation");
      const body = encodeURIComponent(output);
      const mailtoUrl = `mailto:${appreciationInputs.volunteerEmail}?subject=${subject}&body=${body}`;
      
      window.location.href = mailtoUrl;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSendingEmail(false);
      setEmailSent(true);
      alert(`Success! Opened your email client with a pre-filled appreciation draft for ${appreciationInputs.volunteerName} (${appreciationInputs.volunteerEmail}).`);
    } catch (err) {
      console.error("Error launching mail client:", err);
      setSendingEmail(false);
    }
  };

  const handleSelectVolunteer = (email) => {
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

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOutput('');
    setCopied(false);
    setUploaded(false);
    setEmailSent(false);

    try {
      let result = '';
      if (activeTab === 'social') {
        if (!socialInputs.title || !socialInputs.achievements) {
          throw new Error('Please fill in both the campaign title and key achievements.');
        }
        result = await generateSocialPost(
          socialInputs.title, 
          socialInputs.platform, 
          socialInputs.tone, 
          socialInputs.achievements
        );
      } else if (activeTab === 'appeal') {
        if (!appealInputs.targetAmount) {
          throw new Error('Please enter a target fundraising amount.');
        }
        result = await generateDonationAppeal(
          appealInputs.cause, 
          appealInputs.targetAmount, 
          appealInputs.targetAudience
        );
      } else if (activeTab === 'report') {
        if (!reportInputs.eventName || !reportInputs.reachCount) {
          throw new Error('Please enter the event name and beneficiary reach.');
        }
        result = await generateEventReport(
          reportInputs.eventName, 
          reportInputs.reachCount, 
          reportInputs.hoursContributed || '0', 
          reportInputs.summaries
        );
      } else if (activeTab === 'appreciation') {
        if (!appreciationInputs.volunteerName || !appreciationInputs.contributions) {
          throw new Error('Please specify the volunteer name and their contributions.');
        }
        result = await generateVolunteerThankYou(
          appreciationInputs.volunteerName, 
          appreciationInputs.contributions, 
          appreciationInputs.program
        );
      } else if (activeTab === 'certificate') {
        if (!certInputs.volunteerName || !certInputs.volunteerEmail || !certInputs.eventTitle) {
          throw new Error('Please fill in volunteer name, email, and event title.');
        }
        result = await generateCertificateCitation(
          certInputs.volunteerName,
          certInputs.eventTitle,
          certInputs.contributions || 'their active ground operations'
        );
      }
      setOutput(result);
    } catch (err) {
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCertificate = async () => {
    if (!certInputs.volunteerName || !certInputs.volunteerEmail || !output) return;
    setUploading(true);
    setUploaded(false);

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
      citation: output,
      signatureUrl: localStorage.getItem('naye_pankh_signature') || '',
      stampUrl: localStorage.getItem('naye_pankh_stamp') || ''
    };

    if (isConfigured) {
      try {
        await addDoc(collection(db, 'certificates'), {
          ...certData,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Error uploading certificate to Firestore:", err);
      }
    }

    // Always update localStorage
    const savedCerts = JSON.parse(localStorage.getItem('naye_pankh_certificates') || '[]');
    savedCerts.push(certData);
    localStorage.setItem('naye_pankh_certificates', JSON.stringify(savedCerts));

    setUploading(false);
    setUploaded(true);
    alert(`Success! Certificate ${certId} generated and uploaded to ${certInputs.volunteerName}'s profile.`);
  };

  const handleCopyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sigImage = localStorage.getItem('naye_pankh_signature') || '';
  const stampImage = localStorage.getItem('naye_pankh_stamp') || '';

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <section 
        className="relative py-70 md:py-120 overflow-hidden bg-cover bg-[center_35%] bg-no-repeat border-b border-slate-200 pt-36 md:pt-44"
        style={{ backgroundImage: "url('/donate-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-0" />
        
        {/* Soft decorative flows */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary-500/10 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-secondary-500/10 rounded-full blur-[100px] z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="flex justify-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 bg-primary-50 px-3.5 py-1.5 rounded-full border border-primary-100 flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary-500 animate-pulse" />
              <span>Smart Writing Hub</span>
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-slate-900 drop-shadow-sm">
            AI Campaign Assistant
          </h1>
          <p className="text-slate-800 text-sm max-w-2xl mx-auto leading-relaxed font-bold">
            Generate impactful posts, donation appeals, event summary reports, appreciation templates, and custom certificates powered by Google Gemini AI.
          </p>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form & Tools */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Tool Selection Tabs */}
              <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm flex flex-wrap gap-1.5 justify-center">
                {[
                  { id: 'social', name: 'Social Post', icon: Share2 },
                  { id: 'appeal', name: 'Donation Appeal', icon: Heart },
                  { id: 'report', name: 'Event Report', icon: FileText },
                  { id: 'appreciation', name: 'Appreciation', icon: Award },
                  { id: 'certificate', name: 'AI Certificate', icon: Award }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setError('');
                        setOutput('');
                        setUploaded(false);
                      }}
                      className={`flex-grow sm:flex-grow-0 flex items-center justify-center space-x-1.5 py-2.5 px-3.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary-500 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Input Form */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-md">
                <form onSubmit={handleGenerate} className="space-y-5">
                  
                  {activeTab === 'social' && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Social Post Parameters</h3>
                        <p className="text-xs text-slate-400 mt-1">Compose attractive drafts for Instagram, LinkedIn, or Facebook.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Campaign / Event Title</label>
                        <input
                          type="text"
                          required
                          value={socialInputs.title}
                          onChange={(e) => setSocialInputs({ ...socialInputs, title: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                          placeholder="e.g. Noida Slum Food Drive"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Platform</label>
                          <select
                            value={socialInputs.platform}
                            onChange={(e) => setSocialInputs({ ...socialInputs, platform: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary-500"
                          >
                            <option>Instagram</option>
                            <option>LinkedIn</option>
                            <option>Facebook</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Tone Select</label>
                          <select
                            value={socialInputs.tone}
                            onChange={(e) => setSocialInputs({ ...socialInputs, tone: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary-500"
                          >
                            <option>Inspiring</option>
                            <option>Professional</option>
                            <option>Urgent</option>
                            <option>Informative</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Achievements to Highlight</label>
                        <textarea
                          required
                          rows="4"
                          value={socialInputs.achievements}
                          onChange={(e) => setSocialInputs({ ...socialInputs, achievements: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 resize-none"
                          placeholder="e.g. Fed over 350 street children, organized fun drawing activities, and distributed healthy snack packets."
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'appeal' && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Donation Appeal Parameters</h3>
                        <p className="text-xs text-slate-400 mt-1">Generate emotionally compelling copy targeted to raise funds.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Campaign Cause / Category</label>
                        <select
                          value={appealInputs.cause}
                          onChange={(e) => setAppealInputs({ ...appealInputs, cause: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary-500"
                        >
                          <option>Project Shiksha (Education)</option>
                          <option>Project Swasthya (Healthcare)</option>
                          <option>Project Swabalamban (Self-reliance)</option>
                          <option>Clothes & Food Distribution Drives</option>
                          <option>General Support Wing</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Target Amount (INR ₹)</label>
                        <input
                          type="number"
                          required
                          value={appealInputs.targetAmount}
                          onChange={(e) => setAppealInputs({ ...appealInputs, targetAmount: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                          placeholder="e.g. 150000"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Target Audience</label>
                        <input
                          type="text"
                          required
                          value={appealInputs.targetAudience}
                          onChange={(e) => setAppealInputs({ ...appealInputs, targetAudience: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                          placeholder="e.g. Corporate CSR managers / Young donors"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'report' && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Event Report Summary Parameters</h3>
                        <p className="text-xs text-slate-400 mt-1">Produce structured highlights and summary data post-drive.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Event Name</label>
                        <input
                          type="text"
                          required
                          value={reportInputs.eventName}
                          onChange={(e) => setReportInputs({ ...reportInputs, eventName: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                          placeholder="e.g. Chhalera Village General Medical Camp"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Beneficiary Reach</label>
                          <input
                            type="text"
                            required
                            value={reportInputs.reachCount}
                            onChange={(e) => setReportInputs({ ...reportInputs, reachCount: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="e.g. 240 children"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Volunteer Hours</label>
                          <input
                            type="number"
                            value={reportInputs.hoursContributed}
                            onChange={(e) => setReportInputs({ ...reportInputs, hoursContributed: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="e.g. 36"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Brief Notes / Highlights</label>
                        <textarea
                          rows="4"
                          value={reportInputs.summaries}
                          onChange={(e) => setReportInputs({ ...reportInputs, summaries: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 resize-none"
                          placeholder="e.g. Set up temporary clinics, provided pediatric assessments, distributed vitamin supplements."
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'appreciation' && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Volunteer Appreciation Parameters</h3>
                        <p className="text-xs text-slate-400 mt-1">Generate custom thank-you messages detailing impact.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Select Volunteer Account</label>
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
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary-500"
                        >
                          <option value="">-- Manual / Select Volunteer --</option>
                          {volunteers.map(v => (
                            <option key={v.id} value={v.email}>{v.name} ({v.email})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Volunteer Name</label>
                          <input
                            type="text"
                            required
                            value={appreciationInputs.volunteerName}
                            onChange={(e) => setAppreciationInputs({ ...appreciationInputs, volunteerName: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="e.g. Rohan Sharma"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Volunteer Email</label>
                          <input
                            type="email"
                            required
                            value={appreciationInputs.volunteerEmail || ''}
                            onChange={(e) => setAppreciationInputs({ ...appreciationInputs, volunteerEmail: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="e.g. rohan@gmail.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Project Wing / Program</label>
                        <select
                          value={appreciationInputs.program}
                          onChange={(e) => setAppreciationInputs({ ...appreciationInputs, program: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary-500"
                        >
                          <option>Project Shiksha (Education)</option>
                          <option>Project Swasthya (Healthcare)</option>
                          <option>Project Swabalamban (Self-reliance)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Key Contributions / Efforts</label>
                        <textarea
                          required
                          rows="4"
                          value={appreciationInputs.contributions}
                          onChange={(e) => setAppreciationInputs({ ...appreciationInputs, contributions: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 resize-none"
                          placeholder="e.g. Volunteering to teach digital literacy skills to 10 youth on consecutive weekends."
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'certificate' && (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">AI Certificate Citation Parameters</h3>
                        <p className="text-xs text-slate-400 mt-1">Draft formal and elegant certificate text with NayePankh branding.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Select Volunteer Account</label>
                        <select
                          value={certInputs.volunteerEmail}
                          onChange={(e) => handleSelectVolunteer(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-primary-500"
                        >
                          <option value="">-- Manual / Select Volunteer --</option>
                          {volunteers.map(v => (
                            <option key={v.id} value={v.email}>{v.name} ({v.email})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Volunteer Full Name</label>
                          <input
                            type="text"
                            required
                            value={certInputs.volunteerName}
                            onChange={(e) => setCertInputs({ ...certInputs, volunteerName: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="e.g. Rohan Sharma"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Volunteer Email</label>
                          <input
                            type="email"
                            required
                            value={certInputs.volunteerEmail}
                            onChange={(e) => setCertInputs({ ...certInputs, volunteerEmail: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="e.g. rohan@gmail.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Campaign / Event Title</label>
                        <input
                          type="text"
                          required
                          value={certInputs.eventTitle}
                          onChange={(e) => setCertInputs({ ...certInputs, eventTitle: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                          placeholder="e.g. Noida Blanket Drive"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Logged Hours</label>
                          <input
                            type="number"
                            required
                            value={certInputs.hours}
                            onChange={(e) => setCertInputs({ ...certInputs, hours: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="e.g. 6"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Date</label>
                          <input
                            type="date"
                            required
                            value={certInputs.date}
                            onChange={(e) => setCertInputs({ ...certInputs, date: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Key Contributions</label>
                        <textarea
                          rows="3"
                          value={certInputs.contributions}
                          onChange={(e) => setCertInputs({ ...certInputs, contributions: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 resize-none"
                          placeholder="e.g. distributing over 50 blankets and helping coordinate the volunteers on ground"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-sm shadow transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-75 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating copy...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 fill-white text-white" />
                        <span>Generate with Gemini</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: AI Output Frame */}
            <div className="lg:col-span-7 space-y-6">
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-655 text-xs sm:text-sm font-semibold">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-550" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 min-h-[520px] flex flex-col justify-between text-slate-900 shadow-lg relative">
                
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
                      {activeTab === 'certificate' ? 'Certificate Document Preview' : 'Gemini Draft Output'}
                    </span>
                  </div>
                  {output && activeTab !== 'certificate' && (
                    <button
                      onClick={handleCopyToClipboard}
                      className="flex items-center space-x-1.5 text-slate-700 hover:text-primary-600 hover:bg-primary-50/30 text-xs font-bold bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-600 animate-bounce" />
                          <span className="text-emerald-600 font-extrabold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 text-slate-500" />
                          <span>Copy Draft Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Response Display Content */}
                <div className="flex-grow">
                  {output ? (
                    activeTab === 'certificate' ? (
                      <div className="space-y-6">
                        {/* Certificate Template Preview */}
                        <div className="bg-amber-50/15 border-4 border-double border-amber-600 p-6 text-center rounded-2xl relative font-serif shadow-inner" style={{ backgroundColor: '#fffdfb' }}>
                          <div className="absolute top-2 left-2 text-amber-600/40 text-xs">✥</div>
                          <div className="absolute top-2 right-2 text-amber-600/40 text-xs">✥</div>
                          <div className="absolute bottom-2 left-2 text-amber-600/40 text-xs">✥</div>
                          <div className="absolute bottom-2 right-2 text-amber-600/40 text-xs">✥</div>

                          <div className="space-y-4">
                            <img src="/logo.png" className="h-12 w-12 mx-auto object-contain bg-white p-1 rounded-xl border border-amber-100 shadow-sm" alt="NayePankh Logo" />
                            <h2 className="text-base sm:text-lg font-extrabold text-[#132a13] uppercase tracking-widest font-display">Certificate of Participation</h2>
                            <p className="text-slate-400 text-[8px] uppercase tracking-widest font-sans font-bold">This is proudly presented to</p>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display italic my-1">{certInputs.volunteerName}</h3>
                            <p className="text-slate-650 text-xs max-w-md mx-auto leading-relaxed font-sans px-2">
                              {output}
                            </p>

                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-amber-200/40 max-w-xs mx-auto font-sans text-[10px]">
                              <div>
                                <p className="font-semibold text-slate-400 uppercase tracking-widest text-[8px]">Date</p>
                                <p className="font-bold text-slate-800">{new Date(certInputs.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-slate-400 uppercase tracking-widest text-[8px]">Hours Logged</p>
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

                        {/* Upload Button */}
                        <div className="flex justify-center pt-2">
                          <button
                            type="button"
                            onClick={handleUploadCertificate}
                            disabled={uploading || uploaded}
                            className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
                              uploaded
                                ? 'bg-emerald-500 text-white cursor-default'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Uploading Certificate...</span>
                              </>
                            ) : uploaded ? (
                              <>
                                <Check className="h-4 w-4" />
                                <span>Uploaded to Profile!</span>
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
                        <div className="text-slate-800 text-sm font-medium whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[420px] pr-2 font-mono bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                          {output}
                        </div>
                        {activeTab === 'appreciation' && (
                          <div className="flex justify-center pt-2">
                            <button
                              type="button"
                              onClick={handleSendAppreciationEmail}
                              disabled={sendingEmail || emailSent}
                              className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
                                emailSent
                                  ? 'bg-emerald-500 text-white cursor-default'
                                  : 'bg-slate-900 hover:bg-slate-800 text-white'
                              }`}
                            >
                              {sendingEmail ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Sending Email...</span>
                                </>
                              ) : emailSent ? (
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
                    <div className="flex flex-col items-center justify-center text-center text-slate-400 h-80 space-y-4">
                      <div className="p-4 bg-slate-100 rounded-full">
                        <Sparkles className="h-10 w-10 text-slate-350 opacity-40" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700">No content generated yet</p>
                        <p className="text-xs text-slate-450 max-w-xs leading-relaxed">Adjust parameters on the left and click "Generate with Gemini" to output custom campaigns and documents.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Please review generated text for factual correctness before publishing.</span>
                  <span className="font-semibold text-slate-400">NayePankh AI Assistant</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
