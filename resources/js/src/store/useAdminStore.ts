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
  
  approveVerification: (id: string) => void;
  rejectVerification: (id: string, notes?: string) => void;
  warnChat: (id: string) => void;
  resolveChat: (id: string) => void;
  addDeal: (deal: Deal) => void;
  addVerification: (verification: Omit<PendingVerification, 'id' | 'status' | 'submittedAt'>) => void;
}

export const useAdminStore = create<AdminStoreState>((set) => ({
  activeProvidersCount: 342,
  verifications: [
    {
      id: 'ver_001',
      providerId: 'prov_99',
      businessName: 'Asados El Gordo',
      applicantName: 'Juan Fernando Castro',
      categoryId: 'comidas_tipicas',
      categoryName: 'Comidas Típicas',
      municipality: 'Yaguará',
      documentType: 'Cédula de Ciudadanía',
      documentNumber: '1075333444',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'pending',
    },
    {
      id: 'ver_002',
      providerId: 'prov_105',
      businessName: 'Droguería La Principal',
      applicantName: 'Lucía Fernández',
      categoryId: 'salud',
      categoryName: 'Droguerías',
      municipality: 'Yaguará',
      documentType: 'RUT',
      documentNumber: '900112233-4',
      submittedAt: new Date(Date.now() - 172800000).toISOString(),
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
      providerId: 'comidas_tipicas_0',
      providerName: 'Asadero & Restaurante 1',
      consumerName: 'Carlos Mendoza',
      title: 'Pedido Quesillo Familiar x3',
      amount: 78000,
      commissionRate: 0.05,
      commissionAmount: 3900,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      municipality: 'Yaguará'
    },
    {
      id: 'deal_002',
      conversationId: 'chat_15',
      providerId: 'transporte_0',
      providerName: 'Transporte Yaguará-Neiva',
      consumerName: 'Diana Torres',
      title: 'Viaje Redondo Neiva',
      amount: 120000,
      commissionRate: 0.05,
      commissionAmount: 6000,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 28800000).toISOString(),
      municipality: 'Yaguará'
    },
    {
      id: 'deal_003',
      conversationId: 'chat_20',
      providerId: 'maestros_1',
      providerName: 'Guillermo Borrero Construcciones',
      consumerName: 'Pedro Salinas',
      title: 'Instalación de Porcelanato (Anticipo)',
      amount: 450000,
      commissionRate: 0.05,
      commissionAmount: 22500,
      status: 'confirmed',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      municipality: 'Yaguará'
    }
  ],
  
  approveVerification: (id) => set((state) => ({
    verifications: state.verifications.map(v => 
      v.id === id ? { ...v, status: 'approved' } : v
    ),
    activeProvidersCount: state.activeProvidersCount + 1
  })),

  rejectVerification: (id, notes) => set((state) => ({
    verifications: state.verifications.map(v => 
      v.id === id ? { ...v, status: 'rejected', notes } : v
    )
  })),

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
