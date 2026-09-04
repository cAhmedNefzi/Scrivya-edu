import React from "react";

export default function AnimatedArchitecturalGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Crisp grid lines background using radial gradient and SVG pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] opacity-70"></div>

      {/* Animated horizontal and vertical glowing laser tracer lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grid-tracer-x" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0)" />
            <stop offset="50%" stopColor="rgba(37, 99, 235, 0.6)" />
            <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
          </linearGradient>
          <linearGradient id="grid-tracer-y" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.5)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
          </linearGradient>
          <linearGradient id="grid-tracer-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
            <stop offset="50%" stopColor="rgba(16, 185, 129, 0.6)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
          </linearGradient>
        </defs>

        {/* Horizontal animated pulses across grid lines */}
        <line
          x1="0"
          y1="192"
          x2="100%"
          y2="192"
          stroke="url(#grid-tracer-x)"
          strokeWidth="1.5"
          className="animate-[pulse_4s_ease-in-out_infinite]"
        />
        <line
          x1="0"
          y1="448"
          x2="100%"
          y2="448"
          stroke="url(#grid-tracer-emerald)"
          strokeWidth="1.5"
          className="animate-[pulse_5s_ease-in-out_infinite_1s]"
        />
        <line
          x1="0"
          y1="704"
          x2="100%"
          y2="704"
          stroke="url(#grid-tracer-x)"
          strokeWidth="1"
          className="animate-[pulse_6s_ease-in-out_infinite_2s]"
        />

        {/* Vertical animated pulses across grid columns */}
        <line
          x1="20%"
          y1="0"
          x2="20%"
          y2="100%"
          stroke="url(#grid-tracer-y)"
          strokeWidth="1"
          className="animate-[pulse_4.5s_ease-in-out_infinite_0.5s]"
        />
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          stroke="url(#grid-tracer-x)"
          strokeWidth="1"
          className="animate-[pulse_5.5s_ease-in-out_infinite_1.5s]"
        />
        <line
          x1="80%"
          y1="0"
          x2="80%"
          y2="100%"
          stroke="url(#grid-tracer-y)"
          strokeWidth="1"
          className="animate-[pulse_4.8s_ease-in-out_infinite_2.5s]"
        />
      </svg>

      {/* Architectural Crosshair (+) markers at key visual nodes */}
      <div className="absolute top-16 left-12 text-slate-300 font-mono text-xs select-none">+</div>
      <div className="absolute top-16 right-12 text-slate-300 font-mono text-xs select-none">+</div>
      <div className="absolute top-64 left-1/4 text-blue-400/40 font-mono text-xs select-none">+</div>
      <div className="absolute top-64 right-1/4 text-indigo-400/40 font-mono text-xs select-none">+</div>
      <div className="absolute top-96 left-1/3 text-emerald-400/40 font-mono text-xs select-none">+</div>
      <div className="absolute top-96 right-1/3 text-slate-300 font-mono text-xs select-none">+</div>
    </div>
  );
}
