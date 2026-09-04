import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Check, 
  MessageSquare, 
  GraduationCap, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Send, 
  X, 
  RotateCcw,
  BookOpen,
  FolderKanban,
  Compass,
  FileDown,
  ChevronRight,
  User,
  ExternalLink,
  Edit2
} from "lucide-react";
import { Course, Internship, Skill, CareerStep, CustomIdeaNode, MentorRoadmap } from "../types/mentor";
import AIMentorMindMapCanvas from "./AIMentorMindMapCanvas";
import { jsPDF } from "jspdf";

interface AIMentorMapProps {
  onBackToEditor: () => void;
  isLight: boolean;
}

export default function AIMentorMap({ onBackToEditor, isLight }: AIMentorMapProps) {
  const [goalInput, setGoalInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [roadmap, setRoadmap] = useState<MentorRoadmap | null>(null);
  
  // Interactive view modes: "mindmap" (default - NotebookLM) or "list" (standard dashboard)
  const [viewMode, setViewMode] = useState<"mindmap" | "list">("mindmap");
  
  // Active tab inside list view: "courses" | "internships" | "skills" | "career"
  const [activeTab, setActiveTab] = useState<"courses" | "internships" | "skills" | "career">("courses");
  
  // Custom expandable sub-nodes (unlimited ideas/milestones linked in mindmap)
  const [customIdeas, setCustomIdeas] = useState<CustomIdeaNode[]>([]);
  
  // Mentor interactive chat
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "mentor"; text: string }[]>([
    { sender: "mentor", text: "Bonjour ! Je suis votre mentor IA d'orientation Scrivya. Entrez votre objectif académique ou professionnel et je concevrai pour vous une feuille de route complète et une carte mentale interactive !" }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  
  // Inline edit state
  const [editingItem, setEditingItem] = useState<{ type: string; id: string } | null>(null);

  // Suggested preset paths
  const suggestions = [
    { label: "Ingénieur de Recherche IA & ML d'élite", fr: "Devenir Ingénieur de recherche IA / Machine Learning d'élite chez Google DeepMind" },
    { label: "Chercheur R&D en Biotechnologies / Génomique", fr: "Devenir Chercheur R&D en Biotechnologies moléculaires et Génomique appliquée" },
    { label: "Analyste Quantitatif en Finance de Marché", fr: "Devenir Analyste Quantitatif (Quant) de haut niveau en Finance de Marché" },
    { label: "Enseignant-Chercheur universitaire en Mathématiques", fr: "Devenir Enseignant-Chercheur universitaire en Mathématiques fondamentales" }
  ];

  // Triggers roadmap creation
  const generateRoadmap = async (goal: string) => {
    if (!goal || goal.trim().length === 0) return;
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal })
      });
      const data = await response.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
        setCustomIdeas([]); // Reset custom ideas
        setChatMessages([
          { 
            sender: "mentor", 
            text: `Merveilleux ! J'ai cartographié votre feuille de route et votre **Carte Mentale Interactive** pour votre projet : **${goal}**.\n\n### 💡 Comment naviguer dans votre carte :\n- Utilisez la **Vue Carte Mentale Interactive** pour explorer graphiquement vos cours, stages, compétences et progression.\n- Cliquez sur n'importe quel nœud pour ouvrir le panneau latéral et cliquez sur **"✨ Élargir ce Concept (IA)"** pour ajouter des sous-idées ou jalonner votre parcours de manière **totalement illimitée** !\n- Posez-moi des questions à droite pour ajuster ce plan en temps réel.` 
          }
        ]);
      }
    } catch (error) {
      console.error("Erreur génération roadmap:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Triggers chat with mentor to change roadmap in real-time
  const handleSendChat = async () => {
    if (!chatInput.trim() || !roadmap) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setIsSendingChat(true);

    try {
      const response = await fetch("/api/chat-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmap, message: userMsg })
      });
      const data = await response.json();
      if (data.roadmap) {
        setRoadmap(data.roadmap);
      }
      setChatMessages(prev => [...prev, { sender: "mentor", text: data.response || "J'ai bien pris en compte votre demande et ajusté votre roadmap en conséquence." }]);
    } catch (error) {
      console.error("Erreur chat mentor:", error);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Callback to let Node expansion talk to Mentor Chat
  const handleChatAboutNode = async (nodeTitle: string, nodeType: string) => {
    if (!roadmap) return;
    setIsSendingChat(true);
    const textMsg = `Je viens d'ajouter un sous-concept ou d'étendre la branche « ${nodeTitle} » (${nodeType}) sur ma carte mentale. Donne-moi tes conseils de mentor d'élite sur l'importance et la maîtrise de ce sujet.`;
    setChatMessages(prev => [...prev, { sender: "user", text: `Approfondissement : branch « ${nodeTitle} »` }]);

    try {
      const response = await fetch("/api/chat-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmap, message: textMsg })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { 
        sender: "mentor", 
        text: data.response || `Excellent choix ! Le sous-concept rattaché à « ${nodeTitle} » est stratégique. Travaillez rigoureusement la théorie associée et appliquez-la rapidement dans vos projets personnels pour valider votre expertise.` 
      }]);
    } catch (error) {
      console.error("Erreur chat node reference:", error);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Custom node state handlers (unlimited expansions)
  const handleAddCustomIdea = (parentId: string, title: string, desc: string, isAI: boolean) => {
    const newIdea: CustomIdeaNode = {
      id: `custom_idea_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      parentId,
      title,
      description: desc,
      category: isAI ? "ai_expansion" : "idea"
    };
    setCustomIdeas(prev => [...prev, newIdea]);
  };

  const handleDeleteCustomIdea = (id: string) => {
    setCustomIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  const handleUpdateItemStatus = (type: "course" | "internship" | "skill" | "career", id: string, newStatus: any) => {
    if (!roadmap) return;
    const updated = { ...roadmap };
    if (type === "course") {
      updated.courses = updated.courses.map(c => c.id === id ? { ...c, status: newStatus } : c);
    } else if (type === "skill") {
      updated.skills = updated.skills.map(s => s.id === id ? { ...s, level: newStatus } : s);
    }
    setRoadmap(updated);
  };

  // Beautiful multi-page PDF generator that bypasses iframe sandbox limits
  const handlePrintPDF = () => {
    if (!roadmap) return;
    try {
      const doc = new jsPDF();
      let yOffset = 20;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Helper function to add text with wrapping and page check
      const addText = (text: string, size: number, style: "normal" | "bold" | "italic" = "normal", color: [number, number, number] = [0, 0, 0], bottomSpacing: number = 5) => {
        doc.setFont("helvetica", style);
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        
        const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
        
        // Check if we need a new page
        const neededHeight = lines.length * (size * 0.4) + bottomSpacing;
        if (yOffset + neededHeight > pageHeight - margin) {
          doc.addPage();
          yOffset = margin;
        }

        doc.text(lines, margin, yOffset);
        yOffset += lines.length * (size * 0.4) + bottomSpacing;
      };

      // Header Block
      doc.setFillColor(15, 23, 42); // slate-900 background for a sleek header banner
      doc.rect(0, 0, pageWidth, 40, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text("SCRIVYA MENTORAT-IA", margin, 18);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(244, 63, 94); // Rose-500 accent color
      doc.text("RAPPORT D'ORIENTATION ET ROADMAP PROFESSIONNELLE D'ELITE", margin, 28);
      
      yOffset = 55;

      // Executive Summary
      addText("OBJECTIF DE CARRIÈRE TRACÉ", 11, "bold", [244, 63, 94], 3);
      addText(roadmap.goal, 14, "bold", [15, 23, 42], 5);
      addText(roadmap.overview, 10, "normal", [71, 85, 105], 10);

      // Section 1: Courses & Curriculum
      addText("1. CURSUS & ENSEIGNEMENTS ACADÉMIQUES", 12, "bold", [244, 63, 94], 5);
      roadmap.courses.forEach((course) => {
        addText(`${course.code} : ${course.name} (${course.status === "completed" ? "Fait" : course.status === "inprogress" ? "En cours" : "À faire"})`, 10, "bold", [15, 23, 42], 2);
        addText(course.description, 9, "normal", [71, 85, 105], 2);
        addText(`Compétences visées : ${course.skillsAcquired.join(", ")}`, 8.5, "italic", [156, 163, 175], 5);
      });

      yOffset += 5;

      // Section 2: Internships
      addText("2. INSERTION PROFESSIONNELLE & STAGES", 12, "bold", [244, 63, 94], 5);
      roadmap.internships.forEach((intern) => {
        addText(intern.title, 10, "bold", [15, 23, 42], 2);
        addText(`Organisations cibles : ${intern.companyTypes.join(", ")} • Période : ${intern.timeline}`, 9, "bold", [51, 65, 85], 2);
        addText(`Stratégie d'élite : ${intern.strategy}`, 9, "normal", [71, 85, 105], 2);
        addText(`Projets d'application recommandés :`, 9, "bold", [51, 65, 85], 1);
        intern.recommendedProjects.forEach((proj) => {
          addText(`- ${proj}`, 8.5, "normal", [71, 85, 105], 1);
        });
        yOffset += 4;
      });

      yOffset += 5;

      // Section 3: Skills
      addText("3. RÉFÉRENTIEL DES COMPÉTENCES CRITIQUES", 12, "bold", [244, 63, 94], 5);
      roadmap.skills.forEach((skill) => {
        addText(`${skill.name} (${skill.category.toUpperCase()} - ${skill.importance}) • Niveau Initial : ${skill.level}%`, 10, "bold", [15, 23, 42], 2);
        addText(`Ressources recommandées : ${skill.resources.join(", ")}`, 9, "normal", [71, 85, 105], 4);
      });

      yOffset += 5;

      // Section 4: Career path steps
      addText("4. PERSPECTIVES D'ÉVOLUTION ET CARRIÈRE", 12, "bold", [244, 63, 94], 5);
      roadmap.careerPath.forEach((step, idx) => {
        addText(`${idx + 1}. ${step.title} (${step.timeframe}) ${step.salaryRange ? `• Salaire estimé : ${step.salaryRange}` : ""}`, 10, "bold", [15, 23, 42], 2);
        addText(`Responsabilités clés : ${step.responsibilities.join(", ")}`, 9, "normal", [71, 85, 105], 2);
        addText(`Jalon critique de réussite : ${step.criticalMilestone}`, 9, "bold", [244, 63, 94], 5);
      });

      // Section 5: Custom Mindmap Expansions
      const baseIdeas = customIdeas;
      if (baseIdeas.length > 0) {
        yOffset += 5;
        addText("5. EXTENSIONS DE CONCEPTS ET RECHERCHES (NOTEBOOKLM)", 12, "bold", [244, 63, 94], 5);
        baseIdeas.forEach((idea) => {
          addText(`${idea.title} [${idea.category === "ai_expansion" ? "Expansion IA" : "Idée Perso"}]`, 10, "bold", [15, 23, 42], 2);
          addText(idea.description, 9, "normal", [71, 85, 105], 4);
        });
      }

      // Save PDF to file download
      const safeFileName = roadmap.goal
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .substring(0, 30);
      doc.save(`scrivya_roadmap_${safeFileName}.pdf`);
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      alert("Une erreur s'est produite lors de la génération du PDF. Nous essayons d'ouvrir le panneau d'impression standard en secours.");
      window.print();
    }
  };

  return (
    <div className={`w-full min-h-screen ${isLight ? "bg-white text-slate-900" : "bg-slate-950 text-slate-100"} flex flex-col p-4 md:p-6 transition-all`}>
      {/* CUSTOM ANIMATION & PRINT STYLE OVERLAYS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-report, .printable-report * {
            visibility: visible;
          }
          .printable-report {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background-color: white !important;
            color: black !important;
          }
        }
      `}</style>

      {/* 1. SETUP PANEL: SHOWN WHEN NO ROADMAP EXIST YET */}
      {!roadmap && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto py-12 px-4 text-center">
          <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 border border-fuchsia-500/20 shadow-md">
            <Sparkles className="w-10 h-10 text-fuchsia-500 animate-pulse" />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-600 bg-clip-text text-transparent">
            Scrivya Mentorat-IA
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mb-8 leading-relaxed">
            Établissez un plan d'excellence académique et une carte mentale interactive gérée par IA. Configurez votre objectif et élargissez vos idées de recherche sans aucune limite.
          </p>

          {/* Prompt Goal Input */}
          <div className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 mb-8 items-stretch md:items-center">
            <input
              type="text"
              placeholder="Ex: Devenir Chercheur d'élite en IA / NLP appliquée à l'Énergie..."
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              disabled={isGenerating}
              onKeyDown={(e) => { if (e.key === 'Enter') generateRoadmap(goalInput); }}
              className="flex-grow bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:text-white text-sm"
            />
            <button
              onClick={() => generateRoadmap(goalInput)}
              disabled={isGenerating || !goalInput.trim()}
              className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Conception...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tracer la Roadmap</span>
                </>
              )}
            </button>
          </div>

          {/* Goal presets suggestions */}
          <div className="text-left w-full">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 text-center">
              Parcours d'Excellence Recommandés
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setGoalInput(s.fr);
                    generateRoadmap(s.fr);
                  }}
                  disabled={isGenerating}
                  className="flex items-start text-left p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-fuchsia-500/5 hover:border-fuchsia-500/20 transition-all group cursor-pointer"
                >
                  <div className="mr-3 mt-1 text-fuchsia-500">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-fuchsia-500 transition-colors">
                      {s.label}
                    </h5>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                      {s.fr}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN ACTIVE WORKSPACE PANEL: SHOWN ONCE ROADMAP IS GENERATED */}
      {roadmap && (
        <div className="flex-1 flex flex-col gap-4 print:hidden">
          {/* HEADER ROW */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToEditor}
                className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-all"
                title="Retour à l'Éditeur Scrivya"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold bg-fuchsia-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Mentorat-IA
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Orientation d'élite
                  </span>
                </div>
                <h2 className="font-bold text-base text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  {roadmap.goal}
                </h2>
              </div>
            </div>

            {/* SWITCH WORKSPACE VIEWS & EXPORT UTILITIES */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("mindmap")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === "mindmap"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Carte Mentale</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === "list"
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Tableau de Bord</span>
                </button>
              </div>

              {/* PDF EXPORT TRIGGER */}
              <button
                onClick={handlePrintPDF}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                title="Générer un rapport PDF académique et formel"
              >
                <FileDown className="w-4 h-4" />
                <span>Exporter la Roadmap (PDF)</span>
              </button>
            </div>
          </div>

          {/* TWO-COLUMN LAYOUT: WORKSPACE (70%) + MENTOR DIALOGUE (30%) */}
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-10 gap-4">
            {/* COLUMN A: CORE ROADMAP DISPLAY AREA (7/10 WIDTH) */}
            <div className="lg:col-span-7 flex flex-col min-h-[500px]">
              {viewMode === "mindmap" ? (
                /* INTERACTIVE INF-CANVAS MIND MAP WRAPPER */
                <AIMentorMindMapCanvas
                  roadmap={roadmap}
                  customIdeas={customIdeas}
                  onAddCustomIdea={handleAddCustomIdea}
                  onDeleteCustomIdea={handleDeleteCustomIdea}
                  onUpdateItemStatus={handleUpdateItemStatus}
                  onChatAboutNode={handleChatAboutNode}
                  isLight={isLight}
                />
              ) : (
                /* STANDARD TABULAR LIST VIEW */
                <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-5 flex flex-col flex-grow">
                  {/* Dashboard Tabs switcher */}
                  <div className="flex border-b border-slate-100 dark:border-slate-800 pb-3 gap-1.5 overflow-x-auto">
                    {[
                      { id: "courses", label: "📚 Cursus & Cours", icon: <GraduationCap className="w-4 h-4" /> },
                      { id: "internships", label: "💼 Stages & Projets", icon: <Briefcase className="w-4 h-4" /> },
                      { id: "skills", label: "🎯 Compétences", icon: <Award className="w-4 h-4" /> },
                      { id: "career", label: "🚀 Progression Pro", icon: <TrendingUp className="w-4 h-4" /> }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                          activeTab === tab.id
                            ? "bg-fuchsia-500 text-white shadow-sm"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Details lists */}
                  <div className="flex-grow mt-4 overflow-y-auto max-h-[500px] space-y-3 pr-1">
                    {activeTab === "courses" && (
                      <div className="space-y-3">
                        {roadmap.courses.map((course) => (
                          <div key={course.id} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-[10px] font-bold text-fuchsia-500">{course.code}</span>
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{course.name}</h4>
                              </div>
                              <select
                                value={course.status}
                                onChange={(e) => handleUpdateItemStatus("course", course.id, e.target.value)}
                                className="text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 focus:outline-none dark:text-white"
                              >
                                <option value="todo">À faire</option>
                                <option value="inprogress">En cours</option>
                                <option value="completed">Terminé</option>
                              </select>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-justify leading-relaxed">
                              {course.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {course.skillsAcquired.map((skill, idx) => (
                                <span key={idx} className="text-[9px] font-semibold bg-fuchsia-50 dark:bg-fuchsia-950/20 text-fuchsia-600 dark:text-fuchsia-400 px-2 py-0.5 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "internships" && (
                      <div className="space-y-3">
                        {roadmap.internships.map((intern) => (
                          <div key={intern.id} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{intern.title}</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {intern.companyTypes.map((type, idx) => (
                                <span key={idx} className="text-[10px] font-bold bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full">
                                  {type}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                              <p><strong>Timeline recommandée :</strong> {intern.timeline}</p>
                              <p className="text-justify leading-relaxed"><strong>Stratégie de candidature d'élite :</strong> {intern.strategy}</p>
                            </div>
                            <div className="border-t border-slate-100 dark:border-slate-800/60 pt-2">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">
                                Idées de Projets Académiques &amp; Techniques :
                              </span>
                              <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-0.5 pl-1">
                                {intern.recommendedProjects.map((p, idx) => (
                                  <li key={idx} className="text-justify">{p}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "skills" && (
                      <div className="space-y-3">
                        {roadmap.skills.map((skill) => (
                          <div key={skill.id} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                            <div className="flex items-center justify-between mb-1.5">
                              <div>
                                <span className="text-[10px] font-bold uppercase text-emerald-500">{skill.category}</span>
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{skill.name}</h4>
                              </div>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${skill.level}%` }} />
                            </div>
                            <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                              <strong>Ressources d'excellence :</strong> {skill.resources.join(", ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "career" && (
                      <div className="space-y-3">
                        {roadmap.careerPath.map((step, idx) => (
                          <div key={step.id} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                                {idx + 1}. {step.title}
                              </h4>
                              <span className="text-xs font-semibold bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full">
                                {step.timeframe}
                              </span>
                            </div>
                            {step.salaryRange && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                Rémunération indicative : {step.salaryRange}
                              </p>
                            )}
                            <div className="text-xs text-slate-600 dark:text-slate-300 text-justify">
                              <strong>Responsabilités clés :</strong> {step.responsibilities.join(", ")}
                            </div>
                            <p className="text-xs text-amber-600 dark:text-amber-400 leading-snug">
                              <strong>Jalon de réussite critique :</strong> {step.criticalMilestone}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* COLUMN B: MENTOR DIALOGUE SIDEBAR (3/10 WIDTH) */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col h-[500px] lg:h-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-fuchsia-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Mentor d'Élite</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Conseils</span>
                </div>
              </div>

              {/* Chat Message thread */}
              <div className="flex-grow overflow-y-auto space-y-3 pr-1 text-xs select-text">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed text-justify shadow-sm border ${
                      msg.sender === "user"
                        ? "bg-fuchsia-500 text-white border-transparent"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isSendingChat && (
                  <div className="flex justify-start">
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center gap-1 text-slate-400">
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyse en cours...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Send Input Form */}
              <div className="mt-3 flex gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Posez une question à Scrivya..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isSendingChat}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                  className="flex-grow bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs focus:outline-none dark:text-white"
                />
                <button
                  onClick={handleSendChat}
                  disabled={isSendingChat || !chatInput.trim()}
                  className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white p-2 rounded-lg transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DEDICATED EXQUISITE PUBLICATION-GRADE PRINT OVERLAY (HIDDEN ON SCREEN, VISIBLE IN PRINT-MODE) */}
      {roadmap && (
        <div className="hidden printable-report p-10 font-serif leading-relaxed text-black bg-white max-w-[21cm] mx-auto">
          <div className="border-b-4 border-black pb-4 mb-6">
            <h1 className="text-center font-bold text-2xl uppercase tracking-wider">
              Dossier d'Orientation Académique &amp; Planification de Carrière d'Élite
            </h1>
            <p className="text-center italic text-xs mt-2">
              Généré par Scrivya Mentorat-IA • Conforme aux exigences d'excellence universitaire
            </p>
          </div>

          {/* Goal & Executive Summary Section */}
          <div className="space-y-4 mb-8">
            <h2 className="font-bold text-lg border-b border-gray-400 pb-1 uppercase tracking-wide">
              1. Perspective &amp; Objectif de Carrière
            </h2>
            <div className="pl-2 border-l-2 border-black">
              <p className="font-bold text-sm">Objectif principal :</p>
              <p className="text-sm mt-0.5">{roadmap.goal}</p>
            </div>
            <p className="text-sm text-justify">
              {roadmap.overview}
            </p>
          </div>

          {/* Core Curriculum Section */}
          <div className="space-y-4 mb-8">
            <h2 className="font-bold text-lg border-b border-gray-400 pb-1 uppercase tracking-wide">
              2. Plan d'Études &amp; Cursus Académique
            </h2>
            <div className="space-y-3">
              {roadmap.courses.map((course) => (
                <div key={course.id} className="text-sm">
                  <div className="flex justify-between font-bold">
                    <span>{course.code} : {course.name}</span>
                    <span className="uppercase text-[11px] font-semibold">[{course.status === "completed" ? "Fait" : course.status === "inprogress" ? "En cours" : "À faire"}]</span>
                  </div>
                  <p className="text-[12px] text-justify text-gray-700 italic mt-0.5">{course.description}</p>
                  <p className="text-[11px] mt-1"><strong>Compétences acquises :</strong> {course.skillsAcquired.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Internships & Tactical Projects Section */}
          <div className="space-y-4 mb-8" style={{ pageBreakBefore: "always" }}>
            <h2 className="font-bold text-lg border-b border-gray-400 pb-1 uppercase tracking-wide">
              3. Insertion Professionnelle &amp; Recommandations de Stages
            </h2>
            <div className="space-y-4">
              {roadmap.internships.map((intern) => (
                <div key={intern.id} className="text-sm space-y-1">
                  <h4 className="font-bold">{intern.title}</h4>
                  <p className="text-[12px]"><strong>Organisations cibles :</strong> {intern.companyTypes.join(", ")} • <strong>Timeline :</strong> {intern.timeline}</p>
                  <p className="text-[12px] text-justify"><strong>Tactique de candidature :</strong> {intern.strategy}</p>
                  <p className="text-[11px]"><strong>Projets d'application recommandés :</strong></p>
                  <ul className="list-disc list-inside text-[11px] pl-2 space-y-0.5">
                    {intern.recommendedProjects.map((proj, idx) => (
                      <li key={idx}>{proj}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Competency Reference Model Section */}
          <div className="space-y-4 mb-8">
            <h2 className="font-bold text-lg border-b border-gray-400 pb-1 uppercase tracking-wide">
              4. Référentiel des Compétences Critiques
            </h2>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black">
                  <th className="py-1 font-bold">Compétence</th>
                  <th className="py-1 font-bold">Catégorie</th>
                  <th className="py-1 font-bold text-center">Niveau Initial</th>
                  <th className="py-1 font-bold">Ressources Certifiantes</th>
                </tr>
              </thead>
              <tbody>
                {roadmap.skills.map((skill) => (
                  <tr key={skill.id} className="border-b border-gray-200">
                    <td className="py-1 font-semibold">{skill.name}</td>
                    <td className="py-1 uppercase text-[10px]">{skill.category} ({skill.importance})</td>
                    <td className="py-1 text-center font-semibold">{skill.level}%</td>
                    <td className="py-1 text-gray-700 italic">{skill.resources.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Career Path Stages Section */}
          <div className="space-y-4 mb-8">
            <h2 className="font-bold text-lg border-b border-gray-400 pb-1 uppercase tracking-wide">
              5. Phases d'Évolution de Carrière
            </h2>
            <div className="space-y-3">
              {roadmap.careerPath.map((car) => (
                <div key={car.id} className="text-sm">
                  <div className="flex justify-between font-bold">
                    <span>{car.title}</span>
                    <span>{car.timeframe} {car.salaryRange ? `(${car.salaryRange})` : ""}</span>
                  </div>
                  <p className="text-[11px] text-gray-700 mt-0.5"><strong>Responsabilités :</strong> {car.responsibilities.join(", ")}</p>
                  <p className="text-[11px] font-semibold text-gray-900">Jalon critique : {car.criticalMilestone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Extended Ideas / Unlimited Conceptions Section */}
          {customIdeas.length > 0 && (
            <div className="space-y-4 mb-8" style={{ pageBreakBefore: "always" }}>
              <h2 className="font-bold text-lg border-b border-gray-400 pb-1 uppercase tracking-wide">
                6. Conceptions et Travaux d'Expansion Supplémentaires
              </h2>
              <div className="space-y-3">
                {customIdeas.map((idea) => (
                  <div key={idea.id} className="text-sm">
                    <span className="font-bold">{idea.title}</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded ml-2 uppercase tracking-wide">
                      {idea.category === "ai_expansion" ? "Expansion par l'IA" : "Idée Perso"}
                    </span>
                    <p className="text-[11px] text-justify text-gray-700 mt-1">
                      {idea.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
