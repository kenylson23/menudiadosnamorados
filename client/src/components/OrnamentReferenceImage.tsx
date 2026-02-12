import * as React from "react";
import logoImg from "@assets/363504994_941309393603468_1368326213525914887_n_1770920551378.jpg";

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
      <div className="relative p-6 sm:p-8 flex items-center justify-center">
        <img
          src={logoImg}
          alt="Logotipo Las Tortillas"
          className="h-auto w-full max-w-[240px] transition-transform duration-500 hover:scale-105"
          data-testid="restaurant-logo"
        />
      </div>
    </div>
  );
}
