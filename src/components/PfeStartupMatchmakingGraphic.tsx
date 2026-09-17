import React, { useState } from "react";
import {
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  FileText,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  School,
  Building,
  Target,
  Rocket,
  Check,
  Sparkles,
  RefreshCw,
  Search,
  Scale
} from "lucide-react";
import { Lozenge } from "./AtlassianComponents";

interface PfeStartupMatchmakingGraphicProps {
  lang?: "fr" | "en" | "ar";
  theme?: "dark" | "light";
  onOpenWorkspace: () => void;
}

export default function PfeStartupMatchmakingGraphic({
  lang = "fr",
  onOpenWorkspace,
}: PfeStartupMatchmakingGraphicProps) {
  const [activeTab, setActiveTab] = useState<"concept" | "matchmaker" | "evaluation">("concept");
  const [selectedRole, setSelectedRole] = useState<"dev" | "marketer">("dev");
  const [selectedProfileId, setSelectedProfileId] = useState<string>("m1");

  // Candidates data
  const marketerCandidates = [
    {
      id: "m1",
      name: "Syrine Ben Amor",
      school: "IHEC Carthage • Master Entrepreneuriat & Finance",
      compatibility: "98%",
      skills: ["Stratégie SaaS", "Business Model", "Dossier Startup Act", "Pricing TND/USD"],
      thesisTopic: "Modélisation financière et stratégies de tarification pour les SaaS B2B en Tunisie",
      seeking: "Ingénieur logiciel spécialisé dans les architectures cloud distribuées",
      cogsMastery: "Maîtrise le calcul COGS < 30%",
      avatarColor: "bg-[#2727e6]"
    },
    {
      id: "m2",
      name: "Mohamed Ali Trabelsi",
      school: "TBS (Tunis Business School) • Business Analytics",
      compatibility: "94%",
      skills: ["Data-driven Growth", "Études de Marché TAM/SAM", "Recherche Partenaires"],
      thesisTopic: "Adoption des solutions de conformité automatisée dans le secteur bancaire nord-africain",
      seeking: "Développeur Full-stack ou DevOps",
      cogsMastery: "Expert calcul marge brute d'exploitation",
      avatarColor: "bg-[#16ab59]"
    },
    {
      id: "m3",
      name: "Amira Jaziri",
      school: "MSB (Mediterranean School of Business) • Marketing & Vente",
      compatibility: "91%",
      skills: ["Prospection B2B", "Pitch Investisseurs", "Stratégie Go-to-Market"],
      thesisTopic: "Acquisition client à faible coût pour startups technologiques émergentes",
      seeking: "Développeur IA ou Ingénieur Système",
      cogsMastery: "Audit des dépenses opérationnelles",
      avatarColor: "bg-[#ff4141]"
    }
  ];

  const devCandidates = [
    {
      id: "d1",
      name: "Ahmed Sassi",
      school: "INSAT • Génie Logiciel (Promotion 2026)",
      compatibility: "99%",
      skills: ["React/TypeScript", "PostgreSQL", "AWS Architectures", "Docker/K8s"],
      thesisTopic: "Conception d'une plateforme d'évaluation automatisée de conformité financière",
      seeking: "Cofondateur orienté finance ou développement commercial",
      cogsMastery: "Optimisation serveurs : coût unitaire < 0.0003 TND",
      avatarColor: "bg-[#2727e6]"
    },
    {
      id: "d2",
      name: "Youssef Chahed",
      school: "SUP'COM • Ingénierie Télécoms & Réseaux",
      compatibility: "95%",
      skills: ["Microservices", "Sécurité Réseaux", "Bases de données SQL", "Cloud GCP"],
      thesisTopic: "Architecture temps réel pour l'analyse de flux financiers transfrontaliers",
      seeking: "Marketeur spécialisé en Fintech et réglementation bancaire",
      cogsMastery: "Audit coûts bande passante et stockage",
      avatarColor: "bg-[#16ab59]"
    },
    {
      id: "d3",
      name: "Mariem Mansouri",
      school: "ENIT • Génie Informatique & Systèmes",
      compatibility: "92%",
      skills: ["Python", "FastAPI", "Algorithmes d'optimisation", "API REST"],
      thesisTopic: "Moteur de recommandations croisées pour la gestion de projets universitaires",
      seeking: "Étudiant IHEC ou ISG pour le volet commercial",
      cogsMastery: "Calcul du coût par calcul serveur",
      avatarColor: "bg-[#ff4141]"
    }
  ];

  // Preset evaluation subjects
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [customIdeaInput, setCustomIdeaInput] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  const presets = [
    {
      title: "Fintech PFE • Plateforme de Détection de Fraude pour Banques Maghrébines",
      universities: "INSAT (Génie Logiciel) + IHEC (Finance)",
      noveltyScore: 94,
      cogsEstimate: "18.4% du CA (Conforme < 30%)",
      marketPotential: "140M TND (Tunisie, Algérie, Maroc)",
      category: "FINTECH & CONFORMITÉ",
      description: "Système de scoring transactionnel en temps réel pour institutions financières, conforme aux directives de la Banque Centrale de Tunisie.",
      businessModel: "Abonnement mensuel par volume de transactions (B2B SaaS).",
      recommendedCoFounder: "Profil ingénieur en sécurité des systèmes d'information."
    },
    {
      title: "Healthtech PFE • Dossier Médical Partagé & Télémédecine Décentralisée",
      universities: "ENIT (Informatique) + TBS (Management Hospitalier)",
      noveltyScore: 91,
      cogsEstimate: "14.2% du CA (Conforme < 30%)",
      marketPotential: "85M TND (Cliniques privées & cabinets)",
      category: "SANTÉ & DATA",
      description: "Archivage sécurisé des antécédents médicaux avec conformité à l'INPDP (Protection des données personnelles en Tunisie).",
      businessModel: "Licence annuelle par praticien de santé.",
      recommendedCoFounder: "Profil en réglementation médicale et relations hospitalières."
    },
    {
      title: "Agritech PFE • Optimisation de l'Irrigation par Capteurs et Modèles Météorologiques",
      universities: "SUP'COM (IoT/Réseaux) + INAT (Agronomie) + IHEC (Agrobusiness)",
      noveltyScore: 96,
      cogsEstimate: "22.8% du CA (Conforme < 30%)",
      marketPotential: "220M TND (Exportations d'huile d'olive & dattes)",
      category: "AGRITECH & IOT",
      description: "Réseau de capteurs connectés à basse consommation mesurant le stress hydrique des oliveraies tunisiennes.",
      businessModel: "Vente du matériel connecté + abonnement aux prévisions d'arrosage.",
      recommendedCoFounder: "Profil commercial pour le réseau de coopératives agricoles."
    }
  ];

  const currentPreset = presets[selectedPresetIndex];

  const handleTestCustomIdea = () => {
    if (!customIdeaInput.trim()) return;
    setIsReviewing(true);
    setTimeout(() => {
      setIsReviewing(false);
    }, 800);
  };

  return (
    <section 
      id="pfe-startup-matchmaking"
      className="py-16 md:py-20 font-sans relative bg-[#ffffff] text-[#111118]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="superhi-tag text-xs">LE CONCEPT PFE-HUB</span>
            <span className="superhi-tag text-xs bg-[#16ab59]/15 text-[#16ab59]">DEUX ÉTUDIANTS • UN PFE • UNE VRAIE STARTUP</span>
            <span className="superhi-tag text-xs bg-[#2727e6]/15 text-[#2727e6]">STARTUP ACT ÉLIGIBLE</span>
          </div>

          <h2
            className="text-3xl sm:text-[42px] font-normal tracking-[-0.378px] text-[#111118] leading-[1.1]"
            style={{ fontFamily: "var(--font-haas-grot-disp)" }}
          >
            Pourquoi laisser votre PFE dans un tiroir ? Transformez-le en startup labellisée.
          </h2>

          <p className="text-[17px] text-[#111118]/70 leading-relaxed font-normal">
            Chaque année, 90% des projets de fin d'études d'excellence sont oubliés après la soutenance. 
            <strong className="text-[#111118] font-normal"> Scrivya résout ce paradoxe</strong> : nous associons un <strong className="text-[#111118] font-normal">étudiant développeur (INSAT, ENIT, SUP'COM)</strong> 
            et un <strong className="text-[#111118] font-normal">étudiant marketeur/stratège (IHEC, TBS, MSB)</strong> sur une même problématique d'innovation pour valider le diplôme et déposer directement le label <strong className="text-[#111118] font-normal">Startup Act</strong>.
          </p>

          {/* Section Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 pt-3">
            <div className="p-1.5 rounded-full border border-[#e1edff] bg-[#f0f6ff] flex gap-1">
              <button
                onClick={() => setActiveTab("concept")}
                className={`px-5 py-2 rounded-full text-xs font-normal transition-all cursor-pointer ${
                  activeTab === "concept"
                    ? "bg-[#2727e6] text-[#ffffff] shadow-[0_2px_0_0_#111118]"
                    : "text-[#111118]/70 hover:text-[#111118]"
                }`}
              >
                1. Schéma du Concept
              </button>
              <button
                onClick={() => setActiveTab("matchmaker")}
                className={`px-5 py-2 rounded-full text-xs font-normal transition-all cursor-pointer ${
                  activeTab === "matchmaker"
                    ? "bg-[#2727e6] text-[#ffffff] shadow-[0_2px_0_0_#111118]"
                    : "text-[#111118]/70 hover:text-[#111118]"
                }`}
              >
                2. Simulateur Matchmaking
              </button>
              <button
                onClick={() => setActiveTab("evaluation")}
                className={`px-5 py-2 rounded-full text-xs font-normal transition-all cursor-pointer ${
                  activeTab === "evaluation"
                    ? "bg-[#2727e6] text-[#ffffff] shadow-[0_2px_0_0_#111118]"
                    : "text-[#111118]/70 hover:text-[#111118]"
                }`}
              >
                3. Grille d'Évaluation & Soutenance
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Concept Schema */}
        {activeTab === "concept" && (
          <div className="space-y-6">
            <div className="superhi-card space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                
                {/* Profile Tech */}
                <div className="p-6 rounded-[20px] bg-[#f0f6ff] border border-[#e1edff] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="superhi-tag text-xs bg-[#2727e6] text-white">PROFIL 1 : INGÉNIEUR TECH</span>
                    <span className="text-xs font-mono text-[#111118]/60">INSAT • SUP'COM • ESPRIT</span>
                  </div>
                  <h3 className="text-xl font-normal text-[#111118]">
                    Architecture logicielle & Rigueur scientifique
                  </h3>
                  <ul className="space-y-2 text-sm text-[#111118]/80 font-normal">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16ab59] shrink-0" />
                      <span>Développement du prototype et de l'infrastructure scalable</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16ab59] shrink-0" />
                      <span>Rédaction du mémoire technique conforme à la norme AFNOR</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16ab59] shrink-0" />
                      <span>Optimisation rigoureuse des coûts cloud pour respecter le seuil légal</span>
                    </li>
                  </ul>
                </div>

                {/* Profile Business */}
                <div className="p-6 rounded-[20px] bg-[#f0f6ff] border border-[#e1edff] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="superhi-tag text-xs bg-[#16ab59] text-white">PROFIL 2 : STRATÈGE BUSINESS</span>
                    <span className="text-xs font-mono text-[#111118]/60">IHEC • TBS • MSB</span>
                  </div>
                  <h3 className="text-xl font-normal text-[#111118]">
                    Validation marché & Modélisation financière
                  </h3>
                  <ul className="space-y-2 text-sm text-[#111118]/80 font-normal">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16ab59] shrink-0" />
                      <span>Entretiens clients et validation de la demande réelle</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16ab59] shrink-0" />
                      <span>Montage du dossier juridique et financier Startup Act</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16ab59] shrink-0" />
                      <span>Préparation du pitch investisseurs post-soutenance</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Bottom Result Banner */}
              <div className="p-5 rounded-[20px] bg-[#16ab59]/10 border border-[#16ab59]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#16ab59] text-white flex items-center justify-center shrink-0">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-normal text-[#111118]">RÉSULTAT DIRECT EN FIN DE SEMESTRE :</span>
                      <span className="superhi-tag text-xs bg-[#16ab59] text-white">STARTUP ACT TUNISIE</span>
                    </div>
                    <p className="text-xs text-[#111118]/70 mt-0.5">
                      Diplôme d'ingénieur ou Master validé + entreprise légalement immatriculée + bourses et exonérations d'impôts.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onOpenWorkspace}
                  className="superhi-btn-primary cursor-pointer text-xs shrink-0"
                >
                  <span>Créer mon trinôme</span>
                  <span className="text-base font-normal">→</span>
                </button>
              </div>

            </div>

            {/* 4 Steps Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="superhi-card space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#2727e6]">ÉTAPE 01</span>
                  <span className="superhi-tag text-xs">AVANT DÉPART</span>
                </div>
                <h4 className="text-sm font-normal text-[#111118]">Pacte de Co-Fondateurs</h4>
                <p className="text-xs text-[#111118]/70 leading-relaxed font-normal">
                  Rapprochement des étudiants par complémentarité technique et commerciale, charte de co-fondateurs et calendrier commun.
                </p>
              </div>

              <div className="superhi-card space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#2727e6]">ÉTAPE 02</span>
                  <span className="superhi-tag text-xs">MOIS 1 À 4</span>
                </div>
                <h4 className="text-sm font-normal text-[#111118]">Sprint PFE & MVP</h4>
                <p className="text-xs text-[#111118]/70 leading-relaxed font-normal">
                  Développement du produit logiciel fonctionnel en parallèle de l'étude de faisabilité commerciale et du dimensionnement cloud.
                </p>
              </div>

              <div className="superhi-card space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#16ab59]">ÉTAPE 03</span>
                  <span className="superhi-tag text-xs bg-[#16ab59]/15 text-[#16ab59]">MOIS 5 : JUIN</span>
                </div>
                <h4 className="text-sm font-normal text-[#111118]">Soutenance Académique</h4>
                <p className="text-xs text-[#111118]/70 leading-relaxed font-normal">
                  Présentation devant le jury d'évaluation universitaire avec mémoire normé AFNOR et preuve de traction concrète.
                </p>
              </div>

              <div className="superhi-card space-y-2 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#ffda00]">ÉTAPE 04</span>
                  <span className="superhi-tag text-xs bg-[#ffda00]/30 text-[#111118]">POST-DIPLÔME</span>
                </div>
                <h4 className="text-sm font-normal text-[#111118]">Labellisation Officielle</h4>
                <p className="text-xs text-[#111118]/70 leading-relaxed font-normal">
                  Dépôt du dossier au Collège Startup Act. Obtention du label, comptes devises et amorçage auprès d'investisseurs.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Matchmaker */}
        {activeTab === "matchmaker" && (
          <div className="superhi-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1edff] pb-4">
              <div>
                <h3 className="text-lg font-normal text-[#111118]">
                  Simulateur de Binôme Co-fondateur PFE
                </h3>
                <p className="text-xs text-[#111118]/70 font-normal">
                  Sélectionnez votre profil actuel pour découvrir vos cofondateurs idéaux inscrits dans le réseau Carthage/Tunisie.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#111118]/70 font-normal">Mon profil :</span>
                <div className="flex p-1 rounded-full bg-[#f0f6ff] border border-[#e1edff]">
                  <button
                    onClick={() => setSelectedRole("dev")}
                    className={`px-4 py-1 text-xs rounded-full font-normal transition-all cursor-pointer ${
                      selectedRole === "dev"
                        ? "bg-[#2727e6] text-[#ffffff] shadow-[0_2px_0_0_#111118]"
                        : "text-[#111118]/70 hover:text-[#111118]"
                    }`}
                  >
                    Développeur (Tech)
                  </button>
                  <button
                    onClick={() => setSelectedRole("marketer")}
                    className={`px-4 py-1 text-xs rounded-full font-normal transition-all cursor-pointer ${
                      selectedRole === "marketer"
                        ? "bg-[#2727e6] text-[#ffffff] shadow-[0_2px_0_0_#111118]"
                        : "text-[#111118]/70 hover:text-[#111118]"
                    }`}
                  >
                    Marketeur (Business)
                  </button>
                </div>
              </div>
            </div>

            {/* Candidate profiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(selectedRole === "dev" ? marketerCandidates : devCandidates).map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => setSelectedProfileId(profile.id)}
                  className={`p-5 rounded-[20px] border transition-all cursor-pointer relative space-y-3 ${
                    selectedProfileId === profile.id
                      ? "border-[#2727e6] bg-[#f0f6ff] shadow-[0_4px_0_0_#111118]"
                      : "border-[#e1edff] bg-[#ffffff] shadow-[0_2px_0_0_#111118] hover:border-[#2727e6]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full ${profile.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                        {profile.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h4 className="text-xs font-normal text-[#111118]">{profile.name}</h4>
                        <p className="text-[11px] text-[#111118]/60 font-normal">{profile.school}</p>
                      </div>
                    </div>

                    <span className="superhi-tag text-xs bg-[#16ab59]/15 text-[#16ab59]">
                      {profile.compatibility}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-[#111118]/60 uppercase">Sujet de recherche :</span>
                      <p className="text-xs text-[#111118] font-normal mt-0.5">"{profile.thesisTopic}"</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#111118]/60 uppercase">Recherche :</span>
                      <p className="text-xs text-[#2727e6] font-normal mt-0.5">{profile.seeking}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#e1edff] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#16ab59]">✓ {profile.cogsMastery}</span>
                    <button
                      onClick={onOpenWorkspace}
                      className="text-xs text-[#2727e6] hover:underline font-normal cursor-pointer"
                    >
                      Connecter →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Evaluation & Soutenance Matrix */}
        {activeTab === "evaluation" && (
          <div className="superhi-card space-y-6">
            <div className="flex items-center justify-between border-b border-[#e1edff] pb-4">
              <div>
                <h3 className="text-lg font-normal text-[#111118]">
                  Grille d'Évaluation Académique & Audit Startup Act
                </h3>
                <p className="text-xs text-[#111118]/70 font-normal mt-0.5">
                  Testez la viabilité de votre sujet face aux critères du jury universitaire et du comité d'agrément ministériel.
                </p>
              </div>
              <span className="superhi-tag text-xs">GRILLE OFFICIELLE 2026</span>
            </div>

            {/* Preset Selector */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#111118]/70 uppercase">Exemples de Projets PFE Récents :</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPresetIndex(idx)}
                    className={`p-3 rounded-[16px] text-left border transition-all cursor-pointer ${
                      selectedPresetIndex === idx
                        ? "border-[#2727e6] bg-[#f0f6ff] shadow-[0_2px_0_0_#111118]"
                        : "border-[#e1edff] bg-[#ffffff] hover:border-[#2727e6]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#2727e6] uppercase">{preset.category}</span>
                      <span className="superhi-tag text-[10px] bg-[#16ab59]/15 text-[#16ab59]">{preset.noveltyScore}/100</span>
                    </div>
                    <div className="text-xs font-normal text-[#111118] mt-1 line-clamp-1">{preset.title.split(" • ")[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Preset Breakdown */}
            <div className="p-6 rounded-[20px] bg-[#f0f6ff] border border-[#e1edff] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e1edff] pb-3">
                <div>
                  <h4 className="text-base font-normal text-[#111118]">{currentPreset.title}</h4>
                  <p className="text-xs text-[#2727e6] font-normal">{currentPreset.universities}</p>
                </div>
                <span className="superhi-tag text-xs bg-[#2727e6] text-white">
                  Score Rigueur Académique : {currentPreset.noveltyScore}%
                </span>
              </div>

              <p className="text-sm text-[#111118]/80 leading-relaxed font-normal">
                {currentPreset.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-[16px] bg-[#ffffff] border border-[#e1edff] space-y-1">
                  <div className="text-[11px] font-mono text-[#111118]/60 uppercase">Audit COGS Serveurs</div>
                  <div className="text-base font-normal text-[#16ab59] font-mono">{currentPreset.cogsEstimate}</div>
                  <div className="text-[11px] text-[#111118]/70">Critère légal vérifié d'office</div>
                </div>

                <div className="p-4 rounded-[16px] bg-[#ffffff] border border-[#e1edff] space-y-1">
                  <div className="text-[11px] font-mono text-[#111118]/60 uppercase">Marché Adressable (TAM)</div>
                  <div className="text-base font-normal text-[#111118] font-mono">{currentPreset.marketPotential}</div>
                  <div className="text-[11px] text-[#111118]/70">Afrique du Nord & Moyen-Orient</div>
                </div>

                <div className="p-4 rounded-[16px] bg-[#ffffff] border border-[#e1edff] space-y-1">
                  <div className="text-[11px] font-mono text-[#111118]/60 uppercase">Loi Startup Act 2018-20</div>
                  <div className="text-base font-normal text-[#2727e6] font-mono">Conforme</div>
                  <div className="text-[11px] text-[#111118]/70">4/4 critères validés</div>
                </div>
              </div>

              {/* Custom Subject Evaluation */}
              <div className="pt-3 border-t border-[#e1edff] space-y-2">
                <span className="text-xs font-mono text-[#111118]/70 uppercase block">
                  Évaluer un sujet de recherche personnalisé :
                </span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={customIdeaInput}
                    onChange={(e) => setCustomIdeaInput(e.target.value)}
                    placeholder="Ex: Système distribué d'optimisation de trésorerie pour PME tunisiennes..."
                    className="superhi-input flex-1 text-xs"
                  />
                  <button
                    onClick={handleTestCustomIdea}
                    disabled={isReviewing || !customIdeaInput.trim()}
                    className="superhi-btn-primary superhi-btn-compact cursor-pointer"
                  >
                    <span>{isReviewing ? "Évaluation en cours..." : "Auditer le sujet"}</span>
                    <span className="text-base font-normal">→</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
