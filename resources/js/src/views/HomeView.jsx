import React, { useState } from 'react';
import { 
  Utensils, 
  Coffee, 
  Zap, 
  Wrench, 
  Store, 
  ShieldCheck, 
  Plus, 
  Truck, 
  Pill, 
  Bike, 
  Package, 
  HardHat, 
  Megaphone, 
  ChevronDown, 
  List, 
  LayoutGrid, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Navigation, 
  Map as MapIcon, 
  MapPin, 
  Target,
  PenTool,
  Hotel,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  X,
  Filter,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import usePromotionsStore from '../store/usePromotionsStore';
import BusinessCard from '../components/BusinessCard';
import InteractiveMap from '../components/InteractiveMap';
import PromotionCheckoutModal from '../components/PromotionCheckoutModal';
import BusinessAdBanner from '../components/BusinessAdBanner';
import { MOCK_BUSINESSES } from '../data/mockData';

const CATEGORIES = [
  { id: 'all', label: 'Todos los Rubros', icon: <List className="w-4 h-4 mr-1.5" /> },
  { id: 'comidas_rapidas', label: 'Comidas Rápidas', icon: <Utensils className="w-4 h-4 mr-1.5" /> },
  { id: 'comidas_tipicas', label: 'Comidas Típicas & Quesillos', icon: <Utensils className="w-4 h-4 mr-1.5" /> },
  { id: 'tecnologia', label: 'Tecnología y Telefonía', icon: <Zap className="w-4 h-4 mr-1.5" /> },
  { id: 'belleza', label: 'Belleza, Barbería & Spa', icon: <Coffee className="w-4 h-4 mr-1.5" /> },
  { id: 'hoteles', label: 'Hoteles & Hospedaje', icon: <Hotel className="w-4 h-4 mr-1.5" /> },
  { id: 'supermercados', label: 'Supermercados & Víveres', icon: <Store className="w-4 h-4 mr-1.5" /> },
  { id: 'ferreteria', label: 'Ferretería & Construcción', icon: <HardHat className="w-4 h-4 mr-1.5" /> },
  { id: 'veterinaria', label: 'Veterinaria & Mascotas', icon: <Sparkles className="w-4 h-4 mr-1.5" /> },
  { id: 'panaderias', label: 'Panaderías & Pastelería', icon: <Coffee className="w-4 h-4 mr-1.5" /> },
  { id: 'transporte', label: 'Transporte Público', icon: <Truck className="w-4 h-4 mr-1.5" /> },
  { id: 'droguerias', label: 'Droguerías', icon: <Pill className="w-4 h-4 mr-1.5" /> },
  { id: 'domicilios', label: 'Mensajería & Domicilios', icon: <Bike className="w-4 h-4 mr-1.5" /> },
  { id: 'acarreos', label: 'Acarreos y Mudanzas', icon: <Package className="w-4 h-4 mr-1.5" /> },
  { id: 'electricistas', label: 'Electricistas', icon: <Zap className="w-4 h-4 mr-1.5" /> },
  { id: 'maestros', label: 'Maestros de Obra', icon: <HardHat className="w-4 h-4 mr-1.5" /> }
];

export default function HomeView() {
  const { location, searchQuery, businessType, setBusinessType, selectedCategory, setSelectedCategory } = useAppStore();
  const [showMap, setShowMap] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [isPromoCheckoutOpen, setIsPromoCheckoutOpen] = useState(false);
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false);
  const [isDirFilterOpen, setIsDirFilterOpen] = useState(false);
  const [apiBusinesses, setApiBusinesses] = useState([]);

  // Fetch businesses from Laravel MySQL API on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/businesses')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setApiBusinesses(data);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const businessList = apiBusinesses.length > 0 ? apiBusinesses : MOCK_BUSINESSES;

  const activeCategory = selectedCategory || 'all';

  const isServiceActive = businessType === 'services' || businessType === 'service';
  const isCommerceActive = businessType === 'commerce' || businessType === 'comercios' || businessType === 'comercio';

  // Counts of total, services and commerce
  const totalCount = businessList.length;
  const servicesCount = businessList.filter(b => b.type === 'service' || b.type === 'services').length;
  const commerceCount = businessList.filter(b => b.type === 'commerce' || b.type === 'comercios').length;

  // Handle switching business type, resetting selected category if it doesn't exist in the new type
  const handleTypeChange = (newType) => {
    setBusinessType(newType);
    setIsDirFilterOpen(false);

    if (selectedCategory && selectedCategory !== 'all') {
      const isNewService = newType === 'services' || newType === 'service';
      const isNewCommerce = newType === 'commerce' || newType === 'comercios' || newType === 'comercio';

      const isValidInNewType = businessList.some(b => {
        if (isNewService && b.type !== 'service') return false;
        if (isNewCommerce && b.type !== 'commerce') return false;
        return b.categoryId === selectedCategory;
      });

      if (!isValidInNewType) {
        setSelectedCategory(null);
      }
    }
  };

  // Get count for a specific category within the current businessType scope
  const getCategoryCount = (catId) => {
    if (catId === 'all') {
      if (isServiceActive) return servicesCount;
      if (isCommerceActive) return commerceCount;
      return totalCount;
    }
    return businessList.filter(b => {
      if (isServiceActive && b.type !== 'service') return false;
      if (isCommerceActive && b.type !== 'commerce') return false;
      return b.categoryId === catId;
    }).length;
  };

  // Dynamically filter categories based on businessType:
  // When services: only categories with service businesses
  // When commerce: only categories with commerce businesses
  // When all: only categories with businesses
  const availableCategories = CATEGORIES.filter(cat => {
    if (cat.id === 'all') return true;
    return getCategoryCount(cat.id) > 0;
  });

  const filteredBusinesses = businessList.filter(business => {
    // 1. Category match
    const matchCategory = activeCategory === 'all' || business.categoryId === activeCategory;

    // 2. Strict Type match:
    let matchType = true;
    if (isServiceActive) {
      matchType = business.type === 'service';
    } else if (isCommerceActive) {
      matchType = business.type === 'commerce';
    } else if (businessType && businessType !== 'all') {
      matchType = business.type === businessType;
    }

    // 3. Verified filter
    const matchVerified = !onlyVerified || business.verified;

    // 4. Search query filter
    const q = (searchQuery || '').trim().toLowerCase();
    const matchSearch = !q || 
      business.name?.toLowerCase().includes(q) ||
      business.description?.toLowerCase().includes(q) ||
      business.category?.toLowerCase().includes(q) ||
      (business.highlights && business.highlights.some(h => h.toLowerCase().includes(q))) ||
      (business.products && business.products.some(p => p.name?.toLowerCase().includes(q)));

    return matchCategory && matchType && matchVerified && matchSearch;
  });

  // Calculate the closest business
  let closestBusinessId = null;
  if (activeCategory !== 'all' && filteredBusinesses.length > 0) {
    const closest = filteredBusinesses.reduce((prev, curr) => {
      const prevDist = parseFloat(prev.distance) || 999;
      const currDist = parseFloat(curr.distance) || 999;
      return (currDist < prevDist) ? curr : prev;
    });
    closestBusinessId = closest.id;
  }

  const promotions = usePromotionsStore(state => state.promotions);
  const activePromotions = promotions.filter(p => (Date.now() - p.createdAt) < 24 * 60 * 60 * 1000);

  const renderPromoIcon = (iconName) => {
    switch (iconName) {
      case 'PenTool':
        return <PenTool className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />;
      case 'Utensils':
        return <Utensils className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />;
      case 'Hotel':
        return <Hotel className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />;
      default:
        return <Wrench className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Search Header Container (Iglesia de Yaguará Hero) */}
      <div className="relative rounded-[2rem] overflow-hidden bg-[#090d16] border border-white/10 shadow-2xl group min-h-[340px] flex items-center">
        
        {/* Background Church Image & Smooth Transition */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Parque Principal de Yaguará image on the right */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-full md:w-[62%] lg:w-[56%] bg-cover bg-[position:75%_center] sm:bg-[position:70%_center] transition-transform duration-1000 group-hover:scale-105"
            style={{ 
              backgroundImage: "url('/images/parque_yaguara.jpg')",
            }}
          />

          {/* Smooth dark gradient overlay from left to blend with church */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090d16] via-[#090d16]/95 md:via-[#090d16]/85 to-transparent w-full md:w-[68%]" />
          
          {/* Subtle top and bottom dark vignetting */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d16]/70 via-transparent to-[#090d16]/50 pointer-events-none" />

          {/* Angled curved separator with smooth blur */}
          <div className="hidden md:block absolute -top-16 -bottom-16 left-[46%] w-28 bg-gradient-to-r from-[#090d16] to-transparent transform -skew-x-12 pointer-events-none blur-[2px]" />
          <div className="hidden md:block absolute -top-16 bottom-0 left-[50%] w-[1.5px] bg-gradient-to-b from-transparent via-[#ff6b00]/30 to-transparent transform -skew-x-12 blur-[1px] pointer-events-none" />
        </div>

        <div className="relative z-10 p-6 md:p-10 lg:p-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 w-full">
          <div className="max-w-3xl">
            {/* Tag / Subheading */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-[#ff6b00] fill-[#ff6b00]" />
              <h4 className="text-[#ff6b00] font-bold text-xs tracking-[0.2em] uppercase">
                Descubre, apoya y conecta
              </h4>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white mb-3 leading-tight tracking-tight">
              Servicios y comercios locales en <span className="text-[#ff6b00]">{location === 'Todo Huila' ? 'el Huila' : location}</span>
            </h1>

            {/* Description */}
            <p className="text-zinc-300 text-sm sm:text-[15px] max-w-xl leading-relaxed font-normal">
              Encuentra lo que necesitas, apoya el talento local y disfruta de las mejores ofertas en un solo lugar.
            </p>
          </div>

          {/* Register Business CTA Button */}
          <div className="flex-shrink-0 w-full lg:w-auto flex justify-start lg:justify-end">
            <Link 
              to="/register-business" 
              className="w-full sm:w-auto flex justify-center items-center gap-2.5 bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:from-[#ff7700] hover:to-[#ff5500] hover:scale-105 transition-all duration-300 text-white font-bold py-3.5 px-7 rounded-full shadow-[0_4px_25px_rgba(255,107,0,0.45)] whitespace-nowrap text-sm sm:text-base"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" /> 
              <span>Registrar mi negocio</span>
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Business Ad Banner (Vitrina Comercial Servi-Go) */}
      <BusinessAdBanner onOpenPromoModal={() => setIsPromoCheckoutOpen(true)} />

      {/* Promociones destacadas Section */}
      {activePromotions.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Megaphone className="w-6 h-6 text-[#ff6b00]" strokeWidth={2.5} />
              <h3 className="text-2xl font-black text-white tracking-tight">
                Promociones destacadas
              </h3>
              <span className="inline-flex items-center gap-1.5 bg-[#ff6b00]/10 text-[#ff6b00] text-xs font-bold px-3 py-1 rounded-full border border-[#ff6b00]/30">
                <Clock className="w-3.5 h-3.5" /> Por tiempo limitado
              </span>
            </div>

            {/* Action Buttons & Navigation */}
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setIsPromoCheckoutOpen(true)}
                className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:from-[#ff7700] hover:to-[#ff5500] px-4 py-2 rounded-full shadow-[0_2px_12px_rgba(255,107,0,0.35)] transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pautar mi negocio ($10.000 / 24h)</span>
              </button>

              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#131b26] hover:bg-[#1a2433] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  title="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#131b26] hover:bg-[#1a2433] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  title="Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activePromotions.map(promo => (
              <Link 
                to={`/provider/${promo.providerId}#${promo.id}`} 
                key={promo.id} 
                className={`relative rounded-[1.75rem] overflow-hidden p-6 bg-gradient-to-br ${promo.color} border ${promo.border || 'border-white/10'} shadow-xl flex items-center justify-between group hover:scale-[1.02] transition-transform duration-200 min-h-[235px]`}
              >
                {/* Left Content */}
                <div className="relative z-10 w-[58%] pr-2 flex flex-col justify-between h-full">
                  <div>
                    {/* Tag badge */}
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-2.5 bg-black/35 backdrop-blur-sm px-3 py-1 rounded-full border border-white/15 text-white">
                      {renderPromoIcon(promo.categoryIcon)}
                      <span>{promo.providerName}</span>
                    </div>

                    {/* Title */}
                    <h4 className="font-black text-xl leading-tight mb-2 text-white drop-shadow-md">
                      {promo.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-white/90 leading-relaxed font-normal mb-4">
                      {promo.description}
                    </p>
                  </div>

                  {/* Time Badge */}
                  <div>
                    <div className="text-xs font-bold bg-white text-zinc-950 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md">
                      <Clock className="w-3.5 h-3.5 text-zinc-950" />
                      <span>Quedan {promo.daysLeft || 2} {promo.daysLeft === 1 ? 'día' : 'días'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Image with Smooth Gradient Mask */}
                <div className="absolute right-0 top-0 bottom-0 w-[48%] pointer-events-none overflow-hidden">
                  <img 
                    src={promo.image} 
                    alt={promo.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    style={{
                      maskImage: 'linear-gradient(to right, transparent 0%, black 35%)',
                      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%)'
                    }} 
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Directorio en mapa Section */}
      <div className="w-full">
        <div className="relative w-full rounded-[1.75rem] border border-white/[0.08] overflow-hidden bg-[#090e16] min-h-[170px] flex items-stretch shadow-2xl">
           
           {/* Detailed Realistic Blueprint / Night Map Vector Background */}
           <div className="absolute inset-0 z-0 pointer-events-none">
              <svg 
                className="w-full h-full opacity-70"
                viewBox="0 0 1200 320" 
                preserveAspectRatio="none"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Map Grid Roads (Thin Slate) */}
                <g stroke="#131e2d" strokeWidth="1.5" opacity="0.6">
                  {/* Horizontal Roads */}
                  <line x1="0" y1="40" x2="1200" y2="40" />
                  <line x1="0" y1="90" x2="1200" y2="90" />
                  <line x1="0" y1="140" x2="1200" y2="140" />
                  <line x1="0" y1="190" x2="1200" y2="190" />
                  <line x1="0" y1="240" x2="1200" y2="240" />
                  <line x1="0" y1="290" x2="1200" y2="290" />
                  {/* Vertical Roads */}
                  <line x1="100" y1="0" x2="100" y2="320" />
                  <line x1="220" y1="0" x2="220" y2="320" />
                  <line x1="340" y1="0" x2="340" y2="320" />
                  <line x1="460" y1="0" x2="460" y2="320" />
                  <line x1="580" y1="0" x2="580" y2="320" />
                  <line x1="700" y1="0" x2="700" y2="320" />
                  <line x1="820" y1="0" x2="820" y2="320" />
                  <line x1="940" y1="0" x2="940" y2="320" />
                  <line x1="1060" y1="0" x2="1060" y2="320" />
                </g>

                {/* Major Arterial Roads (Angled & Curved) */}
                <g stroke="#1d2c40" strokeWidth="2.5" opacity="0.8">
                  <path d="M0,80 Q250,120 500,70 T1000,110 T1200,90" fill="none" />
                  <path d="M0,230 Q300,180 600,220 T1100,190 T1200,200" fill="none" />
                  <path d="M200,0 L420,180 L520,320" fill="none" />
                  <path d="M780,0 L660,160 L800,320" fill="none" />
                  <path d="M920,0 L880,180 L1020,320" fill="none" />
                </g>

                {/* Winding Blue River */}
                <path 
                  d="M620,-20 C640,60 580,120 570,180 C560,240 600,280 640,340" 
                  stroke="#023b6b" 
                  strokeWidth="26" 
                  strokeLinecap="round" 
                  fill="none" 
                />
                <path 
                  d="M620,-20 C640,60 580,120 570,180 C560,240 600,280 640,340" 
                  stroke="#0284c7" 
                  strokeWidth="14" 
                  strokeLinecap="round" 
                  fill="none" 
                />
                <path 
                  d="M620,-20 C640,60 580,120 570,180 C560,240 600,280 640,340" 
                  stroke="#38bdf8" 
                  strokeWidth="4" 
                  strokeLinecap="round" 
                  opacity="0.7"
                  fill="none" 
                />
              </svg>
              
              {/* Radial gradient vignette to keep text readable */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#090e16] via-[#090e16]/80 to-transparent w-[45%]" />
              <div className="absolute inset-0 bg-gradient-to-l from-[#090e16] via-transparent to-transparent w-[30%]" />
              
              {/* Glowing Pin 1 (Top Left-Center) */}
              <div className="absolute top-[32%] left-[48%] -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-6 h-6 text-[#ff6b00] drop-shadow-[0_0_8px_rgba(255,107,0,0.85)]">
                  <MapPin className="w-full h-full fill-[#ff6b00]" stroke="none" />
                  <div className="absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-white rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#ff6b00] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Glowing Pin 2 (Bottom Left) */}
              <div className="absolute top-[86%] left-[38%] -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-6 h-6 text-[#ff6b00] drop-shadow-[0_0_8px_rgba(255,107,0,0.85)]">
                  <MapPin className="w-full h-full fill-[#ff6b00]" stroke="none" />
                  <div className="absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-white rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#ff6b00] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Glowing Pin 3 (Bottom Center) */}
              <div className="absolute top-[88%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-6 h-6 text-[#ff6b00] drop-shadow-[0_0_8px_rgba(255,107,0,0.85)]">
                  <MapPin className="w-full h-full fill-[#ff6b00]" stroke="none" />
                  <div className="absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-white rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#ff6b00] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Glowing Pin 4 (Top Right) */}
              <div className="absolute top-[34%] left-[79%] -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-6 h-6 text-[#ff6b00] drop-shadow-[0_0_8px_rgba(255,107,0,0.85)]">
                  <MapPin className="w-full h-full fill-[#ff6b00]" stroke="none" />
                  <div className="absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-white rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#ff6b00] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Glowing Pin 5 (Bottom Right) */}
              <div className="absolute top-[88%] left-[74%] -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-6 h-6 text-[#ff6b00] drop-shadow-[0_0_8px_rgba(255,107,0,0.85)]">
                  <MapPin className="w-full h-full fill-[#ff6b00]" stroke="none" />
                  <div className="absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-white rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#ff6b00] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Main Glowing Pin with Yaguará Pill (Center Right) */}
              <div className="absolute top-[48%] left-[63%] -translate-x-1/2 -translate-y-1/2 flex items-center">
                 <div className="relative flex items-center justify-center">
                   {/* Large outer glow rings */}
                   <div className="absolute w-28 h-28 bg-[#ff6b00]/25 rounded-full blur-xl animate-pulse" />
                   <div className="absolute w-16 h-16 bg-[#ff6b00]/30 rounded-full blur-md" />
                   <div className="absolute w-12 h-12 border-2 border-[#ff6b00]/70 rounded-full animate-ping" />
                   
                   {/* Main Pin Icon */}
                   <div className="relative w-9 h-9 text-[#ff6b00] drop-shadow-[0_0_16px_rgba(255,107,0,1)] z-10">
                     <MapPin className="w-full h-full fill-[#ff6b00]" stroke="none" />
                     <div className="absolute top-[41.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-inner">
                       <div className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full" />
                     </div>
                   </div>
                 </div>
                 
                 {/* Yaguará Tag */}
                 <div className="ml-3 bg-[#0d131c]/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15 text-white font-bold text-xs shadow-xl relative z-20 whitespace-nowrap">
                   Yaguará
                 </div>
              </div>
           </div>
           
           {/* Section Content */}
           <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-center p-6 sm:p-8 gap-6">
              
              {/* Left Column: Text + Button */}
              <div className="flex flex-col items-start gap-4">
                 <div className="flex items-start gap-3.5 text-left">
                   <div className="p-1 rounded-lg">
                     <MapIcon className="w-8 h-8 text-[#ff6b00]" strokeWidth={2.2} />
                   </div>
                   <div>
                     <h3 className="text-xl sm:text-2xl font-black text-white mb-1 tracking-tight leading-none">
                       Directorio en mapa
                     </h3>
                     <p className="text-xs sm:text-sm text-zinc-300 font-normal">
                       Explora los negocios más cercanos a tu ubicación.
                     </p>
                   </div>
                 </div>

                 <button 
                   onClick={() => setShowMap(!showMap)}
                   className="flex items-center justify-center bg-[#ff6b00] hover:bg-[#ff5500] text-white font-bold py-3 px-6 rounded-full transition-all duration-200 shadow-[0_4px_20px_rgba(255,107,0,0.4)] text-sm group"
                 >
                   <Navigation className="w-4 h-4 mr-2 fill-white text-white group-hover:translate-x-0.5 transition-transform" />
                   <span>{showMap ? 'Ocultar mapa' : 'Explorar mapa'}</span>
                   <ChevronRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                 </button>
              </div>

              {/* Right Column: Stats Box */}
              <div className="bg-[#0b1017]/90 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 flex flex-col items-center justify-center min-w-[210px] shadow-2xl">
                 <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold mb-1">
                   <Target className="w-4 h-4 text-[#ff6b00]" strokeWidth={2.5} />
                   <span>Negocios cerca de ti</span>
                 </div>
                 <div className="text-[2.6rem] font-black text-[#ff6b00] leading-none tracking-tight my-1 drop-shadow-sm">
                   +200
                 </div>
                 <div className="text-xs text-zinc-400 font-medium">
                   establecimientos
                 </div>
              </div>

           </div>
        </div>
        
        {/* Expanded Interactive Leaflet Map */}
        {showMap && (
           <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="bg-[#111] p-2 rounded-[2rem] border border-white/5">
               <InteractiveMap businesses={filteredBusinesses} closestBusinessId={closestBusinessId} />
             </div>
           </div>
        )}
      </div>

      {/* Dedicated Directory Section & Filter Controls */}
      <div id="directorio" className="space-y-4 pt-4 scroll-mt-28">
        
        {/* Header & Main Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-[#ff6b00]/15 text-[#ff6b00] border border-[#ff6b00]/30 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b00] animate-pulse" />
                Directorio Oficial
              </span>
              <span className="text-zinc-600 text-xs font-semibold">•</span>
              <span className="text-zinc-400 text-xs font-semibold">Yaguará, Huila</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex flex-wrap items-center gap-3">
              <span>Servicios y Comercios</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300">
                {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'establecimiento' : 'establecimientos'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-normal">
              Filtra entre servicios especializados, oficios y comercios de la región.
            </p>
          </div>

          {/* Quick Active Filters Reset */}
          <div className="flex items-center gap-2 flex-wrap">
            {(businessType !== 'all' || activeCategory !== 'all' || onlyVerified || searchQuery) && (
              <button
                onClick={() => {
                  setBusinessType('all');
                  setSelectedCategory(null);
                  setOnlyVerified(false);
                  useAppStore.getState().setSearchQuery('');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] px-3.5 py-2 rounded-full border border-white/10 transition-all hover:border-[#ff6b00]/40 group"
              >
                <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform" />
                <span>Restablecer filtros</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Filter Toolbar */}
        <div className="bg-[#0b1017] p-2.5 sm:p-3 rounded-2xl border border-white/[0.08] shadow-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            
            {/* 1. Botón de Filtros Desplegable en Lista (Tipo) */}
            <div className="relative">
              <button
                type="button"
                id="btn-filtro-tipo"
                onClick={() => setIsDirFilterOpen(!isDirFilterOpen)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border shadow-lg ${
                  isServiceActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/40 shadow-blue-500/25 scale-[1.02]'
                    : isCommerceActive
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400/40 shadow-amber-500/25 scale-[1.02]'
                    : 'bg-[#131b26] text-white border-white/10 hover:border-white/20'
                }`}
              >
                {isServiceActive ? (
                  <Wrench className="w-4 h-4 text-blue-300" />
                ) : isCommerceActive ? (
                  <Store className="w-4 h-4 text-amber-300" />
                ) : (
                  <Filter className="w-4 h-4 text-[#ff6b00]" />
                )}
                <span>
                  {isServiceActive
                    ? 'Filtrar: Solo Servicios'
                    : isCommerceActive
                    ? 'Filtrar: Solo Comercio'
                    : 'Filtrar: Todos'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/35 font-black">
                  {isServiceActive ? servicesCount : isCommerceActive ? commerceCount : totalCount}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isDirFilterOpen ? 'rotate-180 text-white' : ''}`} />
              </button>

              {/* Lista Desplegable flotante */}
              {isDirFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDirFilterOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-[#0d131c]/98 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between mb-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                        Seleccionar Filtro
                      </span>
                      {businessType !== 'all' && (
                        <button
                          onClick={() => handleTypeChange('all')}
                          className="text-[11px] font-bold text-[#ff6b00] hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Ver Todos
                        </button>
                      )}
                    </div>

                    <ul className="space-y-1">
                      {/* Opción 1: Todos */}
                      <li>
                        <button
                          type="button"
                          onClick={() => handleTypeChange('all')}
                          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-left group ${
                            businessType === 'all' || !businessType
                              ? 'bg-gradient-to-r from-[#ff6b00]/20 to-[#ff4500]/10 border border-[#ff6b00]/40 text-white'
                              : 'hover:bg-white/5 text-zinc-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              businessType === 'all' || !businessType ? 'bg-[#ff6b00] text-white shadow-md shadow-[#ff6b00]/30' : 'bg-white/5 text-zinc-400 group-hover:text-white'
                            }`}>
                              <LayoutGrid className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold flex items-center gap-1.5">
                                <span>Todos los establecimientos</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-zinc-300">
                                  {totalCount}
                                </span>
                              </div>
                              <div className="text-xs text-zinc-400">Mostrar servicios y comercios</div>
                            </div>
                          </div>
                          {(businessType === 'all' || !businessType) && (
                            <Check className="w-4 h-4 text-[#ff6b00]" />
                          )}
                        </button>
                      </li>

                      {/* Opción 2: Solo Servicios */}
                      <li>
                        <button
                          type="button"
                          onClick={() => handleTypeChange('services')}
                          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-left group ${
                            isServiceActive
                              ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                              : 'hover:bg-white/5 text-zinc-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              isServiceActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white/5 text-blue-400'
                            }`}>
                              <Wrench className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold flex items-center gap-1.5 text-blue-300">
                                <span>Solo Servicios</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-200">
                                  {servicesCount}
                                </span>
                              </div>
                              <div className="text-xs text-zinc-400">Técnicos, oficios y profesionales</div>
                            </div>
                          </div>
                          {isServiceActive && (
                            <Check className="w-4 h-4 text-blue-400" />
                          )}
                        </button>
                      </li>

                      {/* Opción 3: Solo Comercio */}
                      <li>
                        <button
                          type="button"
                          onClick={() => handleTypeChange('commerce')}
                          className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-left group ${
                            isCommerceActive
                              ? 'bg-amber-600/20 border border-amber-500/40 text-white'
                              : 'hover:bg-white/5 text-zinc-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              isCommerceActive ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30' : 'bg-white/5 text-amber-400'
                            }`}>
                              <Store className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold flex items-center gap-1.5 text-amber-300">
                                <span>Solo Comercio</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-200">
                                  {commerceCount}
                                </span>
                              </div>
                              <div className="text-xs text-zinc-400">Tiendas, locales y restaurantes</div>
                            </div>
                          </div>
                          {isCommerceActive && (
                            <Check className="w-4 h-4 text-amber-400" />
                          )}
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* 2. Botón: Filtrar por Rubro (Colocado al lado de Filtrar comercios o servicios) */}
            <button
              type="button"
              id="btn-filtrar-rubro"
              onClick={() => setShowCategoryDrawer(!showCategoryDrawer)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border shadow-lg ${
                showCategoryDrawer || activeCategory !== 'all'
                  ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff4500] text-white border-[#ff6b00]/50 shadow-[#ff6b00]/25 scale-[1.02]'
                  : 'bg-[#131b26] text-white border-white/10 hover:border-white/20'
              }`}
            >
              <SlidersHorizontal className={`w-4 h-4 ${showCategoryDrawer || activeCategory !== 'all' ? 'text-white' : 'text-[#ff6b00]'}`} />
              <span>
                {activeCategory !== 'all'
                  ? `Rubro: ${CATEGORIES.find(c => c.id === activeCategory)?.label || 'Rubro'}`
                  : 'Filtrar por Rubro'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/35 font-black">
                {availableCategories.length - 1}
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${showCategoryDrawer ? 'rotate-180 text-white' : ''}`} />
            </button>

          </div>
        </div>

        {/* Collapsible Category Chips (Rubros) */}
        {showCategoryDrawer && (
          <div className="bg-[#0e141f] border border-white/[0.08] rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-3 px-1 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {isServiceActive 
                    ? 'Rubros de Servicios' 
                    : isCommerceActive 
                    ? 'Rubros de Comercio' 
                    : 'Seleccionar Rubro Específico'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                  {availableCategories.length - 1} {availableCategories.length - 1 === 1 ? 'rubro disponible' : 'rubros disponibles'}
                </span>
              </div>

              {activeCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs text-[#ff6b00] hover:underline font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>
                    {isServiceActive 
                      ? 'Ver todos los servicios' 
                      : isCommerceActive 
                      ? 'Ver todos los comercios' 
                      : 'Ver todos los rubros'}
                  </span>
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(cat => {
                const isSelected = activeCategory === cat.id;
                const count = getCategoryCount(cat.id);
                const label = cat.id === 'all'
                  ? (isServiceActive 
                      ? 'Todos los Servicios' 
                      : isCommerceActive 
                      ? 'Todos los Comercios' 
                      : 'Todos los Rubros')
                  : cat.label;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id === 'all' ? null : cat.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#ff6b00] text-white shadow-[0_2px_12px_rgba(255,107,0,0.35)] scale-105'
                        : 'bg-[#151d29] text-zinc-300 hover:bg-[#1c2738] hover:text-white border border-white/5'
                    }`}
                  >
                    {cat.icon}
                    <span>{label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-zinc-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Filter Badges Bar */}
        {(businessType !== 'all' || activeCategory !== 'all' || onlyVerified || searchQuery) && (
          <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-400 pt-1">
            <span className="font-semibold text-zinc-500">Filtros activos:</span>
            
            {businessType !== 'all' && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-white font-semibold ${
                businessType === 'services' || businessType === 'service'
                  ? 'bg-blue-900/40 border-blue-500/40 text-blue-200'
                  : 'bg-amber-900/40 border-amber-500/40 text-amber-200'
              }`}>
                {businessType === 'services' || businessType === 'service' ? '🔧 Tipo: Servicios' : '🏪 Tipo: Comercios'}
                <button 
                  onClick={() => setBusinessType('all')}
                  className="hover:text-red-400 transition-colors ml-0.5"
                  title="Quitar filtro"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6b00]/15 border border-[#ff6b00]/40 text-orange-200 font-semibold">
                Rubro: {CATEGORIES.find(c => c.id === activeCategory)?.label || activeCategory}
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="hover:text-red-400 transition-colors ml-0.5"
                  title="Quitar filtro"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onlyVerified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold">
                Solo verificados
                <button 
                  onClick={() => setOnlyVerified(false)}
                  className="hover:text-red-400 transition-colors ml-0.5"
                  title="Quitar filtro"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/20 text-white font-semibold">
                Búsqueda: "{searchQuery}"
                <button 
                  onClick={() => useAppStore.getState().setSearchQuery('')}
                  className="hover:text-red-400 transition-colors ml-0.5"
                  title="Quitar filtro"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Content (Grid) */}
      {filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 items-start">
          {filteredBusinesses.map(business => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#131b26]/60 rounded-3xl border border-white/10 p-8">
          <ShieldCheck className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No se encontraron establecimientos</h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
            No hay servicios o comercios que coincidan con los filtros seleccionados actualmente.
          </p>
          <button
            onClick={() => {
              setBusinessType('all');
              setSelectedCategory(null);
              setOnlyVerified(false);
              useAppStore.getState().setSearchQuery('');
            }}
            className="inline-flex items-center gap-2 bg-[#ff6b00] hover:bg-[#ff5500] text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all shadow-[0_4px_16px_rgba(255,107,0,0.35)]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer todos los filtros</span>
          </button>
        </div>
      )}

      {/* Promotion Checkout Modal ($10.000 COP / 24h) */}
      <PromotionCheckoutModal 
        isOpen={isPromoCheckoutOpen}
        onClose={() => setIsPromoCheckoutOpen(false)}
      />
    </div>
  );
}
