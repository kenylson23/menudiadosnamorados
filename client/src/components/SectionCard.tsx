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
        "relative overflow-hidden rounded-3xl border bg-card shadow-lg shadow-black/5",
        "border-card-border/70",
      )}
      data-testid={dataTestId}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={cn(
            "absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-30",
            accent === "primary" ? "bg-primary/40" : "bg-accent/40",
          )}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      <div className="relative p-5 sm:p-6 md:p-7">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground">{title}</h2>
            <div className="mt-2 h-px w-20 bg-gradient-to-r from-primary/70 to-transparent" />
          </div>
          <div className="hidden sm:block text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  accent === "primary" ? "bg-primary" : "bg-accent",
                )}
              />
              Dia dos Namorados
            </span>
          </div>
        </header>

        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}
