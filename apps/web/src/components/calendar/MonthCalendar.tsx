"use client";

import { color, font, DEFAULT_HIGH_PAIN_DAYS } from "@/lib/theme";

const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

interface Props {
  year: number;
  month: number;             // 0-indexed (JS Date convention)
  periodDays: Set<number>;
  predictedDays: Set<number>;
  onToggleDay: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Monday-start offset: Sunday=6, Monday=0, etc.
function getMondayOffset(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return (d === 0 ? 6 : d - 1);
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function MonthCalendar({
  year, month, periodDays, predictedDays,
  onToggleDay, onPrevMonth, onNextMonth,
}: Props) {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = isCurrentMonth ? today.getDate() : -1;

  const daysInMonth = getDaysInMonth(year, month);
  const offset      = getMondayOffset(year, month);

  return (
    <div style={{
      background: `linear-gradient(155deg, ${color.rose} 0%, ${color.purple} 100%)`,
      padding: "18px 20px 24px",
      borderRadius: "0 0 28px 28px",
      flexShrink: 0,
    }}>
      {/* Month navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <button onClick={onPrevMonth} style={{
          background: "none", border: "none", color: "rgba(255,255,255,0.6)",
          fontSize: 22, cursor: "pointer", padding: "0 8px",
        }}>‹</button>
        <h2 style={{ color: color.white, fontFamily: font.serif, fontSize: 19, fontWeight: 400, margin: 0 }}>
          {MONTH_NAMES[month]} {year}
        </h2>
        <button onClick={onNextMonth} style={{
          background: "none", border: "none", color: "rgba(255,255,255,0.6)",
          fontSize: 22, cursor: "pointer", padding: "0 8px",
        }}>›</button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
        {WEEK_LABELS.map((d, i) => (
          <div key={i} style={{
            textAlign: "center", fontSize: 11,
            color: "rgba(255,255,255,0.55)", fontFamily: font.sans, fontWeight: 600,
          }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {/* Empty offset cells */}
        {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const isPeriod    = periodDays.has(day);
          const isPredicted = predictedDays.has(day);
          const isHighPain  = DEFAULT_HIGH_PAIN_DAYS.has(day) && !isPeriod;
          const isToday     = day === todayDate;

          let bg    = "transparent";
          let clr   = "rgba(255,255,255,0.85)";
          let border = "none";

          if (isPeriod)    { bg = "rgba(255,255,255,0.92)"; clr = color.rose; }
          if (isPredicted) { bg = "rgba(255,255,255,0.12)"; border = "1.5px dashed rgba(255,255,255,0.45)"; }
          if (isToday && !isPeriod) { border = "2px solid rgba(255,255,255,0.9)"; }

          return (
            <button
              key={day}
              onClick={() => onToggleDay(day)}
              aria-label={`${isPeriod ? "Unmark" : "Mark"} day ${day} as period`}
              aria-pressed={isPeriod}
              style={{
                aspectRatio: "1", borderRadius: "50%", background: bg,
                border, color: clr, fontSize: 13, fontFamily: font.sans,
                fontWeight: isToday || isPeriod ? 700 : 400,
                cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 1, padding: 0,
              }}
            >
              {day}
              {isHighPain && (
                <span style={{
                  width: 3, height: 3, borderRadius: "50%",
                  background: "rgba(255,255,255,0.45)", display: "block",
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
