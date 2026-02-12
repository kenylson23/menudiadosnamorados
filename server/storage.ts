import {
  type MenuItem,
  type MenuMeta,
  type MenuSection,
  type PublicMenuResponse,
  type UpdateMenuMetaRequest,
  type InsertMenuItem,
  type InsertMenuSection,
} from "@shared/schema";

export interface IStorage {
  getPublicMenu(): Promise<PublicMenuResponse>;
  getMenuMeta(): Promise<MenuMeta>;
  updateMenuMeta(updates: UpdateMenuMetaRequest): Promise<MenuMeta>;
  listMenuSections(): Promise<MenuSection[]>;
  createMenuSection(input: InsertMenuSection): Promise<MenuSection>;
  updateMenuSection(id: number, updates: Partial<InsertMenuSection>): Promise<MenuSection | undefined>;
  deleteMenuSection(id: number): Promise<boolean>;
  listMenuItems(): Promise<MenuItem[]>;
  createMenuItem(input: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private meta: MenuMeta;
  private sections: MenuSection[];
  private items: MenuItem[];
  private currentId: number;

  constructor() {
    this.currentId = 1;
    this.meta = {
      id: this.currentId++,
      restaurantName: "Las Tortillas",
      menuTitle: "Menu Dia dos Namorados",
      footerNote: "Faça sua reserva via WhatsApp: 927759068 / 931879967",
      whatsapp1: "927759068",
      whatsapp2: "931879967",
      coupleDinnerPriceKz: 65000,
      coupleDinnerWithSparklingPriceKz: 80000,
    };

    const sectionNames = ["ENTRADA", "PRATO PRINCIPAL", "SOBREMESA"];
    this.sections = sectionNames.map((name, idx) => ({
      id: this.currentId++,
      name,
      sortOrder: (idx + 1) * 10,
      isActive: true,
    }));

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

    this.items = [];
    
    // Helper to add items
    const addItems = (names: string[], sectionId: number) => {
      names.forEach((name, idx) => {
        this.items.push({
          id: this.currentId++,
          sectionId,
          name,
          description: null,
          priceKz: null,
          sortOrder: (idx + 1) * 10,
          isActive: true,
        });
      });
    };

    addItems(entradaItems, this.sections[0].id);
    addItems(principalItems, this.sections[1].id);
    addItems(sobremesaItems, this.sections[2].id);
  }

  async getMenuMeta(): Promise<MenuMeta> {
    return this.meta;
  }

  async updateMenuMeta(updates: UpdateMenuMetaRequest): Promise<MenuMeta> {
    this.meta = { ...this.meta, ...updates };
    return this.meta;
  }

  async listMenuSections(): Promise<MenuSection[]> {
    return [...this.sections].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  }

  async createMenuSection(input: InsertMenuSection): Promise<MenuSection> {
    const section: MenuSection = {
      ...input,
      id: this.currentId++,
    };
    this.sections.push(section);
    return section;
  }

  async updateMenuSection(id: number, updates: Partial<InsertMenuSection>): Promise<MenuSection | undefined> {
    const index = this.sections.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    this.sections[index] = { ...this.sections[index], ...updates };
    return this.sections[index];
  }

  async deleteMenuSection(id: number): Promise<boolean> {
    const hasItems = this.items.some(i => i.sectionId === id);
    if (hasItems) return false;
    const index = this.sections.findIndex(s => s.id === id);
    if (index === -1) return false;
    this.sections.splice(index, 1);
    return true;
  }

  async listMenuItems(): Promise<MenuItem[]> {
    return [...this.items].sort((a, b) => a.sectionId - b.sectionId || a.sortOrder - b.sortOrder || a.id - b.id);
  }

  async createMenuItem(input: InsertMenuItem): Promise<MenuItem> {
    const item: MenuItem = {
      ...input,
      id: this.currentId++,
    };
    this.items.push(item);
    return item;
  }

  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) return undefined;
    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  async getPublicMenu(): Promise<PublicMenuResponse> {
    const sections = this.sections.filter(s => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
    const items = this.items.filter(i => i.isActive);

    return {
      meta: this.meta,
      sections: sections.map(section => ({
        section,
        items: items
          .filter(it => it.sectionId === section.id)
          .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
      })),
    };
  }
}

export const storage = new MemStorage();
