import React, { useState } from "react";
import { 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  ShieldAlert, 
  Download, 
  Sparkles, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle,
  BookOpen,
  Users,
  Layers,
  Cpu,
  Mail,
  Phone,
  MapPin,
  Send,
  Star,
  Award,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Sun,
  Moon,
  LogIn,
  UserPlus,
  LogOut,
  X,
  Globe
} from "lucide-react";
import DocumentMockup from "./components/DocumentMockup";
import AcademicGenerator from "./components/AcademicGenerator";
import AcademicWorkspace from "./components/AcademicWorkspace";
import { translations } from "./translations";
import { motion } from "motion/react";

// Path matching the generated asset
const girlBooksImg = "/src/assets/images/girl_books_1780503544934.png";

export default function App() {
  const [lang, setLang] = useState<"fr" | "en" | "ar">("fr");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);
  
  // Section 2: Audience type highlights
  const [selectedAudience, setSelectedAudience] = useState<"pfe" | "pfa" | "memoir" | "spec">("memoir");

  // Section 3: Active detailed expanded service category (defaults to memoir as requested)
  const [expandedService, setExpandedService] = useState<"memoir" | "pfe" | "pfa" | "spec" | null>("memoir");

  // User auth states
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; university?: string } | null>(null);

  // Auth form states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authInstitution, setAuthInstitution] = useState("");
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);

  // Section 6: Contact state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    university: "",
    projectType: "pfe",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const t = translations[lang];
  const isLight = theme === "light";
  const isRtl = lang === "ar";
  
  // Dynamic CSS directional setup
  const textAlignment = isRtl ? "text-right" : "text-left";
  const directionClass = isRtl ? "rtl" : "ltr";

  // Pain points for the (Why Choosing Us) Section 5
  const painPoints = [
    {
      question: lang === "ar" 
        ? "هل تواجه مشقة بالغة في التحكم في متطلبات AFNOR وقواعد الصياغة المعقدة؟"
        : lang === "en"
          ? "Are you struggling to master rigid AFNOR typographic standardizations?"
          : "Vous galérez à maîtriser les normes AFNOR et toutes leurs technicités ?",
      solution: lang === "ar"
        ? "سكريفيا (Scrivya) تقوم بأتمتة كامل الشروط الأكاديمية وصياغة قائمة مراجع مطابقة تماماً للمواصفات من أول وهلة."
        : lang === "en"
          ? "Scrivya automates all of this directly, structuring footnotes and references to meet standards with zero effort."
          : "Scrivya automatise l'intégralité du formatage et de l'encadrement des citations pour une conformité à 100% sans aucun effort."
    },
    {
      question: lang === "ar"
        ? "هل تقضي وقتاً طويلاً لحماية أطروحتك من تهم التشابه الفكري والانتحال غير المبرر؟"
        : lang === "en"
          ? "Are you spending too much time rephrasing slides or worrying about plagiarism?"
          : "Le plagiat accidentel vous empêche-t-il de dormir sereinement ?",
      solution: lang === "ar"
        ? "تساعدك أدوات التعديل وإعادة الصياغة على تقديم فقرات فنية رصينة ومبتكرة خالية من أي شبهات."
        : lang === "en"
          ? "Our semantic engine rephrases clumsy fragments, safeguarding your manuscript against duplicate text issues."
          : "Le moteur Scrivya intègre des fonctions avancées de reformulation sémantique qui vous protègent contre les répétitions maladroites."
    },
    {
      question: lang === "ar"
        ? "هل يستغرق ترتيب الهوامش الدورية (Ibid., Op. Cit.) وتصنيفها ساعات طويلة من التركيز؟"
        : lang === "en"
          ? "Is structuring sequential footnotes (Ibid, op. cit.) draining your focus?"
          : "La gestion répétitive des notes chronologiques de bas de page vous agace-t-elle ?",
      solution: lang === "ar"
        ? "تم تطوير معالج ذكي للربط المتسلسل التلقائي يبحث عما جرى اقتباسه ويعيد كتابتها باقتدار تام."
        : lang === "en"
          ? "Scrivya manages sequential footnote citations dynamically, saving you hours of tedious manual cross-referencing."
          : "Notre micro-compilateur repère les citations consécutives et applique les balises adéquates en temps réel de façon infaillible."
    },
    {
      question: lang === "ar"
        ? "هل تشعر بالحيرة من مطابقة الهياكل المعتمدة في كليتكم أو معهدكم في تونس؟"
        : lang === "en"
          ? "Are university templates confusing and hard to adapt smoothly?"
          : "Les consignes de mise en page de votre université sont-elles confuses ?",
      solution: lang === "ar"
        ? "نوفر قوالب تم قياسها بعناية لتغطي إرشادات وأدلة ENIT, INSAT, IHEC, SUP'COM وباقي المؤسسات التونسية والدولية."
        : lang === "en"
          ? "We have integrated pre-certified templates custom tailored to major Tunisian and international university guidelines."
          : "Nous intégrons les spécificités de présentation des écoles tunisiennes de référence pour un rendu immédiatement validable."
    }
  ];

  // Expanded services structure translated or mapped based on selections
  const serviceDetails = {
    memoir: {
      badge: lang === "ar" ? "أطروحة الماجستير والاستشارات الدولية" : lang === "en" ? "Standard Master's & Thesis Guidelines" : "Normes Universitaires Master / Doctorat",
      title: lang === "ar" ? "التحكم الشامل في شروط الماجستير والكتابة الأكاديمية" : lang === "en" ? "Ultimate Framework for Master's Dissertations" : "Traitement Universitaire Haute Performance",
      desc: lang === "ar" 
        ? "تعتمد الأطروحات والبحوث النظرية في العلوم الإدارية، القانونية، والاجتماعية على رصانة الهوامش السفلية وترتيب المراجع بحسب الترتيب الهجائي مع الحفاظ التام على هوية الباحثين."
        : lang === "en"
          ? "Master's theses require strict referencing formats and organized structures. Scrivya helps you build beautiful chapter breakdowns and error-free bibliographies instantly."
          : "Les mémoires théoriques ou cliniques exigent une conformité sans failles. Scrivya prend en charge l'ensemble des règles AFNOR NF Z 44-005 et des contraintes d'indexation universitaires.",
      items: [
        { 
          title: lang === "ar" ? "الهوامش السفلية المرجعية التلقائية" : lang === "en" ? "Dynamic Footnote Management" : "Notes de Bas de Page Intelligentes", 
          desc: lang === "ar" ? "إدراج تلقائي دقيق بلمح البصر للهوامش وعلامات الترقيم المرجعية." : lang === "en" ? "Accurate generation of sequential citations matching official layout specifications." : "Insertion adaptative immédiate des références sans risque d'erreur manuelle." 
        },
        { 
          title: lang === "ar" ? "فهرس المصادر والمراجع الأبجدي" : lang === "en" ? "AFNOR Alphabetical Bibliography" : "Générateur de Bibliographie", 
          desc: lang === "ar" ? "تصنيف فوري لجميع مصادر البحث وفق الأحرف الهجائية مع تضخيم العوائل." : lang === "en" ? "Instant automated alphabetical listing featuring standardized publisher structures." : "Tri et normalisation automatiques des ouvrages selon les consignes strictes." 
        },
        { 
          title: lang === "ar" ? "صوت مخصص ولغة أكاديمية راقية" : lang === "en" ? "Tone & Academic Coherence" : "Ajustement Critique du Ton", 
          desc: lang === "ar" ? "صياغة الفقرات المعقدة بلغة بليغة خالية من التكرار والعبارات الفضفاضة." : lang === "en" ? "Rephrase sentences using formal academic grammar patterns." : "Reformulez les expressions informelles en phrases hautement scientifiques." 
        }
      ]
    },
    pfe: {
      badge: lang === "ar" ? "مشروعات التخرج والمدارس الهندسية" : lang === "en" ? "Graduation Project Professional standard" : "Normes de Projets d'Ingénieurs & Managers",
      title: lang === "ar" ? "التأطير والتمثيل الفني لتقارير مشروعات التخرج PFE" : lang === "en" ? "PFE Professional Technical Layout Blueprint" : "Formatages Techniques Spécifiques PFE",
      desc: lang === "ar"
        ? "تتطلب التقارير الهندسية والتقنية عروضاً تفصيلية لهندسة البرمجيات، النماذج البيانية، الجداول الإحصائية، وكشافات الصور والرموز بأسلوب علمي منظم للغاية."
        : lang === "en"
          ? "Highly technical research papers require structured representations, systematic frameworks, detailed capture summaries, and ISO citation standards."
          : "Les rapports d'implémentation et d'ingénierie se caractérisent par des structures denses avec listes de figures, diagrammes UML et cadres méthodologiques rigoureux.",
      items: [
        { 
          title: lang === "ar" ? "فهرسة الأكواد والتطبيقات البرمجية" : lang === "en" ? "Code block & Spec formatting" : "Formatage de Captures & Extraits", 
          desc: lang === "ar" ? "تأطير وعرض الجداول والأكواد البرمجية وصور الشاشات بشكل مريح للعين." : lang === "en" ? "Add beautiful subtitles and organized code block wrappers inside your document." : "Encadrement et légendes normalisés pour tous vos livrables logiciels." 
        },
        { 
          title: lang === "ar" ? "تنظيم مراجع المعايير الدولية والعملية" : lang === "en" ? "Technical Certifications citing" : "Indexation des Normes ISO & RFC", 
          desc: lang === "ar" ? "مطابقة وتوثيق الشهادات العالمية وبراءات الاختراع والبروتوكولات الفنية." : lang === "en" ? "Quick templates to cite official technical codes and standard specifications." : "Formatage simplifié pour l'invocation de standards industriels." 
        },
        { 
          title: lang === "ar" ? "جدولة المحتويات وتخطيط النظريات" : lang === "en" ? "Architecture Map layout" : "Architecture UML, Scrum & Agile", 
          desc: lang === "ar" ? "صياغة منهجية واضحة ومسلسلة تعكس رقي العمل وقدرتكم على حل المعضلات." : lang === "en" ? "Elegant transition schemas translating methodology into solid written content." : "Explicitez clairement vos scénarios d'utilisation de façon normalisée." 
        }
      ]
    },
    pfa: {
      badge: lang === "ar" ? "مشروع نهاية السنة للسنوات الأولى" : lang === "en" ? "Introductory Undergraduate Project" : "Formatage de Rapports d'Étape",
      title: lang === "ar" ? "تنظيم وتنسيق فصول تقارير نهاية العام الدراسي PFA" : lang === "en" ? "Quick Structural Blueprint for Annual Reports" : "Squelettes Structurés de Mi-Parcours",
      desc: lang === "ar"
        ? "تهيئة فنية سريعة وتلقائية تعطي تقريرك الصغير مظهراً جامعياً احترافياً يوفر الساعات الطويلة من التنسيق اليدوي المرهق."
        : lang === "en"
          ? "Accelerated layouts custom made for early undergraduate students. Build clear and functional introductions, core concepts, and indexes immediately."
          : "Gagnez un temps précieux sur vos travaux de première ou deuxième année de Licence. Obtenez un document structuré et propre pour vos encadrants.",
      items: [
        { 
          title: lang === "ar" ? "البدء الفوري وبناء خطط الأطروحة" : lang === "en" ? "Rapid Outline Generation" : "Squelettes Structurés", 
          desc: lang === "ar" ? "توليد فوري ومقترح للمقدمات وأسئلة الفحص لموضوعكم البحثي." : lang === "en" ? "Instant conceptual structures customized to your core course material." : "Plans équilibrés pour organiser vos premières recherches thématiques." 
        },
        { 
          title: lang === "ar" ? "صياغة المراجع المبدئية" : lang === "en" ? "Simple Source Referencing" : "Indexation Initiale", 
          desc: lang === "ar" ? "تنظيم أولي رائع لروابط الويب والمقالات الصحفية المقترحة للدراسة." : lang === "en" ? "Simple, clean citation layouts for internet findings and online documents." : "Formatage impeccable de vos trouvailles internet et articles scientifiques." 
        }
      ]
    },
    spec: {
      badge: lang === "ar" ? "الدكتوراه والأطروحات الطبية الدقيقة" : lang === "en" ? "Advanced Research & Clinical Papers" : "Recherches Doctorales & Spécialités",
      title: lang === "ar" ? "دعم صياغة المعادلات والدراسات الإحصائية الموسعة" : lang === "en" ? "Premium Architecture for Complex Manuscripts" : "Outils Pointus pour Thèses complexes",
      desc: lang === "ar"
        ? "أطروحات الدكتوراه الطبية السريرية أو القانونية العريضة تقتضي استشهادات عالمية دقيقة (APA, Vancouver) وكشافات اختصارات تفصيلية واسعة."
        : lang === "en"
          ? "Clinical medical theses require extensive abbreviation listings, international indexing schemas, and strict bibliographic parameters (Vancouver, APA)."
          : "Les publications de recherche exigent une excellence à tous les niveaux. Scrivya fournit des fonctionnalités avancées pour gérer les listes de sigles colossales.",
      items: [
        { 
          title: lang === "ar" ? "جدولة وفهرسة الرموز العلمية" : lang === "en" ? "Acro & Abbreviation Glossary" : "Glossaires & Liste d'Abréviations", 
          desc: lang === "ar" ? "ترتيب تلقائي دقيق للمصطلحات اللاتينية والطبية والرموز الرياضية." : lang === "en" ? "Organized abbreviations and custom symbols matching high impact journals." : "Génération de tables d'abréviations ordonnées de façon automatique." 
        },
        { 
          title: lang === "ar" ? "التوافق مع النظم العالمية الكبرى" : lang === "en" ? "Multiple Styles Switch (APA, IEEE)" : "Multi-Styles (APA, Vancouver)", 
          desc: lang === "ar" ? "التحويل السريع والآمن بين القواعد الاستشهادية المتعددة بحسب الجهة الناشرة." : lang === "en" ? "Smoothly toggle your manuscript configuration between clinical and technical layouts." : "Basculez votre document sous le formalisme le plus adapté en un clic." 
        }
      ]
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({
        name: "",
        email: "",
        university: "",
        projectType: "pfe",
        subject: "",
        message: ""
      });
    }, 5000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;

    if (authModal === "login") {
      const nameFromEmail = authEmail.split("@")[0];
      const capitalized = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      setCurrentUser({
        name: capitalized || "Étudiant",
        email: authEmail,
        university: "Université de Tunis"
      });
      setAuthSuccessMessage(lang === "ar" ? "تم تسجيل الدخول الآمن بنجاح!" : lang === "en" ? "Safely logged in!" : "Connexion réussie avec succès !");
    } else {
      setCurrentUser({
        name: authName || "Nouvel Étudiant",
        email: authEmail,
        university: authInstitution || "Scrivya TN"
      });
      setAuthSuccessMessage(lang === "ar" ? "تم إنشاء حسابك الأكاديمي وتفعيله فوراً!" : lang === "en" ? "Account created and activated!" : "Compte créé et activé avec succès !");
    }

    setTimeout(() => {
      setAuthSuccessMessage(null);
      setAuthModal(null);
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");
      setAuthInstitution("");
    }, 1500);
  };

  if (currentUser) {
    return (
      <AcademicWorkspace 
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        lang={lang}
        theme={theme}
        setTheme={setTheme}
      />
    );
  }

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-300 ${isLight ? "theme-light text-slate-900" : "text-slate-100"}`}>
      
      {/* Mesh Animated Blur Background */}
      <div className="fixed inset-0 mesh-bg -z-10 pointer-events-none transition-all duration-300 overflow-hidden">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
      </div>

      {/* ======================================================================
          HEADER & NAVIGATION BAR WITH THEME, LANG & AUTHENTICATION TOGGLES
          ====================================================================== */}
      <nav 
        dir={directionClass}
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          isLight ? "bg-white/80 border-slate-200/80" : "bg-slate-950/80 border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-1 group/logo cursor-pointer select-none">
            <span className={`font-display font-black text-2xl tracking-tight leading-none uppercase ${isLight ? 'text-blue-600' : 'text-white'}`}>
              Scrivya
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className={`hidden lg:flex items-center gap-3.5 xl:gap-6 text-[11px] xl:text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            <a href="#hero" className="hover:text-blue-500 transition-colors uppercase tracking-wide whitespace-nowrap">{t.navAbout}</a>
            <a href="#audiences" className="hover:text-blue-500 transition-colors uppercase tracking-wide whitespace-nowrap">{t.navWho}</a>
            <a href="#services" className="hover:text-blue-500 transition-colors uppercase tracking-wide whitespace-nowrap">{t.navServices}</a>
            <a href="#tarifs" className="hover:text-blue-500 transition-colors uppercase tracking-wide whitespace-nowrap">{t.navTarifs}</a>
            <a href="#why-us" className="hover:text-blue-500 transition-colors uppercase tracking-wide whitespace-nowrap">{t.navWhyUs}</a>
            <a href="#contact" className="hover:text-blue-500 transition-colors uppercase tracking-wide whitespace-nowrap">{t.navContact}</a>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Lang Swapper buttons */}
            <div className={`flex p-0.5 rounded-xl border text-[10px] uppercase font-bold tracking-wide ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/60 border-white/10'}`}>
              <button 
                onClick={() => setLang("fr")} 
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${lang === "fr" ? "bg-blue-600 text-white shadow" : `${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}`}
              >
                FR
              </button>
              <button 
                onClick={() => setLang("en")} 
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${lang === "en" ? "bg-blue-600 text-white shadow" : `${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang("ar")} 
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${lang === "ar" ? "bg-blue-600 text-white shadow" : `${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}`}
              >
                عربي
              </button>
            </div>

            {/* Theme Swapper Toggle Button */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isLight 
                  ? 'bg-slate-100 border-slate-250 hover:bg-slate-200 text-slate-800' 
                  : 'bg-slate-900/65 border-white/10 hover:bg-slate-800 text-amber-400'
              }`}
              aria-label="Toggle theme"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Simulated Authenticated Area */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold select-none flex items-center gap-2 ${
                  isLight ? 'bg-blue-550 border-blue-200 text-blue-800 shadow-sm' : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                }`}>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="hidden sm:inline">{t.navWelcome},</span> {currentUser.name}
                </div>
                <button 
                  onClick={() => setCurrentUser(null)}
                  className={`p-2 rounded-xl border hover:text-rose-500 transition-all cursor-pointer ${
                    isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-900 border-white/10 text-slate-400'
                  }`}
                  title={t.navLogout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => {
                    setCurrentUser({
                      name: "Chercheur Académique",
                      email: "academic@scrivya.tn",
                      university: "Université de Tunis"
                    });
                  }} 
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isLight 
                      ? 'border-slate-300 hover:bg-slate-150 text-slate-800' 
                      : 'border-white/10 hover:bg-white/5 text-slate-200'
                  }`}
                >
                  {t.navLogin}
                </button>
                <button 
                  onClick={() => {
                    setCurrentUser({
                      name: "Chercheur Académique",
                      email: "academic@scrivya.tn",
                      university: "Université de Tunis"
                    });
                  }} 
                  className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer"
                >
                  {t.navSignup}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ======================================================================
          🌟 1ère SECTION : HERO (Slogan + Photo d'une fille tenant des livres à droite)
          ====================================================================== */}
      <section 
        dir={directionClass} 
        id="hero" 
        className="relative py-6 md:py-10 lg:py-12 px-6 overflow-hidden max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:items-center">
          
          {/* Left panel: text and primary buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`lg:col-span-7 space-y-4 md:space-y-5 ${textAlignment}`}
          >
            
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-display font-medium leading-[1.15] tracking-tight ${isLight ? 'text-slate-955' : 'text-white'}`}>
              {t.heroTitle}
            </h1>
            
            <p className={`${isLight ? 'text-slate-655' : 'text-slate-300'} text-base md:text-lg leading-relaxed space-y-4 max-w-2xl`}>
              <span className="block font-medium">{t.heroText1}</span>
              <span className="block text-sm text-slate-400">{t.heroText2}</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <a 
                href="#generator-tool" 
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-550/25 transition-all hover:scale-102 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                {t.heroCtaGenerate}
              </a>
              <a 
                href="#audiences" 
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl border text-sm font-semibold transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2 ${
                  isLight 
                    ? 'border-slate-300 hover:bg-slate-100 text-slate-800' 
                    : 'border-white/10 hover:bg-white/10 text-slate-205'
                }`}
              >
                {t.heroCtaWho}
              </a >
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-6 border-t border-white/5 font-mono text-left">
              <div className="flex flex-col justify-start">
                <span className={`block text-xl sm:text-2xl md:text-3xl font-bold ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>{t.heroStudents}</span>
                <span className="block text-[10px] text-slate-455 uppercase tracking-wider font-semibold mt-1 leading-tight">{t.heroStudentsSub}</span>
              </div>
              <div className="flex flex-col justify-start border-l border-white/10 pl-2 sm:pl-4">
                <span className={`block text-xl sm:text-2xl md:text-3xl font-bold ${isLight ? 'text-emerald-600' : 'text-emerald-450'}`}>{t.heroConformity}</span>
                <span className="block text-[10px] text-slate-455 uppercase tracking-wider font-semibold mt-1 leading-tight">{t.heroConformitySub}</span>
              </div>
              <div className="flex flex-col justify-start border-l border-white/10 pl-2 sm:pl-4">
                <span className={`block text-xl sm:text-2xl md:text-3xl font-bold ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>{t.heroEfficiency}</span>
                <span className="block text-[10px] text-slate-455 uppercase tracking-wider font-semibold mt-1 leading-tight">{t.heroEfficiencySub}</span>
              </div>
              <div className="flex flex-col justify-start border-l border-white/10 pl-2 sm:pl-4">
                <span className={`block text-xl sm:text-2xl md:text-3xl font-bold ${isLight ? 'text-indigo-600' : 'text-indigo-400'}`}>{t.heroPlagiat}</span>
                <span className="block text-[10px] text-slate-455 uppercase tracking-wider font-semibold mt-1 leading-tight">{t.heroPlagiatSub}</span>
              </div>
            </div>
          </motion.div>

          {/* Right panel: Modern girlBooks illustration wrapped cleanly */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className={`lg:col-span-5 relative flex justify-center ${isRtl ? 'lg:justify-start' : 'lg:justify-end'} lg:pt-2`}
          >
            <div className="relative w-full max-w-xs sm:max-w-sm aspect-square rounded-[32px] overflow-hidden group shadow-2xl border border-white/10 bg-slate-900/40 p-3">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent mix-blend-color-override -z-10"></div>
              <img 
                src={girlBooksImg} 
                alt="Student compiling premium academic projects with Scrivya" 
                className="w-full h-full object-cover rounded-[32px] transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating review card */}
              <div dir="ltr" className={`absolute bottom-8 left-6 right-6 p-5 rounded-2xl border text-left backdrop-blur-md shadow-xl transition-all duration-300 ${
                isLight ? 'bg-white/95 border-slate-200' : 'bg-slate-950/85 border-white/10'
              }`}>
                <p className={`text-xs italic leading-relaxed font-sans ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  "{t.heroQuote}"
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-500 uppercase font-mono">{t.heroAuthor}</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ======================================================================
          👥 2ème SECTION : NOTRE PUBLIC CIBLE (Pour qui est-ce fait)
          ====================================================================== */}
      <section 
        dir={directionClass} 
        id="audiences" 
        className={`py-16 md:py-24 px-6 border-y border-white/5 transition-colors duration-300 ${isLight ? 'bg-white' : 'bg-slate-950/40'}`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left sticky introduction */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-6 ${textAlignment}`}
          >
            {t.audienceTagline && (
              <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest block">
                {t.audienceTagline}
              </span>
            )}
            <h2 className={`text-3xl md:text-4xl font-display font-semibold tracking-tight ${isLight ? 'text-slate-955' : 'text-white'}`}>
              {t.audienceTitle}
            </h2>
            <div className="space-y-4">
              <p className={`${isLight ? 'text-slate-655' : 'text-slate-350'} text-xs md:text-sm leading-relaxed font-normal`}>
                {t.audienceIntro1}
              </p>
              <div className={`p-5 rounded-2xl border text-xs md:text-sm leading-relaxed font-medium ${
                isLight ? 'bg-slate-900 border-transparent text-white' : 'bg-slate-900 border-white/5 text-slate-100'
              }`}>
                {t.audienceIntro2}
              </div>
            </div>

            {/* Quick action checklist */}
            <div className="space-y-2 pt-4">
              <span className={`text-[10px] uppercase font-mono font-bold tracking-widest block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.tarifFeatures}</span>
              <div className="space-y-2 text-xs">
                {ptFeatureList(lang).map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-slate-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right focused panel - single block featuring "Mémoires, thèses..." with the custom title */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="lg:col-span-8 flex flex-col justify-start space-y-6"
          >
            
            {t.audienceSectionTitle && (
              <h3 className={`text-xs font-mono uppercase tracking-widest font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {t.audienceSectionTitle}
              </h3>
            )}

            {/* Memoir Card */}
            <button 
              onClick={() => { 
                setSelectedAudience("memoir"); 
                setExpandedService("memoir"); 
                const servicesSection = document.getElementById("services");
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`p-8 rounded-3xl border text-left transition-all duration-350 space-y-6 cursor-pointer hover:scale-[1.01] hover:shadow-md ${
                selectedAudience === "memoir" 
                  ? "border-blue-500 bg-blue-500/5 shadow-lg" 
                  : `${isLight ? 'bg-slate-50 border-slate-205 md:hover:border-slate-350' : 'bg-white/5 border-white/10 md:hover:border-white/20'}`
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-display font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-purple-500/20 text-purple-600 uppercase">
                  {t.audienceMemoirBadge}
                </span>
              </div>
              <div className="space-y-3">
                <h3 className={`text-xl md:text-2xl font-bold font-display leading-tight ${isLight ? 'text-slate-905' : 'text-white'}`}>{t.audienceMemoir}</h3>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-650' : 'text-slate-350'}`}>
                  {t.audienceMemoirDesc}
                </p>
              </div>
              <span className="text-xs text-blue-505 font-semibold inline-flex items-center gap-1.5 hover:underline">
                {t.audienceMore} <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </span>
            </button>

          </motion.div>

        </div>

        {/* Selected audience granular focus panel (Shows details based on selected state) */}
        {selectedAudience === "memoir" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-7xl mx-auto mt-12"
          >
            <div className={`p-6 md:p-10 rounded-3xl border text-left flex flex-col md:flex-row gap-8 items-center relative transition-all duration-350 ${
              isLight ? 'bg-slate-50 border-slate-200 shadow' : 'bg-slate-950/40 border-white/10'
            }`}>
              
              <div className="flex-1 space-y-4">
                <span className="text-[10px] font-mono tracking-wider font-bold bg-blue-500/15 text-blue-500 border border-blue-500/20 px-2.5 py-1 rounded-[6px]">
                  {t.audDetailMemoirTag}
                </span>
                <h3 className={`text-xl md:text-2xl font-bold font-display ${isLight ? 'text-slate-955' : 'text-white'}`}>
                  {t.audDetailMemoirTitle}
                </h3>
                <p className={`text-xs md:text-sm leading-relaxed ${isLight ? 'text-slate-650' : 'text-slate-300'}`}>
                  {t.audDetailMemoirDesc}
                </p>

                <div className="space-y-2.5 pt-2 text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                     <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{t.audDetailMemoirCheck1}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                     <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{t.audDetailMemoirCheck2}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                     <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{t.audDetailMemoirCheck3}</span>
                  </div>
                </div>
              </div>

              {/* Sample output mockup */}
              <div className="w-full md:w-80 shrink-0">
                <div className={`p-4 rounded-2xl border text-xs font-mono text-left space-y-3 ${
                  isLight ? 'bg-white border-slate-250 shadow-sm' : 'bg-slate-950/70 border-white/10'
                }`}>
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-[10px] uppercase font-bold text-blue-500">
                      {t.audDetailMemoirModelTitle}
                    </span>
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping"></span>
                  </div>
                  <div className={`p-2 rounded bg-white/5 space-y-1.5 ${isLight ? 'text-slate-800 font-bold' : 'text-slate-200'}`}>
                    <div className="text-[10px] text-blue-500 font-sans font-bold">Capitre I</div>
                    <div>{t.audDetailMemoirPart1}</div>
                  </div>
                  <div className={`p-2 rounded bg-white/5 space-y-1.5 ${isLight ? 'text-slate-800 font-bold' : 'text-slate-200'}`}>
                    <div className="text-[10px] text-blue-500 font-sans font-bold">Capitre II</div>
                    <div>{t.audDetailMemoirPart2}</div>
                  </div>
                  <div className={`p-2 rounded bg-white/5 space-y-1.5 ${isLight ? 'text-slate-800 font-bold' : 'text-slate-200'}`}>
                    <div className="text-[10px] text-blue-500 font-sans font-bold">Capitre III</div>
                    <div>{t.audDetailMemoirPart3}</div>
                  </div>
                  <div className="text-[9px] text-slate-500 pt-1 text-center italic">
                    {t.audDetailMemoirTip}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </section>

      {/* ======================================================================
          🛠️ 3ème SECTION : NOS SERVICES ACADÉMIQUES DÉPLIÉS
          ====================================================================== */}
      <section 
        dir={directionClass} 
        id="services" 
        className="py-16 md:py-24 px-6 border-b border-white/5 relative"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest block">
              {t.servicesTagline}
            </span>
            <h2 className={`text-3xl md:text-4xl font-display font-semibold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {t.servicesTitle}
            </h2>
            <p className={`${isLight ? 'text-slate-600' : 'text-slate-350'} text-xs md:text-sm max-w-xl mx-auto`}>
              {t.servicesDesc}
            </p>
          </motion.div>

          {/* Interactive Services Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Service Block 1: Mémoire */}
            <motion.div 
              style={{ contentVisibility: 'auto' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className={`glass-panel p-6 rounded-3xl border text-left flex flex-col justify-between transition-all duration-300 ${
                expandedService === "memoir" 
                  ? "border-blue-505 bg-blue-500/5 shadow-lg" 
                  : `${isLight ? 'bg-slate-50 border-slate-205' : 'border-white/10 bg-white/5 hover:border-white/15'}`
              }`}
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-505 flex items-center justify-center font-display font-bold border border-blue-500/25 text-sm">
                  01
                </div>
                <div>
                  <h3 className={`text-lg font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.audienceMemoir}</h3>
                  <p className="text-xs text-blue-500 font-mono uppercase mt-0.5">{t.audienceMemoirBadge}</p>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-650' : 'text-slate-350'}`}>
                  {t.audienceMemoirDesc}
                </p>
              </div>
              <button
                onClick={() => setExpandedService("memoir")}
                className="mt-6 w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{t.audienceMore}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedService === "memoir" ? "rotate-180" : ""}`} />
              </button>
            </motion.div>

            {/* Service Block 2: PFE */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`glass-panel p-6 rounded-3xl border text-left flex flex-col justify-between transition-all duration-300 ${
                expandedService === "pfe" 
                  ? "border-blue-505 bg-blue-500/5 shadow-lg" 
                  : `${isLight ? 'bg-slate-50 border-slate-205' : 'border-white/10 bg-white/5 hover:border-white/15'}`
              }`}
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo-550/10 text-indigo-505 flex items-center justify-center font-display font-bold border border-indigo-500/25 text-sm">
                  02
                </div>
                <div>
                  <h3 className={`text-lg font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.audiencePfe}</h3>
                  <p className="text-xs text-indigo-400 font-mono uppercase mt-0.5">{t.audiencePfeBadge}</p>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-650' : 'text-slate-355'}`}>
                  {t.audiencePfeDesc}
                </p>
              </div>
              <button
                onClick={() => setExpandedService("pfe")}
                className="mt-6 w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{t.audienceMore}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedService === "pfe" ? "rotate-180" : ""}`} />
              </button>
            </motion.div>

            {/* Service Block 3: PFA */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className={`glass-panel p-6 rounded-3xl border text-left flex flex-col justify-between transition-all duration-300 ${
                expandedService === "pfa" 
                  ? "border-blue-505 bg-blue-500/5 shadow-lg" 
                  : `${isLight ? 'bg-slate-50 border-slate-205' : 'border-white/10 bg-white/5 hover:border-white/15'}`
              }`}
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-orange-500/10 text-orange-505 flex items-center justify-center font-display font-bold border border-orange-500/25 text-sm">
                  03
                </div>
                <div>
                  <h3 className={`text-lg font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.audiencePfa}</h3>
                  <p className="text-xs text-orange-400 font-mono uppercase mt-0.5">{t.audiencePfaBadge}</p>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-650' : 'text-slate-355'}`}>
                  {t.audiencePfaDesc}
                </p>
              </div>
              <button
                onClick={() => setExpandedService("pfa")}
                className="mt-6 w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{t.audienceMore}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedService === "pfa" ? "rotate-180" : ""}`} />
              </button>
            </motion.div>

            {/* Service Block 4: Thèse & Spécialité */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`glass-panel p-6 rounded-3xl border text-left flex flex-col justify-between transition-all duration-300 ${
                expandedService === "spec"
                  ? "border-blue-550 bg-blue-500/5 shadow-lg shadow-blue-555/5" 
                  : `${isLight ? 'bg-slate-50 border-slate-205' : 'border-white/10 bg-white/5 hover:border-white/15'}`
              }`}
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-505 flex items-center justify-center font-display font-bold border border-purple-500/25 text-sm">
                  04
                </div>
                <div>
                  <h3 className={`text-lg font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.audienceSpec}</h3>
                  <p className="text-xs text-purple-400 font-mono uppercase mt-0.5">{t.audienceSpecBadge}</p>
                </div>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-650' : 'text-slate-350'}`}>
                  {t.audienceSpecDesc}
                </p>
              </div>
              <button
                onClick={() => setExpandedService("spec")}
                className="mt-6 w-full text-center py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{t.audienceMore}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedService === "spec" ? "rotate-180" : ""}`} />
              </button>
            </motion.div>

          </div>

          {/* Dynamic Expandable Sub-Services Box */}
          {expandedService && serviceDetails[expandedService] && (
            <div className={`glass-panel p-6 md:p-10 rounded-3xl border transition-all duration-300 ${
              isLight ? 'bg-slate-50 border-slate-250' : 'border-white/10 bg-white/5'
            } animate-fadeIn text-left space-y-6 relative`}>
              <div className="absolute top-4 right-4 text-[10px] uppercase font-mono font-bold tracking-wider text-blue-500 bg-blue-500/15 border border-blue-500/25 px-2.5 py-1 rounded-[8px]">
                {serviceDetails[expandedService].badge}
              </div>
              
              <div className="space-y-2">
                <h3 className={`text-xl md:text-2xl font-bold font-display ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {serviceDetails[expandedService].title}
                </h3>
                <p className={`text-sm leading-relaxed max-w-2xl ${isLight ? 'text-slate-650' : 'text-slate-350'}`}>
                  {serviceDetails[expandedService].desc}
                </p>
              </div>

              {/* Sub-services Grid list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                {serviceDetails[expandedService].items.map((subItem: any, sIdx: number) => (
                  <div key={sIdx} className={`p-5 rounded-2xl border flex gap-4 ${
                    isLight 
                      ? 'bg-white border-slate-200 hover:border-blue-400' 
                      : 'bg-slate-950/30 border-white/10 hover:border-blue-500/30'
                  } transition-all`}>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-505 border border-blue-500/20 shrink-0 flex items-center justify-center text-xs font-mono font-bold">
                      {sIdx + 1}
                    </div>
                    <div className="space-y-1">
                      <h4 className={`font-semibold text-sm md:text-base ${isLight ? 'text-slate-950' : 'text-white'}`}>{subItem.title}</h4>
                      <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{subItem.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  onClick={() => setExpandedService(null)}
                  className={`px-5 py-2 border text-xs font-semibold rounded-xl cursor-pointer transition-colors ${
                    isLight 
                      ? 'hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950' 
                      : 'hover:bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.lblClose}
                </button>
              </div>
            </div>
          )}

          {/* Demonstration Header & Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="pt-16 border-t border-white/5 space-y-8" 
            id="generator-tool"
          >
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-[10px] font-mono uppercase bg-blue-500/15 border border-blue-500/25 text-blue-500 px-2.5 py-1 rounded-full font-bold">
                ⚙️ {lang === "ar" ? "أبواب الابتكار وسكريفيا (Scrivya)" : lang === "en" ? "Interactive Innovation Core" : "Outil d'intelligence intégrée"}
              </span>
              <h3 className={`text-2xl md:text-3xl font-display font-medium tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {lang === "ar" ? "معمل التجارب التفاعلي من سكريفيا (Scrivya)" : lang === "en" ? "Scrivya Premium Demonstration Labs" : "Le Laboratoire de Démonstration en Direct"}
              </h3>
              <p className={`${isLight ? 'text-slate-650' : 'text-slate-355'} text-xs md:text-sm`}>
                {lang === "ar" 
                  ? "اطرح موضوعاً أو اضغط على الاقتراحات بالأسفل لمشاهدة التنظيم التلقائي الفوري والتفصيلي والتوثيق للمقالات." 
                  : lang === "en"
                    ? "Enter or select a research paper keyword below to instantly simulate compliance layouts and dynamic citations."
                    : "Rédigez ou choisissez une suggestion de problématique ci-dessous pour tester immédiatement le formateur bibliographique de Scrivya."
                }
              </p>
            </div>
            
            {/* Dynamic visual parameters propagated to generator */}
            <AcademicGenerator lang={lang} theme={theme} />
          </motion.div>

        </div>
      </section>

      {/* ======================================================================
          💳 4ème SECTION : LES TARIFS DE NOTRE ACCOMPAGNEMENT EN TND (Tunisian Dinars)
          ====================================================================== */}
      <section 
        dir={directionClass} 
        id="tarifs" 
        className={`py-16 md:py-24 px-6 border-b border-white/5 transition-colors duration-300 ${isLight ? 'bg-slate-50' : 'bg-slate-950/10'}`}
      >
        <div className="max-w-7xl mx-auto space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest block">
              {t.tarifsTagline}
            </span>
            <h2 className={`text-3xl md:text-4xl font-display font-medium tracking-tight ${isLight ? 'text-slate-955' : 'text-white'}`}>
              {t.tarifsTitle}
            </h2>
            <p className={`${isLight ? 'text-slate-600' : 'text-slate-350'} text-xs md:text-sm max-w-xl mx-auto leading-relaxed`}>
              {t.tarifsDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Plan 1: Starter / PFA */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className={`glass-panel text-left p-8 rounded-[32px] border transition-all duration-300 flex flex-col justify-between group ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'border-white/10 bg-white/5 hover:border-white/15'
              }`}
            >
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className={`text-[10px] uppercase font-mono font-bold tracking-widest ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.audiencePfaBadge}</span>
                  <h3 className={`text-xl font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.tarifPfaName}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans mt-1">
                    {lang === "ar" ? "مصمم خصيصاً لمشاريع أول وثاني سنة جامعية لإثارة اهتمام الأساتذة." : lang === "en" ? "Designed for 1st and 2nd year project reports." : "Idéal pour les rapports de 1ère et 2ème année afin d'impressionner vos professeurs."}
                  </p>
                </div>
                
                <div className="flex items-baseline gap-1 py-4 border-y border-white/5">
                  <span className={`text-4xl font-extrabold font-display ${isLight ? 'text-slate-950' : 'text-white'}`}>{t.tarifPfaPrice}</span>
                  <span className="text-slate-500 text-xs">/ {lang === "ar" ? "مستند متكامل" : lang === "en" ? "fully compiled" : "document"}</span>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{lang === "ar" ? "هيكلة الفصول بصيغة نموذجية محكمة" : lang === "en" ? "Structured chapters with standard outline templates" : "Squelettes et structures de chapitres équilibrés"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{lang === "ar" ? "إدراج وتوثيق المواقع والمقالات المرجعية" : lang === "en" ? "Simple but accurate online references citing" : "Indexation soignée des sources web"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{t.tarifPfaLimit}</span>
                  </div>
                </div>
              </div>

              <a 
                href="#contact" 
                className={`mt-8 py-3.5 w-full text-center rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-800' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 hover:border-white/25'
                }`}
              >
                {t.tarifChoosePlan}
              </a>
            </motion.div>

            {/* Plan 2: Pro (PFE / Mémoire) - Popular Glowing */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className={`glass-panel text-left p-8 rounded-[32px] border-2 flex flex-col justify-between hover:scale-[1.01] transition-all relative ${
                isLight 
                  ? 'bg-white border-blue-600 shadow-lg shadow-blue-100' 
                  : 'border-blue-500 bg-gradient-to-b from-blue-950/20 to-slate-950/20'
              }`}
            >
              <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white font-bold font-mono text-[9px] tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/20">
                ⭐ {t.tarifPopular}
              </span>

              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-500">{t.audienceMemoirBadge}</span>
                  <h3 className={`text-xl font-bold font-display ${isLight ? 'text-slate-950' : 'text-white'}`}>{t.tarifPfeName}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans mt-1">
                    {lang === "ar" ? "قسط الأمانة والترابط لتقرير التخرج على معايير الكليات الوطنية والدولية." : lang === "en" ? "Compiles with rigid instructions of national scale institutes." : "Garantit la conformité totale aux exigences d'AFNOR, de l'ENIT, de l'IHEC, ou l'INSAT."}
                  </p>
                </div>
                
                <div className="flex items-baseline gap-1 py-4 border-y border-white/5">
                  <span className={`text-4xl font-extrabold font-display ${isLight ? 'text-slate-955' : 'text-white'}`}>{t.tarifPfePrice}</span>
                  <span className="text-slate-500 text-xs">/ {lang === "ar" ? "مستند متكامل" : lang === "en" ? "fully compiled" : "document"}</span>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{lang === "ar" ? "مطابقة AFNOR بنسبة 100% متناهية الدقة" : lang === "en" ? "100% compliant bibliographic compilation" : "Conformité AFNOR NF Z 44-005 stricte à 100%"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{lang === "ar" ? "إدراج ديناميكي ذكي للهوامش (Ibid)" : lang === "en" ? "Automated footnote system integration" : "Citations de bas de page automatisées (Ibid.)"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{t.tarifPfeLimit}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{lang === "ar" ? "تحسين الجودة وإعادة الصياغة اللغوية" : lang === "en" ? "Scientific rephrasing and structure logs" : "Optimisation anti-plagiat et reformulation"}</span>
                  </div>
                </div>
              </div>

              <a 
                href="#contact" 
                className="mt-8 py-3.5 w-full text-center rounded-xl bg-gradient-to-r from-blue-550 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold transition-all text-xs shadow-md shadow-blue-550/20 active:scale-95 cursor-pointer"
              >
                {t.tarifChoosePlan}
              </a>
            </motion.div>

            {/* Plan 3: Elite / Specialization & Doctorate */}
            <motion.div 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className={`glass-panel text-left p-8 rounded-[32px] border transition-all duration-300 flex flex-col justify-between group ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'border-white/10 bg-white/5 hover:border-white/15'
              }`}
            >
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className={`text-[10px] uppercase font-mono font-bold tracking-widest ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.audienceSpecBadge}</span>
                  <h3 className={`text-xl font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.tarifSpecName}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans mt-1">
                    {lang === "ar" ? "للأبحاث الطبيةClinical والأوراق الطويلة ورسائل الدكتوراه والبروفيسور." : lang === "en" ? "For clinical papers, high volume dissertations and PhD reviews." : "Pour les thèses médicales, thèses d'architecture ou doctorats volumineux."}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 py-4 border-y border-white/5">
                  <span className={`text-4xl font-extrabold font-display ${isLight ? 'text-slate-950' : 'text-white'}`}>{t.tarifSpecPrice}</span>
                  <span className="text-slate-500 text-xs">/ {lang === "ar" ? "مستند متكامل" : lang === "en" ? "fully compiled" : "document"}</span>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{lang === "ar" ? "كل ميزات الخطة السابقة بالكامل" : lang === "en" ? "Includes all professional standard tools" : "Toutes fonctionnalités Pro incluses"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{lang === "ar" ? "جدولة الاختصارات والرموز العلمية الصعبة" : lang === "en" ? "Advanced clinical equations and symbols glossary" : "Indexations, équations mathématiques complexes"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-500 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{lang === "ar" ? "إعداد عروض الشرائح وملخص المناقشة للجنة" : lang === "en" ? "Preparation of oral defense slides structured" : "Création de discours et diapositives de soutenance"}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4.5 h-4.5 text-blue-550 shrink-0 mt-0.5" />
                    <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>{t.tarifSpecLimit}</span>
                  </div>
                </div>
              </div>

              <a 
                href="#contact" 
                className={`mt-8 py-3.5 w-full text-center rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-800' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 hover:border-white/25'
                }`}
              >
                {t.tarifChoosePlan}
              </a>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ======================================================================
          🤔 5ème SECTION : POURQUOI NOUS CHOISIR (Student pain point accordion)
          ====================================================================== */}
      <section 
        dir={directionClass} 
        id="why-us" 
        className={`py-16 md:py-24 px-6 border-b border-white/5 transition-colors duration-300 ${isLight ? 'bg-white' : 'bg-slate-950/20'}`}
      >
        <div className="max-w-4xl mx-auto space-y-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest block">
              {t.whyTagline}
            </span>
            <h2 className={`text-3xl md:text-4xl font-display font-semibold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {t.whyTitle}
            </h2>
            <p className={`${isLight ? 'text-slate-600' : 'text-slate-400'} text-xs md:text-sm max-w-xl mx-auto leading-relaxed`}>
              {t.whyDesc}
            </p>
          </motion.div>

          {/* FAQ Accordion UI */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`glass-panel rounded-3xl p-6 md:p-10 border shadow-2xl space-y-4 text-left transition-colors duration-300 ${
              isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"
            }`}
          >
            {painPoints.map((pt, idx) => (
              <div 
                key={idx} 
                className={`rounded-2xl transition-all border ${
                  activeFAQ === idx 
                    ? "border-blue-500/30 bg-blue-500/5 shadow-inner" 
                    : `${isLight ? 'border-slate-200 bg-white hover:bg-slate-50' : 'border-white/5 bg-white/5 hover:bg-white/10'}`
                }`}
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className={`w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-sans font-medium cursor-pointer ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                  <span className={`text-sm md:text-base leading-tight flex gap-3 items-center font-bold ${
                    isLight ? 'text-slate-900' : 'text-slate-100'
                  } ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-blue-500/20">
                      0{idx + 1}
                    </span>
                    <span>{pt.question}</span>
                  </span>
                  {activeFAQ === idx ? (
                    <ChevronUp className="w-5 h-5 text-blue-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {activeFAQ === idx && (
                  <div className={`px-6 pb-6 pt-1 text-xs sm:text-sm pl-14 border-t leading-relaxed font-sans animate-fadeIn ${
                    isLight ? 'text-slate-700 border-slate-200' : 'text-slate-350 border-white/5'
                  }`}>
                    <p className={`mb-3 font-medium leading-relaxed ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                      {pt.solution}
                    </p>
                    <span className="flex items-center gap-1.5 text-xs font-mono font-semibold text-blue-520">
                      <Check className="w-4 h-4 text-emerald-555" /> {t.whyNativeSuccess}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ======================================================================
          ✉️ 6ème SECTION : CONTACTEZ-NOUS (Modern Frosted Form with dynamic feedback)
          ====================================================================== */}
      <section 
        dir={directionClass} 
        id="contact" 
        className="py-16 md:py-24 px-6 relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-500 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold">
              {t.contactTagline}
            </div>
            
            <h2 className={`text-3xl md:text-4xl font-display font-semibold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              {t.contactTitle}
            </h2>
            
            <p className={`${isLight ? 'text-slate-650' : 'text-slate-300'} text-xs md:text-sm leading-relaxed max-w-2xl mx-auto`}>
              {t.contactDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className={`flex flex-col items-center text-center p-6 border rounded-2xl hover:border-blue-500/40 transition-colors ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">{t.contactEmail}</span>
              <a href="mailto:contact@scrivya.tn" className="text-xs md:text-sm font-semibold text-blue-500 mt-1 hover:underline">contact@scrivya.tn</a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className={`flex flex-col items-center text-center p-6 border rounded-2xl hover:border-emerald-500/40 transition-colors ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-555 border border-emerald-500/20 flex items-center justify-center mb-3">
                <Phone className="w-6 h-6" />
              </div>
              <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">{t.contactPhone}</span>
              <span className={`text-xs md:text-sm font-semibold mt-1 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>+216 71 888 888</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className={`flex flex-col items-center text-center p-6 border rounded-2xl hover:border-purple-500/40 transition-colors ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-505 border border-purple-500/20 flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="block text-[10px] uppercase font-mono text-slate-400 tracking-wider font-bold">{t.contactHeadquarters}</span>
              <span className={`text-xs md:text-sm font-semibold mt-1 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Centre Urbain Nord, Tunis</span>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-xs text-blue-500 leading-relaxed font-sans inline-flex items-center gap-3"
          >
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full shrink-0 animate-ping"></span>
            <span><strong>{lang === "ar" ? "قناة المساعدة الحية:" : lang === "en" ? "Support Pipeline Status:" : "Statut du Support :"}</strong> {t.contactStatusActive}</span>
          </motion.div>

        </div>
      </section>

      {/* ☕ SOFT MINIMAL FOOTER */}
      <footer 
        dir={directionClass} 
        className={`text-slate-500 text-xs py-12 px-6 border-t text-center ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-white/10'
        } backdrop-blur-md`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className={`font-display font-bold text-lg tracking-wide uppercase ${isLight ? 'text-blue-600' : 'text-white'}`}>Scrivya</span>
            <span className="text-slate-500 font-display font-light text-xs border-l border-white/20 pl-2">Academic Companion</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] flex-wrap justify-center">
            <span>© 2026 Scrivya. {lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
            <a href="#hero" className="hover:text-slate-700 transition-colors">{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</a>
            <a href="#hero" className="hover:text-slate-700 transition-colors">{lang === "ar" ? "اتفاقية الاستخدام" : "Terms & Conditions"}</a>
          </div>
        </div>
      </footer>

      {/* ======================================================================
          🔐 LOGIN / SIGNUP FUNCTIONAL DIALOG MODAL OVERLAY
          ====================================================================== */}
      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div 
            dir={directionClass}
            className={`w-full max-w-md rounded-3xl p-6 md:p-8 border shadow-2xl relative transition-all animate-scaleIn ${
              isLight ? "bg-white border-slate-250 text-slate-900" : "bg-slate-900 border-white/15 text-slate-100"
            }`}
          >
            {/* Close button */}
            <button 
              onClick={() => { setAuthModal(null); setAuthSuccessMessage(null); }}
              className={`absolute top-4 right-4 p-1.5 rounded-xl transition-all cursor-pointer ${
                isLight ? "hover:bg-slate-100 text-slate-500 hover:text-slate-900" : "hover:bg-white/10 text-slate-400 hover:text-white"
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {authSuccessMessage ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-display">{authSuccessMessage}</h3>
                <p className="text-xs text-slate-500">Redirecting to personal space...</p>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-5 text-left">
                <div className={`space-y-1.5 ${textAlignment}`}>
                  <h3 className={`text-xl md:text-2xl font-bold font-display tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {authModal === "login" ? t.lblLoginForm : t.lblSignupForm}
                  </h3>
                  <p className="text-xs text-slate-450">
                    {authModal === "login" 
                      ? (lang === "ar" ? "مرحبا بك مجدداً! قم بإدخال بياناتك للمتابعة." : "Welcome back! Enter credentials to access your dashboard.") 
                      : (lang === "ar" ? "تسجيل سريع ومجاني للطلاب والأساتذة لتجربة ميزاتنا." : "Instant student and faculty credentials registry.")
                    }
                  </p>
                </div>

                <div className="space-y-4 pt-2 text-xs">
                  {authModal === "signup" && (
                    <>
                      <div className="space-y-1">
                        <label className={`block font-semibold ${isLight ? 'text-slate-700' : 'text-slate-350'}`}>{t.lblFullName}</label>
                        <input 
                          type="text" 
                          required 
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Mohamed Ben Ali"
                          className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            isLight ? "bg-white border-slate-300 text-slate-900" : "bg-slate-950 border-white/10 text-white"
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={`block font-semibold ${isLight ? 'text-slate-700' : 'text-slate-355'}`}>{t.lblInstitution}</label>
                        <input 
                          type="text" 
                          value={authInstitution}
                          onChange={(e) => setAuthInstitution(e.target.value)}
                          placeholder="INSAT / ENIT / IHEC..."
                          className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            isLight ? "bg-white border-slate-300 text-slate-900" : "bg-slate-950 border-white/10 text-white"
                          }`}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    <label className={`block font-semibold ${isLight ? 'text-slate-700' : 'text-slate-350'}`}>{t.lblEmailAddress}</label>
                    <input 
                      type="email" 
                      required 
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="student@univ.tn"
                      className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        isLight ? "bg-white border-slate-300 text-slate-900" : "bg-slate-950 border-white/10 text-white"
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`block font-semibold ${isLight ? 'text-slate-700' : 'text-slate-350'}`}>{t.lblPassword}</label>
                    <input 
                      type="password" 
                      required 
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        isLight ? "bg-white border-slate-300 text-slate-900" : "bg-slate-950 border-white/10 text-white"
                      }`}
                    />
                  </div>

                  {authModal === "login" && (
                    <div className={`flex items-center justify-between text-[11px] ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-450 font-medium">
                        <input type="checkbox" className="rounded border-slate-300" />
                        <span>{t.lblRememberMe}</span>
                      </label>
                      <a href="#hero" className="text-blue-500 hover:underline">{lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}</a>
                    </div>
                  )}
                </div>

                <div className="pt-3">
                  <button 
                    type="submit" 
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    {authModal === "login" ? t.lblSubmitConnexion : t.lblCreateAccount}
                  </button>
                </div>

                <div className="text-center pt-3 border-t border-white/5">
                  {authModal === "login" ? (
                    <button 
                      type="button" 
                      onClick={() => { setAuthModal("signup"); setAuthEmail(""); }} 
                      className="text-xs text-blue-500 hover:underline cursor-pointer"
                    >
                      {t.lblDontHaveAccount}
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => { setAuthModal("login"); setAuthEmail(""); }} 
                      className="text-xs text-blue-500 hover:underline cursor-pointer"
                    >
                      {t.lblAlreadyHaveAccount}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// Utility features list depending on language
function ptFeatureList(lang: "fr" | "en" | "ar"): string[] {
  if (lang === "ar") {
    return [
      "مطابقة كاملة لشروط الفهرسة وتدبيج الهوامش",
      "صياغة وترتيب المصادر أبجدياً في ثوانٍ معدودة",
      "دليل شامل مصمم للجامعات التشكيلية والتقنية"
    ];
  }
  if (lang === "en") {
    return [
      "Strict compliant footnotes and bibliography parameters",
      "Dynamic automatic ordering logs & publishing standards",
      "Preloaded guidelines of major certified colleges"
    ];
  }
  return [
    "Citations latines Ibid., op.cit. rigoureuses",
    "Générateur de bibliographie AFNOR automatique",
    "Prise en compte des consignes spécifiques des facultés"
  ];
}
