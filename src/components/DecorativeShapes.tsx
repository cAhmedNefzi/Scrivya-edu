import React from "react";

export type ShapeType = "pentagon" | "triangle" | "semicircle" | "star" | "circle";
export type ShapeColor =
  | "hi-yellow"
  | "marker-red"
  | "powder-sky"
  | "bubblegum-pink"
  | "jelly-green"
  | "sunbeam";

const COLOR_MAP: Record<ShapeColor, string> = {
  "hi-yellow": "#ffda00",
  "marker-red": "#ff4141",
  "powder-sky": "#91d8ec",
  "bubblegum-pink": "#ffbac4",
  "jelly-green": "#16ab59",
  "sunbeam": "#ffe54d",
};

interface PaperShapeProps {
  type: ShapeType;
  color: ShapeColor;
  size: number;
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  rotate?: number;
  opacity?: number;
  className?: string;
  spinDuration?: number;
  spinDirection?: "normal" | "reverse";
}

export function PaperCutShape({
  type,
  color,
  size,
  top,
  bottom,
  left,
  right,
  rotate = 0,
  opacity = 1,
  className = "",
  spinDuration = 50,
  spinDirection = "normal",
}: PaperShapeProps) {
  const fillColor = COLOR_MAP[color];
  const spinClass = spinDirection === "reverse" ? "animate-spin-slow-reverse" : "animate-spin-slow";

  return (
    <div
      className={`absolute pointer-events-none select-none z-0 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        top,
        bottom,
        left,
        right,
        opacity,
      }}
    >
      <div
        className={spinClass}
        style={{
          width: "100%",
          height: "100%",
          animationDuration: `${spinDuration}s`,
          transformOrigin: "center center",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={{ borderRadius: "0px" }}
        >
          {type === "pentagon" && (
            // 5-sided polygon with sharp corners
            <polygon
              points="50,0 100,38 81,100 19,100 0,38"
              fill={fillColor}
            />
          )}
          {type === "triangle" && (
            // Sharp geometric triangle
            <polygon points="50,0 100,100 0,100" fill={fillColor} />
          )}
          {type === "semicircle" && (
            // Crisp half circle
            <path d="M 0,100 A 50,50 0 0,1 100,100 Z" fill={fillColor} />
          )}
          {type === "star" && (
            // Crisp 4-point star cutout
            <polygon
              points="50,0 62,38 100,50 62,62 50,100 38,62 0,50 38,38"
              fill={fillColor}
            />
          )}
          {type === "circle" && (
            // Crisp flat circle
            <circle cx="50" cy="50" r="50" fill={fillColor} />
          )}
        </svg>
      </div>
    </div>
  );
}

/**
 * Hero scattered paper-cut composition (clean shapes rotating slowly at outer perimeter, safely away from text)
 */
export function HeroPaperCutComposition() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Yellow Pentagon - Far Top-Left corner, clear of headline */}
      <PaperCutShape
        type="pentagon"
        color="hi-yellow"
        size={220}
        top="-40px"
        left="-40px"
        spinDuration={55}
        spinDirection="normal"
        opacity={0.95}
      />

      {/* 2. Red Semicircle - Far Top-Right corner, clear of headline */}
      <PaperCutShape
        type="semicircle"
        color="marker-red"
        size={200}
        top="-30px"
        right="-30px"
        spinDuration={48}
        spinDirection="reverse"
        opacity={0.95}
      />

      {/* 3. Powder Sky Circle - Far Mid-Left, clear of subhead & buttons */}
      <PaperCutShape
        type="circle"
        color="powder-sky"
        size={170}
        top="42%"
        left="-45px"
        spinDuration={60}
        spinDirection="normal"
        opacity={0.9}
      />

      {/* 4. Jelly Green Triangle - Far Mid-Right, clear of subhead & buttons */}
      <PaperCutShape
        type="triangle"
        color="jelly-green"
        size={190}
        top="36%"
        right="-40px"
        spinDuration={52}
        spinDirection="reverse"
        opacity={0.95}
      />

      {/* 5. Bubblegum Pink Star - Far Bottom-Left, clear of stats cards */}
      <PaperCutShape
        type="star"
        color="bubblegum-pink"
        size={180}
        bottom="-40px"
        left="-20px"
        spinDuration={65}
        spinDirection="normal"
        opacity={0.9}
      />

      {/* 6. Sunbeam Yellow Pentagon - Far Bottom-Right, clear of stats cards */}
      <PaperCutShape
        type="pentagon"
        color="sunbeam"
        size={210}
        bottom="-40px"
        right="-30px"
        spinDuration={58}
        spinDirection="reverse"
        opacity={0.95}
      />
    </div>
  );
}

/**
 * Section scattered paper-cut composition (3-5 shapes)
 */
export function SectionPaperCutComposition({ variant = "default" }: { variant?: "default" | "alternate" }) {
  if (variant === "alternate") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <PaperCutShape
          type="star"
          color="bubblegum-pink"
          size={320}
          top="-80px"
          right="-90px"
          rotate={12}
        />
        <PaperCutShape
          type="semicircle"
          color="hi-yellow"
          size={290}
          bottom="-60px"
          left="-70px"
          rotate={-10}
        />
        <PaperCutShape
          type="triangle"
          color="powder-sky"
          size={220}
          top="40%"
          left="-80px"
          rotate={6}
        />
        <PaperCutShape
          type="pentagon"
          color="jelly-green"
          size={260}
          bottom="-80px"
          right="15%"
          rotate={-14}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <PaperCutShape
        type="triangle"
        color="jelly-green"
        size={290}
        top="-60px"
        left="-80px"
        rotate={-12}
      />
      <PaperCutShape
        type="pentagon"
        color="hi-yellow"
        size={340}
        bottom="-100px"
        right="-90px"
        rotate={10}
      />
      <PaperCutShape
        type="circle"
        color="powder-sky"
        size={200}
        top="30%"
        right="-60px"
        rotate={0}
      />
      <PaperCutShape
        type="semicircle"
        color="marker-red"
        size={240}
        bottom="-50px"
        left="18%"
        rotate={-8}
      />
    </div>
  );
}
