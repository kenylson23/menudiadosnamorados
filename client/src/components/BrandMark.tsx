import * as React from "react";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  subtitle = "Las Tortillas",
}: {
  className?: string;
  subtitle?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)} data-testid="brand-mark">
      <div
        className={cn(
          "grid place-items-center rounded-2xl border bg-card px-3 py-2 shadow-sm",
          "border-card-border/70",
        )}
        aria-hidden="true"
      >
        <div className="font-display text-lg leading-none text-primary">LT</div>
      </div>
      <div className="leading-tight">
        <div className="font-display text-base text-foreground">{subtitle}</div>
        <div className="text-xs font-medium text-muted-foreground">Menu online</div>
      </div>
    </div>
  );
}
