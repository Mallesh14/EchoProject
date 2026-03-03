import { Request, Response, NextFunction } from "express";
import { productController } from "../controllers/product.controller";
import { validate } from "../middlewares/error.middleware";
import {
    createProductSchema,
    updateProductSchema,
    getProductsSchema,
} from "../schemas/product.schema";
import { Router } from "express";

const router = Router();

router.post(
    "/",
    validate(createProductSchema),
    productController.createProduct
);

router.get(
    "/",
    validate(getProductsSchema),
    productController.getProducts
);

router.get(
    "/:id",
    (req, _res, next) => { req.params = { ...req.params }; next(); },
    productController.getProductById
);

router.put(
    "/:id",
    validate(updateProductSchema),
    productController.updateProduct
);

router.delete(
    "/:id",
    productController.deleteProduct
);

export default router;
