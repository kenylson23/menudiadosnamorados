import * as React from "react";
import referenceImg from "@assets/Captura_de_ecrã_2026-02-12_190852_1770919849107.png";

export function OrnamentReferenceImage() {
  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-card-border/70 bg-card shadow-lg shadow-black/5"
      data-testid="reference-image-card"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="relative p-3 sm:p-4">
        <img
          src={referenceImg}
          alt="Referência visual do menu"
          className="h-auto w-full rounded-2xl border border-border/60 shadow-sm"
          data-testid="reference-image"
        />
      </div>
    </div>
  );
}
