import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Layers, 
  Cpu, 
  Database, 
  Activity, 
  CheckSquare, 
  DollarSign, 
  CheckCircle2, 
  RefreshCw, 
  Users, 
  Calendar, 
  ChevronRight, 
  Plus, 
  Play, 
  TrendingUp, 
  Globe, 
  Award,
  BookOpen,
  Settings,
  HelpCircle,
  Clock,
  ArrowRight,
  Search,
  FileText,
  Sparkles,
  Terminal,
  Sliders,
  Check,
  Briefcase,
  Code,
  Palette,
  Lock,
  ShieldCheck
} from "lucide-react";

interface PfeHubWorkspaceProps {
  onBackToEditor: () => void;
  isLight: boolean;
}

export default function PfeHubWorkspace({ onBackToEditor, isLight }: PfeHubWorkspaceProps) {
  // Database States fetched from backend
  const [dbState, setDbState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states for manual Figma node creation
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeWidth, setNewNodeWidth] = useState(375);
  const [newNodeHeight, setNewNodeHeight] = useState(812);
  const [newNodeImage, setNewNodeImage] = useState("https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80");

  // Form states for Telemetry Simulator
  const [simEndpoint, setSimEndpoint] = useState("/api/v1/chat");
  const [simMethod, setSimMethod] = useState("POST");
  const [simBytes, setSimBytes] = useState(1024);
  const [simPayload, setSimPayload] = useState("Bonjour, nous voulons concevoir un modèle COGS conforme au Startup Act.");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  // Startup Act checklist state
  const [startupChecklist, setStartupChecklist] = useState([
    { id: "multidisciplinary", label: "Équipe pluridisciplinaire équilibrée (Développeur INSAT, Designer Esprit, Marketeur IHEC)", checked: true },
    { id: "innovation", label: "Caractère innovant du modèle d'affaires ou rupture technologique forte", checked: true },
    { id: "scalability", label: "Potentiel de croissance et d'extensibilité internationale validé", checked: false },
    { id: "university_dean", label: "Accord officiel de l'école / université pour le label \"PFE-Startup\"", checked: true },
    { id: "cogs_ratio", label: "Modélisation financière des COGS < 30% du chiffre d'affaires prévisionnel", checked: false }
  ]);

  // Active view tabs
  const [activeTab, setActiveTab] = useState<"workspace" | "matchmaking" | "schema">("workspace");

  // Active Schema Table for the Interactive Database Explorer
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<string>("Team");

  // Slide-show style status simulation logs for matchmaking and document generation
  const [matchmakingLogs, setMatchmakingLogs] = useState<string[]>([]);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState<boolean>(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [docsGeneratedSuccess, setDocsGeneratedSuccess] = useState<boolean>(false);

  // COGS simulated interactive projection parameters
  const [simMonthlyRequests, setSimMonthlyRequests] = useState<number>(18000);
  const [simEstimatedSaaSPrice, setSimEstimatedSaaSPrice] = useState<number>(99); // Monthly TND price per client
  const [simActiveClients, setSimActiveClients] = useState<number>(45);

  // Fetch state from server
  const fetchState = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/pfe-hub/state");
      if (!response.ok) throw new Error("Impossible de récupérer l'état du serveur.");
      const data = await response.json();
      setDbState(data);
      setErrorMsg(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Erreur de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Trigger re-seed
  const handleReSeed = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/pfe-hub/seed", { method: "POST" });
      if (!response.ok) throw new Error("Échec du ré-ensemencement.");
      await fetchState();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Matchmaking with animation
  const [isMatching, setIsMatching] = useState(false);
  const [matchResultMsg, setMatchResultMsg] = useState<string | null>(null);
  const [timelineAdjustments, setTimelineAdjustments] = useState<any>(null);

  const handleMatch = async () => {
    setIsMatching(true);
    setMatchResultMsg(null);
    setTimelineAdjustments(null);
    setMatchmakingLogs([
      "🔄 Initialisation de la recherche de candidats à Carthage...",
    ]);

    // Simulate heuristic calculations stepping to show amazing engineering detail
    const steps = [
      "🔍 Analyse des 6 candidats universitaires tunisiens en attente...",
      "📅 Analyse d'alignement de calendrier : INSAT (Soutenance Juin) vs IHEC (Mémoire Mai)...",
      "🤝 Calcul d'alignement de compétences : Dev technique, UI/UX Designer et Business Analyst...",
      "⚡ Heuristique de Carthage : appariement optimal à 97.4% de compatibilité...",
      "🚀 Création de la Team PFE-Startup Falcon dans la base de données..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((res) => setTimeout(res, 450));
      setMatchmakingLogs(prev => [...prev, steps[i]]);
    }

    try {
      const response = await fetch("/api/v1/pfe-hub/match", { method: "POST" });
      if (!response.ok) throw new Error("Échec du matchmaking.");
      const data = await response.json();
      if (data.matched) {
        setMatchResultMsg(data.message);
        setTimelineAdjustments(data.timelineAdjustments);
        await fetchState();
      } else {
        setMatchResultMsg(data.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsMatching(false);
    }
  };

  // Trigger Figma Node State transition (Draft -> Ready for Dev) to simulate webhook
  const handleFigmaSync = async (nodeId: string, nodeName: string, imageUrl: string, width: number, height: number) => {
    try {
      const response = await fetch("/api/v1/sync/figma-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-figma-token": "pfe_hub_figma_handshake_secret_2026"
        },
        body: JSON.stringify({
          figmaFileId: dbState?.syncSettings?.[0]?.figmaFileId || "figma_pfe_falcon_1092",
          changedNodes: [
            { id: nodeId, name: nodeName, status: "Ready for Dev", width, height, imageUrl }
          ]
        })
      });
      if (!response.ok) throw new Error("Échec de la synchronisation Figma.");
      await fetchState();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Add new Figma design mockup frame
  const handleAddFigmaNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;
    const nodeId = `figma-frame-${Date.now()}`;
    
    try {
      const response = await fetch("/api/v1/sync/figma-webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-figma-token": "pfe_hub_figma_handshake_secret_2026"
        },
        body: JSON.stringify({
          figmaFileId: dbState?.syncSettings?.[0]?.figmaFileId || "figma_pfe_falcon_1092",
          changedNodes: [
            { id: nodeId, name: newNodeName, status: "Draft", width: newNodeWidth, height: newNodeHeight, imageUrl: newNodeImage }
          ]
        })
      });
      if (!response.ok) throw new Error("Échec de la création de la maquette.");
      setNewNodeName("");
      await fetchState();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  // Post dynamic telemetry log
  const handleSimulateTelemetry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    setSimResult(null);
    try {
      const response = await fetch("/api/v1/telemetry/log-usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: dbState?.projects?.[0]?.id || "proj-falcon",
          endpoint: simEndpoint,
          method: simMethod,
          bytesSent: simBytes,
          payloadText: simPayload
        })
      });
      if (!response.ok) throw new Error("Échec de l'ingestion de la télémétrie.");
      const data = await response.json();
      setSimResult(data.metrics);
      await fetchState();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSimulating(false);
    }
  };

  // Toggle Startup Act checklist items
  const handleToggleChecklist = (id: string) => {
    setStartupChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Handle Startup Act Document Generation Animation
  const handleGenerateDocuments = async () => {
    setIsGeneratingDocs(true);
    setDocsGeneratedSuccess(false);
    setGenerationLogs(["⚙️ Démarrage du compilateur officiel de dossiers de labellisation d'État..."]);

    const docsSteps = [
      "📊 Récupération en temps réel des métriques d'infrastructure COGS (actuellement à < 30%)...",
      "📄 Structuration de la convention d'association des cofondateurs INSAT / IHEC Tunis...",
      "🛠️ Extraction des webhooks Figma reliés au dépôt GitHub actif...",
      "🏛️ Rédaction automatique du formulaire d'octroi du statut de startup act tunisien...",
      "🔐 Signature numérique de l'équipe et cryptage SHA-256 de l'archive...",
      "📦 Archive ZIP compilée avec succès : prêt pour dépôt sur le portail d'État!"
    ];

    for (let i = 0; i < docsSteps.length; i++) {
      await new Promise((res) => setTimeout(res, 350));
      setGenerationLogs(prev => [...prev, docsSteps[i]]);
    }

    setIsGeneratingDocs(false);
    setDocsGeneratedSuccess(true);
  };

  const checklistScore = startupChecklist.filter(i => i.checked).length;
  const checklistPercent = Math.round((checklistScore / startupChecklist.length) * 100);

  // Live interactive COGS projections calculations
  const simNetworkCostPerCall = 0.00002; // TND
  const simDatabaseCostPerCall = 0.00005; // TND
  const simAICostPerCall = 0.00025; // TND (Gemini 3.5 Flash tokens estimation)

  const simMonthlyInfrastructureCost = simMonthlyRequests * (simNetworkCostPerCall + simDatabaseCostPerCall + simAICostPerCall);
  const simSaaSRevenue = simActiveClients * simEstimatedSaaSPrice;
  const simCOGSPercentage = simSaaSRevenue > 0 ? (simMonthlyInfrastructureCost / simSaaSRevenue) * 100 : 0;
  const isSaaSCompliant = simCOGSPercentage < 30;

  // Dynamic simulated calendar synchronization values
  const currentSyncSetting = dbState?.syncSettings?.[0] || { figmaFileId: "figma_pfe_falcon_1092", githubRepoOwner: "falcon-ai-org", githubRepoName: "falcon-defect-detection" };
  const currentProject = dbState?.projects?.[0] || { title: "Falcon-AI Defect Detection", domain: "Deeptech" };

  // Definition of tables and their attributes for the Interactive Database Explorer
  const databaseTablesSchema: Record<string, { desc: string; fields: { name: string; type: string; isKey: boolean; relation?: string; descFr: string }[] }> = {
    Team: {
      desc: "Regroupe les étudiants cofondateurs issus de différentes écoles pour le projet de startup commun.",
      fields: [
        { name: "id", type: "String", isKey: true, descFr: "Identifiant unique (UUID) de l'équipe" },
        { name: "name", type: "String", isKey: false, descFr: "Nom commercial ou projet de la startup" },
        { name: "createdAt", type: "DateTime", isKey: false, descFr: "Date d'enregistrement de l'équipe" },
        { name: "users", type: "User[]", isKey: false, relation: "User", descFr: "Membres pluridisciplinaires de l'équipe" },
        { name: "project", type: "Project?", isKey: false, relation: "Project", descFr: "Projet de startup associé à l'équipe" }
      ]
    },
    Project: {
      desc: "Représente l'entité technologique et financière labellisable sous le label 'PFE-Startup'.",
      fields: [
        { name: "id", type: "String", isKey: true, descFr: "Identifiant unique du projet" },
        { name: "title", type: "String", isKey: false, descFr: "Titre du mémoire ou de la startup" },
        { name: "domain", type: "String", isKey: false, descFr: "Domaine d'innovation (ex: IA, Deeptech, EdTech)" },
        { name: "createdAt", type: "DateTime", isKey: false, descFr: "Date de création du projet" },
        { name: "teamId", type: "String", isKey: false, relation: "Team", descFr: "ID de l'équipe rattachée (relation 1-to-1)" },
        { name: "syncSettings", type: "SyncSetting?", isKey: false, relation: "SyncSetting", descFr: "Paramètres de synchronisation Figma / GitHub" },
        { name: "apiLogs", type: "ApiLog[]", isKey: false, relation: "ApiLog", descFr: "Journaux d'appels API enregistrés pour la télémétrie" },
        { name: "infrastructure", type: "CostMetric[]", isKey: false, relation: "CostMetric", descFr: "Métriques de coûts COGS agrégés" }
      ]
    },
    User: {
      desc: "Profil étudiant d'un membre d'un binôme/trinôme tunisien, identifié par son université d'appartenance.",
      fields: [
        { name: "id", type: "String", isKey: true, descFr: "Identifiant unique de l'utilisateur" },
        { name: "name", type: "String", isKey: false, descFr: "Nom et prénom de l'étudiant" },
        { name: "email", type: "String", isKey: false, descFr: "Adresse email universitaire unique" },
        { name: "role", type: "String", isKey: false, descFr: "Rôle dans le projet: DEVELOPER, DESIGNER, ou BUSINESS" },
        { name: "university", type: "String", isKey: false, descFr: "Université d'origine (ex: INSAT, IHEC, Esprit, TBS)" },
        { name: "academicYear", type: "String", isKey: false, descFr: "Niveau d'études universitaire actuel" },
        { name: "skills", type: "String[]", isKey: false, descFr: "Compétences clés de l'étudiant" },
        { name: "teamId", type: "String?", isKey: false, relation: "Team", descFr: "ID de l'équipe d'appartenance" }
      ]
    },
    SyncSetting: {
      desc: "Gère les liaisons d'API et les webhooks actifs entre Figma et les webhooks GitHub.",
      fields: [
        { name: "id", type: "String", isKey: true, descFr: "Identifiant de la liaison" },
        { name: "projectId", type: "String", isKey: false, relation: "Project", descFr: "ID du projet associé" },
        { name: "figmaFileId", type: "String?", isKey: false, descFr: "ID unique du fichier de design Figma" },
        { name: "githubRepoOwner", type: "String?", isKey: false, descFr: "Propriétaire du dépôt GitHub" },
        { name: "githubRepoName", type: "String?", isKey: false, descFr: "Nom exact du repository GitHub" }
      ]
    },
    ApiLog: {
      desc: "Infection brute des appels API simulés pour alimenter la télémétrie des coûts unitaire.",
      fields: [
        { name: "id", type: "String", isKey: true, descFr: "ID de la ligne de log" },
        { name: "projectId", type: "String", isKey: false, relation: "Project", descFr: "ID du projet émetteur" },
        { name: "endpoint", type: "String", isKey: false, descFr: "Route d'API appelée (ex: /api/v1/chat)" },
        { name: "method", type: "String", isKey: false, descFr: "Méthode HTTP (POST, GET, etc.)" },
        { name: "bytesSent", type: "Int", isKey: false, descFr: "Taille des données de réponse réseau" },
        { name: "timestamp", type: "DateTime", isKey: false, descFr: "Date et heure de l'appel" }
      ]
    },
    CostMetric: {
      desc: "Données analytiques finales de coûts serveurs stockées et affichées en direct.",
      fields: [
        { name: "id", type: "String", isKey: true, descFr: "Identifiant de la métrique" },
        { name: "projectId", type: "String", isKey: false, relation: "Project", descFr: "ID du projet lié" },
        { name: "service", type: "String", isKey: false, descFr: "Nom du service tiers (AWS Lambda, Gemini LLM, Postgres)" },
        { name: "costAmount", type: "Float", isKey: false, descFr: "Coût accumulé et calculé en USD" },
        { name: "unitType", type: "String", isKey: false, descFr: "Unité de mesure de facturation (tokens, octets, exécutions)" },
        { name: "updatedAt", type: "DateTime", isKey: false, descFr: "Dernière réévaluation" }
      ]
    }
  };

  // Color theme helpers
  const themeCardBg = isLight ? "bg-white border-slate-200 shadow-sm text-slate-800" : "bg-slate-900/40 border-white/10 text-slate-100";
  const themeTextPrimary = isLight ? "text-slate-900" : "text-white";
  const themeTextSecondary = isLight ? "text-slate-600" : "text-slate-400";
  const themeTextMuted = isLight ? "text-slate-400" : "text-slate-500";
  const themeSubCardBg = isLight ? "bg-slate-50 border-slate-200" : "bg-slate-950/45 border-white/5";
  const themeBorder = isLight ? "border-slate-200" : "border-white/10";
  const themeHeaderBorder = isLight ? "border-slate-300/60" : "border-white/10";
  const themeTitleGradient = isLight ? "bg-gradient-to-r from-blue-700 to-indigo-700" : "bg-gradient-to-r from-blue-400 via-indigo-400 to-fuchsia-400";
  const themeInputBg = isLight ? "bg-slate-50 border-slate-200 text-slate-800 focus:bg-white" : "bg-slate-950/60 border-white/15 text-white focus:border-indigo-500/50";

  return (
    <div id="pfe-hub-root" className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${isLight ? "bg-slate-50 text-slate-900" : "bg-slate-950 text-slate-100"}`}>
      
      {/* HEADER SECTION */}
      <header id="pfe-hub-header" className={`max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b ${themeHeaderBorder} mb-8`}>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span id="badge-startup-engine" className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold font-mono uppercase bg-blue-600/10 text-blue-500 dark:bg-blue-600/20 dark:text-blue-400 rounded-full border border-blue-500/15">
              <Sparkles className="w-3 h-3" /> Tunisian PFE-Startup Engine
            </span>
            <span id="badge-compliance-ok" className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full border border-emerald-500/15">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              Startup Act Compliant
            </span>
          </div>
          <h1 id="title-pfe-hub" className="text-3xl md:text-4xl font-sans font-bold tracking-tight">
            PFE-Hub <span className={`bg-clip-text text-transparent ${themeTitleGradient}`}>Synchronizer</span>
          </h1>
          <p id="desc-pfe-hub" className={`text-sm ${themeTextSecondary}`}>
            Espace d'interconnexion technique (Figma & GitHub), financier (Moteur COGS) et académique (Dossier de labellisation d'État Tunisie).
          </p>
        </div>

        <div id="header-actions" className="flex items-center gap-3 shrink-0 w-full lg:w-auto">
          <button 
            id="btn-reset-db"
            onClick={handleReSeed} 
            className={`flex-1 lg:flex-none px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isLight 
                ? "bg-white border-slate-300 hover:bg-slate-100 text-slate-800 shadow-sm" 
                : "bg-slate-900/60 border-white/10 hover:bg-slate-800 text-slate-300"
            }`}
            title="Réinitialiser la base de données de test"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Seed DB Demo
          </button>
          
          <button 
            id="btn-back-editor"
            onClick={onBackToEditor} 
            className="flex-1 lg:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/10 hover:scale-[1.02] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'Éditeur
          </button>
        </div>
      </header>

      {/* ERROR MESSAGE NOTIFICATION */}
      {errorMsg && (
        <div id="error-banner" className="max-w-7xl mx-auto mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-2">⚠️ {errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold underline text-[10px] uppercase cursor-pointer">Fermer</button>
        </div>
      )}

      {/* VIEW SELECTION TAB BAR */}
      <div id="tabs-navigation" className="max-w-7xl mx-auto mb-8">
        <div className={`inline-flex p-1 rounded-2xl border ${isLight ? "bg-slate-150 border-slate-200" : "bg-slate-900/60 border-white/10"} w-full md:w-auto md:min-w-[450px]`}>
          <button
            id="tab-btn-workspace"
            onClick={() => setActiveTab("workspace")}
            className={`flex-1 md:flex-none px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "workspace" 
                ? "bg-blue-600 text-white shadow-sm" 
                : `${isLight ? "text-slate-600 hover:text-slate-950" : "text-slate-400 hover:text-white"}`
            }`}
          >
            <Layers className="w-4 h-4" />
            Workspace Actif
          </button>
          <button
            id="tab-btn-matchmaking"
            onClick={() => setActiveTab("matchmaking")}
            className={`flex-1 md:flex-none px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "matchmaking" 
                ? "bg-blue-600 text-white shadow-sm" 
                : `${isLight ? "text-slate-600 hover:text-slate-950" : "text-slate-400 hover:text-white"}`
            }`}
          >
            <Users className="w-4 h-4" />
            Smart Matchmaking
          </button>
          <button
            id="tab-btn-schema"
            onClick={() => setActiveTab("schema")}
            className={`flex-1 md:flex-none px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === "schema" 
                ? "bg-blue-600 text-white shadow-sm" 
                : `${isLight ? "text-slate-600 hover:text-slate-950" : "text-slate-400 hover:text-white"}`
            }`}
          >
            <Database className="w-4 h-4" />
            Modèle Prisma / SQL
          </button>
        </div>
      </div>

      {isLoading ? (
        <div id="loader-view" className="max-w-7xl mx-auto py-24 flex flex-col items-center justify-center gap-4">
          <div className="relative flex items-center justify-center w-16 h-16">
            <div className="absolute w-12 h-12 rounded-full border-4 border-blue-500/20 animate-pulse"></div>
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <p className={`text-xs ${themeTextSecondary} font-mono`}>Synchronisation de l'écosystème PFE-Hub...</p>
        </div>
      ) : (
        <div id="active-tab-container" className="max-w-7xl mx-auto space-y-8">
          
          {/* TAB 1: WORKSPACE */}
          {activeTab === "workspace" && (
            <>
              {/* SECTION 1: UNIVERSITY ADMINISTRATIVE STEPS (HIGH GRAPHICAL POLISH) */}
              <div id="university-milestones-card" className={`p-6 md:p-8 rounded-3xl border transition-all ${themeCardBg}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-white/5 mb-6 gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500">
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-base font-bold font-sans tracking-wide">
                        Parcours d'Approbation Académique & Alignement
                      </h2>
                      <p className={`text-xs ${themeTextSecondary}`}>Co-coordination administrative INSAT (Tunis) et IHEC (Carthage)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 dark:bg-slate-900/60 dark:text-slate-400 px-3 py-1 rounded-full uppercase border border-slate-200 dark:border-white/5">
                    Calendrier Inter-Établissement
                  </span>
                </div>

                {/* Vertical-responsive and horizontal timeline stepper */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative mt-8">
                  {/* Visual Connector Line */}
                  <div className="hidden md:block absolute top-7 left-8 right-8 h-0.5 bg-slate-200 dark:bg-white/10 z-0"></div>

                  {/* Step 1 */}
                  <div id="step-1" className={`p-5 rounded-2xl border text-left space-y-3 relative z-10 hover:shadow-md transition-all ${
                    isLight ? "bg-emerald-50/50 border-emerald-300" : "bg-emerald-500/5 border-emerald-500/30"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Étape 01 • Validé</span>
                      <div className="p-1 rounded-full bg-emerald-500 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-emerald-850 dark:text-emerald-400">Pitch & Sujet Startup Act</h3>
                      <p className={`text-[11px] leading-relaxed mt-1.5 ${themeTextSecondary}`}>
                        Double validation des doyens INSAT & IHEC Tunis. Label provisoire d'État octroyé.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div id="step-2" className={`p-5 rounded-2xl border text-left space-y-3 relative z-10 hover:shadow-md transition-all ${
                    isLight ? "bg-emerald-50/50 border-emerald-300" : "bg-emerald-500/5 border-emerald-500/30"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Étape 02 • Validé</span>
                      <div className="p-1 rounded-full bg-emerald-500 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-emerald-850 dark:text-emerald-400">Double Mentorat Universitaire</h3>
                      <p className={`text-[11px] leading-relaxed mt-1.5 ${themeTextSecondary}`}>
                        Supervision académique conjointe : un directeur technique (INSAT) et un tuteur d'économie (IHEC).
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div id="step-3" className={`p-5 rounded-2xl border text-left space-y-3 relative z-10 hover:shadow-md transition-all ring-2 ring-indigo-500/30 animate-pulse-slow ${
                    isLight ? "bg-blue-50/50 border-blue-300" : "bg-blue-500/5 border-blue-500/40"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Étape 03 • Actif</span>
                      <div className="p-1.5 rounded-full bg-blue-600 text-white animate-spin-slow">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-blue-800 dark:text-blue-300">Synchronisation Calendrier</h3>
                      <p className={`text-[11px] leading-relaxed mt-1.5 ${themeTextSecondary}`}>
                        Prototype MVP technique avancé au <span className="font-semibold text-blue-600 dark:text-blue-400">10 Mai</span> pour intégration immédiate au rapport financier IHEC (dépôt 30 Mai).
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div id="step-4" className={`p-5 rounded-2xl border text-left space-y-3 relative z-10 hover:shadow-md transition-all ${themeSubCardBg}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono ${themeTextMuted} font-bold uppercase tracking-wider`}>Étape 04 • À venir</span>
                      <div className={`w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700`}></div>
                    </div>
                    <div>
                      <h3 className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-300"}`}>Audit de Labellisation</h3>
                      <p className={`text-[11px] leading-relaxed mt-1.5 ${themeTextSecondary}`}>
                        Évaluation des indices d'éligibilité et ratios de coûts serveurs par la commission tunisienne.
                      </p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div id="step-5" className={`p-5 rounded-2xl border text-left space-y-3 relative z-10 opacity-70 hover:shadow-md transition-all ${themeSubCardBg}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono ${themeTextMuted} font-bold uppercase tracking-wider`}>Étape 05 • Diplôme</span>
                      <div className={`w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700`}></div>
                    </div>
                    <div>
                      <h3 className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-300"}`}>Soutenance Mixte</h3>
                      <p className={`text-[11px] leading-relaxed mt-1.5 ${themeTextSecondary}`}>
                        Jury croisé devant des professeurs des deux facultés et un comité d'experts en capital-risque (VC).
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* THREE COLUMN GRID LAYOUT (Section 5 from PDF) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* COLUMN 1: LEFT - FIGMA DESIGN CANVAS SYNC NODE (4 Cols) */}
                <section id="col-figma" className={`lg:col-span-4 p-5 md:p-6 rounded-3xl border flex flex-col justify-between ${themeCardBg}`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-500">
                          <Layers className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-fuchsia-600 dark:text-fuchsia-400">Design Canvas Sync</h3>
                      </div>
                      <span className="text-[9px] font-mono bg-fuchsia-500/10 text-fuchsia-500 px-2 py-0.5 rounded border border-fuchsia-500/20">
                        Webhooks Active
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-xs font-semibold">
                        Fichier Figma lié : <span className="font-mono text-fuchsia-600 dark:text-fuchsia-400 font-bold">{currentSyncSetting.figmaFileId}</span>
                      </p>
                      <p className={`text-[11px] leading-relaxed ${themeTextSecondary}`}>
                        Simulez la transition d'un cadre (frame) de "Draft" à "Ready for Dev" pour déclencher le webhook et injecter des issues d'ingénierie sur GitHub.
                      </p>
                    </div>

                    {/* Figma Node List */}
                    <div className="space-y-3 pt-2">
                      {dbState?.figmaNodes?.map((node: any) => (
                        <div key={node.id} className={`p-3 rounded-2xl border text-xs relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
                          node.status === "Ready for Dev" 
                            ? "bg-emerald-500/5 border-emerald-500/20 shadow-sm" 
                            : "bg-slate-100/40 dark:bg-slate-950/20 border-white/5"
                        }`}>
                          <div className="flex items-start gap-2.5 text-left">
                            <div className="relative group shrink-0">
                              <img 
                                src={node.imageUrl} 
                                alt={node.name} 
                                className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:brightness-110 transition-all referrer-policy"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-zoom-in">
                                <Search className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <h4 className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">{node.name}</h4>
                              <p className={`text-[10px] font-mono ${themeTextSecondary}`}>
                                Dim: {node.width}px × {node.height}px
                              </p>
                              <div className="flex items-center gap-1.5 pt-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${node.status === "Ready for Dev" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
                                <span className={`text-[9px] font-mono font-bold uppercase ${node.status === "Ready for Dev" ? "text-emerald-500" : "text-amber-500"}`}>
                                  {node.status}
                                </span>
                              </div>
                            </div>
                            
                            {node.status === "Draft" && (
                              <button
                                onClick={() => handleFigmaSync(node.id, node.name, node.imageUrl, node.width, node.height)}
                                className="px-2.5 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm shadow-fuchsia-600/10 hover:scale-105 shrink-0 cursor-pointer"
                                title="Déclencher le webhook de mise en production"
                              >
                                Dev-Ready
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Figma Node Simulator Form */}
                    <form onSubmit={handleAddFigmaNode} className={`p-4 rounded-2xl border border-dashed ${themeBorder} space-y-3 pt-4 text-left`}>
                      <div className={`text-[10px] font-mono font-bold uppercase ${themeTextSecondary}`}>Nouveau Cadre de Maquette Figma</div>
                      <div>
                        <input 
                          type="text" 
                          value={newNodeName}
                          onChange={(e) => setNewNodeName(e.target.value)}
                          placeholder="ex: Dashboard Tunnel de Vente"
                          className={`w-full rounded px-2.5 py-2 text-xs outline-none transition-all ${themeInputBg}`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={`text-[8px] uppercase font-mono font-bold ${themeTextSecondary}`}>Largeur (px)</label>
                          <input 
                            type="number" 
                            value={newNodeWidth}
                            onChange={(e) => setNewNodeWidth(Number(e.target.value))}
                            className={`w-full rounded px-2 py-1.5 text-xs outline-none font-mono ${themeInputBg}`}
                          />
                        </div>
                        <div>
                          <label className={`text-[8px] uppercase font-mono font-bold ${themeTextSecondary}`}>Hauteur (px)</label>
                          <input 
                            type="number" 
                            value={newNodeHeight}
                            onChange={(e) => setNewNodeHeight(Number(e.target.value))}
                            className={`w-full rounded px-2 py-1.5 text-xs outline-none font-mono ${themeInputBg}`}
                          />
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={!newNodeName}
                        className={`w-full py-2 bg-slate-800 hover:bg-slate-750 dark:bg-slate-900 dark:hover:bg-slate-850 border border-white/5 text-slate-200 dark:text-slate-300 rounded-xl text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${!newNodeName ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Injecter dans le Canvas
                      </button>
                    </form>
                  </div>
                </section>

                {/* COLUMN 2: CENTER - GITHUB PIPELINE REPOSITORY (4 Cols) */}
                <section id="col-github" className={`lg:col-span-4 p-5 md:p-6 rounded-3xl border flex flex-col justify-between ${themeCardBg}`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-blue-600 dark:text-blue-400">GitHub Repository</h3>
                      </div>
                      <span className="text-[9px] font-mono bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded border border-blue-500/20">
                        Octokit Active
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-xs font-semibold">
                        Repository : <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{currentSyncSetting.githubRepoOwner}/{currentSyncSetting.githubRepoName}</span>
                      </p>
                    </div>

                    {/* GitHub Issues Created via Webhook */}
                    <div className="space-y-3 text-left">
                      <div className={`text-[10px] font-mono font-bold uppercase ${themeTextSecondary}`}>Tickets Ouverts via Sync Figma</div>
                      
                      {dbState?.githubIssues?.length === 0 ? (
                        <div className={`p-5 text-center border border-dashed ${themeBorder} rounded-2xl text-xs ${themeTextMuted} space-y-1`}>
                          <p>Aucun ticket actif.</p>
                          <p className="text-[10px]">Actionnez un écran Figma en "Dev-Ready" pour simuler l'injection d'un ticket GitHub.</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {dbState?.githubIssues?.map((issue: any) => (
                            <div key={issue.id} className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-blue-500/20 text-xs space-y-2 hover:border-blue-500/40 transition-all">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold font-mono text-blue-600 dark:text-blue-400">
                                  Issue #{issue.number}
                                </span>
                                <span className="text-[8px] uppercase bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-mono font-bold">
                                  {issue.status}
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-200 truncate">{issue.title}</h4>
                              <p className={`text-[9px] font-mono ${themeTextSecondary} truncate`}>{issue.url}</p>
                              <div className="text-[10px] text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-950/80 p-2 rounded-lg max-h-20 overflow-y-auto whitespace-pre-wrap font-mono border border-slate-200/50 dark:border-white/5 leading-normal">
                                {issue.body}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Timeline of commits */}
                    <div className="space-y-3 pt-4 border-t border-white/5 text-left">
                      <div className={`text-[10px] font-mono font-bold uppercase ${themeTextSecondary}`}>Activité Récente des Devs (Commits)</div>
                      <div className="relative border-l border-slate-200 dark:border-white/15 pl-4 space-y-4 text-[11px] mt-2">
                        
                        <div className="relative group">
                          <span className="absolute -left-[21.5px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-950 transition-transform group-hover:scale-125"></span>
                          <span className="block font-bold text-slate-800 dark:text-slate-200">Ahmed Sassi (Tech/INSAT)</span>
                          <span className={`text-[11px] ${themeTextSecondary}`}>"feat: initialisation du serveur Express et routes d'ingestion COGS"</span>
                          <span className={`block text-[9px] ${themeTextMuted} font-mono mt-0.5`}>Il y a 30 mins • commit f836a9</span>
                        </div>

                        <div className="relative group">
                          <span className="absolute -left-[21.5px] top-1 w-3 h-3 rounded-full bg-fuchsia-500 ring-4 ring-white dark:ring-slate-950 transition-transform group-hover:scale-125"></span>
                          <span className="block font-bold text-slate-800 dark:text-slate-200">Yasmine Trabelsi (Designer/Esprit)</span>
                          <span className={`text-[11px] ${themeTextSecondary}`}>"design: validation et export des maquettes de v1 de tableau de bord"</span>
                          <span className={`block text-[9px] ${themeTextMuted} font-mono mt-0.5`}>Il y a 1 heure • commit e502c1</span>
                        </div>

                        <div className="relative group">
                          <span className="absolute -left-[21.5px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white dark:ring-slate-950 transition-transform group-hover:scale-125"></span>
                          <span className="block font-bold text-slate-800 dark:text-slate-200">Mohamed Dridi (Business/IHEC)</span>
                          <span className={`text-[11px] ${themeTextSecondary}`}>"cogs: intégration de la tarification AWS et Gemini dans notre tableur COGS"</span>
                          <span className={`block text-[9px] ${themeTextMuted} font-mono mt-0.5`}>Hier • commit d9012a</span>
                        </div>

                      </div>
                    </div>
                  </div>
                </section>

                {/* COLUMN 3: RIGHT - INTERACTIVE COGS INTERACTIVE SYSTEM (4 Cols) */}
                <section id="col-telemetry" className={`lg:col-span-4 p-5 md:p-6 rounded-3xl border flex flex-col justify-between ${themeCardBg}`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-600 dark:text-emerald-400">Facturation COGS</h3>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20">
                        Calculateur Actif
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-xs font-semibold">
                        Modèle COGS : <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{currentProject.title}</span>
                      </p>
                      <p className={`text-[11px] leading-relaxed ${themeTextSecondary}`}>
                        Conforme au Startup Act Tunisien. Assurez-vous que l'infrastructure brute ne dépasse pas 30% des revenus projetés.
                      </p>
                    </div>

                    {/* INTERACTIVE COMPLIANCE SLIDERS */}
                    <div className={`p-4 rounded-2xl ${themeSubCardBg} space-y-4 text-left`}>
                      <div className="text-[10px] font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">
                        Simulateur de Croissance Client (Interactive)
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Appels API Mensuels :</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{simMonthlyRequests.toLocaleString()} reqs</span>
                        </div>
                        <input 
                          type="range" 
                          min={2000} 
                          max={150000} 
                          step={1000}
                          value={simMonthlyRequests}
                          onChange={(e) => setSimMonthlyRequests(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Nombre de Clients Actifs :</span>
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-500">{simActiveClients} clients</span>
                        </div>
                        <input 
                          type="range" 
                          min={5} 
                          max={300} 
                          step={5}
                          value={simActiveClients}
                          onChange={(e) => setSimActiveClients(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>

                      {/* Calculations Output Card */}
                      <div className="pt-3 border-t border-slate-200/50 dark:border-white/5 space-y-2.5">
                        <div className="flex justify-between text-xs">
                          <span>Revenus Mensuels Estimés :</span>
                          <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{(simActiveClients * simEstimatedSaaSPrice).toLocaleString()} TND</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Coûts serveurs & LLM (COGS) :</span>
                          <span className="font-mono text-rose-500 font-bold">{simMonthlyInfrastructureCost.toFixed(2)} TND</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5">
                          <span className="text-[10px] font-bold uppercase text-slate-500">Ratio COGS / CA :</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-mono font-bold ${isSaaSCompliant ? "text-emerald-500" : "text-rose-500"}`}>
                              {simCOGSPercentage.toFixed(1)}%
                            </span>
                            <span className={`w-2 h-2 rounded-full ${isSaaSCompliant ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                          </div>
                        </div>

                        {isSaaSCompliant ? (
                          <div className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10 text-center uppercase font-bold">
                            ✓ Conforme au Startup Act (COGS &lt; 30%)
                          </div>
                        ) : (
                          <div className="text-[9px] font-mono text-rose-600 dark:text-rose-400 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10 text-center uppercase font-bold">
                            ⚠️ Alerte Ratio (&gt; 30%) - Optimisez l'inférence
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Live Metrics Projections from real log Database */}
                    <div className={`p-4 bg-slate-100/50 dark:bg-slate-950/50 rounded-2xl space-y-3 border ${themeBorder} text-left`}>
                      <div className="flex items-center justify-between">
                        <div className={`text-[10px] font-mono font-bold ${themeTextSecondary} uppercase`}>Indicateurs COGS d'Hébergement</div>
                        <span className="text-[8px] bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 px-1.5 rounded font-mono">Live DB</span>
                      </div>
                      
                      {dbState?.costMetrics?.map((metric: any) => {
                        const maxVal = metric.service.startsWith("Gemini") ? 0.05 : 0.001;
                        const percentage = Math.min(100, Math.round((metric.costAmount / maxVal) * 100));

                        return (
                          <div key={metric.id} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-700 dark:text-slate-300">{metric.service}</span>
                              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">${metric.costAmount.toFixed(6)}</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  metric.service.startsWith("Gemini") ? "bg-purple-500" : metric.service.startsWith("Postgre") ? "bg-amber-500" : "bg-blue-500"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className={`flex items-center justify-between text-[8px] ${themeTextMuted} font-mono`}>
                              <span>Unité : {metric.unitType}</span>
                              <span>Sync : {new Date(metric.updatedAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Interactive Telemetry Log Ingestion Simulator */}
                    <form onSubmit={handleSimulateTelemetry} className={`p-4 rounded-2xl border ${themeBorder} space-y-3 text-left`}>
                      <div className={`text-[10px] font-mono font-bold uppercase ${themeTextSecondary}`}>Appel API Télémetrie direct</div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={`text-[8px] uppercase font-mono font-bold ${themeTextMuted}`}>Route API</label>
                          <select 
                            value={simEndpoint}
                            onChange={(e) => setSimEndpoint(e.target.value)}
                            className={`w-full rounded px-2 py-1 text-[11px] outline-none transition-all ${themeInputBg}`}
                          >
                            <option value="/api/v1/chat">/api/v1/chat</option>
                            <option value="/api/v1/reformulate">/api/v1/reformulate</option>
                            <option value="/api/v1/check-spelling">/api/v1/check-spelling</option>
                            <option value="/api/v1/phd-research">/api/v1/phd-research</option>
                          </select>
                        </div>
                        <div>
                          <label className={`text-[8px] uppercase font-mono font-bold ${themeTextMuted}`}>Octets réseau</label>
                          <input 
                            type="number" 
                            value={simBytes}
                            onChange={(e) => setSimBytes(Number(e.target.value))}
                            className={`w-full rounded px-2 py-1 text-xs outline-none font-mono ${themeInputBg}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`text-[8px] uppercase font-mono font-bold ${themeTextMuted}`}>Texte de requête (pour calcul tokens)</label>
                        <textarea 
                          rows={1}
                          value={simPayload}
                          onChange={(e) => setSimPayload(e.target.value)}
                          className={`w-full rounded px-2.5 py-1.5 text-[10px] outline-none font-mono ${themeInputBg}`}
                          placeholder="Saisissez du texte..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSimulating}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10 cursor-pointer hover:scale-[1.01]"
                      >
                        {isSimulating ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                        Simuler Appel & Recalculer COGS
                      </button>

                      {simResult && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/10 text-[10px] font-mono space-y-1 text-slate-300">
                          <div className="font-bold text-emerald-400">Facturation Simulée :</div>
                          <div className="flex justify-between">
                            <span>Egress réseau :</span>
                            <span className="text-white">${simResult.networkCost.toFixed(8)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transaction DB :</span>
                            <span className="text-white">${simResult.databaseFootprintCost.toFixed(6)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tokens LLM ({simResult.calculatedTokens}) :</span>
                            <span className="text-white">${simResult.aiInferenceCost.toFixed(6)}</span>
                          </div>
                          <div className="pt-1.5 border-t border-white/5 flex justify-between font-bold text-emerald-400">
                            <span>Total unitaire :</span>
                            <span>${(simResult.networkCost + simResult.databaseFootprintCost + simResult.aiInferenceCost).toFixed(6)}</span>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                </section>

              </div>

              {/* SECTION 3: TUNISIAN STARTUP ACT CHECKLIST (Bottom Full Width - HIGHLY GRAPHICAL) */}
              <div id="startup-act-checklist-card" className={`p-6 md:p-8 rounded-3xl border transition-all ${themeCardBg}`}>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5 mb-6">
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-500">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold tracking-wide">
                          Grille de labellisation d'État (Tunisian Startup Act)
                        </h2>
                        <p className={`text-xs ${themeTextSecondary}`}>
                          Régit par la loi tunisienne n° 2018-20 du 17 avril 2018 relative aux startups.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Circular or bar progress */}
                  <div className="flex items-center gap-4 shrink-0 bg-slate-100/40 dark:bg-slate-950/40 p-3 rounded-2xl border border-white/5">
                    <div className="text-left">
                      <span className={`text-[9px] ${themeTextSecondary} font-mono block uppercase`}>Conformité de l'écosystème</span>
                      <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{checklistScore} / {startupChecklist.length} ({checklistPercent}%)</span>
                    </div>
                    <div className="w-32 h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-550" style={{ width: `${checklistPercent}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                  
                  {/* Left checklist items (6 Cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    {startupChecklist.map((item) => (
                      <label 
                        key={item.id} 
                        className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                          item.checked 
                            ? "bg-indigo-500/5 border-indigo-500/20 text-slate-800 dark:text-slate-100 shadow-sm" 
                            : "bg-slate-100/20 dark:bg-slate-950/10 border-white/5 hover:bg-slate-100/30 dark:hover:bg-slate-950/20"
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={item.checked}
                          onChange={() => handleToggleChecklist(item.id)}
                          className="mt-0.5 rounded border-slate-300 dark:border-white/10 text-indigo-600 focus:ring-indigo-500 bg-slate-100 dark:bg-slate-950 w-4 h-4 cursor-pointer" 
                        />
                        <div className="text-xs font-bold select-none leading-snug">
                          {item.label}
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Right compliance documentation summary (5 Cols) */}
                  <div className={`lg:col-span-5 p-5 md:p-6 rounded-2xl ${themeSubCardBg} border ${themeBorder} flex flex-col justify-between space-y-5`}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" /> Statut de labellisation d'État
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Avantages financiers du label</h4>
                      <p className={`text-xs ${themeTextSecondary} leading-relaxed`}>
                        Le label officiel "PFE-Startup" de la commission nationale tunisienne accorde un financement de subsistance d'un an, prend en charge les frais de dépôt de brevets et exonère de l'impôt sur les sociétés pendant 8 ans.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <button
                        onClick={handleGenerateDocuments}
                        disabled={isGeneratingDocs}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isGeneratingDocs ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        Générer le Dossier d'Éligibilité Officiel
                      </button>

                      {/* Display compilations logs inside terminal block */}
                      {(isGeneratingDocs || generationLogs.length > 0) && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/20 font-mono text-[10px] space-y-1.5 text-slate-300 max-h-48 overflow-y-auto">
                          <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-white/5 pb-1">
                            <span>COMPILATEUR DE DOSSIER D'ÉTAT</span>
                            <span className="text-[8px] uppercase px-1.5 py-0.5 rounded bg-indigo-500/10">STABLE</span>
                          </div>
                          {generationLogs.map((log, index) => (
                            <div key={index} className="flex items-start gap-1">
                              <span className="text-indigo-500 select-none">&gt;</span>
                              <span className="leading-normal">{log}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {docsGeneratedSuccess && (
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2.5">
                          <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Dossier de labellisation compilé avec succès!
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <button className="p-2 bg-emerald-500/15 dark:bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-800 dark:text-emerald-300 rounded text-[9px] font-mono font-bold uppercase transition-all cursor-pointer text-center">
                              Formulaire.pdf
                            </button>
                            <button className="p-2 bg-emerald-500/15 dark:bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-800 dark:text-emerald-300 rounded text-[9px] font-mono font-bold uppercase transition-all cursor-pointer text-center">
                              Plan_COGS.xlsx
                            </button>
                            <button className="p-2 bg-emerald-500/15 dark:bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-800 dark:text-emerald-300 rounded text-[9px] font-mono font-bold uppercase transition-all cursor-pointer text-center">
                              Convention.zip
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}

          {/* TAB 2: SMART MATCHMAKING ENGINE SANDBOX */}
          {activeTab === "matchmaking" && (
            <div id="matchmaking-container-card" className={`p-6 md:p-8 rounded-3xl border transition-all ${themeCardBg}`}>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 mb-8 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-500">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base font-bold font-sans tracking-wide">
                      Moteur d'Appariement Carthage (Matchmaking)
                    </h2>
                    <p className={`text-xs ${themeTextSecondary}`}>Heuristique avancée de création d'équipes cofondatrices pluridisciplinaires</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-800 dark:bg-slate-900/60 dark:text-slate-400 px-3 py-1 rounded-full uppercase border border-slate-200 dark:border-white/5">
                  Heuristic Match Algorithm
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                
                {/* Column 1: Candidates available (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  <div>
                    <h3 className={`text-sm font-bold ${themeTextPrimary} mb-1.5`}>Candidats Académiques en Attente d'Appariement</h3>
                    <p className={`text-xs ${themeTextSecondary} leading-relaxed`}>
                      Profils de talentueux étudiants tunisiens souhaitant combiner développement de code, design d'expérience utilisateur et modélisation financière prévisionnelle pour le Startup Act.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dbState?.users?.map((u: any) => (
                      <div key={u.id} className={`p-5 rounded-2xl border text-xs relative flex flex-col justify-between transition-all duration-300 hover:shadow-md ${
                        u.teamId 
                          ? "bg-emerald-500/5 border-emerald-500/20 text-slate-800 dark:text-slate-250" 
                          : "bg-slate-100/40 dark:bg-slate-950/30 border-white/5 hover:border-white/10"
                      }`}>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-250">{u.name}</h4>
                              <p className={`text-[10px] font-mono ${themeTextSecondary}`}>{u.email}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase border ${
                              u.role === "DEVELOPER" 
                                ? "bg-blue-600/10 text-blue-500 border-blue-500/25" 
                                : u.role === "DESIGNER" 
                                  ? "bg-fuchsia-600/10 text-fuchsia-500 border-fuchsia-500/25" 
                                  : "bg-amber-600/10 text-amber-500 border-amber-500/25"
                            }`}>
                              {u.role}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                            <div className="flex items-center gap-1">🏫 École: <span className="text-slate-800 dark:text-slate-300 font-bold">{u.university}</span></div>
                            <div className="flex items-center gap-1">🎓 Niveau: <span className="text-slate-800 dark:text-slate-300 font-bold">{u.academicYear}</span></div>
                          </div>

                          <div className="space-y-1.5">
                            <div className={`text-[9px] uppercase font-bold tracking-wider ${themeTextMuted}`}>Points Forts (Skills)</div>
                            <div className="flex flex-wrap gap-1">
                              {u.skills.map((skill: string, idx: number) => (
                                <span key={idx} className="bg-slate-200/50 dark:bg-slate-900 border border-slate-300/40 dark:border-white/5 text-slate-700 dark:text-slate-300 text-[9px] px-2 py-0.5 rounded font-mono">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {u.weaknesses && u.weaknesses.length > 0 && (
                            <div className="space-y-1.5">
                              <div className={`text-[9px] uppercase font-bold tracking-wider ${themeTextMuted}`}>Besoins complémentaires</div>
                              <div className="flex flex-wrap gap-1">
                                {u.weaknesses.map((w: string, idx: number) => (
                                  <span key={idx} className="bg-red-500/5 border border-red-500/10 text-red-500 dark:text-red-400 text-[9px] px-2 py-0.5 rounded font-mono">
                                    {w}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-200/60 dark:border-white/5 mt-4 flex items-center justify-between text-[11px]">
                          <span className={`${themeTextSecondary}`}>Statut :</span>
                          {u.teamId ? (
                            <span className="text-emerald-500 font-bold uppercase flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Associé (Membres)
                            </span>
                          ) : (
                            <span className="text-amber-500 font-bold uppercase animate-pulse">
                              Disponible
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Column 2: Trigger match (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  <div className={`p-5 rounded-3xl bg-slate-100/50 dark:bg-slate-950/40 border ${themeBorder} space-y-4`}>
                    <div className="text-[10px] font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Calculateur d'alignement</div>
                    <h3 className="text-sm font-bold">Lancer l'algorithme Carthage</h3>
                    
                    <p className={`text-xs ${themeTextSecondary} leading-relaxed`}>
                      L'engin analyse l'alignement des axes de recherche, synchronise les décalages de calendrier académique (ex: IHEC vs INSAT) et complète harmonieusement les lacunes en combinant au moins un développeur, un designer et un business manager.
                    </p>

                    <button
                      onClick={handleMatch}
                      disabled={isMatching}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 cursor-pointer hover:scale-[1.01]"
                    >
                      {isMatching ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      Démarrer l'Appariement Carthage
                    </button>

                    {/* Scanning console when engine is processing */}
                    {(isMatching || matchmakingLogs.length > 0) && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/20 font-mono text-[10px] space-y-1.5 text-slate-300 max-h-48 overflow-y-auto">
                        <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-white/5 pb-1">
                          <span>MOTEUR HEURISTIQUE</span>
                          <span className="text-[8px] uppercase px-1.5 py-0.5 rounded bg-indigo-500/10">COGNITIF</span>
                        </div>
                        {matchmakingLogs.map((log, index) => (
                          <div key={index} className="flex items-start gap-1">
                            <span className="text-indigo-500 select-none">&gt;</span>
                            <span className="leading-normal">{log}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {matchResultMsg && (
                      <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/20 text-xs space-y-3 text-left">
                        <div className="flex items-center gap-1.5 text-indigo-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <p className="font-bold">{matchResultMsg}</p>
                        </div>
                        
                        {timelineAdjustments && (
                          <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] font-mono text-slate-300">
                            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Plan d'action synchronisé :</div>
                            <div className="flex justify-between">
                              <span>📅 Date dépôt IHEC :</span>
                              <span className="text-white font-bold">{timelineAdjustments.originalBusinessDeadline}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>📅 Date soutenance INSAT :</span>
                              <span className="text-white font-bold">{timelineAdjustments.originalTechnicalDeadline}</span>
                            </div>
                            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/15 mt-2 text-emerald-400 font-bold text-[10px]">
                              💡 Livrable avancé réalloué : {timelineAdjustments.adjustedTechnicalPrototypeMilestone}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={`p-5 rounded-3xl border border-dashed ${themeBorder} space-y-2 text-left`}>
                    <h4 className="text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Fonctionnement algorithmique
                    </h4>
                    <p className={`text-[10px] ${themeTextSecondary} leading-relaxed`}>
                      Chaque fois qu'une association est créée par le moteur d'appariement Carthage, une équipe (Team) unifiée est instanciée, accompagnée de paramètres synchrones Figma / GitHub et d'un tableau analytique COGS d'hébergement vierge.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 3: PRISMA / SQL DATABASE SCHEMA SPECIFICATION */}
          {activeTab === "schema" && (
            <div id="schema-container-card" className={`p-6 md:p-8 rounded-3xl border transition-all ${themeCardBg}`}>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 mb-8 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-500">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-base font-bold font-sans tracking-wide">
                      Spécification du Schéma SQL de Base de Données
                    </h2>
                    <p className={`text-xs ${themeTextSecondary}`}>Jointures relationnelles d'intégrité pluridisciplinaire</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-800 dark:bg-slate-900/60 dark:text-slate-400 px-3 py-1 rounded-full uppercase border border-slate-200 dark:border-white/5">
                  Prisma ORM Structure
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                
                {/* Schema file description */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <h3 className={`text-sm font-bold ${themeTextPrimary} mb-1.5`}>Explorateur Interactif de Schéma</h3>
                    <p className={`text-xs ${themeTextSecondary} leading-relaxed`}>
                      Ce modèle relationnel garantit l'intégrité de l'écosystème en reliant le design (Figma), le code (GitHub issues), l'académique (Users) et la finance analytique (CostMetrics). Cliquez sur un modèle pour l'inspecter.
                    </p>
                  </div>

                  {/* INTERACTIVE TABLE SELECTOR */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {Object.keys(databaseTablesSchema).map((tbl) => (
                      <button
                        key={tbl}
                        onClick={() => setSelectedSchemaTable(tbl)}
                        className={`p-3 rounded-xl border text-[11px] font-mono font-bold transition-all text-center cursor-pointer ${
                          selectedSchemaTable === tbl 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                            : isLight 
                              ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100" 
                              : "bg-slate-950/40 border-white/5 hover:border-white/10 text-slate-300"
                        }`}
                      >
                        {tbl}
                      </button>
                    ))}
                  </div>

                  {/* TABLE DETAILS DISPLAY */}
                  <div className={`p-5 rounded-2xl ${themeSubCardBg} border ${themeBorder} space-y-4`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-500 font-mono text-xs font-bold uppercase">Table :</span>
                        <h4 className="text-sm font-extrabold font-mono text-slate-800 dark:text-white">{selectedSchemaTable}</h4>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${themeTextSecondary}`}>
                        {databaseTablesSchema[selectedSchemaTable].desc}
                      </p>
                    </div>

                    <div className="space-y-2 border-t border-slate-200/50 dark:border-white/5 pt-3">
                      <div className="text-[10px] font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide">Champs de données et typages</div>
                      
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {databaseTablesSchema[selectedSchemaTable].fields.map((f, i) => (
                          <div key={i} className="flex flex-col p-2 bg-white/60 dark:bg-slate-950/50 rounded-xl border border-slate-200/50 dark:border-white/5 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                {f.isKey && <span className="text-amber-500 text-[9px] font-bold">🔑</span>}
                                {f.name}
                              </span>
                              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-[10px] bg-indigo-500/5 px-2 py-0.5 rounded">
                                {f.type}
                              </span>
                            </div>
                            <p className={`text-[10px] mt-1 ${themeTextSecondary}`}>{f.descFr}</p>
                            {f.relation && (
                              <div className="text-[9px] font-mono text-blue-500 dark:text-blue-400 mt-1 uppercase font-bold">
                                🔗 Relation de clé vers : {f.relation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schema code container (7 Cols) */}
                <div className="lg:col-span-7">
                  <div className={`p-4 md:p-6 rounded-3xl bg-slate-950 border border-white/10 font-mono text-xs overflow-x-auto max-h-[600px] shadow-2xl relative text-left`}>
                    
                    <div className="absolute top-4 right-4 text-[9px] font-bold text-slate-500 uppercase bg-slate-900 border border-white/5 px-2 py-1 rounded">
                      prisma.schema
                    </div>
                    
                    <pre className="text-slate-300 leading-relaxed text-[11px]">
{`model Team {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  users     User[]
  project   Project?
}

model Project {
  id             String        @id @default(uuid())
  title          String
  domain         String // e.g., "AI & Deeptech", "E-Commerce"
  createdAt      DateTime      @default(now())
  teamId         String        @unique
  team           Team          @relation(fields: [teamId], references: [id])
  syncSettings   SyncSetting?
  apiLogs        ApiLog[]
  infrastructure CostMetric[]
}

model User {
  id           String         @id @default(uuid())
  name         String
  email        String         @unique
  role         String // "DEVELOPER" | "DESIGNER" | "BUSINESS"
  university   String // e.g., "INSAT", "IHEC", "Esprit"
  academicYear String // e.g., "5th Year", "3rd Year Licence"
  skills       String[] // Array of parsed skill tags
  teamId       String?
  team         Team?          @relation(fields: [teamId], references: [id])
  matchRequests MatchRequest[]
}

model MatchRequest {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  domainPref String // Preferred startup domain
  targetRoles String[] // Desired collaborator roles
  status     String // "PENDING" | "MATCHED" | "EXPIRED"
  createdAt  DateTime @default(now())
}

model SyncSetting {
  id              String  @id @default(uuid())
  projectId       String  @unique
  project         Project @relation(fields: [projectId], references: [id])
  figmaFileId     String?
  githubRepoOwner String?
  githubRepoName  String?
}

model ApiLog {
  id        String   @id @default(uuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  endpoint  String
  method    String
  bytesSent Int
  timestamp DateTime @default(now())
}

model CostMetric {
  id        String   @id @default(uuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  service   String // e.g., "OpenAI API", "AWS Lambda", "Postgres"
  costAmount Float // Calculated USD/TND cost
  unitType  String // e.g., "tokens", "executions", "gigabytes"
  updatedAt DateTime @updatedAt
}`}
                    </pre>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
