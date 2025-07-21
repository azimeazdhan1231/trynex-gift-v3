import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCart: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId
          );

          let newItems;
          if (existingItem) {
            newItems = state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            newItems = [...state.items, item];
          }

          const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
          const totalPrice = newItems.reduce(
            (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
            0
          );

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
          const totalPrice = newItems.reduce(
            (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
            0
          );

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return get().removeItem(id);
          }

          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );

          const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0);
          const totalPrice = newItems.reduce(
            (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
            0
          );

          return {
            items: newItems,
            totalItems,
            totalPrice,
          };
        }),

      clearCart: () =>
        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCart: (items) =>
        set(() => {
          const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
          const totalPrice = items.reduce(
            (sum, i) => sum + parseFloat(i.product.price) * i.quantity,
            0
          );

          return {
            items,
            totalItems,
            totalPrice,
          };
        }),
    }),
    {
      name: 'trynex-cart',
    }
  )
);
