import * as React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { RiDownload2Fill, RiLink, RiQrCodeFill } from "react-icons/ri";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logoImg from "@assets/363504994_941309393603468_1368326213525914887_n_1770920551378.jpg";

export function QrCodeDialog({
  url,
  triggerTestId = "btn-show-qr",
}: {
  url: string;
  triggerTestId?: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copiado", description: "Pode partilhar o menu agora." });
    } catch {
      toast({ title: "Falha ao copiar", description: "O seu navegador pode bloquear esta ação.", variant: "destructive" });
    }
  };

  const onDownload = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "las-tortillas-menu-qr.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
            <RiQrCodeFill className="h-4 w-4" />
            Exibir QR Code
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-lg rounded-3xl border-card-border/70 bg-card p-0 shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-7">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">QR Code Personalizado</DialogTitle>
          </DialogHeader>

          <div className="mt-4 grid gap-5">
            <div className="glass rounded-3xl p-4 shadow-md bg-white/50 backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-between gap-3 px-1">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">Destino</p>
                  <p className="truncate text-sm font-medium text-foreground" data-testid="qr-url">
                    {url}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl h-8 px-3"
                  onClick={onCopy}
                  data-testid="btn-copy-link"
                >
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <RiLink className="h-3.5 w-3.5" />
                    Copiar
                  </span>
                </Button>
              </div>

              <div className="mt-6 grid place-items-center">
                <div className="relative p-4 bg-white rounded-[2.5rem] shadow-2xl border border-border/50" ref={canvasRef}>
                  <QRCodeCanvas
                    value={url}
                    size={280}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: logoImg,
                      x: undefined,
                      y: undefined,
                      height: 60,
                      width: 60,
                      excavate: true,
                    }}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 rounded-2xl h-12 font-bold bg-primary hover:bg-primary/90"
                  onClick={onDownload}
                  data-testid="btn-download-qr"
                >
                  <span className="inline-flex items-center gap-2">
                    <RiDownload2Fill className="h-5 w-5" />
                    Baixar QR Code
                  </span>
                </Button>
                <Button
                  className="rounded-2xl h-12 px-6"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                  data-testid="btn-close-qr"
                >
                  Fechar
                </Button>
              </div>
            </div>

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground px-4">
              Aponte a câmara para aceder ao menu digital do <span className="font-bold text-foreground">Las Tortillas</span>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
