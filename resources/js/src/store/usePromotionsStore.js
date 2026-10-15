import { create } from 'zustand';

const initialPromotions = [
  {
    id: 'promo-0',
    providerId: 'tattoo_1',
    providerName: 'TATTOO STUDIO',
    categoryIcon: 'PenTool',
    title: '¡Apertura Diablo Est. 2024!',
    description: 'Conoce nuestro nuevo estudio. ¡Cotiza tu tatuaje hoy mismo y lleva tu idea a la piel!',
    image: '/images/tattoo_promo.jpg',
    promoType: 'fixed',
    price: null,
    discountPercentage: null,
    daysLeft: 2,
    color: 'from-[#2b080b] via-[#3d0f15] to-[#150406]',
    border: 'border-red-900/30',
    createdAt: Date.now()
  },
  {
    id: 'promo-1',
    providerId: 'comidas_tipicas_0',
    providerName: 'RESTAURANTE CHINO',
    categoryIcon: 'Utensils',
    title: '¡Descuento en Chop Suey!',
    description: 'Solo por hoy: disfruta de nuestro delicioso Chop Suey con arroz frito a un precio especial. ¡Aprovecha!',
    image: '/images/chopsuey_promo.jpg',
    promoType: 'fixed',
    price: 15000,
    discountPercentage: null,
    daysLeft: 2,
    color: 'from-[#ff5500] via-[#ff6a00] to-[#e64700]',
    border: 'border-orange-500/30',
    createdAt: Date.now() - 2 * 60 * 60 * 1000
  },
  {
    id: 'promo-2',
    providerId: 'hoteles_0',
    providerName: 'HOTEL EL OLIVAR',
    categoryIcon: 'Hotel',
    title: '15% OFF en Alojamiento',
    description: 'Reserva tu habitación este fin de semana y obtén un 15% de descuento en tu estadía.',
    image: '/images/hotel_promo.jpg',
    promoType: 'percentage',
    price: null,
    discountPercentage: 15,
    daysLeft: 1,
    color: 'from-[#0052cc] via-[#0066ff] to-[#0040aa]',
    border: 'border-blue-500/30',
    createdAt: Date.now() - 10 * 60 * 60 * 1000
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
