import { create } from 'zustand';

export type UserRole = 'consumer' | 'provider' | 'admin';

export interface PendingVerification {
  id: string;
  providerId: string;
  businessName: string;
  applicantName: string;
  categoryId: string;
  categoryName: string;
  municipality: string;
  documentType: string;
  documentNumber: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'on_hold';
  idFrontUrl?: string;
  rutDocUrl?: string;
  notes?: string;
}

export interface FlaggedChat {
  id: string;
  conversationId: string;
  providerName: string;
  consumerName: string;
  flaggedReason: string;
  detectedKeyword: string;
  snippet: string;
  timestamp: string;
  status: 'unresolved' | 'warned' | 'resolved';
}

export interface Deal {
  id: string;
  conversationId: string;
  providerId: string;
  providerName: string;
  consumerName: string;
  title: string;
  amount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'confirmed';
  createdAt: string;
  municipality: string;
}

interface AdminStoreState {
  verifications: PendingVerification[];
  flaggedChats: FlaggedChat[];
  deals: Deal[];
  activeProvidersCount: number;
  
  fetchVerifications: () => Promise<void>;
  approveVerification: (id: string) => Promise<void>;
  rejectVerification: (id: string, notes?: string) => Promise<void>;
  warnChat: (id: string) => void;
  resolveChat: (id: string) => void;
  addDeal: (deal: Deal) => void;
  addVerification: (verification: Omit<PendingVerification, 'id' | 'status' | 'submittedAt'>) => void;
}

export const useAdminStore = create<AdminStoreState>((set, get) => ({
  activeProvidersCount: 342,
  verifications: [
    {
      id: 'ver_7',
      providerId: '7',
      businessName: 'Asados El Gordo (Pendiente de Aprobación)',
      applicantName: 'Juan Fernando Castro',
      categoryId: 'comidas_tipicas',
      categoryName: 'Comidas Típicas & Quesillos',
      municipality: 'Yaguará',
      documentType: 'Cédula de Ciudadanía',
      documentNumber: '1075333444',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'pending',
    }
  ],
  flaggedChats: [
    {
      id: 'flag_001',
      conversationId: 'chat_88',
      providerName: 'Servicio de Acarreos Pérez',
      consumerName: 'Mariana López',
      flaggedReason: 'Intento de evasión de plataforma',
      detectedKeyword: 'nequi',
      snippet: 'Págueme por nequi al 3125556677 directo para no pagar comisión aquí',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'unresolved'
    },
    {
      id: 'flag_002',
      conversationId: 'chat_92',
      providerName: 'Electricista Tovar',
      consumerName: 'Camilo Rojas',
      flaggedReason: 'Compartió número personal sin cierre',
      detectedKeyword: 'whatsapp',
      snippet: 'Escríbame al whatsapp 3004445566 y cuadramos más barato',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'unresolved'
    }
  ],
  deals: [
    {
      id: 'deal_001',
      conversationId: 'chat_12',
      providerId: '1',
      providerName: 'Food Factory',
      consumerName: 'Carlos Mendoza',
      title: 'Hamburguesa Especial Artesanal x2',
      amount: 36000,
      commissionRate: 0.05,
      commissionAmount: 1800,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      municipality: 'Yaguará'
    },
    {
      id: 'deal_002',
      conversationId: 'chat_15',
      providerId: '2',
      providerName: 'Budaphone',
      consumerName: 'Diana Torres',
      title: 'Diagnóstico Especializado de Celular',
      amount: 10000,
      commissionRate: 0.05,
      commissionAmount: 500,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 28800000).toISOString(),
      municipality: 'Yaguará'
    }
  ],

  fetchVerifications: async () => {
    try {
      const res = await fetch('/api/admin/verifications');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          set({ verifications: data });
        }
      }
    } catch (err) {
      console.warn('Error fetching verifications from API:', err);
    }
  },
  
  approveVerification: async (id) => {
    // 1. Immediate optimistic UI update
    set((state) => ({
      verifications: state.verifications.map(v => 
        v.id === id ? { ...v, status: 'approved' } : v
      ),
      activeProvidersCount: state.activeProvidersCount + 1
    }));

    // 2. Persist to Laravel MySQL backend
    try {
      await fetch(`/api/admin/verifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: 'approved' })
      });
    } catch (err) {
      console.warn('Error syncing approval with API:', err);
    }
  },

  rejectVerification: async (id, notes) => {
    // 1. Immediate optimistic UI update
    set((state) => ({
      verifications: state.verifications.map(v => 
        v.id === id ? { ...v, status: 'rejected', notes } : v
      )
    }));

    // 2. Persist to Laravel MySQL backend
    try {
      await fetch(`/api/admin/verifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected', notes })
      });
    } catch (err) {
      console.warn('Error syncing rejection with API:', err);
    }
  },

  warnChat: (id) => set((state) => ({
    flaggedChats: state.flaggedChats.map(c => 
      c.id === id ? { ...c, status: 'warned' } : c
    )
  })),

  resolveChat: (id) => set((state) => ({
    flaggedChats: state.flaggedChats.map(c => 
      c.id === id ? { ...c, status: 'resolved' } : c
    )
  })),

  addDeal: (deal) => set((state) => ({
    deals: [deal, ...state.deals]
  })),

  addVerification: (verificationData) => set((state) => {
    const newVerification = {
      ...verificationData,
      id: `ver_00${state.verifications.length + 1}`,
      status: 'pending' as const,
      submittedAt: new Date().toISOString()
    };
    return {
      verifications: [newVerification, ...state.verifications]
    };
  })
}));
