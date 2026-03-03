import React from 'react';
import type { Product } from '../api/client';
import { Button } from './ui/Button';
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface ProductTableProps {
    products: Product[];
    isLoading: boolean;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSort: (column: 'name' | 'price' | 'stock') => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    isLoading,
    onEdit,
    onDelete,
    sortBy,
    sortOrder,
    onSort,
}) => {
    const renderSortIcon = (column: string) => {
        if (sortBy !== column) return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />;
        return sortOrder === 'asc' ? (
            <ArrowUp className="ml-1 h-4 w-4 text-blue-600" />
        ) : (
            <ArrowDown className="ml-1 h-4 w-4 text-blue-600" />
        );
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                        <tr>
                            <th
                                className="w-1/3 p-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => onSort('name')}
                            >
                                <div className="flex items-center">
                                    Product Name {renderSortIcon('name')}
                                </div>
                            </th>
                            <th
                                className="p-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => onSort('price')}
                            >
                                <div className="flex items-center">
                                    Price {renderSortIcon('price')}
                                </div>
                            </th>
                            <th
                                className="p-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => onSort('stock')}
                            >
                                <div className="flex items-center">
                                    Stock {renderSortIcon('stock')}
                                </div>
                            </th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse bg-white">
                                    <td className="p-4"><div className="h-5 bg-gray-200 rounded w-3/4"></div></td>
                                    <td className="p-4"><div className="h-5 bg-gray-200 rounded w-1/2"></div></td>
                                    <td className="p-4"><div className="h-5 bg-gray-200 rounded w-1/4"></div></td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                            <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-lg font-medium text-gray-900 mb-1">No products found</p>
                                        <p className="text-sm">Try adjusting your search or filters.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{product.name}</td>
                                    <td className="p-4 text-gray-600">${Number(product.price).toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${product.stock > 10 ? 'bg-green-50 text-green-700' :
                                            product.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                            {product.stock} {product.stock === 1 ? 'unit' : 'units'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => onEdit(product)} title="Edit">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(product)} title="Delete">
                                                <Trash2 className="h-4 w-4" />
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
