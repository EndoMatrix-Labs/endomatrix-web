"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { submitLog } from "@/lib/api";
import { color, font, SYMPTOMS, FLOW_LEVELS, gradient } from "@/lib/theme";
import { Card, SectionLabel, SymptomChip, FlowButton } from "@/components/ui";
import type { Symptom, FlowLevel } from "@/lib/types";

function useIsPeriodToday(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("endomatrix_period_days");
    if (!raw) return false;
    const days: string[] = JSON.parse(raw);
    return days.includes(new Date().toISOString().slice(0, 10));
  } catch { return false; }
}

export default function LogPage() {
  const { getToken } = useAuth();
  const isPeriodDay = useIsPeriodToday();
  const [pain, setPain]       = useState(0);
  const [energy, setEnergy]   = useState(5);
  const [symptom, setSymptom] = useState<Symptom | null>(null);
  const [flow, setFlow]       = useState<FlowLevel | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!symptom || submitting) return;
    setSubmitting(true); setError(null);
    try {
      const token = await getToken();
      await submitLog({ pain_level: pain, energy_level: energy, dominant_symptom: symptom, flow_level: isPeriodDay ? flow : null }, token!);
      setSaved(true);
    } catch { setError("Couldn't save — check your connection and try again."); }
    finally { setSubmitting(false); }
  };

  if (saved) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 16 }} className="fade-up">
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: gradient.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: color.white }}>✓</div>
      <p style={{ fontSize: 22, color: color.charcoal, fontFamily: font.serif, textAlign: "center", fontWeight: 400, margin: 0 }}>Saved. See you tomorrow.</p>
      <p style={{ fontSize: 14, color: color.muted, fontFamily: font.sans, textAlign: "center" }}>Your pattern is building.</p>
      <button onClick={() => { setSaved(false); setSymptom(null); setFlow(null); }} style={{ marginTop: 8, padding: "12px 28px", borderRadius: 12, border: `1.5px solid ${color.border}`, background: "none", color: color.muted, fontSize: 14, cursor: "pointer" }}>Edit today's log</button>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
      <div style={{ padding: "20px 24px 0", marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: color.muted, fontFamily: font.sans, margin: "0 0 4px" }}>{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 style={{ fontSize: 24, color: color.charcoal, fontFamily: font.serif, fontWeight: 400, margin: 0 }}>How are you feeling?</h1>
      </div>
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <label htmlFor="pain-slider" style={{ fontSize: 15, color: color.charcoal, fontFamily: font.sans, fontWeight: 600 }}>Pain today</label>
            <span style={{ fontSize: 28, fontFamily: font.serif, color: pain > 6 ? color.rose : color.purple }}>{pain}</span>
          </div>
          <input id="pain-slider" type="range" min={0} max={10} value={pain} onChange={e => setPain(+e.target.value)} className="pain-slider" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 12, color: color.mutedLight, fontFamily: font.sans }}>None</span>
            <span style={{ fontSize: 12, color: color.mutedLight, fontFamily: font.sans }}>Severe</span>
          </div>
        </Card>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <label htmlFor="energy-slider" style={{ fontSize: 15, color: color.charcoal, fontFamily: font.sans, fontWeight: 600 }}>Energy level</label>
            <span style={{ fontSize: 28, fontFamily: font.serif, color: color.purple }}>{energy}</span>
          </div>
          <input id="energy-slider" type="range" min={0} max={10} value={energy} onChange={e => setEnergy(+e.target.value)} className="energy-slider" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 12, color: color.mutedLight, fontFamily: font.sans }}>Exhausted</span>
            <span style={{ fontSize: 12, color: color.mutedLight, fontFamily: font.sans }}>Energised</span>
          </div>
        </Card>
        {isPeriodDay && (
          <Card>
            <SectionLabel>Flow today</SectionLabel>
            <div style={{ display: "flex", gap: 8 }}>
              {FLOW_LEVELS.map(f => <FlowButton key={f} label={f} active={flow === f} onClick={() => setFlow(f as FlowLevel)} />)}
            </div>
          </Card>
        )}
        <div>
          <label style={{ fontSize: 15, color: color.charcoal, fontFamily: font.sans, fontWeight: 600, display: "block", marginBottom: 12 }}>What mattered most today?</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SYMPTOMS.map(s => <SymptomChip key={s} label={s} active={symptom === s} onClick={() => setSymptom(s)} />)}
          </div>
        </div>
      </div>
      {error && <p style={{ fontSize: 13, color: color.rose, textAlign: "center", padding: "8px 24px", fontFamily: font.sans }}>{error}</p>}
      <div style={{ padding: "20px 24px", marginTop: "auto" }}>
        <button onClick={handleSubmit} disabled={!symptom || submitting} className="btn-primary" aria-busy={submitting}>
          {submitting ? "Saving…" : "Log today"}
        </button>
      </div>
    </div>
  );
}
