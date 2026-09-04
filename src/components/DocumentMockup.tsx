import React, { useState } from "react";
import { Check, Clipboard, RotateCcw, FileText, ChevronRight } from "lucide-react";

export default function DocumentMockup() {
  const [step, setStep] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Simulated paragraph from a thesis with footnotes
  const steps = [
    {
      title: "Première citation d'une source",
      desc: "X insère la référence complète conforme à la norme AFNOR en note de bas de page.",
      content: (
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          L'essor des technologies numériques a profondément redéfini l'accès aux ressources documentaires au sein des universités françaises. Comme le souligne Pierre-Antoine Dupont dans son ouvrage phare
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-bold text-xs mx-0.5 relative -top-1 cursor-pointer">1</span>, 
          la dématérialisation n'est pas une simple transition technique, mais une véritable mutation culturelle.
        </p>
      ),
      note: "1. DUPONT, Pierre-Antoine. Manuel d'introduction à la recherche. Paris : Éditions Universitaires de Paris, 2024, p. 45."
    },
    {
      title: "Deuxième citation consécutive (même page)",
      desc: "X détecte la répétition immédiate et remplace automatiquement par la locution latine 'Ibid.' pour un rendu sobre et professionnel.",
      content: (
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          L'essor des technologies numériques a profondément redéfini l'accès aux ressources documentaires au sein des universités françaises. Comme le souligne Pierre-Antoine Dupont dans son ouvrage phare
          <span className="bg-white/10 text-slate-400 px-1 rounded text-xs mx-0.5 relative -top-1">1</span>,
          la dématérialisation n'est pas une simple transition technique. Ce phénomène de transition englobe également les habitudes quotidiennes de lecture et de synthèse critique de l'étudiant chercheur
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-bold text-xs mx-0.5 relative -top-1 cursor-pointer animate-pulse">2</span>.
        </p>
      ),
      note: "2. Ibid., p. 48. (Au lieu de réécrire tout le titre et l'auteur, X utilise Ibid. !) "
    },
    {
      title: "Citation ultérieure (après interposition)",
      desc: "Après avoir cité d'autres auteurs, une nouvelle référence à Dupont est abrégée en utilisant 'op. cit.' (œuvre citée).",
      content: (
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          ...alors que Germain exprime des réserves quant à la totale neutralité des algorithmes de recherche
          <span className="bg-white/5 text-slate-400 px-1 rounded text-xs mx-0.5 relative -top-1">3</span>. 
          Pourtant, nous constatons que l'encadrement méthodologique proposé par Dupont reste indispensable pour guider les doctorants
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-bold text-xs mx-0.5 relative -top-1 cursor-pointer animate-pulse">4</span>.
        </p>
      ),
      note: "4. DUPONT, op. cit., p. 112. (X retrouve automatiquement la première référence et gère la locution op. cit.) "
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(steps[step].note);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-white/15 flex flex-col h-[500px]" id="docMockup">
      {/* Word Processor Header Mimic */}
      <div className="bg-slate-950/60 px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 font-mono">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>memoire_final_afnor.docx</span>
          </div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
          Conforme AFNOR
        </div>
      </div>

      {/* Simulator step indicators */}
      <div className="flex bg-slate-950/30 border-b border-white/10 text-xs overflow-x-auto">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setStep(idx)}
            className={`flex-1 min-w-[120px] text-center py-2.5 px-3 font-semibold transition-all border-b-2 cursor-pointer ${
              step === idx
                ? "border-blue-500 bg-white/5 text-blue-400"
                : "border-transparent text-slate-450 hover:text-slate-200 hover:bg-white/5"
            }`}
          >
            Étape {idx + 1}
          </button>
        ))}
      </div>

      {/* Sheet Content Area */}
      <div className="flex-1 p-8 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 font-mono">
              {steps[step].title}
            </span>
            <button
              onClick={() => setStep((step + 1) % steps.length)}
              className="text-xs text-slate-400 hover:text-blue-300 flex items-center gap-0.5 font-semibold cursor-pointer"
            >
              Suivant <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/10 text-xs text-slate-400 italic mb-4">
            "{steps[step].desc}"
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-500/5 rounded-r-xl">
            {steps[step].content}
          </div>
        </div>

        {/* Footnote space */}
        <div className="mt-8 pt-6 border-t border-white/10 font-serif">
          <div className="flex items-start justify-between gap-4 bg-slate-950/40 p-4 rounded-xl border border-white/10 hover:border-blue-500/30 transition-colors">
            <div className="text-xs text-slate-300 space-y-1">
              <span className="font-mono text-blue-400 mr-2 font-bold select-none">Notes de bas de page :</span>
              <p className="leading-relaxed">{steps[step].note}</p>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 text-slate-400 hover:text-blue-450 rounded-lg bg-white/5 border border-white/15 hover:bg-white/10 transition-all shrink-0 cursor-pointer"
              title="Copier la note de bas de page"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-450" /> : <Clipboard className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Footer Controls */}
      <div className="bg-slate-950/60 px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <span>Prise en charge intelligente • Ibid. / op.cit / idem</span>
        <button
          onClick={() => setStep(0)}
          className="flex items-center gap-1 hover:text-blue-400 transition-colors font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Recommencer la simulation
        </button>
      </div>
    </div>
  );
}
