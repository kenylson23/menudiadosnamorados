import type { Express } from "express";
import type { Server } from "http";
import { z } from "zod";
import { api } from "@shared/routes";
import { storage } from "./storage";

async function seedMenuIfEmpty() {
  const sections = await storage.listMenuSections();
  if (sections.length > 0) return;

  const entrada = await storage.createMenuSection({
    name: "ENTRADA",
    sortOrder: 10,
    isActive: true,
  });
  const principal = await storage.createMenuSection({
    name: "PRATO PRINCIPAL",
    sortOrder: 20,
    isActive: true,
  });
  const sobremesa = await storage.createMenuSection({
    name: "SOBREMESA",
    sortOrder: 30,
    isActive: true,
  });

  const entradaItems = [
    "Amor de abacate com chips do coração",
    "Taquitos de carne desfiada",
    "Asinhas a escolha da senhora",
    "Salada mexicana de Quinoa",
    "Ceaser salad",
  ];

  const principalItems = [
    "Risotto de Gambas",
    "Lombo de garoupa c/ puré & horta do chef",
    "Pollo imperial c/ Arroz mexicano",
    "Mexican steak fries",
    "Side: Arroz, feijão, pico de gallo",
  ];

  const sobremesaItems = [
    "Churros",
    "Tentação",
    "Cheesecake de Morango",
    "Suspiros do Amor",
  ];

  for (const [idx, name] of entradaItems.entries()) {
    await storage.createMenuItem({
      sectionId: entrada.id,
      name,
      description: null,
      priceKz: null,
      sortOrder: (idx + 1) * 10,
      isActive: true,
    });
  }

  for (const [idx, name] of principalItems.entries()) {
    await storage.createMenuItem({
      sectionId: principal.id,
      name,
      description: null,
      priceKz: null,
      sortOrder: (idx + 1) * 10,
      isActive: true,
    });
  }

  for (const [idx, name] of sobremesaItems.entries()) {
    await storage.createMenuItem({
      sectionId: sobremesa.id,
      name,
      description: null,
      priceKz: null,
      sortOrder: (idx + 1) * 10,
      isActive: true,
    });
  }

  await storage.getMenuMeta();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  await seedMenuIfEmpty();

  app.get(api.publicMenu.get.path, async (_req, res) => {
    const menu = await storage.getPublicMenu();
    res.json(menu);
  });

  app.get(api.adminMenu.meta.get.path, async (_req, res) => {
    const meta = await storage.getMenuMeta();
    res.json(meta);
  });

  app.patch(api.adminMenu.meta.update.path, async (req, res) => {
    try {
      const input = api.adminMenu.meta.update.input.parse(req.body);
      const updated = await storage.updateMenuMeta(input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.get(api.adminMenu.sections.list.path, async (_req, res) => {
    const sections = await storage.listMenuSections();
    res.json(sections);
  });

  app.post(api.adminMenu.sections.create.path, async (req, res) => {
    try {
      const input = api.adminMenu.sections.create.input.parse(req.body);
      const created = await storage.createMenuSection(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.put(api.adminMenu.sections.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }

      const input = api.adminMenu.sections.update.input.parse(req.body);
      const updated = await storage.updateMenuSection(id, input);
      if (!updated) {
        return res.status(404).json({ message: "Section not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.delete(api.adminMenu.sections.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const ok = await storage.deleteMenuSection(id);
    if (!ok) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.status(204).send();
  });

  app.get(api.adminMenu.items.list.path, async (_req, res) => {
    const items = await storage.listMenuItems();
    res.json(items);
  });

  app.post(api.adminMenu.items.create.path, async (req, res) => {
    try {
      const input = api.adminMenu.items.create.input.parse(req.body);
      const created = await storage.createMenuItem(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.put(api.adminMenu.items.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }

      const input = api.adminMenu.items.update.input.parse(req.body);
      const updated = await storage.updateMenuItem(id, input);
      if (!updated) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid input",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  app.delete(api.adminMenu.items.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const ok = await storage.deleteMenuItem(id);
    if (!ok) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(204).send();
  });

  return httpServer;
}
