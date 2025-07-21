
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { getSessionId } from '@/utils/helpers';
import type { CartItem } from '@/types';

export const useCart = () => {
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['/api/cart', sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/cart/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const items = await response.json();
      console.log('Cart items loaded:', items);
      return items;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: async (item: { productId: number; quantity: number; customDesign?: any }) => {
      console.log('Adding item to cart:', item);
      const response = await apiRequest('POST', '/api/cart', {
        ...item,
        sessionId,
      });
      const result = await response.json();
      console.log('Cart add response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Successfully added to cart:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
    onError: (error) => {
      console.error('Failed to add to cart:', error);
    }
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const response = await apiRequest('PUT', `/api/cart/${id}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
    onError: (error) => {
      console.error('Failed to update cart item:', error);
    }
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
    onError: (error) => {
      console.error('Failed to remove from cart:', error);
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/cart/session/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart', sessionId] });
    },
    onError: (error) => {
      console.error('Failed to clear cart:', error);
    }
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
    // Cart item count for navigation
    itemCount: cartItems.reduce((count: number, item: any) => count + item.quantity, 0),
    // Total price
    totalPrice: cartItems.reduce((total: number, item: any) => {
      return total + ((item.product?.price || 0) * item.quantity);
    }, 0)
  };
};
