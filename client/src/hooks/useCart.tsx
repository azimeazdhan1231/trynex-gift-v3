import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useCartStore } from '@/lib/cart-store';
import { getSessionId } from '@/utils/helpers';
import type { CartItem } from '@/types';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { items, addItem, removeItem, updateQuantity, clearCart: clearStoreCart } = useCartStore();
  const sessionId = getSessionId();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['/api/cart', sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/cart/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const items = await response.json();
      return items;
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (item: { productId: number; quantity: number; customDesign?: any }) => {
      const response = await apiRequest('POST', '/api/cart', {
        ...item,
        sessionId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
      // Add to local store as well
      if (data.product) {
        addItem({
          id: data.product.id,
          productId: data.productId,
          customDesign: data.customDesign,
          product: data.product
        });
      }
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const response = await apiRequest('PUT', `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
      updateQuantity(variables.id, variables.quantity);
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/cart/${id}`);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
      removeItem(variables);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/cart/session/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
      clearStoreCart();
    },
  });

  return {
    cartItems,
    isLoading,
    addToCart: addToCartMutation.mutate,
    updateCart: updateCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateCartMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    // Local store items for immediate UI updates
    localItems: items,
  };
};
