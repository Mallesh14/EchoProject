import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    stock: number;
    createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
    },
    {
        timestamps: { createdAt: "createdAt", updatedAt: false },
    }
);

export const Product = mongoose.model<IProduct>("Product", ProductSchema);
