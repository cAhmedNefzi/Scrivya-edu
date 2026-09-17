import React from "react";

export default function AnimatedArchitecturalGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Atlassian N20 subtle background dot grid */}
      <div 
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "radial-gradient(#DFE1E6 1.25px, transparent 1.25px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Engineering blueprint alignment guides with Atlassian B400 accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#EBECF0_1px,transparent_1px),linear-gradient(to_bottom,#EBECF0_1px,transparent_1px)] bg-[size:96px_96px] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_0%,#000_65%,transparent_100%)] opacity-50" />

      {/* Architectural Corner & Grid Node Markers in Atlassian N200 / B400 */}
      <div className="absolute top-8 left-8 text-[#6B778C] font-mono text-[11px] select-none flex items-center gap-1.5 bg-[#FAFBFC] px-2 py-0.5 rounded-[3px] border border-[#DFE1E6] shadow-2xs">
        <span className="text-[#0052CC] font-bold">+</span>
        <span className="text-[10px] text-[#42526E] font-medium">ATLASSIAN_DS // AFNOR_Z44_005</span>
      </div>
      <div className="absolute top-8 right-8 text-[#6B778C] font-mono text-[11px] select-none flex items-center gap-1.5 bg-[#FAFBFC] px-2 py-0.5 rounded-[3px] border border-[#DFE1E6] shadow-2xs">
        <span className="text-[10px] text-[#42526E] font-medium">SYS.REV.2026</span>
        <span className="text-[#0052CC] font-bold">+</span>
      </div>
      <div className="absolute top-72 left-1/4 text-[#DFE1E6] font-mono text-xs select-none">+</div>
      <div className="absolute top-72 right-1/4 text-[#DFE1E6] font-mono text-xs select-none">+</div>
      <div className="absolute top-[480px] left-1/3 text-[#DEEBFF] font-mono text-xs select-none">+</div>
      <div className="absolute top-[480px] right-1/3 text-[#DEEBFF] font-mono text-xs select-none">+</div>
    </div>
  );
}
