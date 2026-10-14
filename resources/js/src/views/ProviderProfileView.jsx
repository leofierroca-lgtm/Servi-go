import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  QrCode, 
  Store, 
  Zap, 
  ArrowLeft, 
  MessageSquare, 
  X, 
  Bot, 
  ThumbsUp, 
  CheckCircle2, 
  MessageSquarePlus, 
  Filter, 
  Award,
  Sparkles,
  Send,
  Power,
  AlertTriangle,
  Map,
  Megaphone
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { MOCK_BUSINESSES } from '../data/mockData';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import useAvailabilityStore from '../store/useAvailabilityStore';
import usePromotionsStore from '../store/usePromotionsStore';
import AvailabilityManagerModal from '../components/AvailabilityManagerModal';
import ProviderDashboard from './ProviderDashboard';
import ProviderInboxModal from '../components/ProviderInboxModal';

const DEFAULT_PRODUCTS = [
  { id: 101, name: 'Quesillo Yaguareño en Hoja de Plátano (500g)', price: 14000, unit: 'unidad', description: 'Elaborado diariamente con leche entera fresca de fincas de Yaguará.', image: 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&q=80&w=400' },
  { id: 102, name: 'Kumis Casero Tradicional (Litro)', price: 9000, unit: 'litro', description: 'Kumis cremoso y espeso, receta de la abuela.', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400' },
  { id: 103, name: 'Dulce de Nochebuena & Papayuela (Porción)', price: 8000, unit: 'porción', description: 'Dulce tradicional huilense con queso y almíbar.', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400' },
  { id: 104, name: 'Quesillo Familiar Gigante (1 Kilo)', price: 26000, unit: 'kilo', description: 'Ideal para compartir en familia o llevar de recuerdo.', image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&q=80&w=400' }
];

const DEFAULT_REVIEWS_BY_CATEGORY = {
  comidas_tipicas: [
    {
      id: 1,
      author: 'Andrés Felipe Polanía',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 2 días',
      verifiedPurchase: true,
      comment: '¡El mejor quesillo que he probado en todo Yaguará! Viene fresquito, suave y con ese sabor tradicional inconfundible de nuestra tierra. La mojarra frita también súper crocante y bien servida. Llegó en menos de 25 minutos con el domiciliario.',
      likes: 14,
      isLiked: false
    },
    {
      id: 2,
      author: 'Claudia Marcela Perdomo',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 1 semana',
      verifiedPurchase: true,
      comment: 'Excelente atención a través del chatbot de la app, pedí un quesillo familiar de kilo y asado huilense para un almuerzo familiar y quedamos fascinados. La factura electrónica me llegó al instante. Muy puntuales y limpios.',
      likes: 8,
      isLiked: false
    },
    {
      id: 3,
      author: 'Jhon Fredy Tovar',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120',
      rating: 4,
      date: 'Hace 2 semanas',
      verifiedPurchase: true,
      comment: 'Muy buena sazón tradicional de nuestro pueblo. El kumis bien espeso y delicioso como nos gusta a los yaguareños. Solo tardó 5 minutos más de lo esperado pero la comida llegó bien caliente.',
      likes: 5,
      isLiked: false
    },
    {
      id: 4,
      author: 'María Camila Rojas',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 3 semanas',
      verifiedPurchase: true,
      comment: 'Increíble servicio. Compré por la app pagando con Nequi y todo fue súper transparente y rápido. El patacón con ahogado y la mojarra estaban de 10. ¡100% recomendado!',
      likes: 11,
      isLiked: false
    }
  ],
  transporte: [
    {
      id: 1,
      author: 'Carlos Eduardo Peña',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Ayer',
      verifiedPurchase: true,
      comment: 'Conductor muy prudente y el vehículo impecable. Viajamos hacia Neiva ida y vuelta y todo salió perfecto. Muy puntual.',
      likes: 9,
      isLiked: false
    },
    {
      id: 2,
      author: 'Diana Marcela Torres',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 5 días',
      verifiedPurchase: true,
      comment: 'Excelente servicio hacia la represa de Betania. Precio justo acordado y amabilidad de primera.',
      likes: 6,
      isLiked: false
    },
    {
      id: 3,
      author: 'Héctor Fabio Charry',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
      rating: 4,
      date: 'Hace 2 semanas',
      verifiedPurchase: true,
      comment: 'Rápida respuesta por el chat de Servi-Go y llegó al punto en menos de 7 minutos.',
      likes: 3,
      isLiked: false
    }
  ],
  droguerias: [
    {
      id: 1,
      author: 'Lucía Fernández',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 3 días',
      verifiedPurchase: true,
      comment: 'Tenían exactamente los medicamentos recetados y el kit de primeros auxilios. El servicio a domicilio fue rapidísimo.',
      likes: 7,
      isLiked: false
    },
    {
      id: 2,
      author: 'Hernando Cuéllar',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 1 semana',
      verifiedPurchase: true,
      comment: 'Muy buena atención profesional en inyectología y toma de tensión. Muy higiénico todo.',
      likes: 4,
      isLiked: false
    }
  ],
  belleza: [
    { id: 1, author: 'Felipe Vargas', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120', rating: 5, date: 'Hace 3 días', verifiedPurchase: true, comment: 'Excelente estudio de tatuajes. El diseño me encantó, muy buena higiene y profesionalismo total. ¡Recomendadísimo!', likes: 25, isLiked: false },
    { id: 2, author: 'Sara Gómez', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120', rating: 5, date: 'Hace 1 semana', verifiedPurchase: true, comment: 'Me hice un tatuaje minimalista y quedó precioso. Las líneas súper definidas y cicatrizó perfecto.', likes: 12, isLiked: false }
  ],
  tecnologia: [
    { id: 1, author: 'Juan Pablo Ríos', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120', rating: 5, date: 'Ayer', verifiedPurchase: true, comment: 'Repararon la pantalla de mi celular rapidísimo y quedó como nuevo. Además, compré unos audífonos de excelente calidad.', likes: 18, isLiked: false },
    { id: 2, author: 'Laura Martínez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120', rating: 5, date: 'Hace 5 días', verifiedPurchase: true, comment: 'Compré un cargador original y me atendieron súper bien. Tienen gran variedad de accesorios.', likes: 9, isLiked: false }
  ],
  hoteles: [
    { id: 1, author: 'Mónica Castro', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120', rating: 5, date: 'Hace 2 semanas', verifiedPurchase: true, comment: 'Las habitaciones son muy cómodas y limpias. La atención del personal fue excelente durante todo nuestro hospedaje.', likes: 32, isLiked: false },
    { id: 2, author: 'Carlos Sánchez', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120', rating: 4, date: 'Hace 1 mes', verifiedPurchase: true, comment: 'Muy buena ubicación cerca del parque principal. El ambiente es tranquilo, ideal para descansar después de visitar la represa.', likes: 15, isLiked: false }
  ],
  panaderias: [
    { id: 1, author: 'Camila Osorio', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120', rating: 5, date: 'Hoy', verifiedPurchase: true, comment: 'El pan es siempre fresco y calientito. Los hojaldres son una delicia total, súper recomendados para el desayuno.', likes: 11, isLiked: false },
    { id: 2, author: 'David Muñoz', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120', rating: 5, date: 'Hace 3 días', verifiedPurchase: true, comment: 'Los mejores postres y tortas de Yaguará. Encargué una torta para un cumpleaños y estaba espectacular.', likes: 20, isLiked: false }
  ],
  comidas_rapidas: [
    { id: 1, author: 'Sebastián López', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120', rating: 5, date: 'Hace 2 días', verifiedPurchase: true, comment: '¡Las mejores hamburguesas artesanales! La carne súper jugosa y las salsas de la casa le dan el toque perfecto.', likes: 45, isLiked: false },
    { id: 2, author: 'Daniela Ramírez', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120', rating: 5, date: 'Hace 1 semana', verifiedPurchase: true, comment: 'El pedido por la app llegó rapidísimo y todo estaba bien caliente. Excelentes porciones, quedamos súper llenos.', likes: 28, isLiked: false }
  ],
  domicilios: [
    {
      id: 1,
      author: 'Natalia Ortiz',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hoy',
      verifiedPurchase: true,
      comment: 'Me recogió un paquete urgente y lo entregó en 15 minutos en el barrio El Carmen. Súper confiable.',
      likes: 12,
      isLiked: false
    },
    {
      id: 2,
      author: 'Oscar Monje',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 4 días',
      verifiedPurchase: true,
      comment: 'Hicieron una diligencia de pago en el banco y me enviaron la foto del comprobante inmediatamente. Excelente honestidad.',
      likes: 15,
      isLiked: false
    }
  ],
  acarreos: [
    {
      id: 1,
      author: 'Mauricio Dussán',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 4 días',
      verifiedPurchase: true,
      comment: 'Excelente mudanza. Llegaron con mantas para proteger los muebles y entre 3 muchachos subieron todo con mucho cuidado. Recomendadísimos.',
      likes: 18,
      isLiked: false
    },
    {
      id: 2,
      author: 'Gloria Inés Castro',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
      rating: 4,
      date: 'Hace 2 semanas',
      verifiedPurchase: true,
      comment: 'Puntuales y camioneta amplia. Cumplieron con el valor pactado y sin retrasos.',
      likes: 7,
      isLiked: false
    }
  ],
  maestros: [
    {
      id: 1,
      author: 'Guillermo Borrero',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 1 semana',
      verifiedPurchase: true,
      comment: 'Instalaron 45 m² de porcelanato en mi casa y el acabado quedó perfecto, bien nivelado y limpio. Muy responsable con los tiempos.',
      likes: 21,
      isLiked: false
    },
    {
      id: 2,
      author: 'Sonia Esperanza Trujillo',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 3 semanas',
      verifiedPurchase: true,
      comment: 'Repararon una humedad y pañete exterior. Gran conocimiento y cotización justa.',
      likes: 9,
      isLiked: false
    }
  ],
  electricistas: [
    {
      id: 1,
      author: 'Roberto Sterling',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 5 días',
      verifiedPurchase: true,
      comment: 'Solucionó un cortocircuito que nos dejó sin luz en la finca en media hora. Muy profesional y con herramientas adecuadas.',
      likes: 16,
      isLiked: false
    },
    {
      id: 2,
      author: 'Patricia Vargas',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
      rating: 5,
      date: 'Hace 2 semanas',
      verifiedPurchase: true,
      comment: 'Instalación de lámparas led y tomacorrientes en toda la casa. Todo funcionando impecable y seguro.',
      likes: 10,
      isLiked: false
    }
  ]
};

export default function ProviderProfileView() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const user = useAuthStore(state => state.user);
  
  // Find the requested business from the shared mock data
  const providerData = MOCK_BUSINESSES.find(b => b.id.toString() === id) || MOCK_BUSINESSES[0];

  const promotions = usePromotionsStore(state => state.promotions);
  const providerPromotions = promotions.filter(p => p.providerId === id && (Date.now() - p.createdAt) < 24 * 60 * 60 * 1000);

  useEffect(() => {
    if (location.hash) {
      const hashId = location.hash.replace('#', '');
      const element = document.getElementById(hashId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [location.hash]);
  
  // Enhance the basic mock data with profile-specific fields
  const provider = {
    ...providerData,
    fullAddress: providerData.address || `Dirección principal en ${providerData.location}`,
    dealsClosed: Math.floor(Math.random() * 500) + 50,
    responseTimeText: providerData.responseTime,
    products: providerData.products || DEFAULT_PRODUCTS,
    acceptedPayments: ['nequi', 'daviplata', 'bancos', 'efectivo']
  };

  const [activeTab, setActiveTab] = useState('menu');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Add isEditing state
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null); // Add state for gallery image expansion
  const [isFavorite, setIsFavorite] = useState(false); // State for favorite button

  // Business Availability from store
  const isBusinessOpen = useAvailabilityStore(state => state.isBusinessOpen(provider.id));
  const businessNote = useAvailabilityStore(state => state.getBusinessNote(provider.id));

  // Access Control
  // Para pruebas/demo, si el usuario es proveedor, dejamos que sea dueño de cualquier perfil que visite
  const isOwner = user?.role === 'provider';
  // Permitir comprar a cualquiera que no sea el dueño, y prohibir a administradores
  const canPurchase = !isOwner && user?.role !== 'admin';

  // Reviews State
  const initialCategoryReviews = DEFAULT_REVIEWS_BY_CATEGORY[providerData.categoryId] || DEFAULT_REVIEWS_BY_CATEGORY.comidas_tipicas;
  const [reviews, setReviews] = useState(initialCategoryReviews);
  const [filterStars, setFilterStars] = useState(0); // 0 = all

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Average Rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : provider.rating;

  // Star Distribution
  const starCounts = [5, 4, 3, 2, 1].map(starNum => {
    const count = reviews.filter(r => r.rating === starNum).length;
    const percent = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { stars: starNum, count, percent };
  });

  const filteredReviews = filterStars === 0 
    ? reviews 
    : reviews.filter(r => r.rating === filterStars);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newReviewItem = {
        id: Date.now(),
        author: user?.name || 'Cliente Verificado',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        rating: newRating,
        date: 'Justo ahora',
        verifiedPurchase: true,
        comment: newComment.trim(),
        likes: 0,
        isLiked: false
      };

      setReviews([newReviewItem, ...reviews]);
      setNewComment('');
      setNewRating(5);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
    }, 400);
  };

  const handleToggleLike = (reviewId) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          likes: r.isLiked ? r.likes - 1 : r.likes + 1,
          isLiked: !r.isLiked
        };
      }
      return r;
    }));
  };

  if (isOwner && isEditing) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative pb-24">
        <div className="flex justify-between items-center mb-2 px-4 sm:px-0">
          <button 
            onClick={() => setIsEditing(false)}
            className="flex items-center space-x-2 text-sm font-bold text-gray-300 hover:text-white bg-[#222] px-4 py-2 rounded-full border border-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a vista de cliente</span>
          </button>
        </div>
        <ProviderDashboard provider={provider} />
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative pb-24">
      {/* Top Actions */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-sm font-bold text-gray-300 hover:text-white bg-[#222] px-4 py-2 rounded-full border border-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          
          {canPurchase && (
            <button 
              onClick={() => useAppStore.getState().setActiveChat({ ...provider, openSalesBot: true })}
              className="flex items-center space-x-2 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:opacity-95 px-4 py-2 rounded-full border border-white/20 shadow-lg shadow-[#ff6b00]/25 transition-all gap-1.5"
            >
              <Bot className="w-4 h-4" />
              <span>Comprar con Asistente IA 24/7</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isOwner && (
            <>
              <button 
                onClick={() => setIsInboxOpen(true)}
                className="flex items-center space-x-1.5 text-xs sm:text-sm font-extrabold text-white bg-[#00c853] hover:bg-[#00e676] px-3.5 py-2 rounded-full border border-green-500/30 shadow-md transition-all gap-1"
                title="Bandeja de mensajes de clientes"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Inbox Clientes</span>
              </button>
              <button 
                onClick={() => setIsAvailabilityModalOpen(true)}
                className="flex items-center space-x-1.5 text-xs sm:text-sm font-extrabold text-[#ff6b00] bg-[#ff6b00]/10 hover:bg-[#ff6b00]/20 px-3.5 py-2 rounded-full border border-[#ff6b00]/30 shadow-md transition-all gap-1"
                title="Configurar si el negocio está disponible hoy y disponibilidad de platos o artículos"
              >
                <Power className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disponibilidad & Stock</span>
                <span className="sm:hidden">Stock</span>
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1.5 text-xs sm:text-sm font-extrabold text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 px-3.5 py-2 rounded-full border border-blue-400/30 shadow-md transition-all gap-1"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Mi Panel (Promociones)</span>
              </button>
            </>
          )}
          <button onClick={() => setIsQrModalOpen(true)} className="flex items-center space-x-2 text-sm font-bold text-[#ff6b00] bg-[#ff6b00]/10 px-4 py-2 rounded-full border border-[#ff6b00]/20 hover:bg-[#ff6b00]/20 transition-colors">
            <QrCode className="w-4 h-4" />
            <span>QR</span>
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all ${
              isFavorite 
                ? 'bg-[#ff0055] text-white border border-[#ff0055]' 
                : 'bg-[#151515] text-gray-400 border border-white/20 hover:border-[#ff0055]/50 hover:text-[#ff0055]'
            }`}
            title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-[#151515] rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative">
        {/* Banner Area */}
        <div className="relative w-full bg-[#111] overflow-hidden min-h-[350px] max-h-[520px] flex items-center justify-center">
          <img 
            src={provider.bannerImage || provider.image} 
            alt="Banner" 
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${provider.id}/1200/400`; }}
            className="w-full h-full object-cover object-top block" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/20 to-transparent pointer-events-none"></div>
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white border border-white/10 px-3.5 py-1.5 rounded-full flex items-center space-x-2 text-xs font-bold shadow-md">
            <span className={`w-2.5 h-2.5 rounded-full ${isBusinessOpen ? 'bg-green-400 animate-ping' : 'bg-red-500'}`}></span>
            <span>{isBusinessOpen ? 'Atendiendo Hoy' : 'No Disponible Hoy / Cerrado'}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 md:px-8 pb-8 relative z-10">
          
          {/* Avatar and Title Row */}
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-20 md:-mt-24 mb-6 relative">
            <img 
              src={provider.avatar} 
              alt="Avatar" 
              onError={(e) => { e.target.src = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`; }}
              className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-[#151515] object-cover bg-[#222] shadow-xl z-20"
            />
            <div className="flex-1 mt-4 md:mt-0 z-20">
              <h1 className="text-3xl font-bold text-white leading-tight mb-2">
                {provider.name}
              </h1>
              <div className="flex items-center flex-wrap gap-2 text-sm">
                {provider.verified && (
                  <div className="flex items-center px-2 py-0.5 rounded-full bg-[#cc9900]/20 border border-[#cc9900]/40 text-[#ffcc00] font-bold uppercase tracking-wider text-[10px]">
                    <ShieldCheck className="w-3 h-3 mr-1 fill-[#ffcc00] text-black" />
                    Verificado
                  </div>
                )}
                <span className="text-gray-400 font-medium">{provider.category} • {provider.location}</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="flex space-x-3 z-20">
              <button 
                type="button"
                onClick={() => setActiveTab('reviews')}
                className="bg-black/50 hover:bg-black/80 border border-[#ffcc00]/30 hover:border-[#ffcc00] rounded-2xl p-3 flex flex-col items-center justify-center min-w-[95px] transition-all cursor-pointer group"
                title="Ver reseñas y calificaciones"
              >
                <div className="flex items-center space-x-1 text-[#ffcc00] font-bold text-lg group-hover:scale-105 transition-transform">
                  <Star className="w-4 h-4 fill-[#ffcc00]" />
                  <span>{averageRating}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium underline decoration-dotted">
                  ({reviews.length} opiniones)
                </span>
              </button>
              
              <div className="bg-[#ff6b00]/10 border border-[#ff6b00]/30 rounded-2xl p-3 flex flex-col items-center justify-center min-w-[90px]">
                <div className="flex items-center space-x-1 text-[#ff6b00] font-bold text-lg">
                  <Zap className="w-4 h-4 fill-[#ff6b00]" />
                  <span>{provider.responseTime}</span>
                </div>
                <span className="text-[10px] text-[#ff6b00]/70">{provider.responseTimeText}</span>
              </div>

              <div className="bg-black/50 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center min-w-[90px]">
                <span className="text-white font-bold text-lg">{provider.dealsClosed}</span>
                <span className="text-[10px] text-gray-500">Tratos cerrados</span>
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-4xl">
            {provider.description}
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between flex-1 gap-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                <span className="text-sm text-gray-400"><span className="text-gray-300 font-medium">Ubicación:</span> {provider.fullAddress}</span>
              </div>
              <button 
                onClick={() => navigate('/map')}
                className="flex-shrink-0 bg-[#ff6b00]/10 hover:bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/30 font-bold text-[10px] sm:text-xs px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                title="Abrir mapa interactivo"
              >
                <Map className="w-4 h-4" />
                <span className="hidden sm:inline">Ver en mapa</span>
              </button>
            </div>
            
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-center flex-1">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3 block">Medios de Pago Aceptados</span>
              <div className="flex flex-wrap gap-3">
                {provider.acceptedPayments?.includes('nequi') && (
                  <div className="bg-[#190445] border border-[#400B96] px-3 py-2 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                    <img src="https://cdn.worldvectorlogo.com/logos/nequi.svg" alt="Nequi" className="h-4 object-contain brightness-0 invert" style={{ minWidth: '60px' }} />
                  </div>
                )}
                {provider.acceptedPayments?.includes('daviplata') && (
                  <div className="bg-white border-2 border-[#ED1C24] px-3 py-2 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                    <img src="https://cdn.worldvectorlogo.com/logos/daviplata.svg" alt="Daviplata" className="h-4 object-contain" style={{ minWidth: '70px' }} />
                  </div>
                )}
                {provider.acceptedPayments?.includes('bancos') && (
                  <div className="bg-[#1a1f2e] border border-blue-500/30 px-3 py-2 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 object-contain" />
                    <span className="text-gray-200 text-xs font-bold tracking-wide">Bancos</span>
                  </div>
                )}
                {provider.acceptedPayments?.includes('efectivo') && (
                  <div className="bg-gradient-to-r from-green-600 to-emerald-500 border border-green-400 px-3 py-2 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105">
                    <span className="text-lg leading-none drop-shadow-sm">💵</span>
                    <span className="text-white text-xs font-bold tracking-wide drop-shadow-md">Efectivo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Unavailable Business Notice Banner */}
        {!isBusinessOpen && (
          <div className="mx-6 md:mx-8 mb-6 bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start space-x-3 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-xs text-red-400 block uppercase tracking-wider">
                Comercio no disponible por el día de hoy
              </span>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                {businessNote || 'Este comercio o prestador ha pausado la atención hoy. Puedes consultar su catálogo o dejar un mensaje en el chat para cuando reanude servicio.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Active Promotions */}
      {providerPromotions.length > 0 && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-[#ff6b00]/20 p-2 rounded-full">
               <Megaphone className="w-5 h-5 text-[#ff6b00]" />
             </div>
             <h3 className="text-xl font-black text-white tracking-tight">Promociones Activas (24h)</h3>
          </div>
          <div className="flex flex-col gap-4">
            {providerPromotions.map(promo => (
              <div id={promo.id} key={promo.id} className={`w-full bg-gradient-to-br ${promo.color} p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between shadow-2xl border-[3px] border-white/10 relative overflow-hidden group animate-neon-pulse`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
                
                <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full">
                  <img src={promo.image} className="w-32 h-32 rounded-2xl object-cover shadow-2xl border-4 border-white/20 bg-black/50" alt="promo" />
                  
                  <div className="text-white text-center md:text-left flex-1">
                    <h4 className="font-black text-3xl leading-none mb-3 drop-shadow-md">{promo.title}</h4>
                    <p className="text-sm text-white/90 leading-relaxed font-medium drop-shadow-sm mb-4 max-w-lg">{promo.description}</p>
                    <div className="text-xs font-bold bg-white text-black px-3 py-1.5 rounded-full inline-flex items-center gap-1 shadow-md">
                      ⏱️ Quedan {Math.max(0, 24 - Math.floor((Date.now() - promo.createdAt)/(1000*60*60)))}h
                    </div>
                  </div>
                  
                  {canPurchase && (
                    <div className="mt-4 md:mt-0 flex-shrink-0 relative z-10">
                      <button 
                        onClick={() => useAppStore.getState().setActiveChat({ ...provider, openSalesBot: true, prefilledMessage: `¡Hola! Vengo por la promoción: ${promo.title}` })}
                        className="bg-white text-black hover:bg-gray-100 font-extrabold px-6 py-4 rounded-2xl shadow-xl flex items-center gap-2 transition-transform hover:scale-105"
                      >
                        <Bot className="w-5 h-5" /> ¡Lo quiero!
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-white/5 pb-1 mt-4">
        <button 
          onClick={() => setActiveTab('menu')}
          className={`flex items-center space-x-2 pb-3 border-b-2 font-bold text-sm transition-all ${activeTab === 'menu' ? 'text-[#ffcc00] border-[#ffcc00]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
        >
          <div className={`px-4 py-1.5 rounded-full ${activeTab === 'menu' ? 'bg-[#ffcc00] text-black' : ''}`}>
            {provider.categoryId === 'comidas_tipicas' 
              ? 'Menú y Platos' 
              : provider.type === 'commerce' 
                ? 'Catálogo de Productos' 
                : 'Perfil de Servicios'} ({provider.products.length})
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center space-x-2 pb-3 border-b-2 font-bold text-sm transition-all ${activeTab === 'reviews' ? 'text-[#ff6b00] border-[#ff6b00]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
        >
          <div className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 ${activeTab === 'reviews' ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25' : ''}`}>
            <Star className={`w-3.5 h-3.5 ${activeTab === 'reviews' ? 'fill-white' : 'fill-[#ffcc00] text-[#ffcc00]'}`} />
            <span>Reseñas & Calificaciones ({reviews.length})</span>
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center space-x-2 pb-3 border-b-2 font-bold text-sm transition-all ${activeTab === 'gallery' ? 'text-[#ff6b00] border-[#ff6b00]' : 'text-gray-500 border-transparent hover:text-gray-300'}`}
        >
          <div className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 ${activeTab === 'gallery' ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/25' : ''}`}>
            <span>📸</span>
            <span>Galería ({provider.gallery?.length || 0})</span>
          </div>
        </button>
      </div>

      {/* Content: Products Tab */}
      {activeTab === 'menu' && (
        <div className="animate-in fade-in duration-300">
          {isOwner && (
            <div className="mb-4 flex justify-end">
              <button 
                onClick={() => alert('Función de añadir producto en construcción. Próximamente podrás subir fotos y descripciones de nuevos productos.')}
                className="bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 font-bold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
              >
                <span>+ Añadir Producto / Servicio</span>
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {provider.products.map(product => (
              <ProductCard key={product.id} product={product} provider={provider} isOwner={isOwner} canPurchase={canPurchase} />
            ))}
          </div>
        </div>
      )}

      {/* Content: Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {provider.gallery && provider.gallery.length > 0 ? provider.gallery.map((img, i) => (
              <div key={i} onClick={() => setSelectedGalleryImage(img)} className="aspect-square rounded-2xl overflow-hidden bg-[#222] border border-white/10 shadow-lg group relative cursor-pointer">
                <img src={img} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt={`Galería ${i+1}`} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold bg-black/50 px-3 py-1 rounded-full border border-white/20 text-xs">Ver foto</span>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12 bg-[#151515] rounded-3xl border border-white/5">
                <span className="text-4xl block mb-2">📸</span>
                <h3 className="text-xl font-bold text-white mb-1">Sin fotos</h3>
                <p className="text-gray-400">Este negocio aún no ha subido fotos a su galería.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Content: Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Summary Ratings Hero Box */}
          <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Overall Score */}
              <div className="text-center md:border-r border-white/10 pr-0 md:pr-6">
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tight block">
                  {averageRating}
                </span>
                <div className="flex justify-center items-center space-x-1 my-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-5 h-5 ${s <= Math.round(Number(averageRating)) ? 'text-[#ffcc00] fill-[#ffcc00]' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 font-medium">
                  Basado en <span className="text-white font-bold">{reviews.length} opiniones</span> verificadas
                </p>
                <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Compradores Verificados
                </div>
              </div>

              {/* Star Breakdown Bars */}
              <div className="space-y-2 md:col-span-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                  Distribución de Calificaciones en Yaguará:
                </span>
                {starCounts.map(({ stars, count, percent }) => (
                  <div key={stars} className="flex items-center space-x-3 text-xs">
                    <div className="flex items-center space-x-1 w-14 text-gray-300 font-medium flex-shrink-0">
                      <span>{stars}</span>
                      <Star className="w-3.5 h-3.5 text-[#ffcc00] fill-[#ffcc00]" />
                    </div>
                    <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#ffcc00] to-[#ff6b00] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right text-gray-500 font-mono text-[11px]">
                      {count} ({percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Filter Badges */}
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#ff6b00]" /> Filtrar:
              </span>
              <button
                type="button"
                onClick={() => setFilterStars(0)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                  filterStars === 0 
                    ? 'bg-[#ff6b00] text-white border-[#ff6b00]' 
                    : 'bg-[#1f1f24] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                Todas ({reviews.length})
              </button>
              {[5, 4, 3, 2, 1].map(s => {
                const count = reviews.filter(r => r.rating === s).length;
                if (count === 0) return null;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilterStars(s)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 ${
                      filterStars === s 
                        ? 'bg-[#ff6b00] text-white border-[#ff6b00]' 
                        : 'bg-[#1f1f24] text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    <span>{s}</span>
                    <Star className="w-3 h-3 fill-current" />
                    <span>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario para Agregar Reseña */}
          <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#ff6b00]/20 flex items-center justify-center text-[#ff6b00]">
                <MessageSquarePlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  ¿Has comprado o recibido atención de {provider.name}?
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Comparte tu experiencia para ayudar a más vecinos y visitantes de Yaguará
                </p>
              </div>
            </div>

            {submitSuccess && (
              <div className="mb-4 p-3.5 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ¡Muchas gracias! Tu reseña y calificación han sido publicadas exitosamente.
              </div>
            )}

            <form onSubmit={handleAddReview} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Tu Calificación:
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setNewRating(starVal)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star 
                        className={`w-7 h-7 ${starVal <= newRating ? 'text-[#ffcc00] fill-[#ffcc00]' : 'text-gray-600 hover:text-gray-400'}`} 
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-[#ffcc00] bg-[#ffcc00]/10 px-2.5 py-1 rounded-lg border border-[#ffcc00]/20">
                    {newRating === 5 && '¡Excelente servicio! (5/5)'}
                    {newRating === 4 && 'Muy buen servicio (4/5)'}
                    {newRating === 3 && 'Servicio regular (3/5)'}
                    {newRating === 2 && 'Mala experiencia (2/5)'}
                    {newRating === 1 && 'Pésimo servicio (1/5)'}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Tu Opinión o Reseña:
                </label>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Cuéntanos cómo te pareció la calidad del producto/servicio, la puntualidad, la atención y el empaque..."
                  className="w-full bg-[#202024] border border-white/10 rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00] focus:ring-1 focus:ring-[#ff6b00]/30 transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Publicarás como: <strong className="text-gray-200">{user?.name || 'Carlos Mendoza'}</strong>
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-[#ff6b00]/25 flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Publicando...' : 'Publicar Mi Reseña'}
                </button>
              </div>
            </form>
          </div>

          {/* List of Reviews */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#ff6b00]" />
                Opiniones de Clientes ({filteredReviews.length})
              </h3>
              <span className="text-xs text-gray-500">
                Ordenadas por más recientes
              </span>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="bg-[#151515] border border-white/5 rounded-3xl p-10 text-center text-gray-500">
                No hay reseñas que coincidan con el filtro seleccionado.
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-[#151515] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-3.5 hover:border-white/20 transition-colors shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={rev.avatar} 
                        alt={rev.author}
                        onError={(e) => { e.target.src = `https://i.pravatar.cc/100?img=${(rev.id % 60) + 1}`; }}
                        className="w-11 h-11 rounded-2xl object-cover border border-white/10 bg-[#222]" 
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm block">
                            {rev.author}
                          </span>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                              <ShieldCheck className="w-3 h-3 mr-1" /> Compra Verificada
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 block mt-0.5">
                          {rev.date}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center space-x-1 bg-[#1c1c22] border border-white/10 px-2.5 py-1 rounded-xl flex-shrink-0">
                      <Star className="w-3.5 h-3.5 text-[#ffcc00] fill-[#ffcc00]" />
                      <span className="text-xs font-black text-white">{rev.rating}.0</span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pl-1">
                    "{rev.comment}"
                  </p>

                  {/* Footer Actions */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <span className="text-[11px]">Experiencia certificada en Yaguará</span>
                    <button
                      type="button"
                      onClick={() => handleToggleLike(rev.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border transition-all text-xs font-semibold ${
                        rev.isLiked 
                          ? 'bg-[#ff6b00]/10 border-[#ff6b00]/30 text-[#ff6b00]' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${rev.isLiked ? 'fill-current' : ''}`} />
                      <span>{rev.likes > 0 ? `Útil (${rev.likes})` : '¿Te fue útil?'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151515] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white/10 relative text-center">
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ff6b00]/20 flex items-center justify-center">
              <QrCode className="w-8 h-8 text-[#ff6b00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Compartir Perfil</h3>
            <p className="text-sm text-gray-400 mb-6">Escanea este código para acceder directamente al catálogo de {provider.name}.</p>
            <div className="bg-white p-4 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://servigo.com/provider/${provider.id}`} alt="QR Code" className="w-full h-full" />
            </div>
          </div>
        </div>
      )}

      {/* Availability Manager Modal */}
      <AvailabilityManagerModal
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
        provider={provider}
      />

      <ProviderInboxModal 
        isOpen={isInboxOpen} 
        onClose={() => setIsInboxOpen(false)} 
        providerName={provider.name}
      />

      {/* Image Expansion Modal */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in p-4 sm:p-8" onClick={() => setSelectedGalleryImage(null)}>
          <button 
            onClick={() => setSelectedGalleryImage(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20 shadow-2xl z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedGalleryImage} 
              alt="Expanded view" 
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
