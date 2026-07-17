import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-64">
        <Topbar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
