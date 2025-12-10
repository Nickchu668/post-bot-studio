import { NavLink, useLocation } from "react-router-dom";
import { Image, Video, Calendar, Settings, Sparkles, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { path: "/", icon: Image, label: "相片出POST" },
  { path: "/video", icon: Video, label: "影片出POST" },
  { path: "/schedule", icon: Calendar, label: "文案排程" },
  { path: "/dashboard", icon: Settings, label: "控制台" },
];

export function Sidebar() {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("已登出");
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">app-panel</h1>
          <p className="text-xs text-muted-foreground">AI 自動化發佈</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-6 rounded-full gradient-primary" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          登出
        </Button>
        <div className="px-4 py-3 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground">Powered by AI</p>
          <p className="text-sm font-medium text-foreground">自動化您的社交媒體</p>
        </div>
      </div>
    </aside>
  );
}
