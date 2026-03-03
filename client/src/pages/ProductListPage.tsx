import React, { useState } from 'react';
import { Plus, Search, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

import { ProductTable } from '../components/ProductTable';
import { AddEditProductModal } from '../components/AddEditProductModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { Button } from '../components/ui/Button';

import { useDebounce } from '../hooks/useDebounce';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import type { Product } from '../api/client';

export const ProductListPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Modals state
    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Queries & Mutations
    const { data, isLoading, isError, error } = useProducts({
        page,
        limit,
        search: debouncedSearch,
        sortBy,
        sortOrder,
    });

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    const handleSort = (column: 'name' | 'price' | 'stock') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
        setPage(1); // Reset to first page on sort
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset page on search
    };

    const openAddModal = () => {
        setSelectedProduct(null);
        setIsAddEditModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct(product);
        setIsAddEditModalOpen(true);
    };

    const openDeleteModal = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleAddEditSubmit = async (formData: any) => {
        try {
            if (selectedProduct) {
                await updateMutation.mutateAsync({ id: selectedProduct.id, data: formData });
                toast.success(`Product "${formData.name}" updated successfully.`);
            } else {
                await createMutation.mutateAsync(formData);
                toast.success(`Product "${formData.name}" added successfully.`);
                if (data && data.data.length === limit) {
                    // Could jump to last page if wanted, holding on current for simplicity
                }
            }
            setIsAddEditModalOpen(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to save product. Please try again.');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;
        try {
            await deleteMutation.mutateAsync(selectedProduct.id);
            toast.success(`Product "${selectedProduct.name}" deleted successfully.`);
            setIsDeleteModalOpen(false);

            // If we deleted the last item on the page, go back one page
            if (data?.data.length === 1 && page > 1) {
                setPage(page - 1);
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to delete product. Please try again.');
        }
    };

    if (isError) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center p-8 text-center bg-white rounded-2xl shadow-sm border border-red-100 mt-6 max-w-4xl mx-auto">
                <div className="bg-red-50 text-red-500 rounded-full p-4 mb-4">
                    <Layers className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Products</h2>
                <p className="text-gray-600 mb-4">{(error as any)?.message || 'There was a problem communicating with the server.'}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl p-6">
            {/* Header section */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your inventory, prices, and stock levels.</p>
                </div>

                <Button onClick={openAddModal} className="shrink-0 gap-2 shadow-sm">
                    <Plus className="h-5 w-5" />
                    Add Product
                </Button>
            </div>

            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="relative w-full max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors sm:text-sm h-10"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="text-sm text-gray-500 font-medium">
                    {data ? `Showing ${data.data.length} of ${data.total} products` : 'Loading...'}
                </div>
            </div>

            {/* Table */}
            <ProductTable
                products={data?.data || []}
                isLoading={isLoading}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
            />

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 bg-white rounded-xl shadow-sm">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-700">
                            Page <span className="font-semibold">{data.page}</span> of{' '}
                            <span className="font-semibold">{data.totalPages}</span>
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1 || isLoading}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                                disabled={page === data.totalPages || isLoading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                    {/* Mobile pagination */}
                    <div className="flex flex-1 justify-between sm:hidden">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1 || isLoading}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                            disabled={page === data.totalPages || isLoading}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <AddEditProductModal
                isOpen={isAddEditModalOpen}
                onClose={() => setIsAddEditModalOpen(false)}
                onSubmit={handleAddEditSubmit}
                initialData={selectedProduct}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                productName={selectedProduct?.name || ''}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
};
