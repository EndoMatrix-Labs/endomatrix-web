"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { color, font } from "@/lib/theme";

const TABS = [
  { href: "/calendar", label: "Cycle",    icon: "◯" },
  { href: "/log",      label: "Log",      icon: "+"  },
  { href: "/home",     label: "Home",     icon: "⌂"  },
  { href: "/insights", label: "Insights", icon: "△"  },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav style={{
      borderTop: `1px solid ${color.border}`,
      background: color.white,
      display: "flex",
      padding: "8px 0 env(safe-area-inset-bottom, 18px)",
      flexShrink: 0,
    }}>
      {TABS.map(tab => {
        const active = pathname === tab.href;
        return (
          <Link key={tab.href} href={tab.href} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3, padding: "6px 0",
            color: active ? color.rose : color.mutedLight,
            textDecoration: "none", fontFamily: font.sans,
            transition: "color 0.12s",
          }}>
            <span style={{ fontSize: active ? 20 : 18, fontWeight: active ? 700 : 400 }}>
              {tab.icon}
            </span>
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 400, letterSpacing: "0.04em" }}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
