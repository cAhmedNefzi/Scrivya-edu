import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Users,
  DollarSign,
  BookOpen,
  GitBranch,
  MonitorPlay,
  Cpu,
  GraduationCap,
  ExternalLink,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Zap,
  Globe,
  Star,
  LogIn,
  Sliders,
  Send
} from "lucide-react";
import GoogleIcon from "./GoogleIcon";
import AnimatedArchitecturalGrid from "./AnimatedArchitecturalGrid";
import LandingFeatureShowcase from "./LandingFeatureShowcase";

interface UserProfile {
  name: string;
  email: string;
  university?: string;
  avatar?: string;
  isGoogle?: boolean;
}

interface MinimalistLandingPageProps {
  lang: "fr" | "en" | "ar";
  setLang: (l: "fr" | "en" | "ar") => void;
  onOpenWorkspace: (user?: UserProfile) => void;
}

export default function MinimalistLandingPage({
  lang,
  setLang,
  onOpenWorkspace,
}: MinimalistLandingPageProps) {
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authInstitution, setAuthInstitution] = useState("");
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const isRtl = lang === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  // Google Sign In Handler
  const handleGoogleAuth = () => {
    setGoogleAuthLoading(true);
    setTimeout(() => {
      setGoogleAuthLoading(false);
      const googleUser: UserProfile = {
        name: "Ahmed Nefzi",
        email: "c.ahmednefzi@gmail.com",
        university: "INSAT Tunis - Génie Logiciel",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        isGoogle: true
      };
      setSuccessMsg(
        lang === "ar"
          ? "تم تسجيل الدخول بحساب Google بنجاح!"
          : lang === "en"
          ? "Successfully authenticated via Google!"
          : "Connexion via compte Google réussie !"
      );
      setTimeout(() => {
        setAuthModal(null);
        setSuccessMsg(null);
        onOpenWorkspace(googleUser);
      }, 900);
    }, 800);
  };

  // Standard Email Auth Handler
  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;

    const user: UserProfile = {
      name: authName || (authEmail.split("@")[0].charAt(0).toUpperCase() + authEmail.split("@")[0].slice(1)),
      email: authEmail,
      university: authInstitution || "Université de Tunis",
      isGoogle: false
    };

    setSuccessMsg(
      lang === "ar"
        ? "تم تأكيد الحساب بنجاح!"
        : lang === "en"
        ? "Account confirmed successfully!"
        : "Compte validé avec succès !"
    );

    setTimeout(() => {
      setAuthModal(null);
      setSuccessMsg(null);
      onOpenWorkspace(user);
    }, 900);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    }, 4000);
  };

  return (
    <div dir={dir} className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      {/* Dynamic Animated Grid Lines on White Canvas */}
      <AnimatedArchitecturalGrid />

      {/* ======================================================================
          HEADER & ARCHITECTURAL NAVBAR
          ====================================================================== */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo Brand Mark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold font-mono text-sm shadow-sm">
              S
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Scrivya
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                PFE-Hub 2026
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">
              {lang === "ar" ? "الميزات الأكاديمية" : lang === "en" ? "Academic Features" : "Fonctionnalités PFE"}
            </a>
            <a href="#interactive-sandbox" className="hover:text-blue-600 transition-colors">
              {lang === "ar" ? "محاكي COGS" : lang === "en" ? "COGS Simulator" : "Simulateur COGS"}
            </a>
            <a href="#matchmaking" className="hover:text-blue-600 transition-colors">
              {lang === "ar" ? "التوافق الجامعي" : lang === "en" ? "Team Matchmaking" : "Matchmaking INSAT • IHEC"}
            </a>
            <a href="#afnor" className="hover:text-blue-600 transition-colors">
              {lang === "ar" ? "معايير AFNOR" : lang === "en" ? "AFNOR Standards" : "Norme AFNOR Z 44-005"}
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Actions: Google Auth, Lang Switcher & CTA */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="flex p-0.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-bold font-mono">
              <button
                onClick={() => setLang("fr")}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  lang === "fr" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  lang === "en" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("ar")}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  lang === "ar" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                عربي
              </button>
            </div>

            {/* Google Sign In Direct Action */}
            <button
              onClick={handleGoogleAuth}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="Continuer avec Google"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>{lang === "ar" ? "دخول مع Google" : lang === "en" ? "Sign in with Google" : "Google"}</span>
            </button>

            {/* Sign In / Sign Up Modal Triggers */}
            <button
              onClick={() => setAuthModal("login")}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {lang === "ar" ? "دخول" : lang === "en" ? "Sign in" : "Connexion"}
            </button>

            <button
              onClick={() => onOpenWorkspace()}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{lang === "ar" ? "فتح Workspace" : lang === "en" ? "Launch Workspace" : "Ouvrir Workspace"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================================
          HERO SECTION - MINIMALIST HIGH-CONTRAST ARCHITECTURAL LAYOUT
          ====================================================================== */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Architectural Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300 bg-white shadow-xs text-xs font-mono font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>AFNOR NF Z 44-005</span>
            <span className="text-slate-300">•</span>
            <span>STATUT STARTUP ACT TUNISIE</span>
            <span className="text-slate-300">•</span>
            <span className="text-blue-600 font-bold">PFE-HUB 2026</span>
          </div>

          {/* High-Contrast Crisp Headline (NO GRADIENT TEXT) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            {lang === "ar"
              ? "فضاء البحث الأكاديمي وحاضنة مشروعات التخرج الذكية"
              : lang === "en"
              ? "Next-Generation Academic Research & PFE-Startup Hub"
              : "L'Espace de Recherche & Hub PFE Nouvelle Génération"}
          </h1>

          {/* Subtitle with deep academic & startup focus */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {lang === "ar"
              ? "المنصة الشاملة لإدارة أطروحات التخرج PFE ونيل علامة Startup Act: ضبط نسبة COGS أقل من 30%، تكوين فرق العمل بين INSAT و Esprit و IHEC، وأتمتة هوامش AFNOR Z 44-005."
              : lang === "en"
              ? "The end-to-end PFE & thesis workspace with Tunisia Startup Act compliance: live server COGS &lt; 30% audits, cross-university cofounder matchmaking, and automated AFNOR Z 44-005 citations."
              : "L'environnement d'ingénierie complet pour réussir votre mémoire de PFE et labelliser votre startup : audit de conformité COGS &lt; 30%, matchmaking Carthage INSAT-IHEC, et génération automatisée des citations AFNOR."}
          </p>

          {/* Primary Action Button Cluster including Google Sign-in */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenWorkspace()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {lang === "ar"
                  ? "الدخول إلى Workspace الأكاديمي (مجاناً)"
                  : lang === "en"
                  ? "Open Academic Workspace (Free)"
                  : "Accéder au Workspace Académique"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Prominent Google Sign-in / Sign-up Button */}
            <button
              onClick={handleGoogleAuth}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <GoogleIcon className="w-5 h-5" />
              <span>
                {lang === "ar"
                  ? "المتابعة بحساب Google"
                  : lang === "en"
                  ? "Continue with Google"
                  : "Continuer avec Google"}
              </span>
            </button>
          </div>

          {/* Compliance & Engineering Metric Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-slate-200 font-mono text-left">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="text-xl font-bold text-slate-900">100%</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">Norme AFNOR NF Z 44-005</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="text-xl font-bold text-emerald-600">&lt; 30.0%</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">COGS Seuil Startup Act</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="text-xl font-bold text-blue-600">3 Pôles</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">INSAT • Esprit • IHEC</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="text-xl font-bold text-indigo-600">15 Min</div>
              <div className="text-[11px] text-slate-500 font-sans mt-0.5">Générateur Diaporama Jury</div>
            </div>
          </div>

        </div>

        {/* ====================================================================
            INTERACTIVE LIVE SANDBOX (LANDING FEATURE SHOWCASE)
            ==================================================================== */}
        <div id="interactive-sandbox" className="mt-12 md:mt-16">
          <LandingFeatureShowcase
            lang={lang}
            onOpenWorkspace={() => onOpenWorkspace()}
          />
        </div>
      </section>

      {/* ======================================================================
          DETAILED ACADEMIC WORKSPACE CORE MODULES (NEW CONTENT)
          ====================================================================== */}
      <section id="features" className="py-16 md:py-24 bg-slate-50 border-y border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block">
              {lang === "ar" ? "محركات بيئة العمل" : lang === "en" ? "Workspace Core Capabilities" : "ARCHITECTURE PFE-HUB & WORKSPACE"}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {lang === "ar"
                ? "ميزات متطورة مصممة لمهندسي وباحثي المستقبل"
                : lang === "en"
                ? "Engineered for Student Cofounders & Academic Researchers"
                : "Six modules spécialisés pour propulser votre PFE vers le Startup Act"}
            </h2>
            <p className="text-sm text-slate-600">
              {lang === "ar"
                ? "كل ما تحتاجه من كتابة الأطروحة بالمعايير الرسمية إلى التدقيق المالي ومحاكاة العرض النهائي."
                : lang === "en"
                ? "From official university formatting to financial COGS audits and 15-minute defense timers."
                : "Une suite technologique unifiée pour concevoir un mémoire irréprochable et préparer votre dossier officiel de labellisation."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1: COGS Simulator */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">Startup Act Tunisie</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {lang === "ar" ? "مدقق تكلفة الخوادم COGS < 30%" : lang === "en" ? "COGS Ratio Auditor (< 30%)" : "Audit Financier COGS &lt; 30%"}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "ar"
                  ? "حساب دقيق لتكاليف استهلاك Gemini LLM وخوادم AWS ومقارنتها بالإيرادات لاجتياز لجان التدقيق الحكومية بنجاح."
                  : lang === "en"
                  ? "Real-time projection of AWS, Postgres, and LLM API costs against projected ARR to pass Ministry label audits."
                  : "Modélisation précise de vos coûts d'infrastructure face à votre chiffre d'affaires prévisionnel pour satisfaire les comités ministériels."}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenWorkspace()}
                  className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{lang === "ar" ? "اختبار في Workspace" : "Ouvrir dans le Workspace"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature 2: Matchmaking INSAT - IHEC */}
            <div id="matchmaking" className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">Carthage Matchmaker</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {lang === "ar" ? "التوافق بين الكليات التونسية" : lang === "en" ? "Inter-University Cofounders" : "Matchmaking INSAT • Esprit • IHEC"}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "ar"
                  ? "مواءمة ذكية لتشكيل فرق ثلاثية متكاملة: مهندس برمجيات (Tech Lead)، مصمم تجربة مستخدم (UI/UX)، ومسؤول تطوير أعمال (SaaS)."
                  : lang === "en"
                  ? "Synchronizes academic defense timelines to form the ideal triad: Tech Lead, UI/UX Designer, and SaaS Business Strategist."
                  : "Synchronisation des calendriers de soutenance des grandes écoles pour former des équipes co-fondatrices viables et complémentaires."}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenWorkspace()}
                  className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{lang === "ar" ? "استكشاف الشركاء" : "Explorer les profils"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature 3: AFNOR Z 44-005 Citations */}
            <div id="afnor" className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Standard Typographique</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {lang === "ar" ? "هوامش AFNOR Z 44-005 اللاتينية" : lang === "en" ? "AFNOR NF Z 44-005 Footnotes" : "Citations AFNOR (Ibid., Op. Cit.)"}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "ar"
                  ? "إدارة فورية لتسلسل الهوامش السفلية وفق الترتيب الأكاديمي المعتمد في تونس دون أي خطأ ترقيم."
                  : lang === "en"
                  ? "Automated Latin sequential footnotes (Ibid, op. cit., loc. cit.) strictly aligned with Tunisian academic review boards."
                  : "Micro-compilateur identifiant les références consécutives et appliquant les balises latines adéquates sans risque de décalage."}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenWorkspace()}
                  className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{lang === "ar" ? "عرض محرر الهوامش" : "Tester le micro-compilateur"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature 4: Figma to GitHub */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center font-bold">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-fuchsia-600 uppercase">Dev-Ready Webhook</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {lang === "ar" ? "مزامنة Figma ↔ GitHub Issues" : lang === "en" ? "Figma ↔ GitHub Issue Sync" : "Intégration Figma ↔ GitHub"}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "ar"
                  ? "تحويل شاشات التصميم الموسومة بـ Dev-Ready على Figma إلى تذاكر عمل تقنية جاهزة على GitHub تلقائياً."
                  : lang === "en"
                  ? "Instantly converts Dev-Ready Figma frames into GitHub engineering tickets complete with dimensions and asset links."
                  : "Génération automatique d'issues GitHub détaillées dès qu'un frame Figma est marqué comme 'Prêt pour le développement'."}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenWorkspace()}
                  className="text-xs font-bold text-fuchsia-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{lang === "ar" ? "تشغيل الـ Webhook" : "Connecter le Webhook"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature 5: Defense Slides Generator */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <MonitorPlay className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">Soutenance 15 Minutes</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {lang === "ar" ? "مولد شرائح الدفاع أمام اللجنة" : lang === "en" ? "Defense Slide Deck Generator" : "Studio Diaporama & Chrono"}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "ar"
                  ? "توليد تلقائي لعرض تقديمي مؤلف من 10 شرائح مع عداد تنازلي وملاحظات الإلقاء وتوقعات أسئلة اللجنة."
                  : lang === "en"
                  ? "Generates a 10-slide defense presentation with integrated countdown timer, speaker cues, and anticipated jury questions."
                  : "Création en un clic d'un support de présentation 16:9 structuré en 10 slides avec notes d'orateur et simulateur de Q&R."}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenWorkspace()}
                  className="text-xs font-bold text-amber-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{lang === "ar" ? "فتح استوديو العرض" : "Lancer le studio de slides"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature 6: Mind Map & AI Mentor */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-600 uppercase">Carthage AI Mentor</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {lang === "ar" ? "الخريطة الذهنية والأمان الأكاديمي" : lang === "en" ? "Academic Mind Map & Anti-Plagiarism" : "Carte Mentale & IA Anti-Plagiat"}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "ar"
                  ? "خرائط مفاهيمية مرئية لتنظيم فصول البحث، مع مدقق لغوي يعيد صياغة الفقرات المعقدة لحماية العمل من تهم التشابه."
                  : lang === "en"
                  ? "Visual chapter conceptualizer with semantic rephraser to guarantee originality under university anti-plagiarism filters."
                  : "Visualisation nodale de votre plan de recherche avec reformulation sémantique pour sécuriser votre rapport avant soumission."}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenWorkspace()}
                  className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{lang === "ar" ? "رسم الخريطة" : "Ouvrir la carte mentale"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================================
          UNIVERSITY CONSORTIUM PRESETS (TUNISIAN & INTERNATIONAL STANDARDS)
          ====================================================================== */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">
            {lang === "ar"
              ? "متوافق مع أدلة التنسيق الرسمية للجامعات التونسية"
              : lang === "en"
              ? "Preloaded University Layout Guidelines"
              : "CONFORME AUX GUIDES DE RÉDACTION OFFICIELS DES UNIVERSITÉS"}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-mono text-xs font-bold text-slate-700">
            <span className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50">INSAT Tunis</span>
            <span className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50">ENIT</span>
            <span className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50">IHEC Carthage</span>
            <span className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50">Esprit</span>
            <span className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50">SUP'COM</span>
            <span className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50">Faculté de Médecine</span>
            <span className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50">ENSI</span>
          </div>
        </div>
      </section>

      {/* ======================================================================
          FAQ SECTION - ACCORDION
          ====================================================================== */}
      <section id="faq" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase">
              {lang === "ar" ? "الأسئلة الشائعة" : "QUESTIONS FRÉQUENTES"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === "ar" ? "كل ما تود معرفته عن Scrivya" : "Tout comprendre sur le Workspace et la norme AFNOR"}
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: lang === "ar"
                  ? "كيف يساعدني النظام في اجتياز لجنة Startup Act التونسية؟"
                  : lang === "en"
                  ? "How does the COGS module help pass the Tunisia Startup Act committee?"
                  : "Comment le simulateur COGS prépare-t-il au label Startup Act ?",
                a: lang === "ar"
                  ? "يقوم المحاكي باحتساب تكلفة استدعاءات الذكاء الاصطناعي وخوادم AWS ومقارنتها بالإيرادات المتوقعة للتحقق من أن نسبة التكلفة التشغيلية أقل من 30% وفق القانون 2018-20."
                  : lang === "en"
                  ? "It models infrastructure and LLM costs against projected subscriber revenues to ensure your COGS stay under the 30% statutory limit required by Law 2018-20."
                  : "Le module modélise précisément la part des coûts serveurs (AWS, hébergement, requêtes IA) par rapport au chiffre d'affaires prévisionnel. La loi tunisienne exige un modèle scalable avec un ratio COGS < 30%."
              },
              {
                q: lang === "ar"
                  ? "ما هي قاعدة Ibid. و Op. Cit. في المعيار AFNOR NF Z 44-005؟"
                  : lang === "en"
                  ? "What are the Ibid. and Op. Cit. rules in AFNOR NF Z 44-005?"
                  : "Qu'est-ce que la gestion des notes Ibid. et Op. Cit. ?",
                a: lang === "ar"
                  ? "تستخدم 'Ibid.' عند الإشارة إلى نفس المرجع الوارد في الهامش السابق مباشرة، بينما تستخدم 'Op. Cit.' عند الإشارة إلى مرجع سبق ذكره في صفحات سابقة. يتولى النظام تطبيق ذلك آلياً."
                  : lang === "en"
                  ? "Ibid. applies to the immediately preceding citation, while Op. Cit. designates previously cited works. Scrivya tracks references chronologically without human intervention."
                  : "Le standard universitaire impose d'utiliser Ibid. pour une référence immédiatement consécutive et Op. Cit. pour un ouvrage cité antérieurement. Notre micro-compilateur gère cette chronologie automatiquement."
              },
              {
                q: lang === "ar"
                  ? "هل يمكنني تسجيل الدخول مباشرة بحساب Google؟"
                  : lang === "en"
                  ? "Can I sign in instantly with my Google account?"
                  : "Puis-je me connecter directement avec mon compte Google ?",
                a: lang === "ar"
                  ? "نعم، يمكنك النقر على 'دخول مع Google' في أعلى الصفحة للدخول فوراً إلى مساحة العمل الخاصة بك دون الحاجة لملء أي استمارات."
                  : lang === "en"
                  ? "Yes, clicking 'Sign in with Google' in the navbar immediately activates your personalized workspace with zero form filling."
                  : "Absolument. Un simple clic sur le bouton 'Google' en en-tête ou dans la fenêtre d'authentification vous ouvre immédiatement l'accès au Workspace complet."
              },
              {
                q: lang === "ar"
                  ? "ما هي صيغ التصدير المتاحة للمذكرات والشرائح؟"
                  : lang === "en"
                  ? "What export formats are supported for theses and slides?"
                  : "Quels sont les formats d'exportation disponibles ?",
                a: lang === "ar"
                  ? "يتيح لك النظام تصدير المذكرة بصيغة PDF جاهزة للطباعة مع هوامش 2.5 سم، أو DOCX قابل للتعديل، مع شرائح العرض بصيغة PowerPoint / PDF."
                  : lang === "en"
                  ? "You can export print-ready PDF files with 2.5 cm margins, editable DOCX files, and 16:9 presentation slide decks."
                  : "Vous pouvez exporter votre mémoire en PDF normalisé (marges 2,5 cm, interligne 1,5), en document Word DOCX éditable, et votre diaporama en format 16:9."
              }
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {activeFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          MINIMALIST CONTACT FORM
          ====================================================================== */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-slate-900">
              {lang === "ar" ? "تواصل مع فريق الدعم الأكاديمي" : "Une question sur votre PFE ou votre université ?"}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === "ar" ? "نساعد الطلاب والأساتذة في ضبط إعدادات كلياتهم." : "Notre équipe répond sous 2 heures ouvrées aux étudiants et encadrants."}
            </p>
          </div>

          {contactSent ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-semibold">
              ✓ {lang === "ar" ? "تم إرسال رسالتكم بنجاح! سنتواصل معكم سريعاً." : "Message transmis avec succès ! Notre équipe vous répondra très rapidement."}
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ahmed Sassi"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email universitaire</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="ahmed.sassi@insat.u-carthage.tn"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Votre message</label>
                <textarea
                  rows={3}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Bonjour, nous préparons notre soutenance PFE à l'INSAT et souhaitons valider notre ratio COGS..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer ma demande</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ======================================================================
          MINIMALIST CLEAN FOOTER
          ====================================================================== */}
      <footer className="py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-sm">Scrivya</span>
            <span className="text-slate-500">•</span>
            <span>AFNOR NF Z 44-005 & Startup Act PFE-Hub</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#interactive-sandbox" className="hover:text-white transition-colors">Simulateur COGS</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <button
              onClick={() => onOpenWorkspace()}
              className="text-blue-400 hover:underline cursor-pointer font-bold"
            >
              Workspace
            </button>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            © 2026 Scrivya TN • Tunis, Tunisie
          </div>
        </div>
      </footer>

      {/* ======================================================================
          SIGN IN / SIGN UP MODAL WITH GOOGLE BUTTON
          ====================================================================== */}
      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div
            dir={dir}
            className="w-full max-w-md rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 text-slate-900 shadow-2xl relative animate-scaleIn"
          >
            {/* Close button */}
            <button
              onClick={() => {
                setAuthModal(null);
                setSuccessMsg(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {successMsg ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{successMsg}</h3>
                <p className="text-xs text-slate-500">Ouverture de votre espace de travail...</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {authModal === "login"
                      ? lang === "ar"
                        ? "تسجيل الدخول إلى Scrivya"
                        : "Connexion à votre espace Scrivya"
                      : lang === "ar"
                      ? "إنشاء حساب طالب أو باحث"
                      : "Créer un compte étudiant ou enseignant"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {authModal === "login"
                      ? "Accédez à vos mémoires, rapports PFE et simulations Startup Act."
                      : "Rejoignez le PFE-Hub et trouvez vos cofondateurs INSAT/IHEC."}
                  </p>
                </div>

                {/* Prominent Google Sign-in Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={googleAuthLoading}
                    className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <GoogleIcon className="w-5 h-5" />
                    <span>
                      {googleAuthLoading
                        ? "Connexion Google en cours..."
                        : authModal === "login"
                        ? "Se connecter avec Google"
                        : "S'inscrire avec Google"}
                    </span>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full"></div>
                  <span className="bg-white px-3 text-[11px] text-slate-400 font-medium uppercase font-mono">
                    Ou par email
                  </span>
                </div>

                {/* Email Password Form */}
                <form onSubmit={handleEmailAuth} className="space-y-3.5 text-xs">
                  {authModal === "signup" && (
                    <>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Nom complet</label>
                        <input
                          type="text"
                          required
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="Mohamed Ben Ali"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Université ou École</label>
                        <input
                          type="text"
                          value={authInstitution}
                          onChange={(e) => setAuthInstitution(e.target.value)}
                          placeholder="INSAT / ENIT / IHEC / Esprit..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email universitaire</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="etudiant@univ.tn"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mot de passe</label>
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer mt-2"
                  >
                    {authModal === "login" ? "Se connecter" : "Créer mon compte"}
                  </button>
                </form>

                {/* Switch between login & signup */}
                <div className="text-center pt-2 border-t border-slate-100 text-xs">
                  {authModal === "login" ? (
                    <button
                      type="button"
                      onClick={() => setAuthModal("signup")}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      Pas encore de compte ? S'inscrire gratuitement
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAuthModal("login")}
                      className="text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      Vous avez déjà un compte ? Se connecter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
