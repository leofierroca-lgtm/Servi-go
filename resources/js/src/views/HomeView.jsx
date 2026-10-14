import React, { useState } from 'react';
import { Utensils, Coffee, Zap, Wrench, ShoppingCart, ShieldCheck, Map, Plus, Truck, Pill, Bike, Package, HardHat, Megaphone, ChevronDown, List, LayoutGrid, Clock, ChevronLeft, ChevronRight, Navigation, Map as MapIcon, MapPin, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import usePromotionsStore from '../store/usePromotionsStore';
import BusinessCard from '../components/BusinessCard';
import InteractiveMap from '../components/InteractiveMap';
import { MOCK_BUSINESSES } from '../data/mockData';

const CATEGORIES = [
  { id: 'all', label: 'Todos los Rubros', icon: <List className="w-4 h-4 mr-2" /> },
  { id: 'tecnologia', label: 'Tecnología y Telefonía', icon: <Zap className="w-4 h-4 mr-2" /> },
  { id: 'belleza', label: 'Belleza y Estética', icon: <Coffee className="w-4 h-4 mr-2" /> },
  { id: 'comidas_tipicas', label: 'Comidas Típicas & Quesillos', icon: <Utensils className="w-4 h-4 mr-2" /> },
  { id: 'electricistas', label: 'Electricistas', icon: <Zap className="w-4 h-4 mr-2" /> },
  { id: 'transporte', label: 'Transporte Público', icon: <Truck className="w-4 h-4 mr-2" /> },
  { id: 'droguerias', label: 'Droguerías', icon: <Pill className="w-4 h-4 mr-2" /> },
  { id: 'domicilios', label: 'Mensajería & Domicilios', icon: <Bike className="w-4 h-4 mr-2" /> },
  { id: 'acarreos', label: 'Acarreos y Mudanzas', icon: <Package className="w-4 h-4 mr-2" /> },
  { id: 'maestros', label: 'Maestros de Obra', icon: <HardHat className="w-4 h-4 mr-2" /> }
];

export default function HomeView() {
  const { location, searchQuery, businessType, setBusinessType, selectedCategory, setSelectedCategory } = useAppStore();
  const [showMap, setShowMap] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activeCategory = selectedCategory || 'all';

  const filteredBusinesses = MOCK_BUSINESSES.filter(business => {
    const matchCategory = activeCategory === 'all' || business.categoryId === activeCategory;
    const matchType = businessType === 'all' || business.type === businessType;
    // Assuming search logic could be added here later if needed
    return matchCategory && matchType;
  });

  // Calculate the closest business
  let closestBusinessId = null;
  if (activeCategory !== 'all' && filteredBusinesses.length > 0) {
    const closest = filteredBusinesses.reduce((prev, curr) => {
      // Extract numeric distance (e.g. "0.2 km" -> 0.2)
      const prevDist = parseFloat(prev.distance) || 999;
      const currDist = parseFloat(curr.distance) || 999;
      return (currDist < prevDist) ? curr : prev;
    });
    closestBusinessId = closest.id;
  }

  const promotions = usePromotionsStore(state => state.promotions);
  const activePromotions = promotions.filter(p => (Date.now() - p.createdAt) < 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-8">
      
      {/* Search Header Container (Redesigned) */}
      <div className="relative rounded-[2rem] overflow-hidden bg-[#111] border border-white/5 shadow-2xl mb-8 group min-h-[300px] flex items-center">
        {/* The background image / gradient */}
        <div className="absolute inset-0 z-0 bg-[#111]">
           {/* Right side image with gradient mask */}
           <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/4 bg-cover bg-right transition-transform duration-1000 group-hover:scale-105 opacity-60" style={{ 
               backgroundImage: "url('https://images.unsplash.com/photo-1548625361-ec72a7251e60?q=80&w=1200&auto=format&fit=crop')",
               maskImage: 'linear-gradient(to right, transparent 0%, black 50%)',
               WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%)'
             }}>
           </div>
           {/* Orange angled accent */}
           <div className="absolute -top-20 right-1/4 w-[400px] h-[150%] bg-[#ff6b00] opacity-20 transform -skew-x-12 blur-[80px] pointer-events-none"></div>
        </div>

        <div className="relative z-10 p-6 md:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <MapIcon className="w-5 h-5 text-[#ff6b00]" />
              <h4 className="text-[#ff6b00] font-bold text-xs md:text-sm tracking-[0.2em] uppercase">Descubre, apoya y conecta</h4>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              Servicios y comercios locales en <span className="text-[#ff6b00]">{location === 'Todo Huila' ? 'el Huila' : location}</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mb-8 leading-relaxed font-medium">
              Encuentra lo que necesitas, apoya el talento local y disfruta de las mejores ofertas en un solo lugar.
            </p>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
               {/* Todos Button */}
               <button onClick={() => setBusinessType('all')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${businessType === 'all' ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff4500] text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-transparent text-gray-300 border border-white/10 hover:border-white/20 hover:text-white'}`}>
                 <LayoutGrid className="w-4 h-4" /> Todos
               </button>
               {/* Servicios */}
               <button onClick={() => setBusinessType('services')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${businessType === 'services' ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff4500] text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-transparent text-gray-300 border border-white/10 hover:border-white/20 hover:text-white'}`}>
                 <Wrench className="w-4 h-4" /> Servicios
               </button>
               {/* Comercios */}
               <button onClick={() => setBusinessType('commerce')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${businessType === 'commerce' ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff4500] text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-transparent text-gray-300 border border-white/10 hover:border-white/20 hover:text-white'}`}>
                 <ShoppingCart className="w-4 h-4" /> Comercios
               </button>
               {/* Solo verificados */}
               <button className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all bg-transparent text-gray-300 border border-white/10 hover:border-white/20 hover:text-white`}>
                 <ShieldCheck className="w-4 h-4 text-green-500" /> Solo verificados
               </button>
            </div>
          </div>

          {/* Register Button */}
          <div className="flex-shrink-0 w-full lg:w-auto flex justify-end">
            <Link to="/register-business" className="w-full lg:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:scale-105 transition-transform text-white font-bold py-3.5 px-8 rounded-full shadow-[0_0_20px_rgba(255,107,0,0.4)] whitespace-nowrap">
              <Plus className="w-5 h-5" /> Registrar mi negocio
            </Link>
          </div>
        </div>
      </div>

      {/* 24h Promotions Carousel */}
      {activePromotions.length > 0 && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 mb-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-[#ff6b00]" />
                <h3 className="text-2xl font-black text-white tracking-tight">Promociones destacadas</h3>
              </div>
              <span className="bg-[#ff6b00]/10 text-[#ff6b00] text-xs font-bold px-3 py-1 rounded-full border border-[#ff6b00]/20 flex items-center gap-1 w-max">
                <Clock className="w-3 h-3" /> Por tiempo limitado
              </span>
            </div>
            <div className="hidden sm:flex gap-2">
              <button className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors border border-white/10">
                <ChevronLeft className="w-5 h-5 text-zinc-400" />
              </button>
              <button className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors border border-white/10">
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {activePromotions.map(promo => (
                <Link to={`/provider/${promo.providerId}#${promo.id}`} key={promo.id} className={`min-w-[320px] sm:min-w-[400px] flex-shrink-0 bg-gradient-to-br ${promo.color} p-6 rounded-[2rem] flex items-center justify-between shadow-xl cursor-pointer hover:scale-[1.02] transition-transform snap-center border border-white/10 relative overflow-hidden group`}>
                    <div className="absolute top-0 right-0 bottom-0 w-1/2 bg-black/20 mix-blend-overlay"></div>
                    <div className="text-white relative z-10 w-2/3">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest mb-2 bg-black/30 inline-flex px-2.5 py-1 rounded-full border border-white/10">
                        <Wrench className="w-3 h-3" /> {promo.providerName}
                      </div>
                      <h4 className="font-black text-2xl leading-none mb-2 drop-shadow-md">{promo.title}</h4>
                      <p className="text-sm text-white/90 max-w-[200px] leading-snug font-medium drop-shadow-sm mb-4">{promo.description}</p>
                      <div className="text-xs font-bold bg-white text-black px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md">
                        <Clock className="w-3.5 h-3.5" /> Quedan {Math.max(0, 24 - Math.floor((Date.now() - promo.createdAt)/(1000*60*60)))} días
                      </div>
                    </div>
                    <img src={promo.image} className="absolute right-0 top-0 bottom-0 h-full w-1/2 object-cover mask-image-linear-to-l" style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }} alt="promo" />
                </Link>
             ))}
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className="w-full mb-8">
        <div className="relative w-full rounded-[1.5rem] border border-white/5 overflow-hidden group bg-[#0d1218] min-h-[160px] flex items-stretch shadow-2xl">
           
           {/* Detailed Background Map (Inline SVG) */}
           <div className="absolute inset-0 z-0 opacity-80 pointer-events-none bg-[#0b1116]">
              {/* SVG Map Background Pattern */}
              <div className="absolute inset-0 opacity-60 mix-blend-screen" style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='400' viewBox='0 0 1000 400'%3E%3Crect width='1000' height='400' fill='%230b1116'/%3E%3Cg opacity='0.4'%3E%3Cpath d='M0,50 Q100,60 200,20 T400,80 T600,40 T800,90 T1000,50 M0,150 Q150,180 300,120 T600,190 T900,140 T1000,150 M0,250 Q200,290 400,220 T800,280 T1000,250 M0,350 Q250,390 500,310 T1000,350' stroke='%23182230' stroke-width='2' fill='none'/%3E%3Cpath d='M50,0 Q60,100 20,200 T80,400 M150,0 Q180,150 120,300 T190,400 M250,0 Q290,200 220,400 M350,0 Q390,250 310,400 M450,0 Q480,150 420,300 T490,400 M550,0 Q590,200 520,400 M650,0 Q680,150 620,300 T690,400 M750,0 Q790,200 720,400 M850,0 Q880,150 820,300 T890,400 M950,0 Q990,200 920,400' stroke='%23182230' stroke-width='2' fill='none'/%3E%3Cpath d='M100,80 L250,150 L350,100 L500,250 L700,180 L850,300 M200,50 L300,200 L450,150 L600,350 L800,250 L950,400 M150,350 L350,280 L550,400 L750,320 L900,380' stroke='%231e293b' stroke-width='3' fill='none'/%3E%3C/g%3E%3Cpath d='M350,-50 C380,50 450,150 420,200 C390,250 480,300 520,450' stroke='%2305264a' stroke-width='35' fill='none' stroke-linecap='round'/%3E%3Cpath d='M350,-50 C380,50 450,150 420,200 C390,250 480,300 520,450' stroke='%230a3b6b' stroke-width='20' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, 
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center'
                }}></div>
              
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d1218] via-transparent to-[#0d1218]"></div>
              
              {/* Glowing Pins (Small) */}
              <div className="absolute top-[30%] left-[30%] w-6 h-6 text-[#ff6b00] drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]">
                <MapPin className="w-full h-full fill-[#ff6b00]" stroke="none" />
                <div className="absolute top-[41.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#ff6b00] rounded-full"></div>
                </div>
              </div>
              
              <div className="absolute top-[65%] left-[40%] w-6 h-6 text-[#ff6b00] drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]">
                <MapPin className="w-full h-full fill-[#ff6b00]" stroke="none" />
                <div className="absolute top-[41.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#ff6b00] rounded-full"></div>
                </div>
              </div>

              <div className="absolute top-[25%] left-[82%] w-6 h-6 text-[#ff6b00] drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]">
                <MapPin className="w-full h-full fill-[#ff6b00]" stroke="none" />
                <div className="absolute top-[41.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#ff6b00] rounded-full"></div>
                </div>
              </div>

              <div className="absolute top-[60%] left-[78%] w-6 h-6 text-[#ff6b00] drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]">
                <MapPin className="w-full h-full fill-[#ff6b00]" stroke="none" />
                <div className="absolute top-[41.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#ff6b00] rounded-full"></div>
                </div>
              </div>

              {/* Main Glowing Pin (Yaguará) */}
              <div className="absolute top-[50%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex items-center">
                 <div className="relative flex items-center justify-center">
                   {/* Large outer glow rings */}
                   <div className="absolute w-32 h-32 bg-[#ff6b00]/20 rounded-full blur-xl animate-pulse"></div>
                   <div className="absolute w-20 h-20 bg-[#ff6b00]/30 rounded-full blur-md"></div>
                   <div className="absolute w-12 h-12 border-2 border-[#ff6b00]/60 rounded-full animate-ping"></div>
                   
                   {/* Pin SVG */}
                   <div className="relative w-10 h-10 text-[#ff6b00] drop-shadow-[0_0_20px_rgba(255,107,0,1)] z-10">
                     <MapPin className="w-full h-full fill-[#ff6b00]" stroke="none" />
                     {/* White inner circle with orange dot */}
                     <div className="absolute top-[41.5%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-inner">
                       <div className="w-1.5 h-1.5 bg-[#ff6b00] rounded-full"></div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="ml-5 bg-[#111]/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-white font-bold text-xs shadow-2xl relative z-20">
                   Yaguará
                 </div>
              </div>
           </div>
           
           <div className="relative z-10 w-full flex flex-col md:flex-row justify-between p-6">
              
              {/* Left Column: Text + Button */}
              <div className="flex flex-col justify-between items-start gap-6 h-full">
                 <div className="flex items-start gap-4 text-left">
                   <MapIcon className="w-7 h-7 mt-0.5 text-[#ff6b00]" strokeWidth={2} />
                   <div>
                     <h3 className="text-[20px] font-bold text-white mb-1 tracking-tight leading-none">Directorio en mapa</h3>
                     <p className="text-[13px] text-zinc-300 font-medium drop-shadow-md">Explora los negocios más cercanos a tu ubicación.</p>
                   </div>
                 </div>

                 <button 
                   onClick={() => setShowMap(!showMap)}
                   className="flex items-center justify-center bg-[#ff6b00] hover:bg-[#ff5500] text-white font-bold py-2.5 px-6 rounded-full transition-colors whitespace-nowrap shadow-[0_4px_15px_rgba(255,107,0,0.4)] text-[14px]"
                 >
                   <Navigation className="w-4 h-4 mr-2" />
                   {showMap ? 'Ocultar mapa' : 'Explorar mapa'}
                   <ChevronRight className="w-4 h-4 ml-1.5" />
                 </button>
              </div>

              {/* Right Column: Stats Box */}
              <div className="bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/5 rounded-[1rem] p-5 flex flex-col items-center justify-center min-w-[200px] mt-6 md:mt-0 shadow-2xl">
                 <div className="flex items-center gap-2 text-[12px] text-zinc-300 font-semibold mb-1">
                   <Target className="w-4 h-4 text-[#ff6b00]" /> Negocios cerca de ti
                 </div>
                 <div className="text-[2.5rem] font-black text-[#ff6b00] leading-none mb-1 drop-shadow-sm">
                   +{filteredBusinesses.length}
                 </div>
                 <div className="text-[10px] text-zinc-400 font-medium mt-1 lowercase">
                   establecimientos
                 </div>
              </div>

           </div>
        </div>
        
        {showMap && (
           <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="bg-[#111] p-2 rounded-[2rem] border border-white/5">
               <InteractiveMap businesses={filteredBusinesses} closestBusinessId={closestBusinessId} />
             </div>
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
        <div className="text-center py-20 bg-[#151515] rounded-3xl border border-white/5">
          <ShieldCheck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No se encontraron resultados</h3>
          <p className="text-gray-400">Intenta seleccionar otra categoría o cambiar los filtros.</p>
        </div>
      )}
    </div>
  );
}
