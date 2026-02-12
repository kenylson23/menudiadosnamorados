import * as React from "react";
import { Link } from "wouter";
import { Compass, ExternalLink, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SitemapPage() {
  return (
    <div className="min-h-screen mesh-bg grain">
      <div className="relative z-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <header className="rounded-3xl border border-card-border/70 bg-card/80 backdrop-blur p-7 shadow-lg shadow-black/5 animate-float-in">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 border border-primary/20">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-3xl sm:text-4xl">Páginas</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Atalhos rápidos para navegar no menu e administração.
                </p>
              </div>
            </div>
          </header>

          <main className="mt-7 grid gap-4">
            <Link
              href="/"
              className={cn(
                "group rounded-3xl border border-border bg-card px-6 py-5 shadow-sm",
                "hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 ease-out",
              )}
              data-testid="link-home"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-xl">Menu público</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    O menu elegante para clientes (com QR code).
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </Link>

            <Link
              href="/admin"
              className={cn(
                "group rounded-3xl border border-border bg-card px-6 py-5 shadow-sm",
                "hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 ease-out",
              )}
              data-testid="link-admin"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className="text-xs font-semibold">Admin</span>
                  </div>
                  <p className="font-display text-xl">Gestão do menu</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Meta, secções e itens (CRUD completo).
                  </p>
                </div>
                <ExternalLink className="h-5 w-5 text-primary transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </Link>
          </main>
        </div>
      </div>
    </div>
  );
}
