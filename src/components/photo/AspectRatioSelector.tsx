import { cn } from "@/lib/utils";
import { Monitor, Square, Smartphone } from "lucide-react";

export type AspectRatio = "horizontal" | "square" | "vertical";

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
}

const ratios = [
  { id: "horizontal" as const, label: "橫向 16:9", Icon: Monitor },
  { id: "square" as const, label: "正方形 1:1", Icon: Square },
  { id: "vertical" as const, label: "直向 9:16", Icon: Smartphone },
];

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">選擇圖片尺寸</p>
      <div className="grid grid-cols-3 gap-2">
        {ratios.map((ratio) => {
          const isActive = value === ratio.id;
          const Icon = ratio.Icon;
          return (
            <button
              key={ratio.id}
              type="button"
              onClick={() => onChange(ratio.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-xl transition-all duration-200 border-2",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-card/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={1.5} />
              <span className="text-xs font-medium whitespace-nowrap">
                {ratio.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
