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

      <DialogContent className="max-w-[95vw] sm:max-w-md rounded-3xl border-card-border/70 bg-card p-0 shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-6">
          <DialogHeader className="px-2">
            <DialogTitle className="font-display text-xl sm:text-2xl">QR Code Personalizado</DialogTitle>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            <div className="glass rounded-3xl p-4 shadow-md bg-white/50 backdrop-blur-sm border border-white/20">
              <div className="flex flex-col gap-1.5 px-1">
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">Destino</p>
                <div className="flex items-center gap-2">
                  <p className="flex-1 truncate text-xs font-medium text-foreground bg-white/50 px-2 py-1 rounded-lg border border-border/50" data-testid="qr-url">
                    {url}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-lg h-7 px-2 shrink-0"
                    onClick={onCopy}
                    data-testid="btn-copy-link"
                  >
                    <RiLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <div className="relative p-3 bg-white rounded-[2rem] shadow-lg border border-border/40 w-full max-w-[220px] aspect-square flex items-center justify-center" ref={canvasRef}>
                  <QRCodeCanvas
                    value={url}
                    size={256}
                    style={{ width: '100%', height: '100%' }}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: logoImg,
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      excavate: true,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button
                  className="w-full rounded-2xl h-11 font-bold bg-primary hover:bg-primary/90 text-sm"
                  onClick={onDownload}
                  data-testid="btn-download-qr"
                >
                  <span className="inline-flex items-center gap-2">
                    <RiDownload2Fill className="h-4 w-4" />
                    Baixar QR Code
                  </span>
                </Button>
              </div>
            </div>

            <p className="text-center text-[10px] sm:text-[11px] leading-relaxed text-muted-foreground px-2">
              Aponte a câmara para aceder ao menu digital do <span className="font-bold text-foreground">Las Tortillas</span>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
