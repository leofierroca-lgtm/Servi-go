import { create } from 'zustand';

export const DEMO_USERS = {
  admin: {
    id: '1',
    name: 'Administrador General',
    email: 'admin@servigo.com',
    phone: '300 000 0000',
    address: 'Sede Principal, Yaguará',
    role: 'admin'
  },
  provider: {
    id: '2',
    name: 'Food Factory Propietario',
    email: 'proveedor@servigo.com',
    phone: '315 892 3456',
    address: 'Calle 6 # 3-15, Yaguará',
    role: 'provider',
    businessId: '1' // Linked business ID for editing rights
  },
  client: {
    id: '3',
    name: 'Carlos Mendoza',
    email: 'cliente@servigo.com',
    phone: '318 765 4321',
    address: 'Carrera 4 # 5-20, Centro, Yaguará',
    role: 'client'
  },
  delivery: {
    id: '4',
    name: 'Juan Pérez',
    email: 'repartidor@servigo.com',
    phone: '320 987 6543',
    address: 'Yaguará, Huila',
    vehicle: 'Moto Honda CB125',
    plate: 'ABC-12D',
    role: 'delivery'
  }
};

const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('servigo_token');
    const userStr = localStorage.getItem('servigo_user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return { token, user, isAuthenticated: true, role: user.role || 'client' };
    }
  } catch (e) {
    // Ignore storage parse errors
  }
  return { token: null, user: null, isAuthenticated: false, role: 'guest' };
};

const initialAuth = getStoredAuth();

const useAuthStore = create((set, get) => ({
  isAuthenticated: initialAuth.isAuthenticated,
  role: initialAuth.role,
  user: initialAuth.user,
  token: initialAuth.token,
  isAuthModalOpen: false,
  authModalReason: null,
  lastActivity: Date.now(),

  touchActivity: () => set({ lastActivity: Date.now() }),

  login: async (userData, role) => {
    let finalUser = userData;
    let finalRole = role || 'client';
    let token = get().token;

    // Attempt real backend login via /api/auth/login if email & password are provided
    if (userData?.email && userData?.password) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email: userData.email, password: userData.password })
        });

        if (res.ok) {
          const data = await res.json();
          finalUser = data.user;
          finalRole = data.role || data.user.role;
          token = data.token;
          localStorage.setItem('servigo_token', token);
          localStorage.setItem('servigo_user', JSON.stringify(finalUser));
        }
      } catch (err) {
        console.warn('API login error, falling back to local credentials:', err);
      }
    }

    // Fallback mapping for demo accounts if no token was acquired
    if (!token) {
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
      localStorage.setItem('servigo_user', JSON.stringify(finalUser));
    }

    set({
      isAuthenticated: true,
      role: finalRole,
      user: finalUser,
      token: token || 'demo_token_' + Date.now(),
      isAuthModalOpen: false,
      authModalReason: null,
      lastActivity: Date.now()
    });
  },

  register: async (regData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(regData)
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('servigo_token', data.token);
        localStorage.setItem('servigo_user', JSON.stringify(data.user));

        set({
          isAuthenticated: true,
          role: data.role || 'client',
          user: data.user,
          token: data.token,
          isAuthModalOpen: false,
          authModalReason: null,
          lastActivity: Date.now()
        });
        return { success: true };
      } else {
        const errorData = await res.json();
        return { success: false, message: errorData.message || 'Error al registrarse' };
      }
    } catch (err) {
      return { success: false, message: 'Error de conexión con el servidor local' };
    }
  },

  logout: () => {
    const token = get().token;
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }).catch(() => {});
    }

    localStorage.removeItem('servigo_token');
    localStorage.removeItem('servigo_user');

    set({
      isAuthenticated: false,
      role: 'guest',
      user: null,
      token: null,
      isAuthModalOpen: true,
      authModalReason: 'logout'
    });
  },

  lockSession: () => set({
    isAuthenticated: false,
    role: 'guest',
    user: null,
    isAuthModalOpen: true,
    authModalReason: 'inactivity'
  }),

  setRole: (newRole) => {
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
