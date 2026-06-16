import { useState } from 'react';
import { useLanguageTheme } from '../context/LanguageThemeContext';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  HeartPulse, 
  Sparkles, 
  Award, 
  Layers,
  Maximize2
} from 'lucide-react';


const translationDict = {
  en: {
    ourGallery: "Our Gallery",
    mediaBadge: "NayePankh Media",
    bannerDesc: "Glimpses of Hope, Progress, and Joy we bring to underprivileged communities. See our hands-on efforts across primary classrooms, medical setups, and distribution camps.",
    capturedMoments: "Captured Moments",
    reelsHighlights: "Reels & Highlights",
    noPhotos: "No photos found",
    noVideos: "No videos found",
    selectAnotherCat: "Please select another category.",
    viewReelsBtn: "View All Reels on Instagram",
    closeBtn: "Close image overview",
    prevBtn: "Previous image",
    nextBtn: "Next image",
    
    // Category translations
    'All': 'All',
    'Education': 'Education',
    'Healthcare': 'Healthcare',
    'Livelihood': 'Livelihood',
    'Outreach': 'Outreach'
  },
  hi: {
    ourGallery: "हमारी गैलरी",
    mediaBadge: "नयेपंख मीडिया",
    bannerDesc: "अंडरप्रिविलेज्ड समुदायों में आशा, प्रगति और खुशी की झलकियाँ। प्राथमिक कक्षाओं, चिकित्सा शिविरों और वितरण शिविरों में हमारे जमीनी प्रयासों को देखें।",
    capturedMoments: "कैप्चर किए गए क्षण",
    reelsHighlights: "रील्स और हाइलाइट्स",
    noPhotos: "कोई फ़ोटो नहीं मिला",
    noVideos: "कोई वीडियो नहीं मिला",
    selectAnotherCat: "कृपया दूसरी श्रेणी चुनें।",
    viewReelsBtn: "इंस्टाग्राम पर सभी रील्स देखें",
    closeBtn: "छवि अवलोकन बंद करें",
    prevBtn: "पिछली छवि",
    nextBtn: "अगली छवि",
    
    // Category translations
    'All': 'सभी',
    'Education': 'शिक्षा',
    'Healthcare': 'स्वास्थ्य',
    'Livelihood': 'आजीविका',
    'Outreach': 'आउटरीच'
  }
};

const categories = ['All', 'Education', 'Healthcare', 'Livelihood', 'Outreach'];

const galleryItems = [
  {
    id: 1,
    url: '/gallery1.png',
    title: 'Happy Children Group',
    category: 'Outreach',
    desc: 'Team members posing with a large group of smiling children during our community outreach program.',
    hiTitle: 'खुश बच्चों का समूह',
    hiDesc: 'हमारे सामुदायिक आउटरीच कार्यक्रम के दौरान मुस्कुराते हुए बच्चों के एक बड़े समूह के साथ पोज़ देते हुए टीम के सदस्य।',
    icon: Award
  },
  {
    id: 2,
    url: '/gallery2.png',
    title: 'Bal Sanskar Kendra Study',
    category: 'Education',
    desc: 'Children focused on writing and learning during our open-air classroom sessions.',
    hiTitle: 'बाल संस्कार केंद्र अध्ययन',
    hiDesc: 'हमारी खुली हवा में चलने वाली कक्षा के सत्रों के दौरान लिखने और सीखने पर ध्यान केंद्रित करते बच्चे।',
    icon: BookOpen
  },
  {
    id: 3,
    url: '/gallery3.png',
    title: 'Outreach and Celebrations Collage',
    category: 'Outreach',
    desc: 'Collage of joyous moments showing birthday celebrations, cake cutting, and gift distributions.',
    hiTitle: 'आउटरीच और समारोह कोलाज',
    hiDesc: 'जन्मदिन समारोह, केक काटने और उपहार वितरण के आनंदमय क्षणों का कोलाज।',
    icon: Sparkles
  },
  {
    id: 4,
    url: '/gallery4.jpg',
    title: 'Community Birthday Celebration',
    category: 'Outreach',
    desc: 'Bringing happiness by celebrating birthdays with delicious cakes and community fun.',
    hiTitle: 'सामुदायिक जन्मदिन समारोह',
    hiDesc: 'स्वादिष्ट केक और सामुदायिक मस्ती के साथ जन्मदिन मनाकर खुशियाँ लाना।',
    icon: Award
  },
  {
    id: 5,
    url: '/gallery5.png',
    title: 'Women\'s Day Distribution Drive',
    category: 'Livelihood',
    desc: 'Spreading health and hygiene awareness by distributing health kits to women on Women\'s Day.',
    icon: Sparkles
  },
  {
    id: 6,
    url: '/gallery6.png',
    title: 'Smart Class Tutoring',
    category: 'Education',
    desc: 'Volunteers conducting interactive classroom coaching sessions for young students.',
    hiTitle: 'स्मार्ट क्लास ट्यूशन',
    hiDesc: 'युवा छात्रों के लिए इंटरैक्टिव क्लासरूम कोचिंग सत्र आयोजित करते स्वयंसेवक।',
    icon: BookOpen
  },
  {
    id: 7,
    url: '/gallery7.png',
    title: 'One-on-One Mentorship',
    category: 'Education',
    desc: 'Dedicated volunteers providing personalized learning assistance and guidance to individual children.',
    icon: BookOpen
  },
  {
    id: 8,
    url: '/gallery8.png',
    title: 'Volunteer Settlement Visit',
    category: 'Outreach',
    desc: 'NayePankh field volunteers visiting local families in community settlements to assess needs.',
    icon: Award
  },
  {
    id: 9,
    url: '/gallery9.png',
    title: 'Interactive Children Workshop',
    category: 'Education',
    desc: 'Fun educational workshops and bonding activities held indoors with team volunteers.',
    icon: BookOpen
  },
  {
    id: 10,
    url: '/gallery10.png',
    title: 'Festive Celebration Event',
    category: 'Outreach',
    desc: 'Organizing grand birthday parties and festive celebrations to bring joy to community children.',
    icon: Award
  },
  {
    id: 11,
    url: '/gallery11.png',
    title: 'Balloon Distribution Playtime',
    category: 'Outreach',
    desc: 'Spreading smiles and hosting fun play sessions with balloons for community kids.',
    icon: Award
  },
  {
    id: 12,
    url: '/gallery12.png',
    title: 'Team Volunteer Group',
    category: 'Outreach',
    desc: 'A proud group of NayePankh field volunteers posing during an outreach drive.',
    icon: Sparkles
  },
  {
    id: 13,
    url: '/gallery13.png',
    title: 'Birthday Cake Cutting',
    category: 'Outreach',
    desc: 'Celebrating birthdays with delicious cakes and sharing sweet memories with kids.',
    icon: Award
  },
  {
    id: 14,
    url: '/gallery14.png',
    title: 'Outdoor Birthday Party',
    category: 'Outreach',
    desc: 'Joyous kids wearing birthday hats and cheering during our community gathering.',
    icon: Award
  },
  {
    id: 15,
    url: '/gallery15.png',
    title: 'Joyful piggyback ride',
    category: 'Outreach',
    desc: 'A volunteer carrying a smiling child on his shoulders during a community play day.',
    icon: Sparkles
  },
  {
    id: 16,
    url: '/gallery16.png',
    title: 'Gift Distribution Program',
    category: 'Outreach',
    desc: 'Distributing gifts and snacks to kids to spread happiness and care.',
    icon: Award
  },
  {
    id: 17,
    url: '/gallery17.png',
    title: 'Drawing and Art Session',
    category: 'Education',
    desc: 'Children proudly showcasing their creative drawing and art activities during workshops.',
    icon: BookOpen
  },
  {
    id: 18,
    url: '/gallery18.png',
    title: 'Outreach Team Meet',
    category: 'Outreach',
    desc: 'Team members posing outdoors during our weekend village surveys and visits.',
    icon: Sparkles
  },
  {
    id: 19,
    url: '/gallery19.png',
    title: 'Young Scholar Drawing',
    category: 'Education',
    desc: 'A focused child working on her drawing activity during our tutoring session.',
    icon: BookOpen
  },
  {
    id: 20,
    url: '/gallery20.png',
    title: 'Student Mentor Session',
    category: 'Education',
    desc: 'A volunteer discussing study guides and mentoring a student on the lawn.',
    icon: BookOpen
  },
  {
    id: 21,
    url: '/gallery21.png',
    title: 'Community Gathering with Volunteers',
    category: 'Outreach',
    desc: 'Volunteers posing with a large group of local children during a community survey and interaction drive.',
    icon: Sparkles
  },
  {
    id: 22,
    url: '/gallery22.png',
    title: 'Interactive Mentorship Session',
    category: 'Education',
    desc: 'A volunteer explaining worksheets and guiding young minds during our open-air classroom coaching.',
    icon: BookOpen
  },
  {
    id: 23,
    url: '/gallery23.png',
    title: 'Joyful Birthday Celebration',
    category: 'Outreach',
    desc: 'Spreading happiness by sharing cake and celebrating birthdays with children in the community.',
    icon: Award
  },
  {
    id: 24,
    url: '/gallery24.png',
    title: 'Winter Blanket Distribution Drive',
    category: 'Outreach',
    desc: 'Distributing warm blankets to families and underprivileged residents during our winter outreach campaign.',
    hiTitle: 'शीतकालीन कंबल वितरण अभियान',
    hiDesc: 'हमारे शीतकालीन आउटरीच अभियान के दौरान परिवारों और जरूरतमंद निवासियों को गर्म कंबल वितरित करना।',
    icon: Award
  },
  {
    id: 25,
    url: '/gallery25.png',
    title: 'Playtime and Fun Activities',
    category: 'Outreach',
    desc: 'Volunteers and children engaging in fun group activities and playtime at the local park.',
    icon: Sparkles
  },
  {
    id: 26,
    url: '/gallery26.png',
    title: 'Community Outreach Program',
    category: 'Outreach',
    desc: 'Volunteers visiting local families and children in community settlements to share happiness and birthday wishes.',
    icon: Award
  },
  {
    id: 27,
    url: '/gallery27.png',
    title: 'Sweet Celebration Moments',
    category: 'Outreach',
    desc: 'A heart-warming collage of kids celebrating with cake, joy, and smiles during our distributions.',
    icon: Sparkles
  },
  {
    id: 28,
    url: '/gallery28.png',
    title: 'Whiteboard Teaching Session',
    category: 'Education',
    desc: 'One-on-one open-air classroom tutoring helping kids with basic mathematics and language skills.',
    icon: BookOpen
  },
  {
    id: 29,
    url: '/gallery29.png',
    title: 'Happy Field Team',
    category: 'Outreach',
    desc: 'NayePankh volunteers and kids enjoying a sunny day together on the grass during a weekend program.',
    icon: Award
  },
  {
    id: 30,
    url: '/gallery30.png',
    title: 'Smiles and Peace Signs',
    category: 'Outreach',
    desc: 'A cheerful group of children and volunteers sharing positive vibes and laughter in a local park.',
    icon: Sparkles
  },
  {
    id: 31,
    url: '/gallery31.png',
    title: 'Outdoor Art and Sketching',
    category: 'Education',
    desc: 'A child focusing on drawing and creative expressions during our outdoor workshop on the lawn.',
    icon: BookOpen
  },
  {
    id: 32,
    url: '/gallery32.png',
    title: 'Alphabet Learning Session',
    category: 'Education',
    desc: 'A volunteer teaching English alphabets to a young student using a whiteboard in our open-air classroom.',
    icon: BookOpen
  },
  {
    id: 33,
    url: '/gallery33.png',
    title: 'Caring for Children',
    category: 'Outreach',
    desc: 'Volunteers spending quality time and spreading love during our community outreach and survey drives.',
    icon: Sparkles
  },
  {
    id: 34,
    url: '/gallery34.png',
    title: 'Guided Learning Workshop',
    category: 'Education',
    desc: 'A volunteer sitting with a young girl to assist her in writing and completing school worksheets.',
    icon: BookOpen
  },
  {
    id: 35,
    url: '/gallery35.png',
    title: 'Origami and Craft Class',
    category: 'Education',
    desc: 'Children learning creative paper crafting and origami skills from volunteers in our activity sessions.',
    icon: BookOpen
  },
  {
    id: 36,
    url: '/gallery36.png',
    title: 'Creative Art Exhibition',
    category: 'Education',
    desc: 'Children proudly showcasing their colourful drawings and paintings under the shade of a tree.',
    icon: BookOpen
  },
  {
    id: 37,
    url: '/gallery37.png',
    title: 'Joyful Group Selfie',
    category: 'Outreach',
    desc: 'Volunteers and children sharing high-spirited smiles and peace signs together after a program.',
    icon: Sparkles
  },
  {
    id: 38,
    url: '/gallery38.png',
    title: 'Healthy Snack Distribution',
    category: 'Outreach',
    desc: 'Providing fresh, healthy watermelon slices to children as part of our nutrition support program.',
    icon: Award
  },
  {
    id: 39,
    url: '/gallery39.png',
    title: 'Weekend Engagement Drive',
    category: 'Outreach',
    desc: 'A large gathering of NayePankh volunteers and community kids posing after a day of sports and activities.',
    icon: Sparkles
  },
  {
    id: 40,
    url: 'https://www.instagram.com/reel/CoZvUASAjti/embed/',
    type: 'video',
    title: 'Volunteer Distribution Drive',
    category: 'Outreach',
    desc: 'Watch our teams spread warmth and support during our weekend outreach campaign.',
    icon: Sparkles
  },
  {
    id: 41,
    url: 'https://www.instagram.com/reel/Cm1wWNmokVw/embed/',
    type: 'video',
    title: 'Project Swasthya Health Camp',
    category: 'Healthcare',
    desc: 'Volunteers and medical staff providing clinical checks and medical aid to local communities.',
    icon: HeartPulse
  },
  {
    id: 42,
    url: 'https://www.instagram.com/reel/CloSwK_LuWh/embed/',
    type: 'video',
    title: 'Project Shiksha Smart Learning',
    category: 'Education',
    desc: 'Empowering children in digital smart classes and distributing study supplies.',
    icon: BookOpen
  },
  {
    id: 43,
    url: 'https://www.instagram.com/reel/ClTvrjCtIpx/embed/',
    type: 'video',
    title: 'Empowering Women Livelihoods',
    category: 'Livelihood',
    desc: 'Highlights from our vocational training camp helping local women learn tailoring.',
    icon: Sparkles
  },
  {
    id: 44,
    url: 'https://www.instagram.com/reel/Ckn-GdPMoqH/embed/',
    type: 'video',
    title: 'Outreach & Distribution Drive',
    category: 'Outreach',
    desc: 'Spreading smiles and providing basic necessities to those in need during our community outreach drives.',
    icon: Award
  },
  {
    id: 45,
    url: 'https://www.instagram.com/reel/Ci-V6LBpnUw/embed/',
    type: 'video',
    title: 'Project Shiksha Classroom Drive',
    category: 'Education',
    desc: 'Supporting child education and distributing educational supplies to inspire young minds.',
    icon: BookOpen
  },
  {
    id: 46,
    url: 'https://www.instagram.com/reel/Ceq8vXCp0b-/embed/',
    type: 'video',
    title: 'Food Distribution Initiative',
    category: 'Outreach',
    desc: 'Distributing warm, nutritious meals to underprivileged children and families.',
    icon: Award
  },
  {
    id: 47,
    url: 'https://www.instagram.com/reel/CeypLrwJuMj/embed/',
    type: 'video',
    title: 'Empowering Girls through Skill Development',
    category: 'Livelihood',
    desc: 'Enabling sustainable livelihoods for young girls and women through vocational training classes.',
    icon: Sparkles
  }
];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const { lang, isDarkMode } = useLanguageTheme();
  const t = translationDict[lang];

  // Filter gallery items by selected category
  const filteredItems = selectedCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  // Separate photos and videos
  const filteredPhotos = filteredItems.filter(item => item.type !== 'video');
  const filteredVideos = filteredItems.filter(item => item.type === 'video');

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredPhotos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Banner */}
      <section 
        className="relative py-70 md:py-82 overflow-hidden bg-cover bg-[center_35%] bg-no-repeat border-b border-slate-200 dark:border-slate-800 pt-36 md:pt-44"
        style={{ backgroundImage: "url('/gallery-bg.jpg')" }}
      >
        {/* Semi-transparent light overlay for image visibility and text readability */}
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
              {t.mediaBadge}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display text-[#132a13] dark:text-[#a3b899] drop-shadow-sm">
            {t.ourGallery}
          </h1>
          <p className="text-slate-800 dark:text-slate-200 text-sm max-w-2xl mx-auto leading-relaxed font-bold">
            {t.bannerDesc}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  closeLightbox();
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-slate-355 dark:hover:border-slate-600'
                }`}
              >
                {t[cat] || cat}
              </button>
            ))}
          </div>

          {/* Split Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Photos Grid */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span>{t.capturedMoments}</span>
                <span className="text-xs bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/30 px-2.5 py-0.5 rounded-md font-extrabold">
                  {filteredPhotos.length}
                </span>
              </h2>

              {filteredPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredPhotos.map((item, index) => {
                    return (
                      <div
                        key={item.id}
                        onClick={() => openLightbox(index)}
                        className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200/80 dark:border-slate-700 hover:border-transparent transition-all duration-500 group cursor-pointer"
                      >
                        {/* Image Box */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="p-3 bg-white/95 text-primary-600 rounded-2xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              <Maximize2 className="h-6 w-6" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-150 dark:border-slate-700 p-8">
                  <Layers className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-display">{t.noPhotos}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t.selectAnotherCat}</p>
                </div>
              )}
            </div>

            {/* Right Column: Reels / Videos */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span>{t.reelsHighlights}</span>
                <span className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-0.5 rounded-md font-extrabold">
                  {filteredVideos.length}
                </span>
              </h2>

              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredVideos.map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-200/80 dark:border-slate-700 transition-all duration-305 p-4 flex flex-col items-center justify-center"
                      >
                        {/* Live Video Embed Container */}
                        <div className="relative aspect-[9/16] w-full max-w-[280px] rounded-2xl overflow-hidden bg-black border border-slate-150 dark:border-slate-700 shadow-md">
                          <iframe
                            src={item.url}
                            className="w-full h-full border-0"
                            scrolling="no"
                            allowtransparency="true"
                            title={item.title}
                          ></iframe>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-150 dark:border-slate-700 p-8">
                  <Layers className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 font-display">{t.noVideos}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t.selectAnotherCat}</p>
                </div>
              )}

              {/* View All Reels CTA Button */}
              <a
                href="https://www.instagram.com/nayepankhfoundation/reels/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-bold text-sm text-center flex items-center justify-center space-x-2 transition-all duration-305 shadow-sm cursor-pointer mt-6"
              >
                <span>{t.viewReelsBtn}</span>
                <svg className="h-4.5 w-4.5 text-slate-400 group-hover:text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none transition-opacity duration-300"
          onClick={closeLightbox}
        >
          {/* Lightbox Header / Close button */}
          <div className="flex justify-between items-center w-full max-w-7xl mx-auto z-10">
            <span className="text-white/75 text-xs font-bold uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-lg">
              {t[filteredPhotos[lightboxIndex].category] || filteredPhotos[lightboxIndex].category} ({lightboxIndex + 1} / {filteredPhotos.length})
            </span>
            <button
              onClick={closeLightbox}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label={t.closeBtn}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Lightbox Main Content (Image & Controls) */}
          <div className="flex-grow flex items-center justify-center relative w-full max-w-5xl mx-auto">
            {/* Left Nav Button */}
            <button
              onClick={prevImage}
              className="absolute left-0 sm:left-4 z-20 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border border-white/5"
              aria-label={t.prevBtn}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Main Image */}
            <div className="max-h-[70vh] max-w-full flex items-center justify-center p-2 rounded-2xl overflow-hidden bg-slate-900/40 border border-white/10">
              <img
                src={filteredPhotos[lightboxIndex].url}
                alt={lang === 'en' ? filteredPhotos[lightboxIndex].title : (filteredPhotos[lightboxIndex].hiTitle || filteredPhotos[lightboxIndex].title)}
                className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-2xl animate-fade-in"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
              />
            </div>

            {/* Right Nav Button */}
            <button
              onClick={nextImage}
              className="absolute right-0 sm:right-4 z-20 h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer border border-white/5"
              aria-label={t.nextBtn}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Lightbox Footer (Image description) */}
          <div className="w-full max-w-3xl mx-auto text-center space-y-2 z-10 pb-4">
            <h3 className="text-white font-bold text-lg sm:text-xl font-display">
              {filteredPhotos[lightboxIndex].title}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              {lang === 'en' ? filteredPhotos[lightboxIndex].desc : (filteredPhotos[lightboxIndex].hiDesc || filteredPhotos[lightboxIndex].desc)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
