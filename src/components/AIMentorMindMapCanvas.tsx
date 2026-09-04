import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  X, 
  ChevronRight, 
  BookOpen, 
  Award, 
  Briefcase, 
  TrendingUp, 
  Compass, 
  HelpCircle, 
  Activity, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  ZoomIn, 
  ZoomOut, 
  Move,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Course, Internship, Skill, CareerStep, CustomIdeaNode, MentorRoadmap } from "../types/mentor";

interface AIMentorMindMapCanvasProps {
  roadmap: MentorRoadmap;
  customIdeas: CustomIdeaNode[];
  onAddCustomIdea: (parentId: string, title: string, desc: string, isAI: boolean) => void;
  onDeleteCustomIdea: (id: string) => void;
  onUpdateItemStatus: (type: "course" | "internship" | "skill" | "career", id: string, newStatus: any) => void;
  onChatAboutNode: (nodeTitle: string, nodeType: string) => void;
  isLight: boolean;
}

interface GraphNode {
  id: string;
  parentId: string | null;
  title: string;
  description: string;
  type: "goal" | "pillar" | "course" | "internship" | "skill" | "career" | "custom";
  status?: "todo" | "inprogress" | "completed";
  level?: number; // for skills
  category?: string; // category sub-tag
  x: number;
  y: number;
}

export default function AIMentorMindMapCanvas({
  roadmap,
  customIdeas,
  onAddCustomIdea,
  onDeleteCustomIdea,
  onUpdateItemStatus,
  onChatAboutNode,
  isLight
}: AIMentorMindMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pan and zoom states
  const [pan, setPan] = useState({ x: 300, y: 300 });
  const [zoom, setZoom] = useState(0.85);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Node selection state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [newSubNodeTitle, setNewSubNodeTitle] = useState("");
  const [newSubNodeDesc, setNewSubNodeDesc] = useState("");
  const [isExpandingAI, setIsExpandingAI] = useState(false);

  // Auto-center canvas on load
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({
        x: rect.width / 2,
        y: rect.height / 2 - 20
      });
    }
  }, [roadmap.goal]);

  // PAN MOUSE HANDLERS
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".node-card") || (e.target as HTMLElement).closest(".drawer-pane")) {
      return; // Do not drag when clicking cards or side drawer
    }
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom helpers
  const handleZoomIn = () => setZoom(z => Math.min(1.5, z + 0.1));
  const handleZoomOut = () => setZoom(z => Math.max(0.4, z - 0.1));
  const handleZoomReset = () => {
    setZoom(0.85);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2, y: rect.height / 2 - 20 });
    }
  };

  // WHEEL ZOOM
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 0.05;
    if (e.deltaY < 0) {
      setZoom(z => Math.min(1.5, z + zoomFactor));
    } else {
      setZoom(z => Math.max(0.4, z - zoomFactor));
    }
  };

  // 1. COMPUTE ALL GRAPH NODES DYNAMICALLY
  const nodes: GraphNode[] = [];
  const connections: { id: string; from: string; to: string; color: string }[] = [];

  // Center node
  nodes.push({
    id: "root",
    parentId: null,
    title: roadmap.goal,
    description: "Votre ambition professionnelle phare tracée par Scrivya Mentorat-IA.",
    type: "goal",
    x: 0,
    y: 0
  });

  // Pillars around the goal
  const pillars = [
    { id: "p_courses", title: "📚 Cursus & Cours", type: "pillar" as const, x: -220, y: -160, color: "from-pink-500 to-rose-500" },
    { id: "p_internships", title: "💼 Stages & Projets", type: "pillar" as const, x: 220, y: -160, color: "from-sky-500 to-blue-500" },
    { id: "p_skills", title: "🎯 Compétences", type: "pillar" as const, x: -220, y: 160, color: "from-emerald-500 to-teal-500" },
    { id: "p_career", title: "🚀 Plan de Carrière", type: "pillar" as const, x: 220, y: 160, color: "from-violet-500 to-fuchsia-500" },
    { id: "p_ideas", title: "💡 Idées & Concepts", type: "pillar" as const, x: 0, y: 280, color: "from-amber-500 to-orange-500" }
  ];

  pillars.forEach(p => {
    nodes.push({
      id: p.id,
      parentId: "root",
      title: p.title,
      description: `Pôle d'excellence : ${p.title}`,
      type: "pillar",
      x: p.x,
      y: p.y
    });
    connections.push({
      id: `root_to_${p.id}`,
      from: "root",
      to: p.id,
      color: "rgba(156, 163, 175, 0.4)" // Gray connector
    });
  });

  // Add Course Nodes (connected to Courses Pillar)
  roadmap.courses.forEach((c, i) => {
    const total = roadmap.courses.length;
    const spacing = 100;
    const startY = -160 - ((total - 1) * spacing) / 2;
    const nodeY = startY + i * spacing;
    
    nodes.push({
      id: c.id,
      parentId: "p_courses",
      title: `${c.code} : ${c.name}`,
      description: c.description,
      type: "course",
      status: c.status,
      category: c.skillsAcquired.slice(0, 2).join(", "),
      x: -480,
      y: nodeY
    });

    connections.push({
      id: `p_courses_to_${c.id}`,
      from: "p_courses",
      to: c.id,
      color: "rgba(244, 63, 94, 0.4)" // Pink curve
    });
  });

  // Add Internship Nodes (connected to Internships Pillar)
  roadmap.internships.forEach((inst, i) => {
    const total = roadmap.internships.length;
    const spacing = 110;
    const startY = -160 - ((total - 1) * spacing) / 2;
    const nodeY = startY + i * spacing;

    nodes.push({
      id: inst.id,
      parentId: "p_internships",
      title: inst.title,
      description: `Secteurs : ${inst.companyTypes.join(", ")}. Stratégie : ${inst.strategy}`,
      type: "internship",
      category: inst.timeline,
      x: 480,
      y: nodeY
    });

    connections.push({
      id: `p_intern_to_${inst.id}`,
      from: "p_internships",
      to: inst.id,
      color: "rgba(14, 165, 233, 0.4)" // Sky curve
    });
  });

  // Add Skill Nodes (connected to Skills Pillar)
  roadmap.skills.forEach((sk, i) => {
    const total = roadmap.skills.length;
    const spacing = 90;
    const startY = 160 - ((total - 1) * spacing) / 2;
    const nodeY = startY + i * spacing;

    nodes.push({
      id: sk.id,
      parentId: "p_skills",
      title: sk.name,
      description: `Niveau initial : ${sk.level}%. Ressources : ${sk.resources.join(", ")}`,
      type: "skill",
      level: sk.level,
      category: `${sk.category.toUpperCase()} - ${sk.importance}`,
      x: -480,
      y: nodeY
    });

    connections.push({
      id: `p_skill_to_${sk.id}`,
      from: "p_skills",
      to: sk.id,
      color: "rgba(16, 185, 129, 0.4)" // Emerald curve
    });
  });

  // Add Career Steps Nodes (connected to Career Pillar)
  roadmap.careerPath.forEach((car, i) => {
    const total = roadmap.careerPath.length;
    const spacing = 100;
    const startY = 160 - ((total - 1) * spacing) / 2;
    const nodeY = startY + i * spacing;

    nodes.push({
      id: car.id,
      parentId: "p_career",
      title: car.title,
      description: `Salaire : ${car.salaryRange || "N/A"}. Jalon d'excellence : ${car.criticalMilestone}`,
      type: "career",
      category: car.timeframe,
      x: 480,
      y: nodeY
    });

    connections.push({
      id: `p_career_to_${car.id}`,
      from: "p_career",
      to: car.id,
      color: "rgba(139, 92, 246, 0.4)" // Violet curve
    });
  });

  // Helper to trace custom ideas recursively and compute their visual coordinates
  const computeCustomNodeCoordinates = (parent: GraphNode, levelDepth: number) => {
    const children = customIdeas.filter(idea => idea.parentId === parent.id);
    if (children.length === 0) return;

    children.forEach((child, index) => {
      // Hemisphere strategy
      const isLeft = parent.x < 0;
      const xOffset = isLeft ? -240 : 240;
      const childX = parent.x + xOffset;
      
      // Vertical spreading
      const spreadSpacing = 100;
      const childY = parent.y + (index - (children.length - 1) / 2) * spreadSpacing;

      const graphChild: GraphNode = {
        id: child.id,
        parentId: parent.id,
        title: child.title,
        description: child.description,
        type: "custom",
        category: child.category === "ai_expansion" ? "✨ IA Expansion" : "💡 Idée",
        x: childX,
        y: childY
      };

      nodes.push(graphChild);
      connections.push({
        id: `custom_conn_${child.id}`,
        from: parent.id,
        to: child.id,
        color: child.category === "ai_expansion" ? "rgba(217, 70, 239, 0.6)" : "rgba(245, 158, 11, 0.5)"
      });

      // Recurse for deeper sub-concepts
      computeCustomNodeCoordinates(graphChild, levelDepth + 1);
    });
  };

  // Connect base custom ideas directly attached to the general Idea Pillar "p_ideas"
  const baseIdeas = customIdeas.filter(idea => idea.parentId === "p_ideas" || !nodes.find(n => n.id === idea.parentId));
  baseIdeas.forEach((child, index) => {
    const spreadSpacing = 120;
    const startX = -((baseIdeas.length - 1) * spreadSpacing) / 2;
    const childX = startX + index * spreadSpacing;
    const childY = 410; // offset downwards from "p_ideas"

    const graphChild: GraphNode = {
      id: child.id,
      parentId: "p_ideas",
      title: child.title,
      description: child.description,
      type: "custom",
      category: child.category === "ai_expansion" ? "✨ IA Expansion" : "💡 Idée",
      x: childX,
      y: childY
    };

    nodes.push(graphChild);
    connections.push({
      id: `custom_conn_${child.id}`,
      from: "p_ideas",
      to: child.id,
      color: "rgba(245, 158, 11, 0.5)"
    });

    computeCustomNodeCoordinates(graphChild, 1);
  });

  // Also parse custom ideas connected to courses, skills, internships or career steps
  const leafNodes = nodes.filter(n => ["course", "internship", "skill", "career"].includes(n.type));
  leafNodes.forEach(leaf => {
    computeCustomNodeCoordinates(leaf, 1);
  });

  // Retrieve current active node details
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const isCustomSelected = selectedNode?.type === "custom";

  // BEZIER SVG CONNECTOR GENERATOR
  const getBezierPath = (x1: number, y1: number, x2: number, y2: number) => {
    // S-curve shape
    const controlX = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${controlX} ${y1}, ${controlX} ${y2}, ${x2} ${y2}`;
  };

  // AI EXPANSION LOGIC (INTEGRATED SMART CLIENT SIMULATOR)
  const triggerAIExpansion = async () => {
    if (!selectedNodeId || !selectedNode) return;
    setIsExpandingAI(true);

    try {
      const response = await fetch("/api/expand-node", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeTitle: selectedNode.title,
          nodeType: selectedNode.type,
          nodeDescription: selectedNode.description,
          goal: roadmap.goal
        })
      });

      if (!response.ok) throw new Error("Erreur de communication avec l'API d'expansion");
      const data = await response.json();

      if (data.expansions && Array.isArray(data.expansions)) {
        data.expansions.forEach((c: { title: string; desc: string }) => {
          onAddCustomIdea(selectedNode.id, c.title, c.desc, true);
        });
      } else {
        throw new Error("Format d'expansion de concept invalide");
      }
    } catch (err) {
      console.error("Erreur expand-node via l'API, utilisation du simulateur local :", err);
      // Simulate elite intellectual expansion calculation
      const parentTitle = selectedNode.title;
      let expandedConcepts = [
        {
          title: `Approfondissement : Modélisation avancée de « ${parentTitle.split(":")[0]} »`,
          desc: "Décorticage scientifique des concepts sous-jacents, analyses comparatives et séminaires de perfectionnement méthodologique."
        },
        {
          title: `Application de terrain : Prototype & R&D appliqué`,
          desc: "Création d'un jalon pratique autonome et publication de résultats de recherche ou code libre d'autorité."
        }
      ];

      // Custom suggestions based on node types
      if (selectedNode.type === "course") {
        expandedConcepts = [
          {
            title: `Projet Pratique : Micro-implémentation autonome`,
            desc: `Construire un cas concret d'application pour consolider les connaissances de ${selectedNode.title}.`
          },
          {
            title: `Lectures Scientifiques Clés`,
            desc: "Sélection d'articles et d'ouvrages universitaires d'autorité sur ce sujet académique précis."
          }
        ];
      } else if (selectedNode.type === "skill") {
        expandedConcepts = [
          {
            title: `Certification Recommandée : Validation de Master`,
            desc: `Passer une certification d'excellence académique ou d'éditeur industriel de premier plan pour ${selectedNode.title}.`
          },
          {
            title: `Laboratoire d'exercice pratique`,
            desc: "Pratique continue par résolution de cas cliniques, hackathons ou revues de pairs."
          }
        ];
      } else if (selectedNode.type === "internship") {
        expandedConcepts = [
          {
            title: "Projet de Recherche Préparatoire",
            desc: "Rédiger un livrable blanc de 5 pages démontrant votre maîtrise sectorielle en amont des entretiens de recrutement."
          },
          {
            title: "Réseautage Stratégique via Alumni",
            desc: "Prendre contact avec 3 anciens diplômés travaillant actuellement dans ces organisations d'élite."
          }
        ];
      }

      // Add suggestions
      expandedConcepts.forEach(c => {
        onAddCustomIdea(selectedNode.id, c.title, c.desc, true);
      });
    } finally {
      setIsExpandingAI(false);
      
      // Let mentor comment on this expansion in background chat!
      onChatAboutNode(selectedNode.title, selectedNode.type);
    }
  };

  // Manual sub-node insertion
  const handleAddManualSubNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNodeId || !newSubNodeTitle.trim()) return;
    onAddCustomIdea(selectedNodeId, newSubNodeTitle.trim(), newSubNodeDesc.trim() || "Aucune description fournie.", false);
    setNewSubNodeTitle("");
    setNewSubNodeDesc("");
  };

  return (
    <div className="relative w-full h-[650px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 select-none">
      <style>{`
        @keyframes line-dash-flow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animated-cables {
          stroke-dasharray: 6 4;
          animation: line-dash-flow 1.5s linear infinite;
        }
        .custom-cables {
          stroke-dasharray: 4 4;
          animation: line-dash-flow 1.2s linear infinite;
        }
      `}</style>

      {/* INFINITE ZOOMABLE CANVAS WRAPPER */}
      <div 
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div 
          className="absolute inset-0 origin-center transition-transform duration-75 ease-out"
          style={{ 
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* BACKGROUND DECORATIVE GRID */}
          <div className="absolute inset-[-2000px] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:bg-[radial-gradient(#334155_1px,transparent_1px)] pointer-events-none" />

          {/* SVG CONNECTIONS LAYER */}
          <svg className="absolute overflow-visible pointer-events-none z-0" style={{ width: 1, height: 1 }}>
            <defs>
              <linearGradient id="rose-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="sky-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {connections.map(conn => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const isAISuggested = customIdeas.find(i => i.id === conn.to && i.category === "ai_expansion");

              return (
                <path
                  key={conn.id}
                  d={getBezierPath(fromNode.x, fromNode.y, toNode.x, toNode.y)}
                  stroke={conn.color}
                  strokeWidth={isAISuggested ? "2.5" : "2"}
                  fill="none"
                  className={
                    isAISuggested 
                      ? "custom-cables stroke-fuchsia-400 dark:stroke-fuchsia-500" 
                      : conn.id.startsWith("custom_conn")
                      ? "custom-cables stroke-amber-400"
                      : "animated-cables"
                  }
                />
              );
            })}
          </svg>

          {/* HTML CARDS LAYER */}
          {nodes.map(node => {
            const isSelected = selectedNodeId === node.id;
            
            // Render styled cards depending on node types
            let cardStyle = "border-slate-200 bg-white text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50";
            let iconElement = <Compass className="w-4 h-4 text-slate-500" />;
            let badgeStyle = "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
            let badgeLabel = "Structure";

            if (node.type === "goal") {
              cardStyle = "border-fuchsia-500 bg-gradient-to-br from-fuchsia-500/10 via-white to-violet-500/10 dark:from-fuchsia-950/20 dark:via-slate-900 dark:to-violet-950/20 shadow-lg font-bold border-2 ring-4 ring-fuchsia-500/10 scale-105";
              iconElement = <Sparkles className="w-5 h-5 text-fuchsia-500 animate-pulse" />;
              badgeStyle = "bg-fuchsia-500 text-white";
              badgeLabel = "Objectif Suprême";
            } else if (node.type === "pillar") {
              cardStyle = "border-slate-300 bg-slate-50/90 text-slate-900 font-semibold dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100 shadow-md border-dashed";
              iconElement = <Activity className="w-4 h-4 text-slate-600 dark:text-slate-300" />;
              badgeStyle = "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200";
              badgeLabel = "Pôle";
            } else if (node.type === "course") {
              iconElement = <BookOpen className="w-4 h-4 text-rose-500" />;
              badgeLabel = "Cours";
              if (node.status === "completed") {
                badgeStyle = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400";
                badgeLabel = "Complété";
                cardStyle += " border-emerald-300 dark:border-emerald-800/40";
              } else if (node.status === "inprogress") {
                badgeStyle = "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400";
                badgeLabel = "En cours";
                cardStyle += " border-amber-300 dark:border-amber-800/40";
              } else {
                badgeStyle = "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400";
              }
            } else if (node.type === "internship") {
              iconElement = <Briefcase className="w-4 h-4 text-sky-500" />;
              badgeStyle = "bg-sky-100 text-sky-800 dark:bg-sky-950/30 dark:text-sky-400";
              badgeLabel = "Projet / Stage";
            } else if (node.type === "skill") {
              iconElement = <Award className="w-4 h-4 text-emerald-500" />;
              badgeStyle = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400";
              badgeLabel = `Niveau: ${node.level}%`;
            } else if (node.type === "career") {
              iconElement = <TrendingUp className="w-4 h-4 text-violet-500" />;
              badgeStyle = "bg-violet-100 text-violet-800 dark:bg-violet-950/30 dark:text-violet-400";
              badgeLabel = "Étape";
            } else if (node.type === "custom") {
              const isAIExt = node.category?.includes("IA");
              iconElement = isAIExt ? <Sparkles className="w-4 h-4 text-fuchsia-500" /> : <HelpCircle className="w-4 h-4 text-amber-500" />;
              badgeStyle = isAIExt ? "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/40 dark:text-fuchsia-400" : "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400";
              badgeLabel = node.category || "Idée";
              cardStyle = isAIExt 
                ? "border-fuchsia-300 bg-gradient-to-r from-fuchsia-50/50 to-white dark:border-fuchsia-900/50 dark:from-fuchsia-950/20 dark:to-slate-900 border"
                : "border-amber-200 bg-gradient-to-r from-amber-50/50 to-white dark:border-amber-900/50 dark:from-amber-950/20 dark:to-slate-900 border";
            }

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`node-card absolute select-none flex flex-col p-3 rounded-xl border shadow-sm transition-shadow duration-150 hover:shadow-md cursor-pointer text-left w-[190px] h-[100px] justify-between ${cardStyle} ${
                  isSelected ? "ring-2 ring-fuchsia-500 dark:ring-fuchsia-400 border-transparent shadow-lg" : ""
                }`}
                style={{ 
                  left: node.x - 95, 
                  top: node.y - 50,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNodeId(node.id);
                }}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="font-semibold text-[11px] leading-tight truncate-two-lines w-[140px]" title={node.title}>
                    {node.title}
                  </span>
                  <div className="flex-shrink-0">
                    {iconElement}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${badgeStyle}`}>
                    {badgeLabel}
                  </span>
                  {node.type !== "goal" && node.type !== "pillar" && (
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CANVAS FLOATING ZOOM CONTROLS */}
      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-200 shadow-md dark:bg-slate-900/90 dark:border-slate-800 pointer-events-auto">
        <button 
          onClick={handleZoomIn} 
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800" 
          title="Zoom +"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-8 text-center select-none">
          {Math.round(zoom * 100)}%
        </span>
        <button 
          onClick={handleZoomOut} 
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800" 
          title="Zoom -"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />
        <button 
          onClick={handleZoomReset} 
          className="p-1 hover:bg-slate-100 rounded-full text-slate-600 dark:text-slate-300 dark:hover:bg-slate-800" 
          title="Recadrer la carte"
        >
          <Move className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="absolute top-4 left-4 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-sm backdrop-blur-sm pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>NotebookLM Mindmap : Double-cliquez pour inspecter &amp; étendre à l'infini</span>
      </div>

      {/* DETAILED NODE DRAWER SLIDE-OUT PANEL */}
      <AnimatePresence>
        {selectedNodeId && selectedNode && (
          <motion.div 
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="drawer-pane absolute top-0 right-0 w-[310px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-20 flex flex-col pointer-events-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-fuchsia-500" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">Détails du Nœud</span>
              </div>
              <button 
                onClick={() => setSelectedNodeId(null)} 
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Concept
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5 leading-snug">
                  {selectedNode.title}
                </h3>
                {selectedNode.category && (
                  <span className="inline-block text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full mt-2">
                    {selectedNode.category}
                  </span>
                )}
              </div>

              {/* Node description */}
              <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                  Description &amp; Stratégie
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
                  {selectedNode.description}
                </p>
              </div>

              {/* Status Manager for Courses */}
              {selectedNode.type === "course" && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Statut du cours
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {["todo", "inprogress", "completed"].map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateItemStatus("course", selectedNode.id, st)}
                        className={`text-[10px] font-semibold py-1 rounded-md transition-all ${
                          selectedNode.status === st
                            ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        {st === "todo" ? "À faire" : st === "inprogress" ? "En cours" : "Fait"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CORE HIGHLIGHT: AI NODE EXPANSION - NOTEBOOKLM STYLE */}
              {selectedNode.type !== "goal" && selectedNode.type !== "pillar" && (
                <div className="pt-2">
                  <button
                    onClick={triggerAIExpansion}
                    disabled={isExpandingAI}
                    className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isExpandingAI ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Calcul de l'IA Scrivya...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span>Élargir ce Concept (IA)</span>
                      </>
                    )}
                  </button>
                  <p className="text-[9px] text-center text-slate-400 mt-1.5 italic">
                    Génère instantanément des sous-concepts et des idées de recherche connectés.
                  </p>
                </div>
              )}

              {/* Add Custom manual child concept */}
              {selectedNode.type !== "pillar" && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2.5">
                  <div className="flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5 text-fuchsia-500" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      Ajouter un sous-concept
                    </span>
                  </div>
                  <form onSubmit={handleAddManualSubNode} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Titre de la sous-idée..."
                      value={newSubNodeTitle}
                      onChange={e => setNewSubNodeTitle(e.target.value)}
                      required
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 dark:text-white"
                    />
                    <textarea
                      placeholder="Description abrégée..."
                      rows={2}
                      value={newSubNodeDesc}
                      onChange={e => setNewSubNodeDesc(e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 dark:text-white resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs py-1.5 rounded-lg transition-all"
                    >
                      Associer au nœud actif
                    </button>
                  </form>
                </div>
              )}

              {/* Chat about this node button */}
              {selectedNode.type !== "goal" && selectedNode.type !== "pillar" && (
                <button
                  onClick={() => onChatAboutNode(selectedNode.title, selectedNode.type)}
                  className="w-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Poser une question au Mentor</span>
                </button>
              )}
            </div>

            {/* Footer containing delete controls for manually-created nodes */}
            {isCustomSelected && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                <button
                  onClick={() => {
                    onDeleteCustomIdea(selectedNode.id);
                    setSelectedNodeId(null);
                  }}
                  className="w-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold text-xs py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer cette idée</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
