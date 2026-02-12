import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

async function readJson(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ===========================
// PUBLIC MENU
// ===========================
export function usePublicMenu() {
  return useQuery({
    queryKey: [api.publicMenu.get.path],
    queryFn: async () => {
      // Prioritize static menu-data.json for Netlify/Static deployments
      try {
        const res = await fetch("/menu-data.json");
        if (res.ok) {
          const json = await res.json();
          // Check if it's actual JSON and not an HTML error page (common in SPAs)
          if (json && typeof json === 'object') {
            return parseWithLogging(api.publicMenu.get.responses[200], json, "publicMenu.get (static)");
          }
        }
      } catch (staticErr) {
        console.warn("Static menu-data.json fetch failed, trying API...", staticErr);
      }

      // Fallback to API
      try {
        const res = await fetch(api.publicMenu.get.path, { credentials: "include" });
        if (!res.ok) throw new Error(`API responded with status: ${res.status}`);
        const json = await res.json();
        return parseWithLogging(api.publicMenu.get.responses[200], json, "publicMenu.get (api)");
      } catch (err) {
        console.error("Critical: Both static fallback and API failed", err);
        throw err;
      }
    },
  });
}

// ===========================
// ADMIN: META
// ===========================
export function useMenuMeta() {
  return useQuery({
    queryKey: [api.adminMenu.meta.get.path],
    queryFn: async () => {
      const res = await fetch(api.adminMenu.meta.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar as definições do menu.");
      const json = await res.json();
      return parseWithLogging(api.adminMenu.meta.get.responses[200], json, "adminMenu.meta.get");
    },
  });
}

export function useUpdateMenuMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: z.infer<typeof api.adminMenu.meta.update.input>) => {
      const validated = api.adminMenu.meta.update.input.parse(updates);
      const res = await fetch(api.adminMenu.meta.update.path, {
        method: api.adminMenu.meta.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const payload = await readJson(res);
        if (res.status === 400) {
          const parsed = parseWithLogging(api.adminMenu.meta.update.responses[400], payload, "adminMenu.meta.update:400");
          throw new Error(parsed.message);
        }
        throw new Error("Falha ao atualizar meta do menu.");
      }

      const json = await res.json();
      return parseWithLogging(api.adminMenu.meta.update.responses[200], json, "adminMenu.meta.update:200");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.adminMenu.meta.get.path] });
      await qc.invalidateQueries({ queryKey: [api.publicMenu.get.path] });
    },
  });
}

// ===========================
// ADMIN: SECTIONS
// ===========================
export function useMenuSections() {
  return useQuery({
    queryKey: [api.adminMenu.sections.list.path],
    queryFn: async () => {
      const res = await fetch(api.adminMenu.sections.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar secções.");
      const json = await res.json();
      return parseWithLogging(api.adminMenu.sections.list.responses[200], json, "adminMenu.sections.list");
    },
  });
}

export function useCreateMenuSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.adminMenu.sections.create.input>) => {
      const validated = api.adminMenu.sections.create.input.parse(data);
      const res = await fetch(api.adminMenu.sections.create.path, {
        method: api.adminMenu.sections.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const payload = await readJson(res);
        if (res.status === 400) {
          const parsed = parseWithLogging(api.adminMenu.sections.create.responses[400], payload, "adminMenu.sections.create:400");
          throw new Error(parsed.message);
        }
        throw new Error("Falha ao criar secção.");
      }

      const json = await res.json();
      return parseWithLogging(api.adminMenu.sections.create.responses[201], json, "adminMenu.sections.create:201");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.adminMenu.sections.list.path] });
      await qc.invalidateQueries({ queryKey: [api.publicMenu.get.path] });
    },
  });
}

export function useUpdateMenuSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: z.infer<typeof api.adminMenu.sections.update.input>;
    }) => {
      const validated = api.adminMenu.sections.update.input.parse(updates);
      const url = buildUrl(api.adminMenu.sections.update.path, { id });
      const res = await fetch(url, {
        method: api.adminMenu.sections.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const payload = await readJson(res);
        if (res.status === 400) {
          const parsed = parseWithLogging(api.adminMenu.sections.update.responses[400], payload, "adminMenu.sections.update:400");
          throw new Error(parsed.message);
        }
        if (res.status === 404) {
          const parsed = parseWithLogging(api.adminMenu.sections.update.responses[404], payload, "adminMenu.sections.update:404");
          throw new Error(parsed.message);
        }
        throw new Error("Falha ao atualizar secção.");
      }

      const json = await res.json();
      return parseWithLogging(api.adminMenu.sections.update.responses[200], json, "adminMenu.sections.update:200");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.adminMenu.sections.list.path] });
      await qc.invalidateQueries({ queryKey: [api.publicMenu.get.path] });
    },
  });
}

export function useDeleteMenuSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.adminMenu.sections.delete.path, { id });
      const res = await fetch(url, {
        method: api.adminMenu.sections.delete.method,
        credentials: "include",
      });

      if (!res.ok) {
        const payload = await readJson(res);
        if (res.status === 404) {
          const parsed = parseWithLogging(api.adminMenu.sections.delete.responses[404], payload, "adminMenu.sections.delete:404");
          throw new Error(parsed.message);
        }
        throw new Error("Falha ao apagar secção.");
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.adminMenu.sections.list.path] });
      await qc.invalidateQueries({ queryKey: [api.publicMenu.get.path] });
    },
  });
}

// ===========================
// ADMIN: ITEMS
// ===========================
export function useMenuItems() {
  return useQuery({
    queryKey: [api.adminMenu.items.list.path],
    queryFn: async () => {
      const res = await fetch(api.adminMenu.items.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar itens.");
      const json = await res.json();
      return parseWithLogging(api.adminMenu.items.list.responses[200], json, "adminMenu.items.list");
    },
  });
}

export function useCreateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.adminMenu.items.create.input>) => {
      const validated = api.adminMenu.items.create.input.parse(data);
      const res = await fetch(api.adminMenu.items.create.path, {
        method: api.adminMenu.items.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const payload = await readJson(res);
        if (res.status === 400) {
          const parsed = parseWithLogging(api.adminMenu.items.create.responses[400], payload, "adminMenu.items.create:400");
          throw new Error(parsed.message);
        }
        throw new Error("Falha ao criar item.");
      }

      const json = await res.json();
      return parseWithLogging(api.adminMenu.items.create.responses[201], json, "adminMenu.items.create:201");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.adminMenu.items.list.path] });
      await qc.invalidateQueries({ queryKey: [api.publicMenu.get.path] });
    },
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: z.infer<typeof api.adminMenu.items.update.input>;
    }) => {
      const validated = api.adminMenu.items.update.input.parse(updates);
      const url = buildUrl(api.adminMenu.items.update.path, { id });
      const res = await fetch(url, {
        method: api.adminMenu.items.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        const payload = await readJson(res);
        if (res.status === 400) {
          const parsed = parseWithLogging(api.adminMenu.items.update.responses[400], payload, "adminMenu.items.update:400");
          throw new Error(parsed.message);
        }
        if (res.status === 404) {
          const parsed = parseWithLogging(api.adminMenu.items.update.responses[404], payload, "adminMenu.items.update:404");
          throw new Error(parsed.message);
        }
        throw new Error("Falha ao atualizar item.");
      }

      const json = await res.json();
      return parseWithLogging(api.adminMenu.items.update.responses[200], json, "adminMenu.items.update:200");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.adminMenu.items.list.path] });
      await qc.invalidateQueries({ queryKey: [api.publicMenu.get.path] });
    },
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.adminMenu.items.delete.path, { id });
      const res = await fetch(url, {
        method: api.adminMenu.items.delete.method,
        credentials: "include",
      });

      if (!res.ok) {
        const payload = await readJson(res);
        if (res.status === 404) {
          const parsed = parseWithLogging(api.adminMenu.items.delete.responses[404], payload, "adminMenu.items.delete:404");
          throw new Error(parsed.message);
        }
        throw new Error("Falha ao apagar item.");
      }
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.adminMenu.items.list.path] });
      await qc.invalidateQueries({ queryKey: [api.publicMenu.get.path] });
    },
  });
}
