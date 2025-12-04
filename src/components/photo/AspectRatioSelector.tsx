import { cn } from "@/lib/utils";
import { RectangleHorizontal, Square, RectangleVertical } from "lucide-react";

export type AspectRatio = "horizontal" | "square" | "vertical";

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
}

const ratios = [
  { id: "horizontal" as const, icon: RectangleHorizontal, label: "橫向", ratio: "16:9" },
  { id: "square" as const, icon: Square, label: "正方形", ratio: "1:1" },
  { id: "vertical" as const, icon: RectangleVertical, label: "直向", ratio: "9:16" },
];

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">選擇圖片尺寸</label>
      <div className="grid grid-cols-3 gap-3">
        {ratios.map((ratio) => {
          const isActive = value === ratio.id;
          return (
            <button
              key={ratio.id}
              type="button"
              onClick={() => onChange(ratio.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                isActive
                  ? "border-primary bg-primary/10 text-primary shadow-glow"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              <ratio.icon className={cn("w-8 h-8", isActive && "text-primary")} />
              <span className="text-sm font-medium">{ratio.label}</span>
              <span className="text-xs opacity-70">{ratio.ratio}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
