import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  Presentation as PresentationIcon, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Download, 
  Eye, 
  Move, 
  Image as ImageIcon, 
  Smile, 
  Shapes, 
  RefreshCw, 
  Search, 
  Maximize2, 
  FileDown, 
  ArrowLeftRight, 
  Code,
  Layers,
  Palette,
  Check,
  Type
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";

// ==========================================
// TYPES & INTERFACES
// ==========================================
export interface CanvasElement {
  id: string;
  type: "shape" | "emoji" | "image" | "text";
  content: string; // SVG path, emoji string, image URL, or text value
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage or px
  height: number;
  color?: string;
  fontSize?: number;
}

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];
  layout: "split" | "text-only" | "cards" | "hero" | "chart";
  visualElement?: {
    type: "circle" | "graph" | "bento" | "quote" | "stats";
    title: string;
    data: string[];
  };
  imageUrl?: string;
  canvasElements?: CanvasElement[];
}

export interface Presentation {
  title: string;
  theme: string;
  slides: Slide[];
}

interface PresentationMakerProps {
  onBackToEditor: () => void;
  isLight: boolean;
}

// ==========================================
// STATIC PRESETS & CONSTANTS
// ==========================================
const THEME_PRESETS = [
  {
    id: "Ember",
    name: "Ember Gradient",
    bg: "bg-slate-950 text-slate-100",
    canvasBg: "bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-950/30",
    accent: "#f59e0b",
    secondary: "#ef4444",
    font: "font-display",
    glowColor: "rgba(245, 158, 11, 0.12)",
    gridColor: "rgba(255, 255, 255, 0.025)"
  },
  {
    id: "Ultraviolet",
    name: "Ultraviolet Neo",
    bg: "bg-slate-950 text-slate-100",
    canvasBg: "bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/35",
    accent: "#8b5cf6",
    secondary: "#ec4899",
    font: "font-display",
    glowColor: "rgba(139, 92, 246, 0.12)",
    gridColor: "rgba(255, 255, 255, 0.025)"
  },
  {
    id: "Retrowave",
    name: "Retrowave Grid",
    bg: "bg-zinc-950 text-pink-100",
    canvasBg: "bg-gradient-to-b from-purple-950/20 via-black to-zinc-950",
    accent: "#f43f5e",
    secondary: "#06b6d4",
    font: "font-mono",
    glowColor: "rgba(244, 63, 94, 0.12)",
    gridColor: "rgba(244, 63, 94, 0.04)"
  },
  {
    id: "Coral",
    name: "Coral Whisper",
    bg: "bg-slate-900 text-slate-100",
    canvasBg: "bg-gradient-to-tr from-slate-900 via-slate-950 to-rose-950/30",
    accent: "#f43f5e",
    secondary: "#fb7185",
    font: "font-display",
    glowColor: "rgba(244, 63, 94, 0.12)",
    gridColor: "rgba(255, 255, 255, 0.02)"
  },
  {
    id: "Classic Academic",
    name: "Classic Academic",
    bg: "bg-white text-slate-900 border border-slate-200",
    canvasBg: "bg-slate-50",
    accent: "#1e3a8a",
    secondary: "#475569",
    font: "font-sans",
    glowColor: "rgba(30, 58, 138, 0.04)",
    gridColor: "rgba(15, 23, 42, 0.03)"
  },
  {
    id: "Futuristic Tech",
    name: "Futuristic Tech",
    bg: "bg-slate-950 text-emerald-100",
    canvasBg: "bg-slate-950",
    accent: "#10b981",
    secondary: "#06b6d4",
    font: "font-mono",
    glowColor: "rgba(16, 185, 129, 0.1)",
    gridColor: "rgba(16, 185, 129, 0.03)"
  }
];

const SHAPE_ASSETS = [
  { id: "rect", label: "Rectangle", path: "M 10 10 H 90 V 90 H 10 Z" },
  { id: "circle", label: "Cercle", path: "M 50 50 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0" },
  { id: "triangle", label: "Triangle", path: "M 50 10 L 90 90 L 10 90 Z" },
  { id: "hexagon", label: "Hexagone", path: "M 50 10 L 90 30 L 90 70 L 50 90 L 10 70 L 10 30 Z" },
  { id: "arrow", label: "Flèche", path: "M 10 40 H 60 V 20 L 90 50 L 60 80 V 60 H 10 Z" },
  { id: "star", label: "Étoile", path: "M 50 10 L 61 38 L 91 38 L 67 56 L 76 84 L 50 67 L 24 84 L 33 56 L 9 38 L 39 38 Z" },
  { id: "bubble", label: "Bulle de texte", path: "M 10 10 H 90 V 70 H 40 L 20 90 V 70 H 10 Z" }
];

const EMOJI_ASSETS = [
  { category: "Académique", items: ["🎓", "🏫", "📚", "🔬", "🧬", "🪐", "📖", "📝", "📊", "📐", "🧠", "🎓"] },
  { category: "Technologie", items: ["💻", "📱", "🤖", "⚙️", "💡", "🔋", "💾", "🖥️", "📡", "🛰️", "🔌", "🛡️"] },
  { category: "Business", items: ["💼", "📈", "💵", "🤝", "🎯", "📢", "📅", "📋", "🏢", "🚀", "💎", "⏳"] },
  { category: "Symboles", items: ["⭐️", "✨", "🔥", "💥", "⚡️", "🌟", "🍀", "🧩", "📍", "🔔", "❤️", "✅"] }
];

const STOCK_IMAGES = [
  { id: "tech", label: "Technologie", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop" },
  { id: "library", label: "Bibliothèque", url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop" },
  { id: "science", label: "Sciences", url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop" },
  { id: "abstract", label: "Abstrait", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop" },
  { id: "student", label: "Étudiant", url: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop" },
  { id: "analytics", label: "Données", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop" }
];

const DEFAULT_PRESENTATION: Presentation = {
  title: "Transition Numérique & Recherche Académique",
  theme: "Ember",
  slides: [
    {
      id: "slide_1",
      title: "Impact de la Transition Numérique",
      subtitle: "Perspectives stratégiques pour la recherche moderne",
      content: [
        "Accélération de la diffusion des savoirs scientifiques",
        "Démocratisation des données via l'Open Science",
        "Nouvelles collaborations transfrontalières simplifiées",
        "Défis de sécurité et d'intégrité numérique"
      ],
      layout: "split",
      visualElement: {
        type: "bento",
        title: "Piliers de la transition",
        data: ["Vitesse", "Accessibilité", "Sécurité", "Collaboration"]
      },
      canvasElements: [
        { id: "el_1", type: "shape", content: SHAPE_ASSETS[5].path, x: 80, y: 15, width: 8, height: 8, color: "#f59e0b" },
        { id: "el_2", type: "emoji", content: "🎓", x: 12, y: 8, width: 6, height: 6 }
      ]
    },
    {
      id: "slide_2",
      title: "Indicateurs Clés de Croissance",
      subtitle: "Analyse quantitative du partage académique",
      content: [
        "Croissance annuelle de 3.5x des publications ouvertes",
        "Taux d'adoption global de 87% chez les chercheurs",
        "Réduction de 45% des délais de peer-review"
      ],
      layout: "chart",
      visualElement: {
        type: "stats",
        title: "Performances globales",
        data: ["3.5x", "Adoption: 87%", "Délais: -45%"]
      },
      canvasElements: []
    },
    {
      id: "slide_3",
      title: "Modèle de Coopération Hybride",
      subtitle: "Architecture de flux d'informations",
      content: [
        "Collecte structurée des résultats scientifiques",
        "Validation décentralisée par les comités de lecture",
        "Publication synchrone sur les plateformes indexées",
        "Archivage à long terme sous formats sécurisés"
      ],
      layout: "split",
      visualElement: {
        type: "graph",
        title: "Cycle d'Information",
        data: ["Collecte", "Validation", "Publication", "Archivage"]
      },
      canvasElements: []
    }
  ]
};

export default function PresentationMaker({ onBackToEditor, isLight }: PresentationMakerProps) {
  // ==========================================
  // STATES
  // ==========================================
  const [presentation, setPresentation] = useState<Presentation>(DEFAULT_PRESENTATION);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"templates" | "assets" | "ai_image" | "api_import" | "presenton">("templates");
  
  // UI Interactions
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string>("Ember");
  const [logs, setLogs] = useState<string[]>(["Créateur de Présentations initialisé."]);
  
  // Inline editing
  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [editingSubtitle, setEditingSubtitle] = useState<boolean>(false);
  const [editingBulletIdx, setEditingBulletIdx] = useState<number | null>(null);
  
  // Custom slide/Presentation creators
  const [aiTopic, setAiTopic] = useState<string>("");
  const [slideCount, setSlideCount] = useState<number>(5);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>("");
  const [generationEngine, setGenerationEngine] = useState<"scrivya" | "presenton">("scrivya");
  const [activeEngineUsed, setActiveEngineUsed] = useState<string | null>(null);

  // Presenton.ai Advanced Configuration States
  const [presentonLanguage, setPresentonLanguage] = useState<string>("fr");
  const [presentonTone, setPresentonTone] = useState<string>("academic");
  const [presentonAudience, setPresentonAudience] = useState<string>("jury");
  const [presentonLayoutType, setPresentonLayoutType] = useState<string>("mixed");
  const [presentonTemplate, setPresentonTemplate] = useState<string>("thesis");
  const [presentonCustomInstruction, setPresentonCustomInstruction] = useState<string>("");
  
  // Single Slide editing / Chat commands
  const [slideCommand, setSlideCommand] = useState<string>("");
  const [slideCommandLoading, setSlideCommandLoading] = useState<boolean>(false);
  
  // AI Image generation
  const [imagePrompt, setImagePrompt] = useState<string>("");
  const [imageGenerating, setImageGenerating] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  
  // External REST API configuration
  const [apiEndpoint, setApiEndpoint] = useState<string>("https://jsonplaceholder.typicode.com/posts");
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiSuccess, setApiSuccess] = useState<boolean>(false);
  const [apiErrorMsg, setApiErrorMsg] = useState<string>("");

  // Canvas interaction
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const resizeStartDim = useRef<{ w: number; h: number; x: number; y: number }>({ w: 0, h: 0, x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Stock image search
  const [searchQuery, setSearchQuery] = useState<string>("");

  const currentThemeData = THEME_PRESETS.find(t => t.id === selectedThemeId) || THEME_PRESETS[0];
  const activeSlide = presentation?.slides[activeSlideIndex] || null;
  const isThemeDark = currentThemeData.id !== "Classic Academic";

  // ==========================================
  // HELPER FUNCTIONS & LOGGING
  // ==========================================
  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 4)]);
  };

  // Keyboard navigation during fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        if (activeSlideIndex < presentation.slides.length - 1) {
          setActiveSlideIndex(prev => prev + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (activeSlideIndex > 0) {
          setActiveSlideIndex(prev => prev - 1);
        }
      } else if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, activeSlideIndex, presentation.slides.length]);

  // ==========================================
  // DRAG & DROP FOR CANVAS ELEMENTS (MOUSE/POINTER EVENTS)
  // ==========================================
  const handlePointerDownElement = (e: React.PointerEvent, elementId: string) => {
    e.stopPropagation();
    setSelectedElementId(elementId);
    
    const element = activeSlide?.canvasElements?.find(el => el.id === elementId);
    if (!element || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Calculate mouse click offset relative to element top-left in percentages
    const elemLeft = (element.x / 100) * canvasRect.width;
    const elemTop = (element.y / 100) * canvasRect.height;
    const mouseLeftOnCanvas = clientX - canvasRect.left;
    const mouseTopOnCanvas = clientY - canvasRect.top;

    dragOffset.current = {
      x: mouseLeftOnCanvas - elemLeft,
      y: mouseTopOnCanvas - elemTop
    };

    setDraggingElementId(elementId);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMoveElement = (e: React.PointerEvent) => {
    if (!draggingElementId || !canvasRef.current || !activeSlide) return;
    if (isResizing) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    // Calculate new position in percentages
    let newXPercent = ((mouseX - dragOffset.current.x) / canvasRect.width) * 100;
    let newYPercent = ((mouseY - dragOffset.current.y) / canvasRect.height) * 100;

    // Clamp coordinates inside canvas boundaries
    newXPercent = Math.max(0, Math.min(100, newXPercent));
    newYPercent = Math.max(0, Math.min(100, newYPercent));

    // Update active slide elements state
    const updatedSlides = [...presentation.slides];
    const elements = updatedSlides[activeSlideIndex].canvasElements || [];
    const idx = elements.findIndex(el => el.id === draggingElementId);
    if (idx !== -1) {
      elements[idx] = {
        ...elements[idx],
        x: Math.round(newXPercent),
        y: Math.round(newYPercent)
      };
      updatedSlides[activeSlideIndex].canvasElements = elements;
      setPresentation({ ...presentation, slides: updatedSlides });
    }
  };

  const handlePointerUpElement = (e: React.PointerEvent) => {
    if (draggingElementId) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDraggingElementId(null);
    }
  };

  // Add new canvas element (shape, emoji, or stock image)
  const addCanvasElement = (type: "shape" | "emoji" | "image" | "text", content: string) => {
    if (!activeSlide) return;
    const newElement: CanvasElement = {
      id: `elem_${Date.now()}`,
      type,
      content,
      x: 40 + Math.random() * 10,
      y: 40 + Math.random() * 10,
      width: type === "text" ? 30 : type === "shape" ? 12 : type === "image" ? 25 : 8,
      height: type === "text" ? 10 : type === "shape" ? 12 : type === "image" ? 20 : 8,
      color: type === "shape" ? currentThemeData.accent : undefined
    };

    const updatedSlides = [...presentation.slides];
    const elements = updatedSlides[activeSlideIndex].canvasElements || [];
    updatedSlides[activeSlideIndex].canvasElements = [...elements, newElement];
    setPresentation({ ...presentation, slides: updatedSlides });
    setSelectedElementId(newElement.id);
    addLog(`Élément ${type} ajouté au canevas.`);
  };

  // Resize canvas elements handler
  const startResize = (e: React.PointerEvent, elementId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setSelectedElementId(elementId);
    
    const element = activeSlide?.canvasElements?.find(el => el.id === elementId);
    if (!element || !canvasRef.current) return;

    resizeStartDim.current = {
      w: element.width,
      h: element.height,
      x: e.clientX,
      y: e.clientY
    };

    const handlePointerMoveResize = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - resizeStartDim.current.x;
      const deltaY = moveEvent.clientY - resizeStartDim.current.y;
      
      const canvasRect = canvasRef.current!.getBoundingClientRect();
      const widthDeltaPercent = (deltaX / canvasRect.width) * 100;
      const heightDeltaPercent = (deltaY / canvasRect.height) * 100;

      const updatedSlides = [...presentation.slides];
      const elements = updatedSlides[activeSlideIndex].canvasElements || [];
      const idx = elements.findIndex(el => el.id === elementId);
      if (idx !== -1) {
        elements[idx] = {
          ...elements[idx],
          width: Math.max(5, Math.round(resizeStartDim.current.w + widthDeltaPercent)),
          height: Math.max(5, Math.round(resizeStartDim.current.h + heightDeltaPercent))
        };
        updatedSlides[activeSlideIndex].canvasElements = elements;
        setPresentation({ ...presentation, slides: updatedSlides });
      }
    };

    const handlePointerUpResize = () => {
      setIsResizing(false);
      window.removeEventListener("pointermove", handlePointerMoveResize);
      window.removeEventListener("pointerup", handlePointerUpResize);
    };

    window.addEventListener("pointermove", handlePointerMoveResize);
    window.addEventListener("pointerup", handlePointerUpResize);
  };

  const deleteSelectedElement = () => {
    if (!selectedElementId || !activeSlide) return;
    const updatedSlides = [...presentation.slides];
    const elements = updatedSlides[activeSlideIndex].canvasElements || [];
    updatedSlides[activeSlideIndex].canvasElements = elements.filter(el => el.id !== selectedElementId);
    setPresentation({ ...presentation, slides: updatedSlides });
    setSelectedElementId(null);
    addLog("Élément supprimé du canevas.");
  };

  // ==========================================
  // SYSTEM API 9: FULL AI PRESENTATION GENERATION
  // ==========================================
  const handleGenerateFullPresentation = async () => {
    if (!aiTopic.trim()) {
      setAiError("Veuillez saisir un sujet de présentation.");
      return;
    }
    setAiLoading(true);
    setAiError("");
    setActiveEngineUsed(null);
    addLog(`Démarrage de la génération d'une présentation via le moteur ${generationEngine === "presenton" ? "Presenton.ai" : "Scrivya IA"}...`);

    try {
      const response = await fetch("/api/generate-presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          slideCount,
          theme: selectedThemeId,
          style: "Studio",
          density: "concise",
          engine: generationEngine,
          language: presentonLanguage,
          tone: presentonTone,
          audience: presentonAudience,
          layoutType: presentonLayoutType,
          template: presentonTemplate,
          customInstruction: presentonCustomInstruction
        })
      });

      if (!response.ok) throw new Error("Réponse serveur incorrecte");
      const data = await response.json();
      if (data.presentation) {
        // Build presentation preserving elements if needed
        const parsed = data.presentation;
        const slidesWithElements = parsed.slides.map((s: any) => ({
          ...s,
          canvasElements: s.canvasElements || []
        }));
        
        setPresentation({
          title: parsed.title,
          theme: selectedThemeId,
          slides: slidesWithElements
        });
        setActiveSlideIndex(0);
        
        // Track the exact engine used (e.g. "presenton-api", "presenton-simulation", "scrivya-gemini")
        const used = data.engineUsed || (generationEngine === "presenton" ? "presenton-simulation" : "scrivya-gemini");
        setActiveEngineUsed(used);

        if (used === "presenton-api") {
          addLog(`Présentation générée avec succès via l'API officielle Presenton.ai !`);
        } else if (used === "presenton-simulation") {
          addLog(`Présentation générée via le moteur de simulation intelligent Presenton.ai (Secours).`);
        } else {
          addLog(`Présentation "${parsed.title}" générée par Scrivya Core IA !`);
        }
      } else {
        throw new Error("Présentation JSON vide");
      }
    } catch (err: any) {
      console.error("Erreur de génération IA:", err);
      setAiError("La génération automatique a échoué. Chargement des modèles alternatifs locaux.");
      addLog("Erreur de génération, application des gabarits locaux.");
    } finally {
      setAiLoading(false);
    }
  };

  // ==========================================
  // SYSTEM API 11: EDIT ACTIVE SLIDE SÉMANTIQUE VIA IA
  // ==========================================
  const handleEditSlideAI = async () => {
    if (!activeSlide || !slideCommand.trim()) return;
    setSlideCommandLoading(true);
    addLog(`Modification de la diapositive ${activeSlideIndex + 1} en cours...`);

    try {
      const response = await fetch("/api/edit-slide-page-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slide: activeSlide,
          prompt: slideCommand,
          keepColors: true,
          theme: selectedThemeId
        })
      });

      if (!response.ok) throw new Error("Modification échouée");
      const data = await response.json();
      if (data.slide) {
        const updatedSlides = [...presentation.slides];
        updatedSlides[activeSlideIndex] = {
          ...data.slide,
          canvasElements: activeSlide.canvasElements || [] // Preserve canvas draggable elements
        };
        setPresentation({ ...presentation, slides: updatedSlides });
        setSlideCommand("");
        addLog(`Diapositive ${activeSlideIndex + 1} modifiée avec succès par l'IA !`);
      }
    } catch (err) {
      console.error(err);
      addLog("L'IA n'a pas pu traiter la consigne d'édition de diapositive.");
    } finally {
      setSlideCommandLoading(false);
    }
  };

  // ==========================================
  // SYSTEM API 10b: GENERATE IMAGE FROM PROMPT (AI IMAGE API)
  // ==========================================
  const handleGenerateAIImage = async () => {
    if (!imagePrompt.trim()) return;
    setImageGenerating(true);
    setGeneratedImageUrl("");
    addLog("Génération d'une illustration personnalisée via l'API IA...");

    try {
      const response = await fetch("/api/generate-slide-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt })
      });

      if (!response.ok) throw new Error("Génération d'image échouée");
      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        addLog("Illustration générée et disponible pour l'intégration !");
      }
    } catch (err) {
      console.error(err);
      addLog("Erreur lors de la génération d'image IA.");
    } finally {
      setImageGenerating(false);
    }
  };

  // ==========================================
  // COMPREHENSIVE INTERNET PRESENTATION API INTEGRATION
  // ==========================================
  const handleFetchWebAPI = async () => {
    if (!apiEndpoint.trim()) return;
    setApiLoading(true);
    setApiErrorMsg("");
    setApiSuccess(false);
    addLog(`Connexion à l'API de données publiques: ${apiEndpoint}...`);

    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) throw new Error(`Code HTTP ${response.status}`);
      const rawData = await response.json();

      // Convert arbitrary internet API output (like list of posts) into a slide deck structure!
      if (Array.isArray(rawData)) {
        const samplePosts = rawData.slice(0, 5); // Take 5 items
        const generatedSlides: Slide[] = samplePosts.map((post: any, pIdx: number) => {
          const bodyParagraphs = post.body ? post.body.split("\n") : ["Élément de données récupéré en ligne."];
          
          // Smart layouts distribution
          const layouts: Slide["layout"][] = ["split", "text-only", "cards", "hero", "chart"];
          const visualTypes: Slide["visualElement"]["type"][] = ["stats", "bento", "graph", "circle", "quote"];
          const curLayout = layouts[pIdx % layouts.length];
          const curVisual = visualTypes[pIdx % visualTypes.length];

          return {
            id: `api_slide_${Date.now()}_${pIdx}`,
            title: post.title ? post.title.substring(0, 45) + "..." : `Diapositive Récupérée ${pIdx + 1}`,
            subtitle: `Source de données externe • ID: ${post.id}`,
            content: bodyParagraphs.slice(0, 4).map((p: string) => p.trim()),
            layout: curLayout,
            visualElement: {
              type: curVisual,
              title: "Métriques & Relations",
              data: [
                `ID Unitaire: ${post.id}`,
                `Utilisateur: ${post.userId || 'Académique'}`,
                `Fiabilité: 99.8%`
              ]
            },
            canvasElements: []
          };
        });

        setPresentation({
          title: `Savoirs Connectés (${new URL(apiEndpoint).hostname})`,
          theme: selectedThemeId,
          slides: generatedSlides
        });
        setActiveSlideIndex(0);
        setApiSuccess(true);
        addLog("API externe connectée ! Présentation synchronisée.");
      } else {
        throw new Error("L'API n'a pas retourné une structure de données d'éléments listables.");
      }
    } catch (err: any) {
      console.error(err);
      setApiErrorMsg(`Erreur API: ${err.message}. Veuillez vérifier l'accessibilité ou le format.`);
      addLog("Erreur lors du décodage de l'API web externe.");
    } finally {
      setApiLoading(false);
    }
  };

  // ==========================================
  // REAL-TIME SLIDE INTERACTIVE MODIFICATIONS
  // ==========================================
  const addBlankSlide = () => {
    const newSlide: Slide = {
      id: `slide_man_${Date.now()}`,
      title: "Nouvelle Diapositive Épurée",
      subtitle: "Double-cliquez pour éditer l'accroche",
      content: [
        "Saisissez vos faits ou démonstrations scientifiques",
        "Ajoutez des actifs graphiques depuis la bibliothèque",
        "Configurez la mise en page via le panneau de gauche"
      ],
      layout: "split",
      visualElement: {
        type: "bento",
        title: "Synthèse graphique",
        data: ["Donnée 1", "Donnée 2", "Donnée 3"]
      },
      canvasElements: []
    };

    const updatedSlides = [...presentation.slides];
    updatedSlides.splice(activeSlideIndex + 1, 0, newSlide);
    setPresentation({ ...presentation, slides: updatedSlides });
    setActiveSlideIndex(activeSlideIndex + 1);
    addLog("Diapositive insérée manuellement.");
  };

  const deleteActiveSlide = () => {
    if (presentation.slides.length <= 1) {
      addLog("Impossible de supprimer l'unique diapositive.");
      return;
    }
    const updatedSlides = presentation.slides.filter((_, idx) => idx !== activeSlideIndex);
    setPresentation({ ...presentation, slides: updatedSlides });
    setActiveSlideIndex(Math.max(0, activeSlideIndex - 1));
    addLog("Diapositive supprimée.");
  };

  // Drag slides to reorder (real-time layout reorder)
  const [draggedSlideIdx, setDraggedSlideIdx] = useState<number | null>(null);

  const handleSlideDragStart = (idx: number) => {
    setDraggedSlideIdx(idx);
  };

  const handleSlideDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
  };

  const handleSlideDrop = (idx: number) => {
    if (draggedSlideIdx === null || draggedSlideIdx === idx) return;
    const updatedSlides = [...presentation.slides];
    const [removed] = updatedSlides.splice(draggedSlideIdx, 1);
    updatedSlides.splice(idx, 0, removed);
    setPresentation({ ...presentation, slides: updatedSlides });
    setActiveSlideIndex(idx);
    addLog(`Diapositive déplacée de ${draggedSlideIdx + 1} à ${idx + 1}`);
    setDraggedSlideIdx(null);
  };

  // ==========================================
  // EXPORTS: PDF (jspdf) & DOWNLOADING
  // ==========================================
  const handleExportPDF = () => {
    addLog("Compilation et conversion PDF en cours...");
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      presentation.slides.forEach((slide, sIdx) => {
        if (sIdx > 0) doc.addPage();

        // Theme colors matching
        const isDark = selectedThemeId !== "Classic Academic";
        const themeColor = isDark ? "#0f172a" : "#f8fafc";
        const textColor = isDark ? "#ffffff" : "#0f172a";
        const accentColor = currentThemeData.accent;

        // Background
        doc.setFillColor(themeColor);
        doc.rect(0, 0, 297, 210, "F");

        // Top line accent
        doc.setDrawColor(accentColor);
        doc.setLineWidth(2);
        doc.line(10, 10, 287, 10);

        // Header Title
        doc.setTextColor(accentColor);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text(slide.title, 15, 25);

        // Subtitle
        if (slide.subtitle) {
          doc.setTextColor(isDark ? "#94a3b8" : "#475569");
          doc.setFont("helvetica", "italic");
          doc.setFontSize(14);
          doc.text(slide.subtitle, 15, 33);
        }

        // Bullet list content
        doc.setTextColor(textColor);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        let yPos = 50;
        slide.content.forEach((bullet) => {
          doc.text(`• ${bullet}`, 20, yPos);
          yPos += 12;
        });

        // Footnote
        doc.setTextColor("#64748b");
        doc.setFontSize(9);
        doc.text(`Scrivya Deck • ${presentation.title} • Diapo ${sIdx + 1} de ${presentation.slides.length}`, 15, 195);
      });

      doc.save(`${presentation.title.toLowerCase().replace(/\s+/g, "_")}.pdf`);
      addLog("Export PDF réalisé avec succès !");
    } catch (err) {
      console.error(err);
      addLog("Une erreur est survenue lors de l'export PDF.");
    }
  };

  const downloadJSONDeck = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(presentation, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${presentation.title.toLowerCase().replace(/\s+/g, "_")}_scrivya.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addLog("Fichier de présentation exporté au format JSON !");
    } catch (err) {
      addLog("Une erreur est survenue lors du téléchargement.");
    }
  };

  // ==========================================
  // RENDERING VISUAL GRAPHICS (DIAGRAM ENGINES)
  // ==========================================
  const renderVisualDiagram = (type: string, data: string[] = [], accent: string) => {
    const isDark = isThemeDark;
    const baseColor = isDark ? "rgba(255, 255, 255, 0.85)" : "#0f172a";
    const mutedColor = isDark ? "rgba(255, 255, 255, 0.5)" : "#475569";

    switch (type) {
      case "circle":
        return (
          <div className="w-full h-full flex items-center justify-center relative p-2 min-h-[220px]">
            {/* Center Node */}
            <div 
              className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-center p-2 text-xs font-bold font-sans z-10 shadow-lg border animate-pulse"
              style={{ 
                backgroundColor: isDark ? "rgba(15, 23, 42, 0.9)" : "#ffffff", 
                borderColor: accent,
                color: baseColor
              }}
            >
              <span className="text-[10px] uppercase text-slate-500 tracking-wider">Concept</span>
              <span className="truncate max-w-full">{data[0] || "Hub"}</span>
            </div>
            
            {/* Satellite Orbits */}
            <div className="absolute w-48 h-48 border border-dashed rounded-full pointer-events-none opacity-40 animate-spin" style={{ borderColor: accent, animationDuration: "12s" }} />
            
            {/* Satellite Nodes */}
            {data.slice(1, 5).map((node, nIdx) => {
              const angles = [0, 90, 180, 270];
              const angle = angles[nIdx % angles.length];
              const radius = 95; // px
              const rad = (angle * Math.PI) / 180;
              const x = radius * Math.cos(rad);
              const y = radius * Math.sin(rad);

              return (
                <div
                  key={nIdx}
                  className="absolute w-16 h-16 rounded-full flex items-center justify-center text-center p-1.5 text-[10px] font-medium border shadow-md transition-all duration-300 hover:scale-110 z-10"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    backgroundColor: isDark ? "rgba(30, 41, 59, 0.85)" : "#f1f5f9",
                    borderColor: "rgba(148, 163, 184, 0.3)",
                    color: baseColor
                  }}
                >
                  <span className="line-clamp-2">{node}</span>
                </div>
              );
            })}
          </div>
        );

      case "graph":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center relative p-3 min-h-[220px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Connected Lines */}
              <line x1="50%" y1="20%" x2="25%" y2="55%" stroke={accent} strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="50%" y1="20%" x2="75%" y2="55%" stroke={accent} strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="25%" y1="55%" x2="50%" y2="85%" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />
              <line x1="75%" y1="55%" x2="50%" y2="85%" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />
            </svg>

            {/* Top Node */}
            <div 
              className="absolute top-4 px-3 py-1.5 rounded-lg border text-xs font-bold font-sans tracking-wide shadow-md"
              style={{ backgroundColor: isDark ? "#1e293b" : "#ffffff", borderColor: accent, color: baseColor }}
            >
              {data[0] || "Point Central"}
            </div>

            {/* Mid Left */}
            <div 
              className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border text-xs font-medium max-w-[110px] text-center shadow-sm"
              style={{ backgroundColor: isDark ? "rgba(30, 41, 59, 0.75)" : "#f8fafc", borderColor: "rgba(148, 163, 184, 0.3)", color: baseColor }}
            >
              {data[1] || "Étape A"}
            </div>

            {/* Mid Right */}
            <div 
              className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg border text-xs font-medium max-w-[110px] text-center shadow-sm"
              style={{ backgroundColor: isDark ? "rgba(30, 41, 59, 0.75)" : "#f8fafc", borderColor: "rgba(148, 163, 184, 0.3)", color: baseColor }}
            >
              {data[2] || "Étape B"}
            </div>

            {/* Bottom Node */}
            <div 
              className="absolute bottom-4 px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide shadow-sm"
              style={{ backgroundColor: isDark ? "#0f172a" : "#f1f5f9", borderColor: "rgba(148, 163, 184, 0.3)", color: mutedColor }}
            >
              {data[3] || "Synthèse"}
            </div>
          </div>
        );

      case "bento":
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-2 min-h-[220px]">
            <div 
              className="col-span-2 p-3 rounded-xl border flex flex-col justify-between shadow-sm backdrop-blur-sm"
              style={{ backgroundColor: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(241, 245, 249, 0.6)", borderColor: "rgba(148, 163, 184, 0.2)" }}
            >
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Axe Principal</span>
              <span className="text-xs font-semibold truncate" style={{ color: baseColor }}>{data[0] || "Indicateurs d'innovation"}</span>
            </div>
            
            <div 
              className="p-3 rounded-xl border flex flex-col justify-center text-center shadow-xs"
              style={{ backgroundColor: isDark ? "rgba(30, 41, 59, 0.2)" : "rgba(241, 245, 249, 0.4)", borderColor: "rgba(148, 163, 184, 0.15)" }}
            >
              <span className="text-lg font-bold" style={{ color: accent }}>{data[1] || "A+"}</span>
              <span className="text-[9px] text-slate-500">Qualité</span>
            </div>

            <div 
              className="p-3 rounded-xl border flex flex-col justify-center text-center shadow-xs"
              style={{ backgroundColor: isDark ? "rgba(30, 41, 59, 0.2)" : "rgba(241, 245, 249, 0.4)", borderColor: "rgba(148, 163, 184, 0.15)" }}
            >
              <span className="text-xs font-bold line-clamp-2" style={{ color: baseColor }}>{data[2] || "Coopération"}</span>
              <span className="text-[9px] text-slate-500">{data[3] || "Standard"}</span>
            </div>
          </div>
        );

      case "quote":
        return (
          <div className="w-full h-full flex flex-col justify-center p-4 min-h-[220px] relative">
            <span className="absolute top-0 left-2 text-6xl font-serif select-none pointer-events-none opacity-20" style={{ color: accent }}>“</span>
            <blockquote className="text-sm font-medium italic pl-6 tracking-wide leading-relaxed relative z-10" style={{ color: baseColor }}>
              {data[0] || "L'unique moyen d'avoir un travail remarquable est d'aimer ce que vous faites."}
            </blockquote>
            <cite className="text-[10px] font-bold uppercase tracking-wider pl-6 mt-3 block" style={{ color: accent }}>
              — {data[1] || "Auteur de Référence"}
            </cite>
          </div>
        );

      case "stats":
        return (
          <div className="w-full h-full flex flex-col justify-center items-center gap-1.5 p-4 min-h-[220px] text-center">
            <span className="text-4xl font-extrabold tracking-tight font-mono animate-pulse" style={{ color: accent }}>
              {data[0] || "98.4%"}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest max-w-[180px] line-clamp-1" style={{ color: baseColor }}>
              {data[1] || "Indice d'efficience"}
            </span>
            <span className="text-[10px] max-w-[180px] line-clamp-2" style={{ color: mutedColor }}>
              {data[2] || "Mesure synchrone sur les clusters universitaires"}
            </span>
          </div>
        );

      default:
        return <div className="text-xs text-slate-400 font-mono">Visuel</div>;
    }
  };

  const filteredStockImages = STOCK_IMAGES.filter(img => 
    img.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-screen w-full select-none ${isLight ? "bg-slate-50 text-slate-900" : "bg-[#090b14] text-slate-100"}`}>
      
      {/* ==========================================
          HEADER BAR
         ========================================== */}
      <header className={`px-6 h-16 border-b flex items-center justify-between shrink-0 z-50 ${isLight ? "bg-white/85 border-slate-200" : "bg-[#0c0f1a]/90 border-slate-800/80"} backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-fuchsia-600 to-pink-600 flex items-center justify-center text-white shadow-md">
            <PresentationIcon className="w-5 h-5 animate-spin" style={{ animationDuration: "15s" }} />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight">Scrivya-Deck</h1>
            <p className="text-[10px] font-medium text-slate-500 font-mono">STUDIO CONCEPTEUR CANVA & IA</p>
          </div>
        </div>

        {/* Presentation Title */}
        <div className="hidden md:flex items-center gap-2 max-w-md bg-slate-500/5 px-3 py-1.5 rounded-lg border border-slate-500/10">
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Titre:</span>
          {editingTitle ? (
            <input
              type="text"
              value={presentation.title}
              onChange={(e) => setPresentation({ ...presentation, title: e.target.value })}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => { if (e.key === "Enter") setEditingTitle(false); }}
              autoFocus
              className="text-xs font-semibold bg-transparent outline-none border-b border-fuchsia-500 text-slate-200 w-64"
            />
          ) : (
            <span 
              onDoubleClick={() => setEditingTitle(true)}
              className="text-xs font-bold truncate cursor-pointer hover:text-fuchsia-400 select-none max-w-[280px]"
            >
              {presentation.title}
            </span>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {selectedElementId && (
            <button 
              onClick={deleteSelectedElement}
              className="p-2 rounded-lg bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-red-400 transition-colors"
              title="Supprimer l'élément actif (Del)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={() => setIsFullscreen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-500/10 border border-slate-500/15 hover:bg-slate-500/20 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Soutenance</span>
          </button>

          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-md transition-all">
              <Download className="w-3.5 h-3.5" />
              <span>Exporter</span>
            </button>
            <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl border p-2 shadow-xl backdrop-blur-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50 ${isLight ? "bg-white border-slate-200" : "bg-[#0f111a] border-slate-800"}`}>
              <button 
                onClick={handleExportPDF}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-left hover:bg-fuchsia-500/10 hover:text-fuchsia-400 transition-colors"
              >
                <FileDown className="w-4 h-4 text-fuchsia-500" />
                <span>Format PDF académique</span>
              </button>
              <button 
                onClick={downloadJSONDeck}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-left hover:bg-pink-500/10 hover:text-pink-400 transition-colors"
              >
                <Code className="w-4 h-4 text-pink-500" />
                <span>Fichier source JSON</span>
              </button>
            </div>
          </div>

          <button 
            onClick={onBackToEditor}
            className="p-2 rounded-lg hover:bg-slate-500/10 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* ==========================================
          MAIN BODY CONTAINER
         ========================================== */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ==========================================
            LEFT SIDEBAR (CANVA TOOL TABS)
           ========================================== */}
        <aside className={`w-[340px] border-r flex flex-col shrink-0 ${isLight ? "bg-white border-slate-200" : "bg-[#0b0c14] border-slate-800/80"} z-40`}>
          {/* Tab Selection */}
          <div className="grid grid-cols-5 border-b border-slate-800/40 p-1.5 gap-0.5 shrink-0">
            {[
              { id: "templates", label: "Thèmes", icon: <Palette className="w-3.5 h-3.5" /> },
              { id: "presenton", label: "Presenton", icon: <Sparkles className="w-3.5 h-3.5 text-violet-400" /> },
              { id: "assets", label: "Actifs", icon: <Shapes className="w-3.5 h-3.5" /> },
              { id: "ai_image", label: "Image IA", icon: <ImageIcon className="w-3.5 h-3.5" /> },
              { id: "api_import", label: "Web API", icon: <Code className="w-3.5 h-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "presenton") {
                    setGenerationEngine("presenton");
                  } else if (tab.id === "templates") {
                    setGenerationEngine("scrivya");
                  }
                }}
                className={`flex flex-col items-center justify-center py-2 rounded-lg text-[9px] font-bold gap-1 transition-all ${
                  activeTab === tab.id 
                    ? tab.id === "presenton"
                      ? "bg-violet-650/15 text-violet-400 border border-violet-500/25 shadow-sm"
                      : "bg-fuchsia-600/15 text-fuchsia-400 shadow-sm border border-fuchsia-500/20" 
                    : "text-slate-500 hover:bg-slate-500/5 hover:text-slate-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: TEMPLATES & AI GENERATION */}
              {activeTab === "templates" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  {/* Preset Themes selector */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Thèmes Visuels</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {THEME_PRESETS.map((th) => (
                        <button
                          key={th.id}
                          onClick={() => {
                            setSelectedThemeId(th.id);
                            addLog(`Thème changé en "${th.name}"`);
                          }}
                          className={`p-2 rounded-xl border text-left text-xs transition-all ${
                            selectedThemeId === th.id
                              ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400"
                              : "border-slate-800/50 bg-slate-900/10 hover:bg-slate-800/10 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: th.accent }} />
                            <span className="font-semibold truncate">{th.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Full Presentation Generator Box */}
                  <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900/30 border-slate-800/60"}`}>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">Générateur Scrivya IA</span>
                    </div>

                    <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                      Saisissez le sujet de recherche pour structurer une présentation complète en français.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1.5">Moteur de génération</label>
                        <div className="grid grid-cols-2 gap-1 p-0.5 rounded-xl bg-slate-950/80 border border-slate-800">
                          <button
                            type="button"
                            onClick={() => setGenerationEngine("scrivya")}
                            className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                              generationEngine === "scrivya"
                                ? "bg-fuchsia-650 text-white shadow-sm shadow-fuchsia-500/20"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            Scrivya Core
                          </button>
                          <button
                            type="button"
                            onClick={() => setGenerationEngine("presenton")}
                            className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                              generationEngine === "presenton"
                                ? "bg-violet-650 text-white shadow-sm shadow-violet-500/20"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            Presenton.ai API
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Sujet d'étude</label>
                        <input
                          type="text"
                          placeholder="Ex: L'impact de l'IA sur l'astrophysique"
                          value={aiTopic}
                          onChange={(e) => setAiTopic(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 placeholder:text-slate-600 focus:border-fuchsia-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Diapositives</label>
                          <select
                            value={slideCount}
                            onChange={(e) => setSlideCount(parseInt(e.target.value))}
                            className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 focus:border-fuchsia-500"
                          >
                            <option value={3}>3 Slides</option>
                            <option value={5}>5 Slides</option>
                            <option value={8}>8 Slides</option>
                            <option value={10}>10 Slides</option>
                          </select>
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={handleGenerateFullPresentation}
                            disabled={aiLoading}
                            className={`w-full py-2 rounded-xl text-xs font-bold disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center gap-1 transition-all ${
                              generationEngine === "presenton" 
                                ? "bg-violet-600 hover:bg-violet-500" 
                                : "bg-fuchsia-600 hover:bg-fuchsia-500"
                            }`}
                          >
                            {aiLoading ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Générer</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {activeEngineUsed && (
                        <div className={`mt-2 p-2 rounded-xl text-[10px] flex items-center justify-between ${
                          activeEngineUsed === "presenton-api"
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                            : activeEngineUsed === "presenton-simulation"
                            ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                            : "bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400"
                        }`}>
                          <span className="font-semibold">Moteur actif :</span>
                          <span className="font-mono">
                            {activeEngineUsed === "presenton-api" && "Presenton.ai (API Réelle)"}
                            {activeEngineUsed === "presenton-simulation" && "Presenton.ai (Simulé / Clé manquante)"}
                            {activeEngineUsed === "scrivya-gemini" && "Scrivya Core (Gemini)"}
                            {activeEngineUsed === "scrivya-fallback" && "Scrivya Local (Secours)"}
                          </span>
                        </div>
                      )}

                      {aiError && (
                        <p className="text-[9px] text-amber-500 font-medium leading-relaxed">{aiError}</p>
                      )}
                    </div>
                  </div>

                  {/* AI Slide Editor Chat Box */}
                  {activeSlide && (
                    <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900/30 border-slate-800/60"}`}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Type className="w-4 h-4 text-pink-400" />
                        <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">Éditer cette Diapo</span>
                      </div>

                      <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                        Demandez à l'IA d'ajuster sémantiquement les textes de la diapositive courante.
                      </p>

                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          placeholder="Ex: Traduis en anglais et ajoute des chiffres récents..."
                          value={slideCommand}
                          onChange={(e) => setSlideCommand(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 placeholder:text-slate-600 focus:border-pink-500 resize-none"
                        />
                        <button
                          onClick={handleEditSlideAI}
                          disabled={slideCommandLoading || !slideCommand.trim()}
                          className="w-full py-2 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center gap-1 transition-all"
                        >
                          {slideCommandLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Modifier la slide</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB PRESENTON: ADVANCED PRESENTON.AI STUDIO */}
              {activeTab === "presenton" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-2xl border ${isLight ? "bg-violet-50/50 border-violet-100" : "bg-violet-950/10 border-violet-900/30"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                        <span className="text-[11px] font-bold text-violet-400 uppercase tracking-widest font-mono">Presenton.ai Studio</span>
                      </div>
                      <span className="text-[8px] bg-violet-500/15 border border-violet-500/25 text-violet-300 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                        V1 Pro API
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                      Exploitez toute la puissance de génération de <strong className="text-violet-300">Presenton.ai</strong>. Configurez vos presets de structures académiques et le style de mise en page.
                    </p>

                    <div className="space-y-4">
                      {/* Structure/Preset Selection */}
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1.5">Preset de Structure</label>
                        <select
                          value={presentonTemplate}
                          onChange={(e) => {
                            setPresentonTemplate(e.target.value);
                            // Set topic placeholder helper depending on template selection
                            if (e.target.value === "thesis" && !aiTopic) {
                              setAiTopic("Soutenance de Thèse : Impact de la cryptographie post-quantique");
                            } else if (e.target.value === "pitch" && !aiTopic) {
                              setAiTopic("Startup Pitch : Solution SaaS d'optimisation énergétique");
                            }
                          }}
                          className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 focus:border-violet-500 transition-colors"
                        >
                          <option value="thesis">🎓 Soutenance de Thèse / Doctorat</option>
                          <option value="pitch">🚀 Pitch Deck de Startup (Financement)</option>
                          <option value="project">📊 Rapport de Projet Académique</option>
                          <option value="review">🔬 Analyse d'Article Scientifique</option>
                          <option value="lecture">📖 Synthèse de Cours Magistral</option>
                          <option value="none">✨ Standard / Format Libre</option>
                        </select>
                      </div>

                      {/* Topic prompt input */}
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Sujet d'étude principal</label>
                        <textarea
                          rows={3}
                          placeholder="Ex: L'analyse de la durabilité thermique des composites en aérospatiale..."
                          value={aiTopic}
                          onChange={(e) => setAiTopic(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 placeholder:text-slate-600 focus:border-violet-500 resize-none transition-colors"
                        />
                      </div>

                      {/* Language & Slides count row */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Langue Cible</label>
                          <select
                            value={presentonLanguage}
                            onChange={(e) => setPresentonLanguage(e.target.value)}
                            className="w-full text-xs px-2 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 focus:border-violet-500 transition-colors"
                          >
                            <option value="fr">Français (FR)</option>
                            <option value="en">English (EN)</option>
                            <option value="es">Español (ES)</option>
                            <option value="ar">العربية (AR)</option>
                            <option value="de">Deutsch (DE)</option>
                            <option value="it">Italiano (IT)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Diapositives</label>
                          <select
                            value={slideCount}
                            onChange={(e) => setSlideCount(parseInt(e.target.value))}
                            className="w-full text-xs px-2 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 focus:border-violet-500 transition-colors"
                          >
                            <option value={3}>3 Slides</option>
                            <option value={5}>5 Slides</option>
                            <option value={8}>8 Slides (Complet)</option>
                            <option value={10}>10 Slides (Détaillé)</option>
                            <option value={12}>12 Slides (Expert)</option>
                            <option value={15}>15 Slides (Soutenance)</option>
                          </select>
                        </div>
                      </div>

                      {/* Tone & Layout configuration */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Ton Établi</label>
                          <select
                            value={presentonTone}
                            onChange={(e) => setPresentonTone(e.target.value)}
                            className="w-full text-xs px-2 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 focus:border-violet-500 transition-colors"
                          >
                            <option value="academic">🎓 Académique & Rigoureux</option>
                            <option value="professional">💼 Professionnel & Direct</option>
                            <option value="persuasive">🔥 Persuasif & Captivant</option>
                            <option value="minimal">🍃 Minimaliste & Épuré</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Public Cible</label>
                          <select
                            value={presentonAudience}
                            onChange={(e) => setPresentonAudience(e.target.value)}
                            className="w-full text-xs px-2 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 focus:border-violet-500 transition-colors"
                          >
                            <option value="jury">Jury de thèse / Experts</option>
                            <option value="investors">Investisseurs / Business</option>
                            <option value="students">Étudiants / Chercheurs</option>
                            <option value="general">Grand Public / Vulgarisé</option>
                          </select>
                        </div>
                      </div>

                      {/* Layout Type Selection */}
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1.5">Directives de Mise en Page</label>
                        <select
                          value={presentonLayoutType}
                          onChange={(e) => setPresentonLayoutType(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 focus:border-violet-500 transition-colors"
                        >
                          <option value="mixed">🔄 Aléatoire / Hybride intelligent</option>
                          <option value="split">🌗 Split (Texte + Graphique 50/50)</option>
                          <option value="cards">🗂️ Bento Grid (Cartes asymétriques)</option>
                          <option value="text">📄 Text-Heavy (Rapports universitaires)</option>
                          <option value="stats">📈 Chiffres Clés (Statistiques & Graphiques)</option>
                        </select>
                      </div>

                      {/* Custom Specific Instructions */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase block">Consignes Sémantiques Spécifiques</label>
                          <span className="text-[8px] text-slate-500">Optionnel</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Ex: Intègre des citations de Bourdieu, focus marché EU..."
                          value={presentonCustomInstruction}
                          onChange={(e) => setPresentonCustomInstruction(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 placeholder:text-slate-600 focus:border-violet-500 transition-colors"
                        />
                      </div>

                      {/* Active theme reminder */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[10px] text-slate-400">
                        <span>Palette colorimétrique :</span>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentThemeData.accent }} />
                          {currentThemeData.name}
                        </div>
                      </div>

                      {/* Action Trigger Button */}
                      <button
                        onClick={handleGenerateFullPresentation}
                        disabled={aiLoading}
                        className="w-full py-3 rounded-xl text-xs font-bold disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center gap-2 transition-all shadow-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/10 active:scale-[0.98]"
                      >
                        {aiLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-violet-200" />
                            <span>LANCER LE MOTEUR PRESENTON.AI</span>
                          </>
                        )}
                      </button>

                      {/* Info & Status Log */}
                      {activeEngineUsed && (
                        <div className={`p-2.5 rounded-xl text-[10px] flex flex-col gap-1 ${
                          activeEngineUsed === "presenton-api"
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                            : activeEngineUsed === "presenton-simulation"
                            ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
                            : "bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400"
                        }`}>
                          <div className="flex items-center justify-between font-semibold">
                            <span>Status de Génération :</span>
                            <span className="font-mono text-[9px] uppercase">Actif</span>
                          </div>
                          <span className="text-[9px] text-slate-400">
                            {activeEngineUsed === "presenton-api" && "Connecté avec succès au serveur SaaS officiel Presenton.ai."}
                            {activeEngineUsed === "presenton-simulation" && "Clé PRESENTON_API_KEY non fournie. Scrivya a compilé vos options avancées en simulant le modèle linguistique Presenton."}
                            {activeEngineUsed === "scrivya-gemini" && "Généré via le moteur Scrivya Core (Gemini AI)."}
                          </span>
                        </div>
                      )}

                      {aiError && (
                        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] leading-relaxed">
                          ⚠️ Erreur: {aiError}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: CANVAS ASSET LIBRARY */}
              {activeTab === "assets" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  {/* Draggable Shapes */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <Shapes className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Formes Vectorielles</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {SHAPE_ASSETS.map((sh) => (
                        <button
                          key={sh.id}
                          onClick={() => addCanvasElement("shape", sh.path)}
                          className={`aspect-square rounded-xl border flex flex-col items-center justify-center hover:scale-105 transition-all ${
                            isLight 
                              ? "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300" 
                              : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700"
                          }`}
                          title={`Cliquez pour insérer ${sh.label}`}
                        >
                          <svg className="w-8 h-8" viewBox="0 0 100 100">
                            <path d={sh.path} fill="none" stroke={currentThemeData.accent} strokeWidth="6" />
                          </svg>
                          <span className="text-[8px] font-bold mt-1 text-slate-500">{sh.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Draggable Emojis */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <Smile className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Émoticônes & Symboles</span>
                    </div>
                    <div className="space-y-3">
                      {EMOJI_ASSETS.map((cat, cIdx) => (
                        <div key={cIdx} className="space-y-1">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{cat.category}</span>
                          <div className="grid grid-cols-6 gap-1">
                            {cat.items.map((emoji, eIdx) => (
                              <button
                                key={eIdx}
                                onClick={() => addCanvasElement("emoji", emoji)}
                                className={`text-lg p-2 rounded-lg transition-transform hover:scale-125 ${
                                  isLight ? "hover:bg-slate-100" : "hover:bg-slate-800/40"
                                }`}
                                title="Ajouter au canevas"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Searchable Stock Images */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Photographies Libres</span>
                    </div>
                    
                    {/* Search Field */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Rechercher des images (ex: science...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-[11px] pl-8 pr-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 outline-none text-slate-200 placeholder:text-slate-600 focus:border-fuchsia-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {filteredStockImages.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => addCanvasElement("image", img.url)}
                          className="relative aspect-video rounded-xl overflow-hidden group border border-slate-800/40 hover:scale-[1.03] transition-all"
                        >
                          <img 
                            src={img.url} 
                            alt={img.label} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[9px] text-white font-bold uppercase tracking-wider">Ajouter</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: AI IMAGE GENERATOR API */}
              {activeTab === "ai_image" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900/30 border-slate-800/60"}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">Image Creator Studio</span>
                    </div>

                    <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                      L'IA de génération d'images conçoit un visuel vectoriel ou photo adapté au prompt saisi.
                    </p>

                    <div className="space-y-3">
                      <textarea
                        rows={3}
                        placeholder="Ex: Un diagramme néon de l'architecture d'un processeur quantique..."
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 placeholder:text-slate-600 focus:border-amber-500 resize-none"
                      />
                      <button
                        onClick={handleGenerateAIImage}
                        disabled={imageGenerating || !imagePrompt.trim()}
                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        {imageGenerating ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Générer le visuel IA</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Render Generated Image preview & Add Button */}
                  {generatedImageUrl && (
                    <div className="space-y-2 animate-fadeIn">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Résultat généré :</span>
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-amber-500/30 shadow-lg bg-slate-950 flex items-center justify-center">
                        {generatedImageUrl.startsWith("data:image/svg+xml") ? (
                          <div 
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ __html: decodeURIComponent(generatedImageUrl.split(",")[1]) }} 
                          />
                        ) : (
                          <img 
                            src={generatedImageUrl} 
                            alt="AI generated" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => addCanvasElement("image", generatedImageUrl)}
                          className="py-1.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                        >
                          Insérer l'élément
                        </button>
                        <button
                          onClick={() => {
                            if (!activeSlide) return;
                            const updatedSlides = [...presentation.slides];
                            updatedSlides[activeSlideIndex].imageUrl = generatedImageUrl;
                            setPresentation({ ...presentation, slides: updatedSlides });
                            addLog("Arrière-plan de la diapositive mis à jour !");
                          }}
                          className="py-1.5 rounded-lg text-[10px] font-bold bg-amber-600/25 hover:bg-amber-600/35 text-amber-400 border border-amber-500/20 transition-colors"
                        >
                          Définir comme fond
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: COMPREHENSIVE PUBLIC PRESENTATION API */}
              {activeTab === "api_import" && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className={`p-4 rounded-2xl border ${isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900/30 border-slate-800/60"}`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Code className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Web API Data Importer</span>
                    </div>

                    <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                      Importez et convertissez des données textuelles distantes de n'importe quelle API publique REST (JSON list) directement en diapositives structurées.
                    </p>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Point d'entrée de l'API (REST/CORS)</label>
                        <input
                          type="text"
                          value={apiEndpoint}
                          onChange={(e) => setApiEndpoint(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 outline-none text-slate-200 focus:border-emerald-500"
                        />
                      </div>

                      <button
                        onClick={handleFetchWebAPI}
                        disabled={apiLoading}
                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        {apiLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                            <span>Interroger et Importer</span>
                          </>
                        )}
                      </button>

                      {apiSuccess && (
                        <p className="text-[9px] text-emerald-400 font-medium leading-relaxed">
                          ✓ Données récupérées et mappées avec succès dans le créateur !
                        </p>
                      )}

                      {apiErrorMsg && (
                        <p className="text-[9px] text-red-400 font-medium leading-relaxed">{apiErrorMsg}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Activity / Logs console footer */}
          <div className="p-3 border-t border-slate-800/40 bg-black/10 shrink-0">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Journal de modifications</span>
            <div className="h-16 overflow-y-auto space-y-1 font-mono text-[8px] text-slate-400">
              {logs.map((log, idx) => (
                <p key={idx} className="truncate">
                  <span className="text-fuchsia-500/80 mr-1">⚡</span>{log}
                </p>
              ))}
            </div>
          </div>
        </aside>

        {/* ==========================================
            CENTER WORKSPACE (CANVAS STAGE)
           ========================================== */}
        <div className="flex-1 flex flex-col min-w-0 p-6 overflow-y-auto space-y-6">
          
          {/* Active slide container card */}
          {activeSlide ? (
            <div className="flex-1 flex items-center justify-center">
              <div 
                ref={canvasRef}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  // Support drag drop actions
                }}
                className={`relative w-full max-w-[850px] aspect-[16/9] rounded-3xl overflow-hidden transition-all duration-300 shadow-2xl ${
                  selectedThemeId === "Classic Academic" 
                    ? "bg-slate-50 border border-slate-200" 
                    : currentThemeData.canvasBg
                } ${currentThemeData.font}`}
                style={{ 
                  boxShadow: isThemeDark ? `0 20px 50px -12px ${currentThemeData.glowColor}` : "0 20px 50px -12px rgba(15,23,42,0.06)"
                }}
              >
                
                {/* Embedded Grid background */}
                <div 
                  className="absolute inset-0 pointer-events-none" 
                  style={{
                    backgroundImage: `radial-gradient(${currentThemeData.gridColor} 1.5px, transparent 1.5px)`,
                    backgroundSize: "24px 24px"
                  }}
                />

                {/* Theme Ambient Radial Glow */}
                {isThemeDark && (
                  <div 
                    className="absolute top-[-10%] right-[-10%] w-[320px] h-[320px] rounded-full filter blur-[100px] pointer-events-none" 
                    style={{ background: currentThemeData.glowColor }}
                  />
                )}

                {/* Backslide background image overlay if any */}
                {activeSlide.imageUrl && (
                  <div className="absolute inset-0 z-0">
                    {activeSlide.imageUrl.startsWith("data:image/svg+xml") ? (
                      <div 
                        className="w-full h-full opacity-35"
                        dangerouslySetInnerHTML={{ __html: decodeURIComponent(activeSlide.imageUrl.split(",")[1]) }} 
                      />
                    ) : (
                      <img 
                        src={activeSlide.imageUrl} 
                        alt="Slide Background" 
                        className="w-full h-full object-cover opacity-25 mix-blend-lighten" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {/* Clear overlay button */}
                    <button
                      onClick={() => {
                        const updatedSlides = [...presentation.slides];
                        delete updatedSlides[activeSlideIndex].imageUrl;
                        setPresentation({ ...presentation, slides: updatedSlides });
                        addLog("Arrière-plan réinitialisé.");
                      }}
                      className="absolute top-4 right-4 z-20 px-2 py-1 rounded-md bg-black/60 text-white border border-white/10 hover:bg-black/80 transition-colors text-[9px] font-bold uppercase tracking-wider"
                    >
                      Enlever le fond
                    </button>
                  </div>
                )}

                {/* ==========================================
                    RENDER LAYOUTS INSIDE THE CANVAS
                   ========================================== */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 pointer-events-none">
                  {/* Top Bar / Header info */}
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
                      {presentation.title}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      0{activeSlideIndex + 1} / 0{presentation.slides.length}
                    </span>
                  </div>

                  {/* Main Slide Title & Subtitle (Interactive editing) */}
                  <div className="space-y-1.5 select-text pointer-events-auto mt-2">
                    {editingTitle ? (
                      <input
                        type="text"
                        value={activeSlide.title}
                        onChange={(e) => {
                          const updatedSlides = [...presentation.slides];
                          updatedSlides[activeSlideIndex].title = e.target.value;
                          setPresentation({ ...presentation, slides: updatedSlides });
                        }}
                        onBlur={() => setEditingTitle(false)}
                        onKeyDown={(e) => { if (e.key === "Enter") setEditingTitle(false); }}
                        autoFocus
                        className="text-2xl md:text-3xl font-extrabold tracking-tight bg-transparent text-slate-100 outline-none border-b border-fuchsia-500 w-full"
                        style={{ color: isThemeDark ? "#ffffff" : "#0f172a" }}
                      />
                    ) : (
                      <h2 
                        onDoubleClick={() => setEditingTitle(true)}
                        className="text-2xl md:text-3xl font-extrabold tracking-tight cursor-pointer hover:text-fuchsia-400 select-none transition-colors"
                        style={{ color: isThemeDark ? "#ffffff" : "#0f172a" }}
                      >
                        {activeSlide.title}
                      </h2>
                    )}

                    {editingSubtitle ? (
                      <input
                        type="text"
                        value={activeSlide.subtitle || ""}
                        onChange={(e) => {
                          const updatedSlides = [...presentation.slides];
                          updatedSlides[activeSlideIndex].subtitle = e.target.value;
                          setPresentation({ ...presentation, slides: updatedSlides });
                        }}
                        onBlur={() => setEditingSubtitle(false)}
                        onKeyDown={(e) => { if (e.key === "Enter") setEditingSubtitle(false); }}
                        autoFocus
                        placeholder="Ajouter un sous-titre..."
                        className="text-xs font-semibold bg-transparent text-slate-400 outline-none border-b border-fuchsia-500 w-full"
                      />
                    ) : (
                      <p 
                        onDoubleClick={() => setEditingSubtitle(true)}
                        className="text-xs font-semibold cursor-pointer select-none transition-colors"
                        style={{ color: isThemeDark ? "rgba(255,255,255,0.55)" : "#475569" }}
                      >
                        {activeSlide.subtitle || "Double-cliquez pour insérer un sous-titre..."}
                      </p>
                    )}
                  </div>

                  {/* Body Content based on layout */}
                  <div className="flex-1 grid grid-cols-12 gap-6 items-center mt-4">
                    
                    {/* LAYOUT: SPLIT (Content Left, Graphic Right) */}
                    {activeSlide.layout === "split" && (
                      <>
                        <div className="col-span-7 space-y-3.5 select-text pointer-events-auto pr-2">
                          {activeSlide.content.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-3 text-[13px] md:text-[14px]">
                              <span className="text-sm mt-0.5" style={{ color: currentThemeData.accent }}>•</span>
                              {editingBulletIdx === bIdx ? (
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => {
                                    const updatedSlides = [...presentation.slides];
                                    updatedSlides[activeSlideIndex].content[bIdx] = e.target.value;
                                    setPresentation({ ...presentation, slides: updatedSlides });
                                  }}
                                  onBlur={() => setEditingBulletIdx(null)}
                                  onKeyDown={(e) => { if (e.key === "Enter") setEditingBulletIdx(null); }}
                                  autoFocus
                                  className="bg-transparent border-b border-fuchsia-500 text-[13px] md:text-[14px] text-slate-100 outline-none w-full"
                                  style={{ color: isThemeDark ? "#ffffff" : "#0f172a" }}
                                />
                              ) : (
                                <p 
                                  onDoubleClick={() => setEditingBulletIdx(bIdx)}
                                  className="cursor-pointer hover:text-fuchsia-400 leading-relaxed select-none"
                                  style={{ color: isThemeDark ? "rgba(255,255,255,0.85)" : "#334155" }}
                                >
                                  {bullet}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="col-span-5 h-full flex items-center justify-center select-none z-10">
                          {activeSlide.visualElement ? renderVisualDiagram(activeSlide.visualElement.type, activeSlide.visualElement.data, currentThemeData.accent) : (
                            <div className="text-xs text-slate-400 font-mono">Pas de visuel</div>
                          )}
                        </div>
                      </>
                    )}

                    {/* LAYOUT: TEXT-ONLY */}
                    {activeSlide.layout === "text-only" && (
                      <div className="col-span-12 space-y-3.5 select-text pointer-events-auto pr-10">
                        {activeSlide.content.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-3.5 text-sm">
                            <span className="text-lg" style={{ color: currentThemeData.accent }}>▪</span>
                            {editingBulletIdx === bIdx ? (
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const updatedSlides = [...presentation.slides];
                                  updatedSlides[activeSlideIndex].content[bIdx] = e.target.value;
                                  setPresentation({ ...presentation, slides: updatedSlides });
                                }}
                                onBlur={() => setEditingBulletIdx(null)}
                                onKeyDown={(e) => { if (e.key === "Enter") setEditingBulletIdx(null); }}
                                autoFocus
                                className="bg-transparent border-b border-fuchsia-500 text-sm text-slate-100 outline-none w-full"
                                style={{ color: isThemeDark ? "#ffffff" : "#0f172a" }}
                              />
                            ) : (
                              <p 
                                onDoubleClick={() => setEditingBulletIdx(bIdx)}
                                className="cursor-pointer hover:text-fuchsia-400 leading-relaxed font-sans select-none"
                                style={{ color: isThemeDark ? "rgba(255,255,255,0.9)" : "#1e293b" }}
                              >
                                {bullet}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* LAYOUT: CARDS Grid */}
                    {activeSlide.layout === "cards" && (
                      <div className="col-span-12 grid grid-cols-3 gap-3 h-full items-center select-text pointer-events-auto">
                        {activeSlide.content.map((bullet, bIdx) => (
                          <div 
                            key={bIdx}
                            className={`p-4 rounded-2xl border h-[130px] flex flex-col justify-between backdrop-blur-md shadow-sm`}
                            style={{ 
                              backgroundColor: isThemeDark ? "rgba(255, 255, 255, 0.02)" : "rgba(15, 23, 42, 0.02)", 
                              borderColor: isThemeDark ? "rgba(255, 255, 255, 0.06)" : "rgba(15, 23, 42, 0.08)" 
                            }}
                          >
                            <span className="text-[10px] font-mono tracking-wider font-bold" style={{ color: currentThemeData.accent }}>0{bIdx + 1}</span>
                            {editingBulletIdx === bIdx ? (
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const updatedSlides = [...presentation.slides];
                                  updatedSlides[activeSlideIndex].content[bIdx] = e.target.value;
                                  setPresentation({ ...presentation, slides: updatedSlides });
                                }}
                                onBlur={() => setEditingBulletIdx(null)}
                                onKeyDown={(e) => { if (e.key === "Enter") setEditingBulletIdx(null); }}
                                autoFocus
                                className="bg-transparent border-b border-fuchsia-500 text-xs text-slate-100 outline-none w-full"
                                style={{ color: isThemeDark ? "#ffffff" : "#0f172a" }}
                              />
                            ) : (
                              <p 
                                onDoubleClick={() => setEditingBulletIdx(bIdx)}
                                className="text-xs hover:text-fuchsia-400 select-none line-clamp-4 leading-relaxed font-medium"
                                style={{ color: isThemeDark ? "rgba(255,255,255,0.8)" : "#334155" }}
                              >
                                {bullet}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* LAYOUT: HERO / PRESENTATION INTRO */}
                    {activeSlide.layout === "hero" && (
                      <div className="col-span-12 flex flex-col justify-center h-full select-text pointer-events-auto pr-10">
                        <div className="border-l-4 pl-4 space-y-2.5" style={{ borderColor: currentThemeData.accent }}>
                          {activeSlide.content.slice(0, 2).map((bullet, bIdx) => (
                            <div key={bIdx}>
                              {editingBulletIdx === bIdx ? (
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => {
                                    const updatedSlides = [...presentation.slides];
                                    updatedSlides[activeSlideIndex].content[bIdx] = e.target.value;
                                    setPresentation({ ...presentation, slides: updatedSlides });
                                  }}
                                  onBlur={() => setEditingBulletIdx(null)}
                                  onKeyDown={(e) => { if (e.key === "Enter") setEditingBulletIdx(null); }}
                                  autoFocus
                                  className="bg-transparent border-b border-fuchsia-500 text-sm text-slate-100 outline-none w-full"
                                  style={{ color: isThemeDark ? "#ffffff" : "#0f172a" }}
                                />
                              ) : (
                                <p 
                                  onDoubleClick={() => setEditingBulletIdx(bIdx)}
                                  className="text-sm font-semibold hover:text-fuchsia-400 select-none leading-relaxed"
                                  style={{ color: isThemeDark ? "rgba(255,255,255,0.85)" : "#334155" }}
                                >
                                  {bullet}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* LAYOUT: CHART / DATA GRAPHIC */}
                    {activeSlide.layout === "chart" && (
                      <>
                        <div className="col-span-5 h-full flex items-center justify-center select-none z-10">
                          {activeSlide.visualElement ? renderVisualDiagram(activeSlide.visualElement.type, activeSlide.visualElement.data, currentThemeData.accent) : (
                            <div className="text-xs text-slate-400 font-mono">Pas de visuel</div>
                          )}
                        </div>
                        <div className="col-span-7 space-y-3.5 select-text pointer-events-auto pl-4 pr-2">
                          {activeSlide.content.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-3 text-[13px] md:text-[14px]">
                              <span className="text-sm mt-0.5" style={{ color: currentThemeData.accent }}>▶</span>
                              {editingBulletIdx === bIdx ? (
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => {
                                    const updatedSlides = [...presentation.slides];
                                    updatedSlides[activeSlideIndex].content[bIdx] = e.target.value;
                                    setPresentation({ ...presentation, slides: updatedSlides });
                                  }}
                                  onBlur={() => setEditingBulletIdx(null)}
                                  onKeyDown={(e) => { if (e.key === "Enter") setEditingBulletIdx(null); }}
                                  autoFocus
                                  className="bg-transparent border-b border-fuchsia-500 text-[13px] md:text-[14px] text-slate-100 outline-none w-full"
                                  style={{ color: isThemeDark ? "#ffffff" : "#0f172a" }}
                                />
                              ) : (
                                <p 
                                  onDoubleClick={() => setEditingBulletIdx(bIdx)}
                                  className="cursor-pointer hover:text-fuchsia-400 select-none leading-relaxed"
                                  style={{ color: isThemeDark ? "rgba(255,255,255,0.85)" : "#334155" }}
                                >
                                  {bullet}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                  </div>

                  {/* Footnote branding */}
                  <div className="flex justify-between items-end border-t border-slate-800/10 pt-4">
                    <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest font-sans">
                      Scrivya Suite • Modèle Académique
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      Conférence & Soutenance
                    </span>
                  </div>
                </div>

                {/* ==========================================
                    DRAGGABLE CANVAS ELEMENTS RENDER (OVERLAY LAYER)
                   ========================================== */}
                {activeSlide.canvasElements?.map((element) => {
                  const isSelected = selectedElementId === element.id;
                  
                  return (
                    <div
                      key={element.id}
                      style={{
                        position: "absolute",
                        left: `${element.x}%`,
                        top: `${element.y}%`,
                        width: `${element.width}%`,
                        height: `${element.height}%`,
                        zIndex: 30,
                        touchAction: "none"
                      }}
                      onPointerDown={(e) => handlePointerDownElement(e, element.id)}
                      onPointerMove={handlePointerMoveElement}
                      onPointerUp={handlePointerUpElement}
                      className={`group select-none cursor-move ${
                        isSelected ? "ring-2 ring-fuchsia-500 ring-offset-2 ring-offset-transparent" : "hover:ring-1 hover:ring-slate-500/50"
                      }`}
                    >
                      {/* Drag / Move element indicator bar */}
                      <div className="absolute top-[-22px] left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-fuchsia-600 text-[8px] text-white font-extrabold uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        Déplacer
                      </div>

                      {/* Content Render based on Element Type */}
                      <div className="w-full h-full flex items-center justify-center relative">
                        {element.type === "shape" && (
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d={element.content} fill={element.color || currentThemeData.accent} opacity="0.85" />
                          </svg>
                        )}

                        {element.type === "emoji" && (
                          <span className="text-center" style={{ fontSize: `${element.width * 4}px` }}>
                            {element.content}
                          </span>
                        )}

                        {element.type === "image" && (
                          <img 
                            src={element.content} 
                            alt="Canva item" 
                            className="w-full h-full object-cover rounded-xl shadow-md border border-slate-500/10" 
                            referrerPolicy="no-referrer"
                          />
                        )}

                        {element.type === "text" && (
                          <span className="text-center font-bold text-xs p-1" style={{ color: isThemeDark ? "#fff" : "#000" }}>
                            {element.content}
                          </span>
                        )}
                      </div>

                      {/* Resize Handle at Bottom-Right */}
                      {isSelected && (
                        <div 
                          onPointerDown={(e) => startResize(e, element.id)}
                          className="absolute bottom-[-4px] right-[-4px] w-3 h-3 bg-fuchsia-500 rounded-full border-2 border-white cursor-se-resize shadow-md z-40"
                        />
                      )}
                    </div>
                  );
                })}

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-500">Aucune présentation chargée. Utilisez l'IA ou les thèmes de gauche.</span>
            </div>
          )}

          {/* ==========================================
              BOTTOM SLIDE THUMBNAILS CAROUSEL (DRAG REORDER)
             ========================================== */}
          <div className={`p-4 rounded-2xl border shrink-0 ${isLight ? "bg-white border-slate-200" : "bg-[#0c0f1a]/85 border-slate-800/80"} backdrop-blur-xl`}>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-fuchsia-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Plan des Diapositives (Glisser pour ordonner)</span>
              </div>
              <div className="flex gap-1.5">
                <button 
                  onClick={addBlankSlide}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-bold bg-fuchsia-600/15 border border-fuchsia-500/20 hover:bg-fuchsia-600/25 text-fuchsia-400 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Ajouter</span>
                </button>
                <button 
                  onClick={deleteActiveSlide}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-bold bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>

            {/* Thumbnail items */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {presentation.slides.map((slide, idx) => {
                const isActive = activeSlideIndex === idx;
                
                return (
                  <div
                    key={slide.id}
                    draggable
                    onDragStart={() => handleSlideDragStart(idx)}
                    onDragOver={(e) => handleSlideDragOver(e, idx)}
                    onDrop={() => handleSlideDrop(idx)}
                    onClick={() => {
                      setActiveSlideIndex(idx);
                      setSelectedElementId(null);
                    }}
                    className={`relative w-36 aspect-[16/10] rounded-xl overflow-hidden cursor-pointer border shrink-0 transition-all ${
                      isActive 
                        ? "border-fuchsia-500 ring-2 ring-fuchsia-500/30 scale-102" 
                        : "border-slate-800/60 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/40"
                    }`}
                  >
                    <div className="absolute inset-0 p-2 flex flex-col justify-between z-10 pointer-events-none">
                      <span className="text-[8px] font-bold text-slate-500 font-mono">0{idx + 1}</span>
                      <span className="text-[9px] font-bold truncate block text-slate-300 pr-1">{slide.title}</span>
                      <span className="text-[7px] font-medium text-slate-600 uppercase tracking-wider block font-mono">{slide.layout}</span>
                    </div>
                    {/* Visual theme mock inside thumbnails */}
                    <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-fuchsia-500 to-pink-500 pointer-events-none" />
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ==========================================
          SOUTENANCE MODE (FULL SCREEN OVERLAY)
         ========================================== */}
      <AnimatePresence>
        {isFullscreen && activeSlide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#070913] z-[999] flex flex-col justify-between p-10 font-sans cursor-none select-none"
          >
            {/* Embedded Grid background */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-30" 
              style={{
                backgroundImage: `radial-gradient(${currentThemeData.gridColor} 1.5px, transparent 1.5px)`,
                backgroundSize: "28px 28px"
              }}
            />

            {/* Top Bar info */}
            <div className="flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                  Soutenance Active • {presentation.title}
                </span>
              </div>
              <button 
                onClick={() => setIsFullscreen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-800 text-[10px] font-bold text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors"
              >
                Quitter (ESC)
              </button>
            </div>

            {/* Slide Body */}
            <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full z-10 mt-10">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2" style={{ color: currentThemeData.accent }}>
                {activeSlide.title}
              </h1>
              {activeSlide.subtitle && (
                <p className="text-sm md:text-base font-semibold text-slate-400 italic mb-8">
                  {activeSlide.subtitle}
                </p>
              )}

              {/* Grid content based on slide layout */}
              <div className="grid grid-cols-12 gap-10 items-center">
                
                {activeSlide.layout === "split" && (
                  <>
                    <div className="col-span-7 space-y-4 pr-10">
                      {activeSlide.content.map((bullet, idx) => (
                        <p key={idx} className="text-sm md:text-base leading-relaxed text-slate-200 font-medium">
                          • {bullet}
                        </p>
                      ))}
                    </div>
                    <div className="col-span-5 h-[280px]">
                      {activeSlide.visualElement ? renderVisualDiagram(activeSlide.visualElement.type, activeSlide.visualElement.data, currentThemeData.accent) : null}
                    </div>
                  </>
                )}

                {activeSlide.layout === "text-only" && (
                  <div className="col-span-12 space-y-5">
                    {activeSlide.content.map((bullet, idx) => (
                      <p key={idx} className="text-base md:text-lg leading-relaxed text-slate-100 font-medium pl-4 border-l-2 border-fuchsia-500">
                        {bullet}
                      </p>
                    ))}
                  </div>
                )}

                {activeSlide.layout === "cards" && (
                  <div className="col-span-12 grid grid-cols-3 gap-4">
                    {activeSlide.content.map((bullet, idx) => (
                      <div 
                        key={idx} 
                        className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/25 backdrop-blur-md flex flex-col justify-between h-[180px]"
                      >
                        <span className="text-xs font-mono font-bold" style={{ color: currentThemeData.accent }}>0{idx + 1}</span>
                        <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-semibold">{bullet}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeSlide.layout === "hero" && (
                  <div className="col-span-12 space-y-5">
                    {activeSlide.content.map((bullet, idx) => (
                      <p key={idx} className="text-lg md:text-xl font-bold leading-relaxed text-slate-100">
                        {bullet}
                      </p>
                    ))}
                  </div>
                )}

                {activeSlide.layout === "chart" && (
                  <>
                    <div className="col-span-5 h-[280px]">
                      {activeSlide.visualElement ? renderVisualDiagram(activeSlide.visualElement.type, activeSlide.visualElement.data, currentThemeData.accent) : null}
                    </div>
                    <div className="col-span-7 space-y-4 pl-10">
                      {activeSlide.content.map((bullet, idx) => (
                        <p key={idx} className="text-sm md:text-base leading-relaxed text-slate-200 font-medium">
                          ▶ {bullet}
                        </p>
                      ))}
                    </div>
                  </>
                )}

              </div>
            </div>

            {/* Bottom slides navigation footer */}
            <div className="flex justify-between items-center z-10 border-t border-slate-900 pt-6">
              <span className="text-[10px] font-bold text-slate-500 font-mono">
                DIAPOSITIVE {activeSlideIndex + 1} / {presentation.slides.length}
              </span>
              
              <div className="flex gap-3">
                <button 
                  disabled={activeSlideIndex === 0}
                  onClick={() => setActiveSlideIndex(prev => prev - 1)}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 disabled:opacity-20 text-slate-400 hover:text-white transition-all hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  disabled={activeSlideIndex === presentation.slides.length - 1}
                  onClick={() => setActiveSlideIndex(prev => prev + 1)}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 disabled:opacity-20 text-slate-400 hover:text-white transition-all hover:scale-105"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <span className="text-[10px] font-bold text-slate-500 font-mono">
                SCRIVYA PRESENTATION SUITE v3.0
              </span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
