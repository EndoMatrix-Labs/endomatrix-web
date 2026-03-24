"use client";

import { useState, useMemo } from "react";
import MonthCalendar from "@/components/calendar/MonthCalendar";
import PhaseStrip from "@/components/calendar/PhaseStrip";
import { Card, SectionLabel, FlowButton } from "@/components/ui";
import { color, font, FLOW_LEVELS } from "@/lib/theme";
import type { FlowLevel, CyclePhase } from "@/lib/types";

function predictedDays(lastPeriodStart: Date | null, cycleLength: number, year: number, month: number): Set<number> {
  if (!lastPeriodStart) return new Set();
  const nextStart = new Date(lastPeriodStart);
  nextStart.setDate(nextStart.getDate() + cycleLength);
  if (nextStart.getFullYear() !== year || nextStart.getMonth() !== month) return new Set();
  const days = new Set<number>();
  for (let i = 0; i < 5; i++) days.add(nextStart.getDate() + i);
  return days;
}

function phaseFromDay(cycleDay: number): CyclePhase {
  if (cycleDay <= 5)  return "menstrual";
  if (cycleDay <= 13) return "follicular";
  if (cycleDay <= 16) return "ovulatory";
  return "luteal";
}

export default function CalendarPage() {
  const now = new Date();
  const [viewYear, setViewYear]   = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [periodDayMap, setPeriodDayMap] = useState<Map<string, FlowLevel | null>>(new Map());
  const [todayFlow, setTodayFlow] = useState<FlowLevel | null>(null);

  const dayKey = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const periodDaysThisMonth = useMemo(() => {
    const s = new Set<number>();
    for (const key of periodDayMap.keys()) {
      const [y, m, d] = key.split("-").map(Number);
      if (y === viewYear && m === viewMonth + 1) s.add(d);
    }
    return s;
  }, [periodDayMap, viewYear, viewMonth]);

  const lastPeriodStart = useMemo(() => {
    const dates = [...periodDayMap.keys()].map(k => new Date(k)).sort((a, b) => a.getTime() - b.getTime());
    return dates[0] ?? null;
  }, [periodDayMap]);

  const predicted = useMemo(() => predictedDays(lastPeriodStart, 28, viewYear, viewMonth), [lastPeriodStart, viewYear, viewMonth]);

  const toggleDay = (day: number) => {
    const key = dayKey(viewYear, viewMonth, day);
    setPeriodDayMap(prev => { const next = new Map(prev); next.has(key) ? next.delete(key) : next.set(key, null); return next; });
  };

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); } else setViewMonth(m => m + 1); };

  const cycleDay = lastPeriodStart ? Math.floor((now.getTime() - lastPeriodStart.getTime()) / 86_400_000) + 1 : null;
  const currentPhase = cycleDay ? phaseFromDay(cycleDay) : null;
  const todayKey = dayKey(now.getFullYear(), now.getMonth(), now.getDate());
  const todayIsPeriod = periodDayMap.has(todayKey);
  const nextPeriodApprox = lastPeriodStart ? (() => { const d = new Date(lastPeriodStart); d.setDate(d.getDate() + 28); return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); })() : "—";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
      <MonthCalendar year={viewYear} month={viewMonth} periodDays={periodDaysThisMonth} predictedDays={predicted} onToggleDay={toggleDay} onPrevMonth={prevMonth} onNextMonth={nextMonth} />
      <div style={{ display: "flex", gap: 14, padding: "14px 20px 0", flexWrap: "wrap" }}>
        {[
          { bg: "rgba(232,96,122,0.15)", border: color.rose,       label: "Period (tap to mark)" },
          { bg: "rgba(92,62,124,0.08)",  border: color.mutedLight, label: "Predicted", dashed: true },
          { bg: color.bgDeep,            border: color.mutedLight, label: "High pain window (avg.)" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: color.muted, fontFamily: font.sans }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: item.bg, border: `${item.dashed ? "1.5px dashed" : "1.5px solid"} ${item.border}` }} />
            {item.label}
          </div>
        ))}
      </div>
      {todayIsPeriod && (
        <div style={{ padding: "14px 20px 0" }}>
          <Card>
            <SectionLabel>Log today's flow</SectionLabel>
            <div style={{ display: "flex", gap: 8 }}>
              {FLOW_LEVELS.map(f => <FlowButton key={f} label={f} active={todayFlow === f} onClick={() => setTodayFlow(f as FlowLevel)} />)}
            </div>
          </Card>
        </div>
      )}
      <div style={{ padding: "14px 20px 0" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[{ label: "Cycle length", value: "28 days" }, { label: "Period length", value: `${periodDaysThisMonth.size || "—"} days` }, { label: "Next period", value: nextPeriodApprox }].map(stat => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 17, color: color.purple, fontFamily: font.serif, margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: 11, color: color.muted, fontFamily: font.sans, margin: "3px 0 0" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div style={{ padding: "12px 20px 24px" }}>
        <Card><SectionLabel>Current phase</SectionLabel><PhaseStrip currentPhase={currentPhase} /></Card>
      </div>
    </div>
  );
}
