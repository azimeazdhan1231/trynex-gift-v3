
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

interface CartStore {
  items: CartItem[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      total: 0,
      isOpen: false,
      addItem: (product) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);
        let newItems;

        if (existingItem) {
          newItems = state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newItems = [...state.items, { ...product, quantity: 1 }];
        }

        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        return { items: newItems, itemCount, total };
      }),
      updateQuantity: (id, quantity) => set((state) => {
        const newItems = state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        );

        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        return { items: newItems, itemCount, total };
      }),
      removeItem: (id) => set((state) => {
        const newItems = state.items.filter(item => item.id !== id);

        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        return { items: newItems, itemCount, total };
      }),
      clearCart: () => set({ items: [], itemCount: 0, total: 0 }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'cart-storage',
    }
  )
);

export const useCart = () => {
  const store = useCartStore();

  return {
    items: store.items,
    itemCount: store.itemCount,
    total: store.total,
    isOpen: store.isOpen,
    addItem: store.addItem,
    updateQuantity: store.updateQuantity,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    toggleCart: store.toggleCart,
    addToCart: store.addItem, // Alias for compatibility
  };
};
