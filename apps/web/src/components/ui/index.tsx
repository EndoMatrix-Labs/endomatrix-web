import { color, font, gradient, radius } from "@/lib/theme";
import type { CSSProperties } from "react";

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div className="card" style={style}>
      {children}
    </div>
  );
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────

export function SectionLabel({
  children,
  colorOverride,
}: {
  children: React.ReactNode;
  colorOverride?: string;
}) {
  return (
    <p className="section-label" style={colorOverride ? { color: colorOverride } : undefined}>
      {children}
    </p>
  );
}

// ─── GradientHeader ───────────────────────────────────────────────────────────

export function GradientHeader({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={{
      background: gradient.header,
      padding: "20px 24px 28px",
      borderRadius: "0 0 30px 30px",
      flexShrink: 0,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── StatCard (inside gradient header) ───────────────────────────────────────

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.15)",
      borderRadius: radius.lg, padding: "12px 16px",
    }}>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: "0 0 2px", fontFamily: font.sans }}>
        {label}
      </p>
      <p style={{ color: color.white, fontSize: 22, margin: 0, fontFamily: font.serif }}>
        {value}
      </p>
    </div>
  );
}

// ─── FlowButton ───────────────────────────────────────────────────────────────

export function FlowButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "10px 4px", borderRadius: radius.sm, border: "none",
      background: active ? color.rose : color.bgDeep,
      color: active ? color.white : color.muted,
      fontSize: 12, cursor: "pointer", fontFamily: font.sans,
      fontWeight: active ? 600 : 400, transition: "all 0.12s",
    }}>
      {label}
    </button>
  );
}

// ─── SymptomChip ──────────────────────────────────────────────────────────────

export function SymptomChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      padding: "9px 14px", borderRadius: radius.pill,
      border: `1.5px solid ${active ? color.rose : color.border}`,
      background: active ? color.rosePale : color.white,
      color: active ? color.rose : color.charcoal,
      fontSize: 13, cursor: "pointer", fontFamily: font.sans,
      fontWeight: active ? 600 : 400, transition: "all 0.12s",
    }}>
      {label}
    </button>
  );
}
