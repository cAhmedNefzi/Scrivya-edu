import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Check, 
  CheckSquare,
  Loader2, 
  Send, 
  MessageSquare, 
  HelpCircle, 
  LogOut, 
  X, 
  ChevronRight, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Undo, 
  Redo,
  Type, 
  Palette, 
  Plus, 
  Download, 
  Grid,
  Moon,
  Sun,
  Globe,
  Settings,
  CornerDownLeft,
  Trash2,
  Bookmark,
  ChevronDown,
  Award,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  Search,
  GraduationCap,
  ZoomIn,
  ZoomOut,
  Compass,
  Presentation,
  Layers
} from "lucide-react";
import { initialPages, PageData } from "../defaultPages";
import AIMentorMap from "./AIMentorMap";
import PresentationMaker from "./PresentationMaker";
import PfeHubWorkspace from "./PfeHubWorkspace";

interface User {
  name: string;
  email: string;
  university?: string;
}

interface AcademicWorkspaceProps {
  currentUser: User;
  onLogout: () => void;
  lang: "fr" | "en" | "ar";
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}

interface Footnote {
  id: number | string;
  author?: string;
  title?: string;
  publisher?: string;
  year?: string;
  page?: string;
  formattedText: string;
  sourceKind: "book" | "article" | "thesis" | "law" | "web" | "custom";
  pageId?: string;
  index?: number;
  label?: string;
  abstract?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface EditablePageContentProps {
  pageId: string;
  initialContent: string;
  onBlur: (pageId: string, newHtml: string) => void;
  fontSize: string;
  fontFamily: string;
  textColor: string;
  onFocus: () => void;
  onSuggestFootnote: (phrase: string, pageId: string) => void;
  onDismissSuggestion: () => void;
  selectedSplitMistake: string | null;
  spellErrors: any[];
  onCorrectMistake: (mistake: string, correction: string) => void;
}

const EditablePageContent = React.memo(({
  pageId,
  initialContent,
  onBlur,
  fontSize,
  fontFamily,
  textColor,
  onFocus,
  onSuggestFootnote,
  onDismissSuggestion,
  selectedSplitMistake,
  spellErrors,
  onCorrectMistake
}: EditablePageContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const lastHTML = useRef(initialContent);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [suggestionPosition, setSuggestionPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      let displayContent = initialContent;
      if (selectedSplitMistake) {
        const escapedMistake = selectedSplitMistake.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(?<!<[^>]*)(${escapedMistake})(?![^<]*>)`, 'gi');
        displayContent = displayContent.replace(regex, `<span class="bg-red-500/30 border-b-2 border-rose-600 text-rose-950 font-bold px-0.5 rounded animate-pulse" id="temp-highlight-marker">${selectedSplitMistake}</span>`);
      }
      
      const normalizeHTML = (html: string) => {
        return html
          .replace(/\s+/g, ' ')
          .replace(/<br\s*\/?>/gi, '')
          .replace(/&nbsp;/g, ' ')
          .trim();
      };

      const currentHTML = ref.current.innerHTML;
      const isContentIdentical = normalizeHTML(currentHTML) === normalizeHTML(displayContent);
      const isExternalChange = initialContent !== lastHTML.current;

      if ((isExternalChange && !isContentIdentical) || selectedSplitMistake) {
        ref.current.innerHTML = displayContent;
        lastHTML.current = initialContent;
      }
    }
  }, [pageId, selectedSplitMistake, initialContent]);

  React.useLayoutEffect(() => {
    if (selectedSplitMistake && ref.current) {
      const timer = setTimeout(() => {
        const marker = document.getElementById("temp-highlight-marker");
        if (marker && ref.current) {
          const markerRect = marker.getBoundingClientRect();
          const containerRect = ref.current.getBoundingClientRect();
          
          setSuggestionPosition({
            top: markerRect.bottom - containerRect.top,
            left: Math.max(10, Math.min(containerRect.width - 270, markerRect.left - containerRect.left)),
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setSuggestionPosition(null);
    }
  }, [selectedSplitMistake, pageId, initialContent]);

  const handleInput = () => {
    if (ref.current) {
      const currentHTML = ref.current.innerHTML;
      lastHTML.current = currentHTML;
      
      // Debounce saving the checkpoint to the history undo stack (covers character and word deletions in real-time)
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        onBlur(pageId, currentHTML);
      }, 700);
    }
  };

  const handleBlur = () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (ref.current) {
      const currentHTML = ref.current.innerHTML;
      lastHTML.current = currentHTML;
      onBlur(pageId, currentHTML);
    }
  };

  const formatItalicsInElement = (el: HTMLElement) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let textNode = walker.nextNode() as Text | null;
    const matchesFound: string[] = [];

    while (textNode) {
      const text = textNode.textContent || "";
      // Match either >phrase> or <phrase>
      const match = text.match(/>([^<>]+)>/) || text.match(/<([^<>]+)>/);
      if (match && match.index !== undefined) {
        const fullMatch = match[0];
        const phrase = match[1];
        const phraseTrimmed = phrase.trim();

        const parent = textNode.parentNode;
        if (parent) {
          matchesFound.push(phraseTrimmed);
          const index = match.index;
          const textBefore = text.substring(0, index);
          const textAfter = text.substring(index + fullMatch.length);

          const nodeBefore = document.createTextNode(textBefore);
          const em = document.createElement("em");
          em.textContent = phraseTrimmed;
          const nodeAfter = document.createTextNode(textAfter);

          parent.insertBefore(nodeBefore, textNode);
          parent.insertBefore(em, textNode);
          parent.insertBefore(nodeAfter, textNode);

          const oldNode = textNode;
          textNode = walker.nextNode() as Text | null;
          parent.removeChild(oldNode);

          try {
            const sel = window.getSelection();
            if (sel) {
              const range = document.createRange();
              range.setStartAfter(em);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
            }
          } catch (err) {
            console.error("Caret reposition failing during walker", err);
          }
          continue;
        }
      }
      textNode = walker.nextNode() as Text | null;
    }

    if (matchesFound.length > 0) {
      // Suggest the footnote for the newly formatted italicized text!
      onSuggestFootnote(matchesFound[matchesFound.length - 1], pageId);
      const newHtml = el.innerHTML;
      lastHTML.current = newHtml;
      onBlur(pageId, newHtml);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    if (e.key === 'Enter' || e.key === '>') {
      formatItalicsInElement(el);
    } else if (e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Meta') {
      onDismissSuggestion();
    }
  };

  const checkAndClearPlaceholder = () => {
    onFocus();
    if (ref.current) {
      const html = ref.current.innerHTML;
      if (html.includes("[Double-cliquez pour rédiger ici votre texte libre universitaire...]")) {
        const emptyContent = `<p class="text-justify font-serif text-sm leading-relaxed text-slate-800"><br></p>`;
        ref.current.innerHTML = emptyContent;
        lastHTML.current = emptyContent;
        onBlur(pageId, emptyContent);

        setTimeout(() => {
          if (ref.current) {
            ref.current.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(ref.current);
            range.collapse(false);
            if (sel) {
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }
        }, 50);
      }
    }
  };

  // Find mistake details
  const activeError = selectedSplitMistake
    ? spellErrors.find(e => e.mistake.toLowerCase() === selectedSplitMistake.toLowerCase())
    : null;

  return (
    <div className="relative w-full h-full">
      <div
        ref={ref}
        contentEditable="true"
        data-page-id={pageId}
        suppressContentEditableWarning={true}
        onFocus={checkAndClearPlaceholder}
        onClick={checkAndClearPlaceholder}
        onInput={handleInput}
        onBlur={handleBlur}
        onKeyUp={handleKeyUp}
        className="outline-none text-slate-800 focus:outline-none select-text text-justify min-h-[400px]"
        style={{ fontSize, fontFamily, color: textColor }}
      />

      {suggestionPosition && activeError && (
        <div 
          contentEditable={false}
          style={{ 
            position: 'absolute', 
            top: `${suggestionPosition.top + 5}px`, 
            left: `${suggestionPosition.left}px`,
            zIndex: 100,
          }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-2xl w-64 text-left font-sans select-none animate-fadeIn flex flex-col gap-2.5 relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Small Arrow pointing up */}
          <div className="absolute -top-1.5 left-4 w-3 h-3 bg-white dark:bg-slate-900 border-t border-l border-slate-200 dark:border-slate-800 rotate-45" />

          <div className="flex items-center justify-between border-b pb-1.5 border-slate-100 dark:border-white/5 relative">
            <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-rose-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
              Suggestion Smart
            </span>
            <span className="text-[9px] text-slate-400 font-mono">Check Split</span>
          </div>
          
          <div className="text-xs">
            <span className="text-slate-400">Remplacer : </span>
            <span className="font-bold text-red-500 line-through">{selectedSplitMistake}</span>
          </div>
          
          <div className="text-xs flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400">Par : </span>
            <span className="px-2 py-0.5 bg-emerald-505/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg border border-emerald-500/20 text-xs shadow-sm">
              {activeError.correction}
            </span>
          </div>

          <p className="text-[10px] italic text-slate-500 leading-normal border-l-2 border-slate-200 pl-1.5 dark:border-white/10">
            {activeError.explanation}
          </p>
          
          <div className="flex gap-1.5 text-[11px] pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCorrectMistake(selectedSplitMistake!, activeError.correction);
              }}
              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition-colors text-center text-xs"
            >
              Appliquer
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDismissSuggestion();
              }}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg cursor-pointer transition-colors text-center dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 text-xs"
            >
              Ignorer
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default function AcademicWorkspace({
  currentUser,
  onLogout,
  lang,
  theme,
  setTheme
}: AcademicWorkspaceProps) {
  const isLight = theme === "light";
  
  const getCoverNotice = () => {
    if (lang === "ar") {
      return {
        badge: "دليل الكتابة",
        title: "📌 دليل إدخال البيانات الإجباري :",
        redText: "🔴 إلّي بالأحمر إجباري يتحطّوا (هذه الخيارات أساسية للتحقق من مطابقة مذكرتك)",
        greenText: "🟢 بالأخضر تنجّم تعمل سكايب/سكيب (خانات اختيارية للتقييم أو الفهرسة)",
        footer: "هذه الملاحظة للتوجيه الخارجي من سكريفيا، لن تظهر في مستندك النهائي المطبوع."
      };
    } else if (lang === "en") {
      return {
        badge: "WRITING GUIDE",
        title: "📌 Mandatory Writing Guide :",
        redText: "🔴 \"Li bl ahmer\" (in red) must be filled in (These fields are indispensable for your thesis compliance check)",
        greenText: "🟢 \"Bl vert\" (in green) can be skipped (Secondary optional evaluation or indexing fields)",
        footer: "This helper notice is an external Scrivya annotation and will not appear on your final printed document."
      };
    } else {
      return {
        badge: "GUIDE DE SAISIE",
        title: "📌 Guide de Saisie Obligatoire :",
        redText: "🔴 Li bl ahmer obligatoire yethatou (Ces champs sont indispensables pour la validation de conformité de votre mémoire)",
        greenText: "🟢 Bl vert inajem yaamel skip (Champs secondaires d'évaluation ou d'indexation facultatifs)",
        footer: "Cette notice d'aide est une annotation externe de Scrivya, elle n'apparaitra pas sur votre document imprimé final."
      };
    }
  };

  const getWarningModal = () => {
    if (lang === "ar") {
      return {
        title: "تذكير الصياغة",
        desc: "رد بالك، فما خانات إجبارية (إلّي بالأحمر) في صفحة الغلاف ما زلت ما كملتهمش!",
        subtitle: "🔴 خانات مطلوبة ما تبدلتش :",
        badgeField: "خانة",
        correctBtn: "صلّح توة ←",
        backBtn: "الرجوع للمحرر",
        downloadBtn: "تحميل على كل حال (.TXT)"
      };
    } else if (lang === "en") {
      return {
        title: "Formatting Reminder",
        desc: "Keep in mind, some mandatory fields (\"Li bl ahmer\") on the cover page have not been completed yet!",
        subtitle: "🔴 Unmodified required fields :",
        badgeField: "Field",
        correctBtn: "Correct →",
        backBtn: "Return to Editor",
        downloadBtn: "Download Anyway (.TXT)"
      };
    } else {
      return {
        title: "Rappel de Mise en Page",
        desc: "Attention, certains champs obligatoires (« Li bl ahmer ») sur la page de couverture n'ont pas encore été complétés !",
        subtitle: "🔴 Champs obligatoires non modifiés :",
        badgeField: "Champ",
        correctBtn: "Corriger ←",
        backBtn: "Retourner à l'éditeur",
        downloadBtn: "Télécharger quand même (.TXT)"
      };
    }
  };

  // Dynamic top document naming & styling
  const [docTitle, setDocTitle] = useState("Mémoire_Droit_Public_Tunis.docx");
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Times New Roman");
  const [textColor, setTextColor] = useState("#1e293b");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [hideCoverGuides, setHideCoverGuides] = useState(false);

  // Onboarding Wizard State
  const [onboardingOpen, setOnboardingOpen] = useState(true);
  const [obStep, setObStep] = useState(1);
  const [obData, setObData] = useState({
    name: "",
    university: "Université de Carthage",
    logo: null as string | null,
    degreeNature: "memoire" as "memoire" | "these",
    documentTitle: "",
    degreeMajor: "",
    supervisor: "",
    academicYear: "2025 – 2026"
  });

  // Core state for pages, footnotes, and cover metadata with robust Undo/Redo tracking
  const [pages, setPagesRaw] = useState<PageData[]>(initialPages);
  
  // Pre-configured Footnotes (declared raw first to be used by the snapshot engine)
  const [footnotes, setFootnotesRaw] = useState<Footnote[]>([
    {
      id: 1,
      author: "NEFZI, Ahmed",
      title: "IA et l'humain : enjeux conceptuels",
      publisher: "L.D.G.R.",
      year: "2024",
      page: "20",
      formattedText: "NEFZI (A.), « *IA et l’humain* », Tunis, L.D.G.R., 2024, p. 20.",
      sourceKind: "book",
      pageId: "kteb",
      abstract: "Cette étude explore les enjeux éthiques et conceptuels de l'intégration de l'intelligence artificielle dans les processus décisionnels humains. Elle analyse comment les systèmes autonomes redéfinissent la notion de responsabilité individuelle et collective dans le droit positif tunisien, tout en proposant un cadre d'adaptation pour préserver l'autonomie et la dignité humaine face au développement technologique rapide."
    }
  ]);

  // Cover page custom meta-data (tunisian academic model) - declared raw first
  const [cover, setCoverRaw] = useState({
    republique: "République Tunisienne",
    ministere: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique",
    universite: "Université de Carthage",
    faculte: "Faculté des Sciences Juridiques, Politiques et Sociales de Tunis",
    mastere: "MÉMOIRE EN VUE DE L'OBTENTION D'UN MASTÈRE DE",
    mastereRed: "RECHERCHE EN DROIT PUBLIC INTERNE",
    nomMemoire: "Nom du mémoire",
    soutenuPar: "Esm telmidh",
    sousDirection: "nom de l'encadrant(e)",
    president: "XX",
    rapporteur: "XX",
    directeur: "XX",
    annee: "XX – X"
  });

  // History stacks
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Latest refs to avoid closures issues in callbacks
  const latestPages = useRef<PageData[]>(pages);
  const latestFootnotes = useRef<Footnote[]>(footnotes);
  const latestCover = useRef<any>(cover);

  useEffect(() => { latestPages.current = pages; }, [pages]);
  useEffect(() => { latestFootnotes.current = footnotes; }, [footnotes]);
  useEffect(() => { latestCover.current = cover; }, [cover]);

  const isNomMemoireDone = hideCoverGuides || !!(cover.nomMemoire && cover.nomMemoire.trim() !== "" && cover.nomMemoire.toLowerCase() !== "nom du mémoire" && cover.nomMemoire.toLowerCase() !== "nom du memoire" && cover.nomMemoire.toLowerCase() !== "ecrire le nom de mémoire..." && cover.nomMemoire.toLowerCase() !== "nom_du_mémoire" && cover.nomMemoire.toLowerCase() !== "saisir");
  const isSoutenuDone = hideCoverGuides || !!(cover.soutenuPar && cover.soutenuPar.trim() !== "" && cover.soutenuPar.toLowerCase() !== "esm telmidh" && cover.soutenuPar.toLowerCase() !== "esm_telmidh" && cover.soutenuPar.toLowerCase() !== "saisir");
  const isSousDirectionDone = hideCoverGuides || !!(cover.sousDirection && cover.sousDirection.trim() !== "" && cover.sousDirection.toLowerCase() !== "nom de l'encadrant(e)" && cover.sousDirection.toLowerCase() !== "nom de l'encadrante" && cover.sousDirection.toLowerCase() !== "saisir" && cover.sousDirection.toLowerCase() !== "nom de l’encadrante" && cover.sousDirection.toLowerCase() !== "nom de l’encadrant(e)");
  const isPresidentDone = hideCoverGuides || !!(cover.president && cover.president.trim() !== "" && cover.president.toLowerCase() !== "xx" && cover.president.toLowerCase() !== "saisir" && cover.president.toLowerCase() !== "président" && cover.president.toLowerCase() !== "president");
  const isRapporteurDone = hideCoverGuides || !!(cover.rapporteur && cover.rapporteur.trim() !== "" && cover.rapporteur.toLowerCase() !== "xx" && cover.rapporteur.toLowerCase() !== "saisir" && cover.rapporteur.toLowerCase() !== "rapporteur");
  const isDirecteurDone = hideCoverGuides || !!(cover.directeur && cover.directeur.trim() !== "" && cover.directeur.toLowerCase() !== "xx" && cover.directeur.toLowerCase() !== "saisir" && cover.directeur.toLowerCase() !== "directeur");
  const isAnneeDone = hideCoverGuides || !!(cover.annee && cover.annee.trim() !== "" && cover.annee !== "XX – X" && cover.annee !== "XX - X" && cover.annee.toLowerCase() !== "xx – x" && cover.annee.toLowerCase() !== "xx - x" && cover.annee.toLowerCase() !== "année universitaire");
  const isMastereDone = hideCoverGuides || !!(cover.mastereRed && cover.mastereRed.trim() !== "" && cover.mastereRed.toLowerCase() !== "recherche en droit public interne" && cover.mastereRed.toLowerCase() !== "recherche en droit" && cover.mastereRed.toLowerCase() !== "saisir");

  const getLatestSnapshot = useCallback(() => {
    return JSON.stringify({
      pages: latestPages.current,
      footnotes: latestFootnotes.current,
      cover: latestCover.current
    });
  }, []);

  const saveStateBeforeChange = useCallback(() => {
    const snapshot = getLatestSnapshot();
    const lastSaved = undoStack.current[undoStack.current.length - 1];
    if (snapshot !== lastSaved) {
      undoStack.current.push(snapshot);
      if (undoStack.current.length > 200) {
        undoStack.current.shift();
      }
      redoStack.current = []; // Clear redo stack on new action
      setCanUndo(true);
      setCanRedo(false);
    }
  }, [getLatestSnapshot]);

  const setPages = useCallback((newPagesOrFunc: PageData[] | ((prev: PageData[]) => PageData[])) => {
    saveStateBeforeChange();
    setPagesRaw((prev) => {
      return typeof newPagesOrFunc === 'function' ? newPagesOrFunc(prev) : newPagesOrFunc;
    });
  }, [saveStateBeforeChange]);

  const setFootnotes = useCallback((newFootnotesOrFunc: Footnote[] | ((prev: Footnote[]) => Footnote[])) => {
    saveStateBeforeChange();
    setFootnotesRaw((prev) => {
      return typeof newFootnotesOrFunc === 'function' ? newFootnotesOrFunc(prev) : newFootnotesOrFunc;
    });
  }, [saveStateBeforeChange]);

  const setCover = useCallback((newCoverOrFunc: any | ((prev: any) => any)) => {
    saveStateBeforeChange();
    setCoverRaw((prev) => {
      return typeof newCoverOrFunc === 'function' ? newCoverOrFunc(prev) : newCoverOrFunc;
    });
  }, [saveStateBeforeChange]);

  const handleUndo = useCallback(() => {
    if (undoStack.current.length > 0) {
      const currentSnapshot = getLatestSnapshot();
      redoStack.current.push(currentSnapshot);

      const previousSnapshot = undoStack.current.pop();
      if (previousSnapshot) {
        try {
          const parsed = JSON.parse(previousSnapshot);
          
          setPagesRaw(parsed.pages);
          setFootnotesRaw(parsed.footnotes);
          setCoverRaw(parsed.cover);

          setCanUndo(undoStack.current.length > 0);
          setCanRedo(true);

          // Force active editors to update content instantly
          setTimeout(() => {
            parsed.pages.forEach((p: PageData) => {
              const el = document.querySelector(`[contenteditable="true"][data-page-id="${p.id}"]`) as HTMLDivElement;
              if (el && el.innerHTML !== p.content) {
                el.innerHTML = p.content;
              }
            });
          }, 30);
        } catch (err) {
          console.error("Failed to parse undo state", err);
        }
      }
    }
  }, [getLatestSnapshot]);

  const handleRedo = useCallback(() => {
    if (redoStack.current.length > 0) {
      const currentSnapshot = getLatestSnapshot();
      undoStack.current.push(currentSnapshot);

      const nextSnapshot = redoStack.current.pop();
      if (nextSnapshot) {
        try {
          const parsed = JSON.parse(nextSnapshot);
          
          setPagesRaw(parsed.pages);
          setFootnotesRaw(parsed.footnotes);
          setCoverRaw(parsed.cover);

          setCanUndo(true);
          setCanRedo(redoStack.current.length > 0);

          // Force active editors to update content instantly
          setTimeout(() => {
            parsed.pages.forEach((p: PageData) => {
              const el = document.querySelector(`[contenteditable="true"][data-page-id="${p.id}"]`) as HTMLDivElement;
              if (el && el.innerHTML !== p.content) {
                el.innerHTML = p.content;
              }
            });
          }, 30);
        } catch (err) {
          console.error("Failed to parse redo state", err);
        }
      }
    }
  }, [getLatestSnapshot]);

  // Global Ctrl+Z & Ctrl+Y / Cmd+Z & Cmd+Y / Shift+Cmd+Z listeners
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isZ = e.key?.toLowerCase() === 'z';
      const isY = e.key?.toLowerCase() === 'y';
      
      if ((e.ctrlKey || e.metaKey) && isZ) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && isY) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleUndo, handleRedo]);

  const pagesRef = useRef<PageData[]>(initialPages);
  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  // Logo upload and download verification states
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [downloadWarning, setDownloadWarning] = useState<{
    isOpen: boolean;
    missingFields: { field: string; id: string; name: string }[];
  }>({
    isOpen: false,
    missingFields: []
  });

  const [chatSelection, setChatSelection] = useState<{ text: string; rect: DOMRect } | null>(null);
  const [pageSelection, setPageSelection] = useState<{ text: string; rect: DOMRect } | null>(null);
  const savedRange = useRef<Range | null>(null);
  const [isFormulationSubmenuOpen, setIsFormulationSubmenuOpen] = useState(false);
  const [isReformulating, setIsReformulating] = useState(false);

  const handleLogoUploadClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [activePageId, setActivePageId] = useState<string>("introduction");
  const [showAIMentor, setShowAIMentor] = useState<boolean>(false);
  const [showPresentationMaker, setShowPresentationMaker] = useState<boolean>(false);
  const [showPfeHub, setShowPfeHub] = useState<boolean>(false);

  const [footnoteNumberingMode, setFootnoteNumberingMode] = useState<"continuous" | "restart-each-page" | "alphabetical-lowercased">("continuous");
  const [hoveredFootnote, setHoveredFootnote] = useState<{
    id: string | number;
    formattedText: string;
    x: number;
    y: number;
  } | null>(null);

  // Helper to jump scroll back to matching text anchor inside the text body
  const handleReturnToAnchor = (id: string | number) => {
    const anchor = document.querySelector(
      `.footnote-anchor[data-id="${id}"], .footnote-link[data-footnote-id="${id}"], .footnote-link[data-id="${id}"], .footnote-anchor[data-footnote-id="${id}"]`
    );
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
      anchor.classList.add("ring-4", "ring-blue-400/50", "scale-125", "bg-yellow-100", "transition-all");
      setTimeout(() => {
        anchor.classList.remove("ring-4", "ring-blue-400/50", "scale-125","bg-yellow-100", "transition-all");
      }, 1500);
    }
  };

  // Step 3: Sequence Renumbering Engine
  const runSequenceRenumbering = (currentFootnotesList = footnotes) => {
    const activePageContainers = Array.from(document.querySelectorAll(`[contenteditable="true"][data-page-id]`));
    
    // Sort pages in physical order of presentation
    const pageOrderMap = new Map<string, number>();
    pages.forEach((p, idx) => {
      pageOrderMap.set(p.id, idx);
    });

    activePageContainers.sort((a, b) => {
      const idA = a.getAttribute("data-page-id") || "";
      const idB = b.getAttribute("data-page-id") || "";
      return (pageOrderMap.get(idA) ?? 0) - (pageOrderMap.get(idB) ?? 0);
    });

    const anchors: HTMLElement[] = [];
    activePageContainers.forEach(container => {
      const pageElements = Array.from(container.querySelectorAll(".footnote-anchor, .footnote-link")) as HTMLElement[];
      // Filter out duplicate selections if elements have both classes, and filter out footnote-link helper block-buttons
      const uniquePageAnchors = pageElements.filter((el, index, self) => 
        self.indexOf(el) === index && !el.classList.contains("bg-slate-100") // Skip bibliographie block buttons if they use footnote-link
      );
      anchors.push(...uniquePageAnchors);
    });

    const pageCounterMap = new Map<string, number>();

    const indexToAlphabet = (index: number): string => {
      let temp = index;
      let result = "";
      while (temp >= 0) {
        result = String.fromCharCode((temp % 26) + 97) + result;
        temp = Math.floor(temp / 26) - 1;
      }
      return result;
    };

    const getLabel = (idx: number, pId: string) => {
      if (footnoteNumberingMode === "restart-each-page") {
        const currentCount = (pageCounterMap.get(pId) || 0) + 1;
        pageCounterMap.set(pId, currentCount);
        return currentCount.toString();
      } else if (footnoteNumberingMode === "alphabetical-lowercased") {
        return indexToAlphabet(idx);
      } else {
        return (idx + 1).toString();
      }
    };

    let orderChanged = false;
    const updatedFootnotes = currentFootnotesList.map((fn) => {
      const elementIdx = anchors.findIndex(el => 
        el.getAttribute("data-id") === fn.id.toString() || 
        el.getAttribute("data-footnote-id") === fn.id.toString()
      );
      if (elementIdx !== -1) {
        const el = anchors[elementIdx];
        const pId = el.closest("[data-page-id]")?.getAttribute("data-page-id") || fn.pageId || activePageId;
        const computedLabel = getLabel(elementIdx, pId);
        
        if (el.innerText !== computedLabel) {
          el.innerText = computedLabel;
          orderChanged = true;
        }

        return {
          ...fn,
          index: elementIdx + 1,
          pageId: pId,
          label: computedLabel
        };
      }
      return fn;
    });

    if (orderChanged) {
      activePageContainers.forEach(container => {
        const pId = container.getAttribute("data-page-id");
        if (pId) {
          const content = container.innerHTML;
          // React update pages list without triggering endless focused render loops
          setPages(prev => prev.map(p => p.id === pId ? { ...p, content } : p));
        }
      });
    }

    const sortedFns = [...updatedFootnotes].sort((a, b) => {
      const idxA = a.index !== undefined ? a.index : 9999;
      const idxB = b.index !== undefined ? b.index : 9999;
      return idxA - idxB;
    });

    const hasChanges = JSON.stringify(sortedFns) !== JSON.stringify(currentFootnotesList);
    if (hasChanges) {
      setFootnotes(sortedFns);
    }
  };

  // Step 2: MS Word text anchor insertion redirects to AFNOR popup directly
  const insertWordStyleFootnote = () => {
    // Check if there is an active selection that is inside a contenteditable page
    const currentSel = window.getSelection();
    let currentSelInsidePage = false;
    if (currentSel && currentSel.rangeCount > 0) {
      const activeRange = currentSel.getRangeAt(0);
      let p: HTMLElement | null = activeRange.startContainer?.parentElement || null;
      while (p) {
        if (p.getAttribute?.("contenteditable") === "true") {
          currentSelInsidePage = true;
          break;
        }
        p = p.parentElement;
      }
    }

    // Only restore if we do NOT have an active cursor selection inside a page
    if (!currentSelInsidePage) {
      restoreRangeSelection();
    }

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      alert("Veuillez d'abord cliquer dans une page pour positionner votre curseur.");
      return;
    }
    const range = sel.getRangeAt(0);

    let parent: HTMLElement | null = sel.anchorNode?.parentElement || null;
    let isWithinPage = false;
    let targetPageId = activePageId;
    while (parent) {
      if (parent.getAttribute?.("contenteditable") === "true") {
        isWithinPage = true;
        const pageIdAttr = parent.getAttribute("data-page-id");
        if (pageIdAttr) {
          targetPageId = pageIdAttr;
        }
        break;
      }
      parent = parent.parentElement;
    }

    if (!isWithinPage) {
      alert("Veuillez positionner votre curseur à l'intérieur d'une page active.");
      return;
    }

    savedRange.current = range.cloneRange();
    setIsAfnorPopupOpen(true);
  };

  // Keyboard binding for inserting footnotes Ctrl+Alt+F (Word Replica)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && (e.key === "f" || e.key === "F" || e.key === "ب")) {
        e.preventDefault();
        insertWordStyleFootnote();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [footnotes, activePageId, footnoteNumberingMode, pages]);

  // Step 5: Hover Tooltip dynamic listeners and Bidirectional navigators
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = (target.closest(".footnote-anchor") || target.closest(".footnote-link")) as HTMLElement | null;
      if (anchor && !anchor.classList.contains("bg-slate-100")) {
        const id = anchor.getAttribute("data-id") || anchor.getAttribute("data-footnote-id");
        if (id) {
          const fnItem = footnotes.find(f => f.id.toString() === id);
          if (fnItem) {
            const rect = anchor.getBoundingClientRect();
            setHoveredFootnote({
              id,
              formattedText: fnItem.formattedText,
              x: rect.left + window.scrollX,
              y: rect.top + window.scrollY - 8
            });
          }
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(".footnote-anchor") || target.closest(".footnote-link")) {
        setHoveredFootnote(null);
      }
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = (target.closest(".footnote-anchor") || target.closest(".footnote-link")) as HTMLElement | null;
      if (anchor && !anchor.classList.contains("bg-slate-100")) {
        const id = anchor.getAttribute("data-id") || anchor.getAttribute("data-footnote-id");
        if (id) {
          const footerContainer = document.getElementById(`fn-container-${id}`);
          if (footerContainer) {
            e.preventDefault();
            e.stopPropagation();
            footerContainer.scrollIntoView({ behavior: "smooth", block: "center" });
            footerContainer.classList.add("ring-4", "ring-indigo-500/55", "scale-[1.03]", "bg-blue-50/10");
            setTimeout(() => {
              footerContainer.classList.remove("ring-4", "ring-indigo-500/55", "scale-[1.03]", "bg-blue-50/10");
            }, 1500);

            const input = document.getElementById(`fn-input-${id}`) || document.getElementById(`fn-editor-${id}`);
            if (input) {
              input.focus();
            }
          }
        }
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [footnotes]);

  // Step 6: Destructive Deletion Listener monitoring deletion of anchors from page body
  useEffect(() => {
    const stateAnchorIds = footnotes
      .filter(fn => typeof fn.id === "string" && fn.id.startsWith("fn-id-"))
      .map(fn => fn.id);

    if (stateAnchorIds.length === 0) return;

    const queryIds = new Set(
      Array.from(document.querySelectorAll(".footnote-anchor"))
        .map(el => el.getAttribute("data-id"))
        .filter(Boolean)
    );

    const missingIds = stateAnchorIds.filter(id => !queryIds.has(id));

    if (missingIds.length > 0) {
      setFootnotes(prev => {
        const filtered = prev.filter(fn => !missingIds.includes(fn.id));
        setTimeout(() => runSequenceRenumbering(filtered), 20);
        return filtered;
      });
    }
  }, [pages]);

  // Automated sequential alignment for continuous numbering
  useEffect(() => {
    const timer = setTimeout(() => {
      runSequenceRenumbering();
    }, 150);
    return () => clearTimeout(timer);
  }, [footnotes.length, footnoteNumberingMode]);

  // Navigation and scroll highlight to Bibliography/Biographies page
  const goToBibliography = (footnoteId?: number) => {
    const bibPage = pages.find(p => 
      p.type === "bibliographie" || 
      p.title.toLowerCase().includes("biograph") || 
      p.title.toLowerCase().includes("bibliograph")
    );
    if (bibPage) {
      setActivePageId(bibPage.id);
      setTimeout(() => {
        const targetedEl = footnoteId ? document.getElementById(`bib-item-${footnoteId}`) : null;
        const containerEl = document.getElementById(`page_bed_${bibPage.id}`);
        
        if (targetedEl) {
          targetedEl.scrollIntoView({ behavior: "smooth", block: "center" });
          targetedEl.classList.add("bg-emerald-500/10", "border-emerald-500/80", "scale-[1.03]", "shadow-lg");
          setTimeout(() => {
            targetedEl?.classList.remove("bg-emerald-500/10", "border-emerald-500/80", "scale-[1.03]", "shadow-lg");
          }, 2500);
        } else if (containerEl) {
          containerEl.scrollIntoView({ behavior: "smooth", block: "center" });
          containerEl.classList.add("ring-8", "ring-emerald-400/55", "scale-[1.015]");
          setTimeout(() => {
            containerEl?.classList.remove("ring-8", "ring-emerald-400/55", "scale-[1.015]");
          }, 1500);
        }
      }, 200);
    }
  };

  useEffect(() => {
    const handleFootnoteClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const footnoteEl = target.closest(".footnote-link");
      if (footnoteEl) {
        e.preventDefault();
        e.stopPropagation();
        const fnIdStr = footnoteEl.getAttribute("data-footnote-id");
        if (fnIdStr) {
          goToBibliography(parseInt(fnIdStr, 10));
        }
      }
    };
    window.addEventListener("click", handleFootnoteClick, true);
    return () => {
      window.removeEventListener("click", handleFootnoteClick, true);
    };
  }, [pages]);

  // Form states for adding a footnote
  const [newFootnote, setNewFootnote] = useState({
    authorLast: "",
    authorFirst: "",
    title: "",
    publisher: "",
    year: "",
    page: "",
    sourceKind: "book" as "book" | "article" | "thesis" | "law" | "web",
    abstract: ""
  });

  const [justCompiledFootnote, setJustCompiledFootnote] = useState<Footnote | null>(null);
  const [isAfnorPopupOpen, setIsAfnorPopupOpen] = useState(false);

  // Text reformulation states
  const [reformulationInput, setReformulationInput] = useState("");
  const [reformulationTone, setReformulationTone] = useState("humanize_standard");
  const [reformulationLoading, setReformulationLoading] = useState(false);
  const [reformulationResult, setReformulationResult] = useState("");
  const [reformulationAdjustments, setReformulationAdjustments] = useState<string[]>([]);

  // PhD Research Specialist Tool states
  const [phdQuery, setPhdQuery] = useState("");
  const [phdLoading, setPhdLoading] = useState(false);
  const [phdResult, setPhdResult] = useState<string>("");
  const [phdSources, setPhdSources] = useState<any[]>([]);
  const [phdHasSearched, setPhdHasSearched] = useState(false);
  const [phdShowAllSources, setPhdShowAllSources] = useState(false);
  const [phdHoveredSource, setPhdHoveredSource] = useState<any | null>(null);
  const [phdHoverPos, setPhdHoverPos] = useState({ x: 0, y: 0 });

  const handlePhdSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phdQuery.trim()) return;

    setPhdLoading(true);
    setPhdShowAllSources(false);
    try {
      const response = await fetch("/api/phd-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: phdQuery.trim() }),
      });
      const data = await response.json();
      if (data && data.synthesis) {
        setPhdResult(data.synthesis);
        setPhdSources(data.sources || []);
        setPhdHasSearched(true);
      }
    } catch (error) {
      console.error("PhD Research error:", error);
    } finally {
      setPhdLoading(false);
    }
  };

  const renderPhdSynthesis = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[[0-9]+\])/g);
    return parts.map((part, index) => {
      const match = part.match(/^\[([0-9]+)\]$/);
      if (match) {
        const sourceId = match[1];
        const sourceItem = phdSources.find(s => s.id.toString() === sourceId.toString());

        return (
          <span
            key={`cit-${index}`}
            onMouseEnter={(e) => {
              if (sourceItem) {
                setPhdHoveredSource(sourceItem);
                const rect = e.currentTarget.getBoundingClientRect();
                setPhdHoverPos({
                  x: rect.left + window.scrollX + rect.width / 2,
                  y: rect.top + window.scrollY,
                });
              }
            }}
            onMouseLeave={() => setPhdHoveredSource(null)}
            className="text-blue-600 dark:text-blue-400 font-extrabold hover:text-blue-800 dark:hover:text-blue-300 font-mono text-xs cursor-pointer inline-block bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 mx-0.5 select-none transition-colors"
            title={sourceItem ? `${sourceItem.author}: ${sourceItem.title}` : `Source ${sourceId}`}
          >
            {part}
          </span>
        );
      }
      return <span key={`text-${index}`} className="leading-relaxed whitespace-pre-wrap">{part}</span>;
    });
  };

  // AI Chat Assistant state
  const [activeRightPanel, setActiveRightPanel] = useState<"squelette" | "humaniseur" | "afnor" | "chat" | "spellcheck" | "phd_research" | "plans_problematiques" | null>("squelette");
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);
  const [documentZoom, setDocumentZoom] = useState(100);
  const [isEditingDocTitle, setIsEditingDocTitle] = useState(false);

  // Canva/Figma-style Ctrl/Cmd + mousewheel scroll zoom on the core pages editor
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // Prevent browser's native full-page scale zoom
        e.preventDefault();

        // Smooth zoom step computation
        const factor = e.deltaMode === 1 ? 4 : 0.08;
        const step = -e.deltaY * factor;
        const boundedStep = Math.min(10, Math.max(-10, step));
        setDocumentZoom(prev => {
          const shift = Math.abs(boundedStep) < 0.5 ? Math.sign(boundedStep) * 0.5 : boundedStep;
          const next = prev + shift;
          return Math.min(200, Math.max(30, Math.round(next)));
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const toggleLogoMenu = () => {
    if (isLogoMenuOpen) {
      setIsLogoMenuOpen(false);
    } else {
      setIsLogoMenuOpen(true);
      setActiveRightPanel(null);
    }
  };

  const isChatOpen = activeRightPanel === "chat";
  const setIsChatOpen = (val: boolean | ((p: boolean) => boolean)) => {
    setActiveRightPanel(prev => {
      const nextBool = typeof val === "function" ? val(prev === "chat") : val;
      return nextBool ? "chat" : (prev === "chat" ? null : prev);
    });
  };
  const chatMessageInputRef = useRef("");
  const [chatMessageInput, _setChatMessageInput] = useState("");
  const setChatMessageInput = (val: string | ((prev: string) => string)) => {
    _setChatMessageInput(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      chatMessageInputRef.current = next;
      return next;
    });
  };
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      text: "Bonjour ! Je suis Scrivya, votre assistant d'accompagnement académique. Je maîtrise parfaitement les normes AFNOR NF Z 44-005, APA et les exigences de rédaction académiques. Posez-moi vos questions !"
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    "Qu'est-ce que la norme AFNOR ?",
    "Comment utiliser Ibidem et op.cit. ?",
    "Quelles sont les marges requises à l'FSJPST ?",
    "Insérer une note de bas de page"
  ];

  // Voice Assistant state variables
  const isChatListeningRef = useRef(false);
  const [isChatListening, _setIsChatListening] = useState(false);
  const setIsChatListening = (val: boolean) => {
    _setIsChatListening(val);
    isChatListeningRef.current = val;
  };

  const [currentlyReadingId, setCurrentlyReadingId] = useState<string | null>(null);

  const handleSkipAllOnboarding = useCallback(() => {
    setCover((current: any) => ({
      ...current,
      soutenuPar: "Ahmed Nefzi",
      universite: "Université de Carthage",
      faculte: "Faculté des Sciences Juridiques, Politiques et Sociales de Tunis",
      nomMemoire: "Le régime juridique de la souveraineté numérique dans l'espace euro-méditerranéen",
      mastere: "MÉMOIRE EN VUE DE L'OBTENTION D'UN MASTÈRE DE",
      mastereRed: "RECHERCHE EN DROIT PUBLIC INTERNE",
      sousDirection: "Pr. Jackson Michael",
      annee: "2025 – 2026",
      president: "Pr. Jean Dupont",
      rapporteur: "Pr. Charles Lambert",
      directeur: "Pr. Alice Martin"
    }));

    setUploadedLogo("skipped");

    setChatMessages((prevMsg) => [
      {
        id: "greeting-skip-" + Date.now(),
        role: "assistant",
        text: `Salut Ahmed ! J'ai configuré automatiquement votre Page de Garde avec des données académiques d'excellence (Élaboré par Ahmed Nefzi, Université de Carthage). Je suis prêt à vous guider dans la rédaction de vos travaux ! Comment puis-je vous aider aujourd'hui ?`
      },
      ...prevMsg
    ]);

    setOnboardingOpen(false);
  }, [setCover]);

  const completeOnboarding = useCallback(() => {
    setCover((current: any) => ({
      ...current,
      soutenuPar: obData.name || "Esm telmidh",
      universite: obData.university || "Université de Carthage",
      nomMemoire: obData.documentTitle || "Nom du mémoire",
      mastere: obData.degreeNature === "these" 
        ? "THÈSE EN VUE DE L'OBTENTION D'UN DOCTORAT DE" 
        : "MÉMOIRE EN VUE DE L'OBTENTION D'UN MASTÈRE DE",
      mastereRed: obData.degreeMajor || "RECHERCHE EN DROIT PUBLIC INTERNE",
      sousDirection: obData.supervisor || "nom de l'encadrant(e)",
      annee: obData.academicYear || "2025 – 2026",
      president: !current.president || current.president === "XX" ? "Pr. Jean Dupont" : current.president,
      rapporteur: !current.rapporteur || current.rapporteur === "XX" ? "Pr. Charles Lambert" : current.rapporteur,
      directeur: !current.directeur || current.directeur === "XX" ? "Pr. Alice Martin" : current.directeur
    }));

    if (obData.logo) {
      setUploadedLogo(obData.logo);
    } else {
      setUploadedLogo("skipped");
    }

    const formatName = obData.name ? obData.name.trim() : "Chercheur Académique";
    setChatMessages((prevMsg) => [
      {
        id: "greeting-" + Date.now(),
        role: "assistant",
        text: `Salut ${formatName} ! Je suis Scrivya, votre assistant d'excellence. Vos données d'onboarding ont été appliquées avec succès à votre Page de Garde. Comment puis-je vous guider pour la rédaction de votre ${obData.degreeNature === "these" ? "thèse de doctorat" : "mémoire de mastère"} aujourd'hui ?`
      },
      ...prevMsg
    ]);

    setOnboardingOpen(false);
  }, [obData, setCover]);

  // States for Plans & Problématiques feature
  const [plansOption, setPlansOption] = useState<number | null>(null);
  const [plansInput, setPlansInput] = useState<string>("");
  const [plansResult, setPlansResult] = useState<string>("");
  const [plansLoading, setPlansLoading] = useState<boolean>(false);
  const [plansChatOpen, setPlansChatOpen] = useState<boolean>(false);
  const [plansChatMessages, setPlansChatMessages] = useState<ChatMessage[]>([]);
  const [plansChatMessageInput, setPlansChatMessageInput] = useState<string>("");
  const [plansChatLoading, setPlansChatLoading] = useState<boolean>(false);

  const handlePlansSubmit = async (opt: number, customInput?: string) => {
    setPlansLoading(true);
    setPlansResult("");
    setPlansChatOpen(false);
    setPlansChatMessages([]);
    
    const esm_memoire = obData.documentTitle || cover.nomMemoire || "Droit Public Tunisien";
    
    try {
      const response = await fetch("/api/plans-problematiques", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          option: opt,
          esm_memoire,
          donnees: obData,
          userInput: customInput || plansInput
        })
      });
      const data = await response.json();
      if (data && data.result) {
        setPlansResult(data.result);
        
        const initialText = `Voici le résultat de notre outil d'accompagnement. Nous pouvons en discuter plus en détails et affiner cette structure ensemble !`;
        setPlansChatMessages([
          { id: "plans-assistant-init", role: "assistant", text: initialText }
        ]);
      }
    } catch (err) {
      console.error("Error generating plans & problematiques", err);
    } finally {
      setPlansLoading(false);
    }
  };

  const handlePlansChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!plansChatMessageInput.trim() || plansChatLoading) return;
    
    const userMessage = plansChatMessageInput.trim();
    setPlansChatMessageInput("");
    
    const newMsg: ChatMessage = {
      id: "plans-user-" + Date.now(),
      role: "user",
      text: userMessage
    };
    
    const updatedMessages = [...plansChatMessages, newMsg];
    setPlansChatMessages(updatedMessages);
    setPlansChatLoading(true);
    
    try {
      const historyContext = [
        { role: "system" as any, text: `CONTEXTE: L'utilisateur travaille sur sa thèse/mémoire.\nVoici le résultat initial généré pour son plan et problématique :\n${plansResult}\n\nL'utilisateur a activé l'option « en discuter plus ». Tu dois répondre en français académique extrêmement précis et constructif pour l'aider à affiner sa problématique et son plan.` },
        ...updatedMessages.map(m => ({ role: m.role, text: m.text }))
      ];
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: historyContext
        })
      });
      const data = await response.json();
      if (data && data.result) {
        setPlansChatMessages(prev => [...prev, {
          id: "plans-assistant-" + Date.now(),
          role: "assistant",
          text: data.result
        }]);
      }
    } catch (err) {
      console.error("Error in plans follow-up chat:", err);
    } finally {
      setPlansChatLoading(false);
    }
  };

  const goToNextStep = () => {
    if (obStep < 8) {
      setObStep(obStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const goToPrevStep = () => {
    if (obStep > 1) {
      setObStep(obStep - 1);
    }
  };

  const handleOnboardingLogoPaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                setObData(prev => ({ ...prev, logo: event.target!.result as string }));
              }
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    }
  };

  const isDocListeningRef = useRef(false);
  const [isDocListening, _setIsDocListening] = useState(false);
  const setIsDocListening = (val: boolean) => {
    _setIsDocListening(val);
    isDocListeningRef.current = val;
  };

  const [isDocReading, setIsDocReading] = useState(false);
  const [isDocAiVoiceActive, setIsDocAiVoiceActive] = useState(false);
  const [docAiVoiceLoading, setDocAiVoiceLoading] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Gemini-style Interactive Voice Call state variables
  const isVoiceCallActiveRef = useRef(false);
  const [isVoiceCallActive, _setIsVoiceCallActive] = useState(false);
  const setIsVoiceCallActive = (val: boolean) => {
    _setIsVoiceCallActive(val);
    isVoiceCallActiveRef.current = val;
  };

  const voiceCallStatusRef = useRef<"connecting" | "listening" | "thinking" | "speaking" | "muted">("connecting");
  const [voiceCallStatus, _setVoiceCallStatus] = useState<"connecting" | "listening" | "thinking" | "speaking" | "muted">("connecting");
  const setVoiceCallStatus = (val: "connecting" | "listening" | "thinking" | "speaking" | "muted") => {
    _setVoiceCallStatus(val);
    voiceCallStatusRef.current = val;
  };

  const [voiceCallUserTranscript, setVoiceCallUserTranscript] = useState("");
  const [voiceCallAiResponse, setVoiceCallAiResponse] = useState("");

  const voiceCallMutedRef = useRef(false);
  const [voiceCallMuted, _setVoiceCallMuted] = useState(false);
  const setVoiceCallMuted = (val: boolean) => {
    _setVoiceCallMuted(val);
    voiceCallMutedRef.current = val;
  };

  const [voiceCallSpeechMuted, setVoiceCallSpeechMuted] = useState(false);
  const [voiceCallGender, setVoiceCallGender] = useState<"female" | "male">("female");

  const voiceCallRecognitionRef = useRef<any>(null);
  const voiceCallSilenceTimeoutRef = useRef<any>(null);

  const chatRecognitionRef = useRef<any>(null);
  const docRecognitionRef = useRef<any>(null);
  const docAiRecognitionRef = useRef<any>(null);

  // References to preserve voice dictation context when recording restarts
  const chatVoiceBaseInputRef = useRef("");
  const docVoiceBaseInputRef = useRef("");

  const stopAllSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCurrentlyReadingId(null);
    setIsDocReading(false);
  };

  const speakFrenchCustom = (text: string, gender: "female" | "male", onEndCallback?: () => void) => {
    if (!window.speechSynthesis) {
      if (onEndCallback) onEndCallback();
      return;
    }
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (voiceCallSpeechMuted && isVoiceCallActive) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "fr-FR";

    const voices = window.speechSynthesis.getVoices();
    const frVoices = voices.filter(v => v.lang.startsWith("fr") || v.lang.startsWith("FR"));
    let selectedVoice = null;
    if (gender === "female") {
      selectedVoice = frVoices.find(v => v.name.toLowerCase().includes("hortense") || v.name.toLowerCase().includes("google") || v.name.toLowerCase().includes("mari") || v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("zira")) || frVoices[0];
    } else {
      selectedVoice = frVoices.find(v => v.name.toLowerCase().includes("paul") || v.name.toLowerCase().includes("claude") || v.name.toLowerCase().includes("guy") || v.name.toLowerCase().includes("male")) || frVoices[1] || frVoices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };
    utterance.onerror = () => {
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Footnote suggestion in text blocks
  const [footnoteSuggestion, setFootnoteSuggestion] = useState<{ phrase: string, pageId: string } | null>(null);

  // Check split spelling states
  const isSplitCheckerOpen = activeRightPanel === "spellcheck";
  const setIsSplitCheckerOpen = (val: boolean | ((p: boolean) => boolean)) => {
    setActiveRightPanel(prev => {
      const nextBool = typeof val === "function" ? val(prev === "spellcheck") : val;
      return nextBool ? "spellcheck" : (prev === "spellcheck" ? null : prev);
    });
  };
  const [isSpellCheckingLoading, setIsSpellCheckingLoading] = useState(false);
  const [spellCheckedPageId, setSpellCheckedPageId] = useState<string | null>(null);
  const [spellErrors, setSpellErrors] = useState<{ mistake: string, correction: string, explanation: string }[]>([]);
  const [selectedSplitMistake, setSelectedSplitMistake] = useState<string | null>(null);
  const [checkingScope, setCheckingScope] = useState<"all" | "active" | "custom">("active");
  const [selectedPageIdsForChecking, setSelectedPageIdsForChecking] = useState<string[]>([]);

  const handleSuggestFootnote = (phrase: string, pageId: string) => {
    setFootnoteSuggestion({ phrase, pageId });

    // Parse the inner text of the >...>. If it is comma separated:
    // e.g. "NEFZI (Ahmed), Manuel de Droit Public, LDGR, 2026, p. 45"
    const parts = phrase.split(",").map(part => part.trim());
    let authorLast = "";
    let authorFirst = "";
    let title = phrase;
    let publisher = "";
    let year = "";
    let page = "";

    if (parts.length >= 2) {
      const authorPart = parts[0];
      // match "NEFZI (Ahmed)" or "NEFZI"
      const authorMatch = authorPart.match(/^([^(]+)(?:\(([^)]+)\))?/);
      if (authorMatch) {
        authorLast = authorMatch[1].trim();
        authorFirst = authorMatch[2] ? authorMatch[2].trim() : "";
      } else {
        authorLast = authorPart;
      }

      title = parts[1];
      if (parts.length >= 3) publisher = parts[2];
      if (parts.length >= 4) year = parts[3];
      if (parts.length >= 5) {
        page = parts[4].replace(/^[pP]\.?\s*/, ""); // strip p. prefix or space
      }
    } else {
      // Single value fallback
      authorLast = "NEFZI";
      title = phrase;
    }

    setNewFootnote(prev => ({
      ...prev,
      authorLast: authorLast,
      authorFirst: authorFirst,
      title: title,
      publisher: publisher || "Éditions Nationales de Tunis",
      year: year || "2026",
      page: page || "1",
      sourceKind: "book"
    }));

    // Auto-complete the note de bas de page process by opening the AFNOR compilation form instantly
    setIsAfnorPopupOpen(true);
  };

  const handleDismissSuggestion = () => {
    setFootnoteSuggestion(null);
  };

  const handleAcceptFootnoteSuggestion = () => {
    if (!footnoteSuggestion) return;
    setNewFootnote(prev => ({
      ...prev,
      title: footnoteSuggestion.phrase
    }));
    setIsAfnorPopupOpen(true);
    setFootnoteSuggestion(null);
  };

  // Local common spelling mistakes checker for robust client-side fallback
  const getLocalInteractiveSpellingMistakes = (text: string) => {
    const commonFrenchMistakes = [
      { word: "fgaute", corr: "faute", desc: "L'orthographe exacte est 'faute'." },
      { word: "promematique", corr: "problématique", desc: "L'orthographe exacte est 'problématique'." },
      { word: "faulte", corr: "faute", desc: "En français moderne, 'faute' s'écrit sans 'l'." },
      { word: "acceuil", corr: "accueil", desc: "Règle du 'u' avant le 'e' après un 'c' pour obtenir le son 'keuil' : 'accueil'." },
      { word: "developpement", corr: "développement", desc: "Il faut deux accents aigu/grave : 'développement'." },
      { word: "developper", corr: "développer", desc: "Il faut deux accents : 'développer'." },
      { word: "developer", corr: "développer", desc: "S'écrit avec deux 'p' et deux accents : 'développer'." },
      { word: "problematique", corr: "problématique", desc: "Exige un accent aigu sur le 'é' : 'problématique'." },
      { word: "academique", corr: "académique", desc: "Exige un accent aigu sur le 'é' : 'académique'." },
      { word: "analise", corr: "analyse", desc: "S'écrit avec un 'y' : 'analyse'." },
      { word: "conclution", corr: "conclusion", desc: "S'écrit avec un 's' : 'conclusion'." },
      { word: "connection", corr: "connexion", desc: "En français, on écrit 'connexion' avec un 'x' (contrairement à l'anglais)." },
      { word: "language", corr: "langage", desc: "En français, 'langage' s'écrit sans 'u' (terme anglais : language)." },
      { word: "personel", corr: "personnel", desc: "S'écrit avec deux 'n' : 'personnel'." },
      { word: "professionel", corr: "professionnel", desc: "S'écrit avec deux 'n' : 'professionnel'." },
      { word: "interressant", corr: "intéressant", desc: "S'écrit avec un seul 'r' et un accent : 'intéressant'." },
      { word: "exces", corr: "excès", desc: "Exige un accent grave : 'excès'." },
      { word: "echelle", corr: "échelle", desc: "Exige un accent aigu : 'échelle'." },
      { word: "etudiant", corr: "étudiant", desc: "Exige un accent aigu : 'étudiant'." },
      { word: "etudiante", corr: "étudiante", desc: "Exige un accent aigu : 'étudiante'." },
      { word: "universitairee", corr: "universitaire", desc: "Faute de frappe, la forme correcte est 'universitaire'." },
      { word: "universite", corr: "université", desc: "Exige un accent aigu : 'université'." },
      { word: "theorie", corr: "théorie", desc: "Exige un accent aigu : 'théorie'." },
      { word: "reglement", corr: "règlement", desc: "Exige un accent grave : 'règlement'." },
      { word: "societe", corr: "société", desc: "Exige deux accents aigus : 'société'." },
      { word: "responsabilite", corr: "responsabilité", desc: "Exige un accent aigu : 'responsabilité'." },
      { word: "general", corr: "général", desc: "Exige un accent aigu : 'général'." },
      { word: "legal", corr: "légal", desc: "Exige un accent aigu : 'légal'." },
      { word: "methodologie", corr: "méthodologie", desc: "Exige deux accents aigus : 'méthodologie'." },
      { word: "competence", corr: "compétence", desc: "Exige un accent aigu : 'compétence'." },
      { word: "evenement", corr: "événement", desc: "S'écrit préférentiellement 'événement' ou 'évènement'." },
      { word: "garentie", corr: "garantie", desc: "S'écrit sans 'e' au milieu : 'garantie'." },
      { word: "travails", corr: "travaux", desc: "Le pluriel de 'travail' est 'travaux'." },
      { word: "bocoup", corr: "beaucoup", desc: "La forme correcte est 'beaucoup'." },
      { word: "apercevoir", corr: "apercevoir", desc: "Prend un seul 'p' : 'apercevoir'." },
      { word: "appercevoir", corr: "apercevoir", desc: "S'écrit avec un seul 'p' : 'apercevoir'." },
      { word: "interet", corr: "intérêt", desc: "Exige un accent circonflexe : 'intérêt'." }
    ];

    const found: any[] = [];
    commonFrenchMistakes.forEach(item => {
      const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        matches.forEach(m => {
          if (!found.some(f => f.mistake.toLowerCase() === m.toLowerCase())) {
            found.push({
              mistake: m,
              correction: item.corr,
              explanation: item.desc
            });
          }
        });
      }
    });
    return found;
  };

  const triggerCheckSplit = async (targetPageIdsInput?: string[] | any, isSilent = false) => {
    let targetIds: string[];
    let scope: "active" | "all" | "custom" = "active";

    // Detect if targetPageIdsInput is a synthetic click event (react events have preventDefault)
    const isClickEvent = targetPageIdsInput && (targetPageIdsInput.nativeEvent || targetPageIdsInput.preventDefault);

    if (Array.isArray(targetPageIdsInput) && !isClickEvent) {
      targetIds = targetPageIdsInput;
      // Determine scope
      const nonCoverPages = pages.filter(p => p.type !== "cover").map(p => p.id);
      if (targetIds.length === 1 && targetIds[0] === activePageId) {
        scope = "active";
      } else if (targetIds.length === nonCoverPages.length && nonCoverPages.every(id => targetIds.includes(id))) {
        scope = "all";
      } else {
        scope = "custom";
      }
    } else if (typeof targetPageIdsInput === 'string' && !isClickEvent) {
      targetIds = [targetPageIdsInput];
      scope = targetIds[0] === activePageId ? "active" : "custom";
    } else {
      // Default: check active page if it is not cover, otherwise fallback to check all pages
      const activePage = pages.find(p => p.id === activePageId);
      if (activePage && activePage.type !== "cover") {
        targetIds = [activePageId];
        scope = "active";
      } else {
        const nonCoverPages = pages.filter(p => p.type !== "cover").map(p => p.id);
        targetIds = nonCoverPages;
        scope = "all";
      }
    }

    const checkablePages = pages.filter(p => targetIds.includes(p.id) && p.type !== "cover");
    
    if (!isSilent) {
      setIsSplitCheckerOpen(true);
      setCheckingScope(scope);
      setSelectedPageIdsForChecking(checkablePages.map(p => p.id));
      setSelectedSplitMistake(null);
    }

    if (checkablePages.length === 0) {
      setSpellErrors([]);
      return;
    }

    if (!isSilent) {
      setIsSpellCheckingLoading(true);
      setSpellCheckedPageId(checkablePages[0]?.id || null);
    }

    // Combine the text of all selected pages to send to the server
    let combinedText = "";
    checkablePages.forEach((page) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = page.content;
      const textVal = tempDiv.innerText || tempDiv.textContent || "";
      const cleaned = textVal.replace(/\[Double-cliquez pour rédiger ici votre texte libre universitaire\.\.\.\]/gi, "").trim();
      if (cleaned) {
        const pageIdx = pages.findIndex(p => p.id === page.id) + 1;
        combinedText += `\n--- PAGE ${pageIdx} ---\n${cleaned}\n`;
      }
    });

    if (!combinedText.trim()) {
      setSpellErrors([]);
      if (!isSilent) {
        setIsSpellCheckingLoading(false);
      }
      return;
    }

    try {
      const resp = await fetch("/api/check-spelling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: combinedText })
      });
      const data = await resp.json();
      if (data.errors) {
        // De-duplicate errors
        const uniqueErrors: any[] = [];
        data.errors.forEach((err: any) => {
          if (!uniqueErrors.some(u => u.mistake.toLowerCase() === err.mistake.toLowerCase())) {
            uniqueErrors.push(err);
          }
        });
        setSpellErrors(uniqueErrors);
      } else {
        setSpellErrors([]);
      }
    } catch (err) {
      console.error("Spelling fetch error:", err);
      // Perfect dynamic client fallback
      const uniqueErrors = getLocalInteractiveSpellingMistakes(combinedText);
      setSpellErrors(uniqueErrors);
    } finally {
      if (!isSilent) {
        setIsSpellCheckingLoading(false);
      }
    }
  };

  const handleCorrectMistake = (mistake: string, correction: string) => {
    const escapedMistake = mistake.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?<!<[^>]*)(${escapedMistake})(?![^<]*>)`, 'gi');
    
    setPages(prev => prev.map(p => {
      if (selectedPageIdsForChecking.includes(p.id)) {
        const updated = p.content.replace(regex, correction);
        return {
          ...p,
          content: updated
        };
      }
      return p;
    }));
    
    setSpellErrors(prev => prev.filter(e => e.mistake.toLowerCase() !== mistake.toLowerCase()));
    setSelectedSplitMistake(null);
  };

  // Trigger real-time spell checks automatically on modification when the panel is open
  useEffect(() => {
    if (!isSplitCheckerOpen || selectedPageIdsForChecking.length === 0) return;

    const delayTimer = setTimeout(() => {
      triggerCheckSplit(selectedPageIdsForChecking, true);
    }, 1500); // 1.5 seconds debounce

    return () => clearTimeout(delayTimer);
  }, [pages, isSplitCheckerOpen]);

  const startVoiceCall = () => {
    setIsVoiceCallActive(true);
    setVoiceCallStatus("connecting");
    setVoiceCallUserTranscript("");
    setVoiceCallAiResponse("");
    stopAllSpeech();

    const welcomeText = "Bonjour ! Je suis Scrivya, votre assistant d'excellence. De quoi voulez-vous discuter de vive voix aujourd'hui ?";
    setVoiceCallAiResponse(welcomeText);
    setVoiceCallStatus("speaking");

    speakFrenchCustom(welcomeText, voiceCallGender, () => {
      startListeningVoiceCall();
    });
  };

  const endVoiceCall = () => {
    setIsVoiceCallActive(false);
    if (voiceCallRecognitionRef.current) {
      try {
        voiceCallRecognitionRef.current.onend = null;
        voiceCallRecognitionRef.current.onerror = null;
        voiceCallRecognitionRef.current.stop();
      } catch (e) {}
    }
    if (voiceCallSilenceTimeoutRef.current) {
      clearTimeout(voiceCallSilenceTimeoutRef.current);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const startListeningVoiceCall = () => {
    if (voiceCallMuted) {
      setVoiceCallStatus("muted");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("La reconnaissance vocale n'est pas supportée.");
      setVoiceCallStatus("muted");
      return;
    }

    setVoiceCallStatus("listening");
    setVoiceCallUserTranscript("");

    try {
      if (voiceCallRecognitionRef.current) {
        try { voiceCallRecognitionRef.current.stop(); } catch (e) {}
      }

      const rec = new SpeechRecognition();
      rec.lang = "fr-FR";
      rec.continuous = true;
      rec.interimResults = true;

      rec.onstart = () => {
        setVoiceError(null);
      };

      rec.onresult = (event: any) => {
        let finalTrans = "";
        let interimTrans = "";

        for (let i = 0; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTrans += transcript + " ";
          } else {
            interimTrans += transcript;
          }
        }

        const currentSpeech = (finalTrans + interimTrans).trim();
        if (currentSpeech) {
          setVoiceCallUserTranscript(currentSpeech);

          if (voiceCallSilenceTimeoutRef.current) {
            clearTimeout(voiceCallSilenceTimeoutRef.current);
          }
          voiceCallSilenceTimeoutRef.current = setTimeout(() => {
            submitVoiceCallMessage(currentSpeech);
          }, 1800);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Voice cell speech recognition error:", e);
        if (e.error === "not-allowed") {
          setVoiceError("Microphone bloqué dans le sandbox. Autorisez le micro.");
        }
      };

      rec.onend = () => {
        if (isVoiceCallActiveRef.current && !voiceCallMutedRef.current && (voiceCallStatusRef.current === "listening" || voiceCallStatusRef.current === "connecting")) {
          setTimeout(() => {
            if (isVoiceCallActiveRef.current && !voiceCallMutedRef.current && (voiceCallStatusRef.current === "listening" || voiceCallStatusRef.current === "connecting")) {
              try {
                rec.start();
              } catch (err) {
                console.warn("Failed to restart speech recognition:", err);
              }
            }
          }, 350);
        }
      };

      voiceCallRecognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error("Speech initialization error for Voice call:", err);
    }
  };

  const submitVoiceCallMessage = async (userPrompt: string) => {
    if (voiceCallSilenceTimeoutRef.current) {
      clearTimeout(voiceCallSilenceTimeoutRef.current);
    }

    if (voiceCallRecognitionRef.current) {
      try {
        voiceCallRecognitionRef.current.onend = null;
        voiceCallRecognitionRef.current.onerror = null;
        voiceCallRecognitionRef.current.stop();
      } catch (e) {}
    }

    const queryText = userPrompt.trim();
    if (!queryText) {
      startListeningVoiceCall();
      return;
    }

    setVoiceCallStatus("thinking");
    setVoiceCallAiResponse("");

    const userMsgObj: ChatMessage = {
      id: Date.now().toString() + "-user-voice",
      role: "user",
      text: queryText
    };
    setChatMessages(prev => [...prev, userMsgObj]);

    try {
      const historyToSend = chatMessages.slice(-6).map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        text: m.text
      }));
      historyToSend.push({ role: "user", text: queryText });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          history: historyToSend
        })
      });

      const data = await response.json();
      const reply = data.result || "Je n'ai pas pu formuler de réponse universitaire.";

      setChatMessages(prev => [...prev, {
        id: Date.now().toString() + "-ai-voice",
        role: "assistant",
        text: reply
      }]);

      setVoiceCallAiResponse(reply);
      setVoiceCallStatus("speaking");

      speakFrenchCustom(reply, voiceCallGender, () => {
        // Automatically resume listening hands-free
        startListeningVoiceCall();
      });

    } catch (err) {
      console.error("Voice submits API call error:", err);
      const errReply = "Anomalie technique de communication. S'il vous plaît, réessayez.";
      setVoiceCallAiResponse(errReply);
      setVoiceCallStatus("speaking");
      speakFrenchCustom(errReply, voiceCallGender, () => {
        startListeningVoiceCall();
      });
    }
  };

  const toggleVoiceCallMute = () => {
    const nextMuted = !voiceCallMuted;
    setVoiceCallMuted(nextMuted);

    if (nextMuted) {
      if (voiceCallRecognitionRef.current) {
        try { voiceCallRecognitionRef.current.stop(); } catch (e) {}
      }
      setVoiceCallStatus("muted");
    } else {
      setTimeout(() => {
        startListeningVoiceCall();
      }, 100);
    }
  };

  const speakFrench = (text: string, onEndCallback?: () => void) => {
    if (!window.speechSynthesis) {
      console.warn("SpeechSynthesis non disponible");
      return;
    }
    window.speechSynthesis.cancel();

    // Clean HTML tags and formatting
    const cleanText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\[\d+\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "fr-FR";

    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith("fr") || v.lang.startsWith("FR"));
    if (frVoice) {
      utterance.voice = frVoice;
    }

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };
    utterance.onerror = () => {
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  };

  const readActivePageText = () => {
    const activePage = pages.find(p => p.id === activePageId);
    if (!activePage) return;

    if (isDocReading) {
      stopAllSpeech();
      return;
    }

    setIsDocReading(true);
    speakFrench(activePage.content, () => {
      setIsDocReading(false);
    });
  };

  const readChatMessage = (msgId: string, text: string) => {
    if (currentlyReadingId === msgId) {
      stopAllSpeech();
      return;
    }

    setCurrentlyReadingId(msgId);
    speakFrench(text, () => {
      setCurrentlyReadingId(null);
    });
  };

  const toggleChatListening = () => {
    if (isChatListening) {
      if (chatRecognitionRef.current) {
        try {
          chatRecognitionRef.current.onend = null;
          chatRecognitionRef.current.onerror = null;
          chatRecognitionRef.current.stop();
        } catch (e) {}
      }
      setIsChatListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("La reconnaissance vocale n'est pas supportée.");
      return;
    }

    // Capture dynamic snapshot of current input before speaking
    chatVoiceBaseInputRef.current = chatMessageInputRef.current;

    try {
      const rec = new SpeechRecognition();
      rec.lang = "fr-FR";
      rec.continuous = true;
      rec.interimResults = true;

      rec.onstart = () => {
        setIsChatListening(true);
        setVoiceError(null);
      };

      rec.onresult = (event: any) => {
        let finalTrans = "";
        let interimTrans = "";
        for (let i = 0; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTrans += transcript + " ";
          } else {
            interimTrans += transcript;
          }
        }
        const sessionTrans = (finalTrans + interimTrans).trim();
        if (sessionTrans) {
          const base = chatVoiceBaseInputRef.current;
          setChatMessageInput(base ? base + " " + sessionTrans : sessionTrans);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Chat Voice recognition error:", e);
        if (e.error === "not-allowed") {
          setVoiceError("Microphone bloqué dans le sandbox.");
          setIsChatListening(false);
        }
      };

      rec.onend = () => {
        if (isChatListeningRef.current) {
          // Sync base text on restart
          chatVoiceBaseInputRef.current = chatMessageInputRef.current;
          setTimeout(() => {
            if (isChatListeningRef.current) {
              try {
                rec.start();
              } catch (err) {
                console.warn("Failed to restart chat dictation:", err);
              }
            }
          }, 350);
        } else {
          setIsChatListening(false);
        }
      };

      chatRecognitionRef.current = rec;
      rec.start();
    } catch (err: any) {
      console.error("Chat Speech error init", err);
      setIsChatListening(false);
    }
  };

  const toggleDocListening = () => {
    if (isDocListening) {
      if (docRecognitionRef.current) {
        try {
          docRecognitionRef.current.onend = null;
          docRecognitionRef.current.onerror = null;
          docRecognitionRef.current.stop();
        } catch (e) {}
      }
      setIsDocListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Le navigateur ne supporte pas la reconnaissance.");
      return;
    }

    const getActivePageContent = () => {
      const activePage = pagesRef.current.find(p => p.id === activePageId);
      let content = activePage ? activePage.content : "";
      if (content.includes("[Double-cliquez pour rédiger ici votre texte libre universitaire...]")) {
        content = "";
      }
      return content;
    };

    // Capture dynamic snapshot of current document page content before speaking
    docVoiceBaseInputRef.current = getActivePageContent();

    try {
      const rec = new SpeechRecognition();
      rec.lang = "fr-FR";
      rec.continuous = true;
      rec.interimResults = true;

      rec.onstart = () => {
        setIsDocListening(true);
        setVoiceError(null);
      };

      rec.onresult = (event: any) => {
         let finalTrans = "";
         let interimTrans = "";
         for (let i = 0; i < event.results.length; ++i) {
           const transcript = event.results[i][0].transcript;
           if (event.results[i].isFinal) {
             finalTrans += transcript + " ";
           } else {
             interimTrans += transcript;
           }
         }

         const sessionTrans = (finalTrans + interimTrans).trim();

         if (sessionTrans) {
           setPages(prev => prev.map(p => {
             if (p.id === activePageId) {
               const base = docVoiceBaseInputRef.current;
               if (!base.trim()) {
                 return {
                   ...p,
                   content: `<p class="text-justify font-serif text-sm leading-relaxed text-slate-800">${sessionTrans}</p>`
                 };
               } else {
                 if (base.endsWith("</p>")) {
                   return {
                     ...p,
                     content: base.slice(0, -4) + " " + sessionTrans + "</p>"
                   };
                 } else {
                   return {
                     ...p,
                     content: base + " " + sessionTrans
                   };
                 }
               }
             }
             return p;
           }));
         }
      };

      rec.onerror = (e: any) => {
        console.error("Doc Speech typing error:", e);
        if (e.error === "not-allowed") {
          setVoiceError("Microphone bloqué dans le sandbox.");
          setIsDocListening(false);
        }
      };

      rec.onend = () => {
        if (isDocListeningRef.current) {
          // Sync base text on restart
          docVoiceBaseInputRef.current = getActivePageContent();
          setTimeout(() => {
            if (isDocListeningRef.current) {
              try {
                rec.start();
              } catch (err) {
                console.warn("Failed to restart doc speech recognition:", err);
              }
            }
          }, 350);
        } else {
          setIsDocListening(false);
        }
      };

      docRecognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error("Doc dictation error init:", err);
      setIsDocListening(false);
    }
  };

  const toggleDocAiVoiceAssistant = () => {
    if (isDocAiVoiceActive) {
      if (docAiRecognitionRef.current) {
        docAiRecognitionRef.current.stop();
      }
      setIsDocAiVoiceActive(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Assistant vocal non disponible sur ce navigateur.");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = "fr-FR";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsDocAiVoiceActive(true);
        setVoiceError(null);
      };

      rec.onresult = async (event: any) => {
        const spokenCommand = event.results[0][0].transcript;
        if (!spokenCommand) return;

        setDocAiVoiceLoading(true);
        setIsDocAiVoiceActive(false);

        const currentActivePage = pages.find(p => p.id === activePageId);
        const pageText = currentActivePage ? currentActivePage.content : "";

        try {
          const response = await fetch("/api/voice-document", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              command: spokenCommand,
              currentPageText: pageText
            })
          });

          const data = await response.json();
          if (data.generatedText) {
            setPages(prev => prev.map(p => {
              if (p.id === activePageId) {
                let current = p.content;
                if (current.includes("[Double-cliquez pour rédiger ici votre texte libre universitaire...]")) {
                  current = "";
                }
                return {
                  ...p,
                  content: current + "\n" + data.generatedText
                };
              }
              return p;
            }));

            if (data.audioNarrative) {
              speakFrench(data.audioNarrative);
            }
          }
        } catch (err) {
          console.error("Failed to query voice-document api", err);
        } finally {
          setDocAiVoiceLoading(false);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Voice Doc Assistant command listening error:", e);
        setIsDocAiVoiceActive(false);
      };

      rec.onend = () => {
        setIsDocAiVoiceActive(false);
      };

      docAiRecognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error("Interactive Doc Voice Assistant init error:", e);
      setIsDocAiVoiceActive(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleFormat = (command: string, value: string = "") => {
    restoreRangeSelection();
    document.execCommand(command, false, value);
    
    const sel = window.getSelection();
    let targetPageId = activePageId;
    if (sel && sel.rangeCount > 0) {
      let parent: HTMLElement | null = sel.anchorNode?.parentElement || null;
      while (parent) {
        if (parent.getAttribute?.("contenteditable") === "true") {
          const pageIdAttr = parent.getAttribute("data-page-id");
          if (pageIdAttr) {
            targetPageId = pageIdAttr;
          }
          break;
        }
        parent = parent.parentElement;
      }
    }
    
    const activePage = document.querySelector(`[contenteditable="true"][data-page-id="${targetPageId}"]`);
    if (activePage) {
      handlePageBlur(targetPageId, activePage.innerHTML);
    }
  };

  const handleColorChange = (color: string) => {
    restoreRangeSelection();
    setTextColor(color);
    document.execCommand("foreColor", false, color);
    setIsColorPickerOpen(false);
    
    const sel = window.getSelection();
    let targetPageId = activePageId;
    if (sel && sel.rangeCount > 0) {
      let parent: HTMLElement | null = sel.anchorNode?.parentElement || null;
      while (parent) {
        if (parent.getAttribute?.("contenteditable") === "true") {
          const pageIdAttr = parent.getAttribute("data-page-id");
          if (pageIdAttr) {
            targetPageId = pageIdAttr;
          }
          break;
        }
        parent = parent.parentElement;
      }
    }
    
    const activePage = document.querySelector(`[contenteditable="true"][data-page-id="${targetPageId}"]`);
    if (activePage) {
      handlePageBlur(targetPageId, activePage.innerHTML);
    }
  };

  // Convert digital count to Roman index representations
  const romanIndexToText = (idx: number): string => {
    const romans = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv"];
    return romans[idx] || (idx + 1).toString();
  };

  // Calculate dynamic paginated results on flight
  const getComputedPages = () => {
    let romanCount = 0;
    let arabicCount = 0;
    let hasStartedArabic = false;

    return pages.map((page) => {
      if (page.type === "cover") {
        return { ...page, pageNum: "" };
      }
      
      // Start arabic numeral numbering when hitting any main segment (introduction or chapters)
      const isIntroOrChapters = 
        page.type === "introduction" || 
        page.type === "part1" || 
        page.type === "part2" || 
        page.type === "conclusion" || 
        page.type === "bibliographie" || 
        page.type === "kteb";

      if (!hasStartedArabic && isIntroOrChapters) {
        hasStartedArabic = true;
      }

      if (hasStartedArabic) {
        arabicCount++;
        return { ...page, pageNum: arabicCount.toString() };
      } else {
        romanCount++;
        return { ...page, pageNum: romanIndexToText(romanCount - 1) };
      }
    });
  };

  // Intermediate page insertions
  const handleInsertPage = (index: number) => {
    const newId = `custom_page_${Date.now()}`;
    const newPage: PageData = {
      id: newId,
      type: "custom_blank",
      title: "Page Blanche Supplémentaire",
      isCustom: true,
      content: `<div class="w-full text-justify font-serif text-sm leading-relaxed text-slate-800 focus:outline-none min-h-[400px]">
        <p class="text-slate-400 italic text-center py-12 select-none font-sans">[Double-cliquez pour rédiger ici votre texte libre universitaire...]</p>
      </div>`
    };

    const copy = [...pages];
    copy.splice(index, 0, newPage);
    setPages(copy);
  };

  // Page deletion
  const handleDeletePage = (pageId: string) => {
    if (window.confirm("Voulez-vous supprimer cette page ? Tout contenu ou modification sera détruit définitivement.")) {
      setPages(prev => prev.filter(p => p.id !== pageId));
    }
  };

  // Sync edits on blur without caret re-renders
  const handlePageBlur = (pageId: string, newHtml: string) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, content: newHtml } : p));
  };

  const restoreRangeSelection = () => {
    if (savedRange.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRange.current.cloneRange());
      }
    }
  };

  const applyTextFormat = (command: string, value: string = "") => {
    restoreRangeSelection();
    document.execCommand(command, false, value);
    
    const sel = window.getSelection();
    let targetPageId = activePageId;
    if (sel && sel.rangeCount > 0) {
      let parent: HTMLElement | null = sel.anchorNode?.parentElement || null;
      while (parent) {
        if (parent.getAttribute?.("contenteditable") === "true") {
          const pageIdAttr = parent.getAttribute("data-page-id");
          if (pageIdAttr) {
            targetPageId = pageIdAttr;
          }
          break;
        }
        parent = parent.parentElement;
      }
    }

    const activePage = document.querySelector(`[contenteditable="true"][data-page-id="${targetPageId}"]`);
    if (activePage) {
      handlePageBlur(targetPageId, activePage.innerHTML);
    }
  };

  const applySelectionStyle = (property: "fontSize" | "color" | "backgroundColor" | "fontFamily", value: string) => {
    restoreRangeSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.toString().trim()) return;
    const range = sel.getRangeAt(0);

    const span = document.createElement("span");
    if (property === "fontSize") {
      span.style.fontSize = value;
    } else if (property === "color") {
      span.style.color = value;
    } else if (property === "backgroundColor") {
      span.style.backgroundColor = value;
    } else if (property === "fontFamily") {
      span.style.fontFamily = value;
    }

    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedRange.current = newRange.cloneRange();

      let targetPageId = activePageId;
      let parent: HTMLElement | null = span.parentElement;
      while (parent) {
        if (parent.getAttribute?.("contenteditable") === "true") {
          const pageIdAttr = parent.getAttribute("data-page-id");
          if (pageIdAttr) {
            targetPageId = pageIdAttr;
          }
          break;
        }
        parent = parent.parentElement;
      }

      const activePage = document.querySelector(`[contenteditable="true"][data-page-id="${targetPageId}"]`);
      if (activePage) {
        handlePageBlur(targetPageId, activePage.innerHTML);
      }
    } catch (e) {
      console.error("Format error", e);
    }
  };

  // Deduplicate sources by author & title safely
  const getUniqueSources = (fns: Footnote[]) => {
    const seen = new Set<string>();
    const unique: Footnote[] = [];
    fns.forEach(fn => {
      const authorSafe = (fn.author || "").toLowerCase().trim();
      const titleSafe = (fn.title || "").toLowerCase().trim();
      const key = (authorSafe || titleSafe) 
        ? `${authorSafe}--${titleSafe}` 
        : `custom-${fn.id}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(fn);
      }
    });
    return unique;
  };

  const confirmSourceKind = (kind: "book" | "article" | "thesis" | "law" | "web") => {
    if (!justCompiledFootnote) return;

    const { author, title, publisher, year, page, pageId } = justCompiledFootnote;
    let formattedText = "";
    const pageStr = page ? `p. ${page}` : "p. 1";

    if (kind === "article") {
      formattedText = `${author}, « *${title}* », in *Revue Tunisienne de Droit*, Tunis, ${publisher ? publisher + ", " : ""}${year || "2026"}, ${pageStr}.`;
    } else if (kind === "thesis") {
      formattedText = `${author}, *${title}*, Mémoire de Mastère de Recherche en Droit, ${publisher || "FSJPST"}, ${cover.universite ? cover.universite.replace("Université de", "").trim() : "Tunis"}, ${year || "2026"}, ${pageStr}.`;
    } else if (kind === "law") {
      formattedText = `${author || "TUNISIE"}, *${title}*, Journal Officiel de la République Tunisienne, ${year || "2026"}, ${pageStr}.`;
    } else if (kind === "web") {
      formattedText = `${author}, « *${title}* », disponible sur : <${publisher || "https://scrivya.tn"}>, consulté en ${year || "2026"}, ${pageStr}.`;
    } else {
      // book
      formattedText = `${author}, « *${title}* », Tunis, ${publisher || "Éditions Nationales de Tunis"}, ${year || "2026"}, ${pageStr}.`;
    }

    const compiledFn: Footnote = {
      ...justCompiledFootnote,
      sourceKind: kind,
      formattedText
    };

    setFootnotes(prev => [...prev, compiledFn]);

    // Try to insert inline using selection / saved range first!
    const targetId = pageId || activePageId;
    let insertedInline = false;
    const sel = window.getSelection();
    let range: Range | null = null;

    if (sel && sel.rangeCount > 0) {
      const activeRange = sel.getRangeAt(0);
      let p: HTMLElement | null = activeRange.startContainer.parentElement;
      let selectionInsidePage = false;
      while (p) {
        if (p.getAttribute?.("contenteditable") === "true") {
          selectionInsidePage = true;
          break;
        }
        p = p.parentElement;
      }
      if (selectionInsidePage) {
        range = activeRange;
      }
    }

    if (!range) {
      range = savedRange.current;
    }

    if (range) {
      let parent: HTMLElement | null = range.startContainer.parentElement;
      let isWithinPage = false;
      let foundPageId = targetId;
      while (parent) {
        if (parent.getAttribute?.("contenteditable") === "true") {
          isWithinPage = true;
          const pid = parent.getAttribute("data-page-id");
          if (pid) foundPageId = pid;
          break;
        }
        parent = parent.parentElement;
      }

      if (isWithinPage) {
        try {
          // Clean up trailing spaces in the text node right before the insertion point to prevent wrapping
          if (range.startContainer.nodeType === Node.TEXT_NODE) {
            const textVal = range.startContainer.nodeValue || "";
            const currentOffset = range.startOffset;
            let spaces = 0;
            while (currentOffset - spaces - 1 >= 0 && textVal[currentOffset - spaces - 1] === " ") {
              spaces++;
            }
            if (spaces > 0) {
              const cleanedText = textVal.substring(0, currentOffset - spaces) + textVal.substring(currentOffset);
              range.startContainer.nodeValue = cleanedText;
              range.setStart(range.startContainer, currentOffset - spaces);
              range.setEnd(range.startContainer, currentOffset - spaces);
            }
          }

          const anchorSpan = document.createElement("span");
          anchorSpan.className = "footnote-link footnote-anchor cursor-pointer font-serif font-semibold select-none text-[10px] align-super text-slate-900 hover:text-blue-600 transition-colors ml-0.5 mr-1 inline";
          anchorSpan.setAttribute("data-footnote-id", compiledFn.id.toString());
          anchorSpan.setAttribute("data-id", compiledFn.id.toString());
          anchorSpan.setAttribute("contenteditable", "false");
          anchorSpan.setAttribute("title", `Note de bas de page ${compiledFn.id}`);
          anchorSpan.innerText = compiledFn.id.toString();

          range.deleteContents();
          range.insertNode(anchorSpan);

          // Check if there is already a space right after the insertion point
          let alreadyHasSpace = false;
          if (range.startContainer.nodeType === Node.TEXT_NODE) {
            const textVal = range.startContainer.nodeValue || "";
            const currentOffset = range.startOffset;
            if (currentOffset < textVal.length && (textVal[currentOffset] === " " || textVal[currentOffset] === "\u00A0")) {
              alreadyHasSpace = true;
            }
          }
          if (!alreadyHasSpace) {
            let nextNode = range.startContainer.nextSibling;
            if (!nextNode && range.startContainer.parentNode) {
              nextNode = range.startContainer.parentNode.nextSibling;
            }
            if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
              const nextText = nextNode.nodeValue || "";
              if (nextText.startsWith(" ") || nextText.startsWith("\u00A0")) {
                alreadyHasSpace = true;
              }
            }
          }

          let spaceNode: Node;
          if (!alreadyHasSpace) {
            spaceNode = document.createTextNode(" ");
            anchorSpan.after(spaceNode);
          } else {
            spaceNode = anchorSpan;
          }
          
          // Move cursor after the space or footnote anchor
          const newRange = document.createRange();
          if (!alreadyHasSpace) {
            newRange.setStartAfter(spaceNode);
          } else {
            newRange.setStartAfter(anchorSpan);
          }
          newRange.collapse(true);
          if (sel) {
            sel.removeAllRanges();
            sel.addRange(newRange);
          }

          const pageEl = document.querySelector(`[contenteditable="true"][data-page-id="${foundPageId}"]`);
          if (pageEl) {
            handlePageBlur(foundPageId, pageEl.innerHTML);
            insertedInline = true;
          }
        } catch (e) {
          console.error("Failed to insert AFNOR marker inline", e);
        }
      }
    }

    if (!insertedInline) {
      // Fallback: Append marker inside the page content
      setPages(prev => prev.map(p => {
        if (p.id === targetId) {
          const marker = `<sup><span class="footnote-link footnote-anchor cursor-pointer font-serif font-semibold select-none text-[10px] align-super text-slate-900 hover:text-blue-600 transition-colors ml-0.5 mr-1 inline" data-footnote-id="${compiledFn.id}" data-id="${compiledFn.id}" title="Note de bas de page ${compiledFn.id}">${compiledFn.id}</span></sup>&nbsp;`;
          let cleanContent = p.content.trim();
          if (cleanContent.includes("[Double-cliquez pour rédiger ici votre texte libre universitaire...]")) {
            cleanContent = `<p class="text-justify font-serif text-sm leading-relaxed text-slate-800"></p>`;
          }
          
          let updatedContent = cleanContent;
          if (updatedContent.endsWith("</p></div>")) {
            updatedContent = updatedContent.slice(0, -10) + marker + "</p></div>";
          } else if (updatedContent.endsWith("</div>")) {
            const lastPIndex = updatedContent.lastIndexOf("</p>");
            if (lastPIndex !== -1 && lastPIndex > updatedContent.length - 40) {
              updatedContent = updatedContent.slice(0, lastPIndex) + marker + updatedContent.slice(lastPIndex);
            } else {
              updatedContent = updatedContent.slice(0, -6) + marker + "</div>";
            }
          } else if (updatedContent.endsWith("</p>")) {
            updatedContent = updatedContent.slice(0, -4) + marker + "</p>";
          } else {
            updatedContent = updatedContent + marker;
          }
          
          return {
            ...p,
            content: updatedContent
          };
        }
        return p;
      }));
    }

    setJustCompiledFootnote(null);
    setTimeout(() => {
      runSequenceRenumbering();
    }, 50);
  };

  const formatPublisherInput = (inputVal: string, prevVal: string): string => {
    let formatted = "";
    if (inputVal.length < prevVal.length) {
      // User deleted something
      const rawPrev = prevVal.replace(/\./g, "");
      const rawInput = inputVal.replace(/\./g, "");
      if (rawInput.length < rawPrev.length) {
        // They deleted a real character
        formatted = rawInput.toUpperCase().split("").join(".") + (rawInput.length > 0 ? "." : "");
      } else {
        // They deleted a dot. Let's delete the character preceding that dot
        const slicedRaw = rawInput.slice(0, -1);
        formatted = slicedRaw.toUpperCase().split("").join(".") + (slicedRaw.length > 0 ? "." : "");
      }
    } else {
      // User typed or pasted something
      const rawInput = inputVal.replace(/\./g, "");
      formatted = rawInput.toUpperCase().split("").join(".") + (rawInput.length > 0 ? "." : "");
    }
    return formatted;
  };

  // Footnote compilation and registration
  const handleAddFootnote = (e: React.FormEvent) => {
    e.preventDefault();
    const { authorLast, authorFirst, title, publisher, year, page, sourceKind, abstract } = newFootnote;
    if (!authorLast || !title) return;

    const authorFirstInitial = authorFirst ? authorFirst.trim().charAt(0).toUpperCase() + "." : "";
    const formattedAuthor = `${authorLast.toUpperCase().trim()}${authorFirstInitial ? ` (${authorFirstInitial})` : ""}`;

    const nextId = footnotes.length + 1;
    const tempFn: Footnote = {
      id: nextId,
      author: formattedAuthor,
      title: title.trim(),
      publisher: publisher ? publisher.trim() : "Non spécifié",
      year: year ? year.trim() : "2026",
      page: page ? page.trim() : "1",
      formattedText: "", // Compiled on confirmation
      sourceKind: sourceKind,
      pageId: activePageId,
      abstract: abstract ? abstract.trim() : ""
    };

    setJustCompiledFootnote(tempFn);
    setIsAfnorPopupOpen(false);

    setNewFootnote({
      authorLast: "",
      authorFirst: "",
      title: "",
      publisher: "",
      year: "",
      page: "",
      sourceKind: "book",
      abstract: ""
    });
  };

  // Backend query proxy for reformulation
  const handleReformulate = async () => {
    if (!reformulationInput.trim()) return;

    setReformulationLoading(true);
    setReformulationResult("");
    setReformulationAdjustments([]);

    try {
      const response = await fetch("/api/reformulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selected_text: reformulationInput,
          active_tool_left_side: reformulationTone
        })
      });

      const data = await response.json();
      if (data.processed_text || data.result) {
        setReformulationResult(data.processed_text || data.result);
        setReformulationAdjustments(data.applied_adjustments || []);
      } else {
        setReformulationResult("Impossible d'accéder au re-formulateur. Merci de rectifier.");
      }
    } catch (err) {
      console.error(err);
      setReformulationResult("Erreur de communication de réseau.");
    } finally {
      setReformulationLoading(false);
    }
  };

  // Append reformulation to page structure
  const insertReformulationInActive = (pageId: string) => {
    if (!reformulationResult) return;
    setPages(prev => prev.map(p => {
      if (p.id === pageId) {
        return {
          ...p,
          content: p.content + `<p class="mt-4 font-serif text-sm text-justify text-slate-800 animate-fadeIn">${reformulationResult}</p>`
        };
      }
      return p;
    }));
  };

  const insertPhdCitationText = (text: string) => {
    setPages(prev => prev.map(p => {
      if (p.id === activePageId) {
        return {
          ...p,
          content: p.content + text
        };
      }
      return p;
    }));
  };

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) {
          const target = e.target as HTMLElement;
          if (!target.closest?.(".floating-selection-menu")) {
            setChatSelection(null);
            setPageSelection(null);
            setIsFormulationSubmenuOpen(false);
            
            if (sel && sel.rangeCount > 0) {
              const range = sel.getRangeAt(0);
              let parent: HTMLElement | null = sel.anchorNode?.parentElement || null;
              let isInPage = false;
              while (parent) {
                if (parent.getAttribute?.("contenteditable") === "true") {
                  isInPage = true;
                  break;
                }
                parent = parent.parentElement;
              }
              if (isInPage) {
                savedRange.current = range.cloneRange();
              }
            }
          }
          return;
        }

        const text = sel.toString().trim();
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        let parent: HTMLElement | null = sel.anchorNode?.parentElement || null;
        let isInChat = false;
        let isInPage = false;

        while (parent) {
          if (parent.id === "chat_messages_viewport" || parent.closest?.("#chat_panel")) {
            isInChat = true;
            break;
          }
          if (parent.getAttribute?.("contenteditable") === "true") {
            isInPage = true;
            break;
          }
          parent = parent.parentElement;
        }

        if (isInChat) {
          setChatSelection({ text, rect });
          setPageSelection(null);
          setIsFormulationSubmenuOpen(false);
        } else if (isInPage) {
          savedRange.current = range.cloneRange();
          setPageSelection({ text, rect });
          setChatSelection(null);
        } else {
          const target = e.target as HTMLElement;
          if (!target.closest?.(".floating-selection-menu")) {
            setChatSelection(null);
            setPageSelection(null);
            setIsFormulationSubmenuOpen(false);
          }
        }
      }, 50);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleAddChatTextToDocument = () => {
    if (!chatSelection) return;
    const selectedText = chatSelection.text;

    setPages(prev => prev.map(p => {
      if (p.id === activePageId) {
        const newParagraph = `<p class="mt-4 text-justify font-serif text-sm leading-relaxed text-slate-800">${selectedText}</p>`;
        return { ...p, content: p.content + newParagraph };
      }
      return p;
    }));

    window.getSelection()?.removeAllRanges();
    setChatSelection(null);
  };

  const handleReformulateText = async (tone: "humanize" | "afnor") => {
    if (!pageSelection) return;
    const originalText = pageSelection.text;
    setIsReformulating(true);

    try {
      const res = await fetch("/api/reformulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText, tone })
      });
      const data = await res.json();
      if (data.result) {
        const newText = data.result;
        setPages(prev => prev.map(p => {
          if (p.id === activePageId) {
            if (p.content.includes(originalText)) {
              return { ...p, content: p.content.replace(originalText, newText) };
            } else {
              // fallback replace first occurance or replace with decoded text
              const decoded = originalText.replace(/&nbsp;/g, " ");
              if (p.content.includes(decoded)) {
                return { ...p, content: p.content.replace(decoded, newText) };
              }
              const strippedContent = p.content.replace(originalText, newText);
              return { ...p, content: strippedContent };
            }
          }
          return p;
        }));

        window.getSelection()?.removeAllRanges();
        setPageSelection(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReformulating(false);
    }
  };

  const handleVerifyWithScrivya = () => {
    if (!pageSelection) return;
    const selectedText = pageSelection.text;
    setIsChatOpen(true);
    const messageText = `Analyser la rigueur et l'expression de ce passage : "${selectedText}"`;
    handleSendMessage(messageText);

    window.getSelection()?.removeAllRanges();
    setPageSelection(null);
  };

  // Web query message dispatcher
  const handleSendMessage = async (textToSend: string) => {
    const userMessage = textToSend.trim();
    if (!userMessage) return;

    const userMsgObj: ChatMessage = {
      id: Date.now().toString() + "-user",
      role: "user",
      text: userMessage
    };

    setChatMessages(prev => [...prev, userMsgObj]);
    setChatMessageInput("");
    setChatLoading(true);

    try {
      const historyToSend = chatMessages.slice(-6).map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        text: m.text
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: historyToSend
        })
      });

      const data = await response.json();
      if (data.result) {
        setChatMessages(prev => [...prev, {
          id: Date.now().toString() + "-ai",
          role: "assistant",
          text: data.result
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          id: Date.now().toString() + "-ai",
          role: "assistant",
          text: "Je n'ai pas pu compiler une consigne de recherche. Merci de réitérer."
        }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        id: Date.now().toString() + "-ai",
        role: "assistant",
        text: "La communication avec Scrivya a rencontré une anomalie technique temporaire."
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleResetDocument = () => {
    if (window.confirm("Voulez-vous restaurer les 17 pages par défaut conformes à la norme ?")) {
      setPages(initialPages);
      setCover({
        republique: "République Tunisienne",
        ministere: "Ministère de l’Enseignement Supérieur et de la Recherche Scientifique",
        universite: currentUser.university || "Votre Université",
        faculte: "Faculté des Sciences Juridiques, Politiques et Sociales de Tunis",
        mastere: "MÉMOIRE EN VUE DE L’OBTENTION D’UN MASTÈRE DE",
        mastereRed: "RECHERCHE EN DROIT PUBLIC INTERNE",
        nomMemoire: "Nom du mémoire",
        soutenuPar: "Esm telmidh",
        sousDirection: "nom de l'encadrant(e)",
        president: "XX",
        rapporteur: "XX",
        directeur: "XX",
        annee: "XX – X"
      });
    }
  };

  const triggerDownloadDoc = () => {
    // Collect uncompleted fields in red
    const fieldsToCheck = [
      { id: "input_nomMemoire", val: cover.nomMemoire, placeholder: "Nom du mémoire", name: "Le titre du mémoire (Nom du mémoire)" },
      { id: "input_soutenuPar", val: cover.soutenuPar, placeholder: "Esm telmidh", name: "Le nom de l'étudiant (Esm telmidh)" },
      { id: "input_sousDirection", val: cover.sousDirection, placeholder: "nom de l'encadrant(e)", name: "Le nom de l'encadrant(e) d'encadrement" }
    ];

    const missing = fieldsToCheck.filter(f => 
      !f.val || 
      f.val.trim() === "" || 
      f.val.trim().toLowerCase() === f.placeholder.toLowerCase() ||
      f.placeholder.toLowerCase().includes(f.val.trim().toLowerCase())
    ).map(f => ({
      id: f.id,
      field: f.id.replace("input_", ""),
      name: f.name
    }));

    if (missing.length > 0) {
      setDownloadWarning({
        isOpen: true,
        missingFields: missing
      });
    } else {
      handleDownloadDoc();
    }
  };

  const handleGoToMissingField = (fieldId: string) => {
    setDownloadWarning({ isOpen: false, missingFields: [] });
    // Navigate to page 1 (cover)
    setActivePageId("cover_page");
    setTimeout(() => {
      const pageEl = document.getElementById("page_bed_cover_page");
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setTimeout(() => {
        const inputEl = document.getElementById(fieldId);
        if (inputEl) {
          inputEl.focus();
          inputEl.classList.add("ring-4", "ring-rose-500", "scale-[1.03]");
          setTimeout(() => {
            inputEl?.classList.remove("ring-4", "ring-rose-500", "scale-[1.03]");
          }, 3000);
        }
      }, 300);
    }, 150);
  };

  const handleDownloadDoc = () => {
    let docOut = `EXCELLENCE ACADÉMIQUE • DOCUMENT CONFORME\n\n`;
    docOut += `Fichier : ${docTitle}\n`;
    docOut += `Auteur de Session : ${currentUser.name}\n`;
    docOut += `Date de sortie : ${new Date().toLocaleDateString("fr-FR")}\n`;
    docOut += `========================================================================\n\n`;

    getComputedPages().forEach((page, index) => {
      docOut += `\n--- PAGE N° ${index + 1} [Indice : ${page.pageNum || "Couverture"}] : ${page.title} ---\n\n`;
      if (page.type === "cover") {
        docOut += `RÉPUBLIQUE TUNISIENNE\n`;
        docOut += `${cover.ministere}\n`;
        docOut += `Etablissement : ${cover.univ_fac || (cover.universite + " / " + cover.faculte)}\n`;
        docOut += `Dossier : ${cover.mastere} ${cover.mastereRed}\n`;
        docOut += `Thème : ${cover.nomMemoire}\n`;
        docOut += `Rédacteur : ${cover.soutenuPar} | Encadrement : ${cover.sousDirection}\n`;
        docOut += `Jury : Président: ${cover.president}, Rapporteur: ${cover.rapporteur}, Directeur: ${cover.directeur}\n`;
        docOut += `Année Universitaire : ${cover.annee}\n`;
      } else {
        const temp = document.createElement("div");
        temp.innerHTML = page.content;
        docOut += temp.innerText || temp.textContent || "";
      }
      docOut += `\n`;
    });

    docOut += `\n========================================================================\n`;
    docOut += `BIBLIOGRAPHIE ACADÉMIQUE DE RÉFÉRENCE (Normes AFNOR NF Z 44-005) (DÉDOUBLÉE) :\n`;
    getUniqueSources(footnotes).sort((a,b) => (a.author || "").localeCompare(b.author || "")).forEach((fn, idx) => {
      const cleanText = fn.formattedText.replace(/\*(.*?)\*/g, "$1");
      docOut += `${idx + 1}. [${fn.sourceKind ? fn.sourceKind.toUpperCase() : "LIVRE"}] ${cleanText}\n`;
    });

    const blob = new Blob([docOut], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = docTitle.endsWith(".txt") ? docTitle : `${docTitle.split(".")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const colorPresets = [
    { value: "#1e293b", name: "Charcoal" },
    { value: "#2563eb", name: "Royal Blue" },
    { value: "#059669", name: "Emerald Emerald" },
    { value: "#dc2626", name: "Terracotta" },
    { value: "#ca8a04", name: "Tuscan Gold" },
    { value: "#7c3aed", name: "Royal Purple" },
    { value: "#3b82f6", name: "Light Blue" },
    { value: "#000000", name: "Black" }
  ];

  const computedPagesList = getComputedPages();

  if (onboardingOpen) {
    return (
      <div className={`fixed inset-0 z-[99999] flex flex-col justify-between overflow-y-auto ${isLight ? 'bg-slate-50 text-slate-800' : 'bg-slate-950 text-slate-100'}`} style={{ direction: 'ltr' }}>
        {/* Top Progress bar and branding */}
        <div className={`p-6 border-b shrink-0 flex items-center justify-between ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/5'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg select-none shadow-md shadow-blue-500/20">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-display font-black tracking-wide text-lg uppercase ${isLight ? 'text-blue-600' : 'text-white'}`}>
                  Scrivya
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md uppercase">
                  Onboarding
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={handleSkipAllOnboarding}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold font-sans rounded-lg transition-all text-[11px] shadow mr-2 cursor-pointer active:scale-95"
            >
              Skip All (Passer Tout)
            </button>
            <span className="text-slate-400">Étape {obStep} sur 8</span>
            <div className="w-32 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(obStep / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Wizard Question Body */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className={`w-full max-w-2xl p-8 rounded-3xl border shadow-2xl transition-all duration-300 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/5'
          }`}>
            
            <form onSubmit={(e) => { e.preventDefault(); goToNextStep(); }} className="space-y-6">
              
              {/* Step 1: Nom et Prénom */}
              {obStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className={`block text-2xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Veuillez indiquer votre nom et prénom.
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      (commencez par le nom de famille) exemple : Jackson Michael
                    </p>
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={obData.name}
                    onChange={(e) => setObData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nom Prénom"
                    className={`w-full p-4 border text-sm outline-none rounded-2xl focus:border-blue-500 font-medium ${
                      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-100 placeholder-slate-500'
                    }`}
                  />
                </div>
              )}

              {/* Step 2: Université */}
              {obStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className={`block text-2xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Veuillez écrire le nom complet de votre université.
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Exemple : faculté des sciences juridiques, politiques et sociales de tunis.
                    </p>
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={obData.university}
                    onChange={(e) => setObData(prev => ({ ...prev, university: e.target.value }))}
                    placeholder="Université / Faculté"
                    className={`w-full p-4 border text-sm outline-none rounded-2xl focus:border-blue-500 font-medium ${
                      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-100 placeholder-slate-500'
                    }`}
                  />
                </div>
              )}

              {/* Step 3: Logo de la faculté */}
              {obStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className={`block text-2xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Veuillez ajouter le logo de votre faculté.
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Vous pouvez faire un simple copier-coller (Ctrl+V / Cmd+V), glisser-déposer une image, ou cliquer pour en charger une.
                    </p>
                  </div>
                  
                  <div 
                    onPaste={handleOnboardingLogoPaste}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault(); e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setObData(prev => ({ ...prev, logo: event.target!.result as string }));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setObData(prev => ({ ...prev, logo: event.target!.result as string }));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className={`border-2 border-dashed rounded-2xl p-8 hover:border-blue-500 hover:bg-slate-50/50 dark:hover:bg-slate-955/20 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
                      obData.logo 
                        ? 'border-emerald-500 bg-emerald-50/5' 
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {obData.logo ? (
                      <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                        {obData.logo === "skipped" ? (
                          <div className="text-sm font-mono text-yellow-500 uppercase font-black">Skip activé (Logo par défaut)</div>
                        ) : (
                          <img 
                            src={obData.logo} 
                            alt="Faculte Logo" 
                            className="h-24 max-h-32 object-contain mx-auto rounded-lg shadow-md"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => setObData(prev => ({ ...prev, logo: null }))}
                          className="px-3.5 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          Remplacer l'image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50/50 dark:bg-slate-800 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-blue-500">
                          <Plus className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <span className="block text-sm font-semibold">Cliquer ou glisser-déposer le logo</span>
                          <span className="block text-xs text-slate-400">Prend en charge le collage d'images direct avec Ctrl+V</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {!obData.logo && (
                    <div className="flex justify-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setObData(prev => ({ ...prev, logo: "skipped" }));
                          goToNextStep();
                        }}
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-none font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                      >
                        Passer (Skip)
                      </button>
                    </div>
                  )}

                </div>
              )}

              {/* Step 4: Nature du diplôme */}
              {obStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className={`block text-2xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Veuillez indiquer la nature de votre diplôme
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Veuillez choisir entre un travail de mémoire de mastère ou une thèse de doctorat.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setObData(prev => ({ ...prev, degreeNature: "memoire" }))}
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-40 cursor-pointer ${
                        obData.degreeNature === "memoire"
                          ? "border-emerald-500 bg-emerald-50/5 ring-2 ring-emerald-500/20"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-blue-500"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="block text-sm font-bold">Mémoire (Mastère)</span>
                        <span className="block text-[10.5px] text-slate-400 leading-snug">Mémoire en vue de l'obtention d'un mastère de recherche</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setObData(prev => ({ ...prev, degreeNature: "these" }))}
                      className={`p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-40 cursor-pointer ${
                        obData.degreeNature === "these"
                          ? "border-emerald-500 bg-emerald-50/5 ring-2 ring-emerald-500/20"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-blue-500"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <span className="block text-sm font-bold">Thèse (Doctorat)</span>
                        <span className="block text-[10.5px] text-slate-400 leading-snug">Thèse en vue de l'obtention d'un doctorat (Ph.D)</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Titre du document (mémoire/thèse) */}
              {obStep === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className={`block text-2xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Veuillez indiquer le titre de votre {obData.degreeNature === "these" ? "thèse" : "mémoire"}.
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ce titre sera également traité pour en extraire des problématiques et des plans de travail.
                    </p>
                  </div>
                  <textarea
                    required
                    autoFocus
                    value={obData.documentTitle}
                    onChange={(e) => setObData(prev => ({ ...prev, documentTitle: e.target.value }))}
                    placeholder={`Ex: Le régime juridique de la souveraineté numérique...`}
                    rows={4}
                    className={`w-full p-4 border text-sm outline-none rounded-2xl focus:border-blue-500 font-medium resize-none ${
                      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-100 placeholder-slate-500'
                    }`}
                  />
                </div>
              )}

              {/* Step 6: Titre du diplôme (Degree Major) */}
              {obStep === 6 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className={`block text-2xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Veuillez indiquer le titre du diplôme
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Exemple : diplôme en droit public approfondi, droit des affaires...
                    </p>
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={obData.degreeMajor}
                    onChange={(e) => setObData(prev => ({ ...prev, degreeMajor: e.target.value }))}
                    placeholder="Ex: RECHERCHE EN DROIT PUBLIC INTERNE"
                    className={`w-full p-4 border text-sm outline-none rounded-2xl focus:border-blue-500 font-medium ${
                      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-100 placeholder-slate-500'
                    }`}
                  />
                </div>
              )}

              {/* Step 7: Supervisor Name */}
              {obStep === 7 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className={`block text-2xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Veuillez indiquer le nom de votre directeur de {obData.degreeNature === "these" ? "thèse" : "mémoire"}.
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Inscrivez le nom complet de l'encadrant(e) académique qui supervise vos travaux.
                    </p>
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={obData.supervisor}
                    onChange={(e) => setObData(prev => ({ ...prev, supervisor: e.target.value }))}
                    placeholder="Directeur de recherche / Encadrant"
                    className={`w-full p-4 border text-sm outline-none rounded-2xl focus:border-blue-500 font-medium ${
                      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-100 placeholder-slate-500'
                    }`}
                  />
                </div>
              )}

              {/* Step 8: Academic Year */}
              {obStep === 8 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className={`block text-2xl font-bold font-display tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Veuillez indiquer l’année universitaire.
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Entrez l'année de l'évaluation académique (Exemple : 2025 – 2026).
                    </p>
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={obData.academicYear}
                    onChange={(e) => setObData(prev => ({ ...prev, academicYear: e.target.value }))}
                    placeholder="Année Universitaire"
                    className={`w-full p-4 border text-sm outline-none rounded-2xl focus:border-blue-500 font-medium ${
                      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-100 placeholder-slate-500'
                    }`}
                  />
                </div>
              )}

              {/* Bottom buttons panel */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  disabled={obStep <= 1}
                  onClick={goToPrevStep}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    obStep <= 1 
                      ? "text-slate-350 dark:text-slate-600 bg-slate-100/50 dark:bg-slate-950/20 cursor-not-allowed" 
                      : "text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 cursor-pointer"
                  }`}
                >
                  Précédent
                </button>

                <button
                  type="button"
                  onClick={handleSkipAllOnboarding}
                  className="px-5 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl shadow transition-all hover:scale-105 cursor-pointer"
                >
                  Skip All (Passer Tout)
                </button>
                
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer transition-all hover:scale-105"
                >
                  {obStep === 8 ? "Démarrer Scrivya" : "Suivant"}
                </button>
              </div>

            </form>
          </div>
        </div>
        
        {/* Footer info brand */}
        <div className={`p-4 border-t text-center text-[10.5px] font-medium text-slate-400 tracking-wide uppercase font-mono shrink-0 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/5'
        }`}>
          Scrivya Académique &bull; Propulsé par un traitement sémantique intelligent
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-all duration-300 font-sans ${isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-950 text-slate-100'}`} style={{ direction: 'ltr' }}>
      
      {/* GLOWING AMBIENT BACKGROUND DECORATIONS (To accentuate glassmorphism as shown in user pictures) */}
      <div className="absolute top-10 left-[15%] w-[45rem] h-[45rem] rounded-full bg-blue-300/15 blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-indigo-300/15 blur-[130px] pointer-events-none select-none z-0" />

      {/* WORKSPACE AREA */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* REFACTORED FULL-HEIGHT INTEGRATED LEFT SIDEBAR DOCK OF CIRCLED BUTTONS */}
        <aside 
          className="h-[calc(100vh-2rem)] my-4 ml-4 mr-2 py-5 px-3 z-20 shrink-0 w-[76px] rounded-3xl backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.06)] flex flex-col justify-between items-center select-none border" 
          id="sidebar_dock_left"
          style={{
            background: isLight ? 'rgba(255, 255, 255, 0.45)' : 'rgba(15, 23, 42, 0.45)',
            borderColor: isLight ? 'rgba(226, 232, 240, 0.8)' : 'rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* BRAND/LOGO BUTTON (Top of the Dock) */}
          <div className="flex flex-col items-center gap-4 w-full shrink-0">
            <button
              onClick={() => {
                setIsLogoMenuOpen(!isLogoMenuOpen);
                setActiveRightPanel(null);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-base shadow-md transition-all cursor-pointer relative group ${
                isLogoMenuOpen 
                  ? "bg-gradient-to-tr from-blue-600 to-indigo-600 ring-2 ring-blue-400 scale-105" 
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
              }`}
              title="Menu Principal"
            >
              S
              {/* Tooltip */}
              <span className="absolute left-16 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                Menu Principal
              </span>
            </button>
            <div className="w-8 h-px bg-slate-200/40 dark:bg-white/5" />
          </div>

          {/* MIDDLE SCROLLABLE DOCK BUTTONS */}
          <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col items-center gap-3.5 py-4 my-2 w-full">
            {[
              {
                id: "squelette",
                icon: <BookOpen className="w-5 h-5 text-blue-500" />,
                title: "Structure du Document",
                color: "border-blue-500/35 hover:bg-blue-500/10 hover:border-blue-500/30"
              },
              {
                id: "afnor",
                icon: <Bookmark className="w-5 h-5 text-amber-500" />,
                title: "AFNOR Citations",
                color: "border-amber-500/35 hover:bg-amber-500/10 hover:border-amber-500/30"
              },
              {
                id: "humaniseur",
                icon: <Sparkles className="w-5 h-5 text-violet-500" />,
                title: "By-passer IA",
                color: "border-violet-500/35 hover:bg-violet-500/10 hover:border-violet-500/30"
              },
              {
                id: "chat",
                icon: <MessageSquare className="w-5 h-5 text-emerald-500" />,
                title: "Scrivya Chat",
                color: "border-emerald-500/35 hover:bg-emerald-500/10 hover:border-emerald-500/30",
                badge: chatMessages.length > 1
              },
              {
                id: "spellcheck",
                icon: <CheckSquare className="w-5 h-5 text-rose-500" />,
                title: "Correcteur d'Orthographe",
                color: "border-rose-500/35 hover:bg-rose-500/10 hover:border-rose-500/30"
              },
              {
                id: "phd_research",
                icon: <GraduationCap className="w-5 h-5 text-indigo-500" />,
                title: "Sources Ph.D",
                color: "border-indigo-500/35 hover:bg-indigo-500/10 hover:border-indigo-500/30"
              },
              {
                id: "plans_problematiques",
                icon: <Compass className="w-5 h-5 text-amber-500" />,
                title: "Plans & Problématiques",
                color: "border-amber-500/35 hover:bg-amber-500/10 hover:border-amber-500/30"
              },
              {
                id: "ai_mentor_map",
                icon: <GraduationCap className="w-5 h-5 text-emerald-500" />,
                title: "Mentorat-IA (Orientation)",
                color: "border-emerald-500/35 hover:bg-emerald-500/10 hover:border-emerald-500/30"
              },
              {
                id: "presentation_maker",
                icon: <Presentation className="w-5 h-5 text-fuchsia-500" />,
                title: "Créateur de Présentations",
                color: "border-fuchsia-500/35 hover:bg-fuchsia-500/10 hover:border-fuchsia-500/30"
              },
              {
                id: "pfe_hub",
                icon: <Layers className="w-5 h-5 text-blue-500 animate-pulse" />,
                title: "PFE-Hub Tunisie (Startups)",
                color: "border-blue-500/35 hover:bg-blue-500/10 hover:border-blue-500/30"
              },
              {
                id: "formatting",
                icon: <Type className="w-5 h-5 text-cyan-500" />,
                title: "Mise en Forme",
                color: "border-cyan-500/35 hover:bg-cyan-500/10 hover:border-cyan-500/30"
              },
              {
                id: "options",
                icon: <Settings className="w-5 h-5 text-slate-500 dark:text-slate-400" />,
                title: "Options & Exportation",
                color: "border-slate-500/35 hover:bg-slate-500/10 hover:border-slate-500/30"
              }
            ].map((btn) => {
              const isActive = btn.id === "ai_mentor_map"
                ? showAIMentor
                : btn.id === "presentation_maker"
                  ? showPresentationMaker
                  : btn.id === "pfe_hub"
                    ? showPfeHub
                    : activeRightPanel === btn.id && !isLogoMenuOpen && !showAIMentor && !showPresentationMaker && !showPfeHub;
              return (
                <button
                  key={btn.id}
                  onClick={() => {
                     if (btn.id === "ai_mentor_map") {
                       setShowAIMentor(!showAIMentor);
                       setShowPresentationMaker(false);
                       setShowPfeHub(false);
                       setActiveRightPanel(null);
                     } else if (btn.id === "presentation_maker") {
                       setShowPresentationMaker(!showPresentationMaker);
                       setShowAIMentor(false);
                       setShowPfeHub(false);
                       setActiveRightPanel(null);
                     } else if (btn.id === "pfe_hub") {
                       setShowPfeHub(!showPfeHub);
                       setShowAIMentor(false);
                       setShowPresentationMaker(false);
                       setActiveRightPanel(null);
                     } else {
                       setShowAIMentor(false);
                       setShowPresentationMaker(false);
                       setShowPfeHub(false);
                       setActiveRightPanel(activeRightPanel === btn.id ? null : btn.id as any);
                     }
                     setIsLogoMenuOpen(false);
                  }}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all cursor-pointer relative group shrink-0 ${
                    isActive 
                      ? "bg-slate-900/15 border-blue-500 shadow-inner scale-105 ring-2 ring-blue-500/25" 
                      : `border-transparent hover:scale-105 active:scale-95 ${btn.color}`
                  }`}
                  title={btn.title}
                >
                  {btn.icon}
                  {btn.badge && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse" />
                  )}
                  {/* Tooltip */}
                  <span className="absolute left-16 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                    {btn.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* BOTTOM DOCK ACTIONS */}
          <div className="flex flex-col items-center gap-3 w-full pt-1 shrink-0">
            <div className="w-8 h-px bg-slate-200/40 dark:bg-white/5 mb-1" />
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer relative group border ${
                isLight 
                  ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800' 
                  : 'bg-slate-900 border-white/5 hover:bg-slate-850 text-amber-400'
              }`}
              aria-label="Toggle theme"
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {/* Tooltip */}
              <span className="absolute left-16 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                {isLight ? "Mode Sombre" : "Mode Clair"}
              </span>
            </button>

            {/* Profile Avatar Button */}
            <div className="flex items-center justify-center relative group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500/10 to-indigo-650/20 border border-slate-200/40 dark:border-white/5 text-slate-700 dark:text-slate-300 font-bold text-xs shadow-sm flex items-center justify-center relative cursor-pointer hover:scale-105 transition-transform">
                <div className="w-7 h-7 rounded-full bg-blue-500/25 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0 uppercase">
                  {currentUser.name ? currentUser.name[0] : "A"}
                </div>
                <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 bottom-0.5 right-0.5 animate-pulse"></span>
              </div>

              {/* Premium hover profile card */}
              <div 
                className="absolute left-16 bottom-0 border p-3 rounded-2xl shadow-2xl z-50 opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 min-w-[200px] flex flex-col gap-2 scale-95 origin-left group-hover:scale-100"
                style={{
                  background: isLight ? '#ffffff' : 'rgba(15, 23, 42, 0.98)',
                  backdropFilter: 'blur(20px)',
                  borderColor: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-extrabold text-xs uppercase">
                    {currentUser.name ? currentUser.name[0] : "A"}
                  </div>
                  <div className="min-w-0">
                    <div className="font-sans font-bold text-[10.5px] text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[9px] text-slate-455 dark:text-slate-400 font-mono truncate">
                      {currentUser.university || "Carthage"}
                    </div>
                  </div>
                </div>
                <div className="h-px bg-slate-200/50 dark:bg-white/10 my-0.5"></div>
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-slate-400">Sync Cloud</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span> Actif
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={onLogout}
              className={`w-10 h-10 rounded-full border flex items-center justify-center hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all cursor-pointer relative group ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-900 border-white/5 text-slate-400'
              }`}
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
              {/* Tooltip */}
              <span className="absolute left-16 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-md">
                Déconnexion
              </span>
            </button>
          </div>
        </aside>

        {/* DYNAMIC INTEGRATED LEFT SIDEBAR PANEL (As shown in Image 1 and 4) */}
        {!showAIMentor && !showPresentationMaker && !showPfeHub && ((activeRightPanel !== null) || isLogoMenuOpen) && (
          <aside 
            className={`w-[360px] border-r flex flex-col h-full overflow-hidden shrink-0 z-40 shadow-[4px_0_24px_rgba(31,38,135,0.03)] backdrop-blur-xl animate-slideRight transition-all duration-300 relative ${
              isLight 
                ? 'bg-white/80 border-slate-200/50 text-slate-800' 
                : 'bg-slate-900/80 border-white/5 text-slate-100'
            }`} 
            style={{ contentVisibility: 'auto' }}
            id="left_tool_sidebar"
          >
            {/* Header section */}
            <div className={`p-4 border-b flex items-center justify-between select-none shrink-0 ${
              isLight ? 'bg-slate-50/50 border-slate-200/50' : 'bg-slate-950/20 border-white/5'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  {isLogoMenuOpen ? (
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  ) : activeRightPanel === "squelette" ? (
                    <BookOpen className="w-5 h-5" />
                  ) : activeRightPanel === "afnor" ? (
                    <Bookmark className="w-5 h-5" />
                  ) : activeRightPanel === "humaniseur" ? (
                    <Sparkles className="w-5 h-5" />
                  ) : activeRightPanel === "chat" ? (
                    <MessageSquare className="w-5 h-5" />
                  ) : activeRightPanel === "phd_research" ? (
                    <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  ) : activeRightPanel === "plans_problematiques" ? (
                    <Compass className="w-5 h-5 text-amber-500" />
                  ) : activeRightPanel === "spellcheck" ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : activeRightPanel === "formatting" ? (
                    <Type className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  ) : activeRightPanel === "options" ? (
                    <Settings className="w-5 h-5" />
                  ) : (
                    <CheckSquare className="w-5 h-5" />
                  )}
                </span>
                <div className="truncate">
                  <h4 className="font-sans font-extrabold text-[12.5px] uppercase tracking-wider text-slate-800 dark:text-white truncate">
                    {isLogoMenuOpen ? "Menu des Outils" : activeRightPanel === "squelette" ? "Squelette du Document" : activeRightPanel === "afnor" ? "Notes AFNOR (Citation)" : activeRightPanel === "humaniseur" ? "Humaniseur IA & Presets" : activeRightPanel === "chat" ? "Assistant Scrivya AI" : activeRightPanel === "phd_research" ? "Recherche PhD & Sources" : activeRightPanel === "plans_problematiques" ? "Plans & Problématiques" : activeRightPanel === "spellcheck" ? "Check Split Spelling" : activeRightPanel === "formatting" ? "Mise en Forme" : "Options & Export"}
                  </h4>
                  <span className="block text-[9.5px] text-slate-455 dark:text-slate-400 font-sans font-medium whitespace-nowrap">
                    {isLogoMenuOpen ? "Scrivya Académique" : activeRightPanel === "squelette" ? "Structure & Navigation" : activeRightPanel === "afnor" ? "Citation NF Z 44-005" : activeRightPanel === "humaniseur" ? "Contournement détection IA" : activeRightPanel === "chat" ? "Rigueur de rédaction" : activeRightPanel === "phd_research" ? "Moteur de sources de doctorat" : activeRightPanel === "plans_problematiques" ? "Sujets & structures de thèse" : activeRightPanel === "spellcheck" ? "Correction d'orthographe" : activeRightPanel === "formatting" ? "Édition et styles de texte" : "Paramètres et exports"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveRightPanel(null);
                  setIsLogoMenuOpen(false);
                }}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                  isLight 
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900' 
                    : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Masquer le panneau"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel views based on active state */}
            {isLogoMenuOpen ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans mb-1.5 pl-1 select-none">
                  Sélectionnez un outil ci-dessous pour l'ouvrir instantanément sur le côté gauche de votre écran de travail :
                </p>
                {[
                  {
                    key: "squelette",
                    label: "Squelette du Document",
                    subtitle: "Navigateur de pages du manuscrit",
                    icon: <BookOpen className="w-5 h-5 text-blue-500" />,
                    badge: "Structure"
                  },
                  {
                    key: "afnor",
                    label: "Notice Bibliographique AFNOR",
                    subtitle: "Générateur automatique de notes NF",
                    icon: <Bookmark className="w-5 h-5 text-emerald-500" />,
                    badge: "Citations"
                  },
                  {
                    key: "humaniseur",
                    label: "Humaniseur d'IA & Presets",
                    subtitle: "Écritures formelles sans détection robots",
                    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
                    badge: "Authentique"
                  },
                  {
                    key: "chat",
                    label: "Assistant Chat Scrivya",
                    subtitle: "Conseils et standards en temps réel",
                    icon: <MessageSquare className="w-5 h-5 text-indigo-500" />,
                    badge: "Assistant"
                  },
                  {
                    key: "spellcheck",
                    label: "Check Split Correction",
                    subtitle: "Vérificateur d'orthographe et grammaire",
                    icon: <CheckSquare className="w-5 h-5 text-rose-500" />,
                    badge: "Rigueur"
                  },
                  {
                    key: "phd_research",
                    label: "Recherche PhD & Sources Blue",
                    subtitle: "Recherche doctorale avec citations bleues",
                    icon: <GraduationCap className="w-5 h-5 text-indigo-500" />,
                    badge: "PhD"
                  }
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => {
                      setActiveRightPanel(m.key as any);
                      setIsLogoMenuOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3 cursor-pointer group hover:scale-[1.01] hover:shadow-md ${
                      isLight 
                        ? 'bg-white/50 border-slate-200/50 hover:bg-slate-50 hover:bg-gradient-to-r hover:from-indigo-50/50' 
                        : 'bg-slate-950/20 border-white/5 hover:bg-slate-950/40 hover:bg-gradient-to-r hover:from-white/[0.02]'
                    }`}
                  >
                    <span className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                      isLight ? 'bg-white border-slate-100 group-hover:bg-indigo-50' : 'bg-slate-900 border-white/5 group-hover:bg-white/5'
                    }`}>
                      {m.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="block font-sans font-extrabold text-[11.5px] text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {m.label}
                        </span>
                        <span className="text-[8px] font-mono font-bold uppercase py-0.5 px-2 rounded-full border border-slate-200/50 bg-slate-100/50 dark:border-white/5 dark:bg-slate-950/50 text-slate-450 dark:text-slate-400 select-none shrink-0">
                          {m.badge}
                        </span>
                      </div>
                      <span className="block text-[10px] text-slate-455 dark:text-slate-400 leading-normal font-sans font-medium">
                        {m.subtitle}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : activeRightPanel === "squelette" ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium select-none">
                  📖 Cliquez sur une page ci-dessous pour faire défiler automatiquement le plan de rédaction du manuscrit.
                </div>
                
                <div className="space-y-2">
                  {computedPagesList.map((page, idx) => {
                    const isActive = activePageId === page.id;
                    return (
                      <div
                        key={page.id}
                        onClick={() => {
                          setActivePageId(page.id);
                          document.getElementById(`page_bed_${page.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between group select-none ${
                          isActive
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200 font-bold shadow-sm'
                            : 'bg-white/45 hover:bg-slate-100/40 border-slate-150 dark:bg-slate-950/25 dark:border-white/5 text-slate-600 dark:text-slate-350 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <FileText className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-500 animate-pulse' : 'text-slate-400 group-hover:text-slate-600'}`} />
                          <div className="truncate text-[11px] font-sans">
                            <strong className={`font-mono text-[9px] mr-1.5 opacity-60 ${isActive ? 'text-emerald-650 dark:text-emerald-300' : ''}`}>
                              P.{idx + 1}
                            </strong>
                            {page.title || "Page sans titre"}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0">
                          {page.type === "cover" ? (
                            <span className="text-[8.5px] font-mono font-bold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded">
                              Garde
                            </span>
                          ) : page.type === "toc" ? (
                            <span className="text-[8.5px] font-mono font-bold uppercase bg-purple-500/10 text-purple-500 border border-purple-500/20 px-1.5 py-0.5 rounded">
                              Sommaire
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-slate-450 dark:text-slate-400">
                              {page.content ? `${Math.round(page.content.replace(/<[^>]*>/g, '').length / 5)} mots` : "Vide"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                   ) : activeRightPanel === "afnor" ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 font-sans">
                {/* Citations guide tip */}
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium select-none">
                  Les exigences de l'AFNOR réclament que le Nom de l'Auteur principal apparaisse entièrement en MAJUSCULES (ex: DUPONT, Pierre-Antoine).
                </div>

                <form onSubmit={handleAddFootnote} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-semibold text-slate-450 dark:text-slate-400 uppercase">Nom Auteur :</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: NEFZI"
                        className="w-full p-2 bg-white/50 border border-slate-200 dark:bg-slate-950 dark:border-white/10 rounded-lg outline-none text-[11px] text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 font-medium transition-colors uppercase"
                        value={newFootnote.authorLast}
                        onChange={(e) => setNewFootnote({...newFootnote, authorLast: e.target.value.toUpperCase()})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-semibold text-slate-450 dark:text-slate-400 uppercase">Prénom Auteur :</label>
                      <input
                        type="text"
                        placeholder="Ex: Ahmed"
                        className="w-full p-2 bg-white/50 border border-slate-200 dark:bg-slate-950 dark:border-white/10 rounded-lg outline-none text-[11px] text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 font-medium transition-colors uppercase"
                        value={newFootnote.authorFirst}
                        onChange={(e) => setNewFootnote({...newFootnote, authorFirst: e.target.value.toUpperCase()})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-semibold text-slate-455 dark:text-slate-400 uppercase">Titre Saisie :</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Manuel de Droit Public Tunisien"
                      className="w-full p-2 bg-white/50 border border-slate-200 dark:bg-slate-950 dark:border-white/10 rounded-lg outline-none text-[11px] text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 font-medium transition-colors uppercase"
                      value={newFootnote.title}
                      onChange={(e) => setNewFootnote({...newFootnote, title: e.target.value.toUpperCase()})}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <label className="block text-[9px] font-mono font-semibold text-slate-455 dark:text-slate-400 uppercase">Revue / Éditeur / URL :</label>
                      <input
                        type="text"
                        placeholder="Ex: L.D.G.R."
                        className="w-full p-2 bg-white/50 border border-slate-200 dark:bg-slate-950 dark:border-white/10 rounded-lg outline-none text-[11px] text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 font-medium transition-colors uppercase font-mono"
                        value={newFootnote.publisher}
                        onChange={(e) => setNewFootnote({...newFootnote, publisher: formatPublisherInput(e.target.value, newFootnote.publisher)})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono font-semibold text-slate-455 dark:text-slate-400 uppercase">Année :</label>
                      <input
                        type="text"
                        placeholder="Ex: 2026"
                        className="w-full p-2 bg-white/50 border border-slate-200 dark:bg-slate-950 dark:border-white/10 rounded-lg outline-none text-[11px] text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 font-medium transition-colors"
                        value={newFootnote.year}
                        onChange={(e) => setNewFootnote({...newFootnote, year: e.target.value.replace(/\D/g, "")})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-semibold text-slate-455 dark:text-slate-400 uppercase">Page de Référence (ou p.1) :</label>
                    <input
                      type="text"
                      placeholder="Ex: 14"
                      className="w-full p-2 bg-white/50 border border-slate-200 dark:bg-slate-950 dark:border-white/10 rounded-lg outline-none text-[11px] text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 font-medium transition-colors uppercase"
                      value={newFootnote.page}
                      onChange={(e) => setNewFootnote({...newFootnote, page: e.target.value.toUpperCase()})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono font-semibold text-slate-455 dark:text-slate-400 uppercase">Résumé / Abstract de la source :</label>
                    <textarea
                      placeholder="Ex: Résumé de la thèse de doctorat portant sur l'impact de l'IA..."
                      rows={2}
                      className="w-full p-2 bg-white/50 border border-slate-200 dark:bg-slate-950 dark:border-white/10 rounded-lg outline-none text-[11px] text-slate-700 dark:text-slate-100 placeholder-slate-400 focus:border-emerald-500 font-medium transition-colors font-sans leading-normal resize-none"
                      value={newFootnote.abstract || ""}
                      onChange={(e) => setNewFootnote({...newFootnote, abstract: e.target.value})}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm shadow-emerald-500/10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Compiler la Note AFNOR</span>
                  </button>
                </form>
              </div>

                {/* Existing footnotes in current workspace context */}
                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-white/5 select-none">
                  <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 pb-1.5 flex items-center justify-between">
                    <span>Notes de cette page ({footnotes.filter(f => f.pageId === activePageId).length})</span>
                  </div>

                  {footnotes.filter(f => f.pageId === activePageId).length === 0 ? (
                    <span className="block text-[10.5px] text-slate-405 dark:text-slate-400 italic text-center py-5 bg-slate-500/5 rounded-xl border border-dashed border-slate-200/40 dark:border-white/5">
                      Aucune référence sur cette page.
                    </span>
                  ) : (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {footnotes.filter(f => f.pageId === activePageId).map((f) => (
                        <div key={f.id} className="p-2.5 rounded-xl border border-slate-100/80 bg-white/40 dark:border-white/5 dark:bg-slate-950/15 text-[10.5px] leading-relaxed flex flex-col gap-1 relative">
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">
                              Note [{f.id}] • {f.author}
                            </span>
                            <button
                              onClick={() => setFootnotes(footnotes.filter(fn => fn.id !== f.id))}
                              className="text-rose-500 hover:text-rose-600 p-0.5 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Retirer cette note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 italic truncate" title={f.formattedText || f.title}>
                            {f.formattedText || f.title}
                          </div>
                          <span className="text-[9px] font-mono text-slate-400">Type : {f.sourceKind}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : activeRightPanel === "humaniseur" ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
                <div className="p-3 bg-amber-500/5 border border-amber-500/15 text-amber-800 dark:text-amber-200 rounded-xl text-[10.5px] leading-relaxed font-sans select-none">
                  ✨ <strong>Paraphraseur garanti sans détection IA</strong>. Saisissez votre texte brut dans le champ ci-dessous et appliquez des filtres d'écriture universitaires certifiés.
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-450 dark:text-slate-400 uppercase select-none">Texte à humaniser :</label>
                  <textarea
                    value={reformulationInput}
                    onChange={(e) => setReformulationInput(e.target.value)}
                    placeholder="Collez le texte brut à réécrire..."
                    rows={5}
                    className="w-full p-2.5 bg-white/50 border border-slate-200 dark:bg-slate-950 dark:border-white/10 rounded-xl outline-none text-xs text-slate-700 dark:text-slate-100 placeholder-slate-405 focus:border-amber-500 font-medium font-sans resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-450 dark:text-slate-400 uppercase select-none">Presets de ton de plume :</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { key: "humanize_standard", label: "Humain Standard", desc: "Anti-robots maximum", icon: "✍️" },
                      { key: "humanize_academic", label: "Ton Académique", desc: "Vocabulaire rigoureux", icon: "🎓" },
                      { key: "academic_formal", label: "Style Didactique PFE", desc: "Raisonnement clair", icon: "📚" },
                      { key: "academic_juridique", label: "Droit & Légal", desc: "Formulations juristes", icon: "⚖️" }
                    ].map((pref) => (
                      <button
                        key={pref.key}
                        onClick={() => setReformulationTone(pref.key)}
                        className={`p-2.5 text-left rounded-xl border transition-all text-xs cursor-pointer select-none flex flex-col gap-0.5 ${
                          reformulationTone === pref.key
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-300 ring-2 ring-amber-500/20 shadow-sm font-bold'
                            : 'bg-white/45 hover:bg-slate-200/30 border-slate-150 dark:bg-slate-950/25 dark:border-white/5 text-slate-650 dark:text-slate-350'
                        }`}
                      >
                        <span className="font-sans font-extrabold flex items-center gap-1 text-[11px]">
                          <span>{pref.icon}</span> {pref.label}
                        </span>
                        <span className="text-[9.5px] text-slate-400 leading-normal font-sans font-medium">{pref.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleReformulate}
                  disabled={!reformulationInput.trim() || reformulationLoading}
                  className={`w-full py-2.5 text-xs font-bold text-white transition-all rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow ${
                    reformulationLoading
                      ? 'bg-slate-800 text-slate-500 disabled:cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/10'
                  }`}
                >
                  {reformulationLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Analyse et reformulation en cours...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 stroke-[2]" />
                      <span>Humaniser le Texte Académiquement</span>
                    </>
                  )}
                </button>

                {reformulationResult && (
                  <div className="space-y-2 pt-3.5 border-t border-slate-100 dark:border-white/5 animate-fadeIn">
                    <label className="block text-[10px] font-mono font-bold text-emerald-500 uppercase select-none">Version Authentique (Sans Plagiat) :</label>
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-[11.5px] leading-relaxed text-slate-700 dark:text-slate-100 font-serif text-justify font-medium max-h-[160px] overflow-y-auto">
                      {reformulationResult}
                    </div>
                    <div className="flex gap-2 select-none">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(reformulationResult);
                          alert("Copié dans le presse-papiers avec succès !");
                        }}
                        className="flex-1 py-1.5 p-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer dark:text-slate-300 dark:border-white/5 dark:hover:bg-white/10 text-center"
                      >
                        Copier
                      </button>
                      <button
                        onClick={insertReformulationInActive}
                        className="flex-1 py-1.5 p-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Insérer au manuscrit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : activeRightPanel === "chat" ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden font-sans">
                {/* Chat items list wrapper */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === "user" ? "ml-auto items-end animate-slideInLeft" : "mr-auto items-start animate-slideInRight"
                      }`}
                    >
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1 select-none">
                        {msg.sender === "user" ? currentUser.name : "Scrivya AI"}
                      </span>
                      <div className={`p-3 rounded-2xl text-[11.5px] leading-normal font-sans text-justify font-medium border ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white border-blue-500/30 rounded-br-none shadow-sm shadow-blue-500/10"
                          : isLight
                            ? "bg-white text-slate-800 border-slate-200/50 rounded-bl-none shadow-sm"
                            : "bg-slate-950/40 text-slate-150 border-white/5 rounded-bl-none"
                      }`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {chatLoading && (
                    <div className="mr-auto items-start flex flex-col max-w-[85%] animate-pulse">
                      <span className="text-[9px] font-mono text-slate-450 uppercase tracking-wider mb-1 select-none">
                        Scrivya AI
                      </span>
                      <div className={`p-3 rounded-2xl rounded-bl-none text-xs flex items-center gap-2 ${
                        isLight ? 'bg-white border text-slate-800' : 'bg-slate-850 text-slate-150 border border-white/5'
                      }`}>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                        <span>Recherche des normes académiques...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Suggestions chip row */}
                <div className={`p-3 border-t space-y-1.5 shrink-0 select-none ${
                  isLight ? 'bg-slate-50/50 border-slate-200/50' : 'bg-slate-950/20 border-white/5'
                }`}>
                  <span className="block text-[8.5px] font-mono font-bold text-slate-450 uppercase tracking-widest pl-1 select-none">
                    Suggestions :
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto">
                    {promptSuggestions.map((promptText) => (
                      <button
                        key={promptText}
                        type="button"
                        onClick={() => handleSendMessage(promptText)}
                        className={`text-[10px] p-1 px-2.5 rounded-lg border text-left transition-all cursor-pointer font-medium select-none ${
                          isLight 
                            ? 'bg-white border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600' 
                            : 'bg-slate-950 border-white/5 hover:border-blue-500/20 text-slate-300 hover:text-blue-400'
                        }`}
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                <div className={`p-3 border-t shrink-0 ${
                  isLight ? 'bg-white border-slate-200/50' : 'bg-slate-900 border-white/5'
                }`}>
                  {voiceError && (
                    <div className="mb-2 p-1.5 px-2 bg-rose-500/10 border border-rose-500/25 rounded-xl text-[9.5px] text-rose-450 font-mono animate-fadeIn flex justify-between items-center">
                      <span>{voiceError}</span>
                      <button onClick={() => setVoiceError(null)} className="text-[8px] hover:underline cursor-pointer">Fermer</button>
                    </div>
                  )}
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={chatMessageInput}
                      onChange={(e) => setChatMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage(chatMessageInput)}
                      placeholder="Une question sur les normes ou les lois ?"
                      className={`flex-1 p-2.5 border text-xs outline-none rounded-xl focus:border-blue-500 font-medium ${
                        isLight ? 'bg-white border-slate-200/60 text-slate-900 animate-fadeIn' : 'bg-slate-950 border-white/5 text-slate-100'
                      }`}
                    />
                    
                    <button
                      type="button"
                      onClick={toggleChatListening}
                      className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                        isChatListening
                          ? 'bg-rose-600 text-white border-rose-500/50 animate-pulse scale-105 shadow-md'
                          : isLight
                            ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                            : 'bg-slate-800 border-white/5 hover:bg-slate-750 text-slate-300'
                      }`}
                      title={isChatListening ? "Session vocale active... Parlez" : "Dicter votre message"}
                    >
                      <Mic className={`w-4 h-4 ${isChatListening ? 'animate-bounce text-white' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage(chatMessageInput)}
                      disabled={!chatMessageInput.trim() || chatLoading}
                      className={`p-2.5 rounded-xl text-white flex items-center justify-center cursor-pointer transition-all ${
                        !chatMessageInput.trim() || chatLoading
                          ? 'bg-slate-800 text-slate-650'
                          : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {/* VOICE CALL / DIALOG ACTION TRIGGER BUTTON */}
                  <div className="mt-2 text-center select-none shrink-0 pt-1.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-1.5">
                    <span className="text-[9px] font-mono text-slate-450 uppercase">Communication live :</span>
                    <button
                      onClick={startVoiceCall}
                      disabled={isVoiceCallActive}
                      className={`p-1 px-2.5 rounded-lg border text-[9.5px] font-bold font-sans cursor-pointer transition-all flex items-center gap-1 ${
                        isVoiceCallActive
                          ? "bg-slate-850 text-emerald-400 border-emerald-500/30 animate-pulse"
                          : "bg-blue-600 border-blue-500/20 text-white hover:bg-blue-700 shadow-sm"
                      }`}
                    >
                      <Phone className="w-3 h-3 text-emerald-300" />
                      <span>{isVoiceCallActive ? "Microphone actif" : "Appel Vocal Scrivya Live"}</span>
                    </button>
                    {isVoiceCallActive && (
                      <button
                        onClick={endVoiceCall}
                        className="p-1 px-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-sans text-[9px] font-bold cursor-pointer transition-all"
                      >
                        Interrompre
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : activeRightPanel === "phd_research" ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden font-sans">
                {/* Search Form Header */}
                <div className={`p-4 border-b shrink-0 ${isLight ? 'bg-indigo-50/20 border-slate-200/50' : 'bg-slate-950/30 border-white/5'}`}>
                  <form onSubmit={handlePhdSearch} className="space-y-3">
                    <label className="block text-[10.5px] font-sans font-extrabold text-slate-500 dark:text-slate-400 uppercase select-none tracking-wider">
                      Sujet / Problématique Ph.D :
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={phdQuery}
                          onChange={(e) => setPhdQuery(e.target.value)}
                          placeholder="Ex: Souveraineté numérique..."
                          className={`w-full p-2.5 pl-9 border text-xs outline-none rounded-xl focus:border-indigo-650 font-medium ${
                            isLight ? 'bg-white border-slate-200/70 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-100 placeholder-slate-500'
                          }`}
                        />
                        <Search className="w-3.5 h-3.5 absolute left-3 top-3.5 text-slate-400" />
                      </div>
                      <button
                        type="submit"
                        disabled={phdLoading || !phdQuery.trim()}
                        className={`px-4 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer transition-all ${
                          phdLoading || !phdQuery.trim()
                            ? 'bg-slate-300 dark:bg-slate-850 text-slate-450 dark:text-slate-505'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-md transform hover:scale-[1.02]'
                        }`}
                      >
                        {phdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sonder</span>}
                      </button>
                    </div>

                    {!phdLoading && (
                      <div className="space-y-1.5 pt-1 select-none">
                        <span className="block text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">Sujets de thèse suggérés :</span>
                        <div className="flex flex-wrap gap-1">
                          {[
                            "L'archivage des actes d'état civil en droit tunisien",
                            "Blockchain & traçabilité",
                            "Neutralité carbone Horizon 2050",
                            "Cryptomonnaies et régulation"
                          ].map((topic) => (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => {
                                setPhdQuery(topic);
                                // Fetch directly
                                setPhdLoading(true);
                                setPhdShowAllSources(false);
                                fetch("/api/phd-research", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ topic }),
                                })
                                .then(r => r.json())
                                .then(data => {
                                  if (data && data.synthesis) {
                                    setPhdResult(data.synthesis);
                                    setPhdSources(data.sources || []);
                                    setPhdHasSearched(true);
                                  }
                                })
                                .catch(err => console.error(err))
                                .finally(() => setPhdLoading(false));
                              }}
                              className={`text-[9.5px] py-1 px-2.5 rounded-lg border font-medium text-left transition-colors cursor-pointer ${
                                isLight 
                                  ? 'bg-slate-50 border-slate-200/60 hover:bg-indigo-50/50 text-slate-650 hover:text-indigo-700 hover:border-indigo-200' 
                                  : 'bg-slate-950/35 border-white/5 hover:bg-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Main Results / Bibliography Panel */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {phdLoading ? (
                    <div className="h-48 flex flex-col items-center justify-center text-center space-y-3 select-none">
                      <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 scale-110 animate-pulse">
                        <GraduationCap className="w-8 h-8 text-indigo-500 animate-bounce" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11.5px] font-sans font-extrabold text-slate-700 dark:text-white">Exploration doctrinale active...</p>
                        <p className="text-[9.5px] font-sans font-medium text-slate-450 dark:text-slate-400 max-w-[240px] leading-relaxed mx-auto">
                          Envoi au modèle Scrivya-PhD, extraction des sources normalisées et rédaction de la thèse bibliographique
                        </p>
                      </div>
                    </div>
                  ) : phdHasSearched ? (
                    <div className="space-y-4 animate-fadeIn">
                      {/* Results Card */}
                      <div className={`p-4 rounded-2xl border leading-relaxed text-xs space-y-3 ${
                        isLight ? 'bg-indigo-505/[0.02] border-indigo-550/10 text-slate-755' : 'bg-slate-950/20 border-white/5 text-slate-200'
                      }`}>
                        <div className="flex items-center justify-between pb-2 border-b border-indigo-500/10">
                          <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                            🔬 Synthèse Doctorale Générée
                          </span>
                          <span className="text-[8.5px] font-mono font-bold uppercase bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full border border-blue-500/20 shadow-sm">
                            Citations Surlignées Bleu
                          </span>
                        </div>
                        <div className="space-y-3 leading-relaxed font-sans font-medium">
                          {renderPhdSynthesis(phdResult)}
                        </div>
                      </div>

                      {/* Prominent Sources Box Button */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setPhdShowAllSources(!phdShowAllSources)}
                          className={`w-full py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-sm ${
                            phdShowAllSources
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-indigo-500 text-white transform hover:scale-[1.01]'
                              : isLight
                                ? 'bg-indigo-50/50 border-indigo-100 text-indigo-700 hover:bg-indigo-50'
                                : 'bg-indigo-950/20 border-indigo-550/15 text-indigo-400 hover:bg-indigo-950/30'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Bookmark className="w-4 h-4" />
                            <span>📋 CONSULTER LES SOURCES DU SUJET</span>
                          </div>
                          <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-lg font-mono tracking-wider transition-all font-extrabold ${
                            phdShowAllSources ? 'bg-white text-indigo-700 shadow' : 'bg-indigo-600 text-white'
                          }`}>
                            {phdSources.length} sources
                          </span>
                        </button>
                      </div>

                      {/* Display Bibliography list in one place */}
                      {phdShowAllSources && (
                        <div className="space-y-3 animate-slideDown pt-2">
                          <div className="flex items-center justify-between select-none">
                            <span className="text-[9.5px] uppercase font-mono font-extrabold tracking-wider text-slate-500 dark:text-slate-400 pl-1">
                              Bibliographie indexée pour "{phdQuery}" :
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {phdSources.map((source) => (
                              <div
                                key={source.id}
                                className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all relative group hover:shadow-md ${
                                  isLight 
                                    ? 'bg-white border-slate-200/70 hover:border-indigo-300' 
                                    : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                                }`}
                              >
                                <span className="absolute top-3 right-3 text-[9px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 select-none">
                                  INDEX [{source.id}]
                                </span>

                                <div className="space-y-1 pr-14">
                                  <h5 className="font-extrabold text-[11.5px] text-slate-800 dark:text-white font-sans leading-tight">
                                    {source.title}
                                  </h5>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                    Auteur : <span className="font-bold text-slate-700 dark:text-slate-300">{source.author}</span> ({source.year})
                                  </div>
                                  <div className="text-[9.5px] text-slate-500 dark:text-slate-450 italic">
                                    Éditeur / Revue : {source.publisher}
                                  </div>
                                </div>

                                {source.abstract && (
                                  <div className={`p-2 rounded-lg text-[10px] leading-relaxed font-sans ${
                                    isLight ? 'bg-slate-50 text-slate-600' : 'bg-slate-950/30 text-slate-400'
                                  }`}>
                                    <strong className="block text-[8px] font-mono uppercase text-slate-405 mb-0.5 select-none">Apport Thésard (Abstract) :</strong>
                                    {source.abstract}
                                  </div>
                                )}

                                <div className="pt-1 select-none flex flex-col gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const textToInsert = ` [${source.id}]`;
                                      insertPhdCitationText(textToInsert);
                                      
                                      const mappedFootnote: Footnote = {
                                        id: `phd-${source.id}-${Date.now()}`,
                                        author: source.author,
                                        title: source.title,
                                        publisher: source.publisher,
                                        year: source.year,
                                        sourceKind: "article",
                                        formattedText: `${source.author}, *${source.title}*, ${source.publisher}, ${source.year}.`,
                                        abstract: source.abstract,
                                        pageId: activePageId
                                      };
                                      setFootnotes(prev => [...prev, mappedFootnote]);
                                    }}
                                    className="w-full py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[9.5px] transition-all cursor-pointer text-center"
                                  >
                                    ✍️ Écrire la citation [${source.id}] au curseur
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const bibText = `<p><strong>[${source.id}] ${source.author}</strong>, <em>${source.title}</em>, ${source.publisher}, ${source.year}. Résumé : ${source.abstract || "N/A"}</p><br/>`;
                                      insertPhdCitationText(bibText);
                                    }}
                                    className="w-full py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[9.5px] transition-all cursor-pointer text-center"
                                  >
                                    📚 Indexer la bibliographie complète dans le manuscrit
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-center space-y-2 select-none border border-dashed border-slate-200 dark:border-white/5 rounded-2xl p-4">
                      <GraduationCap className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-sans font-bold text-slate-655 dark:text-slate-400">Aucun sujet analysé</p>
                        <p className="text-[9.5px] font-sans font-medium text-slate-400 max-w-[200px] leading-relaxed mx-auto">
                          Saisissez une problématique doctorale ci-dessus pour bâtir votre support de thèse bibliographique.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : activeRightPanel === "plans_problematiques" ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden font-sans">
                {plansOption === null ? (
                  /* OPTIONS LIST MENU */
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans select-none">
                    <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-[11px] leading-relaxed text-slate-600 dark:text-slate-350 font-medium select-none">
                      🧭 <strong>Besoin d'aide pour structurer votre thèse ?</strong> Choisissez l'un de nos outils d'excellence méthodologique ci-dessous pour bâtir des plans et des problématiques de niveau académique d'élite.
                    </div>

                    <div className="space-y-3">
                      {/* OPTION 1 */}
                      <button
                        onClick={() => {
                          setPlansOption(1);
                          handlePlansSubmit(1);
                        }}
                        className="w-full text-left p-3.5 rounded-2xl border bg-white/45 hover:bg-amber-500/5 border-slate-150 hover:border-amber-500/30 dark:bg-slate-950/25 dark:border-white/5 transition-all group flex gap-3 cursor-pointer items-start shadow-sm"
                      >
                        <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform shrink-0">
                          <Compass className="w-5 h-5 animate-pulse" />
                        </span>
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-800 dark:text-white leading-snug">
                            1. Sondage Automatique (Surprise Tool)
                          </h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                            Générez instantanément une problématique percutante et un plan détaillé en 2 parties basés sur votre page de garde.
                          </p>
                        </div>
                      </button>

                      {/* OPTION 2 */}
                      <button
                        onClick={() => {
                          setPlansOption(2);
                          setPlansInput("");
                          setPlansResult("");
                        }}
                        className="w-full text-left p-3.5 rounded-2xl border bg-white/45 hover:bg-indigo-500/5 border-slate-150 hover:border-indigo-500/30 dark:bg-slate-950/25 dark:border-white/5 transition-all group flex gap-3 cursor-pointer items-start shadow-sm"
                      >
                        <span className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </span>
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-800 dark:text-white leading-snug">
                            2. Problématique déjà préparée
                          </h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                            Saisissez votre problématique centrale et laissez Scrivya bâtir le plan structurel idéal (Partie I & II) adapté.
                          </p>
                        </div>
                      </button>

                      {/* OPTION 3 */}
                      <button
                        onClick={() => {
                          setPlansOption(3);
                          setPlansInput("");
                          setPlansResult("");
                        }}
                        className="w-full text-left p-3.5 rounded-2xl border bg-white/45 hover:bg-emerald-500/5 border-slate-150 hover:border-emerald-500/30 dark:bg-slate-950/25 dark:border-white/5 transition-all group flex gap-3 cursor-pointer items-start shadow-sm"
                      >
                        <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform shrink-0">
                          <FileText className="w-5 h-5" />
                        </span>
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-800 dark:text-white leading-snug">
                            3. Plan déjà préparé
                          </h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                            Saisissez vos deux grandes parties et laissez Scrivya rédiger 3 problématiques de recherche sur-mesure.
                          </p>
                        </div>
                      </button>

                      {/* OPTION 4 */}
                      <button
                        onClick={() => {
                          setPlansOption(4);
                          setPlansInput("");
                          setPlansResult("");
                        }}
                        className="w-full text-left p-3.5 rounded-2xl border bg-white/45 hover:bg-rose-500/5 border-slate-150 hover:border-rose-500/30 dark:bg-slate-950/25 dark:border-white/5 transition-all group flex gap-3 cursor-pointer items-start shadow-sm"
                      >
                        <span className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform shrink-0">
                          <CheckSquare className="w-5 h-5" />
                        </span>
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-800 dark:text-white leading-snug">
                            4. Avis sur problématique & plan (Critique)
                          </h5>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                            Collez votre problématique et votre plan pour déceler les pièges méthodologiques (comme le "et" dans les titres) et recevoir des suggestions.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* OPTION CONTENT AREA */
                  <div className="flex-1 flex flex-col overflow-hidden font-sans">
                    {/* BACK BUTTON */}
                    <div className={`p-3 border-b flex items-center justify-between select-none shrink-0 ${isLight ? 'bg-slate-50/50 border-slate-150' : 'bg-slate-950/10 border-white/5'}`}>
                      <button
                        onClick={() => {
                          setPlansOption(null);
                          setPlansInput("");
                          setPlansResult("");
                          setPlansChatOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-[10.5px] font-bold transition-all cursor-pointer ${
                          isLight ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700' : 'bg-slate-900 border-white/10 hover:bg-slate-850 text-slate-300'
                        }`}
                      >
                        <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                        <span>Changer d'outil</span>
                      </button>
                      <span className="text-[9.5px] uppercase font-mono font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
                        Option {plansOption} active
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* INPUT FIELDS FOR OPTIONS 2, 3, 4 */}
                      {plansOption !== 1 && !plansResult && (
                        <div className="space-y-3.5 animate-fadeIn">
                          <div className="space-y-1">
                            <label className="block text-[10px] uppercase font-mono font-extrabold text-slate-405 dark:text-slate-400">
                              {plansOption === 2 
                                ? "Saisissez votre Problématique :" 
                                : plansOption === 3 
                                  ? "Saisissez votre Plan (Partie I & II) :" 
                                  : "Collez votre Problématique & Plan :"}
                            </label>
                            <p className="text-[9.5px] font-medium leading-relaxed text-slate-405">
                              {plansOption === 2 
                                ? "Quelle est la question centrale à laquelle votre travail de recherche tente de répondre ?" 
                                : plansOption === 3 
                                  ? "Détaillez vos deux grandes parties théoriques et empiriques." 
                                  : "Indiquez votre problématique suivie de vos grandes lignes de recherche."}
                            </p>
                          </div>

                          <textarea
                            value={plansInput}
                            onChange={(e) => setPlansInput(e.target.value)}
                            rows={5}
                            placeholder={
                              plansOption === 2 
                                ? "Ex: Dans quelle mesure la souveraineté numérique impacte-t-elle le droit positif tunisien ?" 
                                : plansOption === 3 
                                  ? "Ex:\nPartie I : L'affirmation conceptuelle de la souveraineté numérique\nPartie II : L'effectivité pratique de la régulation étatique" 
                                  : "Ex:\nProblématique : ...\nPlan :\nPartie I : ...\nPartie II : ..."
                            }
                            className={`w-full p-3.5 border text-xs outline-none rounded-2xl resize-none font-medium leading-relaxed ${
                              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-100 placeholder-slate-500'
                            }`}
                          />

                          <button
                            onClick={() => handlePlansSubmit(plansOption)}
                            disabled={plansLoading || !plansInput.trim()}
                            className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow ${
                              plansLoading || !plansInput.trim()
                                ? 'bg-slate-300 dark:bg-slate-850 text-slate-450 dark:text-slate-505 pointer-events-none'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-[1.01]'
                            }`}
                          >
                            {plansLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
                                <span>GÉNÉRER AVEC SCRIVYA</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* LOADING STATE FOR OPTION 1 OR GENERAL GENERATION */}
                      {plansLoading && (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-pulse select-none">
                          <div className="relative">
                            <Compass className="w-12 h-12 text-amber-500 animate-spin duration-[3s]" />
                            <Sparkles className="w-6 h-6 text-indigo-500 absolute -top-2 -right-2 animate-bounce" />
                          </div>
                          <div className="space-y-1 px-4">
                            <p className="text-[12px] font-sans font-black text-slate-700 dark:text-slate-300">
                              Scrivya structure vos recherches...
                            </p>
                            <p className="text-[10px] font-sans font-medium text-slate-400 max-w-[220px] mx-auto leading-relaxed">
                              Analyse de la cohérence logique, alignement avec les exigences de rigueur universitaire tunisienne.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* DISPLAY RESULT */}
                      {plansResult && !plansLoading && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className={`p-4 border rounded-2xl text-xs space-y-3 leading-relaxed relative hover:shadow-md transition-shadow ${
                            isLight ? 'bg-amber-500/[0.02] border-amber-500/20' : 'bg-slate-950/40 border-white/5'
                          }`}>
                            <span className="absolute top-3 right-3 text-[8.5px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 select-none">
                              COMPAGNON DE RECHERCHE
                            </span>
                            
                            <div className="prose dark:prose-invert max-w-none text-[11.5px] space-y-2">
                              {/* Inline renderer for structured plan */}
                              {plansResult.split("\n").map((line, idx) => {
                                const lineTrim = line.trim();
                                if (lineTrim.startsWith("###")) {
                                  return <h3 key={idx} className="text-xs font-black text-amber-600 dark:text-amber-400 mt-4 mb-2 select-all font-sans uppercase tracking-wide border-l-2 border-amber-500 pl-2">{lineTrim.replace(/###/g, "").trim()}</h3>;
                                }
                                if (lineTrim.startsWith("####")) {
                                  return <h4 key={idx} className="text-xs font-extrabold text-slate-800 dark:text-white mt-3 mb-1 select-all font-sans">{lineTrim.replace(/####/g, "").trim()}</h4>;
                                }
                                if (lineTrim.startsWith("#####")) {
                                  return <h5 key={idx} className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-2.5 mb-1 select-all font-sans italic">{lineTrim.replace(/#####/g, "").trim()}</h5>;
                                }
                                if (lineTrim.startsWith(">")) {
                                  return <blockquote key={idx} className="my-2 p-3 bg-amber-500/5 dark:bg-amber-500/10 border-l-4 border-amber-500 rounded-r-xl text-[11px] font-medium text-slate-600 dark:text-slate-350 leading-relaxed italic select-all">{lineTrim.replace(/>/g, "").trim()}</blockquote>;
                                }
                                if (lineTrim.startsWith("*")) {
                                  return (
                                    <li key={idx} className="ml-4 list-disc text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed select-all my-1 font-sans">
                                      {lineTrim.replace(/^\*\s*/, "").split("**").map((part, partIdx) => 
                                        partIdx % 2 === 1 ? <strong key={partIdx} className="font-bold text-slate-855 dark:text-white">{part}</strong> : part
                                      )}
                                    </li>
                                  );
                                }
                                if (lineTrim.startsWith("-")) {
                                  return (
                                    <li key={idx} className="ml-4 list-disc text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed select-all my-1 font-sans">
                                      {lineTrim.replace(/^-\s*/, "").split("**").map((part, partIdx) => 
                                        partIdx % 2 === 1 ? <strong key={partIdx} className="font-bold text-slate-855 dark:text-white">{part}</strong> : part
                                      )}
                                    </li>
                                  );
                                }
                                if (lineTrim === "---") {
                                  return <hr key={idx} className="my-3 border-t border-slate-200/50 dark:border-white/5" />;
                                }
                                if (lineTrim === "") {
                                  return <div key={idx} className="h-2" />;
                                }
                                const parts = lineTrim.split("**");
                                return (
                                  <p key={idx} className="text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed select-all font-sans my-1">
                                    {parts.map((part, partIdx) => 
                                      partIdx % 2 === 1 ? <strong key={partIdx} className="font-extrabold text-slate-800 dark:text-white">{part}</strong> : part
                                    )}
                                  </p>
                                );
                              })}
                            </div>
                          </div>

                          {/* ACTION BUTTONS */}
                          <div className="grid grid-cols-2 gap-2 select-none">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(plansResult);
                                alert("Texte de structure copié dans le presse-papiers !");
                              }}
                              className={`py-2.5 px-3 rounded-xl border text-[10px] font-extrabold text-center transition-all cursor-pointer ${
                                isLight 
                                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' 
                                  : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-850'
                              }`}
                            >
                              📋 COPIER LE RÉSULTAT
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPlansChatOpen(!plansChatOpen);
                              }}
                              className={`py-2.5 px-3 rounded-xl border text-[10px] font-extrabold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                plansChatOpen
                                  ? 'bg-amber-600 border-amber-600 text-white hover:bg-amber-700 shadow-md'
                                  : isLight 
                                    ? 'bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100' 
                                    : 'bg-amber-950/20 border-amber-550/15 text-amber-400 hover:bg-amber-950/30'
                              }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{plansChatOpen ? "FERMER DISCUS." : "EN DISCUTER PLUS"}</span>
                            </button>
                          </div>

                          {/* INTERACTIVE FOLLOW-UP CHAT */}
                          {plansChatOpen && (
                            <div className="border border-amber-500/15 dark:border-white/5 rounded-2xl overflow-hidden flex flex-col max-h-[350px] animate-slideDown shadow-inner">
                              {/* Chat Messages */}
                              <div className={`p-3 space-y-2.5 overflow-y-auto flex-1 max-h-[220px] ${isLight ? 'bg-slate-50/50' : 'bg-slate-950/20'}`}>
                                {plansChatMessages.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                                  >
                                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
                                      msg.role === "assistant" 
                                        ? "bg-amber-500/15 text-amber-600" 
                                        : "bg-indigo-550/10 text-indigo-500"
                                    }`}>
                                      {msg.role === "assistant" ? "S" : "U"}
                                    </div>
                                    <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                                      msg.role === "assistant"
                                        ? isLight 
                                          ? "bg-white text-slate-700 border border-slate-100" 
                                          : "bg-slate-900 text-slate-300"
                                        : "bg-indigo-600 text-white"
                                    }`}>
                                      {msg.text}
                                    </div>
                                  </div>
                                ))}
                                {plansChatLoading && (
                                  <div className="flex gap-2 max-w-[80%]">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-600 shrink-0 flex items-center justify-center text-[10px] font-bold animate-pulse">
                                      S
                                    </div>
                                    <div className={`p-2.5 rounded-xl text-xs text-slate-400 leading-normal animate-pulse ${
                                      isLight ? 'bg-white border font-sans' : 'bg-slate-900 font-sans'
                                    }`}>
                                      Scrivya affine la réflexion...
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Chat Input */}
                              <form onSubmit={handlePlansChatSubmit} className={`p-2 border-t flex gap-1.5 items-center shrink-0 ${isLight ? 'bg-white border-slate-150' : 'bg-slate-950/40 border-white/5'}`}>
                                <input
                                  type="text"
                                  value={plansChatMessageInput}
                                  onChange={(e) => setPlansChatMessageInput(e.target.value)}
                                  placeholder="Écrivez une précision structurelle..."
                                  className={`flex-1 p-2 border text-xs outline-none rounded-xl focus:border-amber-500 font-medium ${
                                    isLight ? 'bg-slate-50 border-slate-150 text-slate-800' : 'bg-slate-950 border-white/10 text-slate-100'
                                  }`}
                                />
                                <button
                                  type="submit"
                                  disabled={plansChatLoading || !plansChatMessageInput.trim()}
                                  className={`p-2 rounded-xl text-white flex items-center justify-center shrink-0 cursor-pointer ${
                                    plansChatLoading || !plansChatMessageInput.trim()
                                      ? 'bg-slate-300 dark:bg-slate-850 text-slate-450 dark:text-slate-505'
                                      : 'bg-amber-500 hover:bg-amber-600 hover:shadow transform hover:scale-105'
                                  }`}
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </form>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : activeRightPanel === "spellcheck" ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden font-sans">
                {/* PAGE SELECTION CONTAINER */}
                <div className="p-3 border-b border-rose-500/10 bg-rose-50/10 dark:bg-rose-955/10 space-y-2 select-none shrink-0 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] uppercase font-mono font-extrabold tracking-wider text-rose-600 dark:text-rose-350">Analyse de l'orthographe :</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-[9px] text-rose-700 dark:text-rose-300 font-bold uppercase font-mono">
                      {checkingScope === "active" ? "Page active" : checkingScope === "all" ? "Ficher total" : "Perso"}
                    </span>
                  </div>
                  
                  <div className="flex gap-1 font-sans">
                    <button
                      onClick={() => {
                        setCheckingScope("active");
                        const active = activePageId;
                        setSelectedPageIdsForChecking([active]);
                        triggerCheckSplit([active]);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-sans font-extrabold transition-all cursor-pointer ${
                        checkingScope === "active" 
                          ? "bg-rose-600 text-white shadow-sm" 
                          : "bg-slate-100 text-slate-655 hover:bg-slate-200 dark:bg-slate-805 dark:text-slate-350"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => {
                        setCheckingScope("all");
                        const allIds = pages.filter(p => p.type !== "cover").map(p => p.id);
                        setSelectedPageIdsForChecking(allIds);
                        triggerCheckSplit(allIds);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-sans font-extrabold transition-all cursor-pointer ${
                        checkingScope === "all" 
                          ? "bg-rose-600 text-white shadow-sm" 
                          : "bg-slate-100 text-slate-655 hover:bg-slate-200 dark:bg-slate-805 dark:text-slate-350"
                      }`}
                    >
                      Toutes ({pages.filter(p => p.type !== "cover").length})
                    </button>
                    <button
                      onClick={() => {
                        setCheckingScope("custom");
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-sans font-extrabold transition-all cursor-pointer ${
                        checkingScope === "custom" 
                          ? "bg-rose-600 text-white shadow-sm" 
                          : "bg-slate-100 text-slate-655 hover:bg-slate-200 dark:bg-slate-805 dark:text-slate-350"
                      }`}
                    >
                      Choix...
                    </button>
                  </div>

                  {checkingScope === "custom" && (
                    <div className="pt-2 border-t border-rose-500/15 grid grid-cols-2 gap-1.5 max-h-[100px] overflow-y-auto pr-1 select-none">
                      {pages.map((p, idx) => {
                        if (p.type === "cover") return null;
                        const isChecked = selectedPageIdsForChecking.includes(p.id);
                        return (
                          <label 
                            key={p.id} 
                            className={`flex items-center gap-1.5 p-1 rounded-lg text-[10px] cursor-pointer font-sans transition-colors ${
                              isChecked ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                let newList = [...selectedPageIdsForChecking];
                                if (isChecked) {
                                  newList = newList.filter(id => id !== p.id);
                                } else {
                                  newList.push(p.id);
                                }
                                setSelectedPageIdsForChecking(newList);
                              }}
                              className="rounded text-rose-600 focus:ring-rose-550 w-3.5 h-3.5 cursor-pointer accent-rose-600"
                            />
                            <span className="truncate max-w-[90px]" title={p.title || `p. ${idx + 1}`}>
                              p.{idx + 1} {p.title}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {checkingScope === "custom" && (
                    <button
                      onClick={() => {
                        if (selectedPageIdsForChecking.length === 0) {
                          alert("Veuillez sélectionner au moins une page.");
                          return;
                        }
                        triggerCheckSplit(selectedPageIdsForChecking);
                      }}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-950 dark:bg-rose-950/45 dark:hover:bg-rose-900 text-white dark:text-rose-100 rounded-xl text-[10px] font-mono tracking-wider font-bold transition-all uppercase cursor-pointer"
                    >
                      Lancer l'analyse ({selectedPageIdsForChecking.length})
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
                  {isSpellCheckingLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-3 select-none">
                      <div className="w-8 h-8 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
                      <span className="text-xs font-mono font-bold text-slate-450 animate-pulse">Saisie en cours de vérification...</span>
                    </div>
                  ) : spellErrors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-2 select-none">
                      <div className="text-3xl">🎉</div>
                      <span className="text-xs font-extrabold text-emerald-500 font-sans">Zéro anomalie détectée !</span>
                      <p className="text-[10.5px] text-slate-455 font-medium leading-relaxed max-w-[200px] font-sans">Votre texte est d'une rigueur académique irréprochable.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-slate-400 pb-1.5 border-b border-rose-100 dark:border-white/5 flex items-center justify-between select-none">
                        <span>Anomalies détectées ({spellErrors.length})</span>
                        <span className="text-rose-500">Cliquables</span>
                      </div>
                      
                      {spellErrors.map((err, i) => (
                        <div 
                           key={i}
                           onClick={() => {
                             setSelectedSplitMistake(selectedSplitMistake === err.mistake ? null : err.mistake);
                             setTimeout(() => {
                               const typoEl = document.getElementById("temp-highlight-marker");
                               if (typoEl) {
                                 typoEl.scrollIntoView({ behavior: "smooth", block: "center" });
                               }
                             }, 100);
                           }}
                           className={`p-3 rounded-xl border text-xs cursor-pointer transition-all duration-300 relative group flex flex-col gap-2 ${
                             selectedSplitMistake === err.mistake 
                               ? 'bg-rose-50 border-rose-400 dark:bg-rose-950/20 dark:border-rose-550 ring-2 ring-rose-550/20 shadow-sm' 
                               : 'bg-white/45 border-slate-200/50 hover:bg-slate-100/30 dark:bg-slate-950/20 dark:border-white/5'
                           }`}
                        >
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950/50 text-red-650 dark:text-red-400 font-extrabold border border-red-200/40 text-[10.5px] line-through decoration-red-500/70">
                              {err.mistake}
                            </span>
                            
                            <span className="text-slate-400 font-mono text-[9px] select-none">⟶</span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCorrectMistake(err.mistake, err.correction);
                              }}
                              className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/50 hover:bg-emerald-250/30 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200/40 text-[10.5px] cursor-pointer transition-colors shadow-sm flex items-center gap-0.5"
                              title="Appliquer cette correction immédiatement"
                            >
                              <span>{err.correction}</span>
                              <Check className="w-3 h-3 text-emerald-500" />
                            </button>
                          </div>

                          <div className="text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 pl-1 border-l-2 border-slate-300 dark:border-white/15 italic font-sans">
                            {err.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-955/25 border-t border-slate-200/10 text-center shrink-0 select-none">
                  <button
                    onClick={() => {
                      let updatedPages = [...pages];
                      spellErrors.forEach(err => {
                        const escapedMistake = err.mistake.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                        const regex = new RegExp(`(?<!<[^>]*)(${escapedMistake})(?![^<]*>)`, 'gi');
                        
                        updatedPages = updatedPages.map(p => {
                          if (selectedPageIdsForChecking.includes(p.id)) {
                            return {
                              ...p,
                              content: p.content.replace(regex, err.correction)
                            };
                          }
                          return p;
                        });
                      });

                      setPages(updatedPages);
                      setSpellErrors([]);
                      setSelectedSplitMistake(null);
                    }}
                    disabled={spellErrors.length === 0 || isSpellCheckingLoading}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-mono tracking-wide transition-all shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Corriger toutes les anomalies</span>
                  </button>
                </div>
              </div>
            ) : activeRightPanel === "formatting" ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-5 font-sans">
                {/* Tip */}
                <div className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium select-none">
                  ✍️ <strong>Mise en Forme</strong>. Sélectionnez du texte dans l'éditeur puis appliquez vos styles académiques en temps réel.
                </div>

                {/* Font family selection */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-450 dark:text-slate-400 uppercase select-none">Police de caractère :</label>
                  <div className="flex items-center border rounded-xl overflow-hidden border-slate-200/60 dark:border-white/5 bg-slate-950/5 dark:bg-slate-950/25 px-2 py-1.5">
                    <select 
                      className={`w-full bg-transparent text-xs outline-none font-semibold cursor-pointer ${isLight ? 'text-slate-800' : 'text-slate-200 bg-slate-900'}`}
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                    >
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Arial">Arial Black</option>
                      <option value="Courier New">Courier Mono</option>
                      <option value="Georgia">Georgia Elegant</option>
                    </select>
                  </div>
                </div>

                {/* Font size selection */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-450 dark:text-slate-400 uppercase select-none">Taille de police :</label>
                  <div className="flex items-center border rounded-xl overflow-hidden border-slate-200/60 dark:border-white/5 bg-slate-950/5 dark:bg-slate-950/25 px-2 py-1.5">
                    <select 
                      className={`w-full bg-transparent text-xs outline-none font-semibold cursor-pointer ${isLight ? 'text-slate-800' : 'text-slate-200 bg-slate-900'}`}
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                    >
                      <option value="16px">16 px (Style Universitaire par défaut)</option>
                      <option value="13px">13 px (Style Universitaire condensé)</option>
                      <option value="12px">12 px (Style Universitaire serré)</option>
                    </select>
                  </div>
                </div>

                {/* Basic style formats */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-450 dark:text-slate-400 uppercase select-none">Style typographique :</label>
                  <div className="flex items-center justify-between gap-1.5 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-950/5 dark:bg-slate-950/25 p-1">
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); handleFormat("bold"); }} 
                      className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-655 dark:text-slate-300 cursor-pointer transition-colors flex-1 flex justify-center items-center gap-1.5 font-bold" 
                      title="Gras"
                    >
                      <Bold className="w-4 h-4 text-blue-500" />
                      <span className="text-[10px]">Gras</span>
                    </button>
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); handleFormat("italic"); }} 
                      className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-655 dark:text-slate-300 cursor-pointer transition-colors flex-1 flex justify-center items-center gap-1.5 italic" 
                      title="Italique"
                    >
                      <Italic className="w-4 h-4 text-blue-500" />
                      <span className="text-[10px]">Italique</span>
                    </button>
                    <button 
                      onMouseDown={(e) => { e.preventDefault(); handleFormat("underline"); }} 
                      className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-655 dark:text-slate-300 cursor-pointer transition-colors flex-1 flex justify-center items-center gap-1.5 underline" 
                      title="Souligné"
                    >
                      <Underline className="w-4 h-4 text-blue-500" />
                      <span className="text-[10px]">Souligné</span>
                    </button>
                  </div>
                </div>

                {/* Alignment */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-450 dark:text-slate-400 uppercase select-none">Alignement du paragraphe :</label>
                  <div className="flex items-center justify-between w-full rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-950/5 dark:bg-slate-950/25 p-1">
                    <button onMouseDown={(e) => { e.preventDefault(); handleFormat("justifyLeft"); }} className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-655 dark:text-slate-300 cursor-pointer flex-1 flex justify-center" title="Gauche">
                      <AlignLeft className="w-4 h-4" />
                    </button>
                    <button onMouseDown={(e) => { e.preventDefault(); handleFormat("justifyCenter"); }} className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-655 dark:text-slate-300 cursor-pointer flex-1 flex justify-center" title="Centrer">
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button onMouseDown={(e) => { e.preventDefault(); handleFormat("justifyRight"); }} className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-655 dark:text-slate-300 cursor-pointer flex-1 flex justify-center" title="Droite">
                      <AlignRight className="w-4 h-4" />
                    </button>
                    <button onMouseDown={(e) => { e.preventDefault(); handleFormat("justifyFull"); }} className="p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-655 dark:text-slate-300 cursor-pointer flex-1 flex justify-center" title="Justifier">
                      <AlignJustify className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Color selections */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono font-bold text-slate-450 dark:text-slate-400 uppercase select-none">Couleur d'écriture :</label>
                  <div className="grid grid-cols-4 gap-2.5 p-3 rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-950/5 dark:bg-slate-950/25">
                    {colorPresets.map(p => (
                      <button
                        key={p.value}
                        onClick={() => handleColorChange(p.value)}
                        className="h-8 rounded-lg border border-white/15 transition-transform hover:scale-105 active:scale-95 cursor-pointer relative flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: p.value }}
                        title={p.name}
                      >
                        {textColor === p.value && <Check className="w-4 text-white drop-shadow-md" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeRightPanel === "options" ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-5 font-sans">
                {/* Title option */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-450 dark:text-slate-400 uppercase select-none">Titre du document :</label>
                  <div className="flex items-center gap-2 rounded-xl px-3 py-2 border border-slate-200/60 dark:border-white/5 bg-slate-950/5 dark:bg-slate-950/20 text-xs">
                    <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                    <input 
                      type="text" 
                      value={docTitle} 
                      onChange={(e) => setDocTitle(e.target.value)} 
                      className={`bg-transparent border-none outline-none font-semibold w-full font-sans ${isLight ? 'text-slate-800' : 'text-slate-200'}`} 
                      placeholder="Nom du document"
                    />
                  </div>
                </div>

                {/* Note Insertion */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[10px] font-mono font-bold text-slate-455 dark:text-slate-400 uppercase select-none">Notes de bas de page :</label>
                  <button
                    onMouseDown={(e) => { e.preventDefault(); insertWordStyleFootnote(); }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-blue-500/10"
                    title="Insérer une note de bas de page (Ctrl+Alt+F)"
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current text-white shrink-0" />
                    <span>+ Insérer une note</span>
                    <span className="text-[9px] bg-blue-800 text-blue-150 px-1 py-0.2 rounded font-mono select-none">Ctrl+Alt+F</span>
                  </button>

                  <div className="flex items-center border rounded-xl overflow-hidden border-slate-200/60 dark:border-white/5 bg-slate-950/5 dark:bg-slate-950/20 px-2 py-2">
                    <select 
                      className={`w-full bg-transparent text-xs outline-none font-semibold cursor-pointer ${isLight ? 'text-slate-800' : 'text-slate-200 bg-slate-900'}`}
                      value={footnoteNumberingMode}
                      onChange={(e) => {
                        const m = e.target.value as any;
                        setFootnoteNumberingMode(m);
                        setTimeout(() => runSequenceRenumbering(), 20);
                      }}
                      title="Mode de numérotation des notes de bas de page"
                    >
                      <option value="continuous">🔢 Numérotation Continu</option>
                      <option value="restart-each-page">🔄 Recommencer par page</option>
                      <option value="alphabetical-lowercased">🔤 Alphabet (a, b, c)</option>
                    </select>
                  </div>
                </div>

                {/* History Undo / Redo */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-slate-455 dark:text-slate-400 uppercase select-none">Historique d'édition :</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={handleUndo}
                      disabled={!canUndo}
                      className={`py-2 rounded-xl border flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow font-mono text-[10.5px] font-bold ${
                        !canUndo 
                          ? "opacity-35 cursor-not-allowed pointer-events-none border-dashed bg-slate-900/5 text-slate-400 dark:text-slate-600" 
                          : isLight 
                            ? "bg-white border-slate-200 hover:bg-slate-100 text-slate-850 shadow-sm" 
                            : "bg-slate-800 border-white/5 hover:bg-slate-750 text-slate-200 shadow-md"
                      }`}
                      title={canUndo ? "Annuler l'action précédente (Ctrl+Z)" : "Rien à annuler"}
                    >
                      <Undo className={`w-3.5 h-3.5 text-blue-500 ${canUndo ? "animate-pulse" : ""}`} />
                      <span>Undo</span>
                    </button>

                    <button
                      onClick={handleRedo}
                      disabled={!canRedo}
                      className={`py-2 rounded-xl border flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow font-mono text-[10.5px] font-bold ${
                        !canRedo 
                          ? "opacity-35 cursor-not-allowed pointer-events-none border-dashed bg-slate-900/5 text-slate-400 dark:text-slate-600" 
                          : isLight 
                            ? "bg-white border-slate-200 hover:bg-slate-100 text-slate-850 shadow-sm" 
                            : "bg-slate-800 border-white/5 hover:bg-slate-750 text-slate-200 shadow-md"
                      }`}
                      title={canRedo ? "Rétablir l'action (Ctrl+Y / Ctrl+Shift+Z)" : "Rien à rétablir"}
                    >
                      <Redo className={`w-3.5 h-3.5 text-emerald-500 ${canRedo ? "animate-pulse" : ""}`} />
                      <span>Redo</span>
                    </button>

                    <button
                      onClick={handleResetDocument}
                      className={`py-2 rounded-xl border flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105 active:scale-95 text-slate-550 hover:text-rose-500 text-[10px] font-bold ${
                        isLight ? 'bg-white border-slate-200 hover:bg-rose-50/20' : 'bg-slate-800 border-white/5 hover:bg-rose-950/10'
                      }`}
                      title="Restaurer l'original"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Verification & Download */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[10px] font-mono font-bold text-slate-455 dark:text-slate-400 uppercase select-none">Analyse & Export :</label>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={triggerCheckSplit}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 cursor-pointer select-none transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-rose-500/10"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                      <span>Lancer Check Split (Vérificateur)</span>
                    </button>

                    <button
                      onClick={triggerDownloadDoc}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 cursor-pointer select-none transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-blue-500/10"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger (.TXT)</span>
                    </button>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-[10px] font-mono px-3 py-2 rounded-xl uppercase font-extrabold shrink-0 flex items-center justify-center gap-1.5 select-none">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>NORMES A4 WORD ACADÉMIQUES</span>
                    </div>
                  </div>
                </div>

                {/* Zoom options */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[10px] font-mono font-bold text-slate-455 dark:text-slate-400 uppercase select-none">Zoom du document :</label>
                  <div className={`flex items-center justify-between p-1.5 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/30 border-white/5'}`}>
                    <button
                      type="button"
                      onClick={() => setDocumentZoom(prev => Math.max(30, prev - 10))}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-slate-200 text-slate-755' : 'hover:bg-white/5 text-slate-300'
                      }`}
                      title="Zoom arrière"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    
                    <span className={`text-xs font-mono font-extrabold select-none min-w-[34px] text-center ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      {documentZoom}%
                    </span>

                    <button
                      type="button"
                      onClick={() => setDocumentZoom(prev => Math.min(200, prev + 10))}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        isLight ? 'hover:bg-slate-200 text-slate-755' : 'hover:bg-white/5 text-slate-300'
                      }`}
                      title="Zoom avant"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1"></div>

                    <button
                      type="button"
                      onClick={() => setDocumentZoom(100)}
                      className={`text-[9.5px] font-sans font-extrabold px-2 py-1 rounded transition-all cursor-pointer ${
                        documentZoom === 100 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : isLight 
                            ? 'hover:bg-slate-100 text-slate-655' 
                            : 'hover:bg-white/5 text-slate-450'
                      }`}
                    >
                      100%
                    </button>

                    <button
                      type="button"
                      onClick={() => setDocumentZoom(65)}
                      className={`text-[9.5px] font-sans font-extrabold px-2 py-1 rounded transition-all cursor-pointer ${
                        documentZoom === 65 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : isLight 
                            ? 'hover:bg-slate-100 text-slate-655' 
                            : 'hover:bg-white/5 text-slate-450'
                      }`}
                    >
                      Page
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </aside>
        )}

        {/* MAIN PANEL CONTENT */}
        {showAIMentor ? (
          <AIMentorMap onBackToEditor={() => setShowAIMentor(false)} isLight={isLight} />
        ) : showPresentationMaker ? (
          <PresentationMaker onBackToEditor={() => setShowPresentationMaker(false)} isLight={isLight} />
        ) : showPfeHub ? (
          <PfeHubWorkspace onBackToEditor={() => setShowPfeHub(false)} isLight={isLight} />
        ) : (
          <main className="flex-1 flex flex-col overflow-hidden bg-transparent relative">

          {/* WORD PAGE WORKSPACE SPLIT WRAPPER FOR SPELLING LAUNCH */}
          <div className="flex-1 flex overflow-hidden">

            {/* MULTI PAGE CONTAINER SCROLLER */}
            <div className="flex-1 p-6 overflow-auto bg-slate-900/15 flex flex-col items-center" id="editor_page_viewport">
              
              {/* Scaled Workspace Canvas */}
              <div 
                style={{
                  transform: `scale(${documentZoom / 100})`,
                  transformOrigin: "top center",
                  width: "100%",
                  maxWidth: "800px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  willChange: "transform",
                } as React.CSSProperties}
                className="space-y-8 origin-top"
              >
            
            {/* IN FRONT OF FIRST PAGE INSERT BUTTON Divider */}
            <div className="group/divider h-6 w-full max-w-[800px] flex items-center justify-center relative">
              <div className="absolute inset-x-0 h-px bg-blue-500/30 opacity-0 group-hover/divider:opacity-100 transition-opacity"></div>
              <button
                onClick={() => handleInsertPage(0)}
                className="z-10 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md transition-all scale-90 opacity-0 group-hover/divider:opacity-100 group-hover/divider:scale-100 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Insérer une page blanche au tout début</span>
              </button>
            </div>

            {computedPagesList.map((page, index) => (
              <React.Fragment key={page.id}>
                
                {/* PAGE WRAPPER CARD */}
                <div 
                  id={`page_bed_${page.id}`}
                  onClick={() => setActivePageId(page.id)}
                  className={`w-full max-w-[800px] flex flex-col transition-all duration-350 rounded-xl cursor-default ${
                    activePageId === page.id 
                      ? 'ring-4 ring-emerald-500/80 ring-offset-4 ring-offset-slate-950 shadow-2xl scale-[1.008]' 
                      : 'hover:shadow-lg'
                  }`}
                >
                  
                  {/* Page header controller toolbar */}
                  <div className={`flex items-center justify-between px-4 py-2 border rounded-t-xl text-xs select-none transition-all duration-300 ${
                    activePageId === page.id 
                      ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-200' 
                      : 'bg-blue-600/10 border-blue-500/10 text-slate-400'
                  }`}>
                    <span className="font-mono font-bold flex items-center gap-1">
                      <FileText className={`w-3.5 h-3.5 ${activePageId === page.id ? 'text-emerald-400 animate-pulse' : 'text-blue-500'}`} />
                      Page {index + 1} • {page.title}
                      {activePageId === page.id && (
                        <span className="ml-2.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-500 text-slate-950 animate-pulse">
                          ✍️ Saisie active (Note AFNOR)
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-semibold px-2 py-0.5 rounded transition-colors ${
                        activePageId === page.id 
                          ? 'text-emerald-300 bg-emerald-500/20' 
                          : 'text-blue-500 bg-blue-500/10'
                      }`}>
                        {page.pageNum ? `p. ${page.pageNum}` : "Couverture"}
                      </span>
                      {page.isCustom ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeletePage(page.id); }}
                          className="text-rose-400 hover:text-rose-600 font-bold px-1 rounded hover:bg-rose-500/10 cursor-pointer"
                          title="Supprimer la page blanche"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Norme AFNOR</span>
                      )}
                    </div>
                  </div>

                  {/* VOICE ASSISTANT SUB-HEADER CONTROLS */}
                  {activePageId === page.id && (
                    <div className={`px-4 py-2.5 text-xs border-x flex flex-wrap items-center justify-between gap-3 animate-fadeIn ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-750' 
                        : 'bg-slate-900/80 border-white/5 text-slate-200'
                    }`} id="page_voice_sub_header">
                      
                      <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDocAiVoiceActive || isDocListening ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
                          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isDocAiVoiceActive || isDocListening ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        </span>
                        <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                          🎙️ Assistant Vocal :
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* 1. READ PAGE - TTS */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); readActivePageText(); }}
                          className={`px-3 py-1.5 rounded-xl text-[10.5px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all select-none ${
                            isDocReading
                              ? 'bg-rose-500 text-white animate-pulse'
                              : isLight
                                ? 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                                : 'bg-slate-800 hover:bg-slate-750 border border-white/5 text-slate-205'
                          }`}
                          title="Faire lire le document en français (Text-to-Speech)"
                        >
                          {isDocReading ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              <span>Arrêter la lecture (TTS)</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-blue-500" />
                              <span>Lire en Français 🔊</span>
                            </>
                          )}
                        </button>

                        {/* 2. DIRECT DICTATION - STT */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleDocListening(); }}
                          className={`px-3 py-1.5 rounded-xl text-[10.5px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all select-none ${
                            isDocListening
                              ? 'bg-rose-600 text-white animate-bounce shadow-md border border-rose-500'
                              : isLight
                                ? 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                                : 'bg-slate-800 hover:bg-slate-750 border border-white/5 text-slate-205'
                          }`}
                          title="Dicter du texte directement dans la page (Saisie vocale continue)"
                        >
                          <Mic className={`w-3.5 h-3.5 ${isDocListening ? 'animate-pulse text-white' : 'text-emerald-500'}`} />
                          <span>{isDocListening ? 'Écoute active...' : 'Saisie Vocale Directe 🎙️'}</span>
                        </button>

                        {/* 3. INTERACTIVE AI VOICE ASSISTANT (FILL DOCUMENT AUTOMATICALLY FROM SPOKEN COMMAND) */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); toggleDocAiVoiceAssistant(); }}
                          disabled={docAiVoiceLoading}
                          className={`px-3 py-1.5 rounded-xl text-[10.5px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all select-none ${
                            isDocAiVoiceActive
                              ? 'bg-blue-600 text-white animate-pulse shadow-md'
                              : docAiVoiceLoading
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : isLight
                                  ? 'bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold'
                                  : 'bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 font-bold'
                          }`}
                          title="Demandez oralement à Scrivya de rédiger tout sujet (Remplissage intelligent automatique)"
                        >
                          {docAiVoiceLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                              <span>Rédaction Scrivya en cours...</span>
                            </>
                          ) : isDocAiVoiceActive ? (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
                              <span>Parler maintenant... ⏳</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                              <span>Remplissage Vocal par IA ✨</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  )}

                  {/* OUTSIDE REDACTION NOTICE: NOT WRITTEN TO DOCUMENT AS TEXT */}
                  {page.type === "cover" && (() => {
                    const notice = getCoverNotice();
                    return (
                      <div className={`mx-6 mt-4 p-4 border rounded-2xl flex items-start gap-3.5 shadow-md animate-fadeIn select-none ${
                        isLight 
                          ? 'bg-amber-50 border-amber-200/80 text-slate-700' 
                          : 'bg-amber-950/40 border-amber-700/30 text-amber-200'
                      }`}>
                        <div className="bg-amber-500 text-slate-950 p-1 px-2 rounded-xl text-[9px] font-mono font-bold uppercase tracking-wider shrink-0 mt-0.5 shadow-sm">
                          {notice.badge}
                        </div>
                        <div className="text-xs font-serif leading-relaxed w-full">
                          <div className="font-mono font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                            <span>{notice.title}</span>
                          </div>
                          <div className="font-medium mt-1.5 space-y-1">
                            <p>{notice.redText}</p>
                            <p>{notice.greenText}</p>
                          </div>
                          <p className="text-[10.5px] text-slate-400 dark:text-slate-500 font-mono mt-2 leading-tight italic">{notice.footer}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* WHITE WORD PAPER REPICA */}
                  <div 
                    style={{ 
                      fontFamily, 
                      "--document-font-size": fontSize
                    } as React.CSSProperties}
                    className="academic-document-page w-full min-h-[1050px] shadow-xl bg-white text-slate-800 pt-16 pb-24 px-16 border-x border-b border-slate-200 relative flex flex-col justify-between"
                  >
                    
                    {/* Running Header Info Removed */}

                    {/* CONTENT CANVAS */}
                    <div className="flex-1 mt-8">
                      
                      {/* RENDER COVER PAGE EXACT REPLICA OF THE FIRST PDF STEP */}
                      {page.type === "cover" ? (
                        <div className="flex flex-col justify-between h-full font-serif text-slate-800 text-center select-text relative">
                          
                          {/* Scale of Carthage Logo Header - USER CAN CLICK TO UPLOAD THEIRS AT SAME SIZE */}
                          <div className="space-y-1.5">
                            <div 
                              onClick={handleLogoUploadClick}
                              onPaste={(e) => {
                                const items = e.clipboardData?.items;
                                if (items) {
                                  for (let i = 0; i < items.length; i++) {
                                    if (items[i].type.indexOf("image") !== -1) {
                                      const file = items[i].getAsFile();
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          if (event.target?.result) {
                                            setUploadedLogo(event.target.result as string);
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                        break;
                                      }
                                    }
                                  }
                                }
                              }}
                              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                              onDrop={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                const file = e.dataTransfer.files?.[0];
                                if (file && file.type.startsWith("image/")) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    if (event.target?.result) {
                                      setUploadedLogo(event.target.result as string);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className={hideCoverGuides 
                                ? "group/logo min-w-[12rem] max-w-[18rem] min-h-[4rem] mx-auto mb-3 flex items-center justify-center p-2 cursor-pointer relative"
                                : "group/logo min-w-[12rem] max-w-[18rem] min-h-[4rem] mx-auto mb-3 bg-blue-50/20 hover:bg-emerald-50 rounded-xl border border-blue-200 hover:border-emerald-400 flex items-center justify-center p-2 cursor-pointer transition-all duration-300 relative shadow-sm"
                              }
                              title="Cliquer, glisser-déposer ou coller (Ctrl+V) pour insérer ou modifier le logo de votre faculté"
                            >
                              {(uploadedLogo && uploadedLogo !== "skipped") ? (
                                <img 
                                  src={uploadedLogo} 
                                  alt="Logo Universitaire" 
                                  referrerPolicy="no-referrer"
                                  className="h-12 max-w-full object-contain"
                                />
                              ) : (
                                <span className="text-[10px] text-slate-500 font-sans italic px-2 block leading-snug">
                                  veuillez insérer le logo de votre faculté ici
                                </span>
                              )}
                              
                              {!hideCoverGuides && (
                                <div className="absolute inset-0 bg-slate-950/40 rounded-xl opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity duration-200">
                                  <Plus className="w-4 h-4 text-white" />
                                </div>
                              )}

                              <input 
                                type="file"
                                ref={logoInputRef}
                                onChange={handleLogoFileChange}
                                accept="image/*"
                                className="hidden"
                              />
                            </div>
                            
                            {/* République tunisienne, ministère, université de carthage, FSJPST Centered 13px Text */}
                            <div className="text-[13px] font-bold text-slate-900 tracking-wide uppercase">
                              {cover.republique}
                            </div>
                            <div className="text-[13px] text-slate-900 font-semibold max-w-xl mx-auto leading-normal">
                              {cover.ministere}
                            </div>
                            <div className="text-[13px] font-bold text-slate-900 tracking-wide">
                              {cover.universite}
                            </div>
                            <div className="text-[13px] font-bold text-slate-900 tracking-wide leading-relaxed">
                              {cover.faculte}
                            </div>
                          </div>

                          {/* Master title section */}
                          <div className="my-8 space-y-1.5 py-1">
                            <div className="text-[13px] font-bold text-slate-900 tracking-wider uppercase font-serif text-center leading-normal">
                              {cover.mastere}
                            </div>
                            <div className="max-w-xl mx-auto">
                              <input 
                                type="text"
                                id="input_mastereRed"
                                value={cover.mastereRed}
                                onChange={(e) => setCover({ ...cover, mastereRed: e.target.value })}
                                className="text-center font-bold text-slate-900 text-[13px] tracking-wider bg-transparent border-none outline-none w-full uppercase focus:ring-0 leading-normal p-0 h-auto cursor-pointer"
                                placeholder="RECHERCHE EN DROIT PUBLIC INTERNE"
                              />
                            </div>
                          </div>

                          {/* BIG Nom du mémoire input editable - Red text centered */}
                          <div className="my-8 py-1">
                            <div className="relative group/title">
                              <input 
                                type="text"
                                id="input_nomMemoire"
                                value={cover.nomMemoire}
                                onChange={(e) => setCover({ ...cover, nomMemoire: e.target.value })}
                                className="text-center font-bold text-slate-900 text-2xl tracking-normal bg-transparent border-none outline-none focus:ring-0 w-full font-serif text-center p-0 h-auto cursor-pointer"
                                placeholder="Ecrire le nom de mémoire..."
                              />
                            </div>
                          </div>

                          {/* Standard Elaboré par / Sous la direction layout - Label is bold black 13px, Value is bold red 13px */}
                          <div className="grid grid-cols-2 gap-8 my-8 text-left max-w-xl mx-auto w-full">
                            <div className="space-y-1 text-xs">
                              <span className="block font-bold text-slate-900 text-[13px] font-serif leading-none">
                                Elaboré et soutenu par :
                              </span>
                              <div className="relative group/soutenu">
                                <input 
                                  type="text"
                                  id="input_soutenuPar"
                                  value={cover.soutenuPar}
                                  onChange={(e) => setCover({ ...cover, soutenuPar: e.target.value })}
                                  className="text-slate-900 font-bold bg-transparent border-none outline-none focus:ring-0 w-full font-serif p-0 h-auto text-[13px] cursor-pointer"
                                  placeholder="Esm telmidh"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1 text-xs pl-5 border-l border-slate-150">
                              <span className="block font-bold text-slate-900 text-[13px] font-serif leading-none">
                                Sous la direction de :
                              </span>
                              <div className="relative group/sousdir">
                                <input 
                                  type="text"
                                  id="input_sousDirection"
                                  value={cover.sousDirection}
                                  onChange={(e) => setCover({ ...cover, sousDirection: e.target.value })}
                                  className="text-slate-900 font-bold bg-transparent border-none outline-none focus:ring-0 w-full font-serif p-0 h-auto text-[13px] cursor-pointer"
                                  placeholder="nom de l'encadrant(e)"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Jury Section in exact order of the uploaded image - vertical list on left, annotation box on right */}
                          <div className="my-8 max-w-xl mx-auto w-full flex justify-between items-start">
                            
                            {/* Jury list layout */}
                            <div className="text-left space-y-1">
                              <span className="text-[13px] font-bold text-slate-900 block select-none uppercase tracking-wide underline font-serif">
                                Jury :
                              </span>
                              
                              <div className="space-y-2 pt-2 pl-4 font-serif text-[13px]">
                                
                                {/* Président row */}
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900">Président :</span>
                                  <input 
                                    type="text"
                                    value={cover.president}
                                    onChange={(e) => setCover({ ...cover, president: e.target.value })}
                                    className="text-slate-900 font-bold bg-transparent border-none outline-none focus:ring-0 font-serif text-[13px] p-0 h-auto w-36 cursor-pointer"
                                  />
                                </div>

                                {/* Rapporteur row */}
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900">Rapporteur :</span>
                                  <input 
                                    type="text"
                                    value={cover.rapporteur}
                                    onChange={(e) => setCover({ ...cover, rapporteur: e.target.value })}
                                    className="text-slate-900 font-bold bg-transparent border-none outline-none focus:ring-0 font-serif text-[13px] p-0 h-auto w-36 cursor-pointer"
                                  />
                                </div>

                                {/* Directeur row */}
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900">Directeur :</span>
                                  <input 
                                    type="text"
                                    value={cover.directeur}
                                    onChange={(e) => setCover({ ...cover, directeur: e.target.value })}
                                    className="text-slate-900 font-bold bg-transparent border-none outline-none focus:ring-0 font-serif text-[13px] p-0 h-auto w-36 cursor-pointer"
                                  />
                                </div>

                              </div>
                            </div>

                          </div>

                          {/* Footer details (Année Universitaire) - label is bold black 13px, value is bold black 13px */}
                          <div className="mt-12 mb-6">
                            <div className="text-[13px] font-sans flex items-center justify-center gap-1.5 text-slate-900 font-bold">
                              <span>Année Universitaire :</span>
                              <div className="relative flex items-center gap-2">
                                <input 
                                  type="text"
                                  value={cover.annee}
                                  onChange={(e) => setCover({ ...cover, annee: e.target.value })}
                                  className="text-slate-900 font-bold bg-transparent border-none outline-none focus:ring-0 w-36 text-center font-serif text-[13px] p-0 h-auto cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Floating Completion Status Panel on bottom right */}
                          <div className="absolute bottom-4 right-1 flex items-center gap-2 select-none z-20">
                            <button
                              id="btn_cover_done_toggle"
                              onClick={() => setHideCoverGuides(!hideCoverGuides)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-sans text-xs font-bold transition-all shadow shadow-slate-200/50 active:scale-95 ${
                                hideCoverGuides
                                  ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-950"
                                  : "bg-slate-900 border-slate-800 text-white hover:bg-slate-950"
                              }`}
                              title="Masquer ou afficher l'aide à la saisie colorée (🔴/🟢)"
                            >
                              <span className="flex h-2 w-2 relative">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${hideCoverGuides ? "bg-slate-300" : "bg-slate-400"}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${hideCoverGuides ? "bg-slate-400" : "bg-emerald-400"}`}></span>
                              </span>
                              <span>
                                {hideCoverGuides ? "Guides Masqués" : "M'appliquer (Done!)"}
                              </span>
                            </button>
                          </div>

                        </div>
                      ) : (
                        
                        /* RENDER STANDARD EDITABLE PAGE SECTIONS */
                        <div className="flex flex-col h-full justify-between animate-fadeIn">
                          <EditablePageContent
                            pageId={page.id}
                            initialContent={page.content}
                            onBlur={handlePageBlur}
                            fontSize={fontSize}
                            fontFamily={fontFamily}
                            textColor={textColor}
                            onFocus={() => setActivePageId(page.id)}
                            onSuggestFootnote={handleSuggestFootnote}
                            onDismissSuggestion={handleDismissSuggestion}
                            selectedSplitMistake={spellCheckedPageId === page.id ? selectedSplitMistake : null}
                            spellErrors={spellErrors}
                            onCorrectMistake={handleCorrectMistake}
                          />

                          {/* DYNAMIC BIBLIOGRAPHY DISPLAY FOR BIBLIOGRAPHIE PAGES */}
                          {(page.type === "bibliographie" || page.title.toLowerCase().includes("biograph") || page.title.toLowerCase().includes("bibliograph")) && (
                            <div className="mt-8 pt-6 border-t border-slate-200 select-none text-left font-serif">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                                Sources et Ouvrages Référencés (Auto AFNOR) :
                              </h3>
                              {footnotes.length === 0 ? (
                                <p className="text-xs text-slate-450 italic">Aucune note de bas de page ou source compilée pour le moment.</p>
                              ) : (
                                <div className="space-y-2.5">
                                  {getUniqueSources(footnotes).sort((a, b) => (a.author || "").localeCompare(b.author || "")).map((fn, idx) => {
                                    const badgeInfo = {
                                      book: { bg: "bg-blue-50 border-blue-200/50 text-blue-700", label: "Livre" },
                                      article: { bg: "bg-emerald-50 border-emerald-200/50 text-emerald-700", label: "Article de Revue" },
                                      thesis: { bg: "bg-purple-50 border-purple-200/50 text-purple-700", label: "Mémoire / Thèse" },
                                      law: { bg: "bg-amber-50 border-amber-200/50 text-amber-700", label: "Législation" },
                                      web: { bg: "bg-cyan-50 border-cyan-200/50 text-cyan-700", label: "Site Web" },
                                      custom: { bg: "bg-slate-50 border-slate-200/50 text-slate-700", label: "Note Libre" }
                                    }[fn.sourceKind || "book"] || { bg: "bg-slate-50 border-slate-200/50 text-slate-700", label: "Note Libre" };

                                    return (
                                      <div key={fn.id} id={`bib-item-${fn.id}`} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-emerald-500/5 hover:border-emerald-300 border border-dashed border-slate-200 transition-all duration-300">
                                        <span className="font-mono text-[10px] text-slate-400 font-bold">{idx + 1}.</span>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs text-slate-805 leading-relaxed font-serif">
                                            <span dangerouslySetInnerHTML={{ __html: fn.formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>") }}></span>
                                          </p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <span className={`text-[8px] uppercase tracking-wider font-sans font-bold px-1.5 py-0.5 rounded border ${badgeInfo.bg}`}>
                                              {badgeInfo.label}
                                            </span>
                                            <span className="text-[9px] font-mono text-slate-400">Réf ID: {fn.id}</span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    </div>

                    {/* UNIVERSAL DYNAMIC FOOTNOTE RENDER ON ALL PAGES EXCEPT COVER/BIBLIOGRAPHIE */}
                    {page.type !== "cover" && !(page.type === "bibliographie" || page.title.toLowerCase().includes("biograph") || page.title.toLowerCase().includes("bibliograph")) && footnotes.filter(fn => fn.pageId === page.id || (page.type === "kteb" && !fn.pageId)).length > 0 && (
                      <div className="academic-footnotes-container mt-8 pt-4 text-left font-serif" id={`fn_sheet_${page.id}`}>
                        <div style={{ borderTop: "1px solid #777777", width: "140px" }} className="mb-3"></div>
                        
                        <div className="space-y-1.5">
                          {footnotes.filter(fn => fn.pageId === page.id || (page.type === "kteb" && !fn.pageId)).map((fn) => {
                            const isWordStyle = typeof fn.id === "string" && fn.id.startsWith("fn-id-");
                            
                            return (
                              <div 
                                key={fn.id}
                                id={`fn-container-${fn.id}`}
                                className="group/fn flex items-baseline text-slate-900 hover:bg-slate-50/60 p-0.5 rounded transition-all leading-normal text-left"
                              >
                                {/* Index Badge / Click to return back up */}
                                <div 
                                  onClick={() => handleReturnToAnchor(fn.id)}
                                  onDoubleClick={() => handleReturnToAnchor(fn.id)}
                                  className="cursor-pointer shrink-0 select-none animate-fadeIn font-serif font-semibold text-slate-900 mr-1 hover:text-blue-600 transition-colors"
                                  title="Cliquez pour remonter au marqueur dans le texte"
                                >
                                  <sup className="text-[10px] select-none font-semibold">
                                    {fn.label || fn.index || fn.id}
                                  </sup>
                                </div>

                                {/* Text/Input renderer */}
                                {isWordStyle ? (
                                  <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      id={`fn-input-${fn.id}`}
                                      type="text"
                                      value={fn.formattedText}
                                      onChange={(e) => {
                                        const newText = e.target.value;
                                        setFootnotes(prev => prev.map(f => f.id === fn.id ? { ...f, formattedText: newText } : f));
                                      }}
                                      onBlur={() => {
                                        runSequenceRenumbering();
                                      }}
                                      className="flex-1 bg-transparent border-b border-dashed border-slate-205 focus:border-blue-500 focus:outline-none py-0.5 text-[10px] text-slate-900 font-serif"
                                      placeholder="Saisir ici la note de bas de page..."
                                    />
                                    
                                    <button
                                      onClick={() => {
                                        const anchorEl = document.querySelector(`.footnote-anchor[data-id="${fn.id}"], .footnote-link[data-footnote-id="${fn.id}"]`);
                                        if (anchorEl) {
                                          anchorEl.remove();
                                          const pageEl = document.querySelector(`[contenteditable="true"][data-page-id="${page.id}"]`);
                                          if (pageEl) {
                                            handlePageBlur(page.id, pageEl.innerHTML);
                                          }
                                        } else {
                                          setFootnotes(prev => {
                                            const filtered = prev.filter(f => f.id !== fn.id);
                                            setTimeout(() => runSequenceRenumbering(filtered), 10);
                                            return filtered;
                                          });
                                        }
                                      }}
                                      className="opacity-0 group-hover/fn:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-opacity cursor-pointer shrink-0"
                                      title="Supprimer cette note de bas de page"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex-1 text-[10px] text-slate-950 flex items-baseline justify-between font-serif pr-2">
                                    <div className="flex-1 pr-4" onClick={(e) => e.stopPropagation()}>
                                      <div
                                        id={`fn-editor-${fn.id}`}
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        onBlur={(e) => {
                                          const newText = e.currentTarget.innerText || e.currentTarget.textContent || "";
                                          setFootnotes(prev => prev.map(f => f.id === fn.id ? { ...f, formattedText: newText } : f));
                                        }}
                                        className="focus:outline-none focus:bg-slate-100/90 focus:ring-1 focus:ring-blue-300 rounded px-1 transition-all w-full text-slate-900 border-b border-transparent focus:border-slate-300 cursor-text select-text whitespace-pre-wrap leading-normal"
                                        dangerouslySetInnerHTML={{ __html: fn.formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>") }}
                                        title="Cliquez pour modifier directement cette note"
                                      />
                                    </div>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        goToBibliography(fn.id as number);
                                      }}
                                      className="text-[9px] text-emerald-600 font-mono opacity-0 group-hover/fn:opacity-100 transition-all ml-1.5 uppercase font-bold cursor-pointer hover:underline flex items-center shrink-0"
                                      title="Afficher dans la bibliographie AFNOR"
                                    >
                                      <span>Bibliographie</span>
                                      <ChevronRight className="w-3 h-3 text-emerald-500" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Running Footer Page indicators */}
                    <div className="absolute bottom-4 left-16 right-16 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none bg-white z-10">
                      <span className="text-[9px] opacity-0 pointer-events-none"></span>
                      
                      {/* Centered Page Number */}
                      <span className="absolute left-1/2 transform -translate-x-1/2 font-serif font-bold text-slate-900 text-[11px] bg-white px-3">
                        {page.pageNum ? `${page.pageNum}` : "Couverture"}
                      </span>

                      {page.type !== "cover" && !(page.type === "bibliographie" || page.title.toLowerCase().includes("biograph") || page.title.toLowerCase().includes("bibliograph")) ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePageId(page.id);
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8.5px] font-bold uppercase transition-all shadow-sm border cursor-pointer select-none ${
                            activePageId === page.id
                              ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black"
                              : "bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 border-slate-200 text-slate-500 hover:border-emerald-300"
                          }`}
                          title="Cibler cette page pour les bas de page AFNOR"
                        >
                          {activePageId === page.id ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                              <span>Ciblée</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-2.5 h-2.5 text-slate-400" />
                              <span>Cibler</span>
                            </>
                          )}
                        </button>
                      ) : null}
                    </div>

                  </div>

                  {/* PAGE BOTTOM ACTION PANEL (Durable controls specified in requirements) */}
                  <div className={`mt-2 flex items-center justify-between px-4 py-2.5 rounded-xl text-xs gap-3 select-none ${
                    isLight 
                      ? "bg-slate-55 border border-slate-200 text-slate-600" 
                      : "bg-slate-900/60 border border-white/5 text-slate-400"
                  }`}>
                    <span className="font-mono text-[10px] tracking-tight">
                      Classification : <span className="text-blue-500 font-bold">Standard AFNOR</span>
                    </span>
                    <div className="flex items-center gap-1.5 font-sans">
                      <button
                        onClick={() => handleInsertPage(index + 1)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-500/20 rounded-lg transition-all font-semibold text-[11px] cursor-pointer"
                        title="Ajouter une nouvelle page blanche immédiatement en dessous"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Insérer nouvelle page</span>
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-rose-600/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-lg transition-all font-semibold text-[11px] cursor-pointer"
                        title="Détruire cette page du mémoire"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer page</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* IN-BETWEEN INSERT PAGES AT ACTIVE DIVIDERS */}
                <div className="group/divider h-8 w-full max-w-[800px] flex items-center justify-center relative">
                  <div className="absolute inset-x-0 h-px bg-blue-500/30 opacity-0 group-hover/divider:opacity-100 transition-opacity"></div>
                  <button
                    onClick={() => handleInsertPage(index + 1)}
                    className="z-10 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md transition-all scale-90 opacity-0 group-hover/divider:opacity-100 group-hover/divider:scale-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insérer une page blanche entre ces pages</span>
                  </button>
                </div>

              </React.Fragment>
            ))}

              </div> {/* Close of Scaled Workspace Canvas */}

              {/* Dynamic scroll expander spacer to offset transform scale overflow */}
              <div 
                style={{ 
                  height: `${Math.max(0, (documentZoom / 100 - 1) * computedPagesList.length * 1150)}px`,
                  minHeight: `${Math.max(0, (documentZoom / 100 - 1) * computedPagesList.length * 1150)}px` 
                }} 
                className="pointer-events-none shrink-0"
              />

          </div> {/* End of #editor_page_viewport */}

        </div> {/* End of flex-1 flex overflow-hidden split viewer wrapper */}
      </main>
        )}

        {/* RIGHT SIDEBAR PANEL: CHECK SPLIT REAL-TIME SPELL-CHECKER */}
        {isSplitCheckerOpen && (
          <aside className={`w-[360px] border-l flex flex-col h-full overflow-hidden shrink-0 z-40 shadow-2xl animate-slideInRight ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/5'
          }`} id="spellcheck_panel">
            
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between select-none bg-rose-600 text-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1 px-1.5 bg-white/20 rounded-md font-mono text-[9px] font-black uppercase tracking-wider">
                  Live
                </div>
                <span className="font-sans font-bold text-xs">Correcteur d’orthographe</span>
              </div>
              <button 
                onClick={() => setIsSplitCheckerOpen(false)}
                className="hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scope Selection Box */}
            <div className={`p-4 border-b space-y-2 select-none shrink-0 font-sans ${
              isLight ? 'bg-slate-50/50' : 'bg-slate-950/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-black tracking-wider text-slate-400">
                  Zone d’analyse linguistique :
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-[9px] text-rose-600 font-bold uppercase font-mono">
                  {checkingScope === "active" ? "Page active" : checkingScope === "all" ? "Manuscrit total" : "Perso"}
                </span>
              </div>
              
              <div className="flex gap-1.5 font-sans">
                <button
                  onClick={() => {
                    const activePage = pages.find(p => p.id === activePageId);
                    if (activePage && activePage.type !== "cover") {
                      setSelectedPageIdsForChecking([activePageId]);
                      triggerCheckSplit([activePageId]);
                    } else {
                      const nonCoverPages = pages.filter(p => p.type !== "cover").map(p => p.id);
                      setSelectedPageIdsForChecking(nonCoverPages);
                      triggerCheckSplit(nonCoverPages);
                    }
                  }}
                  disabled={isSpellCheckingLoading}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-sans font-extrabold transition-all cursor-pointer ${
                    checkingScope === "active"
                      ? "bg-rose-600 text-white shadow-sm"
                      : isLight
                        ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        : "bg-slate-950 border border-white/5 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  Page Active
                </button>

                <button
                  onClick={() => {
                    const nonCoverPages = pages.filter(p => p.type !== "cover").map(p => p.id);
                    setSelectedPageIdsForChecking(nonCoverPages);
                    triggerCheckSplit(nonCoverPages);
                  }}
                  disabled={isSpellCheckingLoading}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-sans font-extrabold transition-all cursor-pointer ${
                    checkingScope === "all"
                      ? "bg-rose-600 text-white shadow-sm"
                      : isLight
                        ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        : "bg-slate-950 border border-white/5 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  Tout
                </button>

                <button
                  onClick={() => {
                    setCheckingScope("custom");
                    setSelectedPageIdsForChecking([]);
                    setSpellErrors([]);
                  }}
                  disabled={isSpellCheckingLoading}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-sans font-extrabold transition-all cursor-pointer ${
                    checkingScope === "custom"
                      ? "bg-rose-600 text-white shadow-sm"
                      : isLight
                        ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        : "bg-slate-950 border border-white/5 text-slate-300 hover:bg-white/5"
                  }`}
                >
                  Perso...
                </button>
              </div>

              {checkingScope === "custom" && (
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-1.5 max-h-[110px] overflow-y-auto select-none">
                  {pages.map((p, idx) => {
                    if (p.type === "cover") return null;
                    const isChecked = selectedPageIdsForChecking.includes(p.id);
                    return (
                      <label 
                        key={p.id} 
                        className={`flex items-center gap-1.5 p-1.5 rounded-lg text-[10px] cursor-pointer font-sans transition-colors border ${
                          isChecked 
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300 font-bold' 
                            : isLight 
                              ? 'border-slate-100 hover:bg-slate-50 text-slate-500' 
                              : 'border-white/5 hover:bg-white/5 text-slate-400'
                        }`}
                      >
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            let newList = [...selectedPageIdsForChecking];
                            if (isChecked) {
                              newList = newList.filter(id => id !== p.id);
                            } else {
                              newList.push(p.id);
                            }
                            setSelectedPageIdsForChecking(newList);
                            triggerCheckSplit(newList);
                          }}
                          className="rounded text-rose-600 focus:ring-rose-550 w-3.5 h-3.5 cursor-pointer accent-rose-600"
                        />
                        <span className="truncate" title={p.title || `p. ${idx + 1}`}>
                          P.{idx + 1}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Body Error List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans relative">
              {isSpellCheckingLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-slate-900/70 z-10 animate-fadeIn backdrop-blur-[1.5px]">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                  <span className="text-xs font-mono font-bold mt-2 text-rose-600 animate-pulse">Audit en cours...</span>
                </div>
              )}

              {spellErrors.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 select-none animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shadow-lg relative">
                    <CheckSquare className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping"></span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-sans font-black text-sm text-emerald-600 dark:text-emerald-400 tracking-wide text-center">Tout est parfait !</p>
                    <p className="text-[11px] text-slate-400 max-w-[220px] leading-normal font-sans italic text-center">
                      Aucune faute d'orthographe détectée sur les pages analysées.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 font-sans animate-fadeIn">
                  <div className="flex items-center justify-between pb-1 select-none font-sans">
                    <span className="text-[9.5px] font-mono text-slate-450 uppercase tracking-widest block pl-0.5">
                      Faute(s) détectée(s) : {spellErrors.length}
                    </span>
                    <button 
                      onClick={() => setSpellErrors([])}
                      className="text-[9.5px] font-mono text-rose-500 hover:underline cursor-pointer"
                    >
                      Effacer
                    </button>
                  </div>

                  {spellErrors.map((err, idx) => {
                    const isSelected = selectedSplitMistake?.toLowerCase() === err.mistake.toLowerCase();
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedSplitMistake(err.mistake);
                          // Auto scroll to appropriate page containing mistakes:
                          const escapedMistake = err.mistake.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                          const regex = new RegExp(`\\b${escapedMistake}\\b`, 'i');
                          
                          const foundPage = pages.find(p => {
                            if (!selectedPageIdsForChecking.includes(p.id)) return false;
                            const doc = document.createElement("div");
                            doc.innerHTML = p.content;
                            return regex.test(doc.textContent || doc.innerText || "");
                          });
                          
                          if (foundPage) {
                            setSpellCheckedPageId(foundPage.id);
                            setActivePageId(foundPage.id);
                            setTimeout(() => {
                              const marker = document.getElementById("temp-highlight-marker") || 
                                             document.querySelector(`[data-page-id="${foundPage.id}"]`);
                              if (marker) {
                                marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }, 150);
                          }
                        }}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all relative group font-sans flex flex-col gap-2 ${
                          isSelected
                            ? "bg-rose-500/5 animate-scaleUp border-rose-500 shadow-lg ring-1 ring-rose-500/10"
                            : isLight
                              ? "bg-white border-slate-150 hover:border-slate-300 hover:shadow-md"
                              : "bg-slate-950/20 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <div className="flex justify-between items-start select-none font-sans">
                          <span className="text-[10px] font-mono font-bold text-slate-400">Anomalie #{idx + 1}</span>
                          <span className="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-650 text-[9px] uppercase font-mono font-black border border-red-500/15 tracking-wider">
                            Erreur en rouge
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap font-sans text-xs pt-0.5">
                          <span className="font-bold text-red-600 line-through select-all">{err.mistake}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                          <span className="px-2 py-0.5 bg-emerald-505/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg border border-emerald-500/20 shadow-sm text-xs select-all">
                            {err.correction}
                          </span>
                        </div>

                        <p className="text-[10.5px] italic text-slate-500 dark:text-slate-450 leading-normal pl-1.5 border-l-2 border-slate-200 dark:border-white/10">
                          {err.explanation}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCorrectMistake(err.mistake, err.correction);
                          }}
                          className="self-end mt-1 py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[9.5px] font-bold uppercase rounded-lg transition-all shadow-sm flex items-center gap-1 hover:scale-102 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Corriger
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Multi Corrector Bar */}
            <div className="p-4 border-t shrink-0 select-none font-sans">
              <button
                onClick={() => {
                  let updatedPages = [...pages];
                  spellErrors.forEach(err => {
                    const escapedMistake = err.mistake.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    const regex = new RegExp(`(?<!<[^>]*)(${escapedMistake})(?![^<]*>)`, 'gi');
                    
                    updatedPages = updatedPages.map(p => {
                      if (selectedPageIdsForChecking.includes(p.id)) {
                        return {
                          ...p,
                          content: p.content.replace(regex, err.correction)
                        };
                      }
                      return p;
                    });
                  });

                  setPages(updatedPages);
                  setSpellErrors([]);
                  setSelectedSplitMistake(null);
                }}
                disabled={spellErrors.length === 0 || isSpellCheckingLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-mono tracking-wide transition-all shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Corriger toutes les anomalies</span>
              </button>
            </div>

          </aside>
        )}

        {/* CHAT PANEL DETACHED AS SPECIFIED IN JSON ASSISTANCE */}
        {isChatOpen && (
          <aside className={`w-[360px] border-l flex flex-col h-full overflow-hidden shrink-0 z-40 shadow-2xl animate-slideInRight ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/5'
          }`} id="chat_panel">
            
            <div className={`p-4 border-b flex items-center justify-between select-none transition-all ${
              isVoiceCallActive ? 'bg-indigo-950 text-white border-white/5 shadow-md shadow-black/30' : 'bg-blue-600 text-white'
            }`}>
              <div className="flex items-center gap-2">
                {isVoiceCallActive ? (
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping" />
                    <Phone className="w-5 h-5 text-emerald-400 rotate-[135deg]" />
                  </div>
                ) : (
                  <MessageSquare className="w-5 h-5 animate-bounce" />
                )}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider whitespace-nowrap">
                    {isVoiceCallActive ? "Scrivya Voice Live" : "Scrivya Assistant"}
                  </h4>
                  <span className="text-[9px] text-blue-150 flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isVoiceCallActive ? 'bg-emerald-400' : 'bg-green-400'}`}></span>
                    {isVoiceCallActive ? "Session vocale active" : "Rigueur universitaire garantie"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!isVoiceCallActive && (
                  <button
                    onClick={startVoiceCall}
                    className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer flex items-center justify-center gap-1 text-[10px] font-bold shadow-sm"
                    title="Activer l'Appel Vocal Interactif Scrivya (Gemini Live)"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                    <span>Appeler</span>
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (isVoiceCallActive) {
                      endVoiceCall();
                    }
                    setIsChatOpen(false);
                  }}
                  className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                  title="Masquer l'assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isVoiceCallActive ? (
              /* GEMINI-STYLE IMMERSIVE VOICE CALL SCREEN */
              <div className="flex-1 flex flex-col bg-slate-950 text-white p-6 justify-between relative overflow-hidden font-sans">
                
                {/* Embedded decorative glowing mesh grids */}
                <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent opacity-40 select-none pointer-events-none" />
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl select-none pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl select-none pointer-events-none" />

                {/* Sub-header Controls / Gender & Speech settings */}
                <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-2 px-3 z-10 select-none text-[10.5px]">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-mono">Voix :</span>
                    <select
                      value={voiceCallGender}
                      onChange={(e) => {
                        const nextGender = e.target.value as "female" | "male";
                        setVoiceCallGender(nextGender);
                        speakFrenchCustom("Profil vocal mis à jour.", nextGender);
                      }}
                      className="bg-slate-900 border border-white/10 text-xs font-bold text-blue-300 rounded px-1.5 py-0.5 outline-none cursor-pointer focus:border-blue-500"
                    >
                      <option value="female">♀️ Elite (Féminine)</option>
                      <option value="male">♂️ Formelle (Masculine)</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setVoiceCallSpeechMuted(!voiceCallSpeechMuted)}
                    className={`p-1 px-2 rounded text-[9.5px] font-semibold transition-all border ${
                      voiceCallSpeechMuted 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {voiceCallSpeechMuted ? "Audio Off" : "Audio On"}
                  </button>
                </div>

                {/* Center Pulse Ring / Interactive Orb */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 z-10 py-4 select-none">
                  <div className="relative flex items-center justify-center w-36 h-36">
                    
                    {voiceCallStatus === "connecting" && (
                      <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-spin" />
                    )}
                    {voiceCallStatus === "listening" && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-emerald-500/15 animate-ping opacity-75" />
                        <div className="absolute inset-2 rounded-full bg-emerald-500/10 animate-pulse" />
                      </>
                    )}
                    {voiceCallStatus === "thinking" && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-spin" />
                        <div className="absolute inset-3 rounded-full bg-blue-500/15 animate-pulse" />
                      </>
                    )}
                    {voiceCallStatus === "speaking" && (
                      <>
                        <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping opacity-60" />
                        <div className="absolute inset-3 rounded-full bg-indigo-500/15 animate-pulse" />
                      </>
                    )}

                    <div className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-500 relative bg-gradient-to-tr ${
                      voiceCallStatus === "connecting" ? "from-indigo-900 to-slate-900 text-slate-400" :
                      voiceCallStatus === "listening" ? "from-emerald-600 to-emerald-950 text-emerald-100 shadow-emerald-500/20 border-2 border-emerald-400" :
                      voiceCallStatus === "thinking" ? "from-blue-600 to-violet-950 text-blue-100 animate-pulse border-2 border-indigo-400" :
                      voiceCallStatus === "speaking" ? "from-indigo-600 to-violet-800 text-indigo-100 shadow-indigo-500/25 border-2 border-indigo-300" :
                      "from-rose-900 to-slate-900 text-rose-400 border border-rose-500/40"
                    }`}>
                      {voiceCallStatus === "connecting" && <Loader2 className="w-8 h-8 animate-spin" />}
                      {voiceCallStatus === "listening" && <Mic className="w-8 h-8 animate-pulse text-emerald-300" />}
                      {voiceCallStatus === "thinking" && <Sparkles className="w-8 h-8 animate-bounce text-indigo-300" />}
                      {voiceCallStatus === "speaking" && (
                        <div className="flex items-end justify-center gap-1 w-12 h-6">
                          <span className="w-1.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <span className="w-1.5 h-5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <span className="w-1.5 h-6 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                          <span className="w-1.5 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                        </div>
                      )}
                      {voiceCallStatus === "muted" && <MicOff className="w-8 h-8 text-rose-400" />}
                    </div>
                  </div>

                  <div className="text-center space-y-1 select-none">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                      {voiceCallStatus === "connecting" && "Connexion sécurisée..."}
                      {voiceCallStatus === "listening" && "Parlez, je vous écoute..."}
                      {voiceCallStatus === "thinking" && "Analyse en cours..."}
                      {voiceCallStatus === "speaking" && "Scrivya vous répond..."}
                      {voiceCallStatus === "muted" && "Microphone inactif"}
                    </p>
                    <p className="text-[10px] text-slate-500 italic">
                      {voiceCallStatus === "listening" && "Normes AFNOR appliquées en direct"}
                      {voiceCallStatus === "thinking" && "Interrogation des règles de mise en page"}
                      {voiceCallStatus === "speaking" && "Lecture audio fluide en cours"}
                    </p>
                  </div>
                </div>

                {/* Subtitle / Real-time written display */}
                <div className="space-y-2 z-10 text-left">
                  <span className="block text-[9.5px] font-mono tracking-widest uppercase text-indigo-300 font-bold px-1 select-none">
                    Transcription en direct (Realtime) :
                  </span>
                  <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 text-xs font-medium h-[135px] overflow-y-auto leading-relaxed text-slate-100 flex flex-col space-y-3 shadow-inner custom-scrollbar">
                    {voiceCallUserTranscript ? (
                      <p className="animate-fadeIn text-emerald-400 font-medium">
                        <span className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-emerald-500 mr-2 border border-emerald-500/20 px-1 rounded bg-emerald-500/5">Vous</span>
                        {voiceCallUserTranscript}
                      </p>
                    ) : (
                      voiceCallStatus === "listening" && (
                        <p className="text-slate-500 italic text-[11px] animate-pulse">En attente de votre parole...</p>
                      )
                    )}
                    {voiceCallAiResponse && (
                      <p className="animate-fadeIn text-indigo-100 font-medium border-t border-white/5 pt-2">
                        <span className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-indigo-400 mr-2 border border-indigo-400/20 px-1 rounded bg-indigo-500/5">Scrivya</span>
                        {voiceCallAiResponse}
                      </p>
                    )}
                  </div>
                </div>

                {/* Controls Action Panel */}
                <div className="pt-4 flex items-center justify-center gap-4 z-10 border-t border-white/5 select-none">
                  <button
                    onClick={toggleVoiceCallMute}
                    className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                      voiceCallMuted
                        ? 'bg-rose-600 border-rose-500 text-white scale-115 shadow-md shadow-rose-500/20'
                        : 'bg-white/10 border-white/10 hover:bg-white/20 text-slate-200'
                    }`}
                    title={voiceCallMuted ? "Activer le microphone" : "Désactiver le microphone"}
                  >
                    {voiceCallMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
                  </button>

                  <button
                    onClick={endVoiceCall}
                    className="p-5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-full transition-all cursor-pointer shadow-lg shadow-rose-600/30 flex items-center justify-center animate-pulse"
                    title="Raccrocher la session vocale"
                  >
                    <PhoneOff className="w-6 h-6 rotate-[135deg]" />
                  </button>

                  <button
                    onClick={endVoiceCall}
                    className="p-3.5 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer"
                    title="Revenir au clavier texte traditionnel"
                  >
                    <Send className="w-5 h-5 -rotate-45 text-blue-400" />
                  </button>
                </div>

              </div>
            ) : (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/20" id="chat_messages_viewport">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start animate-fadeIn"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 select-none">
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                          {msg.role === "user" ? "Vous" : "Scrivya AI"}
                        </span>
                        <button
                          type="button"
                          onClick={() => readChatMessage(msg.id, msg.text)}
                          className="p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer flex items-center justify-center"
                          title={currentlyReadingId === msg.id ? "Arrêter la lecture" : "Lire en français"}
                        >
                          {currentlyReadingId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed text-justify relative group ${
                        msg.role === "user"
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : isLight 
                            ? 'bg-white border border-slate-250 text-slate-800 rounded-bl-none shadow-sm'
                            : 'bg-slate-800 text-slate-105 rounded-bl-none border border-white/5'
                      }`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {chatLoading && (
                    <div className="mr-auto items-start flex flex-col max-w-[85%] animate-pulse">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        Scrivya AI
                      </span>
                      <div className={`p-3 rounded-2xl rounded-bl-none text-xs flex items-center gap-2 ${
                        isLight ? 'bg-white border text-slate-800' : 'bg-slate-850 text-slate-150 border border-white/5'
                      }`}>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                        <span>Scrivya recherche les standards...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className={`p-3 border-t space-y-1.5 shrink-0 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/35 border-white/5'
                }`}>
                  <span className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1 select-none">
                    Suggestions :
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {promptSuggestions.map((promptText) => (
                      <button
                        key={promptText}
                        type="button"
                        onClick={() => handleSendMessage(promptText)}
                        className={`text-[10px] p-1 px-2.5 rounded-lg border text-left transition-all cursor-pointer font-medium select-none ${
                          isLight 
                            ? 'bg-white border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600' 
                            : 'bg-slate-850 border-white/5 hover:border-blue-500/20 text-slate-300 hover:text-blue-400'
                        }`}
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`p-3 border-t shrink-0 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/5'
                }`}>
                  {voiceError && (
                    <div className="mb-2 p-1.5 px-2 bg-rose-500/10 border border-rose-500/25 rounded-xl text-[9.5px] text-rose-400 font-mono animate-fadeIn flex justify-between items-center">
                      <span>{voiceError}</span>
                      <button onClick={() => setVoiceError(null)} className="text-[8px] hover:underline">Fermer</button>
                    </div>
                  )}
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={chatMessageInput}
                      onChange={(e) => setChatMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage(chatMessageInput)}
                      placeholder="Posez une question sur les normes..."
                      className={`flex-1 p-2.5 border text-xs outline-none rounded-xl focus:border-blue-500 font-medium ${
                        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-white/5 text-slate-100'
                      }`}
                    />
                    
                    {/* Chat Voice typing dictation btn */}
                    <button
                      type="button"
                      onClick={toggleChatListening}
                      className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                        isChatListening
                          ? 'bg-rose-600 text-white border-rose-500/50 animate-pulse scale-105 shadow-md'
                          : isLight
                            ? 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
                            : 'bg-slate-800 border-white/5 hover:bg-slate-750 text-slate-300'
                      }`}
                      title={isChatListening ? "Écoute active en cours... Parler simplement." : "Dicter votre message par voix"}
                    >
                      <Mic className={`w-4 h-4 ${isChatListening ? 'animate-bounce text-white' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendMessage(chatMessageInput)}
                      disabled={!chatMessageInput.trim() || chatLoading}
                      className={`p-2.5 rounded-xl text-white flex items-center justify-center cursor-pointer transition-all ${
                        !chatMessageInput.trim() || chatLoading
                          ? 'bg-slate-800 text-slate-600'
                          : 'bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/15'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

          </aside>
        )}

      </div>

      {/* AFNOR CITATION INPUT POPUP MODAL */}
      {isAfnorPopupOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 text-slate-100">
            
            {/* Close button */}
            <button
              onClick={() => setIsAfnorPopupOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600/15 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                🎓
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Saisie de Note AFNOR NF Z 44-005
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                Renseignez les champs ci-dessous pour compiler automatiquement votre note de bas de page et votre notice bibliographique.
              </p>
            </div>

            <form onSubmit={handleAddFootnote} className="space-y-3.5 text-xs">
              
              {/* CURRENT ACTIVE TARGET PAGE CHIP */}
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-300 leading-normal">
                <div className="flex items-center gap-1 font-semibold uppercase tracking-wider text-[8px] text-emerald-400 mb-0.5 font-mono">
                  <span className="animate-ping rounded-full w-1 h-1 bg-emerald-400 animate-duration-1000"></span>
                  <span>📍 Rattachement automatique :</span>
                </div>
                {computedPagesList.findIndex(p => p.id === activePageId) !== -1 ? (
                  <span>
                    Page {computedPagesList.findIndex(p => p.id === activePageId) + 1} : <strong className="font-bold text-white underline">{computedPagesList.find(p => p.id === activePageId)?.title}</strong>
                  </span>
                ) : (
                  <span>Introduction Générale</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono font-semibold text-slate-400 uppercase">Nom de l'auteur :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: NEFZI"
                    className="w-full p-2 bg-slate-950 border border-white/10 rounded-lg outline-none text-[11px] text-slate-100 placeholder-slate-500 font-medium focus:border-emerald-500 transition-colors uppercase"
                    value={newFootnote.authorLast}
                    onChange={(e) => setNewFootnote({...newFootnote, authorLast: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono font-semibold text-slate-400 uppercase">Prénom d'auteur :</label>
                  <input
                    type="text"
                    placeholder="Ex: Ahmed"
                    className="w-full p-2 bg-slate-950 border border-white/10 rounded-lg outline-none text-[11px] text-slate-100 placeholder-slate-500 font-medium focus:border-emerald-500 transition-colors uppercase"
                    value={newFootnote.authorFirst}
                    onChange={(e) => setNewFootnote({...newFootnote, authorFirst: e.target.value.toUpperCase()})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-semibold text-slate-400 uppercase">Titre de la Source :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Manuel de Droit Public Tunisien"
                  className="w-full p-2 bg-slate-950 border border-white/10 rounded-lg outline-none text-[11px] text-slate-100 placeholder-slate-500 font-medium focus:border-emerald-500 transition-colors uppercase"
                  value={newFootnote.title}
                  onChange={(e) => setNewFootnote({...newFootnote, title: e.target.value.toUpperCase()})}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="block text-[9px] font-mono font-semibold text-slate-400 uppercase">Éditeur / Revue / URL :</label>
                  <input
                    type="text"
                    placeholder="Ex: L.D.G.R. / Revue Tunisienne"
                    className="w-full p-2 bg-slate-950 border border-white/10 rounded-lg outline-none text-[11px] text-slate-100 placeholder-slate-500 font-medium focus:border-emerald-500 transition-colors uppercase font-mono"
                    value={newFootnote.publisher}
                    onChange={(e) => setNewFootnote({...newFootnote, publisher: formatPublisherInput(e.target.value, newFootnote.publisher)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono font-semibold text-slate-400 uppercase">Année :</label>
                  <input
                    type="text"
                    placeholder="Ex: 2026"
                    className="w-full p-2 bg-slate-950 border border-white/10 rounded-lg outline-none text-[11px] text-slate-100 placeholder-slate-500 font-medium focus:border-emerald-500 transition-colors"
                    value={newFootnote.year}
                    onChange={(e) => setNewFootnote({...newFootnote, year: e.target.value.replace(/\D/g, "")})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-semibold text-slate-400 uppercase">Page citée ou consultation :</label>
                <input
                  type="text"
                  placeholder="Ex: p. 45"
                  className="w-full p-2 bg-slate-950 border border-white/10 rounded-lg outline-none text-[11px] text-slate-100 placeholder-slate-500 font-medium focus:border-emerald-500 transition-colors uppercase"
                  value={newFootnote.page}
                  onChange={(e) => setNewFootnote({...newFootnote, page: e.target.value.toUpperCase()})}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-mono font-semibold text-slate-400 uppercase">Résumé / Abstract de la source :</label>
                <textarea
                  placeholder="Ex: Résumé de la thèse de doctorat portant sur l'impact de l'IA..."
                  rows={2}
                  className="w-full p-2 bg-slate-950 border border-white/10 rounded-lg outline-none text-[11px] text-slate-105 placeholder-slate-500 font-medium focus:border-emerald-500 transition-colors font-sans leading-normal resize-none"
                  value={newFootnote.abstract || ""}
                  onChange={(e) => setNewFootnote({...newFootnote, abstract: e.target.value})}
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAfnorPopupOpen(false)}
                  className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Compiler</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* FLOAT SELECTION MODAL OVERLAY FOR ZEROING IN ON SOURCE KINDS */}
      {justCompiledFootnote && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600/15 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                🎓
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Source de Référence AFNOR
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Choisissez précisément de quelle nature de source il s'agit pour l'écriture AFNOR NF Z 44-005 :
              </p>
            </div>

            <div className="border-y border-white/5 py-4 my-2 text-xs space-y-1 bg-slate-950/25 p-3.5 rounded-xl">
              <p className="text-[10px] uppercase font-mono font-bold text-blue-400">Objet à indexer :</p>
              <p className="font-semibold text-slate-200">{justCompiledFootnote.author}</p>
              <p className="italic text-slate-300">« {justCompiledFootnote.title} » ({justCompiledFootnote.year})</p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {[
                { kind: "book", label: "Livre (Ouvrage de base)", desc: "Pour les monographies et les manuels de Tunisie", icon: "📖" },
                { kind: "article", label: "Article de Revue Scientifique", desc: "Pour les revues périodiques de recherche de Tunisie", icon: "📄" },
                { kind: "thesis", label: "Thèse ou Mémoire", desc: "Pour les thèses de Droit ou master tunisien", icon: "🎓" },
                { kind: "law", label: "Jurisprudence ou Texte Législatif", desc: "Pour les décrets, lois et arrêts du JORT", icon: "⚖️" },
                { kind: "web", label: "Publication Web ou Média", desc: "Pour les sites internet certifiés", icon: "🌐" }
              ].map((item) => (
                <button
                  key={item.kind}
                  onClick={() => confirmSourceKind(item.kind as any)}
                  className="w-full p-3 text-left bg-slate-950/40 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-indigo-500/10 border border-white/10 hover:border-blue-500/20 rounded-xl transition-all flex items-center gap-3 text-xs text-slate-300 hover:text-white cursor-pointer select-none group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div>
                    <span className="block font-bold tracking-normal">{item.label}</span>
                    <span className="block text-[10px] text-slate-450 mt-0.5">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setJustCompiledFootnote(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold font-mono transition-colors border border-white/5 cursor-pointer"
            >
              Annuler la note
            </button>
          </div>
        </div>
      )}

      {/* DOWNLOAD VALIDATION REMINDER MODAL */}
      {downloadWarning.isOpen && (() => {
        const modal = getWarningModal();
        return (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fadeIn font-sans">
            <div className={`border rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 ${
              isLight ? 'bg-white border-rose-100 text-slate-800' : 'bg-slate-900 border-rose-950/20 text-slate-100'
            }`}>
              <div className="text-center">
                <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl border border-rose-500/20">
                  ⚠️
                </div>
                <h3 className={`text-base font-bold uppercase tracking-wider font-mono ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>
                  {modal.title}
                </h3>
                <p className={`text-xs mt-1.5 max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {modal.desc}
                </p>
              </div>

              <div className={`p-4 rounded-xl space-y-3 ${isLight ? 'bg-rose-50/50 border border-rose-100' : 'bg-rose-950/10 border border-rose-950/30'}`}>
                <div className="text-xs font-bold text-rose-500 uppercase tracking-widest font-mono flex items-center gap-1">
                  <span>{modal.subtitle}</span>
                </div>
                <ul className="space-y-2 text-xs font-serif">
                  {downloadWarning.missingFields.map((field) => (
                    <li key={field.id} className="flex items-center justify-between gap-4 p-2.5 rounded-lg bg-white/50 dark:bg-slate-950/45 border border-dashed border-rose-200 dark:border-rose-950/40">
                      <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] bg-rose-100 dark:bg-rose-955/60 text-rose-700 dark:text-rose-400 px-1.5 py-0.5 rounded uppercase font-bold font-mono shrink-0">{modal.badgeField}</span>
                        <span className="truncate font-semibold">{field.name}</span>
                      </span>
                      <button
                        onClick={() => handleGoToMissingField(field.id)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md flex items-center gap-1 cursor-pointer whitespace-nowrap shadow transition-all hover:scale-[1.03]"
                      >
                        <span>{modal.correctBtn}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => setDownloadWarning({ isOpen: false, missingFields: [] })}
                  className={`flex-1 py-2 text-center rounded-xl text-xs font-bold font-mono cursor-pointer transition-colors ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {modal.backBtn}
                </button>
                <button
                  onClick={() => {
                    setDownloadWarning({ isOpen: false, missingFields: [] });
                    handleDownloadDoc();
                  }}
                  className="flex-1 py-1.5 text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-mono cursor-pointer transition-transform hover:scale-[1.01] shadow"
                >
                  {modal.downloadBtn}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* FLOATING ACTION PILL FOR CHAT SELECTION */}
      {chatSelection && (
        <div 
          className="floating-selection-menu fixed z-[9999] animate-fadeIn font-sans"
          style={{
            top: chatSelection.rect.top - 12,
            left: chatSelection.rect.left + chatSelection.rect.width / 2,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <button
            onClick={handleAddChatTextToDocument}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-mono shadow-2xl border border-blue-500/30 whitespace-nowrap cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to document</span>
          </button>
        </div>
      )}

      {/* FLOATING ACTION BAR FOR PAGE SELECTION */}
      {pageSelection && (
        <div 
          className="floating-selection-menu fixed z-[9999] animate-fadeIn font-sans cursor-default"
          style={{
            top: pageSelection.rect.top - 12,
            left: pageSelection.rect.left + pageSelection.rect.width / 2,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="flex flex-col items-center gap-1.5 text-slate-800 dark:text-slate-100">
            <div className={`p-2 rounded-xl border shadow-2xl flex flex-col items-center gap-2 ${
              isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-900 border-white/15 shadow-2xl'
            }`}>
              
              {/* Word-style formatting ribbon */}
              <div className="flex flex-wrap items-center gap-1.5 max-w-[480px] border-b pb-2 border-slate-100 dark:border-white/5 justify-center">
                
                {/* Font Family Selector */}
                <div className="flex items-center gap-1">
                  <select
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      if (e.target.value) {
                        applySelectionStyle("fontFamily", e.target.value);
                      }
                    }}
                    className="bg-transparent text-[10px] font-bold py-0.5 px-1 border border-slate-200 dark:border-white/10 rounded cursor-pointer outline-none text-slate-850 dark:text-slate-200 bg-white dark:bg-slate-800"
                    defaultValue=""
                  >
                    <option value="" className="text-slate-800 bg-white">Police</option>
                    <option value="Times New Roman" className="text-slate-800 bg-white font-serif">Times New Roman</option>
                    <option value="Arial" className="text-slate-800 bg-white font-sans">Arial</option>
                    <option value="Georgia" className="text-slate-800 bg-white font-serif">Georgia</option>
                    <option value="Garamond" className="text-slate-800 bg-white font-serif">Garamond</option>
                    <option value="Courier New" className="text-slate-800 bg-white font-mono">Courier New</option>
                  </select>
                </div>

                {/* Sizing Selector / Text Dimance */}
                <div className="flex items-center gap-1">
                  <select
                    onMouseDown={(e) => e.stopPropagation()} 
                    onChange={(e) => {
                      if (e.target.value) {
                        applySelectionStyle("fontSize", e.target.value);
                      }
                    }}
                    className="bg-transparent text-[10px] font-bold py-0.5 px-1 border border-slate-200 dark:border-white/10 rounded cursor-pointer outline-none text-slate-850 dark:text-slate-200 bg-white dark:bg-slate-800 w-[55px]"
                    defaultValue=""
                  >
                    <option value="" className="text-slate-800 bg-white">Taille</option>
                    <option value="11px" className="text-slate-800 bg-white">11px</option>
                    <option value="12px" className="text-slate-800 bg-white">12px</option>
                    <option value="13px" className="text-slate-800 bg-white">13px</option>
                    <option value="14px" className="text-slate-800 bg-white">14px</option>
                    <option value="15px" className="text-slate-800 bg-white">15px</option>
                    <option value="16px" className="text-slate-800 bg-white">16px</option>
                    <option value="18px" className="text-slate-800 bg-white">18px</option>
                    <option value="20px" className="text-slate-800 bg-white">20px</option>
                    <option value="22px" className="text-slate-800 bg-white">22px</option>
                    <option value="26px" className="text-slate-800 bg-white">26px</option>
                    <option value="32px" className="text-slate-800 bg-white">32px</option>
                    <option value="38px" className="text-slate-800 bg-white">38px</option>
                  </select>
                </div>

                <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 mx-0.5" />

                {/* Font Styles */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); applyTextFormat("bold"); }}
                    className="p-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Gras / Bold"
                  >
                    <Bold className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); applyTextFormat("italic"); }}
                    className="p-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Italique / Italic"
                  >
                    <Italic className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); applyTextFormat("underline"); }}
                    className="p-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Souligné / Underline"
                  >
                    <Underline className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); applyTextFormat("strikeThrough"); }}
                    className="p-1 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[10px] font-extrabold font-mono text-slate-650 dark:text-slate-350"
                    title="Barré / Strikethrough"
                  >
                    ab
                  </button>
                </div>

                <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 mx-0.5" />

                {/* Alignments */}
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); applyTextFormat("justifyLeft"); }}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Aligner à gauche"
                  >
                    <AlignLeft className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); applyTextFormat("justifyCenter"); }}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Centrer"
                  >
                    <AlignCenter className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); applyTextFormat("justifyRight"); }}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Aligner à droite"
                  >
                    <AlignRight className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); applyTextFormat("justifyFull"); }}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Justifier"
                  >
                    <AlignJustify className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  </button>
                </div>

                <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 mx-0.5" />

                {/* Colors Selectors */}
                <div className="flex items-center gap-1">
                  {/* Text Color Selection dropdown */}
                  <select
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      if (e.target.value) {
                        applySelectionStyle("color", e.target.value);
                      }
                    }}
                    className="bg-transparent text-[10px] font-bold py-0.5 border border-slate-200 dark:border-white/10 rounded cursor-pointer outline-none text-slate-805 dark:text-slate-200 bg-white dark:bg-slate-800 w-[55px]"
                    defaultValue=""
                  >
                    <option value="" className="text-slate-800 bg-white">G-Couleur</option>
                    <option value="#1e293b" className="text-slate-800 bg-white">Noir</option>
                    <option value="#2563eb" className="text-blue-600 bg-white font-bold">Bleu</option>
                    <option value="#dc2626" className="text-red-900 bg-white font-bold">Rouge</option>
                    <option value="#16a34a" className="text-emerald-700 bg-white font-bold">Vert</option>
                    <option value="#9333ea" className="text-purple-650 bg-white font-bold">Violet</option>
                  </select>

                  {/* Highlighter selector */}
                  <select
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      if (e.target.value) {
                        applySelectionStyle("backgroundColor", e.target.value);
                      }
                    }}
                    className="bg-transparent text-[10px] font-bold py-0.5 border border-slate-200 dark:border-white/10 rounded cursor-pointer outline-none text-slate-805 dark:text-slate-200 bg-white dark:bg-slate-800 w-[55px]"
                    defaultValue=""
                  >
                    <option value="" className="text-slate-800 bg-white">Surligner</option>
                    <option value="transparent" className="text-slate-ui bg-white">Aucun</option>
                    <option value="#fef08a" className="text-yellow-700 bg-yellow-100 font-bold">Jaune</option>
                    <option value="#bbf7d0" className="text-green-700 bg-green-100 font-bold">Vert</option>
                    <option value="#bfdbfe" className="text-blue-700 bg-blue-100 font-bold">Bleu</option>
                    <option value="#fbcfe8" className="text-pink-700 bg-pink-100 font-bold">Rose</option>
                  </select>

                  {/* Clear format button */}
                  <button
                    type="button"
                    onMouseDown={(e) => { 
                      e.preventDefault(); 
                      applySelectionStyle("backgroundColor", "transparent"); 
                      applySelectionStyle("color", ""); 
                      applyTextFormat("removeFormat");
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Recommencer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* AI Services / Submenu triggers */}
              <div className="flex items-center gap-1.5 w-full justify-center">
                {isFormulationSubmenuOpen ? (
                  <div className="flex items-center gap-1.5 py-0.5">
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        handleReformulateText("humanize");
                        setIsFormulationSubmenuOpen(false);
                      }}
                      disabled={isReformulating}
                      className="px-2.5 py-1 text-[11px] font-bold font-mono rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isReformulating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span>🧑 Humaniser (Anti-IA)</span>
                      )}
                    </button>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        handleReformulateText("afnor");
                        setIsFormulationSubmenuOpen(false);
                      }}
                      disabled={isReformulating}
                      className="px-2.5 py-1 text-[11px] font-bold font-mono rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isReformulating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span>🎓 Norme AFNOR</span>
                      )}
                    </button>
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setIsFormulationSubmenuOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full gap-2 font-sans">
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); insertWordStyleFootnote(); }}
                      className="px-2.5 py-1 text-[11px] font-bold font-mono rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 cursor-pointer transition-colors"
                      title="Insérer Note de bas de page (Ctrl+Alt+F)"
                    >
                      <Bookmark className="w-3 h-3 text-white fill-current" />
                      <span>Note de page</span>
                    </button>

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setIsFormulationSubmenuOpen(true)}
                      className="px-3 py-1 text-[11px] font-bold font-mono rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Formulation AI</span>
                      <ChevronDown className="w-3 h-3 ml-0.5" />
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleVerifyWithScrivya}
                      className={`px-3 py-1 text-[11px] font-bold font-mono rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${
                        isLight 
                          ? 'bg-slate-50 hover:bg-slate-150 border-slate-200 text-slate-700' 
                          : 'bg-slate-800 hover:bg-slate-750 border-white/5 text-slate-300'
                      }`}
                    >
                      <MessageSquare className="w-3 h-3 text-blue-500" />
                      <span>Rigueur</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Step 5: Hover Tooltip dialog preview popup */}
      {hoveredFootnote && (() => {
        const fnItem = footnotes.find(f => f.id.toString() === hoveredFootnote.id.toString());
        return (
          <div 
            className="fixed z-[10000] p-4 w-[340px] bg-slate-900 text-white rounded-2xl shadow-2xl text-[11px] font-sans leading-relaxed pointer-events-none animate-fadeIn border border-slate-700/60 divide-y divide-slate-800"
            style={{
              top: hoveredFootnote.y - window.scrollY - 20,
              left: hoveredFootnote.x - window.scrollX,
              transform: "translate(-50%, -100%)",
            }}
          >
            {/* Upper part: Meta & Title */}
            <div className="pb-2.5">
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="font-extrabold text-[9px] uppercase font-mono tracking-widest text-blue-400">
                  Citation • {fnItem?.sourceKind ? fnItem.sourceKind.toUpperCase() : "SOURCE"}
                </span>
                <span className="font-mono text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full font-bold">
                  Note {fnItem?.label || fnItem?.id || "?"}
                </span>
              </div>
              <h5 className="font-sans font-bold text-slate-100 text-[11.5px] leading-snug tracking-tight">
                {fnItem?.title || "Titre non spécifié"}
              </h5>
              <p className="text-[10px] text-slate-400 mt-1 font-mono font-medium">
                Par : <span className="text-slate-200">{fnItem?.author || "Auteur inconnu"}</span> {fnItem?.year ? `(${fnItem.year})` : ""}
              </p>
            </div>

            {/* Middle part: Full Bibliographic Reference */}
            <div className="py-2 text-[10px] text-slate-300 italic font-serif leading-normal">
              <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Référence AFNOR</span>
              <p dangerouslySetInnerHTML={{ __html: hoveredFootnote.formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>") }}></p>
            </div>

            {/* Bottom part: Abstract text */}
            <div className="pt-2.5">
              <span className="block font-mono text-[8px] uppercase tracking-wider text-emerald-400 font-extrabold mb-1">
                Résumé / Abstract
              </span>
              <p className="text-[10px] leading-relaxed text-slate-300 text-justify font-serif italic">
                {fnItem?.abstract 
                  ? fnItem.abstract 
                  : "Aucun abstract ni résumé n'a été fourni pour cette source de référence."}
              </p>
            </div>

            {/* Subtle arrow pointer */}
            <div className="absolute left-1/2 bottom-0 w-2.5 h-2.5 bg-slate-900 rotate-45 -translate-x-1/2 translate-y-1/2 border-r border-b border-slate-700/60"></div>
          </div>
        );
      })()}

      {phdHoveredSource && (
        <div 
          className="fixed z-[10000] p-4 w-[345px] bg-slate-900 text-white rounded-2xl shadow-2xl text-[11px] font-sans leading-relaxed pointer-events-none animate-fadeIn border border-blue-500/30 divide-y divide-slate-800"
          style={{
            top: phdHoverPos.y - window.scrollY - 15,
            left: phdHoverPos.x - window.scrollX,
            transform: "translate(-50%, -100%)",
          }}
        >
          {/* Upper part: Meta & Title */}
          <div className="pb-2.5">
            <div className="flex items-center justify-between gap-1.5 mb-1.5 font-sans">
              <span className="font-extrabold text-[9px] uppercase font-mono tracking-widest text-blue-400">
                Source Doctorale Indexée • PHD
              </span>
              <span className="font-mono text-[9px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full font-bold">
                [{phdHoveredSource.id}]
              </span>
            </div>
            <h5 className="font-sans font-bold text-slate-101 text-[11.5px] leading-snug tracking-tight">
              {phdHoveredSource.title}
            </h5>
            <p className="text-[10px] text-slate-400 mt-1 font-mono font-medium">
              Par : <span className="text-slate-200 font-sans">{phdHoveredSource.author}</span> ({phdHoveredSource.year})
            </p>
          </div>

          {/* Middle part: Publication / Review */}
          <div className="py-2 text-[10px] text-slate-300 italic font-medium">
            <span className="block font-mono text-[8px] uppercase tracking-wider text-slate-500 font-bold mb-0.5 select-none">Éditeur / Revue :</span>
            <p className="font-sans">{phdHoveredSource.publisher}</p>
          </div>

          {/* Bottom part: Abstract text */}
          <div className="pt-2.5">
            <span className="block font-mono text-[8px] uppercase tracking-wider text-blue-400 font-extrabold mb-1 select-none">
              Résumé Académique / Abstract :
            </span>
            <p className="text-[10px] leading-relaxed text-slate-300 text-justify italic font-serif">
              {phdHoveredSource.abstract || "Aucun abstract n'est disponible pour cette référence."}
            </p>
          </div>

          {/* Subtle arrow pointer */}
          <div className="absolute left-1/2 bottom-0 w-2.5 h-2.5 bg-slate-900 rotate-45 -translate-x-1/2 translate-y-1/2 border-r border-b border-blue-500/30"></div>
        </div>
      )}
      {/* Floating Footnote Suggestion toast */}
      {footnoteSuggestion && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-emerald-500/30 text-white rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-4 animate-slideUp z-[9999] max-w-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-300 block mb-0.5 font-sans">Suggestion de Note de bas de page</span>
              <span className="text-slate-300 font-sans">Ajouter <strong className="text-white italic">"{footnoteSuggestion.phrase}"</strong> en note de bas de page ?</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2 font-mono text-[11px]">
            <button
              onClick={handleAcceptFootnoteSuggestion}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-slate-100 font-bold rounded-lg cursor-pointer transition-all active:scale-95 shadow-md flex items-center gap-0.5"
            >
              <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              <span>Oui</span>
            </button>
            <button
              onClick={handleDismissSuggestion}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-lg cursor-pointer transition-all active:scale-95 border border-white/5"
            >
              <span>Non</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
