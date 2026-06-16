import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, CheckCircle2, ArrowRight, CreditCard, Landmark, Wallet, Loader2, AlertCircle, BookOpen, Stethoscope, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db, isConfigured } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendAdminNotification } from '../services/notifications';
import { useLanguageTheme } from '../context/LanguageThemeContext';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const translationDict = {
  en: {
    makeAnImpact: "Make an Impact",
    supportTitle: "Support NayePankh",
    togetherDifference: "\"Together, Let's Make a Difference!\"",
    dearSupporters: "Dear Supporters and Friends,",
    letterP1: "NayePankh Foundation was founded with a simple yet powerful vision - to uplift the underprivileged and marginalized communities and provide them with access to education, healthcare, and basic necessities that we often take for granted.",
    letterP2: "We strongly believe that every child has the right to dream and achieve their aspirations, irrespective of their socio-economic background. We have been working relentlessly towards this goal, but we need your support to continue our efforts and make a lasting impact.",
    letterP3: "As you read this, countless children and families are struggling to survive without the most basic necessities. They lack access to clean water, sanitation, and proper healthcare facilities. Most of them are unable to attend school due to financial constraints or lack of infrastructure.",
    letterP4: "They are trapped in a cycle of poverty and hopelessness, and they need our help. We at Nayepankh Foundation strive to break this cycle and provide a ray of hope to those in need. With your support, we can continue to provide education, healthcare, and other basic amenities to these communities.",
    letterP5: "We can empower them to lead better lives and realize their true potential. Every donation, no matter how small, can make a huge difference. Your support can provide a child with a school uniform, a pair of shoes, or even a nutritious meal.",
    letterP6: "It can provide a family with access to clean water, sanitation, and healthcare facilities. It can change the trajectory of someone's life forever. We understand that times are tough, and everyone is going through their own struggles. But we urge you to think of those who are less fortunate and extend a helping hand. Your generosity can make a world of difference to someone in need.",
    letterP7: "We know that we can count on your support to continue our mission. Your donations will help us reach more communities and make a meaningful impact in the lives of those who need it the most. Let's come together and make a difference. Thank you for considering our cause and supporting Nayepankh Foundation.",
    letterP8: "Your support means the world to us and those we serve. Let's work together to create a better world for all.",
    gratitude: "With heartfelt gratitude,",
    signature: "Prashant Shukla, Founder & President, NayePankh Foundation",
    sponsorCause: "Sponsor a Cause",
    selectFrequency: "Select Frequency",
    oneTime: "One-Time",
    monthly: "Monthly",
    chooseCause: "Choose a Cause to Support",
    catShikshaName: "Shiksha (Education)",
    catShikshaDesc: "Sponsor classroom tools, tuition fees, & notebooks.",
    catSwasthyaName: "Swasthya (Healthcare)",
    catSwasthyaDesc: "Support medical clinics, sanitation, & nutrition.",
    catSwabalambanName: "Swabalamban (Self-reliance)",
    catSwabalambanDesc: "Empower women with vocational & skill training.",
    catDrivesName: "Clothes & Food Drives",
    catDrivesDesc: "Fund distribution of fresh meals & winter clothing.",
    catGeneralName: "General Support",
    catGeneralDesc: "Flexible resources allocated where immediate need arises.",
    choosePreset: "Choose Preset Amount",
    customAmtLabel: "Or Enter Custom Amount (INR)",
    customAmtPlaceholder: "Enter custom amount",
    proceedDonation: "Proceed to Secure Donation",
    processing: "Processing...",
    taxExemptNotice: "80G Tax Exemption Certificate will be sent instantly to your email.",
    seeImpact: "See Your Impact",
    seeImpactDesc: "Adjust the slider to see how your contribution converts into real-world change on the ground.",
    liveCalc: "Live Calculator",
    contributionAmount: "Contribution Amount",
    metricScholastic: "Scholastic Kits",
    metricScholasticDesc: "Bags, notebooks, stationery",
    metricHealth: "Health Checkups",
    metricHealthDesc: "Consultations & medicines",
    metricLivelihood: "Livelihood Kits",
    metricLivelihoodDesc: "Skill-training sewing/tech kits",
    metricAnnual: "Annual Sponsorships",
    metricAnnualDesc: "Full learning center tuition",
    selectInForm: "Select in Donation Form",
    allocationAudits: "Financial Allocation & Audits",
    verified: "Verified",
    transparencyDesc: "We maintain full transparency with regular public audits. Every rupee you donate is put to work with high capital efficiency.",
    progDeliveryTitle: "85% Direct Program Delivery",
    progDeliveryDesc: "Funds scholastic kits, food distribution, medicine kits, health diagnostics, and trainer wages on the ground.",
    progSupportTitle: "10% Program Support & Logistics",
    progSupportDesc: "Covers secure supply chain delivery, field worker transportation, campsite setups, and learning center maintenance.",
    adminTitle: "5% Administrative & Governance",
    adminDesc: "Allocated to technology services, secure transaction gate costs, and regulatory compliance reporting.",
    isoBadge: "ISO 9001:2015 Certified & regular audited filings available on public registry.",
    cause1: "Provides a complete scholastic kit (schoolbag, 6 notebooks, stationery box) to one child.",
    cause2: "Finances a free pediatric consultation, medication, and nutrition supplements for a child in a health camp.",
    cause3: "Sponsors training kit (sewing machine accessories or computer materials) for a woman in Project Swabalamban.",
    cause4: "Fully supports a child's education, materials, and mentoring for an entire academic year."
  },
  hi: {
    makeAnImpact: "प्रभाव डालें",
    supportTitle: "नयेपंख का समर्थन करें",
    togetherDifference: "\"आइए मिलकर बदलाव लाएं!\"",
    dearSupporters: "प्रिय समर्थकों और मित्रों,",
    letterP1: "नयेपंख फाउंडेशन की स्थापना एक सरल लेकिन शक्तिशाली दृष्टिकोण के साथ की गई थी - वंचित और हाशिए पर रहने वाले समुदायों का उत्थान करना और उन्हें शिक्षा, स्वास्थ्य सेवा और बुनियादी जरूरतों तक पहुंच प्रदान करना जिसे हम अक्सर हल्के में लेते हैं।",
    letterP2: "हम दृढ़ता से मानते हैं कि हर बच्चे को अपने सपनों को देखने और अपनी आकांक्षाओं को पूरा करने का अधिकार है, चाहे उनकी सामाजिक-आर्थिक पृष्ठभूमि कुछ भी हो। हम इस लक्ष्य की ओर लगातार काम कर रहे हैं, लेकिन हमारे प्रयासों को जारी रखने और एक स्थायी प्रभाव डालने के लिए हमें आपके समर्थन की आवश्यकता है।",
    letterP3: "जैसे ही आप इसे पढ़ते हैं, अनगिनत बच्चे और परिवार बिना बुनियादी जरूरतों के जीवित रहने के लिए संघर्ष कर रहे हैं। उनके पास स्वच्छ पानी, स्वच्छता और उचित स्वास्थ्य सुविधाओं तक पहुंच की कमी है। उनमें से अधिकांश वित्तीय बाधाओं या बुनियादी ढांचे की कमी के कारण स्कूल जाने में असमर्थ हैं।",
    letterP4: "वे गरीबी और निराशा के चक्र में फंसे हुए हैं, और उन्हें हमारी मदद की जरूरत है। हम नयेपंख फाउंडेशन में इस चक्र को तोड़ने और जरूरतमंदों को आशा की किरण प्रदान करने का प्रयास करते हैं। आपके सहयोग से, हम इन समुदायों को शिक्षा, स्वास्थ्य सेवा और अन्य बुनियादी सुविधाएं प्रदान करना जारी रख सकते हैं।",
    letterP5: "हम उन्हें बेहतर जीवन जीने और अपनी वास्तविक क्षमता का एहसास करने के लिए सशक्त बना सकते हैं। हर दान, चाहे कितना भी छोटा क्यों न हो, एक बड़ा बदलाव ला सकता है। आपका सहयोग एक बच्चे को स्कूल की वर्दी, जूते की जोड़ी, या एक पौष्टिक भोजन भी प्रदान कर सकता है।",
    letterP6: "यह एक परिवार को स्वच्छ पानी, स्वच्छता और स्वास्थ्य सुविधाओं तक पहुंच प्रदान कर सकता है। यह किसी के जीवन की दिशा हमेशा के लिए बदल सकता है। हम समझते हैं कि समय कठिन है, और हर कोई अपने स्वयं के संघर्षों से गुजर रहा है। लेकिन हम आपसे आग्रह करते हैं कि आप उन लोगों के बारे में सोचें जो कम भाग्यशाली हैं और मदद का हाथ बढ़ाएं। आपकी उदारता किसी जरूरतमंद के जीवन में बड़ा अंतर ला सकती है।",
    letterP7: "हम जानते हैं कि हम अपने मिशन को जारी रखने के लिए आपके समर्थन पर भरोसा कर सकते हैं। आपका दान हमें और अधिक समुदायों तक पहुंचने और उन लोगों के जीवन में सार्थक प्रभाव डालने में मदद करेगा जिन्हें इसकी सबसे अधिक आवश्यकता है। आइए एक साथ आएं और बदलाव लाएं। हमारे उद्देश्य पर विचार करने और नयेपंख फाउंडेशन का समर्थन करने के लिए धन्यवाद।",
    letterP8: "आपका समर्थन हमारे और उन लोगों के लिए बहुत मायने रखता है जिनकी हम सेवा करते हैं। आइए मिलकर सभी के लिए एक बेहतर दुनिया बनाने के लिए काम करें।",
    gratitude: "हार्दिक आभार के साथ,",
    signature: "प्रशांत शुक्ला, संस्थापक और अध्यक्ष, नयेपंख फाउंडेशन",
    sponsorCause: "एक कारण प्रायोजित करें",
    selectFrequency: "आवृत्ति चुनें",
    oneTime: "एक-बार",
    monthly: "मासिक",
    chooseCause: "समर्थन के लिए एक कारण चुनें",
    catShikshaName: "शिक्षा (प्रोजेक्ट शिक्षा)",
    catShikshaDesc: "कक्षा के उपकरण, ट्यूशन फीस और नोटबुक प्रायोजित करें।",
    catSwasthyaName: "स्वास्थ्य सेवा (प्रोजेक्ट स्वास्थ्य)",
    catSwasthyaDesc: "चिकित्सा क्लीनिकों, स्वच्छता और पोषण का समर्थन करें।",
    catSwabalambanName: "आत्मनिर्भरता (प्रोजेक्ट स्वावलंबन)",
    catSwabalambanDesc: "महिलाओं को व्यावसायिक और कौशल प्रशिक्षण से सशक्त बनाएं।",
    catDrivesName: "कपड़े और भोजन वितरण अभियान",
    catDrivesDesc: "ताजा भोजन और सर्दियों के कपड़े के वितरण को निधि दें।",
    catGeneralName: "सामान्य सहायता",
    catGeneralDesc: "लचीले संसाधन वहां आवंटित किए जाते हैं जहां तत्काल आवश्यकता होती है।",
    choosePreset: "एक निर्धारित राशि चुनें",
    customAmtLabel: "या कस्टम राशि दर्ज करें (INR)",
    customAmtPlaceholder: "कस्टम राशि दर्ज करें",
    proceedDonation: "सुरक्षित दान के लिए आगे बढ़ें",
    processing: "प्रसंस्करण...",
    taxExemptNotice: "80G कर छूट प्रमाण पत्र तुरंत आपके ईमेल पर भेजा जाएगा।",
    seeImpact: "अपना प्रभाव देखें",
    seeImpactDesc: "यह देखने के लिए स्लाइडर को समायोजित करें कि आपका योगदान जमीन पर वास्तविक बदलाव में कैसे परिवर्तित होता है।",
    liveCalc: "लाइव कैलकुलेटर",
    contributionAmount: "योगदान राशि",
    metricScholastic: "स्कूल किट",
    metricScholasticDesc: "बैग, नोटबुक, स्टेशनरी",
    metricHealth: "स्वास्थ्य जांच",
    metricHealthDesc: "परामर्श और दवाएं",
    metricLivelihood: "आजीविका किट",
    metricLivelihoodDesc: "सिलाई/तकनीकी किट",
    metricAnnual: "वार्षिक प्रायोजन",
    metricAnnualDesc: "पूर्ण शिक्षण केंद्र ट्यूशन",
    selectInForm: "दान फॉर्म में चुनें",
    allocationAudits: "वित्तीय आवंटन और ऑडिट",
    verified: "सत्यापित",
    transparencyDesc: "हम नियमित सार्वजनिक ऑडिट के साथ पूर्ण पारदर्शिता बनाए रखते हैं। आपके द्वारा दान किया गया प्रत्येक रुपया उच्च पूंजी दक्षता के साथ काम में लगाया जाता है।",
    progDeliveryTitle: "85% प्रत्यक्ष कार्यक्रम वितरण",
    progDeliveryDesc: "जमीन पर स्कूली किट, भोजन वितरण, दवा किट, स्वास्थ्य निदान और प्रशिक्षक के वेतन को निधि देता है।",
    progSupportTitle: "10% कार्यक्रम समर्थन और रसद",
    progSupportDesc: "सुरक्षित आपूर्ति श्रृंखला वितरण, क्षेत्र कार्यकर्ताओं के परिवहन, शिविर स्थलों और शिक्षण केंद्रों के रखरखाव को कवर करता।",
    adminTitle: "5% प्रशासनिक और शासन",
    adminDesc: "प्रौद्योगिकी सेवाओं, सुरक्षित लेनदेन गेट लागत और नियामक अनुपालन रिपोर्टिंग के लिए आवंटित।",
    isoBadge: "ISO 9001:2015 प्रमाणित और सार्वजनिक रजिस्ट्री पर उपलब्ध नियमित ऑडिटेड फाइलिंग।",
    cause1: "एक बच्चे को एक पूर्ण स्कूली किट (स्कूल बैग, 6 नोटबुक, स्टेशनरी बॉक्स) प्रदान करता है।",
    cause2: "स्वास्थ्य शिविर में एक बच्चे के लिए मुफ्त बाल रोग परामर्श, दवा और पोषण पूरक की व्यवस्था करता है।",
    cause3: "प्रोजेक्ट स्वावलंबन में एक महिला के लिए प्रशिक्षण किट (सिलाई मशीन के सामान या कंप्यूटर सामग्री) को प्रायोजित करता है।",
    cause4: "एक पूरे शैक्षणिक वर्ष के लिए बच्चे की शिक्षा, सामग्री और सलाह का पूर्ण समर्थन करता है।"
  }
};

export default function Donate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [frequency, setFrequency] = useState('one-time');
  const [selectedAmount, setSelectedAmount] = useState(1500);
  const [customAmount, setCustomAmount] = useState('');
  const [checkoutStep, setCheckoutStep] = useState('select');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [calcAmount, setCalcAmount] = useState(3000);
  const { lang } = useLanguageTheme();
  const t = translationDict[lang];

  const presets = [500, 1500, 3000, 6000];

  const categories = [
    { id: 'Shiksha', name: t.catShikshaName, description: t.catShikshaDesc },
    { id: 'Swasthya', name: t.catSwasthyaName, description: t.catSwasthyaDesc },
    { id: 'Swabalamban', name: t.catSwabalambanName, description: t.catSwabalambanDesc },
    { id: 'Clothes/Food drives', name: t.catDrivesName, description: t.catDrivesDesc },
    { id: 'General', name: t.catGeneralName, description: t.catGeneralDesc }
  ];

  const causeBreakdowns = {
    500: t.cause1,
    1500: t.cause2,
    3000: t.cause3,
    6000: t.cause4
  };

  const handlePresetSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    const val = parseInt(e.target.value) || '';
    setCustomAmount(val);
    setSelectedAmount(val);
  };

  const currentAmount = customAmount !== '' ? customAmount : selectedAmount;

  const handleCompletePayment = async () => {
    setProcessing(true);
    setError(null);
    const amountVal = parseInt(currentAmount || 0);

    if (amountVal <= 0) {
      setError("Please specify a valid donation amount.");
      setProcessing(false);
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Failed to load Razorpay payment gateway. Please check your internet connection.");
      setProcessing(false);
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T1NnFHa0RhYzWf';

    const options = {
      key: razorpayKey,
      amount: amountVal * 100,
      currency: "INR",
      name: "NayePankh Foundation",
      description: `Donation: ${frequency.toUpperCase()} - ${selectedCategory}`,
      image: "/logo.png",
      handler: async function (response) {
        try {
          const docData = {
            userId: user?.uid || 'guest',
            userName: user?.name || 'Guest Donor',
            userEmail: user?.email || 'guest@example.com',
            amount: amountVal,
            frequency,
            paymentMethod,
            paymentId: response.razorpay_payment_id,
            status: 'success',
            category: selectedCategory
          };

          if (isConfigured) {
            await addDoc(collection(db, 'donations'), {
              ...docData,
              timestamp: serverTimestamp()
            });
          } else {
            const localDonations = JSON.parse(localStorage.getItem('naye_pankh_donations') || '[]');
            localDonations.push({
              ...docData,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('naye_pankh_donations', JSON.stringify(localDonations));
          }

          sendAdminNotification('donation', docData).catch(err => console.error("Notification failed:", err));

          navigate('/donate-success', {
            state: {
              amount: amountVal,
              paymentId: response.razorpay_payment_id,
              email: user?.email || 'guest@example.com',
              name: user?.name || 'Guest Donor',
              category: selectedCategory
            }
          });
        } catch (err) {
          console.error("Error logging successful payment to database:", err);
          setError("Your payment succeeded, but we couldn't log the donation details. Please reach out to contact@nayepankh.com with your payment reference.");
        } finally {
          setProcessing(false);
        }
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: ''
      },
      theme: {
        color: "#10b981"
      },
      modal: {
        ondismiss: function () {
          setProcessing(false);
          setError("Payment window closed before completion.");
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Failed to open Razorpay modal:", err);
      setError("Unable to open Razorpay checkout. Please check your environment configuration.");
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-60 md:py-72 overflow-hidden bg-cover bg-[center_12%] bg-no-repeat border-b border-slate-200 dark:border-slate-800 pt-36 md:pt-44"
        style={{ backgroundImage: "url('/donate-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-900/60 backdrop-blur-[2px] z-0" />
        
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary-500/10 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-secondary-500/10 rounded-full blur-[100px] z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <img 
            src="/logo.png" 
            className="h-20 w-20 object-contain mx-auto bg-white rounded-3xl p-1 shadow-lg mb-4 border border-slate-100 transition-transform duration-300 hover:scale-105" 
            alt="NayePankh Logo" 
          />
          <div className="flex justify-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-450 bg-primary-50 dark:bg-primary-950/20 px-3.5 py-1.5 rounded-full border border-primary-100 dark:border-primary-900/30">
              {t.makeAnImpact}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-slate-900 dark:text-white drop-shadow-sm">
            {t.supportTitle}
          </h1>
          <h3 className="text-[#132a13] dark:text-emerald-400 text-lg font-bold">
            {t.togetherDifference}
          </h3>
          <div className="text-slate-850 dark:text-slate-250 text-sm max-w-4xl mx-auto leading-relaxed font-bold space-y-4 text-left p-6 bg-white/65 dark:bg-slate-850/60 backdrop-blur-[1px] rounded-[2rem] border border-slate-200/50 dark:border-slate-800">
            <p className="text-base text-primary-600 dark:text-primary-400 font-extrabold">{t.dearSupporters}</p>
            <p>{t.letterP1}</p>
            <p>{t.letterP2}</p>
            <p>{t.letterP3}</p>
            <p>{t.letterP4}</p>
            <p>{t.letterP5}</p>
            <p>{t.letterP6}</p>
            <p>{t.letterP7}</p>
            <p>{t.letterP8}</p>
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">{t.gratitude}</p>
              <p className="text-slate-900 dark:text-white font-extrabold mt-1">{t.signature}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Donation Container */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div id="donation-form-container" className="bg-slate-50 dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg">
            
            {checkoutStep === 'select' && (
              <div className="space-y-8">
                <div className="flex justify-center">
                  <div className="bg-slate-200/60 dark:bg-slate-900/60 p-1 rounded-2xl inline-flex">
                    <button
                      onClick={() => setFrequency('one-time')}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        frequency === 'one-time'
                          ? 'bg-white dark:bg-slate-850 text-slate-950 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {t.oneTime}
                    </button>
                    <button
                      onClick={() => setFrequency('monthly')}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        frequency === 'monthly'
                          ? 'bg-white dark:bg-slate-850 text-slate-950 dark:text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {t.monthly}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display border-l-4 border-primary-500 pl-3">
                    {t.chooseCause}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start justify-between ${
                          selectedCategory === cat.id
                            ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        <div className="space-y-1 pr-4">
                          <span className="text-sm font-bold text-slate-900 dark:text-white block">{cat.name}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 block">{cat.description}</span>
                        </div>
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedCategory === cat.id ? 'border-primary-500 bg-primary-500 text-white' : 'border-slate-300 dark:border-slate-600'
                        }`}>
                          {selectedCategory === cat.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display border-l-4 border-primary-500 pl-3">
                    {t.choosePreset}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {presets.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handlePresetSelect(amount)}
                        className={`py-3.5 px-4 rounded-xl border font-bold text-sm transition-all duration-200 ${
                          currentAmount === amount
                            ? 'border-primary-500 bg-primary-500 text-white shadow-md'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        ₹{amount.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">{t.customAmtLabel}</label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder={t.customAmtPlaceholder}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 text-slate-900 dark:text-white font-semibold transition-colors"
                  />
                </div>

                {causeBreakdowns[currentAmount] && (
                  <div className="p-4 bg-emerald-50/35 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-start space-x-3 text-xs text-emerald-700 dark:text-emerald-400 font-semibold leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>{causeBreakdowns[currentAmount]}</span>
                  </div>
                )}

                <button
                  onClick={() => setCheckoutStep('payment')}
                  disabled={!currentAmount || parseInt(currentAmount) <= 0}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold text-base shadow transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <span>{t.proceedDonation}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {checkoutStep === 'payment' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setCheckoutStep('select')}
                    className="text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white flex items-center space-x-1"
                  >
                    <span>&larr; Back to amount selection</span>
                  </button>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 block">Total Donation</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white font-display">
                      ₹{parseInt(currentAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Select Payment Option</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'upi', label: 'UPI / QR Code', icon: Wallet },
                      { id: 'card', label: 'Card Payment', icon: CreditCard },
                      { id: 'netbanking', label: 'Net Banking', icon: Landmark }
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center space-y-2 transition-all duration-200 ${
                            paymentMethod === method.id
                              ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-950/10 text-primary-650 dark:text-primary-400'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                          }`}
                        >
                          <Icon className="h-6 w-6 shrink-0" />
                          <span className="text-xs font-bold">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-start space-x-3 text-xs text-rose-600 dark:text-rose-455 font-semibold">
                    <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleCompletePayment}
                  disabled={processing}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-base shadow transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{t.processing}</span>
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5 fill-white" />
                      <span>Pay ₹{parseInt(currentAmount).toLocaleString('en-IN')} Now</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block">{t.taxExemptNotice}</span>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Impact Calculator & Allocation Visualizer */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-3.5 py-1.5 rounded-full border border-primary-100 dark:border-primary-900/30">
              Interactive Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
              {t.seeImpact}
            </h2>
            <p className="text-slate-655 dark:text-slate-300 text-sm max-w-xl mx-auto leading-relaxed font-semibold">
              {t.seeImpactDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Impact Calculator Widget */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-lg">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{t.seeImpact}</h3>
                  <span className="text-xs font-black uppercase bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-md">
                    {t.liveCalc}
                  </span>
                </div>
                
                {/* Range Slider Container */}
                <div className="space-y-5 bg-slate-55 dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">{t.contributionAmount}</span>
                    <span className="text-2xl font-black text-primary-600 dark:text-primary-400 font-display">
                      ₹{calcAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    <span>Min: ₹500</span>
                    <span>₹25,000</span>
                    <span>Max: ₹50,000</span>
                  </div>
                </div>

                {/* Counter Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Metric 1 */}
                  <div className="p-4 bg-primary-50/30 dark:bg-primary-950/5 border border-primary-100 dark:border-primary-900/30 rounded-2xl flex items-start space-x-3 transition-transform duration-300 hover:scale-[1.02]">
                    <div className="p-2 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-xl shrink-0 mt-0.5">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{t.metricScholastic}</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white font-display block mt-0.5">
                        {Math.floor(calcAmount / 500)}
                      </span>
                      <span className="text-[10px] text-slate-505 dark:text-slate-400 leading-tight font-medium">{t.metricScholasticDesc}</span>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-4 bg-emerald-50/20 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-start space-x-3 transition-transform duration-300 hover:scale-[1.02]">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 rounded-xl shrink-0 mt-0.5">
                      <Stethoscope className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{t.metricHealth}</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white font-display block mt-0.5">
                        {Math.floor(calcAmount / 1500)}
                      </span>
                      <span className="text-[10px] text-slate-505 dark:text-slate-400 leading-tight font-medium">{t.metricHealthDesc}</span>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-4 bg-indigo-50/20 dark:bg-indigo-950/5 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl flex items-start space-x-3 transition-transform duration-300 hover:scale-[1.02]">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-550 dark:text-indigo-400 rounded-xl shrink-0 mt-0.5">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{t.metricLivelihood}</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white font-display block mt-0.5">
                        {Math.floor(calcAmount / 3000)}
                      </span>
                      <span className="text-[10px] text-slate-505 dark:text-slate-400 leading-tight font-medium">{t.metricLivelihoodDesc}</span>
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="p-4 bg-amber-50/20 dark:bg-amber-950/5 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-start space-x-3 transition-transform duration-300 hover:scale-[1.02]">
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl shrink-0 mt-0.5">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">{t.metricAnnual}</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white font-display block mt-0.5">
                        {Math.floor(calcAmount / 6000)}
                      </span>
                      <span className="text-[10px] text-slate-505 dark:text-slate-400 leading-tight font-medium">{t.metricAnnualDesc}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedAmount(calcAmount);
                  setCustomAmount('');
                  document.getElementById('donation-form-container')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3.5 rounded-xl border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-bold text-sm transition-all duration-300 text-center flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{lang === 'en' ? `Select ₹${calcAmount.toLocaleString('en-IN')} in Donation Form` : `दान फॉर्म में ₹${calcAmount.toLocaleString('en-IN')} चुनें`}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Allocation Visualizer Panel */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-lg">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{t.allocationAudits}</h3>
                  <span className="text-xs font-black uppercase bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 px-2.5 py-1 rounded-md flex items-center space-x-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>{t.verified}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {t.transparencyDesc}
                </p>

                {/* Segmented Horizontal Progress Bar */}
                <div className="space-y-2">
                  <div className="h-6 w-full rounded-xl overflow-hidden flex shadow-inner bg-slate-200 dark:bg-slate-700">
                    <div className="bg-primary-500 h-full" style={{ width: '85%' }} title="Direct Program Delivery (85%)" />
                    <div className="bg-amber-500 h-full" style={{ width: '10%' }} title="Program Support (10%)" />
                    <div className="bg-slate-450 h-full" style={{ width: '5%' }} title="Admin & Governance (5%)" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 px-1">
                    <span>Program: 85%</span>
                    <span>Support: 10%</span>
                    <span>Admin: 5%</span>
                  </div>
                </div>

                {/* Allocation Breakdowns List */}
                <div className="space-y-3.5 pt-2">
                  {/* Program Delivery */}
                  <div className="flex items-start space-x-3 text-xs leading-relaxed">
                    <span className="w-3.5 h-3.5 rounded-full bg-primary-500 shrink-0 mt-0.5"></span>
                    <div className="space-y-0.5">
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">{t.progDeliveryTitle}</strong>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{t.progDeliveryDesc}</p>
                    </div>
                  </div>

                  {/* Program Support */}
                  <div className="flex items-start space-x-3 text-xs leading-relaxed">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0 mt-0.5"></span>
                    <div className="space-y-0.5">
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">{t.progSupportTitle}</strong>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{t.progSupportDesc}</p>
                    </div>
                  </div>

                  {/* Administrative Costs */}
                  <div className="flex items-start space-x-3 text-xs leading-relaxed">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-450 shrink-0 mt-0.5"></span>
                    <div className="space-y-0.5">
                      <strong className="text-slate-800 dark:text-slate-200 font-bold">{t.adminTitle}</strong>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{t.adminDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security / Compliance Badge */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl flex items-center space-x-3 text-xs text-slate-650 dark:text-slate-400">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="font-semibold leading-relaxed">
                  {t.isoBadge}
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
