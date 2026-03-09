import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/client';
import type { GetProductsParams, Product } from '../api/client';

export const useProducts = (params: GetProductsParams) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productApi.getAll(params),
        placeholderData: (previousData) => previousData, // keep previous data while fetching new pages
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Product, 'id' | 'createdAt'>> }) =>
            productApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productApi.delete,
        onMutate: async (id) => {
            // Cancel any outgoing fetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: ['products'] });

            // Snapshot the previous value
            const previousQueries = queryClient.getQueriesData({ queryKey: ['products'] });

            // Optimistically update to the new value
            queryClient.setQueriesData({ queryKey: ['products'] }, (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.filter((product: Product) => product.id !== id),
                    total: old.total - 1,
                };
            });

            return { previousQueries };
        },
        onError: (_err, _id, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousQueries) {
                context.previousQueries.forEach(([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                });
            }
        },
        onSettled: () => {
            // Always refetch after error or success to synchronize
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
