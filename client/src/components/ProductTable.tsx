import React from 'react';
import type { Product } from '../api/client';
import { Button } from './ui/Button';
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Package } from 'lucide-react';
import { cn } from './ui/Button';

interface ProductTableProps {
    products: Product[];
    isLoading: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSort: (column: 'name' | 'price' | 'stock') => void;
}

const SortIcon = ({ column, sortBy, sortOrder }: { column: string; sortBy: string; sortOrder: string }) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-gray-600" />;
    return sortOrder === 'asc'
        ? <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-violet-400" />
        : <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-violet-400" />;
};

const StockBadge = ({ stock }: { stock: number }) => {
    if (stock === 0) return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            Out of stock
        </span>
    );
    if (stock <= 10) return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            {stock} {stock === 1 ? 'unit' : 'units'}
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {stock} units
        </span>
    );
};

export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    isLoading,
    onEdit,
    onDelete,
    sortBy,
    sortOrder,
    onSort,
}) => {
    const thClass =
        'px-5 py-3.5 text-left text-xxs font-bold text-gray-500 uppercase tracking-widest cursor-pointer select-none hover:text-gray-300 transition-colors duration-150';

    return (
        <div className="glass rounded-2xl overflow-hidden border border-white/[0.07]">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            <th className={thClass} onClick={() => onSort('name')}>
                                <div className="flex items-center">
                                    Product Name
                                    <SortIcon column="name" sortBy={sortBy} sortOrder={sortOrder} />
                                </div>
                            </th>
                            <th className={thClass} onClick={() => onSort('price')}>
                                <div className="flex items-center">
                                    Price
                                    <SortIcon column="price" sortBy={sortBy} sortOrder={sortOrder} />
                                </div>
                            </th>
                            <th className={thClass} onClick={() => onSort('stock')}>
                                <div className="flex items-center">
                                    Stock
                                    <SortIcon column="stock" sortBy={sortBy} sortOrder={sortOrder} />
                                </div>
                            </th>
                            <th className="px-5 py-3.5 text-right text-xxs font-bold text-gray-500 uppercase tracking-widest">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {isLoading ? (
                            [...Array(6)].map((_, i) => (
                                <tr key={i}>
                                    <td className="px-5 py-4"><div className="shimmer h-4 rounded-md w-2/3" /></td>
                                    <td className="px-5 py-4"><div className="shimmer h-4 rounded-md w-1/3" /></td>
                                    <td className="px-5 py-4"><div className="shimmer h-6 rounded-full w-24" /></td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <div className="shimmer h-8 w-8 rounded-lg" />
                                            <div className="shimmer h-8 w-8 rounded-lg" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-5 py-20 text-center">
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                                            <Package className="h-7 w-7 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-base font-semibold text-gray-300">No products found</p>
                                            <p className="text-sm text-gray-600 mt-1">Try adjusting your search or add a new product.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            products.map((product, idx) => (
                                <tr
                                    key={product.id}
                                    className="group hover:bg-white/[0.03] transition-colors duration-150 animate-fade-in-up"
                                    style={{ animationDelay: `${idx * 30}ms` }}
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20">
                                                <Package className="h-3.5 w-3.5 text-violet-400" />
                                            </div>
                                            <span className="font-semibold text-gray-100 group-hover:text-white transition-colors">
                                                {product.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="font-mono font-semibold text-gray-200">
                                            ${Number(product.price).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <StockBadge stock={product.stock} />
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(product)}
                                                title="Edit"
                                                className="h-8 w-8 p-0 text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(product)}
                                                title="Delete"
                                                className="h-8 w-8 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
