"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name cannot be empty"),
        price: zod_1.z.number().positive("Price must be positive"),
        stock: zod_1.z.number().int("Stock must be an integer").min(0, "Stock cannot be negative"),
    }),
});
exports.updateProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, "ID must be a valid number"),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name cannot be empty").optional(),
        price: zod_1.z.number().positive("Price must be positive").optional(),
        stock: zod_1.z.number().int("Stock must be an integer").min(0, "Stock cannot be negative").optional(),
    }),
});
exports.getProductsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default(1),
        limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default(10),
        search: zod_1.z.string().optional(),
        sortBy: zod_1.z.enum(["name", "price", "stock"]).optional().default("name"),
        sortOrder: zod_1.z.enum(["asc", "desc"]).optional().default("asc"),
    }),
});
