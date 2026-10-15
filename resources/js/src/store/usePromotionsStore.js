import { create } from 'zustand';

export const PROMOTION_FEE = 10000; // $10.000 COP por 24 horas
export const PROMOTION_DURATION_HOURS = 24;

const STORAGE_PROMOTIONS_KEY = 'servigo_promotions_v2';
const STORAGE_PAYMENTS_KEY = 'servigo_promotion_payments_v2';

const defaultPromotions = [
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
    isPaid: true,
    fee: PROMOTION_FEE,
    paymentMethod: 'wompi',
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
    isPaid: true,
    fee: PROMOTION_FEE,
    paymentMethod: 'nequi',
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
    isPaid: true,
    fee: PROMOTION_FEE,
    paymentMethod: 'wompi',
    createdAt: Date.now() - 10 * 60 * 60 * 1000
  }
];

const loadInitialPromotions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_PROMOTIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read promotions from localStorage', e);
  }
  return defaultPromotions;
};

const loadInitialPayments = () => {
  try {
    const raw = localStorage.getItem(STORAGE_PAYMENTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
};

const usePromotionsStore = create((set, get) => ({
  promotions: loadInitialPromotions(),
  payments: loadInitialPayments(),
  fee: PROMOTION_FEE,
  durationHours: PROMOTION_DURATION_HOURS,
  
  // Agregar promoción tras confirmar pago
  addPromotion: (promo, paymentInfo = {}) => {
    const newPromoId = promo.id || `promo-${Date.now()}`;
    const paymentRecord = {
      id: `PAY-ADV-${Date.now()}`,
      promotionId: newPromoId,
      providerId: promo.providerId || 'comercio-local',
      providerName: promo.providerName || 'Comercio Local',
      title: promo.title,
      amount: PROMOTION_FEE,
      currency: 'COP',
      durationHours: PROMOTION_DURATION_HOURS,
      paymentMethod: paymentInfo.method || 'wompi',
      reference: paymentInfo.reference || `SG-ADV-${Date.now()}`,
      transactionId: paymentInfo.transactionId || `WPI-${Math.floor(Math.random() * 900000 + 100000)}`,
      status: 'APPROVED',
      paidAt: Date.now(),
      expiresAt: Date.now() + PROMOTION_DURATION_HOURS * 60 * 60 * 1000
    };

    const newPromotion = {
      ...promo,
      id: newPromoId,
      isPaid: true,
      fee: PROMOTION_FEE,
      paymentMethod: paymentRecord.paymentMethod,
      paymentReference: paymentRecord.reference,
      transactionId: paymentRecord.transactionId,
      daysLeft: 1,
      createdAt: Date.now(),
      expiresAt: paymentRecord.expiresAt
    };

    set((state) => {
      const updatedPromos = [newPromotion, ...state.promotions];
      const updatedPayments = [paymentRecord, ...state.payments];
      
      try {
        localStorage.setItem(STORAGE_PROMOTIONS_KEY, JSON.stringify(updatedPromos));
        localStorage.setItem(STORAGE_PAYMENTS_KEY, JSON.stringify(updatedPayments));
      } catch (e) {}

      return {
        promotions: updatedPromos,
        payments: updatedPayments
      };
    });

    return paymentRecord;
  },

  // Obtener promociones activas (dentro del rango de 24 horas)
  getActivePromotions: () => {
    const now = Date.now();
    const TWENTY_FOUR_HOURS = PROMOTION_DURATION_HOURS * 60 * 60 * 1000;
    return get().promotions.filter(p => (now - p.createdAt) < TWENTY_FOUR_HOURS);
  },
  
  removePromotion: (id) => set((state) => {
    const updated = state.promotions.filter(p => p.id !== id);
    try {
      localStorage.setItem(STORAGE_PROMOTIONS_KEY, JSON.stringify(updated));
    } catch (e) {}
    return { promotions: updated };
  })
}));

export default usePromotionsStore;
