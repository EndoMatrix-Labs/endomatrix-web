import NavBar from "@/components/ui/NavBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <main className="screen">{children}</main>
      <NavBar />
    </div>
  );
}
