import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service";

export class ProductController {
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const query = (req as any).validated?.query ?? req.query;
            const result = await productService.getProducts(query as any);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await productService.getProductById(req.params.id as string);
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const updatedProduct = await productService.updateProduct(req.params.id as string, req.body);
            res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await productService.deleteProduct(req.params.id as string);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const productController = new ProductController();
