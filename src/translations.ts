export interface TranslationSet {
  navAbout: string;
  navWho: string;
  navServices: string;
  navTarifs: string;
  navWhyUs: string;
  navContact: string;
  navFreeTrial: string;
  navLogin: string;
  navSignup: string;
  navLogout: string;
  navWelcome: string;

  heroTagline: string;
  heroTitle: string;
  heroText1: string;
  heroText2: string;
  heroCtaGenerate: string;
  heroCtaWho: string;
  heroStudents: string;
  heroStudentsSub: string;
  heroConformity: string;
  heroConformitySub: string;
  heroEfficiency: string;
  heroEfficiencySub: string;
  heroPlagiat: string;
  heroPlagiatSub: string;
  heroQuote: string;
  heroAuthor: string;

  audienceTagline: string;
  audienceTitle: string;
  audienceDesc: string;
  audienceIntro1: string;
  audienceIntro2: string;
  audienceSectionTitle: string;
  audiencePfe: string;
  audiencePfeBadge: string;
  audiencePfeDesc: string;
  audiencePfa: string;
  audiencePfaBadge: string;
  audiencePfaDesc: string;
  audienceMemoir: string;
  audienceMemoirBadge: string;
  audienceMemoirDesc: string;
  audienceSpec: string;
  audienceSpecBadge: string;
  audienceSpecDesc: string;
  audienceMore: string;

  audDetailPfeTag: string;
  audDetailPfeTitle: string;
  audDetailPfeDesc: string;
  audDetailPfeCheck1: string;
  audDetailPfeCheck2: string;
  audDetailPfeCheck3: string;
  audDetailPfeModelTitle: string;
  audDetailPfePart1: string;
  audDetailPfePart2: string;
  audDetailPfePart3: string;
  audDetailPfeTip: string;

  audDetailPfaTag: string;
  audDetailPfaTitle: string;
  audDetailPfaDesc: string;
  audDetailPfaCheck1: string;
  audDetailPfaCheck2: string;
  audDetailPfaCheck3: string;
  audDetailPfaModelTitle: string;
  audDetailPfaPart1: string;
  audDetailPfaPart2: string;
  audDetailPfaPart3: string;
  audDetailPfaTip: string;

  audDetailMemoirTag: string;
  audDetailMemoirTitle: string;
  audDetailMemoirDesc: string;
  audDetailMemoirCheck1: string;
  audDetailMemoirCheck2: string;
  audDetailMemoirCheck3: string;
  audDetailMemoirModelTitle: string;
  audDetailMemoirPart1: string;
  audDetailMemoirPart2: string;
  audDetailMemoirPart3: string;
  audDetailMemoirTip: string;

  audDetailSpecTag: string;
  audDetailSpecTitle: string;
  audDetailSpecDesc: string;
  audDetailSpecCheck1: string;
  audDetailSpecCheck2: string;
  audDetailSpecCheck3: string;
  audDetailSpecModelTitle: string;
  audDetailSpecPart1: string;
  audDetailSpecPart2: string;
  audDetailSpecPart3: string;
  audDetailSpecTip: string;

  servicesTagline: string;
  servicesTitle: string;
  servicesDesc: string;

  whyTagline: string;
  whyTitle: string;
  whyDesc: string;
  whyNativeSuccess: string;

  tarifsTagline: string;
  tarifsTitle: string;
  tarifsDesc: string;
  tarifPopular: string;
  tarifPerDoc: string;
  tarifChoosePlan: string;
  tarifFeatures: string;
  tarifPfaName: string;
  tarifPfaPrice: string;
  tarifPfaLimit: string;
  tarifPfeName: string;
  tarifPfePrice: string;
  tarifPfeLimit: string;
  tarifMasterName: string;
  tarifMasterPrice: string;
  tarifMasterLimit: string;
  tarifSpecName: string;
  tarifSpecPrice: string;
  tarifSpecLimit: string;

  faqTagline: string;
  faqTitle: string;
  faqDesc: string;

  contactTagline: string;
  contactTitle: string;
  contactDesc: string;
  contactEmail: string;
  contactPhone: string;
  contactHeadquarters: string;
  contactStatusActive: string;

  lblLoginForm: string;
  lblSignupForm: string;
  lblEmailAddress: string;
  lblPassword: string;
  lblFullName: string;
  lblInstitution: string;
  lblCreateAccount: string;
  lblAlreadyHaveAccount: string;
  lblDontHaveAccount: string;
  lblSubmitConnexion: string;
  lblRememberMe: string;
  lblClose: string;
}

export const translations: { [key in "fr" | "en" | "ar"]: TranslationSet } = {
  fr: {
    navAbout: "Qui sommes-nous ?",
    navWho: "Pour qui ?",
    navServices: "Nos services",
    navTarifs: "Tarifs en TND",
    navWhyUs: "Pourquoi choisir Scrivya ?",
    navContact: "Contactez-nous",
    navFreeTrial: "Essai Gratuit",
    navLogin: "Connexion",
    navSignup: "S'inscrire",
    navLogout: "Déconnexion",
    navWelcome: "Bonjour",

    heroTagline: "L'Élégance de l'Excellence Académique",
    heroTitle: "De la recherche à la rédaction, Scrivya mène chaque projet à sa conclusion avec brio.",
    heroText1: "Vous galérez à maîtriser les normes AFNOR et toutes leurs technicités ? Vous Passer des heures à chercher des sources ? Craindre le plagiat à chaque paragraphe rédigé ? Perdre du temps sur les tâches techniques et répétitives ? Configurer une mise en page conforme aux exigences universitaires ?",
    heroText2: "Rédiger un mémoire exige une technicité rarement enseignée. Scrivya a été conçu pour prendre en charge cette complexité pour vous",
    heroCtaGenerate: "Générer mon kit de recherche",
    heroCtaWho: "Pour qui est-ce fait ?",
    heroStudents: "+15k",
    heroStudentsSub: "Étudiants formés",
    heroConformity: "99%",
    heroConformitySub: "Conformité Normée",
    heroEfficiency: "Gain ×5",
    heroEfficiencySub: "Efficacité de mise en forme",
    heroPlagiat: "0%",
    heroPlagiatSub: "Plagiat",
    heroQuote: "Scrivya a totalement restructuré ma méthodologie. La bibliographie et les citations AFNOR de mon projet se sont faites d'un seul clic !",
    heroAuthor: "Meriem K., Étudiante en Ingénierie",

    audienceTagline: "",
    audienceTitle: "Ce n’est pas seulement fait pour un mémoire.",
    audienceDesc: "Scrivya est le premier outil universel d'ingénierie rédactionnelle adapté au cadre universitaire tunisien et international. Il configure scientifiquement tous vos formats d’évaluation :",
    audienceIntro1: "Scrivya est conçu pour accompagner chaque étudiant dans son parcours, quelle que soit sa discipline, son niveau ou son institution.",
    audienceIntro2: "Scrivya s'adapte à chaque exigence académique et transforme chaque étape de travail en résultat soigné et professionnel.",
    audienceSectionTitle: "Travaux pris en charge :",
    audiencePfe: "Le PFE",
    audiencePfeBadge: "Ingénieur / Pro",
    audiencePfeDesc: "Excellent pour modéliser le cahier des charges, cadrer l'architecture de données, formater des diagrammes de cas d'utilisation et compiler l'état de l'art.",
    audiencePfa: "Le PFA",
    audiencePfaBadge: "Initiation",
    audiencePfaDesc: "Parfait pour cadrer une problématique préliminaire rapidement, reformuler des textes et organiser une bibliographie simple d'études.",
    audienceMemoir: "Mémoires, thèses, séminaires et articles académiques",
    audienceMemoirBadge: "Standard",
    audienceMemoirDesc: "Scrivya prend en charge votre mémoire dans son intégralité : rédaction complète ou reformulation humanisée – à vous de choisir. À Scrivya de livrer. Une rédaction sans plagiat, une bibliographie solide aux références vérifiées, le tout structuré selon les exigences strictes de la norme AFNOR NF Z 44-005.",
    audienceSpec: "Spécialité",
    audienceSpecBadge: "Expertise",
    audienceSpecDesc: "Pour les spécialités médicales, thèses d'architecture, revues de jurisprudence complexes ou d'économie avec traitement de données approfondi.",
    audienceMore: "En savoir plus",

    audDetailPfeTag: "Focus PFE & Méthodologie d'Ingénieur",
    audDetailPfeTitle: "L'Assistance Optimale pour les Ingénieurs & Managers",
    audDetailPfeDesc: "Les mémoires de fin d'études technologiques exigent une structure différente des mémoires littéraires. Scrivya vous guide pour formuler des analyses précises de l'état de l'art technologique, documenter les tests unitaires, aligner les livrables d'implémentation, et automatiser les renvois vers les diagrammes d'architecture.",
    audDetailPfeCheck1: "Restructuration de rapport de projet de fin d'études",
    audDetailPfeCheck2: "Vérification de cohérence d'implémentation de solutions",
    audDetailPfeCheck3: "Citation rapide des référentiels techniques ou normes ISO",
    audDetailPfeModelTitle: "📂 Modèle PFE Typique",
    audDetailPfePart1: "Partie I : Étude préliminaire de la problématique et de l'existant",
    audDetailPfePart2: "Partie II : Conception générale, architecture fonctionnelle et technique",
    audDetailPfePart3: "Partie III : Réalisation, tests de validation et intégration DevOps",
    audDetailPfeTip: "Avec Scrivya, vos frameworks méthodologiques (UML, Scrum, Merise) sont intégrés avec perfection.",

    audDetailPfaTag: "Format Initiation PFA",
    audDetailPfaTitle: "Un Rapport d’Avancement Structuré sans Contretemps",
    audDetailPfaDesc: "Pour vos Projets de Fin d'Année, Scrivya met en place une interface de co-écriture accessible permettant d'obtenir un squelette ordonné d'introduction, de problématique et de bibliographie initiale. Idéal pour présenter des travaux clairs et percutants à vos encadrants académiques sans anxiété.",
    audDetailPfaCheck1: "Génération rapide de plans de recherches intermédiaires",
    audDetailPfaCheck2: "Échelonnage chronologique simple du flux de travail universitaire",
    audDetailPfaCheck3: "Intégration de bibliographie multi-sources accélérée",
    audDetailPfaModelTitle: "📂 Modèle PFA Typique",
    audDetailPfaPart1: "Introduction : Objectifs de l'étude thématique",
    audDetailPfaPart2: "Cœur du rapport : Analyse corrélative et résultats observés",
    audDetailPfaPart3: "Conclusion : Bilan d'apprentissage et perspectives d'extension",
    audDetailPfaTip: "Un boost d'accélération pour vos rapports de licence de 1ère et 2ème année.",

    audDetailMemoirTag: "Standard Universitaire AFNOR",
    audDetailMemoirTitle: "Maîtrise totale du Mémoire de Master",
    audDetailMemoirDesc: "Scrivya répond à 100% aux exigences typographiques françaises et francophones prescrites par l'AFNOR (NF Z 44-005). De la structure ordonnée des chapitres à la rédaction d'analyses approfondies intégrant les notes de bas de page latines (Ibid., op.cit.), l'outil gère rigoureusement chaque aspect technique.",
    audDetailMemoirCheck1: "Intégration stricte des notes de bas de page",
    audDetailMemoirCheck2: "Harmonisation des capitales d'auteurs dans la bibliographie",
    audDetailMemoirCheck3: "Indexation de table des matières avec liens directs fonctionnels",
    audDetailMemoirModelTitle: "📂 Modèle Mémoire de Master",
    audDetailMemoirPart1: "Partie I : Approche doctrinale et revue de littérature scientifique",
    audDetailMemoirPart2: "Partie II : Analyse comparative et cadre d'analyse empirique",
    audDetailMemoirPart3: "Partie III : Recommandations managériales / scientifiques de l'auteur",
    audDetailMemoirTip: "Idéal pour les universités de sciences humaines, droit, économie et commerce.",

    audDetailSpecTag: "Haute Recherche & Thèses de Spécialité",
    audDetailSpecTitle: "Toute l'Ergonomie pour les Thèses complexes",
    audDetailSpecDesc: "Les thèses de doctorat, rapports de recherche médicale clinique ou analyses jurisprudentielles exigent un niveau de détail scientifique maximal. Scrivya intègre des modules de traitement de listes volumineuses d'abréviations techniques, de thésaurus médicaux ou d'index des notions clés ainsi qu'une bibliographie de référence élargie.",
    audDetailSpecCheck1: "Index d'équations mathématiques ou juridiques complexes",
    audDetailSpecCheck2: "Alignement avec les protocoles internationaux majeurs (Vancouver, APA, AFNOR)",
    audDetailSpecCheck3: "Discours et diapositives de soutenance finale",
    audDetailSpecModelTitle: "📂 Modèle Thèse & Spécialité médicale",
    audDetailSpecPart1: "Introduction : Cadre physiopathologique & épidémiologique",
    audDetailSpecPart2: "Cœur : Recueil d'observations et exploitation clinique des dossiers",
    audDetailSpecPart3: "Synthèse : Discussion comparative par rapport aux référents mondiaux",
    audDetailSpecTip: "Un accompagnement à la rigueur scientifique internationale sans compromis.",

    servicesTagline: "Architectures de Services Deployées",
    servicesTitle: "Découvrez la Palette de Fonctionnalités de Scrivya",
    servicesDesc: "Cliquez pour déplier instantanément les services détaillés pour le type de projet académique correspondant et visualiser les outils d'aide appliqués.",

    whyTagline: "Aligné sur vos enjeux réels",
    whyTitle: "Pourquoi Choisir Scrivya pour vos Travaux ?",
    whyDesc: "Vos difficultés de rédaction sont résolues chirurgicalement. Découvrez comment l'interface de Scrivya automatise les aspects chronophages des grilles académiques :",
    whyNativeSuccess: "Pris en charge nativement dans l'interface de Scrivya",

    tarifsTagline: "Plans Budgétaires Clairs & Accessibles",
    tarifsTitle: "Tarifs en TND",
    tarifsDesc: "Un investissement mesuré et transparent pour garantir une réussite universitaire éclatante sans aucun stress rédactionnel typographique.",
    tarifPopular: "Populaire",
    tarifPerDoc: "par document",
    tarifChoosePlan: "Choisir ce plan",
    tarifFeatures: "Fonctionnalités incluses :",
    tarifPfaName: "Licence / PFA",
    tarifPfaPrice: "49 TND",
    tarifPfaLimit: "Jusqu'à 30 pages",
    tarifPfeName: "Ingénieur / PFE",
    tarifPfePrice: "89 TND",
    tarifPfeLimit: "Jusqu'à 70 pages",
    tarifMasterName: "Master / Mastère",
    tarifMasterPrice: "149 TND",
    tarifMasterLimit: "Jusqu'à 120 pages",
    tarifSpecName: "Doctorat / Thèse",
    tarifSpecPrice: "249 TND",
    tarifSpecLimit: "Pages illimitées",

    faqTagline: "Réponses Immédiates & Cadrées",
    faqTitle: "Foire Aux Questions Universitaires",
    faqDesc: "Toutes les clés pour comprendre comment Scrivya révolutionne l'ingénierie méthodologique en Tunisie.",

    contactTagline: "Une assistance directe & réactive",
    contactTitle: "Une Question ? Échangeons Ensemble",
    contactDesc: "Nous disposons d'interlocuteurs basés à Tunis formés rigoureusement aux normes de présentation des principales facultés (ENIT, INSAT, IHEC, FST, TBS, SUP'COM, etc.) pour vous conseiller de façon fiable.",
    contactEmail: "Adresse e-mail",
    contactPhone: "Support Téléphone",
    contactHeadquarters: "Siège social",
    contactStatusActive: "En ligne. Nos conseillers universitaires répondent en moins de 15 minutes.",

    lblLoginForm: "Connectez-vous à votre espace Scrivya",
    lblSignupForm: "Créez votre compte Scrivya",
    lblEmailAddress: "Adresse e-mail",
    lblPassword: "Mot de passe",
    lblFullName: "Nom complet",
    lblInstitution: "Institution / Université",
    lblCreateAccount: "Créer le compte",
    lblAlreadyHaveAccount: "Déjà un compte ? Connectez-vous",
    lblDontHaveAccount: "Pas encore de compte ? S'inscrire",
    lblSubmitConnexion: "Se connecter",
    lblRememberMe: "Se souvenir de moi",
    lblClose: "Fermer",
  },
  en: {
    navAbout: "Who are we?",
    navWho: "For whom?",
    navServices: "Our services",
    navTarifs: "Pricing in TND",
    navWhyUs: "Why Scrivya?",
    navContact: "Contact Us",
    navFreeTrial: "Free Trial",
    navLogin: "Login",
    navSignup: "Sign Up",
    navLogout: "Logout",
    navWelcome: "Hello",

    heroTagline: "The Elegance of Academic Excellence",
    heroTitle: "Delegate your university formatting duties. Succeed brilliantly.",
    heroText1: "Struggling to master strict layout guidelines requested by your university? Spending sleepless nights ordering complex references or worrying about accidental plagiarism?",
    heroText2: "Scrivya automates all technical complexity so you can focus entirely on your core intellectual research.",
    heroCtaGenerate: "Generate research kit",
    heroCtaWho: "Who is it for?",
    heroStudents: "+15k",
    heroStudentsSub: "Students assisted",
    heroConformity: "99%",
    heroConformitySub: "Strict Standards Compliant",
    heroEfficiency: "Gain ×5",
    heroEfficiencySub: "Formatting efficiency",
    heroPlagiat: "0%",
    heroPlagiatSub: "Plagiarism",
    heroQuote: "Scrivya completely re-energized my workflow. The bibliography and AFNOR/APA citations for my thesis were compiled in a single click!",
    heroAuthor: "Meriem K., Engineering Graduate",

    audienceTagline: "",
    audienceTitle: "It's not just made for standard research papers.",
    audienceDesc: "Scrivya is the first premium formatting and styling engine adapted to national and international college guidelines. It structures all your academic documents:",
    audienceIntro1: "Scrivya is designed to accompany every student on their journey, regardless of their discipline, level, or institution.",
    audienceIntro2: "Scrivya adapts to every academic requirement and transforms each step of work into a polished, professional result.",
    audienceSectionTitle: "Supported academic works:",
    audiencePfe: "PFE",
    audiencePfeBadge: "Engineering / Pro",
    audiencePfeDesc: "Superb for modelling your systems specifications, data design, creating high-level functional diagrams and reviewing literature art.",
    audiencePfa: "PFA",
    audiencePfaBadge: "Introductory",
    audiencePfaDesc: "Excellent for quick formulation of research questions, rephrasing bulky slides and arranging basic academic references.",
    audienceMemoir: "Master's Thesis, Seminars and Academic Papers",
    audienceMemoirBadge: "Standard",
    audienceMemoirDesc: "Scrivya supports your entire thesis from start to finish: full writing or humanized rewriting – the choice is yours. Scrivya delivers. A plagiarism-free writing, a robust bibliography with verified references, all structured under the strict requirements of the AFNOR NF Z 44-005 standard.",
    audienceSpec: "Specialties",
    audienceSpecBadge: "Advanced",
    audienceSpecDesc: "Built for clinical medical theses, architectural blueprints, complex juridical reviews, or quantitative statistics with code blocks.",
    audienceMore: "Read more",

    audDetailPfeTag: "PFE Focus & Engineering Best Practice",
    audDetailPfeTitle: "Premium Workflow for Engineers & Business Majors",
    audDetailPfeDesc: "Scientific or technological graduation theses demand visual structure and systematic layouts. Scrivya supports documentation of unit testing, system wireframes illustration frameworks, database modeling, and reference architecture diagram formatting.",
    audDetailPfeCheck1: "Professional restructuring of technological reports",
    audDetailPfeCheck2: "Validation and synthesis of your solution frameworks",
    audDetailPfeCheck3: "Quick references formatting for global ISO and technical codes",
    audDetailPfeModelTitle: "📂 Classic PFE Document Model",
    audDetailPfePart1: "Chapter I: Preliminary study, existing systems and requirement lists",
    audDetailPfePart2: "Chapter II: Global design, technical & functional services architecture",
    audDetailPfePart3: "Chapter III: System implementation, unit test suites and deployment pipelines",
    audDetailPfeTip: "With Scrivya, your modelling methodologies (UML, Scrum, DevOps) are flawlessly formatted.",

    audDetailPfaTag: "Introductory Project (PFA)",
    audDetailPfaTitle: "Structured Progress Reports Made Easy",
    audDetailPfaDesc: "For End-of-Year reports, Scrivya provides an intuitive editing dashboard to produce a clean skeleton of introduction, core questions, and preliminary bibliography. Make a great impression on your supervisors without stress.",
    audDetailPfaCheck1: "Fast formulation of research questions and outlines",
    audDetailPfaCheck2: "Simple chronological planning for college coursework submissions",
    audDetailPfaCheck3: "Accelerated cross-referencing for multidimensional source files",
    audDetailPfaModelTitle: "📂 Classic PFA Document Model",
    audDetailPfaPart1: "Introduction: Objectives and background of research context",
    audDetailPfaPart2: "Core Section: Primary analysis and observed outcomes",
    audDetailPfaPart3: "Conclusion: Feedback, lessons learned and pathways for extension",
    audDetailPfaTip: "A powerful boost for your first and second-year college reports.",

    audDetailMemoirTag: "Official AFNOR Standard",
    audDetailMemoirTitle: "Total Mastery of your Master's Thesis",
    audDetailMemoirDesc: "Scrivya fully adheres to premium European academic standards (such as AFNOR / NF Z 44-005). From beautiful chapter hierarchies to elegant footnote rendering using Latin notation (Ibid., op.cit.), the engine handles every formatting criteria.",
    audDetailMemoirCheck1: "Strict and context-aware footnote indexing",
    audDetailMemoirCheck2: "Automated capitalization and styling of publishing houses and authors",
    audDetailMemoirCheck3: "Dynamic Table of Contents generation with clickable bookmarks",
    audDetailMemoirModelTitle: "📂 Classic Master's Document Model",
    audDetailMemoirPart1: "Part I: Theoretical framework and state-of-the-art literature review",
    audDetailMemoirPart2: "Part/ II: Comparative analysis and empirical methodology",
    audDetailMemoirPart3: "Part III: Strategic recommendations and future horizons",
    audDetailMemoirTip: "Perfect for humanities, psychology, law, economics, and business school guidelines.",

    audDetailSpecTag: "High Research & Doctoral Dissertations",
    audDetailSpecTitle: "Precision Tools for Advanced Academic Manuscripts",
    audDetailSpecDesc: "Doctoral dissertations, complex medical reports, and comprehensive law journals require absolute academic precision. Scrivya manages long-form document formats, dynamic tables of abbreviations, glossaries, custom symbols, and extended reference lists.",
    audDetailSpecCheck1: "Beautiful styling of mathematical and legal equations",
    audDetailSpecCheck2: "Seamless toggling of citations standards (APA, Vancouver, AFNOR, IEEE)",
    audDetailSpecCheck3: "Script structures and presentation guides for oral defense slide-decks",
    audDetailSpecModelTitle: "📂 Advanced Medical / Doctoral Model",
    audDetailSpecPart1: "Introduction: Background, epidemiology and physiopathology review",
    audDetailSpecPart2: "Core: Data collection, clinical observation logs and statistical modeling",
    audDetailSpecPart3: "Discussion: Cross-examination against global reference frameworks",
    audDetailSpecTip: "Step-by-step assistance for world-class, rigorous scientific contributions.",

    servicesTagline: "Scientific Services Matrix",
    servicesTitle: "Scrivya's Premium Feature Suite",
    servicesDesc: "Tap to review detailed formatting tools configured for each academic document standard and inspect our automated modules.",

    whyTagline: "Formulated for real world compliance",
    whyTitle: "Why Use Scrivya for your Assignments?",
    whyDesc: "Eliminate academic layout nightmares instantly. See how the Scrivya workspace automates high-fidelity elements for you:",
    whyNativeSuccess: "Managed natively inside the Scrivya platform",

    tarifsTagline: "Transparent, Adaptive Pricing",
    tarifsTitle: "Tarifs in TND",
    tarifsDesc: "A straightforward investment to secure academic peace of mind and bulletproof formatting.",
    tarifPopular: "Popular",
    tarifPerDoc: "per document",
    tarifChoosePlan: "Select plan",
    tarifFeatures: "All features included:",
    tarifPfaName: "Licence / PFA",
    tarifPfaPrice: "49 TND",
    tarifPfaLimit: "Up to 30 pages",
    tarifPfeName: "Engineering / PFE",
    tarifPfePrice: "89 TND",
    tarifPfeLimit: "Up to 70 pages",
    tarifMasterName: "Master's Thesis",
    tarifMasterPrice: "149 TND",
    tarifMasterLimit: "Up to 120 pages",
    tarifSpecName: "Doctoral Dissertation",
    tarifSpecPrice: "249 TND",
    tarifSpecLimit: "Unlimited pages",

    faqTagline: "Instant Clear Guidance",
    faqTitle: "Academic Frequently Asked Questions",
    faqDesc: "Everything you need to know about how Scrivya is changing academic workflows in North Africa and beyond.",

    contactTagline: "Direct & Responsive Feedback",
    contactTitle: "Need Assistance? Let's Connect",
    contactDesc: "Our specialist teams are fully familiar with the presentation protocols of national scale faculties (INSAT, ENIT, IHEC, TBS, FST, SUP'COM, etc.) to guarantee swift, accurate advice.",
    contactEmail: "Email Address",
    contactPhone: "Telephone Support",
    contactHeadquarters: "Headquarters",
    contactStatusActive: "Online. Academic advisors respond within 15 minutes.",

    lblLoginForm: "Log in to your Scrivya Space",
    lblSignupForm: "Create your Scrivya account",
    lblEmailAddress: "Email Address",
    lblPassword: "Password",
    lblFullName: "Full Name",
    lblInstitution: "Institution / University",
    lblCreateAccount: "Create account",
    lblAlreadyHaveAccount: "Already have an account? Login",
    lblDontHaveAccount: "Don't have an account? Sign Up",
    lblSubmitConnexion: "Log In",
    lblRememberMe: "Remember me",
    lblClose: "Close",
  },
  ar: {
    navAbout: "من نحن؟",
    navWho: "لمن؟",
    navServices: "خدماتنا",
    navTarifs: "الأسعار بالدينار التونسي",
    navWhyUs: "لماذا سكريفيا (Scrivya)؟",
    navContact: "اتصل بنا",
    navFreeTrial: "تجربة مجانية",
    navLogin: "تسجيل الدخول",
    navSignup: "إنشاء حساب",
    navLogout: "تسجيل الخروج",
    navWelcome: "مرحباً",

    heroTagline: "رفقة التميز وعلو الشأن الأكاديمي",
    heroTitle: "فوض عناء التنسيق الجامعي لسكريفيا (Scrivya). واحصُد ثمار نجاحك الباهر.",
    heroText1: "هل تواجه صعوبة في التحكم في متطلبات التنسيق التي تفرضها جامعتك؟ هل تقضي ليالي شاقة في ترتيب الهوامش والمراجع الأكاديمية وصياغة قائمة المصادر؟",
    heroText2: "سكريفيا (Scrivya) تأخذ على عاتقها كل التعقيدات الفنية والتنسيقية لتمنحك الفرصة للتركيز الكامل على رفعة وجودة بحثك العلمي.",
    heroCtaGenerate: "توليد حقيبة البحث الخاصة بي",
    heroCtaWho: "لمن تم تصميم المنصة؟",
    heroStudents: "+15 ألف",
    heroStudentsSub: "طالب تمت مساعدتهم",
    heroConformity: "99%",
    heroConformitySub: "التزام كامل بالمعايير",
    heroEfficiency: "توفير خمسة أضعاف الوقت",
    heroEfficiencySub: "كفاءة مطلقة في الترتيب",
    heroPlagiat: "0%",
    heroPlagiatSub: "نسبة الاقتباس",
    heroQuote: "لقد غيّرت سكريفيا (Scrivya) طريقتي بالكامل في إعداد المشروع. المراجع الأكاديمية وهوامش الصفحة تترترب بمجرد نقرة واحدة!",
    heroAuthor: "مريم ك.، طالبة هندسة ومستشارة تكنولوجيا",

    audienceTagline: "",
    audienceTitle: "ليست مخصصة فقط للأطروحات التقليدية.",
    audienceDesc: "سكريفيا (Scrivya) هي المنصة الراقية والأولى من نوعها المهيأة خصيصاً على معايير الجامعات التونسية والدولية لتصنيف وتنسيق ملفاتكم الأكاديمية:",
    audienceIntro1: "تم تصميم سكريفيا (Scrivya) لمرافقة كل طالب في مسيرته، بغض النظر عن تخصصه أو مستواه أو مؤسسته الأكاديمية.",
    audienceIntro2: "تتكيف سكريفيا (Scrivya) مع كل المتطلبات الأكاديمية وتحوّل كل مرحلة عمل إلى نتيجة دقيقة ومحترفة.",
    audienceSectionTitle: "المشاريع والرسائل المدعومة :",
    audiencePfe: "مشروع التخرج PFE",
    audiencePfeBadge: "هندسة / مهني",
    audiencePfeDesc: "مثالي لصياغة الشروط الفنية، هيكلة بنية البيانات، تنسيق نماذج حالات الاستخدام وجمع المراجع التقنية بكفاءة.",
    audiencePfa: "مشروع نهاية السنة PFA",
    audiencePfaBadge: "مبتدئ / تمهيدي",
    audiencePfaDesc: "رائع للتحديد السريع للأسئلة المبدئية، صياغة أهداف الدراسة، وترتيب قائمة المراجع والمصادر الأولية.",
    audienceMemoir: "الأطروحات، الرسائل الجامعية، الندوات والأوراق الأكاديمية",
    audienceMemoirBadge: "أساسي",
    audienceMemoirDesc: "تتكفل سكريفيا بكافة تفاصيل رسالتك أو أطروحتك: بدءًا من الكتابة الكاملة أو إعادة الصياغة الإنسانية الاحترافية - الخيار لك والمهمة لسكريفيا. كتابة خالية من الاقتباس والسرقة الأدبية، قائمة مراجع رصينة مصدق عليها، مهيكلة وفقًا للاشتراطات الصارمة لمعايير AFNOR NF Z 44-005.",
    audienceSpec: "الأبحاث المتقدمة",
    audienceSpecBadge: "خبير",
    audienceSpecDesc: "لأطروحات الطب والعلوم الدقيقة، أبحاث القانون والعلوم الإدارية مع التحليل الإحصائي للبيانات وحزم الأكواد البرمجية.",
    audienceMore: "اكتشف المزيد",

    audDetailPfeTag: "مشاريع التخرج ومنهجيات الهندسة الفنية",
    audDetailPfeTitle: "الدعم الأمثل للمهندسين والمديرين",
    audDetailPfeDesc: "الأطروحات والمشاريع العلمية والتكنولوجية تتطلب بنية عرض متخصصة تختلف كلياً عن الأدبيات. تساعدك سكريفيا (Scrivya) في صياغة مراجعات دقيقة لأحدث ما توصل إليه العلم، وتوثيق اختبارات الأنظمة، وترقية تمثيل المخططات والهندسة الفنية.",
    audDetailPfeCheck1: "إعادة تنظيم تقارير مشاريع الهندسة المتقدمة بمهنية",
    audDetailPfeCheck2: "التحقق والدمج المنهجي لحلول تكنولوجيا المعلومات",
    audDetailPfeCheck3: "تنسيق مراجع المعايير الدولية والتقارير التنظيمية ISO",
    audDetailPfeModelTitle: "📂 الهيكل الكلاسيكي لمشروع التخرج (PFE)",
    audDetailPfePart1: "الباب الأول: الدراسة التمهيدية، تحليل الأنظمة القائمة وتحديد الشروط والمواصفات",
    audDetailPfePart2: "الباب الثاني: التصميم العام للحلول، وهيكلية الخدمات الفنية والتصميم الوظيفي",
    audDetailPfePart3: "الباب الثالث: التنفيذ والتطبيق العملي، حزم اختبارات الجودة وعمليات النشر المتكاملة",
    audDetailPfeTip: "بفضل سكريفيا (Scrivya)، يتم تصنيف وتطبيق منهجيات النمذجة وإدارة المشاريع (UML, Scrum) بكل سلاسة وسهولة.",

    audDetailPfaTag: "مشروع نهاية السنة (PFA)",
    audDetailPfaTitle: "تقارير مرحلية متناسقة دون مجهود",
    audDetailPfaDesc: "لمشاريع وبحوث نهاية السنة الجامعية، سكريفيا (Scrivya) تمنحكم واجهة تحرير غاية في السهولة لتحديد مقدمة الموضوع وسياق المشكلة وقائمة مراجع أولية منسقة للبدء بقوة.",
    audDetailPfaCheck1: "التحضير السريع لفرضيات البحث وخطة العمل التمهيدية",
    audDetailPfaCheck2: "جدولة زمنية واضحة لإنجاز مهام مشروع التخرج الجامعي",
    audDetailPfaCheck3: "تنظيم سريع وقوي لمطابقة المصادر المتنوعة والمقالات العلمية",
    audDetailPfaModelTitle: "📂 الهيكل الكلاسيكي لمشروع نهاية السنة (PFA)",
    audDetailPfaPart1: "المقدمة: غايات الدراسة والمنطلقات العامة للبحث والتحليل",
    audDetailPfaPart2: "هيكل التقرير الرئيسي: التحليل التقاطعي للبيانات واستعراض النتائج والقياسات",
    audDetailPfaPart3: "الخاتمة: الدروس المستفادة والفرص والمجالات المقترحة لتوسيع الدراسة",
    audDetailPfaTip: "دفعة قوية للغاية واختلاف ملحوظ لتقارير الإجازة في السنة الأولى والثانية تظهر رقي الطالب.",

    audDetailMemoirTag: "معايير AFNOR الأكاديمية الرسمية",
    audDetailMemoirTitle: "التحكم الكامل ومطابقة أطروحات الماجستير",
    audDetailMemoirDesc: "سكريفيا (Scrivya) تؤمن مطابقة فنية وتنسيقية متكاملة بنسبة 100% للشروط الصارمة المعتمدة في تونس وأوروبا (مثل معايير AFNOR / NF Z 44-005). من ترتيب فصول الدراسة إلى عرض هوامش الصفحات اللاتينية والتقليدية باحتراف كامل.",
    audDetailMemoirCheck1: "الربط التلقائي الدقيق للهوامش السفلية والاقتباسات",
    audDetailMemoirCheck2: "تنظيم وعرض أسماء الباحثين ودور النشر بأحجام وخطوط متطابقة",
    audDetailMemoirCheck3: "صياغة فهرس المحتويات التفاعلي بروابط قابلة للنقر مباشرة",
    audDetailMemoirModelTitle: "📂 خطة عمل أطروحة الماجستير الكلاسيكية",
    audDetailMemoirPart1: "الفصل الأول: التأطير النظري، مراجعة الأدبيات السابقة والأبحاث العلمية ذات العلاقة",
    audDetailMemoirPart2: "الفصل الثاني: المنهج الأمبريقي، دراسة الحالات وسياق التحليل والمقارنة",
    audDetailMemoirPart3: "الفصل الثالث: التوصيات الإستراتيجية والمقترحات والحلول العملية المقترحة",
    audDetailMemoirTip: "الحل الأمثل لكليات العلوم الإنسانية، الحقوق والعلوم القانونية، والعلوم الاقتصادية والتصرف.",

    audDetailSpecTag: "الأبحاث الطبية المتقدمة والرسائل الطويلة",
    audDetailSpecTitle: "أدوات مخصصة لحجم أطروحات الدكتوراه وصياغتها الهندسية",
    audDetailSpecDesc: "أطروحات الدكتوراه وفحوصات الأنشطة السريرية الطبية أو التحليلات القانونية الاستشارية الواسعة تحتاج لمستوى تفصيلي عالٍ جداً. سكريفيا (Scrivya) تتيح تنظيم فهارس الاختصارات الطبية، قواميس الرموز العلمية، والملاحق الواسعة بدقة تامة.",
    audDetailSpecCheck1: "تنسيق متناسق وجذاب للمعادلات الرياضية والقواعد الإجرائية المعقدة",
    audDetailSpecCheck2: "التحويل الفوري بين أنماط التوثيق الأكثر شهرة عالمياً (AFNOR, APA, Vancouver)",
    audDetailSpecCheck3: "هيكلة خطاب الدفاع والمناقشة الشفوية وتطوير خطة عروض الشرائح والشرائح التقديمية",
    audDetailSpecModelTitle: "📂 نموذج أطروحة الدكتوراه المتقدمة والطب",
    audDetailSpecPart1: "مقدمة الدراسة: استعراض الوضع الوبائي وسيرة الفحوصات الفيزيولوجية المرضية",
    audDetailSpecPart2: "الهيكل الأساسي: توثيق الحالات السريرية والتحليلات الإحصائية وتطوير النماذج",
    audDetailSpecPart3: "المناقشة: مقارنة تفصيلية واستثنائية للنتائج مع النماذج والمرجعيات العالمية",
    audDetailSpecTip: "مرافقة موجهة لضمان تقديم مساهمة علمية متفردة وراقية للباحثين والمختصين.",

    servicesTagline: "مصفوفة الخدمات العلمية والأكاديمية",
    servicesTitle: "استكشف قائمة الميزات الفريدة لسكريفيا (Scrivya)",
    servicesDesc: "انقر لمعاينة فئات التنسيق المترابطة التي تدعمها المنصة وتعرف على إمكانيات الحلول التقنية المتطورة.",

    whyTagline: "مصممة لمطابقة مواصفات التقييم في كلياتكم",
    whyTitle: "لماذا سكريفيا (Scrivya) هي خيارك الأمثل؟",
    whyDesc: "نقوم بحل معضلات الصياغة والتنسيق الأكاديمي بشكل دقيق ومباشر. تصفح كيف تساعدك واجهة سكريفيا (Scrivya) في اختصار الوقت الطويل:",
    whyNativeSuccess: "مدعوم تلقائياً ومضمون بالكامل داخل واجهة سكريفيا الأنيقة",

    tarifsTagline: "خطط وأسعار شفافة وميسرة للجميع",
    tarifsTitle: "الأسعار بالدينار التونسي",
    tarifsDesc: "استثمار يسير ومدروس لتضمن تفوقاً أكاديمياً لافتاً وراحة بال تامة وخروجاً مشرفاً من عناء الكتابة ومراجعة النماذج.",
    tarifPopular: "الأكثر اختياراً",
    tarifPerDoc: "للمستند الواحد",
    tarifChoosePlan: "اختر هذه الخطة",
    tarifFeatures: "الميزات المضمنة في الخطة الأكاديمية:",
    tarifPfaName: "الإجازة / مشروع نهاية السنة PFA",
    tarifPfaPrice: "49 د.ت",
    tarifPfaLimit: "حتى 30 صفحة كحد أقصى",
    tarifPfeName: "الهندسة / مشروع التخرج PFE",
    tarifPfePrice: "89 د.ت",
    tarifPfeLimit: "حتى 70 صفحة كحد أقصى",
    tarifMasterName: "الماجستير / الأطروحة",
    tarifMasterPrice: "149 د.ت",
    tarifMasterLimit: "حتى 120 صفحة كحد أقصى",
    tarifSpecName: "الدكتوراه والرسائل الشاملة",
    tarifSpecPrice: "249 د.ت",
    tarifSpecLimit: "عدد غير محدود من الصفحات والمراجعات",

    faqTagline: "إرشادات سريعة وحاسمة لاستفساراتكم مجمعة",
    faqTitle: "الأسئلة الأكاديمية الأكثر شيوعاً",
    faqDesc: "كل الإجابات التفصيلية لتفهم كيف تقدم منصة سكريفيا (Scrivya) بعداً علمياً وإدارياً مبهراً للطلاب في تونس.",

    contactTagline: "دعم مباشر وتفاعلي وسريع للغاية للجميع",
    contactTitle: "لديك استفسار أو تود مناقشتنا؟",
    contactDesc: "لدينا مستشارون أكاديميون في تونس العاصمة ملمون تماماً بنماذج ولوائح التقييم المعتمدة في كبرى الكليات والمعاهد (مثل ENIT, INSAT, IHEC, TBS, SUP'COM, FST) لتوجيهكم بوضوح وموثوقية تامة.",
    contactEmail: "البريد الإلكتروني",
    contactPhone: "هاتف الدعم والمساعدة",
    contactHeadquarters: "مقر الإدارة والمكتب الرئيسي",
    contactStatusActive: "نشط حالياً على مدار الساعة. يجيب مستشارونا خلال أقل من 15 دقيقة فقط لمعاينة طلبك.",

    lblLoginForm: "تسجيل الدخول إلى حسابك في سكريفيا",
    lblSignupForm: "إنشاء حساب جديد في منصة سكريفيا الأكاديمية",
    lblEmailAddress: "البريد الإلكتروني للجامعة أو الشخصي",
    lblPassword: "كلمة المرور الخاصة بك",
    lblFullName: "الاسم الكامل ثلاثياً",
    lblInstitution: "الكلية / الجامعة / المعهد العلمي",
    lblCreateAccount: "تأكيد وإنشاء الحساب",
    lblAlreadyHaveAccount: "هل تملك حساباً مسبقاً؟ سجل الدخول الآن",
    lblDontHaveAccount: "لا تملك حساباً معنا بعد؟ بادر بالتسجيل الآن",
    lblSubmitConnexion: "تأكيد الدخول الآمن",
    lblRememberMe: "تذكر بياناتي في هذا المتصفح",
    lblClose: "إغلاق النافذة",
  },
};
