import * as React from "react";
import { 
  RiHeartFill, 
  RiWhatsappFill, 
  RiMagicFill, 
  RiRestaurantFill, 
  RiAlertFill, 
  RiRefreshLine,
  RiArrowDownLine
} from "react-icons/ri";
import { usePublicMenu } from "@/hooks/use-menu";
import { QrCodeDialog } from "@/components/QrCodeDialog";
import { SectionCard } from "@/components/SectionCard";
import { MenuItemRow } from "@/components/MenuItemRow";
import { OrnamentReferenceImage } from "@/components/OrnamentReferenceImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoPng from "@assets/Captura_de_ecrã_2026-02-12_190852_1770925181463.png";

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
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 shadow-sm backdrop-blur">
                  <RiHeartFill className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Especial Romântico
                  </span>
                </div>

                <h1
                  className={cn(
                    "mt-6 font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight",
                    "bg-gradient-to-br from-foreground via-foreground to-primary/60 bg-clip-text text-transparent",
                  )}
                  data-testid="menu-title"
                >
                  {menuTitle}
                </h1>

                <p className="mt-4 text-base sm:text-lg text-muted-foreground/90 max-w-xl leading-relaxed">
                  {restaurantName} — uma experiência elegante em tons creme e vermelho, meticulosamente preparada para celebrar o amor.
                </p>
              </div>

              <a 
                href="/menu-namorados.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative block w-full max-w-[200px] overflow-hidden rounded-[2rem] border-2 border-primary/20 bg-card shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:shadow-primary/30 hover:border-primary/40"
                data-testid="link-menu-pdf"
              >
                <img 
                  src={logoPng} 
                  alt="Menu Dia dos Namorados" 
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-xl mb-2">
                    <RiMagicFill className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    Explorar Menu
                  </span>
                </div>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                variant="default"
                size="lg"
                onClick={() => {
                  const el = document.querySelector("#reserva");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="h-12 rounded-full px-8 font-bold text-base bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all duration-500 hover:-translate-y-1 active:scale-95"
                data-testid="btn-scroll-reserva"
              >
                <RiArrowDownLine className="mr-2 h-5 w-5 animate-bounce" />
                Garantir minha mesa
              </Button>
              
              <div className="h-10 w-px bg-border/40 mx-2 hidden sm:block" />
              
              <QrCodeDialog url={url} />
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
                      <RiAlertFill className="h-5 w-5" />
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
                            <RiRefreshLine className={cn("h-4 w-4", isFetching && "animate-spin")} />
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
                className="group rounded-[2.5rem] border border-primary/10 bg-card/60 shadow-2xl shadow-black/5 overflow-hidden backdrop-blur-xl transition-all duration-500 hover:border-primary/30"
                data-testid="reservation-card"
              >
                <div className="p-8 sm:p-10">
                  <div className="flex flex-col gap-6">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <RiRestaurantFill className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground">Reservas</h3>
                      <p className="mt-3 text-base text-muted-foreground/80 leading-relaxed">
                        Garanta a sua mesa. Uma noite, dois corações, e um menu verdadeiramente inesquecível.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4">
                    <a
                      href={whatsapp1 ? buildWhatsAppLink(whatsapp1, reservationMessage) : "#"}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "group/btn rounded-2xl border border-primary/5 bg-white/50 px-6 py-4 shadow-sm",
                        "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 hover:bg-white transition-all duration-500 ease-out",
                        !whatsapp1 && "pointer-events-none opacity-50",
                      )}
                      data-testid="whatsapp-1-link"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-colors group-hover/btn:bg-primary">
                            <RiWhatsappFill className="h-5 w-5 text-primary group-hover/btn:text-white" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">WhatsApp Principal</p>
                            <p className="text-base font-bold text-foreground">{whatsapp1 ?? "—"}</p>
                          </div>
                        </div>
                        <RiMagicFill className="h-5 w-5 text-primary opacity-0 -translate-x-2 transition-all duration-500 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                      </div>
                    </a>

                    <a
                      href={whatsapp2 ? buildWhatsAppLink(whatsapp2, reservationMessage) : "#"}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "group/btn rounded-2xl border border-primary/5 bg-white/50 px-6 py-4 shadow-sm",
                        "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 hover:bg-white transition-all duration-500 ease-out",
                        !whatsapp2 && "pointer-events-none opacity-50",
                      )}
                      data-testid="whatsapp-2-link"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-colors group-hover/btn:bg-primary">
                            <RiWhatsappFill className="h-5 w-5 text-primary group-hover/btn:text-white" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">WhatsApp Secundário</p>
                            <p className="text-base font-bold text-foreground">{whatsapp2 ?? "—"}</p>
                          </div>
                        </div>
                        <RiMagicFill className="h-5 w-5 text-primary opacity-0 -translate-x-2 transition-all duration-500 group-hover/btn:opacity-100 group-hover/btn:translate-x-0" />
                      </div>
                    </a>
                  </div>

                  {footerNote ? (
                    <div className="mt-8 rounded-2xl bg-primary/5 p-5 border border-primary/10" data-testid="footer-note">
                      <p className="text-xs font-medium leading-relaxed text-primary/70 italic text-center">
                        "{footerNote}"
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="relative border-t border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-8">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                  <div className="grid gap-4" data-testid="prices">
                    <div className="flex items-end justify-between gap-4">
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">Jantar Casal</p>
                      <div className="text-right">
                        <p className="text-3xl font-black tracking-tighter text-primary" data-testid="price-couple">
                          {coupleDinnerPrice.toLocaleString("pt-PT")} <span className="text-sm font-bold opacity-50">KZ</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">Com Espumante</p>
                      <div className="text-right">
                        <p className="text-3xl font-black tracking-tighter text-primary" data-testid="price-couple-sparkling">
                          {coupleDinnerWithSparklingPrice.toLocaleString("pt-PT")} <span className="text-sm font-bold opacity-50">KZ</span>
                        </p>
                      </div>
                    </div>
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
