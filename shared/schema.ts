import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// USERS (template legacy)
// ============================================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ============================================
// MENU
// ============================================
export const menuSections = pgTable("menu_sections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").notNull().references(() => menuSections.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  description: text("description"),
  priceKz: integer("price_kz"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const menuMeta = pgTable("menu_meta", {
  id: serial("id").primaryKey(),
  restaurantName: text("restaurant_name").notNull(),
  menuTitle: text("menu_title"),
  footerNote: text("footer_note"),
  whatsapp1: text("whatsapp_1"),
  whatsapp2: text("whatsapp_2"),
  coupleDinnerPriceKz: integer("couple_dinner_price_kz"),
  coupleDinnerWithSparklingPriceKz: integer(
    "couple_dinner_with_sparkling_price_kz",
  ),
});

export const insertMenuSectionSchema = createInsertSchema(menuSections).omit({
  id: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export const insertMenuMetaSchema = createInsertSchema(menuMeta).omit({
  id: true,
});

export type MenuSection = typeof menuSections.$inferSelect;
export type InsertMenuSection = z.infer<typeof insertMenuSectionSchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type MenuMeta = typeof menuMeta.$inferSelect;
export type InsertMenuMeta = z.infer<typeof insertMenuMetaSchema>;

// ============================================
// EXPLICIT API CONTRACT TYPES
// ============================================
export type MenuSectionResponse = MenuSection;
export type MenuItemResponse = MenuItem;
export type MenuMetaResponse = MenuMeta;

export type PublicMenuResponse = {
  meta: MenuMetaResponse;
  sections: Array<{
    section: MenuSectionResponse;
    items: MenuItemResponse[];
  }>;
};

export type UpdateMenuMetaRequest = Partial<InsertMenuMeta>;
