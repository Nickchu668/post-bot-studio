import { Sparkles } from "lucide-react";

export function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border md:hidden">
      <div className="flex items-center gap-3 px-4 h-14">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground">app-panel</h1>
        </div>
      </div>
    </header>
  );
}
