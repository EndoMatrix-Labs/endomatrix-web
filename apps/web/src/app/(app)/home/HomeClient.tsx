"use client";

import Link from "next/link";
import { color, font, PHASES } from "@/lib/theme";
import { Card, SectionLabel, GradientHeader, StatCard } from "@/components/ui";
import type { HomeState } from "@/lib/types";

const PHASE_DESCRIPTIONS: Record<string, string> = {
  menstrual:  "Progesterone and oestrogen are at their lowest. Rest and warmth support your body right now.",
  follicular: "Oestrogen is rising. Many women feel more energy and sharper focus in this phase.",
  ovulatory:  "Peak oestrogen. Typically your highest-energy, most social window of the cycle.",
  luteal:     "Progesterone peaks then drops. Many women notice heightened sensitivity to pain and mood shifts in this window.",
};

export default function HomeClient({ homeState }: { homeState: HomeState | null }) {
  const today = new Date();
  const dayLabel = today.toLocaleDateString("en-GB", { weekday: "long" });
  const cycleDay  = homeState?.cycle_day ?? null;
  const phase     = homeState?.phase ?? null;
  const streak    = homeState?.streak ?? 0;
  const logsLeft  = homeState?.logs_until_insights ?? 30;
  const loggedToday = homeState?.logged_today ?? false;
  const feedback  = homeState?.early_feedback?.message ?? null;
  const phaseLabel = phase ? PHASES.find(p => p.key === phase)?.label ?? null : null;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
      <GradientHeader>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, margin: "0 0 2px", fontFamily: font.sans }}>
          {dayLabel}{cycleDay ? ` · Day ${cycleDay}` : ""}
        </p>
        <h1 style={{ color: color.white, fontFamily: font.serif, fontSize: 24, fontWeight: 400, margin: "0 0 20px" }}>Good morning.</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <StatCard label="Streak" value={streak > 0 ? `${streak} days` : "Start today"} />
          <StatCard label="Until insights" value={logsLeft > 0 ? `${logsLeft} logs` : "Ready!"} />
        </div>
      </GradientHeader>
      <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {loggedToday ? (
          <Card style={{ background: color.rosePale, border: `1px solid ${color.roseLight}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 13, color: color.rose, margin: "0 0 2px", fontFamily: font.sans, opacity: 0.8 }}>Today</p>
                <p style={{ fontSize: 15, color: color.rose, margin: 0, fontFamily: font.serif }}>
                  Pain {homeState?.today_log?.pain_level ?? "—"} · Energy {homeState?.today_log?.energy_level ?? "—"}
                </p>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: color.rose, display: "flex", alignItems: "center", justifyContent: "center", color: color.white, fontSize: 16 }}>✓</div>
            </div>
          </Card>
        ) : (
          <Link href="/log" style={{ textDecoration: "none" }}>
            <Card style={{ border: `1.5px dashed ${color.rose}`, background: color.rosePale }}>
              <p style={{ fontSize: 15, color: color.rose, margin: 0, fontFamily: font.serif, textAlign: "center" }}>Log today's symptoms →</p>
            </Card>
          </Link>
        )}
        {feedback && (
          <Card>
            <SectionLabel>Early observation</SectionLabel>
            <p style={{ fontSize: 16, color: color.charcoal, margin: "0 0 8px", fontFamily: font.serif, fontWeight: 400, lineHeight: 1.55 }}>"{feedback}"</p>
            <p style={{ fontSize: 13, color: color.mutedLight, margin: 0, fontFamily: font.sans }}>Based on your recent logs</p>
          </Card>
        )}
        {phase && phaseLabel && (
          <Card style={{ background: color.purplePale, border: `1px solid ${color.border}` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, marginTop: 2, background: color.purple, display: "flex", alignItems: "center", justifyContent: "center", color: color.white, fontSize: 16 }}>◐</div>
              <div>
                <p style={{ fontSize: 13, color: color.purple, margin: "0 0 4px", fontFamily: font.sans, fontWeight: 700 }}>{phaseLabel} phase{cycleDay ? ` · day ${cycleDay}` : ""}</p>
                <p style={{ fontSize: 14, color: color.muted, margin: 0, fontFamily: font.sans, lineHeight: 1.5 }}>{PHASE_DESCRIPTIONS[phase]}</p>
              </div>
            </div>
          </Card>
        )}
        {!homeState && (
          <Card>
            <p style={{ fontSize: 15, color: color.muted, fontFamily: font.sans, lineHeight: 1.6, margin: 0 }}>
              Set up your cycle baseline to start.{" "}
              <Link href="/onboarding" style={{ color: color.purple, fontWeight: 600 }}>Get started →</Link>
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
