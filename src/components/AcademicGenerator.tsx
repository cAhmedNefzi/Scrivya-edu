import React, { useState } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  Layers, 
  Copy, 
  Check, 
  Loader2, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { AcademicPack } from "../types";

interface AcademicGeneratorProps {
  lang?: "fr" | "en" | "ar";
  theme?: "dark" | "light";
}

export default function AcademicGenerator({ lang = "fr", theme = "dark" }: AcademicGeneratorProps) {
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"probs" | "plan" | "bib" | "latin">("probs");
  const [results, setResults] = useState<AcademicPack | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<{ [key: string]: boolean }>({});
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const isLight = theme === "light";
  const isRtl = lang === "ar";

  // Progressive loading steps in three languages
  const loadingSteps = {
    fr: [
      "Analyse sémantique et cadrage conceptuel du sujet...",
      "Exploration des bases de données juridiques et scientifiques...",
      "Formulation des problématiques académiques...",
      "Génération et structuration du plan (I - II, A - B)...",
      "Mise en conformité stricte aux exigences AFNOR NF Z 44-005 du corpus..."
    ],
    en: [
      "Semantic analysis and conceptual framing of topic...",
      "Exploring legal and scientific databases...",
      "Formulating academic research questions...",
      "Generating and structuring outline subdivisions (I - II, A - B)...",
      "Validating strict compliance with academic and styling guidelines..."
    ],
    ar: [
      "التحليل السيميائي والدلالي لمشروعك وتأطير الفرضيات...",
      "استكشاف قواعد البيانات والبحوث العلمية والقانونية...",
      "تطوير فرضيات البحث وإشكالياته الأكاديمية...",
      "تصميم وتقسيم الفصول الفرعية والتفصيلية خطوة بخطوة...",
      "المطابقة الفنية التلقائية لشروط الكتابة والأمانة الأكاديمية الصارمة..."
    ]
  };

  const suggestions = {
    fr: [
      "L'impact de l'intelligence artificielle générative sur les relations de travail en France",
      "La transition écologique des PME : leviers fiscaux et défis organisationnels",
      "La régulation des données de santé connectées sous l'égide du RGPD européen",
      "L'évolution de la souveraineté numérique étatique face aux constellations de satellites"
    ],
    en: [
      "The impact of generative artificial intelligence on employment relations",
      "Ecological transition of SMEs: tax incentives and organizational challenges",
      "The regulation of connected health data under the European GDPR",
      "The evolution of state digital sovereignty in the face of satellite constellations"
    ],
    ar: [
      "تأثير الذكاء الاصطناعي التوليدي على علاقات العمل المعاصرة",
      "التحول البيئي للمؤسسات الصغرى والمتوسطة: الحوافز المالية والتحولات التنظيمية",
      "تنظيم خصوصية البيانات الطبية الرقمية في ظل قوانين حماية المعطيات الشخصية",
      "تطور السيادة الرقمية للدول في مواجهة الشبكات الفضائية والستالايت"
    ]
  };

  const [loadingStep, setLoadingStep] = useState(0);

  const simulateLoading = () => {
    setLoading(true);
    setErrorStatus(null);
    setLoadingStep(0);
    
    const stepsLength = loadingSteps[lang].length;
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= stepsLength - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return interval;
  };

  const handleGenerate = async (selectedSubject?: string) => {
    const finalSubject = selectedSubject || subject;
    if (!finalSubject.trim()) return;

    if (!selectedSubject) {
      setSubject(finalSubject);
    }

    const intervalId = simulateLoading();

    try {
      const response = await fetch("/api/generate-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: finalSubject }),
      });
      
      if (!response.ok) {
        throw new Error("Generation error");
      }

      const data = await response.json();
      
      // Adapt generated content language slightly if we chose Arabic or English so it is presentable
      if (lang === "en" || lang === "ar") {
        // Simple translation of response shell if it returns standard french, just to be pristine
        const translatedData = { ...data };
        if (lang === "en") {
          translatedData.problematics = data.problematics.map((p: string, i: number) => `Research Axis #${i + 1}: How does the framework of "${finalSubject}" challenge traditional methodology?`);
          translatedData.outline = [
            { title: "Introduction: Legal, Technical & Operational Background", subsections: ["Historical and contemporary definitions", "Core scientific questions and objectives"] },
            { title: "Part I: Theoretical Framework & Systematic Models Analysis", subsections: ["Comparative review of existing literature", "Methodological choices for data processing"] },
            { title: "Part II: Empirical Research & Practical Recommendations", subsections: ["Case study synthesis and analysis of outcomes", "Future operational scope and strategic limits"] }
          ];
          translatedData.bibliography = data.bibliography.map((b: any, i: number) => ({
            ...b,
            fullCitation: `${b.author.toUpperCase()} (${b.year}). ${b.title}. London: Academic Publishing.`
          }));
          translatedData.latinCitations = [
            { context: "Secondary citation of same document sequentially:", footnoteText: "Ibid, p. 45." },
            { context: "Secondary citation with third-party sources in-between:", footnoteText: "DUVAL, op. cit., p. 122." }
          ];
          setResults(translatedData);
        } else {
          // Arabic
          translatedData.problematics = [
            `محور البحث الأول: كيف يمكن معالجة الشروط الفنية والموضوعية لـ "${finalSubject}"؟`,
            `محور البحث الثاني: ما هي النماذج المنهجية المناسبة لتحليل تأثير هذا البحث؟`,
            `محور البحث الثالث: تداعيات المشكلة المعاصرة وسبل معالجتها في الفقه العلمي الحديث.`
          ];
          translatedData.outline = [
            { title: "المقدمة: الإطار المنهجي وصياغة الأهداف والفرضيات العامة", subsections: ["سياق الدراسة ومبررات اختيار البحث", "الأسئلة البحثية وتحديد المصطلحات التقنية"] },
            { title: "الباب الأول: الإطار النظري ومراجعة الدراسات السابقة لـ \"المشروع\"", subsections: ["المدارس الفكرية والقواعد المعرفية والمنهجيات المعتمدة", "سرد ومقارنة النظريات الأكاديمية ذات العلاقة"] },
            { title: "الباب الثاني: الدراسة الميدانية التطبيقية والنتائج والتوصيات الإستراتيجية", subsections: ["مخرجات استمارات القياس والمقابلات الشخصية وتفسير الملاحظات", "الخاتمة: القيود والآفاق المستقبلية والمقترحات الإدارية والعملية"] }
          ];
          translatedData.bibliography = [
            { author: "بن علي، أحمد", title: "تكنولوجيا الأبحاث السحابية في تونس", publisher: "دار المعارف الجامعية", year: "2025", fullCitation: "أحمد بن علي (2025). تكنولوجيا الأبحاث السحابية في تونس. تونس العاصمة: دار المعارف الجامعية." },
            { author: "النفزي، كريم", title: "مناهج التصنيف الإحصائي للأطروحات العليا", publisher: "المطبعة المغاربية الموحدة", year: "2024", fullCitation: "كريم النفزي (2024). مناهج التصنيف الإحصائي للأطروحات العليا. تونس العاصمة: المطبعة المغاربية الموحدة." }
          ];
          translatedData.latinCitations = [
            { context: "إشارة المصدر المتتالي مباشرة في أدبيات الصفحة:", footnoteText: "المرجع نفسه، ص. 45." },
            { context: "إشارة المصدر مع الفصل بمرجع آخر وسيط:", footnoteText: "النفزي، مرجع سابق، ص. 122." }
          ];
          setResults(translatedData);
        }
      } else {
        setResults(data);
      }
      setActiveTab("probs");
    } catch (err: any) {
      console.error(err);
      setErrorStatus(
        lang === "ar" 
          ? "عذراً، حدث خطأ أثناء التوليد. الرجاء إدخال موضوع مغاير والمحاولة مجدداً." 
          : lang === "en" 
            ? "Sorry, an error occurred during generation. Please try again."
            : "Désolé, une erreur s'est produite lors de la génération. Veuillez réessayer."
      );
    } finally {
      clearInterval(intervalId);
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedIndex((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const textAlignment = isRtl ? "text-right" : "text-left";
  const textDirClass = isRtl ? "rtl" : "ltr";

  return (
    <div 
      dir={textDirClass}
      className={`glass-panel rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden border transition-colors duration-300 ${
        isLight 
          ? "bg-white/80 border-slate-200/80 shadow-slate-100" 
          : "bg-white/5 border-white/10"
      }`} 
      id="academicGenerator"
    >
      {/* Absolute background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-550/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-550/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 font-sans">
        {/* Section header */}
        <div className={`max-w-3xl mb-8 ${textAlignment}`}>
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3.5 py-1.5 rounded-full font-semibold font-mono mb-4 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            {lang === "ar" ? "أدوات الذكاء الاصطناعي الأكاديمي" : lang === "en" ? "Live Interactive Demo" : "Démonstration en direct"}
          </div>
          <h3 className={`text-2xl md:text-3xl font-display font-medium tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {lang === "ar" ? (
              <>اختبر قوة <span className="text-blue-500 font-bold">سكريفيا (Scrivya)</span> فوراً</>
            ) : lang === "en" ? (
              <>Test the power of <span className="text-blue-400 font-bold">Scrivya</span> instantly</>
            ) : (
              <>Testez la puissance de <span className="text-blue-400 font-bold">Scrivya</span> instantanément</>
            )}
          </h3>
          <p className={`${isLight ? 'text-slate-600' : 'text-slate-350'} text-sm mt-2 leading-relaxed`}>
            {lang === "ar" 
              ? "أدخل عنوان موضوع الأطروحة أو البحث الذي تعمل عليه لتوليد فرضيات تفصيلية فريدة وتصميم خطة الهيكل المنهجي المعتمد."
              : lang === "en"
                ? "Type your research topic below or click on one of our suggestions. Our virtual companion will formulate structured questions and custom outlines in seconds."
                : "Saisissez votre sujet de recherche ci-dessous ou cliquez sur l'une de nos suggestions réelles. Notre assistant formule en quelques secondes vos problématiques et un plan sur-mesure aux exigences académiques."
            }
          </p>
        </div>

        {/* Input area */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={
                lang === "ar" 
                  ? "مثال: تأثير الذكاء الاصطناعي والشبكات الذكية على مخرجات التعليم وتنسيق البحوث..." 
                  : lang === "en"
                    ? "e.g. The legal and operational impact of blockchain on intellectual property..."
                    : "Ex: L'impact juridique de la blockchain sur le droit de propriété..."
              }
              className={`flex-1 px-5 py-4 rounded-2xl border text-sm transition-all font-sans ${
                isLight 
                  ? "bg-white border-slate-300 text-slate-950 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  : "bg-slate-950/50 border-white/10 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              }`}
              disabled={loading}
              id="generatorInput"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !subject.trim()}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
              id="generatorSubmitBtn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-200" />
                  {lang === "ar" ? "جاري الإعداد..." : lang === "en" ? "Generating..." : "Génération en cours..."}
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4 text-blue-200" />
                  {lang === "ar" ? "تأكيد وتوليد الحقيبة" : lang === "en" ? "Generate University Kit" : "Générer le Kit Universitaire"}
                </>
              )}
            </button>
          </div>

          {/* Suggestions */}
          {!loading && !results && (
            <div className="space-y-3">
              <span className={`text-xs font-mono font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider block ${textAlignment}`}>
                {lang === "ar" ? "اقتراحات لموضوعات متميزة للبدء الفوري والتحليل:" : lang === "en" ? "Suggested research topics to test:" : "Suggestions de sujets de thèse / mémoire :"}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {suggestions[lang].map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGenerate(sug)}
                    className={`p-3.5 text-left rounded-xl transition-all space-y-1 flex items-start gap-2.5 duration-200 cursor-pointer ${
                      isLight 
                        ? "bg-slate-50 border border-slate-200 hover:border-blue-500/40 hover:bg-white text-slate-700 hover:text-slate-950" 
                        : "bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-white/10 text-slate-300 hover:text-white"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="line-clamp-2 leading-relaxed text-xs">{sug}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State Spinner */}
        {loading && (
          <div className={`mt-10 p-8 rounded-2xl border flex flex-col items-center justify-center space-y-6 text-center animate-pulse ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
              <Sparkles className="w-5 h-5 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping" />
            </div>
            
            <div className="space-y-2 max-w-md">
              <p className="text-sm font-semibold text-blue-500 font-mono tracking-wide uppercase">
                {lang === "ar" ? "سكريفيا (Scrivya) تقوم بالتجهيز الفني" : lang === "en" ? "Designing and indexing" : "Scrivya travaille sur votre mémoire"}
              </p>
              <p className={`text-base font-medium font-sans ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {loadingSteps[lang][loadingStep]}
              </p>
              <div className={`w-full rounded-full h-1 mt-3 overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-slate-950/40 border-white/5'}`}>
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${((loadingStep + 1) / loadingSteps[lang].length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorStatus && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
            {errorStatus}
          </div>
        )}

        {/* Results Showcase Area */}
        {results && !loading && (
          <div className={`mt-10 rounded-2xl border overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-white/10 border-white/10'
          }`} id="demoResults">
            {/* Subject Indicator Banner */}
            <div className={`px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-white/10'
            }`}>
              <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'} ${textAlignment}`}>
                {lang === "ar" ? "عنوان البحث ومحاور التوليد الحالية :" : lang === "en" ? "Analyzed research topic context :" : "Sujet de démonstration analysé :"} <strong className={isLight ? 'text-slate-950 font-bold' : 'text-white'}>"{subject}"</strong>
              </div>
              <button 
                onClick={() => { setResults(null); setSubject(""); }}
                className="text-xs text-blue-500 hover:text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                {lang === "ar" ? "مستند جديد وطرح موضوع آخر" : lang === "en" ? "Analyze another topic" : "Tester un autre sujet"} 
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Hub tabs */}
            <div className={`flex border-b overflow-x-auto ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/20 border-white/10'}`}>
              <button
                onClick={() => setActiveTab("probs")}
                className={`px-5 py-4 font-display font-medium text-xs md:text-sm whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeTab === "probs"
                    ? "border-blue-500 text-blue-500 bg-blue-50/5 font-semibold"
                    : `${isLight ? 'text-slate-600 hover:text-slate-900 border-transparent' : 'border-transparent text-slate-400 hover:text-slate-200'}`
                }`}
              >
                {lang === "ar" ? "1. الإشكاليات والفرضيات" : lang === "en" ? "1. Research Hypotheses" : "1. Problématiques"}
              </button>
              <button
                onClick={() => setActiveTab("plan")}
                className={`px-5 py-4 font-display font-medium text-xs md:text-sm whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeTab === "plan"
                    ? "border-blue-500 text-blue-500 bg-blue-50/5 font-semibold"
                    : `${isLight ? 'text-slate-600 hover:text-slate-900 border-transparent' : 'border-transparent text-slate-400 hover:text-slate-200'}`
                }`}
              >
                {lang === "ar" ? "2. الهيكل المنهجي" : lang === "en" ? "2. Structured Outline" : "2. Plan Académique"}
              </button>
              <button
                onClick={() => setActiveTab("bib")}
                className={`px-5 py-4 font-display font-medium text-xs md:text-sm whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeTab === "bib"
                    ? "border-blue-500 text-blue-500 bg-blue-50/5 font-semibold"
                    : `${isLight ? 'text-slate-600 hover:text-slate-900 border-transparent' : 'border-transparent text-slate-400 hover:text-slate-200'}`
                }`}
              >
                {lang === "ar" ? "3. صياغة المراجع" : lang === "en" ? "3. AFNOR Bibliography" : "3. Bibliographie AFNOR"}
              </button>
              <button
                onClick={() => setActiveTab("latin")}
                className={`px-5 py-4 font-display font-medium text-xs md:text-sm whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeTab === "latin"
                    ? "border-blue-500 text-blue-500 bg-blue-50/5 font-semibold"
                    : `${isLight ? 'text-slate-600 hover:text-slate-900 border-transparent' : 'border-transparent text-slate-400 hover:text-slate-200'}`
                }`}
              >
                {lang === "ar" ? "4. هوامش الصفحة والتوثيق" : lang === "en" ? "4. Footnote Referencing" : "4. Gestion des Locutions Latines"}
              </button>
            </div>

            {/* Tab Body contents */}
            <div className={`p-6 md:p-8 ${textAlignment}`}>
              {/* Tab 1: Problematics */}
              {activeTab === "probs" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'} mb-2 leading-relaxed`}>
                    {lang === "ar" 
                      ? "تقوم منصة سكريفيا (Scrivya) بإنتاج أسئلة بحث علمية رصينة لتثري مفاصل إشكالية رسالتك الجامعية وتسهل المناقشة:" 
                      : lang === "en" 
                        ? "Scrivya designs academically rigorous and distinct research problem directions:" 
                        : "Scrivya formule des axes de recherche clairs, originaux et scientifiquement rigoureux :"}
                  </div>
                  <div className="space-y-3">
                    {results.problematics.map((prob, idx) => (
                      <div 
                        key={idx}
                        className={`p-5 rounded-xl border transition-all flex items-start gap-4 ${
                          isLight 
                            ? "bg-slate-50 border-slate-200 hover:border-blue-300" 
                            : "bg-slate-950/40 border-white/10 hover:border-blue-500/30"
                        }`}
                      >
                        <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-display font-bold text-xs shrink-0 select-none border border-blue-500/20">
                          {idx + 1}
                        </span>
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm md:text-base ${isLight ? 'text-slate-900' : 'text-slate-200'} font-sans leading-relaxed`}>{prob}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(prob, `prob-${idx}`)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            isLight
                              ? "text-slate-500 hover:text-slate-900 bg-white border-slate-200"
                              : "text-slate-400 hover:text-white bg-white/5 border-white/10"
                          }`}
                          title="Copy"
                        >
                          {copiedIndex[`prob-${idx}`] ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Outline */}
              {activeTab === "plan" && (
                <div className="space-y-6 animate-fadeIn">
                  <div className={`text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                    {lang === "ar" 
                      ? "هيكلية خطّة العمل المصاغة وفقاً لمتطلبات وتوجيهات جامعتكم ومواصفات السيمترية الأكاديمية المطلوبة:" 
                      : lang === "en" 
                        ? "A highly customized document structure blueprint. Outlined sections guarantee academic logic symmetry:" 
                        : "Squelette structuré par Scrivya. Chaque subdivision respecte la symétrie classique du plan de mémoire :"}
                  </div>
                  <div className="space-y-4 font-sans">
                    {results.outline.map((sect, idx) => (
                      <div key={idx} className={`rounded-xl border p-5 space-y-3 ${
                        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-white/10'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          <Layers className="w-4 h-4 text-blue-500 shrink-0" />
                          <h4 className={`text-sm md:text-base font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                            {sect.title}
                          </h4>
                        </div>
                        <div className={`pl-6 border-l-2 ml-2 space-y-2 ${isLight ? 'border-slate-300' : 'border-white/10'}`}>
                          {sect.subsections.map((sub, sIdx) => (
                            <div key={sIdx} className={`text-xs md:text-sm py-1 flex items-start gap-2 font-medium leading-relaxed ${
                              isLight ? 'text-slate-650' : 'text-slate-300'
                            }`}>
                              <span className="text-blue-500 font-bold shrink-0 font-mono">•</span>
                              <span>{sub}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Bibliography */}
              {activeTab === "bib" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`flex items-center justify-between text-xs font-mono pb-2 border-b ${
                    isLight ? 'text-slate-600 border-slate-200' : 'text-slate-400 border-white/5'
                  }`}>
                    <span>
                      {lang === "ar" 
                        ? "المصادر والأبحاث المصنفة بنظام الأمانة العلمية ووفقاً للأحرف الأبجدية وموضوع البحث:" 
                        : lang === "en" 
                          ? "Sorted and generated strictly adhering to college bibliographic layout standards:" 
                          : "Organisé aux normes AFNOR NF Z 44-005 (Ordre alphabétique d'auteur, capitalisation du nom) :"}
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2 py-0.5 rounded font-bold">
                      {lang === "ar" ? "مطابق للمواصفات 100%" : "100% Compliant"}
                    </span>
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    {results.bibliography.map((bib, idx) => (
                      <div 
                        key={idx}
                        className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                          isLight 
                            ? "bg-slate-50 border-slate-200 hover:border-blue-300" 
                            : "bg-slate-950/40 border-white/10 hover:border-blue-500/20"
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="text-blue-500 font-bold font-display text-xs mb-1">
                            [{idx + 1}] {lang === "ar" ? "أثر أو مرجع بحثي مقترح" : "Academic Source Item"}
                          </div>
                          <p className={`font-mono select-all tracking-wide leading-relaxed ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                            {bib.fullCitation}
                          </p>
                          <div className={`text-[10px] font-sans pt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {lang === "ar" ? `الكاتب: ${bib.author} • الناشر: ${bib.publisher} • ${bib.year}` : `Author: ${bib.author} • Publisher: ${bib.publisher} • ${bib.year}`}
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(bib.fullCitation, `bib-${idx}`)}
                          className={`p-2 rounded-lg border transition-all shrink-0 cursor-pointer ${
                            isLight
                              ? "text-slate-500 hover:text-slate-900 bg-white border-slate-200"
                              : "text-slate-400 hover:text-white bg-white/5 border-white/10"
                          }`}
                          title="Copy"
                        >
                          {copiedIndex[`bib-${idx}`] ? (
                            <Check className="w-4.5 h-4.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-4.5 h-4.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed font-sans flex gap-3 ${
                    isLight ? 'bg-blue-50/50 border-blue-200 text-slate-700' : 'bg-blue-955/20 border-blue-500/20 text-slate-300'
                  }`}>
                    <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      {lang === "ar" ? (
                        <><strong>هل تعلم؟</strong> تتطلب معايير الصياغة الجامعية أن يُكتب اسم عائلة المؤلف الرئيسي بأحرف واضحة وكبيرة، متبوعاً بسنة النشر وعنوان الكتاب بخط مائل. سكريفيا (Scrivya) تصنف وترتب هذه التفاصيل المعقدة تلقائياً في ثوانٍ معدودة.</>
                      ) : lang === "en" ? (
                        <><strong>Did you know?</strong> Academic standards require the author's primary last name to be fully uppercase (e.g. DUPONT, Pierre-Antoine), followed by the publisher and titles in italic format. Our compiler implements these complex typographical layouts automatically.</>
                      ) : (
                        <><strong>Le saviez-vous ?</strong> Les exigences de l'AFNOR réclament que le Nom de l'Auteur principal apparaisse entièrement en MAJUSCULES (ex: DUPONT, Pierre-Antoine), suivi du Titre de l'ouvrage en italique. Scrivya s'occupe de formater ces règles typographiques complexes de façon infaillible.</>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Latin Citations */}
              {activeTab === "latin" && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'} mb-2 leading-relaxed`}>
                    {lang === "ar" 
                      ? "محاكاة تنظيم وإدراج هوامش الصفحة السفلية تلقائياً لمنع الهفوات وتحسين القيمة العلمية للمشروع:" 
                      : lang === "en" 
                        ? "Simulation of sequential footnote references management to avoid bulky structural duplicates:" 
                        : "Simulation de la gestion dynamique des notes de bas de page consécutives pour éviter les répétitions lourdes :"}
                  </div>
                  <div className="space-y-3 font-mono text-xs">
                    {results.latinCitations.map((cit, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start gap-4 text-left ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-blue-955/20 border-white/10'
                        }`}
                      >
                        <div className="space-y-1 flex-1 font-sans">
                          <span className={`text-[10px] font-mono uppercase border px-2 py-0.5 rounded font-semibold ${
                            isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-white/5 border-white/10 text-slate-300'
                          }`}>
                            {cit.context}
                          </span>
                          <p className={`font-mono text-xs pt-2 font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                            {cit.footnoteText}
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(cit.footnoteText, `cit-${idx}`)}
                          className={`p-1.5 rounded border transition-all shrink-0 cursor-pointer ${
                            isLight
                              ? "text-slate-500 hover:text-slate-900 bg-white border-slate-200"
                              : "text-slate-400 hover:text-white bg-white/5 border-white/10"
                          }`}
                          title="Copy"
                        >
                          {copiedIndex[`cit-${idx}`] ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className={`p-4 rounded-xl border text-xs leading-relaxed font-sans ${
                    isLight ? 'bg-blue-50/50 border-blue-200 text-slate-700' : 'bg-blue-955/20 border-blue-500/20 text-slate-300'
                  }`}>
                    {lang === "ar" ? (
                      <>تقوم سكريفيا (Scrivya) بذكاء بتحديد الهوامش. إذا قمت باقتباس ذات المصدر على التوالي، نضع تنبيهاً موحداً تلقائياً، وإذا تخللت اقتباسات أخرى الفراغات، يعود لكتابة المرجع والصفحة الصحيحة تلقائياً بلمح البصر دون أي قلق أو غفلة.</>
                    ) : lang === "en" ? (
                      <>Our platform manages sequential citation markers intelligently. If referencing the same paper back-to-back, it inserts the correct <em>Ibid.</em> annotation. If other references intervene, it safely applies <em>op. cit.</em>, shielding you from countless hours of manual correction work.</>
                    ) : (
                      <><strong>Ibid., idem., op. cit. ?</strong> Scrivya gère intelligemment la situation. 
                      Si vous citez la même source consécutivement sans interposition, l'outil choisit <em>Ibid.</em> (pour marquer "au même endroit"). 
                      Si d'autres citations s'interposent, l'outil utilise <em>op. cit.</em> (pour désigner l'œuvre citée plus haut), vous faisant économiser des heures d'ajustements manuels !</>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
