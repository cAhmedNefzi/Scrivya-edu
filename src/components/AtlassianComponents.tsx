import React from "react";
import { BookOpen } from "lucide-react";

/**
 * SuperHi Design System Foundation Components
 * Design tokens:
 * - Canvas: Chalk Blue #f0f6ff
 * - Cards: Paper White #ffffff with 1px #e1edff border and 0 2px 0 0 #111118 shadow
 * - Primary Action: Electric Iris #2727e6 with 0 4px 0 0 #111118 shadow
 * - Secondary Dark: Carbon #000000 with 0 4px 0 0 #2727e6 shadow
 * - Primary Text: Ink Black #111118
 * - Wash/Border: Frost Blue #e1edff
 * - Typography: Haas Grot Disp / Haas Grot Text / Martian Mono (all weight 400)
 */

// SuperHi Brand Wordmark with Electric Iris Round Icon Container
export function AtlassianLogo({
  className = "w-5 h-5",
  textClassName = "text-[#111118]",
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <div className="w-8 h-8 rounded-full bg-[#2727e6] text-[#ffffff] flex items-center justify-center font-bold text-xs shadow-[0_2px_0_0_#111118]">
        <BookOpen className={`${className} text-white`} />
      </div>
      <span className={`font-normal tracking-tight text-base ${textClassName}`}>
        Scrivya
      </span>
    </div>
  );
}

// App Switcher Grid Icon
export function AtlassianAppSwitcher({ className = "w-4 h-4 text-[#111118]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="5" r="2" />
      <circle cx="12" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="12" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
    </svg>
  );
}

// SuperHi Tag / Category Pill (Radius 5000px, fill #e1edff, text #111118)
export type LozengeAppearance = "default" | "inprogress" | "success" | "warning" | "danger" | "new" | "violet" | "blue";

interface LozengeProps {
  children: React.ReactNode;
  appearance?: LozengeAppearance;
  isBold?: boolean;
  className?: string;
}

export function Lozenge({ children, appearance = "default", className = "" }: LozengeProps) {
  const styles: Record<LozengeAppearance, string> = {
    default: "bg-[#e1edff] text-[#111118] border border-[#e1edff]",
    inprogress: "bg-[#2727e6] text-[#ffffff] border border-[#2727e6]",
    violet: "bg-[#2727e6] text-[#ffffff] border border-[#2727e6]",
    blue: "bg-[#91d8ec] text-[#111118] border border-[#91d8ec]",
    success: "bg-[#16ab59] text-[#ffffff] border border-[#16ab59]",
    warning: "bg-[#ffda00] text-[#111118] border border-[#ffda00]",
    danger: "bg-[#ff4141] text-[#ffffff] border border-[#ff4141]",
    new: "bg-[#ffbac4] text-[#111118] border border-[#ffbac4]",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-[5000px] text-[12px] font-normal tracking-tight select-none whitespace-nowrap leading-tight transition-colors ${styles[appearance]} ${className}`}
      style={{ fontFamily: "var(--font-haas-grot-text)" }}
    >
      {children}
    </span>
  );
}

// SuperHi Pill Buttons (Weight 400, 48px radius, hard offset shadows)
export type ButtonAppearance = "primary" | "default" | "subtle" | "danger" | "warning" | "link" | "blue" | "dark";

export interface AtlassianButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  appearance?: ButtonAppearance;
  spacing?: "default" | "compact" | "none";
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  isSelected?: boolean;
}

export function AtlassianButton({
  children,
  appearance = "default",
  spacing = "default",
  iconBefore,
  iconAfter,
  isSelected = false,
  className = "",
  disabled,
  ...props
}: AtlassianButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center font-normal font-sans transition-all focus:outline-none select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

  const spacingStyles = {
    default: "px-5 py-2.5 text-sm gap-2 h-10 rounded-[48px]",
    compact: "px-3.5 py-1.5 text-xs gap-1.5 h-8 rounded-[48px]",
    none: "p-0 text-xs rounded-[48px]",
  };

  const appearanceStyles: Record<ButtonAppearance, string> = {
    primary:
      "bg-[#2727e6] hover:bg-[#1f1fc4] text-[#ffffff] font-normal shadow-[0_4px_0_0_#111118] active:translate-y-0.5 active:shadow-[0_2px_0_0_#111118]",
    dark:
      "bg-[#000000] hover:bg-[#1a1a1a] text-[#ffffff] font-normal shadow-[0_4px_0_0_#2727e6] active:translate-y-0.5 active:shadow-[0_2px_0_0_#2727e6]",
    blue:
      "bg-[#2727e6] hover:bg-[#1f1fc4] text-[#ffffff] font-normal shadow-[0_4px_0_0_#111118]",
    default: isSelected
      ? "bg-[#2727e6] text-[#ffffff] font-normal shadow-[0_2px_0_0_#111118]"
      : "bg-[#ffffff] hover:bg-[#f0f6ff] text-[#111118] border border-[#e1edff] shadow-[0_2px_0_0_#111118]",
    subtle: isSelected
      ? "bg-[#e1edff] text-[#2727e6] font-normal"
      : "bg-transparent hover:bg-[#e1edff] text-[#111118] font-normal",
    danger: "bg-[#ff4141] hover:bg-[#e03030] text-[#ffffff] font-normal shadow-[0_2px_0_0_#111118]",
    warning: "bg-[#ffda00] hover:bg-[#ebd000] text-[#111118] font-normal shadow-[0_2px_0_0_#111118]",
    link: "bg-transparent text-[#2727e6] hover:underline p-0 h-auto font-normal",
  };

  return (
    <button
      className={`${baseStyle} ${spacingStyles[spacing]} ${appearanceStyles[appearance]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {iconBefore && <span className="shrink-0">{iconBefore}</span>}
      {children}
      {iconAfter && <span className="shrink-0">{iconAfter}</span>}
    </button>
  );
}

// SuperHi Paper White Card (24px radius, 1px #e1edff border, 0 2px 0 0 #111118 shadow)
export function AtlassianCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#ffffff] border border-[#e1edff] rounded-[24px] p-6 shadow-[0_2px_0_0_#111118] transition-all ${
        onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#111118]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

// SuperHi Breadcrumb Item
export function AtlassianBreadcrumb({
  items,
}: {
  items: { label: string; href?: string; onClick?: () => void }[];
}) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#111118]/70 font-normal">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-[#111118]/40">/</span>}
          {item.onClick || item.href ? (
            <button
              onClick={item.onClick}
              className="hover:text-[#2727e6] hover:underline transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[#111118] font-normal">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// SuperHi Inline Avatar Pill
export function AtlassianAvatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeMap[size]} rounded-full object-cover border border-[#e1edff]`}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} rounded-full bg-[#e1edff] text-[#2727e6] font-normal flex items-center justify-center border border-[#e1edff]`}
    >
      {initials}
    </div>
  );
}

// SuperHi Form Input Component
export function AtlassianInput({
  value,
  onChange,
  placeholder,
  className = "",
  type = "text",
  disabled = false,
  iconBefore,
  iconAfter,
  onKeyDown,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  type?: string;
  disabled?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      {iconBefore && (
        <span className="absolute left-3.5 text-[#111118]/50 pointer-events-none">
          {iconBefore}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onKeyDown={onKeyDown}
        className={`w-full bg-[#ffffff] border border-[#e1edff] text-[#111118] placeholder-[#111118]/40 rounded-[12px] py-2.5 text-xs font-normal focus:border-[#2727e6] focus:outline-none transition-all ${
          iconBefore ? "pl-9" : "pl-3.5"
        } ${iconAfter ? "pr-9" : "pr-3.5"} ${
          disabled ? "opacity-50 cursor-not-allowed bg-[#f0f6ff]" : ""
        }`}
      />
      {iconAfter && (
        <span className="absolute right-3.5 text-[#111118]/50">
          {iconAfter}
        </span>
      )}
    </div>
  );
}

