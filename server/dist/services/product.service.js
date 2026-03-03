"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProductService {
    async createProduct(data) {
        return prisma.product.create({
            data,
        });
    }
    async getProducts(query) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            }
            : {};
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            prisma.product.count({ where }),
        ]);
        return {
            data: products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getProductById(id) {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }
        return product;
    }
    async updateProduct(id, data) {
        await this.getProductById(id); // Check existence
        return prisma.product.update({
            where: { id },
            data,
        });
    }
    async deleteProduct(id) {
        await this.getProductById(id); // Check existence
        await prisma.product.delete({
            where: { id },
        });
        return { success: true, message: "Product deleted successfully" };
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
