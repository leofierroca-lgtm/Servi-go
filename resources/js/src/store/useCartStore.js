import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,
  
  toggleCart: () => {
    console.log('toggleCart called, current isOpen:', get().isOpen);
    set({ isOpen: !get().isOpen });
  },
  setIsOpen: (isOpen) => set({ isOpen }),
  
  addItem: (product) => {
    const items = get().items;
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      set({ items: items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] });
    }
  },
  
  removeItem: (productId) => {
    set({ items: get().items.filter(i => i.id !== productId) });
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity < 1) return;
    set({ items: get().items.map(i => i.id === productId ? { ...i, quantity } : i) });
  },
  
  clearCart: () => set({ items: [] }),
  
  get total() {
    return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}));

export default useCartStore;
