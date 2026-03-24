import { color, font, PHASES } from "@/lib/theme";
import type { CyclePhase } from "@/lib/types";

interface Props {
  currentPhase: CyclePhase | null;
}

export default function PhaseStrip({ currentPhase }: Props) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {PHASES.map(phase => {
        const active = phase.key === currentPhase;
        return (
          <div key={phase.key} style={{
            flex: 1, borderRadius: 10, padding: "8px 6px",
            background: active ? color.purplePale : color.bgDeep,
            border: active ? `1.5px solid ${color.purple}` : "none",
            textAlign: "center",
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: active ? color.purple : color.mutedLight,
              margin: "0 auto 5px",
            }} />
            <p style={{
              fontSize: 10, fontFamily: font.sans,
              color: active ? color.purple : color.muted,
              margin: 0, fontWeight: active ? 700 : 400,
            }}>{phase.label}</p>
            <p style={{ fontSize: 10, color: color.mutedLight, fontFamily: font.sans, margin: "2px 0 0" }}>
              {phase.days}
            </p>
          </div>
        );
      })}
    </div>
  );
}
