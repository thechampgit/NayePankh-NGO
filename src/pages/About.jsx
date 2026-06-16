import { Sparkles, BookOpen, HeartPulse, Award, Users, ShieldAlert } from 'lucide-react';
import { useLanguageTheme } from '../context/LanguageThemeContext';

const translationDict = {
  en: {
    whoWeAre: "Who We Are",
    aboutTitle: "About NayePankh",
    aboutDesc: "What is NayePankh?\nNayepankh foundation was initiated to bring a change and help people during the tough times of Covid.\nLater in the year, the NGO started to expand their operations and provide help to a wider section of the society.\nWith this revamped vision, the NGO acquired the name of NayePankh – giving wings to uplift the underprivileged section of our society.\nNayePankh is one of the eminent NGOs espoused in providing food, sanitary napkins, clothes, educating underprivileged sectors of our society for the better future.\nWe make efforts to solve daily problems faced by people of India.\nMost of the young women feel humiliating in public places during their menstrual cycle;\nto bring change we create awareness campaigns among woman and youths about personal hygiene, providing sanitary napkins.\nAlso, in our endeavour to fight hunger we distribute food not only to the underprivileged community\nbut also to the stray animals. We are also providing clothes to the poor families.\nTill date we have helped more than two lakhs of people. Although this seems quite a big achievement,\nbut our goal is still not complete, therefore we’re continuing more with hustle. When lockdown was hitting hard, we took a decision\nand now we are a 12A and 80G certified NGO (that means if someone donates to NayePankh they will get a relief of 50%in income tax).\nThe most striking feature about us is that we are completely led by the youths of our country, many of whom are still in their colleges and schools.\nWe are on a mission to make this earth a better place to live for all creatures. We are here as 'BADALTE BHARAT KI NAYI TASVEER'!!",
    ourJourney: "Our Journey",
    howItStartedTitle: "How it started?",
    howItStartedP1: "As we all know, 2020 was a year the world was striving to survive the global pandemic of covid-19. During these dire times we felt an urge to make an impact with whatever we had, and so we tried!!",
    howItStartedP2: "We tried to uplift the underprivileged and help the needy with all our resources and material we could arrange, it was tough but we didn't lose our hope and kept going in order to bring a change everyone was expecting the bigger authorities to bring in the societies on smaller levels.",
    howItStartedP3: "We started off as a group of bunch of highschoolers but now are a team of numerous people from different parts of the city and state! 28th March 2021, the day we officially landed on the ground to serve our duties as the youth of the most rapidly progressing nation afterall, the main hope of a nation lies in the arms of its youth.",
    ourMission: "Our Mission",
    missionDesc: "To build sustainable self-governing models for community learning centers, and establish localized access to clinical consultation, giving underprivileged children and women the support and training they require to thrive.",
    ourVision: "Our Vision",
    visionDesc: "A nation where no child drops out of school due to lack of study supplies or economic distress, and where high-quality emergency treatment and primary health checks are available in every pin code.",
    keyFocusTitle: "Key Focus Areas",
    teamTitle: "Our Team & Leadership",
    teamDesc: "We are completely led by the youth of India, working together to bring opportunities and support to underprivileged families.",
    ourStrength: "Our Strength",
    familyTitle: "The NayePankh Family",
    familyDesc: "A nationwide community of passionate students and professionals driving classroom tutoring setups, clinical testing sessions, and winter supplies distribution drives.",
    govApproved: "Government Approved",
    legalRegTitle: "Legal Registrations & Certifications",
    legalRegDesc: "We operate with complete transparency. NayePankh Foundation is registered under the Societies Registration Act and certified under sections 12A and 80G of the Income Tax Act, allowing tax exemption on donations.",
    societyReg: "Society Registration",
    societyIssued: "Issued by Govt. of Uttar Pradesh",
    societyAct: "Act XXI of 1860",
    reg12a: "12A Registration",
    deptIndia: "Income Tax Department, India",
    form10ac: "Form No. 10AC",
    ex80g: "80G Tax Exemption",
    taxRelief: "50% Tax Relief",
    focus: {
      eduTitle: "EDUCATION",
      eduDesc: "Education, nutrition and holistic development of children",
      healthTitle: "HEALTHCARE",
      healthDesc: "Taking healthcare services to doorsteps of hard to reach communities",
      womenTitle: "WOMEN EMPOWERMENT",
      womenDesc: "Empowering adolescent girls & women through community engagement",
      livelihoodTitle: "LIVELIHOOD",
      livelihoodDesc: "Skill training and placement support for underprivileged youth",
      grassrootsTitle: "EMPOWERING GRASSROOTS",
      grassrootsDesc: "Helping community-based organizations build capacity and scale.",
      disasterTitle: "DISASTER RESPONSE",
      disasterDesc: "Reach out and respond to the needs of the disaster-affected families."
    },
    members: {
      prashantRole: "Founder & President",
      prashantBio: "Social Entrepreneur with 10+ years driving community development projects.",
      ankitaRole: "Head of Operations",
      ankitaBio: "Former NGO lead, specializing in rural outreach and health campaigns.",
      rajeshRole: "Volunteer Coordinator",
      rajeshBio: "Builds and coordinates our network of 2500+ national volunteers."
    }
  },
  hi: {
    whoWeAre: "हम कौन हैं",
    aboutTitle: "नयेपंख के बारे में",
    aboutDesc: "नयेपंख क्या है?\nनयेपंख फाउंडेशन की शुरुआत कोविड के कठिन समय में बदलाव लाने और लोगों की मदद करने के लिए की गई थी।\nबाद में वर्ष में, एनजीओ ने अपने परिचालन का विस्तार करना शुरू कर दिया और समाज के एक व्यापक वर्ग को सहायता प्रदान की।\nइस नए दृष्टिकोण के साथ, एनजीओ ने हमारे समाज के वंचित वर्ग के उत्थान के लिए पंख देने के लिए नयेपंख नाम अपनाया।\nनयेपंख एक बेहतर भविष्य के लिए हमारे समाज के वंचित वर्गों को भोजन, सेनेटरी नैपकिन, कपड़े, शिक्षित करने के लिए समर्पित एक प्रमुख गैर सरकारी संगठन है।\nहम भारत के लोगों द्वारा सामना की जाने वाली दैनिक समस्याओं को हल करने का प्रयास करते हैं।\nअधिकांश युवा महिलाएं मासिक धर्म चक्र के दौरान सार्वजनिक स्थानों पर अपमान महसूस करती हैं;\nबदलाव लाने के लिए हम महिलाओं और युवाओं के बीच व्यक्तिगत स्वच्छता के बारे में जागरूकता अभियान बनाते हैं, सेनेटरी नैपकिन प्रदान करते हैं।\nसाथ ही, भूख के खिलाफ हमारे प्रयास में हम न केवल वंचित समुदाय को बल्कि लावारिस पशुओं को भी भोजन वितरित करते हैं। हम गरीब परिवारों को कपड़े भी उपलब्ध करा रहे हैं।\nआज तक हमने दो लाख से अधिक लोगों की मदद की है। हालांकि यह एक बहुत बड़ी उपलब्धि लग सकती है,\nलेकिन हमारा लक्ष्य अभी भी पूरा नहीं हुआ है, इसलिए हम और अधिक प्रयास जारी रख रहे हैं। जब लॉकडाउन कठिन था, हमने एक निर्णय लिया\nऔर अब हम 12A और 80G प्रमाणित एनजीओ हैं (इसका मतलब है कि अगर कोई नयेपंख को दान करता है तो उन्हें आयकर में 50% की राहत मिलेगी)।\nहमारे बारे में सबसे खास बात यह है कि हम पूरी तरह से हमारे देश के युवाओं द्वारा संचालित हैं, जिनमें से कई अभी भी अपने कॉलेजों और स्कूलों में हैं।\nहम इस धरती को सभी प्राणियों के रहने के लिए एक बेहतर जगह बनाने के मिशन पर हैं। हम यहां 'बदलते भारत की नई तस्वीर' के रूप में हैं!!",
    ourJourney: "हमारी यात्रा",
    howItStartedTitle: "यह कैसे शुरू हुआ?",
    howItStartedP1: "जैसा कि हम सभी जानते हैं, 2020 एक ऐसा वर्ष था जब दुनिया कोविड-19 की वैश्विक महामारी से बचने का प्रयास कर रही थी। इन कठिन परिस्थितियों में हमने जो कुछ भी हमारे पास था उससे बदलाव लाने का आग्रह महसूस किया, और इसलिए हमने कोशिश की!!",
    howItStartedP2: "हमने वंचितों के उत्थान और जरूरतमंदों की मदद करने की कोशिश की, हमारे पास जितने भी संसाधन और सामग्री थी, उससे मदद की। यह कठिन था लेकिन हमने अपनी उम्मीद नहीं खोई और हर छोटे स्तर पर समाज में बड़े बदलाव लाने की उम्मीद को जारी रखा।",
    howItStartedP3: "हमने हाई स्कूल के छात्रों के एक छोटे समूह के रूप में शुरुआत की थी, लेकिन आज हम शहर और राज्य के विभिन्न हिस्सों के अनगिनत लोगों की एक टीम हैं! 28 मार्च 2021, वह दिन जब हम आधिकारिक तौर पर देश के सबसे तेजी से प्रगति कर रहे युवाओं के रूप में अपनी सेवा देने के लिए जमीन पर उतरे, आखिरकार, देश की मुख्य आशा उसके युवाओं की बाहों में निहित है।",
    ourMission: "हमारा मिशन",
    missionDesc: "सामुदायिक शिक्षण केंद्रों के लिए स्थायी स्व-शासी मॉडल बनाना, और वंचित बच्चों और महिलाओं को उनके फलने-फूलने के लिए आवश्यक सहायता और प्रशिक्षण प्रदान करने के लिए नैदानिक परामर्श तक स्थानीय पहुंच स्थापित करना।",
    ourVision: "हमारा दृष्टिकोण",
    visionDesc: "एक ऐसा देश जहां कोई भी बच्चा अध्ययन सामग्री या आर्थिक संकट की कमी के कारण स्कूल न छोड़े, और जहां हर पिन कोड में उच्च गुणवत्ता वाली आपातकालीन चिकित्सा और प्राथमिक स्वास्थ्य जांच उपलब्ध हो।",
    keyFocusTitle: "प्रमुख फोकस क्षेत्र",
    teamTitle: "हमारी टीम और नेतृत्व",
    teamDesc: "हम पूरी तरह से भारत के युवाओं द्वारा संचालित हैं, जो वंचित परिवारों को अवसर और सहायता प्रदान करने के लिए मिलकर काम कर रहे हैं।",
    ourStrength: "हमारी ताकत",
    familyTitle: "नयेपंख परिवार",
    familyDesc: "देश भर के उत्साही छात्रों और पेशेवरों का एक समुदाय जो कक्षा शिक्षण, नैदानिक परीक्षण और शीतकालीन आपूर्ति वितरण अभियानों का नेतृत्व कर रहा है।",
    govApproved: "सरकार द्वारा अनुमोदित",
    legalRegTitle: "कानूनी पंजीकरण और प्रमाणन",
    legalRegDesc: "हम पूर्ण पारदर्शिता के साथ काम करते हैं। नयेपंख फाउंडेशन सोसायटी पंजीकरण अधिनियम के तहत पंजीकृत है और आयकर अधिनियम की धारा 12A और 80G के तहत प्रमाणित है, जिससे दान पर कर छूट मिलती है।",
    societyReg: "सोसायटी पंजीकरण",
    societyIssued: "उत्तर प्रदेश सरकार द्वारा जारी",
    societyAct: "अधिनियम XXI 1860",
    reg12a: "12A पंजीकरण",
    deptIndia: "आयकर विभाग, भारत",
    form10ac: "फॉर्म नंबर 10AC",
    ex80g: "80G कर छूट",
    taxRelief: "50% कर राहत",
    focus: {
      eduTitle: "शिक्षा",
      eduDesc: "बच्चों की शिक्षा, पोषण और समग्र विकास",
      healthTitle: "स्वास्थ्य सेवा",
      healthDesc: "कठिन पहुंच वाले समुदायों के दरवाजे तक स्वास्थ्य सेवाएं पहुंचाना",
      womenTitle: "महिला सशक्तिकरण",
      womenDesc: "सामुदायिक जुड़ाव के माध्यम से किशोरियों और महिलाओं को सशक्त बनाना",
      livelihoodTitle: "आजीविका",
      livelihoodDesc: "वंचित युवाओं के लिए कौशल प्रशिक्षण और प्लेसमेंट सहायता",
      grassrootsTitle: "जमीनी स्तर को सशक्त बनाना",
      grassrootsDesc: "सामुदायिक संगठनों की क्षमता निर्माण और विस्तार में मदद करना।",
      disasterTitle: "आपदा प्रतिक्रिया",
      disasterDesc: "आपदा प्रभावित परिवारों की आवश्यकताओं तक पहुंचना और सहायता करना।"
    },
    members: {
      prashantRole: "संस्थापक और अध्यक्ष",
      prashantBio: "सामुदायिक विकास परियोजनाओं को चलाने वाले 10+ वर्षों के अनुभव के साथ सामाजिक उद्यमी।",
      ankitaRole: "संचालन प्रमुख",
      ankitaBio: "पूर्व एनजीओ प्रमुख, जो ग्रामीण आउटरीच और स्वास्थ्य अभियानों में विशेषज्ञता रखती हैं।",
      rajeshRole: "स्वयंसेवक समन्वयक",
      rajeshBio: "हमारे 2500+ राष्ट्रीय स्वयंसेवकों के नेटवर्क का निर्माण और समन्वय करते हैं।"
    }
  }
};

export default function About() {
  const { lang, isDarkMode } = useLanguageTheme();
  const t = translationDict[lang];

  const values = [
    { 
      title: t.focus.eduTitle, 
      desc: t.focus.eduDesc, 
      icon: BookOpen, 
      colorClass: 'text-amber-500', 
      bgClass: 'bg-amber-500/10 rounded-[35%_65%_60%_40%_/_40%_50%_50%_60%]' 
    },
    { 
      title: t.focus.healthTitle, 
      desc: t.focus.healthDesc, 
      icon: HeartPulse, 
      colorClass: 'text-purple-500', 
      bgClass: 'bg-purple-500/10 rounded-[60%_40%_30%_70%_/_50%_40%_60%_50%]' 
    },
    { 
      title: t.focus.womenTitle, 
      desc: t.focus.womenDesc, 
      icon: Sparkles, 
      colorClass: 'text-teal-600', 
      bgClass: 'bg-teal-600/10 rounded-[40%_60%_50%_50%_/_60%_40%_60%_40%]' 
    },
    { 
      title: t.focus.livelihoodTitle, 
      desc: t.focus.livelihoodDesc, 
      icon: Award, 
      colorClass: 'text-amber-700 dark:text-amber-500', 
      bgClass: 'bg-amber-700/10 rounded-[50%_30%_70%_30%_/_40%_60%_40%_60%]' 
    },
    { 
      title: t.focus.grassrootsTitle, 
      desc: t.focus.grassrootsDesc, 
      icon: Users, 
      colorClass: 'text-emerald-600 dark:text-emerald-400', 
      bgClass: 'bg-emerald-600/10 rounded-[30%_70%_50%_50%_/_50%_50%_50%_50%]' 
    },
    { 
      title: t.focus.disasterTitle, 
      desc: t.focus.disasterDesc, 
      icon: ShieldAlert, 
      colorClass: 'text-rose-500', 
      bgClass: 'bg-rose-500/10 rounded-[60%_40%_50%_50%_/_40%_60%_40%_60%]' 
    }
  ];

  const team = [
    { name: 'Prashant Shukla', role: t.members.prashantRole, bio: t.members.prashantBio, imageBg: 'from-amber-400 to-orange-500' },
    { name: 'Ankita Mishra', role: t.members.ankitaRole, bio: t.members.ankitaBio, imageBg: 'from-emerald-400 to-teal-500' },
    { name: 'Rajesh Sharma', role: t.members.rajeshRole, bio: t.members.rajeshBio, imageBg: 'from-purple-400 to-indigo-500' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-24 md:py-32 overflow-hidden bg-cover bg-[center_12%] bg-no-repeat border-b border-slate-200 dark:border-slate-800 pt-36 md:pt-44"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        {/* Semi-transparent light/dark overlay for image visibility and text readability */}
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
              {t.whoWeAre}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-[#132a13] dark:text-emerald-450 drop-shadow-sm">
            {t.aboutTitle}
          </h1>
          <div className="text-slate-800 dark:text-slate-205 text-sm max-w-4xl mx-auto leading-relaxed font-bold space-y-4">
            {t.aboutDesc.split('\n').map((para, pIdx) => (
              <p key={pIdx}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* How It Started */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Text Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/20 px-3.5 py-1.5 rounded-full border border-primary-100 dark:border-primary-900/30">
                  {t.ourJourney}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#132a13] dark:text-[#a3b899] font-display">
                {t.howItStartedTitle}
              </h2>
              <div className="space-y-4 text-slate-650 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                <p>{t.howItStartedP1}</p>
                <p>{t.howItStartedP2}</p>
                <p>{t.howItStartedP3}</p>
              </div>
            </div>
            {/* Image Column */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500/10 to-amber-500/10 rounded-3xl blur-2xl opacity-70 -z-10" />
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-800 p-2">
                  <img 
                    src="/start.jpg" 
                    alt="NayePankh Foundation - How it started" 
                    className="w-full h-auto object-cover rounded-2xl" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-950/20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Mission Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
              <div className="h-64 sm:h-72 overflow-hidden">
                <img 
                  src="/mission.jpg" 
                  alt="Our Mission" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-8 sm:p-10 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 font-display">{t.ourMission}</h2>
                  <p className="text-slate-650 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    {t.missionDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
              <div className="h-64 sm:h-72 overflow-hidden">
                <img 
                  src="/vision.jpg" 
                  alt="Our Vision" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-8 sm:p-10 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 font-display">{t.ourVision}</h2>
                  <p className="text-slate-650 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    {t.visionDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Focus Areas */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-950/20 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display">{t.keyFocusTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="flex items-start space-x-6">
                  <div className={`w-16 h-16 shrink-0 flex items-center justify-center ${v.bgClass} ${v.colorClass}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 pt-1.5">
                    <h3 className={`text-lg sm:text-xl font-extrabold tracking-wider uppercase font-display ${v.colorClass}`}>
                      {v.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leaders Section */}
      <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display">{t.teamTitle}</h2>
            <p className="text-slate-505 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              {t.teamDesc}
            </p>
          </div>

          {/* Standalone Team/Volunteer Photo Banner */}
          <div className="mb-20 rounded-3xl overflow-hidden shadow-xl border border-slate-200/85 dark:border-slate-800 relative h-[320px] sm:h-[480px] group">
            <img 
              src="/team.png" 
              alt="NayePankh Volunteer Team" 
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]" 
            />
            {/* Gradient overlay for layout depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-8 sm:p-12">
              <div>
                <span className="text-xs font-bold text-primary-400 uppercase tracking-widest bg-[#132a13]/60 px-3.5 py-1.5 rounded-lg border border-primary-500/20">
                  {t.ourStrength}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-3.5 font-display">
                  {t.familyTitle}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-2.5 max-w-2xl leading-relaxed">
                  {t.familyDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Leaders Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/85 dark:border-slate-700 hover:border-transparent hover:shadow-2xl shadow-sm transition-all duration-300 overflow-hidden flex flex-col justify-between">
                <div className={`h-40 bg-gradient-to-tr ${m.imageBg}`} />
                <div className="p-8 flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">{m.name}</h3>
                  <p className="text-xs text-primary-500 dark:text-primary-400 font-bold tracking-wider uppercase mb-4">{m.role}</p>
                  <p className="text-slate-500 dark:text-slate-300 text-sm leading-relaxed">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="flex justify-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3.5 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                {t.govApproved}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display">
              {t.legalRegTitle}
            </h2>
            <p className="text-slate-505 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              {t.legalRegDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Society Registration */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/85 dark:border-slate-700 hover:border-transparent hover:shadow-2xl shadow-sm transition-all duration-300 p-5 flex flex-col group">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-1 flex items-center justify-center">
                <img 
                  src="/cert-reg.png" 
                  alt="Society Registration Certificate" 
                  className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.03]" 
                />
              </div>
              <div className="text-center mt-5 space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{t.societyReg}</h3>
                <p className="text-xs text-slate-505 dark:text-slate-400 font-medium">{t.societyIssued}</p>
                <div className="pt-2">
                  <span className="text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider bg-primary-50 dark:bg-primary-950/20 px-2.5 py-1 rounded-md border border-primary-100 dark:border-primary-900/30">
                    {t.societyAct}
                  </span>
                </div>
              </div>
            </div>

            {/* 12A Certificate */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/85 dark:border-slate-700 hover:border-transparent hover:shadow-2xl shadow-sm transition-all duration-300 p-5 flex flex-col group">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-1 flex items-center justify-center">
                <img 
                  src="/cert-12a.png" 
                  alt="12A Certificate" 
                  className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.03]" 
                />
              </div>
              <div className="text-center mt-5 space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{t.reg12a}</h3>
                <p className="text-xs text-slate-505 dark:text-slate-400 font-medium">{t.deptIndia}</p>
                <div className="pt-2">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                    {t.form10ac}
                  </span>
                </div>
              </div>
            </div>

            {/* 80G Certificate */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/85 dark:border-slate-700 hover:border-transparent hover:shadow-2xl shadow-sm transition-all duration-300 p-5 flex flex-col group">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-1 flex items-center justify-center">
                <img 
                  src="/cert-80g.png" 
                  alt="80G Certificate" 
                  className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.03]" 
                />
              </div>
              <div className="text-center mt-5 space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{t.ex80g}</h3>
                <p className="text-xs text-slate-505 dark:text-slate-400 font-medium">{t.deptIndia}</p>
                <div className="pt-2">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                    {t.taxRelief}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
