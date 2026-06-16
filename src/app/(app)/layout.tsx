import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Decorative Background Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-orange-400/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-coral-400/20 blur-[150px] pointer-events-none" />
        
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 z-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
