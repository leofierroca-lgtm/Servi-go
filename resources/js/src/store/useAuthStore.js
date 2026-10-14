import { create } from 'zustand';

export const DEMO_USERS = {
  admin: {
    id: 'admin_1',
    name: 'Administrador General',
    email: 'admin@servigo.com',
    phone: '300 000 0000',
    address: 'Sede Principal',
    role: 'admin'
  },
  provider: {
    id: 'prov_1',
    name: 'Asadero & Restaurante 1',
    email: 'proveedor@servigo.com',
    phone: '315 892 3456',
    address: 'Calle 6 # 3-15, Yaguará',
    role: 'provider',
    businessId: 'comidas_tipicas_0' // Linked business ID for editing rights
  },
  client: {
    id: 'user_101',
    name: 'Carlos Mendoza',
    email: 'cliente@servigo.com',
    phone: '318 765 4321',
    address: 'Carrera 4 # 5-20, Centro, Yaguará',
    role: 'client'
  },
  delivery: {
    id: 'delivery_1',
    name: 'Juan Pérez',
    email: 'repartidor@servigo.com',
    phone: '320 987 6543',
    address: 'Yaguará, Huila',
    vehicle: 'Moto Honda CB125',
    plate: 'ABC-12D',
    role: 'delivery'
  }
};

const useAuthStore = create((set) => ({
  isAuthenticated: false, // Default is logged out
  role: 'guest', // 'guest', 'client', 'provider', 'admin', 'delivery'
  user: null, // Start with no user
  isAuthModalOpen: false,
  authModalReason: null, // 'inactivity' | 'logout' | 'required'
  lastActivity: Date.now(),

  touchActivity: () => set({ lastActivity: Date.now() }),

  login: (userData, role) => {
    // If login is called with one of our demo emails, we override to use the demo user data exactly.
    let finalUser = userData;
    let finalRole = role || 'client';

    if (userData?.email === DEMO_USERS.admin.email) {
      finalUser = DEMO_USERS.admin;
      finalRole = 'admin';
    } else if (userData?.email === DEMO_USERS.provider.email) {
      finalUser = DEMO_USERS.provider;
      finalRole = 'provider';
    } else if (userData?.email === DEMO_USERS.client.email) {
      finalUser = DEMO_USERS.client;
      finalRole = 'client';
    } else if (userData?.email === DEMO_USERS.delivery.email) {
      finalUser = DEMO_USERS.delivery;
      finalRole = 'delivery';
    }

    set({
      isAuthenticated: true,
      role: finalRole,
      user: finalUser,
      isAuthModalOpen: false,
      authModalReason: null,
      lastActivity: Date.now()
    });
  },

  logout: () => set({
    isAuthenticated: false,
    role: 'guest',
    user: null,
    isAuthModalOpen: true,
    authModalReason: 'logout'
  }),

  lockSession: () => set({
    isAuthenticated: false,
    role: 'guest',
    user: null,
    isAuthModalOpen: true,
    authModalReason: 'inactivity'
  }),

  setRole: (newRole) => {
    // For quick switching in demo via Dev tools if needed
    const demoUserMap = {
      admin: DEMO_USERS.admin,
      provider: DEMO_USERS.provider,
      client: DEMO_USERS.client,
      delivery: DEMO_USERS.delivery,
      guest: null
    };
    
    set({ 
      role: newRole,
      isAuthenticated: newRole !== 'guest',
      user: demoUserMap[newRole] || null
    });
  },
  
  setAuthModalOpen: (isOpen, reason = null) => set({ 
    isAuthModalOpen: isOpen,
    authModalReason: reason
  })
}));

export default useAuthStore;
