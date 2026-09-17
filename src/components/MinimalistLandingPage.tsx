import React, { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Users,
  DollarSign,
  BookOpen,
  GitBranch,
  MonitorPlay,
  ExternalLink,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Globe,
  Sliders,
  Send,
  HelpCircle,
  FolderKanban,
  Search,
  School,
  Award
} from "lucide-react";
import GoogleIcon from "./GoogleIcon";
import LandingFeatureShowcase from "./LandingFeatureShowcase";
import PfeStartupMatchmakingGraphic from "./PfeStartupMatchmakingGraphic";
import {
  HeroPaperCutComposition,
  SectionPaperCutComposition,
  PaperCutShape
} from "./DecorativeShapes";
import { Lozenge } from "./AtlassianComponents";

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
  theme?: "dark" | "light";
  setTheme?: (t: "dark" | "light") => void;
  onOpenWorkspace: (user?: UserProfile) => void;
}

export default function MinimalistLandingPage({
  lang,
  setLang,
  onOpenWorkspace,
}: MinimalistLandingPageProps) {
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");
  const [authInstitution, setAuthInstitution] = useState("");
  const [cookieConsentDismissed, setCookieConsentDismissed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isRtl = lang === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  const handleGoogleAuth = () => {
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
    }, 800);
  };

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
    }, 800);
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
    <div
      dir={dir}
      className="min-h-screen bg-[#f0f6ff] text-[#111118] font-sans relative selection:bg-[#ffda00] selection:text-[#111118] overflow-x-hidden"
      style={{ fontFamily: "var(--font-haas-grot-text)" }}
    >

      {/* ======================================================================
          TOP NAVIGATION BAR (STYLED & FIXED SUPERHI SPEC)
          Fixed top-0 left-0 right-0 z-50.
          White background #ffffff, 1px bottom border #e1edff, shadow-[0_2px_0_0_#111118], height 64px.
          Left: round 34px Electric Iris logo mark + "Scrivya" + PFE 2026 tag.
          Center: single-line nav links with clean hover styling.
          Right: language switcher, sign-in ghost button, and primary Workspace CTA button.
          ====================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff] border-b border-[#e1edff] shadow-[0_2px_0_0_#111118] h-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
          
          {/* Left: Brand mark (Round 34px Electric Iris) + Wordmark + Tag */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div
              className="flex items-center gap-2.5 cursor-pointer group select-none"
              onClick={() => onOpenWorkspace()}
            >
              <div className="w-[34px] h-[34px] rounded-full bg-[#2727e6] text-[#ffffff] flex items-center justify-center font-bold shadow-[0_2px_0_0_#111118] transition-transform group-hover:scale-105">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-normal text-lg tracking-tight text-[#111118] whitespace-nowrap">
                Scrivya
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-[5000px] bg-[#f0f6ff] border border-[#e1edff] text-[11px] font-normal text-[#2727e6] tracking-tight">
                PFE 2026
              </span>
            </div>

            {/* Nav links in Haas Grot Text, weight 400 - clean, uncrowded, single-line */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[15px] font-normal text-[#111118]">
              <a
                href="#norme-afnor"
                className="hover:text-[#2727e6] transition-colors whitespace-nowrap"
              >
                {lang === "ar" ? "معايير AFNOR" : "Norme AFNOR"}
              </a>
              <a
                href="#audit-cogs"
                className="hover:text-[#2727e6] transition-colors whitespace-nowrap"
              >
                {lang === "ar" ? "تدقيق COGS" : "Startup Act"}
              </a>
              <a
                href="#matchmaking"
                className="hover:text-[#2727e6] transition-colors whitespace-nowrap"
              >
                {lang === "ar" ? "التوافق الجامعي" : "Matchmaking"}
              </a>
              <a
                href="#faq"
                className="hover:text-[#2727e6] transition-colors whitespace-nowrap"
              >
                FAQ
              </a>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center p-0.5 rounded-full bg-[#f0f6ff] border border-[#e1edff] text-xs">
              <button
                onClick={() => setLang("fr")}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer text-xs ${
                  lang === "fr" ? "bg-[#2727e6] text-[#ffffff] shadow-[0_1px_0_0_#111118]" : "text-[#111118]/70 hover:text-[#111118]"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer text-xs ${
                  lang === "en" ? "bg-[#2727e6] text-[#ffffff] shadow-[0_1px_0_0_#111118]" : "text-[#111118]/70 hover:text-[#111118]"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("ar")}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer text-xs ${
                  lang === "ar" ? "bg-[#2727e6] text-[#ffffff] shadow-[0_1px_0_0_#111118]" : "text-[#111118]/70 hover:text-[#111118]"
                }`}
              >
                عربي
              </button>
            </div>

            {/* Sign in ghost button */}
            <button
              onClick={() => setAuthModal("login")}
              className="text-sm font-normal text-[#111118] hover:text-[#2727e6] px-2.5 py-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              {lang === "ar" ? "دخول" : "Connexion"}
            </button>

            {/* Primary Action Button (Electric Iris #2727e6, 48px pill, hard shadow 0 4px 0 0 #111118) */}
            <button
              onClick={() => onOpenWorkspace()}
              className="superhi-btn-primary superhi-btn-compact cursor-pointer whitespace-nowrap"
            >
              <span>{lang === "ar" ? "مساحة العمل" : "Workspace"}</span>
              <span className="text-base font-normal">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================================
          3. HERO TEXT BLOCK & PAPER-CUT SHAPE LAYER (SUPERHI SPEC)
          Centered headline-and-CTA composition on pale-blue Chalk Blue canvas.
          Padding-top offset (pt-28 md:pt-36) accounts for fixed 64px navbar.
          Above headline: small 48px round icon container in #2727e6.
          Headline: Haas Grot Disp 72px, weight 400, #111118, letter-spacing -0.03em.
          Subhead: Haas Grot Text 20px #111118.
          Two pill buttons: Primary #2727e6 with trailing →, and Dark #000000.
          Rotating paper-cut shapes in #ffda00, #ff4141, #ffbac4, #91d8ec, #16ab59
          floating cleanly in negative space around the perimeter without touching text.
          ====================================================================== */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto text-center z-10 overflow-hidden">
        
        {/* Scattered Paper-Cut Shape System (clean shapes rotating slowly at outer perimeter) */}
        <HeroPaperCutComposition />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          
          {/* Round Icon Container (48px circle, #2727e6, centered white icon mark) */}
          <div className="flex justify-center">
            <div className="superhi-icon-container shadow-[0_3px_0_0_#111118]">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Centered Headline in Haas Grot Disp (weight 400, #111118, tight tracking) */}
          <h1
            className="text-4xl sm:text-6xl lg:text-[72px] font-normal text-[#111118] tracking-[-2.16px] leading-[1.0] max-w-4xl mx-auto"
            style={{ fontFamily: "var(--font-haas-grot-disp)" }}
          >
            {lang === "ar"
              ? "مساحة العمل الأكاديمية وحاضنة مشروعات التخرج."
              : lang === "en"
              ? "The academic thesis studio and student founder hub."
              : "L'espace d'excellence pour votre mémoire de PFE."}
          </h1>

          {/* Subhead in Haas Grot Text 20px, weight 400, #111118, 1.4 line-height */}
          <p
            className="text-[18px] sm:text-[20px] text-[#111118] leading-[1.4] max-w-[640px] mx-auto tracking-[-0.2px] font-normal"
            style={{ fontFamily: "var(--font-haas-grot-text)" }}
          >
            {lang === "ar"
              ? "منصة متكاملة تجمع بين التوثيق الأكاديمي الصارم لمعايير AFNOR، وتدقيق تكاليف السحابة COGS أقل من 30% لنيل علامة Startup Act، ومطابقة الشركاء بين كليات الهندسة والتجارة."
              : lang === "en"
              ? "An end-to-end studio combining official AFNOR NF Z 44-005 academic formatting, live server COGS &lt; 30% financial modeling for the Tunisia Startup Act, and university team matchmaking."
              : "Rédigez selon la norme officielle AFNOR NF Z 44-005, auditez la viabilité financière de votre projet (COGS serveurs < 30%) pour le Startup Act, et constituez votre équipe avec les grandes écoles."}
          </p>

          {/* Two Pill Buttons Side by Side (SuperHi Primary + Dark Secondary) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {/* Primary Action Button (#2727e6, white text, trailing → arrow, hard shadow 0 4px 0 0 #111118) */}
            <button
              onClick={() => onOpenWorkspace()}
              className="superhi-btn-primary cursor-pointer"
            >
              <span>{lang === "ar" ? "دخول مساحة العمل" : "Accéder au Workspace"}</span>
              <span className="text-xl font-normal leading-none">→</span>
            </button>

            {/* Dark Secondary Action Button (#000000, white text, hard shadow 0 4px 0 0 #2727e6) */}
            <button
              onClick={handleGoogleAuth}
              className="superhi-btn-dark cursor-pointer inline-flex items-center gap-2"
            >
              <GoogleIcon className="w-4 h-4 text-white" />
              <span>{lang === "ar" ? "تسجيل بحساب Google" : "Continuer avec Google"}</span>
            </button>
          </div>

          {/* Course / Pillar Highlight Cards (Paper White #ffffff, 24px radius, 1px border #e1edff, hard shadow 0 2px 0 0 #111118) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 text-left">
            <div className="superhi-card">
              <div className="text-[12px] font-mono text-[#111118]/60 uppercase tracking-tight">Standard</div>
              <div className="text-2xl font-normal text-[#111118] mt-1">AFNOR</div>
              <div className="text-xs text-[#111118]/70 mt-1">Norme NF Z 44-005</div>
            </div>
            <div className="superhi-card">
              <div className="text-[12px] font-mono text-[#111118]/60 uppercase tracking-tight">Financement</div>
              <div className="text-2xl font-normal text-[#16ab59] mt-1">&lt; 30%</div>
              <div className="text-xs text-[#111118]/70 mt-1">Seuil COGS Startup Act</div>
            </div>
            <div className="superhi-card">
              <div className="text-[12px] font-mono text-[#111118]/60 uppercase tracking-tight">Réseau</div>
              <div className="text-2xl font-normal text-[#2727e6] mt-1">3 Écoles</div>
              <div className="text-xs text-[#111118]/70 mt-1">INSAT • ESPRIT • IHEC</div>
            </div>
            <div className="superhi-card">
              <div className="text-[12px] font-mono text-[#111118]/60 uppercase tracking-tight">Soutenance</div>
              <div className="text-2xl font-normal text-[#111118] mt-1">15 Min</div>
              <div className="text-xs text-[#111118]/70 mt-1">Chronomètre & Slides</div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================================
          4. FEATURED SECTION WASH (SUPERHI SPEC: HI-YELLOW WASH #ffda00)
          Full-bleed background in #ffda00, 1200px container.
          Heading in Haas Grot Disp 42px #111118 left-aligned,
          with right-aligned 'See all content →' primary pill button at vertical center.
          ====================================================================== */}
      <section className="w-full bg-[#ffda00] text-[#111118] py-16 px-4 sm:px-6 lg:px-8 border-y border-[#111118]/10 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-2">
            <span className="superhi-tag bg-[#111118] text-[#ffffff] text-xs">
              ÉLIGIBILITÉ MINISTÉRIELLE TUNISIE
            </span>
            <h2
              className="text-3xl sm:text-[42px] font-normal leading-[1.1] tracking-[-0.378px]"
              style={{ fontFamily: "var(--font-haas-grot-disp)" }}
            >
              Auditez vos coûts d'infrastructure et obtenez votre label Startup Act.
            </h2>
            <p className="text-[18px] text-[#111118]/80 leading-snug">
              Ne laissez pas des dépenses cloud non maîtrisées disqualifier votre projet de fin d'études devant la commission de labellisation.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onOpenWorkspace()}
              className="superhi-btn-primary cursor-pointer"
            >
              <span>Lancer un audit complet</span>
              <span className="text-base font-normal">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================================
          5. INTERACTIVE SANDBOX SECTION (COGS SIMULATOR & MODELING)
          Pale-blue Chalk Blue canvas with interactive cards
          ====================================================================== */}
      <section id="audit-cogs" className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto relative">
        <SectionPaperCutComposition />
        <div className="relative z-10">
          <LandingFeatureShowcase
            lang={lang}
            theme="light"
            onOpenWorkspace={() => onOpenWorkspace()}
          />
        </div>
      </section>

      {/* ======================================================================
          6. MATCHMAKING & ECOSYSTEM SECTION
          ====================================================================== */}
      <section id="matchmaking" className="py-16 bg-[#ffffff] border-y border-[#e1edff]">
        <PfeStartupMatchmakingGraphic
          lang={lang}
          theme="light"
          onOpenWorkspace={() => onOpenWorkspace()}
        />
      </section>

      {/* ======================================================================
          7. COURSE / CATALOG CARD GRID (SUPERHI 3-COLUMN SPEC)
          White surface #ffffff, 24px border-radius, 1px border #e1edff, 24px padding.
          Title in Haas Grot Text 20px, meta line below in Martian Mono 12px.
          Hard offset shadow 0 2px 0 0 #111118.
          ====================================================================== */}
      <section id="norme-afnor" className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-12">
        <div className="space-y-3">
          <span className="superhi-tag text-xs">MODULES DE RECHERCHE</span>
          <h2
            className="text-3xl sm:text-[42px] font-normal tracking-[-0.378px] text-[#111118]"
            style={{ fontFamily: "var(--font-haas-grot-disp)" }}
          >
            Les six outils essentiels pour réussir votre mémoire et votre soutenance
          </h2>
          <p className="text-[18px] text-[#111118]/70 max-w-2xl font-normal">
            Développé spécifiquement pour répondre aux exigences académiques des universités tunisiennes et aux critères d'évaluation des jurys de PFE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Norme AFNOR */}
          <div className="superhi-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="superhi-tag text-xs">AFNOR NF Z 44-005</span>
              <span className="text-[12px] font-mono text-[#111118]/60">01</span>
            </div>
            <h3 className="text-[20px] font-normal text-[#111118] tracking-tight">
              Citations & Notes de bas de page
            </h3>
            <p className="text-[16px] text-[#111118]/70 leading-relaxed font-normal">
              Gestion automatique des règles Ibidem et Opere Citato. Mise en forme typographique rigoureuse de la bibliographie universitaire officielle.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenWorkspace()}
                className="text-[16px] text-[#2727e6] hover:underline flex items-center gap-1.5 font-normal cursor-pointer"
              >
                <span>Consulter les modèles</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 2: COGS Simulator */}
          <div className="superhi-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="superhi-tag text-xs bg-[#16ab59]/15 text-[#16ab59]">COGS &lt; 30%</span>
              <span className="text-[12px] font-mono text-[#111118]/60">02</span>
            </div>
            <h3 className="text-[20px] font-normal text-[#111118] tracking-tight">
              Audit des coûts d'infrastructure
            </h3>
            <p className="text-[16px] text-[#111118]/70 leading-relaxed font-normal">
              Projection précise des coûts cloud (AWS, bases de données, APIs) face aux revenus prévisionnels pour garantir la conformité légale.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenWorkspace()}
                className="text-[16px] text-[#2727e6] hover:underline flex items-center gap-1.5 font-normal cursor-pointer"
              >
                <span>Calculer le ratio</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 3: Matchmaking Carthage */}
          <div className="superhi-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="superhi-tag text-xs bg-[#91d8ec]/30 text-[#111118]">INSAT • IHEC</span>
              <span className="text-[12px] font-mono text-[#111118]/60">03</span>
            </div>
            <h3 className="text-[20px] font-normal text-[#111118] tracking-tight">
              Matchmaking Co-Fondateurs
            </h3>
            <p className="text-[16px] text-[#111118]/70 leading-relaxed font-normal">
              Associez un étudiant ingénieur en logiciel à un étudiant en finance ou marketing pour transformer votre sujet de recherche en entreprise.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenWorkspace()}
                className="text-[16px] text-[#2727e6] hover:underline flex items-center gap-1.5 font-normal cursor-pointer"
              >
                <span>Trouver un profil</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 4: Chronomètre Soutenance */}
          <div className="superhi-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="superhi-tag text-xs">JURY 15 MINUTES</span>
              <span className="text-[12px] font-mono text-[#111118]/60">04</span>
            </div>
            <h3 className="text-[20px] font-normal text-[#111118] tracking-tight">
              Simulateur de Soutenance
            </h3>
            <p className="text-[16px] text-[#111118]/70 leading-relaxed font-normal">
              Chronomètre calibré pour les 15 minutes d'évaluation avec distribution du temps de parole et fiches récapitulatives pour les questions du jury.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenWorkspace()}
                className="text-[16px] text-[#2727e6] hover:underline flex items-center gap-1.5 font-normal cursor-pointer"
              >
                <span>Configurer le chrono</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 5: Structure du Mémoire */}
          <div className="superhi-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="superhi-tag text-xs">GABARIT OFFICIEL</span>
              <span className="text-[12px] font-mono text-[#111118]/60">05</span>
            </div>
            <h3 className="text-[20px] font-normal text-[#111118] tracking-tight">
              Plan & Structure de Mémoire
            </h3>
            <p className="text-[16px] text-[#111118]/70 leading-relaxed font-normal">
              Organisation rigoureuse par chapitres : état de l'art, analyse des besoins, architecture logicielle, réalisation et métriques d'évaluation.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenWorkspace()}
                className="text-[16px] text-[#2727e6] hover:underline flex items-center gap-1.5 font-normal cursor-pointer"
              >
                <span>Ouvrir l'éditeur</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 6: Export Universitaire */}
          <div className="superhi-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="superhi-tag text-xs">PDF/A & DOCX</span>
              <span className="text-[12px] font-mono text-[#111118]/60">06</span>
            </div>
            <h3 className="text-[20px] font-normal text-[#111118] tracking-tight">
              Dépôt et Archivage Officiel
            </h3>
            <p className="text-[16px] text-[#111118]/70 leading-relaxed font-normal">
              Export conforme aux normes d'archivage pérenne des bibliothèques universitaires avec sommaire dynamique et table des figures.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenWorkspace()}
                className="text-[16px] text-[#2727e6] hover:underline flex items-center gap-1.5 font-normal cursor-pointer"
              >
                <span>Voir les formats d'export</span>
                <span>→</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================================
          8. FEATURED SECTION WASH (BUBBLEGUM PINK #ffbac4)
          Student Work & Real Project Showcases
          ====================================================================== */}
      <section className="w-full bg-[#ffbac4] text-[#111118] py-16 px-4 sm:px-6 lg:px-8 border-y border-[#111118]/10 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto space-y-8 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="superhi-tag bg-[#111118] text-[#ffffff] text-xs">
                PROJETS RÉCENTS LABELLISÉS
              </span>
              <h2
                className="text-3xl sm:text-[42px] font-normal leading-[1.1] tracking-[-0.378px] mt-2"
                style={{ fontFamily: "var(--font-haas-grot-disp)" }}
              >
                Ils ont transformé leur PFE en entreprise pérenne.
              </h2>
            </div>
            <button
              onClick={() => onOpenWorkspace()}
              className="superhi-btn-primary cursor-pointer shrink-0"
            >
              <span>Rejoindre la communauté</span>
              <span className="text-base font-normal">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            <div className="superhi-card space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Syrine Ben Amor"
                  className="w-12 h-12 rounded-full object-cover border border-[#e1edff]"
                />
                <div>
                  <div className="text-[16px] font-normal text-[#111118]">Syrine Ben Amor</div>
                  <div className="text-[12px] font-mono text-[#111118]/60">INSAT • PFE Fintech 2025</div>
                </div>
              </div>
              <p className="text-[16px] text-[#111118]/80 leading-relaxed font-normal">
                « En modélisant nos coûts de serveurs avec Scrivya, nous avons prouvé un ratio inférieur à 20%. Nous avons obtenu le label Startup Act dès notre premier passage devant le comité ministériel. »
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="superhi-tag text-xs bg-[#16ab59]/15 text-[#16ab59]">Label Obtenu</span>
                <span className="superhi-tag text-xs">Mention Très Bien</span>
              </div>
            </div>

            <div className="superhi-card space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="Mohamed Ali Trabelsi"
                  className="w-12 h-12 rounded-full object-cover border border-[#e1edff]"
                />
                <div>
                  <div className="text-[16px] font-normal text-[#111118]">Mohamed Ali Trabelsi</div>
                  <div className="text-[12px] font-mono text-[#111118]/60">IHEC Carthage • Co-fondateur</div>
                </div>
              </div>
              <p className="text-[16px] text-[#111118]/80 leading-relaxed font-normal">
                « Le matchmaking entre universités m'a permis de rencontrer mon associé technique à l'INSAT. Nous avons mené le PFE ensemble avec une vraie vision produit. »
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="superhi-tag text-xs bg-[#2727e6]/15 text-[#2727e6]">Trinôme INSAT x IHEC</span>
                <span className="superhi-tag text-xs">40k TND Pré-seed</span>
              </div>
            </div>

            <div className="superhi-card space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                  alt="Inès Karray"
                  className="w-12 h-12 rounded-full object-cover border border-[#e1edff]"
                />
                <div>
                  <div className="text-[16px] font-normal text-[#111118]">Inès Karray</div>
                  <div className="text-[12px] font-mono text-[#111118]/60">ESPRIT • Ingénierie Logicielle</div>
                </div>
              </div>
              <p className="text-[16px] text-[#111118]/80 leading-relaxed font-normal">
                « La conformité exacte aux normes AFNOR pour les notes de bas de page et la bibliographie a été soulignée par les membres du jury. Zéro remarque de forme. »
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="superhi-tag text-xs">AFNOR Conforme</span>
                <span className="superhi-tag text-xs">Félicitations du Jury</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================================
          9. FAQ ACCORDION SECTION
          Chalk Blue canvas, Paper White cards
          ====================================================================== */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-[800px] mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="superhi-tag text-xs">QUESTIONS FRÉQUENTES</span>
          <h2
            className="text-3xl sm:text-[40px] font-normal tracking-[-0.378px] text-[#111118]"
            style={{ fontFamily: "var(--font-haas-grot-disp)" }}
          >
            Tout ce qu'il faut savoir sur l'accompagnement PFE
          </h2>
          <p className="text-[16px] text-[#111118]/70 font-normal">
            Réponses concrètes sur les normes universitaires et le label Startup Act en Tunisie.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Qu'est-ce que la norme AFNOR NF Z 44-005 et pourquoi est-elle obligatoire ?",
              a: "C'est la norme officielle de présentation des citations et des références bibliographiques requise par la plupart des universités et écoles d'ingénieurs tunisiennes. Elle régit l'usage rigoureux d'Ibidem (Ibid.) et d'Opere Citato (Op. Cit.) pour garantir la rigueur académique du travail de recherche."
            },
            {
              q: "Pourquoi le seuil de coût d'infrastructure COGS < 30% est-il déterminant ?",
              a: "Pour obtenir le label d'État Startup Act en Tunisie, le modèle d'affaires doit démontrer une viabilité technologique réelle. Si vos dépenses d'hébergement ou de services cloud absorbent plus de 30% de vos revenus prévisionnels, le modèle économique est jugé fragile par la commission d'évaluation."
            },
            {
              q: "Comment fonctionne la mise en relation entre étudiants de différentes écoles ?",
              a: "Notre algorithme synchronise les calendriers de soutenance et met en correspondance les compétences d'ingénierie technique (INSAT, Sup'Com, ESPRIT) avec les compétences de stratégie business et financière (IHEC, TBS) pour monter un trinôme équilibré."
            },
            {
              q: "Puis-je exporter mon mémoire pour l'imprimerie universitaire ?",
              a: "Oui, la plateforme génère des fichiers PDF/A conformes aux normes d'impression et d'archivage des bibliothèques universitaires, ainsi qu'une version Word DOCX entièrement éditable."
            }
          ].map((faq, i) => (
            <div key={i} className="superhi-card p-5">
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full text-left flex items-center justify-between gap-4 font-normal text-[17px] text-[#111118] cursor-pointer"
              >
                <span>{faq.q}</span>
                {activeFaq === i ? (
                  <ChevronUp className="w-5 h-5 text-[#2727e6] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#111118]/50 shrink-0" />
                )}
              </button>
              {activeFaq === i && (
                <div className="pt-3 text-[16px] text-[#111118]/70 leading-relaxed border-t border-[#e1edff] mt-3 font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================================
          10. CONTACT / UNIVERSITY OUTREACH SECTION
          Input fields with 5000px radius, Electric Iris focus ring
          ====================================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[640px] mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="superhi-tag text-xs">CONTACT & PARTENARIATS</span>
          <h3
            className="text-2xl sm:text-3xl font-normal text-[#111118]"
            style={{ fontFamily: "var(--font-haas-grot-disp)" }}
          >
            Une question sur votre PFE ou votre université ?
          </h3>
          <p className="text-[16px] text-[#111118]/70 font-normal">
            Notre équipe répond rapidement aux étudiants, enseignants et encadrants.
          </p>
        </div>

        {contactSent ? (
          <div className="superhi-card p-6 bg-[#16ab59]/10 border-[#16ab59]/30 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#16ab59] text-white flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <div className="text-[18px] font-normal text-[#111118]">Message transmis avec succès !</div>
            <p className="text-sm text-[#111118]/70">Nous vous répondrons dans les plus brefs délais.</p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="superhi-card space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-[#111118]/70 mb-1.5 uppercase">
                  Nom et Prénom
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ahmed Sassi"
                  className="superhi-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#111118]/70 mb-1.5 uppercase">
                  Email Universitaire
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="ahmed.sassi@insat.u-carthage.tn"
                  className="superhi-input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#111118]/70 mb-1.5 uppercase">
                  Votre message
                </label>
                <textarea
                  rows={3}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Bonjour, nous préparons notre soutenance PFE à l'INSAT et souhaitons valider notre ratio d'infrastructure..."
                  className="w-full bg-[#f0f6ff] border border-[#e1edff] rounded-[16px] p-4 text-[#111118] font-normal text-sm outline-none focus:border-[#2727e6] focus:ring-2 focus:ring-[#2727e6] resize-none"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="superhi-btn-primary w-full cursor-pointer"
            >
              <span>Envoyer ma demande</span>
              <span className="text-base font-normal">→</span>
            </button>
          </form>
        )}
      </section>

      {/* ======================================================================
          11. FOOTER (SUPERHI SPEC: WHITE BG, 1PX #e1edff BORDER, 64PX HEIGHT)
          ====================================================================== */}
      <footer className="bg-[#ffffff] border-t border-[#e1edff] py-10 text-sm text-[#111118]/70">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2727e6] text-white flex items-center justify-center font-bold text-xs shadow-[0_2px_0_0_#111118]">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-normal text-[#111118] text-base">Scrivya PFE-Hub</span>
            <span className="text-[#111118]/30">•</span>
            <span className="text-xs font-mono">Conforme AFNOR NF Z 44-005 & Startup Act</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm">
            <a href="#norme-afnor" className="hover:underline">Norme AFNOR</a>
            <a href="#audit-cogs" className="hover:underline">Audit COGS</a>
            <a href="#matchmaking" className="hover:underline">Matchmaking</a>
            <a href="#faq" className="hover:underline">FAQ</a>
            <button
              onClick={() => onOpenWorkspace()}
              className="text-[#2727e6] hover:underline font-normal cursor-pointer"
            >
              Workspace
            </button>
          </div>

          <div className="text-xs font-mono text-[#111118]/50">
            © 2026 Scrivya • SuperHi Design System
          </div>
        </div>
      </footer>

      {/* ======================================================================
          12. COOKIE CONSENT BAR (SUPERHI SPEC)
          Fixed full-width bar at bottom of viewport. Fill #111118, padding 16px 24px,
          text #ffffff in Haas Grot Text 16px left-aligned with body copy.
          Right side: two pill buttons — ghost style reading 'Cookies essentiels'
          and dark pill (#000000 fill, white text, 48px radius) reading 'Accepter tout'.
          ====================================================================== */}
      {!cookieConsentDismissed && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#111118] text-[#ffffff] px-6 py-4 border-t border-[#ffffff]/10 shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
          <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[15px] sm:text-[16px] text-white/90 font-normal leading-snug">
              Nous utilisons uniquement des cookies essentiels nécessaires au fonctionnement de votre espace de travail et de votre mémoire.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setCookieConsentDismissed(true)}
                className="px-4 py-2 text-xs font-normal text-white bg-transparent border border-white/40 hover:border-white rounded-full transition-colors cursor-pointer"
              >
                Cookies essentiels
              </button>
              <button
                onClick={() => setCookieConsentDismissed(true)}
                className="px-5 py-2 text-xs font-normal text-white bg-[#000000] hover:bg-[#1a1a1a] rounded-full shadow-[0_2px_0_0_#2727e6] transition-all cursor-pointer"
              >
                Accepter tout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          AUTH MODAL DIALOG (SUPERHI LIGHT SPEC)
          ====================================================================== */}
      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111118]/60 backdrop-blur-xs">
          <div
            dir={dir}
            className="w-full max-w-md rounded-[24px] p-6 border border-[#e1edff] bg-[#ffffff] text-[#111118] shadow-[0_4px_0_0_#111118] relative font-sans"
          >
            <button
              onClick={() => {
                setAuthModal(null);
                setSuccessMsg(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#f0f6ff] text-[#111118]/60 hover:text-[#111118] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {successMsg ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-[#16ab59]/15 text-[#16ab59] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-normal text-[#111118]">{successMsg}</h3>
                <p className="text-sm text-[#111118]/60">Ouverture de votre espace de travail...</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-[#2727e6] text-white flex items-center justify-center text-xs font-bold">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-normal text-lg text-[#111118]">
                      {authModal === "login" ? "Connexion à Scrivya" : "Créer votre compte"}
                    </span>
                  </div>
                  <p className="text-sm text-[#111118]/60">
                    Accédez à vos mémoires, vos audits Startup Act et votre équipe.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full py-3 px-4 rounded-full bg-[#f0f6ff] border border-[#e1edff] hover:bg-[#e1edff] text-[#111118] text-sm font-normal transition-colors cursor-pointer flex items-center justify-center gap-2.5"
                >
                  <GoogleIcon className="w-4 h-4" />
                  <span>Continuer avec votre compte Google</span>
                </button>

                <div className="flex items-center gap-3 text-[11px] font-mono text-[#111118]/40">
                  <div className="flex-1 h-px bg-[#e1edff]"></div>
                  <span>OU AVEC VOTRE EMAIL UNIVERSITAIRE</span>
                  <div className="flex-1 h-px bg-[#e1edff]"></div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-[#111118]/70 mb-1">Email universitaire</label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="etudiant@insat.u-carthage.tn"
                      className="superhi-input w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#111118]/70 mb-1">Nom & Prénom</label>
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Ahmed Nefzi"
                      className="superhi-input w-full text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#111118]/70 mb-1">Établissement / École</label>
                    <input
                      type="text"
                      value={authInstitution}
                      onChange={(e) => setAuthInstitution(e.target.value)}
                      placeholder="INSAT / ESPRIT / IHEC"
                      className="superhi-input w-full text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="superhi-btn-primary w-full cursor-pointer text-sm mt-3"
                  >
                    <span>{authModal === "login" ? "Se connecter" : "Ouvrir mon espace"}</span>
                    <span className="text-base font-normal">→</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
