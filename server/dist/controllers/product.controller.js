"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
class ProductController {
    async createProduct(req, res, next) {
        try {
            const product = await product_service_1.productService.createProduct(req.body);
            res.status(201).json(product);
        }
        catch (error) {
            next(error);
        }
    }
    async getProducts(req, res, next) {
        try {
            // The query object is already validated and typed by Zod middleware
            const result = await product_service_1.productService.getProducts(req.query);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getProductById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const product = await product_service_1.productService.getProductById(id);
            res.status(200).json(product);
        }
        catch (error) {
            next(error);
        }
    }
    async updateProduct(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const updatedProduct = await product_service_1.productService.updateProduct(id, req.body);
            res.status(200).json(updatedProduct);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteProduct(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await product_service_1.productService.deleteProduct(id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
exports.productController = new ProductController();
