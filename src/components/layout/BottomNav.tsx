import { NavLink, useLocation } from "react-router-dom";
import { Image, Video, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Image, label: "相片" },
  { path: "/video", icon: Video, label: "影片" },
  { path: "/schedule", icon: Calendar, label: "排程" },
  { path: "/dashboard", icon: Settings, label: "控制台" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  isActive && "scale-110"
                )}
              />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-1 w-8 h-1 rounded-full gradient-primary" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
