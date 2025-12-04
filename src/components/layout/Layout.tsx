import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { MobileHeader } from "./MobileHeader";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileHeader />
      <main className="md:ml-64 pt-14 pb-20 md:pt-0 md:pb-0 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
