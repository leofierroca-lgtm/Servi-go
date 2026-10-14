import { create } from 'zustand';

// Mock initial promotions
const initialPromotions = [
  {
    id: 'promo-0',
    providerId: 'tattoo_1',
    providerName: 'Josetovart Tattoo Studio',
    title: '¡Apertura Diablito Est. 2024!',
    description: 'Conoce nuestro nuevo estudio. Cotiza tu tatuaje hoy mismo con los mejores artistas.',
    image: '/uploads/tattoo_cover.jpg',
    promoType: 'fixed',
    price: null,
    discountPercentage: null,
    color: 'from-red-600 to-red-900',
    createdAt: Date.now()
  },
  {
    id: 'promo-1',
    providerId: 'comidas_tipicas_0',
    providerName: 'Restaurante Chino Jinlong',
    title: '¡Descuento en Chop Suey!',
    description: 'Solo por hoy, disfruta de nuestro delicioso Chop Suey con arroz frito a un precio especial. ¡Aprovecha!',
    image: '/uploads/media_1789692950638.jpg',
    promoType: 'fixed',
    price: 15000,
    discountPercentage: null,
    color: 'from-[#ff6b00] to-[#ff4500]',
    createdAt: Date.now() - 2 * 60 * 60 * 1000 // 2 hours ago
  },
  {
    id: 'promo-2',
    providerId: 'hoteles_0',
    providerName: 'Hotel El Chuira',
    title: '15% OFF en Alojamiento',
    description: 'Reserva tu habitación este fin de semana y obtén un 15% de descuento en tu estadía.',
    image: '/uploads/media_1789683655082.png',
    promoType: 'percentage',
    price: null,
    discountPercentage: 15,
    color: 'from-blue-600 to-indigo-700',
    createdAt: Date.now() - 10 * 60 * 60 * 1000 // 10 hours ago
  }
];

const usePromotionsStore = create((set, get) => ({
  promotions: initialPromotions,
  
  addPromotion: (promo) => set((state) => ({
    promotions: [{
      ...promo,
      id: `promo-${Date.now()}`,
      createdAt: Date.now()
    }, ...state.promotions]
  })),

  // Get active promotions (less than 24 hours old)
  getActivePromotions: () => {
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    return get().promotions.filter(p => (now - p.createdAt) < TWENTY_FOUR_HOURS);
  },
  
  removePromotion: (id) => set((state) => ({
    promotions: state.promotions.filter(p => p.id !== id)
  }))
}));

export default usePromotionsStore;
