import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  name: string;
  namebn?: string;
  price: number;
  quantity: number;
  image?: string;
  images?: string[];
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: any) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (open: boolean) => void;
  total: number;
  itemCount: number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          });
        } else {
          const cartItem = {
            id: product.id,
            name: product.name,
            namebn: product.namebn,
            price: product.price,
            quantity: 1,
            image: product.images?.[0] || product.image,
            images: product.images
          };
          set({
            items: [...items, cartItem]
          });
        }
      },
      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)
        });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
      setIsOpen: (isOpen) => {
        set({ isOpen });
      },
      get total() {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      }
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
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    isOpen: store.isOpen,
    setIsOpen: store.setIsOpen,
    total: store.total,
    itemCount: store.itemCount
  };
};