import * as React from "react";
import { cn } from "@/lib/utils";

export function MenuItemRow({
  name,
  description,
  priceKz,
  "data-testid": dataTestId,
}: {
  name: string;
  description?: string | null;
  priceKz?: number | null;
  "data-testid"?: string;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-background/40 p-5",
        "border-border/40 shadow-sm backdrop-blur-sm",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:bg-background/60",
      )}
      data-testid={dataTestId}
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-3">
            <p className="text-base sm:text-lg font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary/90">
              {name}
            </p>
          </div>
          {description ? (
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground/80 line-clamp-2 transition-colors duration-300 group-hover:text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {typeof priceKz === "number" ? (
          <div className="shrink-0">
            <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-primary/5 px-4 py-2 transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:scale-105">
              <p className="text-sm font-bold text-primary transition-colors duration-300 group-hover:text-white">
                {priceKz.toLocaleString("pt-PT")} <span className="text-[10px] opacity-70">KZ</span>
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
