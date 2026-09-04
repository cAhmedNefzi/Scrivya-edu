import React from "react";

export default function AnimatedArchitecturalGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Crisp minimalist background grid lines on pure white canvas */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_85%_85%_at_50%_0%,#000_70%,transparent_100%)] opacity-80"></div>

      {/* Secondary micro-grid for engineering/architectural feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:0.9rem_0.9rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,#000_40%,transparent_100%)] opacity-60"></div>

      {/* Animated horizontal and vertical glowing laser tracer lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tracer-blue-x" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0)" />
            <stop offset="30%" stopColor="rgba(37, 99, 235, 0.7)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.9)" />
            <stop offset="70%" stopColor="rgba(37, 99, 235, 0.7)" />
            <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
          </linearGradient>

          <linearGradient id="tracer-indigo-y" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(79, 70, 229, 0)" />
            <stop offset="30%" stopColor="rgba(79, 70, 229, 0.7)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.9)" />
            <stop offset="70%" stopColor="rgba(79, 70, 229, 0.7)" />
            <stop offset="100%" stopColor="rgba(79, 70, 229, 0)" />
          </linearGradient>

          <linearGradient id="tracer-emerald-x" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
            <stop offset="50%" stopColor="rgba(16, 185, 129, 0.8)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
          </linearGradient>
        </defs>

        {/* Horizontal animated traveling laser lines */}
        <line
          x1="0"
          y1="144"
          x2="100%"
          y2="144"
          stroke="url(#tracer-blue-x)"
          strokeWidth="1.5"
          className="animate-[pulse_4s_ease-in-out_infinite]"
        />
        <line
          x1="0"
          y1="360"
          x2="100%"
          y2="360"
          stroke="url(#tracer-emerald-x)"
          strokeWidth="1.5"
          className="animate-[pulse_5.5s_ease-in-out_infinite_1.2s]"
        />
        <line
          x1="0"
          y1="576"
          x2="100%"
          y2="576"
          stroke="url(#tracer-blue-x)"
          strokeWidth="1"
          className="animate-[pulse_6s_ease-in-out_infinite_2.5s]"
        />
        <line
          x1="0"
          y1="864"
          x2="100%"
          y2="864"
          stroke="url(#tracer-emerald-x)"
          strokeWidth="1.2"
          className="animate-[pulse_7s_ease-in-out_infinite_0.8s]"
        />

        {/* Vertical animated traveling laser lines */}
        <line
          x1="18%"
          y1="0"
          x2="18%"
          y2="100%"
          stroke="url(#tracer-indigo-y)"
          strokeWidth="1.2"
          className="animate-[pulse_4.2s_ease-in-out_infinite_0.4s]"
        />
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="url(#tracer-blue-x)"
          strokeWidth="1"
          className="animate-[pulse_5s_ease-in-out_infinite_1.8s]"
        />
        <line
          x1="82%"
          y1="0"
          x2="82%"
          y2="100%"
          stroke="url(#tracer-indigo-y)"
          strokeWidth="1.2"
          className="animate-[pulse_4.6s_ease-in-out_infinite_2.2s]"
        />
      </svg>

      {/* Architectural Corner & Grid Node Markers */}
      <div className="absolute top-12 left-8 text-slate-400 font-mono text-[11px] select-none flex items-center gap-1">
        <span className="text-blue-600 font-bold">+</span>
        <span className="text-[9px] text-slate-400">SYS_AFNOR_Z44_005</span>
      </div>
      <div className="absolute top-12 right-8 text-slate-400 font-mono text-[11px] select-none flex items-center gap-1">
        <span className="text-[9px] text-slate-400">LAT: 36.8065° N</span>
        <span className="text-blue-600 font-bold">+</span>
      </div>
      <div className="absolute top-72 left-1/4 text-slate-300 font-mono text-xs select-none">+</div>
      <div className="absolute top-72 right-1/4 text-slate-300 font-mono text-xs select-none">+</div>
      <div className="absolute top-[480px] left-1/3 text-emerald-500/40 font-mono text-xs select-none">+</div>
      <div className="absolute top-[480px] right-1/3 text-blue-500/40 font-mono text-xs select-none">+</div>
    </div>
  );
}
