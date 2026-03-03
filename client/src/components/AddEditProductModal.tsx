import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import type { Product } from '../api/client';

interface AddEditProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData: Product | null;
    isLoading: boolean;
}

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isLoading,
}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (initialData && isOpen) {
            setName(initialData.name);
            setPrice(initialData.price.toString());
            setStock(initialData.stock.toString());
        } else if (isOpen) {
            setName('');
            setPrice('');
            setStock('');
        }
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors: any = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Valid positive price is required';
        if (!stock || isNaN(Number(stock)) || Number(stock) < 0 || !Number.isInteger(Number(stock))) newErrors.stock = 'Valid non-negative integer stock is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                name: name.trim(),
                price: Number(price),
                stock: Number(stock),
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                <h3 className="mb-6 text-xl font-bold text-gray-900">
                    {initialData ? 'Edit Product' : 'Add New Product'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Product Name"
                        placeholder="e.g. Wireless Mouse"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Price ($)"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            error={errors.price}
                        />

                        <Input
                            label="Stock Quantity"
                            type="number"
                            step="1"
                            min="0"
                            placeholder="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            error={errors.stock}
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-5">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" isLoading={isLoading}>
                            {initialData ? 'Save Changes' : 'Add Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
