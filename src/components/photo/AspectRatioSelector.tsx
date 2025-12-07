import { cn } from "@/lib/utils";

export type AspectRatio = "horizontal" | "square" | "vertical";

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
}

const ratios = [
  { id: "horizontal" as const, label: "16:9", icon: "▬" },
  { id: "square" as const, label: "1:1", icon: "■" },
  { id: "vertical" as const, label: "9:16", icon: "▮" },
];

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">比例</span>
      <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
        {ratios.map((ratio) => {
          const isActive = value === ratio.id;
          return (
            <button
              key={ratio.id}
              type="button"
              onClick={() => onChange(ratio.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <span className="text-xs">{ratio.icon}</span>
              <span>{ratio.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
