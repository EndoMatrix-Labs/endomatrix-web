"use client";

import { color, font, gradient } from "@/lib/theme";
import { Card, SectionLabel } from "@/components/ui";
import type { PatternSummary } from "@/lib/types";

const TREND_LABELS: Record<string, string> = {
  escalating:        "Your symptoms are intensifying over time.",
  improving:         "Your symptom severity is trending down over time.",
  stable:            "Your severity has been consistent across cycles.",
  variable:          "Your severity varies cycle to cycle without a clear trend.",
  insufficient_data: "We need more data to assess your trend.",
};

export default function InsightsClient({ pattern }: { pattern: PatternSummary | null }) {
  if (!pattern || pattern.severity_trend === "insufficient_data") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 36, gap: 16 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: color.bgDeep, border: `2px dashed ${color.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: color.mutedLight }}>△</div>
        <h2 style={{ fontFamily: font.serif, color: color.charcoal, fontSize: 22, textAlign: "center", fontWeight: 400, margin: 0 }}>Keep logging to unlock your pattern.</h2>
        <p style={{ fontSize: 14, color: color.muted, fontFamily: font.sans, textAlign: "center", lineHeight: 1.6 }}>At 30 days you'll see a full breakdown of when your symptoms begin, how they escalate, and what to expect next cycle.</p>
      </div>
    );
  }

  const { onset_window, severity_trend, common_symptom_clusters, next_cycle_guidance } = pattern;
  const topCluster = common_symptom_clusters?.[0] ?? [];

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "20px 24px 32px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <h1 style={{ fontFamily: font.serif, fontSize: 24, color: color.charcoal, fontWeight: 400, margin: "0 0 4px" }}>Your Symptom Pattern</h1>
        <p style={{ fontSize: 13, color: color.mutedLight, fontFamily: font.sans, margin: 0 }}>So far · may change as we learn more</p>
      </div>
      {onset_window && (
        <Card>
          <SectionLabel>When symptoms begin</SectionLabel>
          <p style={{ fontSize: 16, color: color.charcoal, fontFamily: font.serif, margin: 0, lineHeight: 1.55 }}>
            Your symptoms typically start around <strong>day {onset_window.start_day}–{onset_window.end_day}</strong>, consistently in the late luteal phase.
          </p>
        </Card>
      )}
      <Card>
        <SectionLabel>How severity changes</SectionLabel>
        <p style={{ fontSize: 15, color: color.charcoal, fontFamily: font.serif, margin: "0 0 14px", lineHeight: 1.55 }}>{TREND_LABELS[severity_trend]}</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 48 }}>
          {[1,2,1,2,3,7,9,8,7,5,4,3,2,1].map((v, i) => (
            <div key={i} style={{ flex: 1, borderRadius: "3px 3px 0 0", background: v > 6 ? color.rose : v > 4 ? color.roseLight : color.rosePale, height: `${v * 10}%`, minHeight: 3 }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 11, color: color.mutedLight, fontFamily: font.sans }}>Day 14</span>
          <span style={{ fontSize: 11, color: color.mutedLight, fontFamily: font.sans }}>Day 28</span>
        </div>
      </Card>
      {topCluster.length > 0 && (
        <Card>
          <SectionLabel>What travels together</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            {topCluster.map(s => (
              <span key={s} style={{ padding: "7px 14px", borderRadius: 999, background: color.rosePale, color: color.rose, fontSize: 13, fontFamily: font.sans, fontWeight: 600, border: `1px solid ${color.roseLight}` }}>{s}</span>
            ))}
          </div>
          <p style={{ fontSize: 14, color: color.muted, fontFamily: font.sans, margin: 0, lineHeight: 1.5 }}>These symptoms appear together most often on your high-pain days.</p>
        </Card>
      )}
      {next_cycle_guidance?.length > 0 && (
        <Card style={{ background: gradient.primary, border: "none" }}>
          <SectionLabel colorOverride="rgba(255,255,255,0.65)">What to try next cycle</SectionLabel>
          <ul style={{ margin: 0, padding: "0 0 0 16px", color: "rgba(255,255,255,0.85)", fontFamily: font.sans, fontSize: 14, lineHeight: 1.9 }}>
            {next_cycle_guidance.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </Card>
      )}
      <button onClick={() => window.print()} style={{ width: "100%", padding: "15px", borderRadius: 14, border: `1.5px solid ${color.border}`, background: color.white, color: color.purple, fontSize: 15, cursor: "pointer", fontFamily: font.sans, fontWeight: 600 }}>
        Export for clinician →
      </button>
    </div>
  );
}
