import * as React from "react";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  children,
  accent = "primary",
  "data-testid": dataTestId,
}: {
  title: string;
  children: React.ReactNode;
  accent?: "primary" | "accent";
  "data-testid"?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-card/40 shadow-sm backdrop-blur-sm",
        "border-card-border/50 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
      )}
      data-testid={dataTestId}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={cn(
            "absolute -top-32 -right-32 h-64 w-64 rounded-full blur-[100px] opacity-20 transition-opacity duration-700 group-hover:opacity-30",
            accent === "primary" ? "bg-primary" : "bg-accent",
          )}
        />
      </div>

      <div className="relative p-6 sm:p-8">
        <header className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-foreground">{title}</h2>
            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-primary to-transparent opacity-60" />
          </div>
          <div className="hidden sm:block">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/80 backdrop-blur-md">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full animate-pulse",
                  accent === "primary" ? "bg-primary" : "bg-accent",
                )}
              />
              Sabor & Amor
            </span>
          </div>
        </header>

        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
