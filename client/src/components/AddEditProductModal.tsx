import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import type { Product } from '../api/client';
import { X, Package, DollarSign, Layers } from 'lucide-react';

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
        if (!name.trim()) newErrors.name = 'Product name is required';
        if (!price || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Enter a valid positive price';
        if (!stock || isNaN(Number(stock)) || Number(stock) < 0 || !Number.isInteger(Number(stock)))
            newErrors.stock = 'Enter a valid non-negative integer';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({ name: name.trim(), price: Number(price), stock: Number(stock) });
        }
    };

    const isEditing = !!initialData;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                onClick={!isLoading ? onClose : undefined}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-md animate-fade-in-scale">
                    {/* Card */}
                    <div className="relative rounded-2xl bg-[#161821] border border-white/[0.09] shadow-2xl shadow-black/60 overflow-hidden">
                        {/* Top accent bar */}
                        <div className="h-0.5 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border border-violet-500/30">
                                    <Package className="h-4.5 w-4.5 text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white">
                                        {isEditing ? 'Edit Product' : 'Add New Product'}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {isEditing ? 'Update product details below' : 'Fill in the details to add a product'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-gray-200 hover:bg-white/[0.06] transition-all disabled:opacity-40"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                            <Input
                                label="Product Name"
                                placeholder="e.g. Wireless Headphones"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={errors.name}
                                icon={<Package className="h-4 w-4" />}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Price (USD)"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    error={errors.price}
                                    icon={<DollarSign className="h-4 w-4" />}
                                />
                                <Input
                                    label="Stock Qty"
                                    type="number"
                                    step="1"
                                    min="0"
                                    placeholder="0"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    error={errors.stock}
                                    icon={<Layers className="h-4 w-4" />}
                                />
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 pt-3 mt-2 border-t border-white/[0.06]">
                                <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" isLoading={isLoading}>
                                    {isEditing ? 'Save Changes' : 'Add Product'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
