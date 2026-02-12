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
        "group rounded-2xl border bg-background/70 px-4 py-3",
        "border-border/70 shadow-sm shadow-black/5",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10 hover:border-border",
      )}
      data-testid={dataTestId}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <p className="truncate text-sm sm:text-base font-semibold text-foreground">
              {name}
            </p>
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
          </div>
          {description ? (
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {typeof priceKz === "number" ? (
          <div className="shrink-0 text-right">
            <div className="rounded-xl border border-border bg-card px-3 py-1.5 shadow-sm">
              <p className="text-xs font-semibold text-primary">{priceKz.toLocaleString("pt-PT")} kz</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
