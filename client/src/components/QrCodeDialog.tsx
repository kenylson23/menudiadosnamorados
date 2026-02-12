import * as React from "react";
import QRCode from "qrcode";
import { Download, Link as LinkIcon, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

async function toPngDataUrl(text: string) {
  return await QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 900,
    color: {
      dark: "#8f1334",
      light: "#fff7ef",
    },
  });
}

export function QrCodeDialog({
  url,
  triggerTestId = "btn-show-qr",
}: {
  url: string;
  triggerTestId?: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    async function run() {
      if (!open) return;
      setLoading(true);
      try {
        const png = await toPngDataUrl(url);
        if (!mounted) return;
        setDataUrl(png);
      } catch (e) {
        console.error(e);
        toast({
          title: "Não foi possível gerar o QR Code",
          description: "Tente novamente.",
          variant: "destructive",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [open, url, toast]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copiado", description: "Pode partilhar o menu agora." });
    } catch {
      toast({ title: "Falha ao copiar", description: "O seu navegador pode bloquear esta ação.", variant: "destructive" });
    }
  };

  const onDownload = async () => {
    try {
      const png = dataUrl ?? (await toPngDataUrl(url));
      const a = document.createElement("a");
      a.href = png;
      a.download = "las-tortillas-qr.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      toast({ title: "Falha ao descarregar", description: "Tente novamente.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          data-testid={triggerTestId}
          className={[
            "relative overflow-hidden rounded-2xl px-5 py-3 font-semibold",
            "bg-gradient-to-r from-primary to-accent text-primary-foreground",
            "shadow-lg shadow-primary/20",
            "hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5",
            "active:translate-y-0 active:shadow-md",
            "transition-all duration-300 ease-out",
          ].join(" ")}
          onClick={() => setOpen(true)}
        >
          <span className="absolute inset-0 opacity-25 bg-[radial-gradient(500px_120px_at_20%_0%,rgba(255,255,255,.7),transparent_60%)]" />
          <span className="relative inline-flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Exibir QR Code
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-lg rounded-3xl border-card-border/70 bg-card p-0 shadow-2xl">
        <div className="p-6 sm:p-7">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">QR Code do Menu</DialogTitle>
          </DialogHeader>

          <div className="mt-4 grid gap-5">
            <div className="glass rounded-3xl p-4 shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">Destino</p>
                  <p className="truncate text-sm font-medium text-foreground" data-testid="qr-url">
                    {url}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={onCopy}
                  data-testid="btn-copy-link"
                >
                  <span className="inline-flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Copiar
                  </span>
                </Button>
              </div>

              <div className="mt-4 grid place-items-center">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/15 via-accent/10 to-transparent blur-xl" />
                  <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-background p-3 shadow-lg">
                    {loading ? (
                      <div className="grid place-items-center px-10 py-14">
                        <div className="h-10 w-10 rounded-2xl border border-border bg-card shadow-sm animate-pulse" />
                        <p className="mt-4 text-sm text-muted-foreground">A gerar QR Code…</p>
                      </div>
                    ) : dataUrl ? (
                      <img
                        src={dataUrl}
                        alt="QR Code"
                        className="h-[260px] w-[260px] sm:h-[300px] sm:w-[300px]"
                        data-testid="qr-image"
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button
                  className="rounded-2xl"
                  variant="default"
                  onClick={onDownload}
                  data-testid="btn-download-qr"
                >
                  <span className="inline-flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Descarregar
                  </span>
                </Button>
                <Button
                  className="rounded-2xl"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                  data-testid="btn-close-qr"
                >
                  Fechar
                </Button>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Dica: coloque este QR code na mesa ou no balcão para os clientes acederem ao menu instantaneamente.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
