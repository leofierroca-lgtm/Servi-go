import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDeliveryStore = create(
  persist(
    (set) => ({
      deliveries: [
        {
          id: 'FE-592819',
          customerName: 'Carlos Mendoza',
          address: 'Carrera 4 # 5-20, Centro, Yaguará',
          phone: '318 765 4321',
          businessName: 'Asadero & Restaurante 1',
          businessAddress: 'Calle Principal #2-10',
          total: 14000,
          paymentMethod: 'Efectivo',
          paymentStatus: 'Pendiente',
          deliveryStatus: 'in_transit',
          time: 'Hace 5 min',
          distance: '1.2 km'
        },
        {
          id: 'FE-592820',
          customerName: 'Laura Silva',
          address: 'Barrio Las Brisas, Mz C Casa 4',
          phone: '315 123 4567',
          businessName: 'Farmacia Principal',
          businessAddress: 'Frente al parque',
          total: 25000,
          paymentMethod: 'Nequi',
          paymentStatus: 'Pagado',
          deliveryStatus: 'pending_pickup',
          time: 'Hace 15 min',
          distance: '2.5 km'
        }
      ],
      addDelivery: (delivery) => set((state) => ({ deliveries: [delivery, ...state.deliveries] })),
      updateDeliveryStatus: (id, status) => set((state) => ({
        deliveries: state.deliveries.map(d => d.id === id ? { ...d, deliveryStatus: status } : d)
      })),
      markAsDelivered: (id) => set((state) => ({
        deliveries: state.deliveries.map(d => d.id === id ? { ...d, deliveryStatus: 'delivered', paymentStatus: 'Pagado' } : d)
      }))
    }),
    {
      name: 'servigo-delivery-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useDeliveryStore;
