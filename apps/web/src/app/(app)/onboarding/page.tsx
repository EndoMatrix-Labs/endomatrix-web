"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { setBaseline } from "@/lib/api";
import { color, font, gradient } from "@/lib/theme";

type Reason = "Chronic menstrual pain" | "Irregular cycles" | "Severe PMS" | "Just understanding my body";
type TrackerChoice = "ours" | "link" | "skip";
type LinkedTracker = "flo" | "clue" | "apple_health";
type CycleBucket = "21-24" | "25-30" | "31-35" | "irregular";

const REASONS: Reason[] = [
  "Chronic menstrual pain",
  "Irregular cycles",
  "Severe PMS",
  "Just understanding my body",
];

const EXTERNAL_TRACKERS: { id: LinkedTracker; label: string; icon: string; note: string }[] = [
  { id: "flo",          label: "Flo",         icon: "🌸", note: "Connect via Health app" },
  { id: "clue",         label: "Clue",        icon: "🟠", note: "Connect via Health app" },
  { id: "apple_health", label: "Apple Health", icon: "❤️", note: "Read cycle data directly" },
];

const CYCLE_BUCKETS: { id: CycleBucket; label: string }[] = [
  { id: "21-24",     label: "21–24 days" },
  { id: "25-30",     label: "25–30 days" },
  { id: "31-35",     label: "31–35 days" },
  { id: "irregular", label: "Irregular" },
];

function StepShell({ children, step, total }: { children: React.ReactNode; step: number; total: number }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "28px 28px 0", overflow: "auto" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            height: 4, borderRadius: 2, flex: 1,
            background: i < step ? color.rose : i === step - 1 ? color.purple : color.border,
          }} />
        ))}
      </div>
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn-primary">{children}</button>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="btn-ghost">{children}</button>
  );
}

function StepReason({ onNext }: { onNext: (reason: Reason) => void }) {
  const [selected, setSelected] = useState<Reason | null>(null);
  return (
    <StepShell step={1} total={3}>
      <div style={{ width: 48, height: 48, borderRadius: 16, marginBottom: 24, background: gradient.primary }} />
      <h1 style={{ fontFamily: font.serif, fontSize: 28, color: color.charcoal, margin: "0 0 8px", lineHeight: 1.25, fontWeight: 400 }}>
        What brings you here?
      </h1>
      <p style={{ fontSize: 15, color: color.muted, marginBottom: 24, lineHeight: 1.6, fontFamily: font.sans }}>
        This helps us understand which patterns to watch for.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {REASONS.map(r => (
          <button key={r} onClick={() => setSelected(r)} style={{
            padding: "15px 18px", borderRadius: 14, textAlign: "left",
            border: `2px solid ${selected === r ? color.rose : color.border}`,
            background: selected === r ? color.rosePale : color.white,
            color: selected === r ? color.rose : color.charcoal,
            fontSize: 15, cursor: "pointer", fontFamily: font.sans,
            fontWeight: selected === r ? 600 : 400,
          }}>{r}</button>
        ))}
      </div>
      <div style={{ padding: "24px 0" }}>
        <p style={{ fontSize: 13, color: color.mutedLight, textAlign: "center", fontStyle: "italic", marginBottom: 16, fontFamily: font.sans, lineHeight: 1.5 }}>
          We won't diagnose you. We help you notice patterns you couldn't see before.
        </p>
        <PrimaryBtn onClick={() => selected && onNext(selected)} disabled={!selected}>
          Continue
        </PrimaryBtn>
      </div>
    </StepShell>
  );
}

function StepTrackerChoice({ onNext }: { onNext: (choice: TrackerChoice, linked: LinkedTracker | null) => void }) {
  const [choice, setChoice]   = useState<TrackerChoice | null>(null);
  const [linked, setLinked]   = useState<LinkedTracker | null>(null);
  const ready = choice === "ours" || choice === "skip" || (choice === "link" && linked !== null);

  return (
    <StepShell step={2} total={3}>
      <h1 style={{ fontFamily: font.serif, fontSize: 26, color: color.charcoal, margin: "0 0 8px", lineHeight: 1.25, fontWeight: 400 }}>
        How do you want to track your cycle?
      </h1>
      <p style={{ fontSize: 15, color: color.muted, marginBottom: 24, lineHeight: 1.6, fontFamily: font.sans }}>
        We use cycle phase to make your patterns more meaningful.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { id: "ours" as const, label: "Use EndoMatrix's calendar", sub: "Log period days directly in the app" },
          { id: "link" as const, label: "Link an existing tracker",  sub: "Connect Flo, Clue, or Apple Health" },
          { id: "skip" as const, label: "Skip for now",              sub: "Connect later in Settings" },
        ].map(opt => (
          <button key={opt.id} onClick={() => { setChoice(opt.id); if (opt.id !== "link") setLinked(null); }} style={{
            padding: "15px 18px", borderRadius: 14, textAlign: "left",
            border: `2px solid ${choice === opt.id ? color.purple : color.border}`,
            background: choice === opt.id ? color.purplePale : color.white,
            cursor: "pointer",
          }}>
            <p style={{ margin: 0, fontSize: 15, fontFamily: font.sans, fontWeight: 600, color: choice === opt.id ? color.purple : color.charcoal }}>{opt.label}</p>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: color.muted, fontFamily: font.sans }}>{opt.sub}</p>
          </button>
        ))}
      </div>

      {choice === "link" && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ fontSize: 13, color: color.muted, fontFamily: font.sans, margin: "0 0 4px" }}>Choose your tracker:</p>
          {EXTERNAL_TRACKERS.map(t => (
            <button key={t.id} onClick={() => setLinked(t.id)} style={{
              padding: "14px 16px", borderRadius: 14, textAlign: "left",
              border: `2px solid ${linked === t.id ? color.rose : color.border}`,
              background: linked === t.id ? color.rosePale : color.white,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 22 }}>{t.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontFamily: font.sans, fontWeight: 600, color: linked === t.id ? color.rose : color.charcoal }}>{t.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: color.muted, fontFamily: font.sans }}>{t.note}</p>
              </div>
            </button>
          ))}
          <p style={{ fontSize: 12, color: color.mutedLight, fontFamily: font.sans, margin: "4px 0 0", lineHeight: 1.5 }}>
            Connection happens via HealthKit. We only read cycle start dates.
          </p>
        </div>
      )}

      <div style={{ marginTop: "auto", padding: "24px 0" }}>
        <PrimaryBtn onClick={() => ready && onNext(choice!, linked)} disabled={!ready}>
          Continue
        </PrimaryBtn>
      </div>
    </StepShell>
  );
}

function StepCycleInfo({ onDone, submitting }: { onDone: (lastPeriod: string | null, bucket: CycleBucket | null) => void; submitting: boolean }) {
  const [lastPeriod, setLastPeriod] = useState("");
  const [bucket, setBucket]         = useState<CycleBucket | null>(null);

  return (
    <StepShell step={3} total={3}>
      <h1 style={{ fontFamily: font.serif, fontSize: 26, color: color.charcoal, margin: "0 0 8px", lineHeight: 1.25, fontWeight: 400 }}>
        Your cycle, briefly.
      </h1>
      <p style={{ fontSize: 15, color: color.muted, marginBottom: 24, lineHeight: 1.6, fontFamily: font.sans }}>
        Optional — helps us anchor patterns to cycle phases.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ fontSize: 13, color: color.muted, fontFamily: font.sans, display: "block", marginBottom: 8 }}>
            When did your last period start?
          </label>
          <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)}
            max={new Date().toISOString().slice(0, 10)} style={{
              width: "100%", padding: "14px 16px", borderRadius: 12,
              border: `1.5px solid ${color.border}`, background: color.white,
              fontSize: 15, color: color.charcoal, fontFamily: font.sans, boxSizing: "border-box",
            }} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: color.muted, fontFamily: font.sans, display: "block", marginBottom: 8 }}>
            Average cycle length
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {CYCLE_BUCKETS.map(b => (
              <button key={b.id} onClick={() => setBucket(b.id)} style={{
                flex: 1, padding: "10px 4px", borderRadius: 10, cursor: "pointer",
                border: `1.5px solid ${bucket === b.id ? color.purple : color.border}`,
                background: bucket === b.id ? color.purplePale : color.white,
                fontSize: 11, color: bucket === b.id ? color.purple : color.charcoal,
                fontFamily: font.sans, fontWeight: bucket === b.id ? 700 : 400,
              }}>{b.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "auto", padding: "24px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        <PrimaryBtn onClick={() => onDone(lastPeriod || null, bucket)} disabled={submitting}>
          {submitting ? "Setting up…" : "Start logging"}
        </PrimaryBtn>
        <GhostBtn onClick={() => onDone(null, null)}>Skip for now</GhostBtn>
      </div>
    </StepShell>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [step, setStep]             = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleReason = (_reason: Reason) => setStep(1);
  const handleTracker = (_choice: TrackerChoice, _linked: LinkedTracker | null) => setStep(2);

  const handleCycleInfo = async (lastPeriod: string | null, bucket: CycleBucket | null) => {
    setSubmitting(true);
    try {
      const token = await getToken();
      if (lastPeriod && token) {
        const avgLength = bucket === "21-24" ? 22 : bucket === "25-30" ? 28 : bucket === "31-35" ? 33 : 28;
        await setBaseline({
          average_cycle_length: avgLength,
          last_period_start: lastPeriod,
          is_irregular: bucket === "irregular",
        }, token);
      }
    } catch {
      // Non-blocking — user can update later in Settings
    } finally {
      setSubmitting(false);
      router.push("/home");
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: color.bg }}>
      {step === 0 && <StepReason onNext={handleReason} />}
      {step === 1 && <StepTrackerChoice onNext={handleTracker} />}
      {step === 2 && <StepCycleInfo onDone={handleCycleInfo} submitting={submitting} />}
    </div>
  );
}
