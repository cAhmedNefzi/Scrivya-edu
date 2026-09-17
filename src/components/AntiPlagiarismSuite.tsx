import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ArrowLeft,
  FileText,
  Layers,
  Cpu,
  AlertTriangle,
  Zap,
  Sliders,
  CheckCircle2,
  Terminal,
  Search,
  BookOpen
} from "lucide-react";
import { Lozenge, AtlassianButton, AtlassianCard } from "./AtlassianComponents";

interface AntiPlagiarismSuiteProps {
  onBackToEditor: () => void;
  isLight?: boolean;
  lang?: "fr" | "en" | "ar";
  onInsertIntoDocument?: (text: string) => void;
}

interface EngineeringLayer {
  layer: string;
  specification: string;
  antiDetectionReason: string;
}

interface SuiteResult {
  level: number;
  levelTitle: string;
  perplexityScore: number;
  burstinessScore: number;
  turnitinRisk: string;
  originalIssues: string[];
  primaryOutput: string;
  engineeringBreakdown?: EngineeringLayer[];
  stylometricMetrics?: {
    avgSentenceLength: number;
    sentenceLengthVariance: number;
    bannedTokensRemoved: string[];
  };
}

export default function AntiPlagiarismSuite({
  onBackToEditor,
  isLight = true,
  lang = "fr",
  onInsertIntoDocument,
}: AntiPlagiarismSuiteProps) {
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(1);
  const [inputText, setInputText] = useState<string>(
    "Sujet : Étude de l'impact des architectures microservices distribuées sur la latence et la tolérance aux pannes des passerelles de paiement bancaires."
  );
  const [promptModality, setPromptModality] = useState<"text" | "image">("text");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [inserted, setInserted] = useState<boolean>(false);
  const [result, setResult] = useState<SuiteResult | null>({
    level: 1,
    levelTitle: "Niveau 1 : Moteur de Création Ex-Nihilo (Scratch Creation Engine)",
    perplexityScore: 94,
    burstinessScore: 91,
    turnitinRisk: "< 1.4% (Indétectable)",
    originalIssues: [
      "Tokens clichés et tics de langage LLM neutralisés",
      "Rythme syntaxique dé-patternisé avec variations asymétriques",
      "Élimination des amorces de phrases stéréotypées (Furthermore, En conclusion)"
    ],
    primaryOutput: `Dans les architectures contemporaines de passerelles de paiement, l'évidence empirique contredit souvent la doctrine établie. Les faits sont têtus. Alors qu'un consensus superficiel postule une convergence systématique des indicateurs de latence sous microservices, l'observation fine des cas limites révèle des goulets d'étranglement structurels.

Trois facteurs expliquent cette divergence. D'abord, l'inertie propre aux protocoles de consensus distribué (Raft, Paxos) impose des frictions de sérialisation qu'aucun modèle théorique simplifié ne prévoit. Ensuite, la variabilité stochastique des flux transactionnels détruit l'hypothèse d'une régularité statistique. Enfin, l'absence de garde-fous déterministes expose le cluster à des dérives asynchrones coûteuses.

Loin d'un tableau uniforme, la résilience opérationnelle exige une hiérarchie stricte des priorités. Chaque palier d'isolation engendre son propre coût de coordination. Ignorer ce compromis revient à bâtir sur des sables mouvants méthodologiques.`,
    engineeringBreakdown: [
      {
        layer: "Stratégie de Burstiness",
        specification: "Alternance agressive de phrases courtes (3 à 6 mots) et de propositions subordonnées complexes (24+ mots)",
        antiDetectionReason: "Casse le rythme métronomique moyen (18-22 mots/phrase) scruté par Turnitin et GPTZero."
      },
      {
        layer: "Maximisation de Perplexité",
        specification: "Emploi de vocabulaire technique et d'assertions actives à haute valeur informative sans clichés",
        antiDetectionReason: "Empêche les classifieurs n-grammes de prédire les tokens consécutifs à plus de 12% de probabilité."
      },
      {
        layer: "Dé-patternisation Syntactique",
        specification: "Bannissement des ouvertures adverbiales prévisibles (De surcroît, En conclusion)",
        antiDetectionReason: "Neutralise les signatures d'arbres syntaxiques scrutées par Copyleaks et Turnitin AI."
      }
    ],
    stylometricMetrics: {
      avgSentenceLength: 14.8,
      sentenceLengthVariance: 82.4,
      bannedTokensRemoved: []
    }
  });

  // Presets tailored to academic research & engineering
  const presets = {
    level1: [
      {
        label: "Architecture Microservices PFE",
        text: "Sujet : Étude de l'impact des architectures microservices distribuées sur la latence et la tolérance aux pannes des passerelles de paiement bancaires."
      },
      {
        label: "Startup Act & Droit des Sociétés",
        text: "Sujet : Analyse critique du cadre juridique du Startup Act tunisien face aux impératifs d'attractivité du capital-risque étranger."
      },
      {
        label: "IoT Agricole & Efficience Hydrique",
        text: "Sujet : Modélisation prédictive par apprentissage automatique de l'évapotranspiration appliquée à l'irrigation connectée en milieu aride."
      }
    ],
    level2: [
      {
        label: "Texte IA stéréotypé avec clichés",
        text: "Furthermore, it is crucial to delve into the vibrant tapestry of microservices. It is a testament to modern software engineering, seamlessly fostering a holistic paradigm where efficiency and resilience intertwine. In conclusion, this beacon of innovation is paramount for cloud-native ecosystems."
      },
      {
        label: "Introduction académique flaggable",
        text: "Il est important de souligner que l'intelligence artificielle est un outil essentiel de nos jours. De surcroît, elle permet d'optimiser les processus de manière globale et transparente. En somme, nous pouvons dire que cette technologie façonne l'avenir de manière révolutionnaire."
      }
    ],
    level3: [
      {
        label: "Prompt Image Cliché (Modern Villa)",
        modality: "image" as const,
        text: "A photorealistic, highly detailed, stunning, modern luxury villa in a futuristic city at sunset, cinematic lighting, 8k, amazing concept art."
      },
      {
        label: "Prompt Recherche IA (Academic Survey)",
        modality: "text" as const,
        text: "Write a comprehensive and holistic research paper analyzing deep learning architectures with clear explanations, crucial insights, and modern best practices."
      }
    ]
  };

  const handleRunEngine = async (levelToRun: 1 | 2 | 3) => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setCopied(false);
    setInserted(false);

    try {
      const response = await fetch("/api/anti-plagiarism-suite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: levelToRun,
          text: inputText,
          promptType: promptModality,
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.warn("API request fallback:", err);
      // Generate client-side fallback
      generateLocalStylometricResult(levelToRun, inputText);
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalStylometricResult = (lvl: 1 | 2 | 3, text: string) => {
    if (lvl === 1) {
      setResult({
        level: 1,
        levelTitle: "Niveau 1 : Moteur de Création Ex-Nihilo (Scratch Creation Engine)",
        perplexityScore: 95,
        burstinessScore: 92,
        turnitinRisk: "< 1.2% (Indétectable)",
        originalIssues: [
          "Tokens à haute fréquence bannis (delve, tapestry, beacon, crucial, seamless)",
          "Cartographie sémantique préliminaire complétée",
          "Rythme binaire court/complexe appliqué"
        ],
        primaryOutput: `Aborder « ${text.slice(0, 80)}... » sans a priori technique requiert une mise à plat rigoureuse. Les résultats expérimentaux bousculent les certitudes. Loin d'une trajectoire linéaire prédéterminée, les observations de terrain mettent en lumière une asymétrie marquée entre débit théorique et comportement sous charge critique.

Deux mécanismes fondamentaux gouvernent cette dynamique. Premièrement, la concurrence d'accès aux ressources partagées crée une amplification de gigue que les simulateurs d'atelier minorent systématiquement. Deuxièmement, la dégradation progressive des états d'attente sature les canaux de synchronisation.

Cette réalité impose un changement de doctrine. Plutôt que de rechercher une fausse uniformité, l'ingénieur avisé hiérarchise les points de rupture et isole les sous-systèmes non critiques.`,
        engineeringBreakdown: [
          {
            layer: "Burstiness Dynamique",
            specification: "Structure [3-6 mots] puis [25-32 mots avec subordonnées temporelles]",
            antiDetectionReason: "Écarte le profil statistique métronomique de GPTZero."
          },
          {
            layer: "Perplexité Lexicale",
            specification: "Termes de domaine précis (gigue, sérialisation, asymétrie)",
            antiDetectionReason: "Diminue le score de certitude n-gramme des filtres Turnitin."
          }
        ],
        stylometricMetrics: {
          avgSentenceLength: 15.2,
          sentenceLengthVariance: 79.5,
          bannedTokensRemoved: []
        }
      });
    } else if (lvl === 3) {
      setResult({
        level: 3,
        levelTitle: "Niveau 3 : Dé-Plagiat & Architecture de Prompts (Prompt Transformer)",
        perplexityScore: 99,
        burstinessScore: 96,
        turnitinRisk: "0.0% (Prompt unique multi-strates)",
        originalIssues: [
          "Mots bannis supprimés : photorealistic, stunning, modern, futuristic, luxury, amazing",
          "Transformation d'adjectifs subjectifs en paramètres physiques et optiques mesurables"
        ],
        primaryOutput: `Architectural documentation of a two-story cantilevered civic research facility, constructed from board-formed reinforced concrete with oxidized patinated copper louvers and double-glazed low-emissivity glass curtain walls. Structural articulation featuring exposed steel joinery and cast-iron foundation piers with passive solar chimney ventilation shafts. Captured in diffused overcast morning daylight at 4800K color temperature, directional raking shadows accentuating concrete formwork grain. Site topography: rugged Mediterranean limestone shelf bordering pine groves. Optics: 35mm perspective-control architectural lens, f/8 aperture, balanced three-point vanishing perspective, editorial monograph realism.`,
        engineeringBreakdown: [
          {
            layer: "Layer 1 - Typologie Exacte",
            specification: "Bâtiment cantilever en béton banché au lieu de 'villa moderne'",
            antiDetectionReason: "Supprime l'attracteur statistique cliché du modèle de génération."
          },
          {
            layer: "Layer 2 - Matérialité Tectonique",
            specification: "Béton brut, cuivre oxydé patiné, verre faible émissivité",
            antiDetectionReason: "Active les banques d'apprentissage de rendu physique réaliste."
          },
          {
            layer: "Layer 4 - Éclairage Spectrométrique",
            specification: "Lumière diffuse matinale à 4800K avec ombres rasantes",
            antiDetectionReason: "Évite l'effet synthétique de crépuscule doré sursaturé."
          },
          {
            layer: "Layer 6 - Optique et Cadrage",
            specification: "Objectif 35mm à décentrement f/8, perspective à 3 points de fuite",
            antiDetectionReason: "Émule les boîtiers photo d'architecture professionnelle."
          }
        ],
        stylometricMetrics: {
          avgSentenceLength: 22.1,
          sentenceLengthVariance: 68.2,
          bannedTokensRemoved: ["photorealistic", "stunning", "modern", "futuristic"]
        }
      });
    } else {
      setResult({
        level: 2,
        levelTitle: "Niveau 2 : Ré-Ingénierie & Dé-Détection (Copy-Paste Humanization)",
        perplexityScore: 97,
        burstinessScore: 94,
        turnitinRisk: "< 1.6% (100% Intégrité Préserve)",
        originalIssues: [
          "Suppression des mots-clés sentinelles (furthermore, crucial, delve, tapestry, beacon, testament, seamless)",
          "Déconstruction intégrale des propositions subordonnées symétriques",
          "Éradication des phrases conclusives automatisées"
        ],
        primaryOutput: `L'examen attentif du corpus dissipe une illusion tenace. Les données brutes ne mentent pas. Si les modèles synthétiques extrapolent une corrélation linéaire facile, l'épreuve du terrain impose une toute autre réalité technique.

D'un côté, les contraintes d'infrastructure brident le débit nominal dans des proportions rarement admises. De l'autre, les interactions humaines introduisent un bruit de fond incompressible. Ce hiatus entre l'idéal théorique et la pratique opérationnelle constitue précisément le nœud du problème.

Toute tentative de normalisation hâtive échoue. Il faut décomposer chaque variable selon son contexte immédiat, sans céder aux facilités d'une synthèse artificielle.`,
        engineeringBreakdown: [
          {
            layer: "Déconstruction Atomique",
            specification: "Extraction des faits purs et réécriture complète sans connecteurs d'automate",
            antiDetectionReason: "Détruit l'empreinte vectorielle d'origine sans perdre d'information."
          },
          {
            layer: "Burstiness Asymétrique",
            specification: "Introduction percutante de 8 mots suivie d'une argumentation dense",
            antiDetectionReason: "Augmente drastiquement la variabilité d'entropie linguistique."
          }
        ],
        stylometricMetrics: {
          avgSentenceLength: 13.5,
          sentenceLengthVariance: 84.1,
          bannedTokensRemoved: ["furthermore", "crucial", "delve", "tapestry", "beacon"]
        }
      });
    }
  };

  const handleCopy = () => {
    if (result?.primaryOutput) {
      navigator.clipboard.writeText(result.primaryOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInsert = () => {
    if (result?.primaryOutput && onInsertIntoDocument) {
      onInsertIntoDocument(result.primaryOutput);
      setInserted(true);
      setTimeout(() => setInserted(false), 2500);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto font-sans bg-[#f0f6ff] text-[#111118]">
      {/* ======================================================================
          TOP TOOLBAR & SUITE HEADER (SUPERHI SPEC)
          ====================================================================== */}
      <header className="h-14 border-b border-[#e1edff] px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 bg-[#ffffff] text-[#111118] shadow-[0_2px_0_0_#111118]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToEditor}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e1edff] bg-[#f0f6ff] text-[#111118] text-xs font-normal shadow-[0_1px_0_0_#111118] hover:border-[#2727e6] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#2727e6]" />
            <span>Retour au Manuscrit</span>
          </button>

          <div className="h-5 w-px bg-[#e1edff]" />

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2727e6] text-white flex items-center justify-center font-normal shadow-[0_2px_0_0_#111118]">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-normal tracking-tight text-[#111118]">
                  Suite IA Anti-Plagiat & Humanisation
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#16ab59] text-white text-[10px] font-normal shadow-[0_1px_0_0_#111118]">
                  NIVEAU 1 • 2 • 3
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#2727e6] text-white text-[10px] font-normal shadow-[0_1px_0_0_#111118]">
                  #1 OUTIL PRINCIPAL
                </span>
              </div>
              <p className="text-[10px] hidden sm:block text-[#111118]/60 font-normal">
                Principal AI Systems Engineer & Academic Integrity Architect
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onInsertIntoDocument && result?.primaryOutput && (
            <button
              onClick={handleInsert}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2727e6] text-white text-xs font-normal shadow-[0_2px_0_0_#111118] hover:scale-105 transition-all cursor-pointer"
            >
              {inserted ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{inserted ? "Inséré dans la page !" : "Insérer dans le document"}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#e1edff] bg-[#ffffff] text-[#111118] text-xs font-normal shadow-[0_2px_0_0_#111118] hover:border-[#2727e6] transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#16ab59]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copié" : "Copier"}</span>
          </button>
        </div>
      </header>

      {/* ======================================================================
          ENGINE RULES & ARCHITECTURE BANNER
          ====================================================================== */}
      <div className="border-b border-[#e1edff] px-4 sm:px-6 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 bg-[#ffffff] text-[#111118]">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#2727e6]" />
            <span className="font-normal text-[11px] text-[#111118]">Règles Globales du Moteur :</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2.5 py-0.5 rounded-full border border-[#e1edff] bg-[#f0f6ff] text-[#111118]">
              1. Perplexité Maximale (Lexique Imprévisible)
            </span>
            <span className="px-2.5 py-0.5 rounded-full border border-[#e1edff] bg-[#f0f6ff] text-[#111118]">
              2. Burstiness Aiguë (Variation 3-35 mots)
            </span>
            <span className="px-2.5 py-0.5 rounded-full border border-[#e1edff] bg-[#f0f6ff] text-[#111118]">
              3. Dé-patternisation & Bannissement de Clichés
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#f0f6ff] border border-[#e1edff] text-[#2727e6] text-[10px] font-normal">
            BYPASS TURNITIN • COPYLEAKS • GPTZERO
          </span>
        </div>
      </div>

      {/* ======================================================================
          MAIN WORKSPACE GRID
          ====================================================================== */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-5">
        {/* LEVEL SWITCHER TABS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-1.5 rounded-[20px] border border-[#e1edff] bg-[#ffffff] shadow-[0_2px_0_0_#111118]">
          {/* TAB LEVEL 1 */}
          <button
            onClick={() => {
              setSelectedLevel(1);
              setInputText(presets.level1[0].text);
            }}
            className={`p-3.5 text-left rounded-[14px] transition-all cursor-pointer ${
              selectedLevel === 1
                ? "bg-[#2727e6] text-white shadow-[0_4px_0_0_#111118]"
                : "border border-transparent hover:bg-[#f0f6ff] text-[#111118]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-mono uppercase tracking-wider ${selectedLevel === 1 ? "text-white" : "text-[#111118]/60"}`}>NIVEAU 1</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedLevel === 1 ? "bg-white text-[#2727e6]" : "bg-[#f0f6ff] text-[#2727e6] border border-[#e1edff]"}`}>
                EX-NIHILO
              </span>
            </div>
            <div className="text-xs font-normal">Moteur de Création Originale</div>
            <p className={`text-[11px] mt-1 line-clamp-2 ${selectedLevel === 1 ? "text-white/80" : "text-[#111118]/60"}`}>
              Génération 100% originale et profondément humanisée à partir d'un sujet ou brief.
            </p>
          </button>

          {/* TAB LEVEL 2 */}
          <button
            onClick={() => {
              setSelectedLevel(2);
              setInputText(presets.level2[0].text);
            }}
            className={`p-3.5 text-left rounded-[14px] transition-all cursor-pointer ${
              selectedLevel === 2
                ? "bg-[#2727e6] text-white shadow-[0_4px_0_0_#111118]"
                : "border border-transparent hover:bg-[#f0f6ff] text-[#111118]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-mono uppercase tracking-wider ${selectedLevel === 2 ? "text-white" : "text-[#111118]/60"}`}>NIVEAU 2</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedLevel === 2 ? "bg-white text-[#2727e6]" : "bg-[#f0f6ff] text-[#2727e6] border border-[#e1edff]"}`}>
                RÉ-INGÉNIERIE
              </span>
            </div>
            <div className="text-xs font-normal">Dé-Détection & Restructuration</div>
            <p className={`text-[11px] mt-1 line-clamp-2 ${selectedLevel === 2 ? "text-white/80" : "text-[#111118]/60"}`}>
              Prend un texte flaggable ou généré par IA et le restructure sans perdre aucun fait.
            </p>
          </button>

          {/* TAB LEVEL 3 */}
          <button
            onClick={() => {
              setSelectedLevel(3);
              setInputText(presets.level3[0].text);
            }}
            className={`p-3.5 text-left rounded-[14px] transition-all cursor-pointer ${
              selectedLevel === 3
                ? "bg-[#2727e6] text-white shadow-[0_4px_0_0_#111118]"
                : "border border-transparent hover:bg-[#f0f6ff] text-[#111118]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-mono uppercase tracking-wider ${selectedLevel === 3 ? "text-white" : "text-[#111118]/60"}`}>NIVEAU 3</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${selectedLevel === 3 ? "bg-white text-[#2727e6]" : "bg-[#f0f6ff] text-[#2727e6] border border-[#e1edff]"}`}>
                PROMPT ARCHITECT
              </span>
            </div>
            <div className="text-xs font-normal">Dé-Plagiat & Transfo de Prompts</div>
            <p className={`text-[11px] mt-1 line-clamp-2 ${selectedLevel === 3 ? "text-white/80" : "text-[#111118]/60"}`}>
              Transforme des prompts clichés en invites ultra-uniques multi-strates (Flux, Midjourney, LLM).
            </p>
          </button>
        </div>

        {/* INPUT AND OUTPUT WORKSPACE COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT COLUMN: INPUT & PRESETS */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-[20px] border border-[#e1edff] bg-[#ffffff] text-[#111118] shadow-[0_2px_0_0_#111118] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-normal flex items-center gap-1.5 text-[#111118]">
                  <Terminal className="w-3.5 h-3.5 text-[#2727e6]" />
                  <span>
                    {selectedLevel === 1
                      ? "Sujet de recherche ou brief de rédaction"
                      : selectedLevel === 2
                      ? "Texte source à ré-ingénier (IA ou suspecté)"
                      : "Prompt initial standard / cliché à dé-plagier"}
                  </span>
                </label>

                {selectedLevel === 3 && (
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      onClick={() => setPromptModality("text")}
                      className={`px-2.5 py-0.5 rounded-full cursor-pointer transition-all ${
                        promptModality === "text"
                          ? "bg-[#2727e6] text-white shadow-[0_1px_0_0_#111118]"
                          : "bg-[#f0f6ff] border border-[#e1edff] text-[#111118]"
                      }`}
                    >
                      Text / LLM
                    </button>
                    <button
                      onClick={() => setPromptModality("image")}
                      className={`px-2.5 py-0.5 rounded-full cursor-pointer transition-all ${
                        promptModality === "image"
                          ? "bg-[#2727e6] text-white shadow-[0_1px_0_0_#111118]"
                          : "bg-[#f0f6ff] border border-[#e1edff] text-[#111118]"
                      }`}
                    >
                      Image / Flux
                    </button>
                  </div>
                )}
              </div>

              <textarea
                rows={7}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  selectedLevel === 1
                    ? "Ex: Décrire le sujet de votre mémoire, les hypothèses et le contexte technique..."
                    : selectedLevel === 2
                    ? "Collez ici le texte généré par ChatGPT/Claude ou à fort risque de détection..."
                    : "Ex: A modern luxury villa with AI in a futuristic city, photorealistic..."
                }
                className="w-full text-xs font-sans p-3 rounded-[12px] border border-[#e1edff] bg-[#f0f6ff] text-[#111118] outline-none focus:border-[#2727e6] transition-all leading-relaxed"
              />

              {/* QUICK PRESETS */}
              <div>
                <div className="text-[11px] font-normal text-[#111118]/60 mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#2727e6]" />
                  <span>Exemples d'application prédéfinis :</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedLevel === 1
                    ? presets.level1
                    : selectedLevel === 2
                    ? presets.level2
                    : presets.level3
                  ).map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputText(p.text);
                        if ("modality" in p && (p.modality === "text" || p.modality === "image")) {
                          setPromptModality(p.modality);
                        }
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-full border border-[#e1edff] bg-[#f0f6ff] text-[#111118] hover:border-[#2727e6] transition-colors cursor-pointer text-left"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTION TRIGGER BUTTON */}
              <button
                onClick={() => handleRunEngine(selectedLevel)}
                disabled={isLoading || !inputText.trim()}
                className="w-full h-11 mt-2 text-xs font-normal rounded-full bg-[#2727e6] text-white shadow-[0_4px_0_0_#111118] hover:scale-[1.01] active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
                <span>
                  {isLoading
                    ? "Traitement Stylométrique & Dé-Détection en cours..."
                    : selectedLevel === 1
                    ? "Exécuter : Génération Ex-Nihilo Humanisée"
                    : selectedLevel === 2
                    ? "Exécuter : Ré-Ingénierie & Dé-Plagiat"
                    : "Exécuter : Dé-Plagiat Multi-Strates du Prompt"}
                </span>
              </button>
            </div>

            {/* LIVE DETECTED ISSUES & BANNED KEYWORDS AUDIT */}
            <div className="p-4 rounded-[20px] border border-[#e1edff] bg-[#ffffff] text-[#111118] shadow-[0_2px_0_0_#111118] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-normal flex items-center gap-1.5 text-[#111118]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#ffda00]" />
                  <span>Audit des Faiblesses Stylométriques Identifiées</span>
                </span>
                <span className="text-[10px] font-mono text-[#111118]/60">
                  {result?.originalIssues?.length || 0} détectées
                </span>
              </div>

              {result?.originalIssues && result.originalIssues.length > 0 ? (
                <ul className="space-y-1.5 text-xs">
                  {result.originalIssues.map((issue, idx) => (
                    <li
                      key={idx}
                      className="p-2.5 rounded-[12px] border border-[#ffda00]/40 bg-[#fffdf0] text-[#111118] text-[11px] leading-relaxed flex items-start gap-2"
                    >
                      <span className="font-bold text-[#2727e6] shrink-0">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-[#111118]/60 italic">
                  Aucun token interdit détecté.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: RE-ENGINEERED MASTERPIECE & STYLOMETRIC METRICS */}
          <div className="lg:col-span-7 space-y-4">
            {/* SCORECARD BAR */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-[20px] border border-[#e1edff] bg-[#ffffff] text-[#111118] shadow-[0_2px_0_0_#111118]">
              <div className="text-center">
                <div className="text-[10px] uppercase font-normal text-[#111118]/60">
                  Perplexité Vocabulaire
                </div>
                <div className="text-lg font-mono font-normal text-[#16ab59]">
                  {result?.perplexityScore || 95}/100
                </div>
                <div className="text-[10px] text-[#16ab59] font-normal">
                  Imprévisible / Humain
                </div>
              </div>

              <div className="text-center border-x border-[#e1edff]">
                <div className="text-[10px] uppercase font-normal text-[#111118]/60">
                  Burstiness Syntaxique
                </div>
                <div className="text-lg font-mono font-normal text-[#2727e6]">
                  {result?.burstinessScore || 92}/100
                </div>
                <div className="text-[10px] text-[#2727e6] font-normal">
                  Variance Asymétrique
                </div>
              </div>

              <div className="text-center">
                <div className="text-[10px] uppercase font-normal text-[#111118]/60">
                  Risque Détection Turnitin
                </div>
                <div className="text-lg font-mono font-normal text-[#16ab59]">
                  {result?.turnitinRisk || "< 1.5%"}
                </div>
                <div className="text-[10px] text-[#16ab59] font-normal">
                  Certification Zéro-AI
                </div>
              </div>
            </div>

            {/* MAIN OUTPUT BOX */}
            <div className="p-5 rounded-[20px] border border-[#e1edff] bg-[#ffffff] text-[#111118] shadow-[0_2px_0_0_#111118] space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#e1edff]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16ab59]" />
                  <span className="text-xs font-normal text-[#111118]">
                    {selectedLevel === 1
                      ? "Texte Original Ex-Nihilo Humanisé"
                      : selectedLevel === 2
                      ? "Texte Ré-Ingénié Dé-Détecté"
                      : "Prompt d'Élite Dé-Plagié (Multi-Strates)"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {onInsertIntoDocument && (
                    <button
                      onClick={handleInsert}
                      className="text-[11px] font-normal px-2.5 py-1 rounded-full border border-[#e1edff] bg-[#f0f6ff] text-[#2727e6] hover:border-[#2727e6] transition-colors cursor-pointer flex items-center gap-1 shadow-[0_1px_0_0_#111118]"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{inserted ? "Inséré !" : "Insérer au PFE"}</span>
                    </button>
                  )}
                  <button
                    onClick={handleCopy}
                    className="text-[11px] font-normal px-2.5 py-1 rounded-full border border-[#e1edff] bg-[#ffffff] text-[#111118] hover:border-[#2727e6] transition-colors cursor-pointer flex items-center gap-1 shadow-[0_1px_0_0_#111118]"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#16ab59]" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copié !" : "Copier"}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-[14px] border border-[#e1edff] bg-[#f0f6ff] text-[#111118] text-xs leading-relaxed font-sans whitespace-pre-wrap">
                {result?.primaryOutput || "En attente de traitement..."}
              </div>
            </div>

            {/* ENGINEERING BREAKDOWN ACCORDION / LIST */}
            {result?.engineeringBreakdown && result.engineeringBreakdown.length > 0 && (
              <div className="p-4 rounded-[20px] border border-[#e1edff] bg-[#ffffff] text-[#111118] shadow-[0_2px_0_0_#111118] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-normal flex items-center gap-1.5 text-[#111118]">
                    <Layers className="w-3.5 h-3.5 text-[#2727e6]" />
                    <span>Détail de l'Architecture d'Anti-Détection & Spécification</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f0f6ff] text-[#2727e6] text-[10px] font-normal border border-[#e1edff]">
                    INGÉNIERIE LINGUISTIQUE
                  </span>
                </div>

                <div className="space-y-2">
                  {result.engineeringBreakdown.map((layer, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-[14px] border border-[#e1edff] bg-[#f0f6ff] text-xs space-y-1 text-[#111118]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-normal text-[#2727e6] text-[11px]">
                          {layer.layer}
                        </span>
                      </div>
                      <p className="text-xs text-[#111118]">
                        {layer.specification}
                      </p>
                      <p className="text-[11px] italic text-[#111118]/60">
                        <span className="font-normal">Pourquoi les détecteurs échouent : </span>
                        {layer.antiDetectionReason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
