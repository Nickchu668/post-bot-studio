import { cn } from "@/lib/utils";

export type AspectRatio = "horizontal" | "square" | "vertical";

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
}

const ratios = [
  { id: "horizontal" as const, label: "16:9", width: 32, height: 18 },
  { id: "square" as const, label: "1:1", width: 24, height: 24 },
  { id: "vertical" as const, label: "9:16", width: 18, height: 32 },
];

export function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      {ratios.map((ratio) => {
        const isActive = value === ratio.id;
        return (
          <button
            key={ratio.id}
            type="button"
            onClick={() => onChange(ratio.id)}
            className="flex flex-col items-center gap-2 group"
          >
            {/* Visual ratio box */}
            <div
              className={cn(
                "border-2 rounded transition-all duration-200 flex items-center justify-center",
                isActive
                  ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(var(--primary),0.3)]"
                  : "border-muted-foreground/30 bg-transparent group-hover:border-muted-foreground/50"
              )}
              style={{
                width: ratio.width,
                height: ratio.height,
              }}
            />
            {/* Label */}
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {ratio.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
