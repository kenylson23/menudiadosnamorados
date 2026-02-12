import * as React from "react";
import { Heart, Phone, Sparkles, UtensilsCrossed, AlertTriangle, RefreshCw } from "lucide-react";
import { usePublicMenu } from "@/hooks/use-menu";
import { QrCodeDialog } from "@/components/QrCodeDialog";
import { SectionCard } from "@/components/SectionCard";
import { MenuItemRow } from "@/components/MenuItemRow";
import { OrnamentReferenceImage } from "@/components/OrnamentReferenceImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatPhone(raw?: string | null) {
  if (!raw) return null;
  return raw.replace(/\s+/g, "");
}

function buildWhatsAppLink(phone: string, text: string) {
  const p = phone.replace(/[^\d+]/g, "");
  return `https://wa.me/${p}?text=${encodeURIComponent(text)}`;
}

export default function PublicMenuPage() {
  const { data, isLoading, error, refetch, isFetching } = usePublicMenu();

  const url = React.useMemo(() => {
    if (typeof window === "undefined") return "https://example.com";
    return window.location.origin;
  }, []);

  const menuTitle = data?.meta?.menuTitle ?? "Menu Dia dos Namorados";
  const restaurantName = data?.meta?.restaurantName ?? "Las Tortillas";

  const footerNote = data?.meta?.footerNote ?? null;
  const whatsapp1 = formatPhone(data?.meta?.whatsapp1 ?? "927759068");
  const whatsapp2 = formatPhone(data?.meta?.whatsapp2 ?? "931879967");

  const coupleDinnerPrice =
    typeof data?.meta?.coupleDinnerPriceKz === "number"
      ? data?.meta?.coupleDinnerPriceKz
      : 65000;

  const coupleDinnerWithSparklingPrice =
    typeof data?.meta?.coupleDinnerWithSparklingPriceKz === "number"
      ? data?.meta?.coupleDinnerWithSparklingPriceKz
      : 80000;

  const reservationMessage = `Olá ${restaurantName}! Gostaria de fazer uma reserva para o Dia dos Namorados.`;

  return (
    <div className="relative min-h-screen mesh-bg grain">
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {/* Header */}
          <header className="animate-float-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 shadow-sm backdrop-blur">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Especial Romântico
                  </span>
                </div>

                <h1
                  className={cn(
                    "mt-4 font-display text-4xl sm:text-5xl md:text-6xl leading-[1.02]",
                    "text-foreground",
                  )}
                  data-testid="menu-title"
                >
                  {menuTitle}
                </h1>

                <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                  {restaurantName} — uma experiência elegante em tons creme e vermelho, feita para partilhar.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
                <QrCodeDialog url={url} />

                <Button
                  variant="secondary"
                  onClick={() => {
                    const el = document.querySelector("#reserva");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="rounded-2xl px-5 py-3 font-semibold hover:-translate-y-0.5 transition-all duration-300"
                  data-testid="btn-scroll-reserva"
                >
                  <span className="inline-flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Fazer reserva
                  </span>
                </Button>
              </div>
            </div>
          </header>

          {/* Body */}
          <main className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-[1.35fr_.65fr] gap-6 lg:gap-8">
            {/* Left: menu */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="rounded-3xl border border-card-border/70 bg-card p-6 sm:p-7 shadow-lg shadow-black/5 animate-float-in">
                  <div className="h-7 w-56 rounded-xl bg-muted animate-pulse" />
                  <div className="mt-6 space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-16 rounded-2xl bg-muted/70 animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="rounded-3xl border border-destructive/30 bg-card p-6 sm:p-7 shadow-lg shadow-black/5 animate-float-in">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-destructive/10 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-display text-xl">Não foi possível carregar o menu</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Verifique a ligação ou tente novamente.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          onClick={() => refetch()}
                          className="rounded-2xl"
                          data-testid="btn-retry-menu"
                        >
                          <span className="inline-flex items-center gap-2">
                            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
                            Recarregar
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : data ? (
                <div className="space-y-6 animate-float-in">
                  {/* Render from API */}
                  {data.sections
                    .slice()
                    .sort((a, b) => a.section.sortOrder - b.section.sortOrder)
                    .filter((s) => s.section.isActive)
                    .map((s, idx) => {
                      const items = s.items
                        .slice()
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .filter((it) => it.isActive);

                      const accent = idx % 2 === 0 ? "primary" : "accent";

                      return (
                        <SectionCard
                          key={s.section.id}
                          title={s.section.name.toUpperCase()}
                          accent={accent}
                          data-testid={`section-${s.section.id}`}
                        >
                          <div className="grid gap-3">
                            {items.length === 0 ? (
                              <div className="rounded-2xl border border-border bg-background/70 p-4">
                                <p className="text-sm text-muted-foreground">
                                  Sem itens nesta secção.
                                </p>
                              </div>
                            ) : (
                              items.map((it) => (
                                <MenuItemRow
                                  key={it.id}
                                  name={`• ${it.name}`}
                                  description={it.description ?? undefined}
                                  priceKz={it.priceKz ?? null}
                                  data-testid={`item-${it.id}`}
                                />
                              ))
                            )}
                          </div>
                        </SectionCard>
                      );
                    })}
                </div>
              ) : (
                <div className="rounded-3xl border border-card-border/70 bg-card p-6 sm:p-7 shadow-lg shadow-black/5 animate-float-in">
                  <p className="text-sm text-muted-foreground">Sem dados.</p>
                </div>
              )}
            </div>

            {/* Right rail */}
            <aside className="space-y-6 lg:sticky lg:top-6 h-fit">
              <OrnamentReferenceImage />

              <div
                id="reserva"
                className="rounded-3xl border border-card-border/70 bg-card shadow-lg shadow-black/5 overflow-hidden"
                data-testid="reservation-card"
              >
                <div className="p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl">Reservas</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Garanta a sua mesa. Uma noite, dois corações, e um menu inesquecível.
                      </p>
                    </div>
                    <div className="hidden sm:grid place-items-center h-11 w-11 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                      <UtensilsCrossed className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <a
                      href={whatsapp1 ? buildWhatsAppLink(whatsapp1, reservationMessage) : "#"}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "group rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-sm",
                        "hover:-translate-y-0.5 hover:shadow-md hover:border-border transition-all duration-300 ease-out",
                        !whatsapp1 && "pointer-events-none opacity-50",
                      )}
                      data-testid="whatsapp-1-link"
                      onClick={(e) => {
                        if (!whatsapp1) e.preventDefault();
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-muted-foreground">WhatsApp</p>
                          <p className="truncate text-sm font-semibold text-foreground">{whatsapp1 ?? "—"}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          Abrir <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </a>

                    <a
                      href={whatsapp2 ? buildWhatsAppLink(whatsapp2, reservationMessage) : "#"}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "group rounded-2xl border border-border bg-background/70 px-4 py-3 shadow-sm",
                        "hover:-translate-y-0.5 hover:shadow-md hover:border-border transition-all duration-300 ease-out",
                        !whatsapp2 && "pointer-events-none opacity-50",
                      )}
                      data-testid="whatsapp-2-link"
                      onClick={(e) => {
                        if (!whatsapp2) e.preventDefault();
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-muted-foreground">WhatsApp</p>
                          <p className="truncate text-sm font-semibold text-foreground">{whatsapp2 ?? "—"}</p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          Abrir <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </a>
                  </div>

                  {footerNote ? (
                    <div className="mt-5 rounded-2xl border border-border bg-background/60 p-4" data-testid="footer-note">
                      <p className="text-xs leading-relaxed text-muted-foreground">{footerNote}</p>
                    </div>
                  ) : null}
                </div>

                <div className="border-t border-border bg-gradient-to-r from-primary/10 via-transparent to-accent/10 p-5 sm:p-6">
                  <div className="grid gap-3" data-testid="prices">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-sm font-semibold text-foreground">Jantar Casal</p>
                      <p className="text-sm font-bold text-primary" data-testid="price-couple">
                        {coupleDinnerPrice.toLocaleString("pt-PT")} kz
                      </p>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-sm font-semibold text-foreground">Com espumante</p>
                      <p className="text-sm font-bold text-primary" data-testid="price-couple-sparkling">
                        {coupleDinnerWithSparklingPrice.toLocaleString("pt-PT")} kz
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground" data-testid="reservation-note">
                      Faça sua reserva via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>

              <footer className="pb-2 text-center text-xs text-muted-foreground" data-testid="public-footer">
                <span className="font-display text-foreground/90">{restaurantName}</span> •{" "}
                <span>Feito com cuidado — creme &amp; vermelho.</span>
              </footer>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}
