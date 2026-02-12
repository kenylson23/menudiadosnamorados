import * as React from "react";
import { Link } from "wouter";
import { z } from "zod";
import { 
  RiSettings4Fill, 
  RiAddLine, 
  RiPencilFill, 
  RiDeleteBin6Fill, 
  RiSave3Fill, 
  RiArrowLeftLine, 
  RiStackFill, 
  RiListOrdered, 
  RiEyeOffFill, 
  RiEyeFill 
} from "react-icons/ri";
import { useToast } from "@/hooks/use-toast";
import {
  useMenuMeta,
  useUpdateMenuMeta,
  useMenuSections,
  useCreateMenuSection,
  useUpdateMenuSection,
  useDeleteMenuSection,
  useMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "@/hooks/use-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@shared/routes";

const kzSchema = z.coerce.number().int().nonnegative().optional().or(z.literal("").transform(() => undefined));

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen mesh-bg grain">
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-7 sm:py-10">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-card-border/70 bg-card shadow-sm">
                  <RiSettings4Fill className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl">Admin do Menu</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Atualize meta, secções e itens. (Endpoints: {api.adminMenu.meta.get.path})
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5",
                  "font-semibold text-foreground shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 ease-out",
                )}
                data-testid="admin-back-link"
              >
                <RiArrowLeftLine className="h-4 w-4" />
                Voltar ao público
              </Link>
            </div>
          </header>

          <main className="mt-7 sm:mt-9">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default function AdminMenuPage() {
  return (
    <AdminShell>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <MetaCard />
        <SectionsCard />
        <ItemsCard className="lg:col-span-2" />
      </div>
    </AdminShell>
  );
}

function MetaCard() {
  const { toast } = useToast();
  const metaQ = useMenuMeta();
  const updateMeta = useUpdateMenuMeta();

  const [form, setForm] = React.useState({
    restaurantName: "",
    menuTitle: "",
    footerNote: "",
    whatsapp1: "",
    whatsapp2: "",
    coupleDinnerPriceKz: "",
    coupleDinnerWithSparklingPriceKz: "",
  });

  React.useEffect(() => {
    if (!metaQ.data) return;
    setForm({
      restaurantName: metaQ.data.restaurantName ?? "",
      menuTitle: metaQ.data.menuTitle ?? "",
      footerNote: metaQ.data.footerNote ?? "",
      whatsapp1: metaQ.data.whatsapp1 ?? "",
      whatsapp2: metaQ.data.whatsapp2 ?? "",
      coupleDinnerPriceKz: metaQ.data.coupleDinnerPriceKz?.toString?.() ?? "",
      coupleDinnerWithSparklingPriceKz: metaQ.data.coupleDinnerWithSparklingPriceKz?.toString?.() ?? "",
    });
  }, [metaQ.data]);

  const onSave = async () => {
    try {
      const coupleDinnerPriceKz = kzSchema.parse(form.coupleDinnerPriceKz);
      const coupleDinnerWithSparklingPriceKz = kzSchema.parse(form.coupleDinnerWithSparklingPriceKz);

      await updateMeta.mutateAsync({
        restaurantName: form.restaurantName,
        menuTitle: form.menuTitle || undefined,
        footerNote: form.footerNote || undefined,
        whatsapp1: form.whatsapp1 || undefined,
        whatsapp2: form.whatsapp2 || undefined,
        coupleDinnerPriceKz,
        coupleDinnerWithSparklingPriceKz,
      });

      toast({ title: "Atualizado", description: "As definições do menu foram guardadas." });
    } catch (e: any) {
      toast({
        title: "Erro ao guardar",
        description: e?.message ?? "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="rounded-3xl border-card-border/70 shadow-lg shadow-black/5" data-testid="admin-meta-card">
      <CardHeader className="pb-2">
        <CardTitle className="font-display text-2xl">Meta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metaQ.isLoading ? (
          <div className="space-y-3">
            <div className="h-10 rounded-2xl bg-muted animate-pulse" />
            <div className="h-10 rounded-2xl bg-muted animate-pulse" />
            <div className="h-24 rounded-2xl bg-muted animate-pulse" />
          </div>
        ) : metaQ.error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">Falha ao carregar meta.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-2">
              <Label htmlFor="restaurantName">Nome do restaurante</Label>
              <Input
                id="restaurantName"
                value={form.restaurantName}
                onChange={(e) => setForm((p) => ({ ...p, restaurantName: e.target.value }))}
                className="rounded-2xl"
                data-testid="input-restaurant-name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="menuTitle">Título do menu</Label>
              <Input
                id="menuTitle"
                value={form.menuTitle}
                onChange={(e) => setForm((p) => ({ ...p, menuTitle: e.target.value }))}
                className="rounded-2xl"
                data-testid="input-menu-title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="footerNote">Nota (rodapé)</Label>
              <Textarea
                id="footerNote"
                value={form.footerNote}
                onChange={(e) => setForm((p) => ({ ...p, footerNote: e.target.value }))}
                className="rounded-2xl min-h-[92px]"
                data-testid="input-footer-note"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="whatsapp1">WhatsApp 1</Label>
                <Input
                  id="whatsapp1"
                  value={form.whatsapp1}
                  onChange={(e) => setForm((p) => ({ ...p, whatsapp1: e.target.value }))}
                  className="rounded-2xl"
                  placeholder="927759068"
                  data-testid="input-whatsapp-1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp2">WhatsApp 2</Label>
                <Input
                  id="whatsapp2"
                  value={form.whatsapp2}
                  onChange={(e) => setForm((p) => ({ ...p, whatsapp2: e.target.value }))}
                  className="rounded-2xl"
                  placeholder="931879967"
                  data-testid="input-whatsapp-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="coupleDinnerPriceKz">Preço jantar casal (kz)</Label>
                <Input
                  id="coupleDinnerPriceKz"
                  value={form.coupleDinnerPriceKz}
                  onChange={(e) => setForm((p) => ({ ...p, coupleDinnerPriceKz: e.target.value }))}
                  className="rounded-2xl"
                  inputMode="numeric"
                  data-testid="input-price-couple"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="coupleDinnerWithSparklingPriceKz">Com espumante (kz)</Label>
                <Input
                  id="coupleDinnerWithSparklingPriceKz"
                  value={form.coupleDinnerWithSparklingPriceKz}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, coupleDinnerWithSparklingPriceKz: e.target.value }))
                  }
                  className="rounded-2xl"
                  inputMode="numeric"
                  data-testid="input-price-couple-sparkling"
                />
              </div>
            </div>

            <Button
              onClick={onSave}
              disabled={updateMeta.isPending}
              className={cn(
                "w-full rounded-2xl py-6 font-semibold",
                "bg-gradient-to-r from-primary to-accent text-primary-foreground",
                "shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5",
                "active:translate-y-0 transition-all duration-300 ease-out",
              )}
              data-testid="btn-save-meta"
            >
              <span className="inline-flex items-center gap-2">
                <RiSave3Fill className="h-4 w-4" />
                {updateMeta.isPending ? "A guardar…" : "Guardar alterações"}
              </span>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function SectionsCard() {
  const { toast } = useToast();
  const sectionsQ = useMenuSections();
  const createSection = useCreateMenuSection();
  const updateSection = useUpdateMenuSection();
  const deleteSection = useDeleteMenuSection();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({
    name: "",
    sortOrder: "0",
    isActive: true,
  });

  const [editOpen, setEditOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editForm, setEditForm] = React.useState({
    name: "",
    sortOrder: "0",
    isActive: true,
  });

  const onCreate = async () => {
    try {
      await createSection.mutateAsync({
        name: createForm.name,
        sortOrder: z.coerce.number().int().parse(createForm.sortOrder),
        isActive: createForm.isActive,
      });
      setCreateOpen(false);
      setCreateForm({ name: "", sortOrder: "0", isActive: true });
      toast({ title: "Secção criada" });
    } catch (e: any) {
      toast({ title: "Erro", description: e?.message ?? "Falha ao criar secção.", variant: "destructive" });
    }
  };

  const openEdit = (s: any) => {
    setEditingId(s.id);
    setEditForm({
      name: s.name ?? "",
      sortOrder: String(s.sortOrder ?? 0),
      isActive: !!s.isActive,
    });
    setEditOpen(true);
  };

  const onUpdate = async () => {
    if (!editingId) return;
    try {
      await updateSection.mutateAsync({
        id: editingId,
        updates: {
          name: editForm.name,
          sortOrder: z.coerce.number().int().parse(editForm.sortOrder),
          isActive: editForm.isActive,
        },
      });
      setEditOpen(false);
      setEditingId(null);
      toast({ title: "Secção atualizada" });
    } catch (e: any) {
      toast({ title: "Erro", description: e?.message ?? "Falha ao atualizar secção.", variant: "destructive" });
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteSection.mutateAsync(id);
      toast({ title: "Secção apagada" });
    } catch (e: any) {
      toast({ title: "Erro", description: e?.message ?? "Falha ao apagar secção.", variant: "destructive" });
    }
  };

  return (
    <Card className="rounded-3xl border-card-border/70 shadow-lg shadow-black/5" data-testid="admin-sections-card">
      <CardHeader className="pb-2 flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="font-display text-2xl">Secções</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Criar, ordenar, ativar/desativar.</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setCreateOpen(true)}
              className="rounded-2xl"
              data-testid="btn-open-create-section"
            >
              <span className="inline-flex items-center gap-2">
                <RiAddLine className="h-4 w-4" />
                Nova
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-lg rounded-3xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Criar secção</DialogTitle>
            </DialogHeader>

            <div className="mt-2 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="secName">Nome</Label>
                <Input
                  id="secName"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                  className="rounded-2xl"
                  data-testid="input-create-section-name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="grid gap-2">
                  <Label htmlFor="secSort">Ordem</Label>
                  <Input
                    id="secSort"
                    value={createForm.sortOrder}
                    onChange={(e) => setCreateForm((p) => ({ ...p, sortOrder: e.target.value }))}
                    className="rounded-2xl"
                    inputMode="numeric"
                    data-testid="input-create-section-sort"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">Ativa</p>
                    <p className="text-xs text-muted-foreground">Visível no público</p>
                  </div>
                  <Switch
                    checked={createForm.isActive}
                    onCheckedChange={(v) => setCreateForm((p) => ({ ...p, isActive: v }))}
                    data-testid="switch-create-section-active"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={onCreate}
                  disabled={createSection.isPending || !createForm.name.trim()}
                  className="rounded-2xl"
                  data-testid="btn-create-section"
                >
                  {createSection.isPending ? "A criar…" : "Criar"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-2xl"
                  data-testid="btn-cancel-create-section"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-3">
        {sectionsQ.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-muted/70 animate-pulse" />
            ))}
          </div>
        ) : sectionsQ.error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">Falha ao carregar secções.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sectionsQ.data
              ?.slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    "rounded-2xl border border-border bg-background/60 px-4 py-3 shadow-sm",
                    "hover:-translate-y-0.5 hover:shadow-md transition-all duration-300",
                  )}
                  data-testid={`admin-section-row-${s.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <RiStackFill className="h-4 w-4 text-primary" />
                        <p className="truncate text-sm font-semibold">{s.name}</p>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <RiListOrdered className="h-3.5 w-3.5" /> {s.sortOrder}
                        </span>
                        <span className="text-muted-foreground/70">•</span>
                        <span className={cn("inline-flex items-center gap-1", s.isActive ? "text-foreground" : "text-muted-foreground")}>
                          {s.isActive ? <RiEyeFill className="h-3.5 w-3.5" /> : <RiEyeOffFill className="h-3.5 w-3.5" />}
                          {s.isActive ? "Ativa" : "Oculta"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        className="rounded-2xl"
                        onClick={() => openEdit(s)}
                        data-testid={`btn-edit-section-${s.id}`}
                      >
                        <RiPencilFill className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="rounded-2xl"
                            onClick={() => {}}
                            data-testid={`btn-delete-section-${s.id}`}
                          >
                            <RiDeleteBin6Fill className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="font-display">Apagar secção?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação remove a secção. Pode afetar os itens associados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-testid={`btn-cancel-delete-section-${s.id}`}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(s.id)}
                              data-testid={`btn-confirm-delete-section-${s.id}`}
                            >
                              Apagar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}

            {!sectionsQ.data?.length ? (
              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-sm text-muted-foreground">Sem secções.</p>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Editar secção</DialogTitle>
          </DialogHeader>

          <div className="mt-2 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="editSecName">Nome</Label>
              <Input
                id="editSecName"
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                className="rounded-2xl"
                data-testid="input-edit-section-name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="grid gap-2">
                <Label htmlFor="editSecSort">Ordem</Label>
                <Input
                  id="editSecSort"
                  value={editForm.sortOrder}
                  onChange={(e) => setEditForm((p) => ({ ...p, sortOrder: e.target.value }))}
                  className="rounded-2xl"
                  inputMode="numeric"
                  data-testid="input-edit-section-sort"
                />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Ativa</p>
                  <p className="text-xs text-muted-foreground">Visível no público</p>
                </div>
                <Switch
                  checked={editForm.isActive}
                  onCheckedChange={(v) => setEditForm((p) => ({ ...p, isActive: v }))}
                  data-testid="switch-edit-section-active"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onUpdate}
                disabled={updateSection.isPending || !editForm.name.trim()}
                className="rounded-2xl"
                data-testid="btn-update-section"
              >
                {updateSection.isPending ? "A guardar…" : "Guardar"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setEditOpen(false)}
                className="rounded-2xl"
                data-testid="btn-cancel-edit-section"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function ItemsCard({ className }: { className?: string }) {
  const { toast } = useToast();
  const sectionsQ = useMenuSections();
  const itemsQ = useMenuItems();

  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [createForm, setCreateForm] = React.useState({
    sectionId: "",
    name: "",
    description: "",
    priceKz: "",
    sortOrder: "0",
    isActive: true,
  });

  const [editOpen, setEditOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editForm, setEditForm] = React.useState({
    sectionId: "",
    name: "",
    description: "",
    priceKz: "",
    sortOrder: "0",
    isActive: true,
  });

  const sections = sectionsQ.data ?? [];
  const items = itemsQ.data ?? [];

  const openEdit = (it: any) => {
    setEditingId(it.id);
    setEditForm({
      sectionId: String(it.sectionId ?? ""),
      name: it.name ?? "",
      description: it.description ?? "",
      priceKz: typeof it.priceKz === "number" ? String(it.priceKz) : "",
      sortOrder: String(it.sortOrder ?? 0),
      isActive: !!it.isActive,
    });
    setEditOpen(true);
  };

  const onCreate = async () => {
    try {
      await createItem.mutateAsync({
        sectionId: z.coerce.number().int().parse(createForm.sectionId),
        name: createForm.name,
        description: createForm.description || undefined,
        priceKz: kzSchema.parse(createForm.priceKz) ?? null,
        sortOrder: z.coerce.number().int().parse(createForm.sortOrder),
        isActive: createForm.isActive,
      });
      setCreateOpen(false);
      setCreateForm({ sectionId: "", name: "", description: "", priceKz: "", sortOrder: "0", isActive: true });
      toast({ title: "Item criado" });
    } catch (e: any) {
      toast({ title: "Erro", description: e?.message ?? "Falha ao criar item.", variant: "destructive" });
    }
  };

  const onUpdate = async () => {
    if (!editingId) return;
    try {
      await updateItem.mutateAsync({
        id: editingId,
        updates: {
          sectionId: z.coerce.number().int().parse(editForm.sectionId),
          name: editForm.name,
          description: editForm.description || undefined,
          priceKz: kzSchema.parse(editForm.priceKz) ?? null,
          sortOrder: z.coerce.number().int().parse(editForm.sortOrder),
          isActive: editForm.isActive,
        },
      });
      setEditOpen(false);
      setEditingId(null);
      toast({ title: "Item atualizado" });
    } catch (e: any) {
      toast({ title: "Erro", description: e?.message ?? "Falha ao atualizar item.", variant: "destructive" });
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteItem.mutateAsync(id);
      toast({ title: "Item apagado" });
    } catch (e: any) {
      toast({ title: "Erro", description: e?.message ?? "Falha ao apagar item.", variant: "destructive" });
    }
  };

  return (
    <Card className={cn("rounded-3xl border-card-border/70 shadow-lg shadow-black/5", className)} data-testid="admin-items-card">
      <CardHeader className="pb-2 flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="font-display text-2xl">Itens</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Gerir pratos, descrições, preços e ordem.</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setCreateOpen(true)}
              className="rounded-2xl"
              data-testid="btn-open-create-item"
            >
              <span className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo item
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Criar item</DialogTitle>
            </DialogHeader>

            <div className="mt-2 grid gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Secção</Label>
                  <select
                    className={cn(
                      "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm",
                      "focus:outline-none focus:border-ring focus:ring-4 focus:ring-ring/10 transition-all duration-200",
                    )}
                    value={createForm.sectionId}
                    onChange={(e) => setCreateForm((p) => ({ ...p, sectionId: e.target.value }))}
                    data-testid="select-create-item-section"
                  >
                    <option value="">— Selecionar —</option>
                    {sections
                      .slice()
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Ordem</Label>
                  <Input
                    value={createForm.sortOrder}
                    onChange={(e) => setCreateForm((p) => ({ ...p, sortOrder: e.target.value }))}
                    className="rounded-2xl"
                    inputMode="numeric"
                    data-testid="input-create-item-sort"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input
                  value={createForm.name}
                  onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                  className="rounded-2xl"
                  data-testid="input-create-item-name"
                />
              </div>

              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                  className="rounded-2xl min-h-[90px]"
                  data-testid="input-create-item-description"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="grid gap-2">
                  <Label>Preço (kz) (opcional)</Label>
                  <Input
                    value={createForm.priceKz}
                    onChange={(e) => setCreateForm((p) => ({ ...p, priceKz: e.target.value }))}
                    className="rounded-2xl"
                    inputMode="numeric"
                    data-testid="input-create-item-price"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">Ativo</p>
                    <p className="text-xs text-muted-foreground">Visível no público</p>
                  </div>
                  <Switch
                    checked={createForm.isActive}
                    onCheckedChange={(v) => setCreateForm((p) => ({ ...p, isActive: v }))}
                    data-testid="switch-create-item-active"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={onCreate}
                  disabled={createItem.isPending || !createForm.name.trim() || !createForm.sectionId}
                  className="rounded-2xl"
                  data-testid="btn-create-item"
                >
                  {createItem.isPending ? "A criar…" : "Criar"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-2xl"
                  data-testid="btn-cancel-create-item"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-3">
        {itemsQ.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-muted/70 animate-pulse" />
            ))}
          </div>
        ) : itemsQ.error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">Falha ao carregar itens.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items
              .slice()
              .sort((a, b) => (a.sectionId - b.sectionId) || (a.sortOrder - b.sortOrder))
              .map((it) => {
                const sec = sections.find((s) => s.id === it.sectionId);
                return (
                  <div
                    key={it.id}
                    className={cn(
                      "rounded-2xl border border-border bg-background/60 px-4 py-3 shadow-sm",
                      "hover:-translate-y-0.5 hover:shadow-md transition-all duration-300",
                    )}
                    data-testid={`admin-item-row-${it.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{it.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Secção: <span className="font-medium text-foreground/80">{sec?.name ?? it.sectionId}</span>{" "}
                          • Ordem: {it.sortOrder} • {it.isActive ? "Ativo" : "Oculto"}
                        </p>
                        {it.description ? (
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                            {it.description}
                          </p>
                        ) : null}
                        {typeof it.priceKz === "number" ? (
                          <p className="mt-2 text-xs font-semibold text-primary">
                            {it.priceKz.toLocaleString("pt-PT")} kz
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          className="rounded-2xl"
                          onClick={() => openEdit(it)}
                          data-testid={`btn-edit-item-${it.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              className="rounded-2xl"
                              onClick={() => {}}
                              data-testid={`btn-delete-item-${it.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-3xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-display">Apagar item?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel data-testid={`btn-cancel-delete-item-${it.id}`}>
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(it.id)}
                                data-testid={`btn-confirm-delete-item-${it.id}`}
                              >
                                Apagar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                );
              })}

            {!items.length ? (
              <div className="md:col-span-2 rounded-2xl border border-border bg-background/60 p-4">
                <p className="text-sm text-muted-foreground">Sem itens.</p>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Editar item</DialogTitle>
          </DialogHeader>

          <div className="mt-2 grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Secção</Label>
                <select
                  className={cn(
                    "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-sm",
                    "focus:outline-none focus:border-ring focus:ring-4 focus:ring-ring/10 transition-all duration-200",
                  )}
                  value={editForm.sectionId}
                  onChange={(e) => setEditForm((p) => ({ ...p, sectionId: e.target.value }))}
                  data-testid="select-edit-item-section"
                >
                  <option value="">— Selecionar —</option>
                  {sections
                    .slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Ordem</Label>
                <Input
                  value={editForm.sortOrder}
                  onChange={(e) => setEditForm((p) => ({ ...p, sortOrder: e.target.value }))}
                  className="rounded-2xl"
                  inputMode="numeric"
                  data-testid="input-edit-item-sort"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Nome</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                className="rounded-2xl"
                data-testid="input-edit-item-name"
              />
            </div>

            <div className="grid gap-2">
              <Label>Descrição</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                className="rounded-2xl min-h-[90px]"
                data-testid="input-edit-item-description"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="grid gap-2">
                <Label>Preço (kz) (opcional)</Label>
                <Input
                  value={editForm.priceKz}
                  onChange={(e) => setEditForm((p) => ({ ...p, priceKz: e.target.value }))}
                  className="rounded-2xl"
                  inputMode="numeric"
                  data-testid="input-edit-item-price"
                />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">Ativo</p>
                  <p className="text-xs text-muted-foreground">Visível no público</p>
                </div>
                <Switch
                  checked={editForm.isActive}
                  onCheckedChange={(v) => setEditForm((p) => ({ ...p, isActive: v }))}
                  data-testid="switch-edit-item-active"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onUpdate}
                disabled={updateItem.isPending || !editForm.name.trim() || !editForm.sectionId}
                className="rounded-2xl"
                data-testid="btn-update-item"
              >
                {updateItem.isPending ? "A guardar…" : "Guardar"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setEditOpen(false)}
                className="rounded-2xl"
                data-testid="btn-cancel-edit-item"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
