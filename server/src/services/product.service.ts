import { Product } from "../models/product.model";
import { CreateProductInput, UpdateProductInput, GetProductsQuery } from "../schemas/product.schema";

export class ProductService {
    async createProduct(data: CreateProductInput) {
        const product = await Product.create(data);
        return product;
    }

    async getProducts(query: GetProductsQuery) {
        const { page, limit, search, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;

        const filter = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        const sortDir = sortOrder === "asc" ? 1 : -1;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort({ [sortBy]: sortDir })
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(filter),
        ]);

        return {
            data: products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getProductById(id: string) {
        const product = await Product.findById(id).lean();

        if (!product) {
            const error: any = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }

        return product;
    }

    async updateProduct(id: string, data: UpdateProductInput) {
        const product = await Product.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).lean();

        if (!product) {
            const error: any = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }

        return product;
    }

    async deleteProduct(id: string) {
        const product = await Product.findByIdAndDelete(id).lean();

        if (!product) {
            const error: any = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }

        return { success: true, message: "Product deleted successfully" };
    }
}

export const productService = new ProductService();
