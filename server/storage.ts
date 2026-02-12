import { asc, eq } from "drizzle-orm";
import {
  menuItems,
  menuMeta,
  menuSections,
  type InsertMenuItem,
  type InsertMenuMeta,
  type InsertMenuSection,
  type MenuItem,
  type MenuMeta,
  type MenuSection,
  type PublicMenuResponse,
  type UpdateMenuMetaRequest,
} from "@shared/schema";
import { db } from "./db";

export interface IStorage {
  getPublicMenu(): Promise<PublicMenuResponse>;

  getMenuMeta(): Promise<MenuMeta>;
  updateMenuMeta(updates: UpdateMenuMetaRequest): Promise<MenuMeta>;

  listMenuSections(): Promise<MenuSection[]>;
  createMenuSection(input: InsertMenuSection): Promise<MenuSection>;
  updateMenuSection(
    id: number,
    updates: Partial<InsertMenuSection>,
  ): Promise<MenuSection | undefined>;
  deleteMenuSection(id: number): Promise<boolean>;

  listMenuItems(): Promise<MenuItem[]>;
  createMenuItem(input: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getMenuMeta(): Promise<MenuMeta> {
    const existing = await db.select().from(menuMeta).limit(1);
    if (existing[0]) return existing[0];

    const defaults: InsertMenuMeta = {
      restaurantName: "Las Tortillas",
      menuTitle: "Menu Dia dos Namorados",
      footerNote: "Faça sua reserva via WhatsApp: 927759068 / 931879967",
      whatsapp1: "927759068",
      whatsapp2: "931879967",
      coupleDinnerPriceKz: 65000,
      coupleDinnerWithSparklingPriceKz: 80000,
    };

    const [created] = await db.insert(menuMeta).values(defaults).returning();
    return created;
  }

  async updateMenuMeta(updates: UpdateMenuMetaRequest): Promise<MenuMeta> {
    const meta = await this.getMenuMeta();
    const [updated] = await db
      .update(menuMeta)
      .set({ ...updates })
      .where(eq(menuMeta.id, meta.id))
      .returning();
    return updated;
  }

  async listMenuSections(): Promise<MenuSection[]> {
    return await db
      .select()
      .from(menuSections)
      .orderBy(asc(menuSections.sortOrder), asc(menuSections.id));
  }

  async createMenuSection(input: InsertMenuSection): Promise<MenuSection> {
    const [created] = await db.insert(menuSections).values(input).returning();
    return created;
  }

  async updateMenuSection(
    id: number,
    updates: Partial<InsertMenuSection>,
  ): Promise<MenuSection | undefined> {
    const [updated] = await db
      .update(menuSections)
      .set(updates)
      .where(eq(menuSections.id, id))
      .returning();
    return updated;
  }

  async deleteMenuSection(id: number): Promise<boolean> {
    const existingItems = await db
      .select({ id: menuItems.id })
      .from(menuItems)
      .where(eq(menuItems.sectionId, id))
      .limit(1);

    if (existingItems.length > 0) {
      return false;
    }

    const deleted = await db
      .delete(menuSections)
      .where(eq(menuSections.id, id))
      .returning({ id: menuSections.id });

    return deleted.length > 0;
  }

  async listMenuItems(): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItems)
      .orderBy(asc(menuItems.sectionId), asc(menuItems.sortOrder), asc(menuItems.id));
  }

  async createMenuItem(input: InsertMenuItem): Promise<MenuItem> {
    const [created] = await db.insert(menuItems).values(input).returning();
    return created;
  }

  async updateMenuItem(
    id: number,
    updates: Partial<InsertMenuItem>,
  ): Promise<MenuItem | undefined> {
    const [updated] = await db
      .update(menuItems)
      .set(updates)
      .where(eq(menuItems.id, id))
      .returning();
    return updated;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const deleted = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning({ id: menuItems.id });
    return deleted.length > 0;
  }

  async getPublicMenu(): Promise<PublicMenuResponse> {
    const meta = await this.getMenuMeta();
    const sections = (await this.listMenuSections()).filter((s) => s.isActive);
    const items = (await this.listMenuItems()).filter((i) => i.isActive);

    return {
      meta,
      sections: sections.map((section) => ({
        section,
        items: items
          .filter((it) => it.sectionId === section.id)
          .sort((a, b) => (a.sortOrder - b.sortOrder) || (a.id - b.id)),
      })),
    };
  }
}

export const storage = new DatabaseStorage();
