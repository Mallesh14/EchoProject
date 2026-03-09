import React, { useState } from 'react';
import { Plus, Search, Package, TrendingUp, AlertCircle, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

import { ProductTable } from '../components/ProductTable';
import { AddEditProductModal } from '../components/AddEditProductModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { Button } from '../components/ui/Button';

import { useDebounce } from '../hooks/useDebounce';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import type { Product } from '../api/client';

const StatCard = ({
    icon,
    label,
    value,
    sub,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    sub?: string;
    color: string;
}) => (
    <div className="glass rounded-2xl p-5 flex items-start gap-4 border border-white/[0.07] hover:border-white/[0.12] transition-colors duration-200">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-bold text-white mt-0.5 tabular-nums">{value}</p>
            {sub && <p className="text-xs text-gray-600 mt-0.5 truncate">{sub}</p>}
        </div>
    </div>
);

export const ProductListPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
        setPage(1);
    };

    const openAddModal = () => { setSelectedProduct(null); setIsAddEditModalOpen(true); };
    const openEditModal = (product: Product) => { setSelectedProduct(product); setIsAddEditModalOpen(true); };
    const openDeleteModal = (product: Product) => { setSelectedProduct(product); setIsDeleteModalOpen(true); };

    const handleAddEditSubmit = async (formData: any) => {
        try {
            if (selectedProduct) {
                await updateMutation.mutateAsync({ id: selectedProduct.id, data: formData });
                toast.success(`"${formData.name}" updated successfully`);
            } else {
                await createMutation.mutateAsync(formData);
                toast.success(`"${formData.name}" added successfully`);
            }
            setIsAddEditModalOpen(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to save product. Try again.');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;
        try {
            await deleteMutation.mutateAsync(selectedProduct.id);
            toast.success(`"${selectedProduct.name}" deleted`);
            setIsDeleteModalOpen(false);
            if (data?.data.length === 1 && page > 1) setPage(page - 1);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to delete product. Try again.');
        }
    };

    // Derived stats
    const totalProducts = data?.total ?? 0;
    const lowStock = data?.data.filter((p) => p.stock > 0 && p.stock <= 10).length ?? 0;
    const outOfStock = data?.data.filter((p) => p.stock === 0).length ?? 0;

    if (isError) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="h-7 w-7 text-red-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white mb-1">Failed to load products</h2>
                    <p className="text-sm text-gray-500">
                        {(error as any)?.message || 'There was a problem communicating with the server.'}
                    </p>
                </div>
                <Button onClick={() => window.location.reload()} variant="secondary">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* ── Top Nav Bar ── */}
            <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0f1117]/80 backdrop-blur-md">
                <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                            <Layers className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">Echo</span>
                        <span className="hidden sm:inline-block text-xs font-medium text-gray-600 bg-white/[0.05] border border-white/[0.08] px-2 py-0.5 rounded-full ml-1">
                            Inventory
                        </span>
                    </div>
                    <Button onClick={openAddModal} size="sm" className="gap-1.5">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Product</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-8 space-y-7">
                {/* ── Page headline ── */}
                <div className="animate-fade-in-up">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        Product <span className="gradient-text">Inventory</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your catalog, pricing, and stock levels.</p>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
                    <StatCard
                        icon={<Package className="h-5 w-5 text-violet-400" />}
                        label="Total Products"
                        value={isLoading ? '—' : totalProducts}
                        sub="in inventory"
                        color="bg-violet-500/10 border border-violet-500/20"
                    />
                    <StatCard
                        icon={<TrendingUp className="h-5 w-5 text-amber-400" />}
                        label="Low Stock"
                        value={isLoading ? '—' : lowStock}
                        sub="items ≤ 10 units"
                        color="bg-amber-500/10 border border-amber-500/20"
                    />
                    <StatCard
                        icon={<AlertCircle className="h-5 w-5 text-red-400" />}
                        label="Out of Stock"
                        value={isLoading ? '—' : outOfStock}
                        sub="items need restocking"
                        color="bg-red-500/10 border border-red-500/20"
                    />
                </div>

                {/* ── Toolbar ── */}
                <div
                    className="glass rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 animate-fade-in-up"
                    style={{ animationDelay: '120ms' }}
                >
                    <div className="relative flex-1 w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3.5 flex items-center">
                            <Search className="h-4 w-4 text-gray-600" />
                        </div>
                        <input
                            type="text"
                            className="w-full h-10 bg-transparent pl-10 pr-4 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none"
                            placeholder="Search products by name..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="shrink-0 text-xs font-semibold text-gray-600 hidden sm:block">
                        {data
                            ? `${data.data.length} of ${data.total} result${data.total !== 1 ? 's' : ''}`
                            : isLoading ? 'Loading...' : ''}
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
                    <ProductTable
                        products={data?.data || []}
                        isLoading={isLoading}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                    />
                </div>

                {/* ── Pagination ── */}
                {data && data.totalPages > 1 && (
                    <div
                        className="glass rounded-2xl px-5 py-3 flex items-center justify-between animate-fade-in-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <p className="text-xs text-gray-500">
                            Page <span className="font-bold text-gray-300">{data.page}</span> of{' '}
                            <span className="font-bold text-gray-300">{data.totalPages}</span>
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1 || isLoading}
                            >
                                ← Prev
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                                disabled={page === data.totalPages || isLoading}
                            >
                                Next →
                            </Button>
                        </div>
                    </div>
                )}
            </main>

            {/* ── Modals ── */}
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
