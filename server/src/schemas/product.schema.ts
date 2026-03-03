import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name cannot be empty"),
        price: z.number().positive("Price must be positive"),
        stock: z.number().int("Stock must be an integer").min(0, "Stock cannot be negative"),
    }),
});

export const updateProductSchema = z.object({
    params: z.object({
        id: z.string().min(1, "ID is required"),
    }),
    body: z.object({
        name: z.string().min(1, "Name cannot be empty").optional(),
        price: z.number().positive("Price must be positive").optional(),
        stock: z.number().int("Stock must be an integer").min(0, "Stock cannot be negative").optional(),
    }),
});

export const getProductsSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).optional().default(1 as any),
        limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10 as any),
        search: z.string().optional(),
        sortBy: z.enum(["name", "price", "stock"]).optional().default("name"),
        sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
    }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
export type GetProductsQuery = z.infer<typeof getProductsSchema>["query"];
