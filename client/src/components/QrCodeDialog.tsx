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

      <DialogContent className="max-w-[95vw] sm:max-w-md rounded-[2.5rem] border-none bg-white p-0 shadow-2xl overflow-hidden max-h-[98vh]">
        <div className="p-3 sm:p-6 h-full flex flex-col">
          <DialogHeader className="px-2 mb-1 shrink-0">
            <DialogTitle className="font-display text-lg sm:text-2xl text-center text-[#2D241E]">QR Code Personalizado</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2 overflow-hidden">
            <div className="rounded-[2rem] p-3 sm:p-5 bg-[#FDFCFB] border border-[#F1ECE7] shadow-inner overflow-hidden flex flex-col">
              <div className="flex flex-col gap-1 px-1 shrink-0">
                <p className="text-[9px] uppercase tracking-widest font-bold text-[#A39589]">Destino</p>
                <div className="flex items-center gap-2">
                  <p className="flex-1 truncate text-[11px] font-medium text-[#4A3F35] bg-white px-3 py-1.5 rounded-xl border border-[#EEE6DE]" data-testid="qr-url">
                    {url}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl h-8 px-2 shrink-0 hover:bg-[#F5F1EE]"
                    onClick={onCopy}
                    data-testid="btn-copy-link"
                  >
                    <RiLink className="h-3.5 w-3.5 text-[#8B7E74]" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex justify-center shrink min-h-0">
                <div className="relative p-3 bg-white rounded-[2rem] shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-[#F1ECE7] w-full max-w-[180px] sm:max-w-[220px] aspect-square flex items-center justify-center group transition-transform duration-500 hover:scale-[1.02]" ref={canvasRef}>
                  <QRCodeCanvas
                    value={url}
                    size={512}
                    style={{ width: '100%', height: '100%' }}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: logoImg,
                      x: undefined,
                      y: undefined,
                      height: 32,
                      width: 32,
                      excavate: true,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 shrink-0">
                <Button
                  className="w-full rounded-2xl h-10 sm:h-12 font-bold bg-[#C41E3A] hover:bg-[#A01830] text-sm sm:text-base shadow-lg shadow-[#C41E3A]/20 transition-all duration-300 active:scale-[0.98]"
                  onClick={onDownload}
                  data-testid="btn-download-qr"
                >
                  <span className="inline-flex items-center gap-2">
                    <RiDownload2Fill className="h-4 w-4 sm:h-5 sm:w-5" />
                    Baixar QR Code
                  </span>
                </Button>
              </div>
            </div>

            <p className="text-center text-[9px] sm:text-xs leading-tight text-[#8B7E74] px-4 shrink-0">
              Aponte a câmara para aceder ao menu digital do <span className="font-bold text-[#2D241E]">Las Tortillas</span>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
