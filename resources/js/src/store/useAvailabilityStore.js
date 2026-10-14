import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAvailabilityStore = create(
  persist(
    (set, get) => ({
      // Business availability map: { [businessId]: { isAvailable: boolean, note: string } }
      businesses: {
        'comidas_tipicas_0': { isAvailable: true, note: 'Abierto y recibiendo pedidos normalmente' }
      },

      // Product availability map: { [productId]: { isAvailable: boolean, reason: string } }
      products: {
        // e.g. 102: { isAvailable: false, reason: 'Agotado por hoy' }
      },

      // Toggle or set Business availability
      toggleBusiness: (businessId) => {
        const current = get().businesses[businessId]?.isAvailable ?? true;
        const newStatus = !current;
        set((state) => ({
          businesses: {
            ...state.businesses,
            [businessId]: {
              isAvailable: newStatus,
              note: newStatus 
                ? 'Abierto y recibiendo pedidos normalmente' 
                : 'No disponible por hoy. Volveremos pronto a recibir pedidos.'
            }
          }
        }));
      },

      setBusinessStatus: (businessId, isAvailable, note) => {
        set((state) => ({
          businesses: {
            ...state.businesses,
            [businessId]: {
              isAvailable,
              note: note || (isAvailable ? 'Abierto y recibiendo pedidos' : 'No disponible hoy')
            }
          }
        }));
      },

      // Toggle or set Product availability
      toggleProduct: (productId) => {
        const current = get().products[productId]?.isAvailable ?? true;
        const newStatus = !current;
        set((state) => ({
          products: {
            ...state.products,
            [productId]: {
              isAvailable: newStatus,
              reason: newStatus ? '' : 'Agotado por el día de hoy'
            }
          }
        }));
      },

      setProductStatus: (productId, isAvailable, reason) => {
        set((state) => ({
          products: {
            ...state.products,
            [productId]: {
              isAvailable,
              reason: reason || (isAvailable ? '' : 'Agotado por hoy')
            }
          }
        }));
      },

      // Checkers
      isBusinessOpen: (businessId) => {
        const bus = get().businesses[businessId];
        return bus ? bus.isAvailable : true;
      },

      getBusinessNote: (businessId) => {
        return get().businesses[businessId]?.note || 'Atendiendo normalmente';
      },

      isProductInStock: (productId) => {
        const prod = get().products[productId];
        return prod ? prod.isAvailable : true;
      },

      getProductReason: (productId) => {
        return get().products[productId]?.reason || 'Agotado por hoy';
      }
    }),
    {
      name: 'servigo-availability-storage'
    }
  )
);

export default useAvailabilityStore;
