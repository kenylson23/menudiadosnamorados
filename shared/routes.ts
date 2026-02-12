import { z } from "zod";
import { insertMenuMetaSchema, insertMenuSectionSchema, insertMenuItemSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const publicMenuResponseSchema = z.object({
  meta: z.object({
    id: z.number(),
    restaurantName: z.string(),
    menuTitle: z.string().nullable().optional(),
    footerNote: z.string().nullable().optional(),
    whatsapp1: z.string().nullable().optional(),
    whatsapp2: z.string().nullable().optional(),
    coupleDinnerPriceKz: z.number().nullable().optional(),
    coupleDinnerWithSparklingPriceKz: z.number().nullable().optional(),
  }),
  sections: z.array(
    z.object({
      section: z.object({
        id: z.number(),
        name: z.string(),
        sortOrder: z.number(),
        isActive: z.boolean(),
      }),
      items: z.array(
        z.object({
          id: z.number(),
          sectionId: z.number(),
          name: z.string(),
          description: z.string().nullable().optional(),
          priceKz: z.number().nullable().optional(),
          sortOrder: z.number(),
          isActive: z.boolean(),
        }),
      ),
    }),
  ),
});

export const api = {
  publicMenu: {
    get: {
      method: "GET" as const,
      path: "/api/public/menu" as const,
      responses: {
        200: publicMenuResponseSchema,
      },
    },
  },
  adminMenu: {
    meta: {
      get: {
        method: "GET" as const,
        path: "/api/menu/meta" as const,
        responses: {
          200: insertMenuMetaSchema.extend({ id: z.number() }),
        },
      },
      update: {
        method: "PATCH" as const,
        path: "/api/menu/meta" as const,
        input: insertMenuMetaSchema.partial(),
        responses: {
          200: insertMenuMetaSchema.extend({ id: z.number() }),
          400: errorSchemas.validation,
        },
      },
    },
    sections: {
      list: {
        method: "GET" as const,
        path: "/api/menu/sections" as const,
        responses: {
          200: z.array(insertMenuSectionSchema.extend({ id: z.number() })),
        },
      },
      create: {
        method: "POST" as const,
        path: "/api/menu/sections" as const,
        input: insertMenuSectionSchema,
        responses: {
          201: insertMenuSectionSchema.extend({ id: z.number() }),
          400: errorSchemas.validation,
        },
      },
      update: {
        method: "PUT" as const,
        path: "/api/menu/sections/:id" as const,
        input: insertMenuSectionSchema.partial(),
        responses: {
          200: insertMenuSectionSchema.extend({ id: z.number() }),
          400: errorSchemas.validation,
          404: errorSchemas.notFound,
        },
      },
      delete: {
        method: "DELETE" as const,
        path: "/api/menu/sections/:id" as const,
        responses: {
          204: z.void(),
          404: errorSchemas.notFound,
        },
      },
    },
    items: {
      list: {
        method: "GET" as const,
        path: "/api/menu/items" as const,
        responses: {
          200: z.array(insertMenuItemSchema.extend({ id: z.number() })),
        },
      },
      create: {
        method: "POST" as const,
        path: "/api/menu/items" as const,
        input: insertMenuItemSchema,
        responses: {
          201: insertMenuItemSchema.extend({ id: z.number() }),
          400: errorSchemas.validation,
        },
      },
      update: {
        method: "PUT" as const,
        path: "/api/menu/items/:id" as const,
        input: insertMenuItemSchema.partial(),
        responses: {
          200: insertMenuItemSchema.extend({ id: z.number() }),
          400: errorSchemas.validation,
          404: errorSchemas.notFound,
        },
      },
      delete: {
        method: "DELETE" as const,
        path: "/api/menu/items/:id" as const,
        responses: {
          204: z.void(),
          404: errorSchemas.notFound,
        },
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type PublicMenuResponse = z.infer<typeof api.publicMenu.get.responses[200]>;
export type MenuMetaResponse = z.infer<typeof api.adminMenu.meta.get.responses[200]>;
export type MenuSectionResponse = z.infer<typeof api.adminMenu.sections.list.responses[200]>[number];
export type MenuItemResponse = z.infer<typeof api.adminMenu.items.list.responses[200]>[number];
