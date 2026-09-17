import React, { useState } from "react";
import {
  Layers,
  Users,
  DollarSign,
  BookOpen,
  ArrowRight,
  GitBranch,
  CheckCircle2,
  Sliders,
  Zap,
  School
} from "lucide-react";
import { Lozenge } from "./AtlassianComponents";

interface LandingFeatureShowcaseProps {
  lang: "fr" | "en" | "ar";
  theme?: "dark" | "light";
  onOpenWorkspace: () => void;
}

export default function LandingFeatureShowcase({
  lang,
  onOpenWorkspace,
}: LandingFeatureShowcaseProps) {
  const [activeTab, setActiveTab] = useState<
    "cogs" | "matchmaking" | "figma" | "afnor"
  >("cogs");

  // Tab 1: Interactive COGS simulator
  const [apiCalls, setApiCalls] = useState<number>(25000);
  const [saasPrice, setSaasPrice] = useState<number>(120);
  const [clients, setClients] = useState<number>(40);

  const infrastructureCost = apiCalls * 0.0003; // TND
  const monthlyRevenue = clients * saasPrice;
  const cogsRatio =
    monthlyRevenue > 0
      ? ((infrastructureCost / monthlyRevenue) * 100).toFixed(1)
      : "0";
  const isCompliant = Number(cogsRatio) < 30;

  // Tab 3: Figma-GitHub sync state
  const [isSynced, setIsSynced] = useState(false);

  return (
    <div className="w-full border border-[#e1edff] rounded-[24px] bg-[#ffffff] text-[#111118] overflow-hidden font-sans shadow-[0_4px_0_0_#111118]">
      
      {/* Header Bar */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#e1edff] bg-[#f0f6ff]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2727e6] text-[#ffffff] flex items-center justify-center font-bold text-xs shadow-[0_2px_0_0_#111118]">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-normal text-xs text-[#111118]">PFE-2026</span>
              <span className="text-[#111118]/40 text-xs">/</span>
              <span className="font-normal text-xs text-[#111118]">
                {lang === "ar"
                  ? "محاكي معايير PFE-HUB و STATUT STARTUP ACT"
                  : lang === "en"
                  ? "PFE-Hub & Startup Act Engine"
                  : "Bac à sable : PFE-Hub & Workspace"}
              </span>
            </div>
            <p className="text-[12px] text-[#111118]/70 font-normal">
              {lang === "ar" ? "بيئة اختبار فورية لمعايير التخرج التونسية" : "Simulation en direct des exigences ministérielles"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Lozenge appearance="success">STARTUP ACT TUNISIE</Lozenge>
          <Lozenge appearance="inprogress">AFNOR Z 44-005</Lozenge>
        </div>
      </div>

      {/* Tab Navigation (Haas Grot Text, 400 weight, #2727e6 active indicator) */}
      <div className="flex items-center border-b border-[#e1edff] px-4 overflow-x-auto scrollbar-none bg-[#ffffff]">
        {[
          {
            id: "cogs" as const,
            icon: <DollarSign className="w-4 h-4" />,
            label: lang === "ar" ? "مؤشر COGS < 30%" : lang === "en" ? "COGS Ratio < 30%" : "Moteur COGS < 30%",
            badge: "<30%"
          },
          {
            id: "matchmaking" as const,
            icon: <Users className="w-4 h-4" />,
            label: lang === "ar" ? "التوافق الجامعي" : lang === "en" ? "Cofounder Matchmaking" : "Matchmaking INSAT • IHEC",
            badge: "3 Écoles"
          },
          {
            id: "figma" as const,
            icon: <Layers className="w-4 h-4" />,
            label: lang === "ar" ? "مزامنة Figma ↔ GitHub" : lang === "en" ? "Figma ↔ GitHub Webhooks" : "Figma ↔ GitHub Sync",
            badge: "Webhook"
          },
          {
            id: "afnor" as const,
            icon: <BookOpen className="w-4 h-4" />,
            label: lang === "ar" ? "معايير AFNOR Z 44-005" : lang === "en" ? "AFNOR Z 44-005 Citations" : "Normes AFNOR Z 44-005",
            badge: "Ibid./Op.Cit."
          }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-4 text-xs font-normal flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap -mb-[1px] ${
                isActive
                  ? "border-[#2727e6] text-[#2727e6] bg-[#f0f6ff]/60"
                  : "border-transparent text-[#111118]/70 hover:text-[#111118] hover:border-[#e1edff]"
              }`}
            >
              <span className={isActive ? "text-[#2727e6]" : "text-[#111118]/50"}>{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-normal ${
                isActive
                  ? "bg-[#2727e6] text-[#ffffff]"
                  : "bg-[#e1edff] text-[#111118]"
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8 bg-[#ffffff]">
        {activeTab === "cogs" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="mb-2">
                  <Lozenge appearance="inprogress">MODÉLISATION FINANCIÈRE</Lozenge>
                </div>
                <h3 className="text-2xl font-normal text-[#111118] tracking-tight">
                  {lang === "ar"
                    ? "ضمان ألا تتجاوز تكاليف الخوادم 30% من إيرادات مشروعك"
                    : lang === "en"
                    ? "Ensure Server COGS Remain Under 30% of Projected Revenue"
                    : "Simulateur de conformité COGS < 30% (Startup Act Tunisie)"}
                </h3>
                <p className="text-sm mt-2 text-[#111118]/70 leading-relaxed font-normal">
                  {lang === "ar"
                    ? "تحسب المنصة تلقائياً تكلفة استدعاءات وخوادم AWS ومقارنتها بالإيرادات لاجتياز لجنة تدقيق Startup Act بنجاح."
                    : lang === "en"
                    ? "Automatically projects AWS and cloud infrastructure costs against client revenues to satisfy Tunisia Startup Act auditing committees."
                    : "Calculez en direct le ratio de vos coûts serveurs (AWS, bases de données cloud) face à vos revenus SaaS prévisionnels pour valider votre éligibilité d'État."}
                </p>
              </div>

              {/* Slider Panel */}
              <div className="space-y-5 p-5 rounded-[16px] bg-[#f0f6ff] border border-[#e1edff]">
                <div>
                  <div className="flex justify-between text-xs font-normal text-[#111118] mb-2">
                    <span>
                      {lang === "ar"
                        ? "استدعاءات API شهرياً"
                        : lang === "en"
                        ? "Monthly API Calls"
                        : "Appels API mensuels"}
                    </span>
                    <span className="font-mono text-[#2727e6] font-normal">{apiCalls.toLocaleString()} reqs</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={apiCalls}
                    onChange={(e) => setApiCalls(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#e1edff] rounded-full appearance-none cursor-pointer accent-[#2727e6]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-normal text-[#111118] mb-2">
                    <span>
                      {lang === "ar"
                        ? "عدد العملاء المشتركين"
                        : lang === "en"
                        ? "Active Subscribed Clients"
                        : "Clients actifs SaaS"}
                    </span>
                    <span className="font-mono text-[#2727e6] font-normal">{clients} clients</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={clients}
                    onChange={(e) => setClients(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#e1edff] rounded-full appearance-none cursor-pointer accent-[#2727e6]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-normal text-[#111118] mb-2">
                    <span>
                      {lang === "ar"
                        ? "سعر الاشتراك الشهري (TND)"
                        : lang === "en"
                        ? "Monthly SaaS Price (TND)"
                        : "Abonnement mensuel par client (TND)"}
                    </span>
                    <span className="font-mono text-[#2727e6] font-normal">{saasPrice} TND</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="500"
                    step="10"
                    value={saasPrice}
                    onChange={(e) => setSaasPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#e1edff] rounded-full appearance-none cursor-pointer accent-[#2727e6]"
                  />
                </div>
              </div>
            </div>

            {/* Live Result Card (SuperHi Card with Hard Shadow) */}
            <div className="lg:col-span-5 bg-[#ffffff] p-6 rounded-[24px] border border-[#e1edff] shadow-[0_2px_0_0_#111118] space-y-6">
              <div className="flex items-center justify-between border-b border-[#e1edff] pb-3">
                <span className="text-xs font-mono text-[#111118]/70 uppercase tracking-wider">
                  {lang === "ar" ? "نتيجة التدقيق الفوري" : lang === "en" ? "Real-Time Audit Ratio" : "RATIO DE CONFORMITÉ"}
                </span>
                <Lozenge appearance={isCompliant ? "success" : "danger"}>
                  {isCompliant ? "STARTUP ACT CONFORME" : "NON CONFORME (> 30%)"}
                </Lozenge>
              </div>

              <div className="text-center py-4 bg-[#f0f6ff] rounded-[16px] border border-[#e1edff]">
                <div className={`text-5xl font-normal font-mono ${isCompliant ? "text-[#16ab59]" : "text-[#ff4141]"}`}>
                  {cogsRatio}%
                </div>
                <div className="text-[12px] text-[#111118]/70 mt-2 font-normal">
                  {lang === "ar"
                    ? "نسبة تكلفة البنية التحتية من الإيرادات"
                    : lang === "en"
                    ? "Infrastructure Cost to Revenue Ratio"
                    : "Part de l'infrastructure sur le CA"}
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-[#e1edff] pt-4 text-[#111118]/70">
                <div className="flex justify-between items-center">
                  <span>Coût Serveurs (AWS / DB) :</span>
                  <span className="text-[#111118] font-mono font-normal">{infrastructureCost.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Revenus Prévisionnels :</span>
                  <span className="text-[#111118] font-mono font-normal">{monthlyRevenue.toLocaleString()} TND</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Seuil Légal Ministère Tunisie :</span>
                  <span className="text-[#16ab59] font-normal">&lt; 30.0%</span>
                </div>
              </div>

              <button
                onClick={onOpenWorkspace}
                className="superhi-btn-primary w-full cursor-pointer text-xs"
              >
                <span>{lang === "ar" ? "إعداد ملف Labellisation في Workspace" : "Générer le dossier d'éligibilité"}</span>
                <span className="text-base font-normal">→</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "matchmaking" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <Lozenge appearance="inprogress">MATCHMAKING CARTHAGE</Lozenge>
              <h3 className="text-2xl font-normal text-[#111118] tracking-tight">
                {lang === "ar"
                  ? "تكوين فرق متعددة التخصصات بين INSAT و Esprit و IHEC"
                  : lang === "en"
                  ? "Form Multidisciplinary PFE Teams Across INSAT, Esprit & IHEC"
                  : "Alliez génie technique, design UI/UX et stratégie business pour votre PFE"}
              </h3>
              <p className="text-sm text-[#111118]/70 leading-relaxed font-normal">
                {lang === "ar"
                  ? "تحلل خوارزمية Carthage التوافق الزمني لمواعيد مناقشة التخرج وترشح الشركاء المثاليين لإطلاق شركتكم الناشئة."
                  : lang === "en"
                  ? "Our Carthage algorithm syncs academic defense schedules and matches you with student cofounders."
                  : "L'algorithme de Carthage synchronise les plannings de soutenance des grandes écoles pour créer un trinôme équilibré : Ingénieur Tech, Designer et Marketeur."}
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenWorkspace}
                  className="superhi-btn-primary cursor-pointer text-xs"
                >
                  <span>{lang === "ar" ? "الدخول إلى منصة Matchmaking" : "Accéder au Matchmaking PFE-Hub"}</span>
                  <span className="text-base font-normal">→</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              {[
                {
                  name: "Ahmed Sassi",
                  school: "INSAT Tunis • Génie Logiciel (Tech Lead)",
                  match: "98% Match",
                  initials: "AS",
                  tag: "TECH LEAD"
                },
                {
                  name: "Yasmine Trabelsi",
                  school: "Esprit • UI/UX Designer & Product",
                  match: "96% Match",
                  initials: "YT",
                  tag: "PRODUCT DESIGN"
                },
                {
                  name: "Mohamed Dridi",
                  school: "IHEC Carthage • Business & Finance (SaaS)",
                  match: "95% Match",
                  initials: "MD",
                  tag: "BUSINESS LEAD"
                }
              ].map((person, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[16px] border border-[#e1edff] bg-[#ffffff] shadow-[0_2px_0_0_#111118] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-[#e1edff] text-[#2727e6] font-normal text-xs flex items-center justify-center font-sans border border-[#e1edff]">
                      {person.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-normal text-[#111118]">{person.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0f6ff] text-[#111118]/70 font-normal">
                          {person.tag}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#111118]/70 font-normal">{person.school}</p>
                    </div>
                  </div>
                  <Lozenge appearance="success">{person.match}</Lozenge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "figma" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <Lozenge appearance="violet">DEV INTEGRATION</Lozenge>
              <h3 className="text-2xl font-normal text-[#111118] tracking-tight">
                {lang === "ar"
                  ? "تحويل تصاميم Figma الجاهزة إلى تذاكر GitHub تلقائياً"
                  : lang === "en"
                  ? "Convert Dev-Ready Figma Frames into GitHub Issues Instantly"
                  : "Transformez vos maquettes Figma en tickets dev prêts pour l'équipe"}
              </h3>
              <p className="text-sm text-[#111118]/70 leading-relaxed font-normal">
                {lang === "ar"
                  ? "بمجرد تغيير حالة شاشة التصميم إلى Dev-Ready، ينشئ النظام تذكرة عمل على GitHub تحتوي على الأبعاد والمواصفات ورابط التصميم."
                  : lang === "en"
                  ? "When a UI screen is marked Dev-Ready in Figma, PFE-Hub automatically generates a detailed GitHub Issue."
                  : "Dès que le Designer marque un frame comme 'Dev-Ready' sur Figma, le webhook crée automatiquement l'issue correspondante."}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsSynced(!isSynced)}
                  className="superhi-btn-primary superhi-btn-compact cursor-pointer text-xs"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isSynced ? "Réinitialiser la simulation" : "Simuler la synchronisation (Dev-Ready)"}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-5 rounded-[16px] border border-[#e1edff] bg-[#f0f6ff] space-y-3 font-sans">
                <div className="flex items-center justify-between border-b border-[#e1edff] pb-3 text-xs">
                  <span className="text-[#111118] font-normal flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-[#2727e6]" /> WEBHOOK: figma.frame.updated
                  </span>
                  <Lozenge appearance="success">HTTP 200 OK</Lozenge>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-[12px] bg-[#ffffff] border border-[#e1edff]">
                    <div className="text-[#111118]/60 text-[11px]">1. Frame Détecté :</div>
                    <div className="text-[#111118] font-mono text-xs font-normal"># Dashboard_Tunnel_Vente (1440x900px)</div>
                  </div>
                  <div className="p-3 rounded-[12px] bg-[#ffffff] border border-[#e1edff] flex items-center justify-between">
                    <div>
                      <div className="text-[#111118]/60 text-[11px]">2. Propriété Changée :</div>
                      <div className="text-[#111118] font-mono text-xs font-normal">status: "Ready for Dev"</div>
                    </div>
                    {isSynced && <Lozenge appearance="inprogress">SYNCHRONISÉ</Lozenge>}
                  </div>
                  {isSynced && (
                    <div className="p-3 rounded-[12px] bg-[#16ab59]/10 border border-[#16ab59]/30 text-[#111118] flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16ab59] mt-0.5" />
                      <div>
                        <div className="font-normal text-xs text-[#111118]">✓ Issue PFE-42 créée avec succès</div>
                        <div className="text-[11px] font-mono text-[#2727e6]">
                          repo: falcon-ai-org/pfe-startup-falcon
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "afnor" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <Lozenge appearance="inprogress">NORME AFNOR NF Z 44-005</Lozenge>
              <h3 className="text-2xl font-normal text-[#111118] tracking-tight">
                {lang === "ar"
                  ? "هوامش سفلية آلية Ibid. و Op. Cit. متوافقة مع الجامعات التونسية"
                  : lang === "en"
                  ? "Automated Ibid. & Op. Cit. Academic Footnotes"
                  : "Citations universitaires automatisées selon la norme AFNOR"}
              </h3>
              <p className="text-sm text-[#111118]/70 leading-relaxed font-normal">
                {lang === "ar"
                  ? "يتولى النظام إدارة الإشارات المرجعية بدقة متناهية: استخدام Ibid. عند تكرار نفس المرجع مباشرة، و Op. Cit. عند الاستشهاد بمرجع سبق ذكره."
                  : lang === "en"
                  ? "Automatically manages Ibidem and Opere Citato chronologies for compliant academic formatting."
                  : "Le système analyse la chronologie des citations pour insérer les mentions Ibid. et Op. Cit. avec précision typographique."}
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenWorkspace}
                  className="superhi-btn-primary cursor-pointer text-xs"
                >
                  <span>{lang === "ar" ? "فتح محرر AFNOR" : "Ouvrir l'éditeur AFNOR"}</span>
                  <span className="text-base font-normal">→</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-5 rounded-[16px] border border-[#e1edff] bg-[#f0f6ff] space-y-3 font-serif">
                <div className="text-xs text-[#111118]/70 font-sans font-normal border-b border-[#e1edff] pb-2 flex items-center justify-between">
                  <span>EXEMPLE DE BAS DE PAGE AFNOR</span>
                  <Lozenge appearance="success">CONFORME INSAT / UNIVERSITÉ</Lozenge>
                </div>
                <div className="space-y-2 text-xs text-[#111118] leading-relaxed">
                  <div className="p-3 rounded-[12px] bg-[#ffffff] border border-[#e1edff]">
                    <span className="font-mono text-[#2727e6] font-normal">[1] </span>
                    BEN SLIMANE, Karim. <em>Génie logiciel et architecture cloud en Tunisie</em>. Tunis : CPU, 2024, p. 45-48.
                  </div>
                  <div className="p-3 rounded-[12px] bg-[#ffffff] border border-[#e1edff]">
                    <span className="font-mono text-[#2727e6] font-normal">[2] </span>
                    <em>Ibid.</em>, p. 52. <span className="text-[11px] text-[#111118]/60 font-sans">(Même ouvrage, page suivante)</span>
                  </div>
                  <div className="p-3 rounded-[12px] bg-[#ffffff] border border-[#e1edff]">
                    <span className="font-mono text-[#2727e6] font-normal">[3] </span>
                    BEN SLIMANE, Karim, <em>op. cit.</em>, p. 89. <span className="text-[11px] text-[#111118]/60 font-sans">(Rappel de l'ouvrage précédent)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
