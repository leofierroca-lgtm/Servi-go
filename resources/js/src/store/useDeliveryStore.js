import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDeliveryStore = create(
  persist(
    (set, get) => ({
      deliveries: [
        {
          id: '1',
          customerName: 'Carlos Mendoza',
          address: 'Carrera 4 # 5-20, Centro, Yaguará',
          phone: '318 765 4321',
          businessName: 'Food Factory',
          businessAddress: 'Calle 4 # 6-22, Frente al Parque',
          total: 40000,
          paymentMethod: 'Efectivo',
          paymentStatus: 'Pendiente',
          deliveryStatus: 'in_transit',
          time: 'Hace 5 min',
          distance: '1.2 km'
        }
      ],

      fetchOrders: async () => {
        try {
          const token = localStorage.getItem('servigo_token');
          const res = await fetch('/api/orders', {
            headers: {
              'Accept': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });

          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              const mapped = data.map(o => ({
                id: o.id.toString(),
                orderNumber: o.orderNumber,
                customerName: o.customerName,
                address: o.customerAddress,
                phone: o.customerPhone,
                businessName: o.businessName,
                businessAddress: 'Yaguará, Huila',
                total: o.totalAmount,
                paymentMethod: o.paymentMethod || 'Efectivo',
                paymentStatus: o.paymentMethod?.toLowerCase().includes('efectivo') ? 'Pendiente' : 'Pagado',
                deliveryStatus: o.status,
                time: 'Hoy',
                distance: '1.5 km'
              }));
              set({ deliveries: mapped });
            }
          }
        } catch (err) {
          console.warn('Error fetching orders for delivery:', err);
        }
      },

      addDelivery: (delivery) => set((state) => ({ deliveries: [delivery, ...state.deliveries] })),

      updateDeliveryStatus: async (id, status) => {
        // Optimistic UI update
        set((state) => ({
          deliveries: state.deliveries.map(d => d.id === id ? { ...d, deliveryStatus: status } : d)
        }));

        // Sync with API
        try {
          const token = localStorage.getItem('servigo_token');
          await fetch(`/api/orders/${id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ status, assignToMe: true })
          });
        } catch (err) {
          console.warn('Error updating order status in API:', err);
        }
      },

      markAsDelivered: async (id) => {
        // Optimistic UI update
        set((state) => ({
          deliveries: state.deliveries.map(d => d.id === id ? { ...d, deliveryStatus: 'delivered', paymentStatus: 'Pagado' } : d)
        }));

        // Sync with API
        try {
          const token = localStorage.getItem('servigo_token');
          await fetch(`/api/orders/${id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ status: 'delivered' })
          });
        } catch (err) {
          console.warn('Error marking order delivered in API:', err);
        }
      }
    }),
    {
      name: 'servigo-delivery-storage',
    }
  )
);

export default useDeliveryStore;
