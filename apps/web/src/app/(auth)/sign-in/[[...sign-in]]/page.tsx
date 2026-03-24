"use client";

import { SignIn } from "@clerk/nextjs";
import { color, gradient, font } from "@/lib/theme";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100dvh", background: color.bg, display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: font.sans,
    }}>
      <div style={{ marginBottom: 36, textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, margin: "0 auto 14px", background: gradient.primary }} />
        <h1 style={{ fontFamily: font.serif, fontSize: 24, color: color.charcoal, fontWeight: 400, margin: "0 0 6px" }}>
          EndoMatrix Core
        </h1>
        <p style={{ fontSize: 14, color: color.muted }}>Understand your hormonal patterns.</p>
      </div>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: color.rose, colorBackground: color.white,
            colorText: color.charcoal, borderRadius: "14px", fontFamily: font.sans,
          },
          elements: {
            card: { boxShadow: "none", border: `1px solid ${color.border}`, borderRadius: 18 },
            headerTitle: { fontFamily: font.serif, fontWeight: 400 },
          },
        }}
        routing="path"
        path="/sign-in"
        forceRedirectUrl="/home"
        signUpForceRedirectUrl="/onboarding"
      />
    </div>
  );
}
