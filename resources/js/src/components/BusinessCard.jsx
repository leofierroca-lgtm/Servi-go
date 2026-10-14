import React, { useState } from 'react';
import { Star, MapPin, ShieldCheck, Heart, QrCode, Store, Zap, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import useAvailabilityStore from '../store/useAvailabilityStore';

export default function BusinessCard({ business }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const user = useAuthStore((state) => state.user);
  const isBusinessOpen = useAvailabilityStore((state) => state.isBusinessOpen(business.id));

  // Solo los clientes/usuarios normales pueden iniciar chats desde el directorio
  const canChat = !user || user.role === 'client';

  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleProfileClick = () => {
    navigate(`/provider/${business.id}`);
  };

  return (
    <div 
      onClick={handleProfileClick}
      className="relative rounded-[1.5rem] overflow-hidden border border-white/10 hover:border-white/20 transition-all group cursor-pointer shadow-2xl flex flex-col aspect-[4/5] w-full"
    >
      {/* Favorite Button */}
      <button 
        onClick={handleFavoriteClick}
        title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg ${
          isFavorite 
            ? 'bg-[#ff0055] text-white border border-[#ff0055]' 
            : 'bg-black/40 text-white/70 border border-white/20 hover:bg-black/60 hover:text-[#ff0055] hover:border-[#ff0055]/50'
        }`}
      >
        <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-white' : ''}`} />
      </button>
      {/* Full Background Image */}
      <div className="absolute inset-0 w-full h-full bg-[#111]">
        <img 
          src={business.image} 
          alt={business.name}
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${business.id}/400/600`; }}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
        {/* Gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Content Area - Pushed to bottom */}
      <div className="relative z-10 px-4 pb-3.5 pt-9 flex-1 flex flex-col justify-end">
        {/* Avatar at top */}
        <div className="mb-2 relative w-max">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#b38728] to-[#fdc536] p-[2px]">
            <div className="w-full h-full bg-[#111] rounded-full"></div>
          </div>
          <img 
            src={business.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
            alt="Avatar" 
            onError={(e) => { e.target.src = `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70) + 1}`; }}
            className="relative w-[68px] h-[68px] rounded-full object-cover border-[3px] border-transparent shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Info Container */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[16px] font-black text-[#ff8c00] leading-tight drop-shadow-md">
            {business.name}
          </h3>
          


          <p className="text-[13px] text-gray-300 font-medium drop-shadow-sm">
            {business.category} • Yaguará
          </p>

          {/* Metrics */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl px-3.5 py-1.5 flex items-center justify-between border border-white/10 shadow-inner">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-[#ffcc00] fill-[#ffcc00] mr-1.5 drop-shadow" />
              <span className="font-extrabold text-white text-[17px] drop-shadow">{business.rating}</span>
              <span className="text-gray-400 ml-1 font-medium text-[13px]">({business.reviews})</span>
            </div>
            <div className="flex items-center gap-1.5">
              {business.verified && (
                <div className="flex items-center px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-[#ffcc00]/50 text-[#ffcc00] text-[10px] font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 mr-1 fill-[#ffcc00] text-black" />
                  VERIFICADO
                </div>
              )}
              <div className={`flex items-center px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border text-[10px] font-black uppercase tracking-wider ${
                isBusinessOpen 
                  ? 'border-green-500/50 text-green-400' 
                  : 'border-red-500/50 text-red-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isBusinessOpen ? 'bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></span>
                {isBusinessOpen ? 'ABIERTO' : 'CERRADO'}
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className={`grid ${canChat ? 'grid-cols-2' : 'grid-cols-1'} gap-1.5 mt-1`}>
            <button className="bg-[#2a2a2a]/80 backdrop-blur-sm hover:bg-[#333] text-white text-[12px] font-bold py-2.5 rounded-full flex items-center justify-center transition-colors border border-white/10">
              {business.categoryId === 'comidas_tipicas' 
                ? 'Ver Menú' 
                : business.type === 'commerce' 
                  ? 'Ver Catálogo' 
                  : 'Ver Perfil'} <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            {canChat && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (business.type === 'service') {
                    navigate('/chat', { state: { business } });
                  } else {
                    useAppStore.getState().setActiveChat(business);
                  }
                }}
                className="bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] hover:opacity-90 text-white text-[12px] font-bold py-2.5 rounded-full flex items-center justify-center transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)]"
              >
                <MessageSquare className="w-4 h-4 mr-1" /> Iniciar Chat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
