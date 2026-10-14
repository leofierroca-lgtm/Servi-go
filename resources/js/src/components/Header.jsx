import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, LogIn, User, ChevronDown, Menu, X, Store, ShieldCheck, Zap, ShoppingCart, Package, SlidersHorizontal } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import LocationSelector from './LocationSelector';
import serviGoLogo from '../assets/servigo-logo.jpg';

export default function Header() {
  const navigate = useNavigate();
  const { location, searchQuery, setSearchQuery, setSelectedCategory } = useAppStore();
  const { isAuthenticated, role, user, setAuthModalOpen, logout } = useAuthStore();
  const { items: cartItems, toggleCart } = useCartStore();
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedCategory(null);
    navigate('/');
  };

  const isDelivery = role === 'delivery';
  const isAdmin = role === 'admin';

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-2xl border-b border-[#ff6b00]/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)]" style={{ background: 'linear-gradient(to bottom, rgba(30, 26, 23, 0.97), rgba(25, 22, 20, 0.95))' }}>
        {/* Warm accent glow line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, transparent, rgba(255,107,0,0.5) 30%, rgba(255,107,0,0.7) 50%, rgba(255,107,0,0.5) 70%, transparent)' }} />
        {/* Top highlight line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.12) 70%, transparent)' }} />
        
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-[88px]">
            
            {/* Logo */}
            <Link to={isDelivery ? "/delivery" : "/"} className="flex items-center space-x-3 group shrink-0">
              <div className="relative shrink-0">
                <img 
                  src="/uploads/servigo-icon.png" 
                  alt="Logo" 
                  className="h-[76px] sm:h-[88px] w-auto object-contain drop-shadow-[0_4px_12px_rgba(255,0,0,0.3)] group-hover:drop-shadow-[0_4px_20px_rgba(255,0,0,0.6)] group-hover:scale-105 transition-all duration-300"
                />
              </div>
              <div className="hidden sm:flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] via-[#ff8c00] to-[#ff3b00] drop-shadow-[0_2px_4px_rgba(255,107,0,0.4)] leading-none mb-1">
                  Servi-Go
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 tracking-[0.2em] uppercase leading-none">
                  Directorio Local
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            {!isDelivery && (
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-6">
                <div className="relative w-full group flex items-center">
                  <Search className="absolute left-4 w-4 h-4 text-zinc-400 group-focus-within:text-[#ff6b00] transition-colors duration-200 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="¿Qué servicio o negocio estás buscando en Yaguará?"
                    className="w-full border border-white/[0.15] rounded-full pl-11 pr-12 py-2.5 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#ff6b00]/60 focus:ring-2 focus:ring-[#ff6b00]/25 hover:border-white/25 transition-all duration-200"
                    style={{ background: 'rgba(10, 10, 15, 0.55)' }}
                  />
                  <button type="button" className="absolute right-4 text-zinc-400 hover:text-white transition-colors" title="Filtros">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Location Button */}
              {!isDelivery && (
                <button 
                  onClick={() => setShowLocationSelector(true)}
                  className="hidden sm:flex items-center space-x-2 text-sm font-bold text-zinc-200 hover:text-white bg-transparent px-4 py-2 rounded-full border border-white/[0.15] hover:border-[#ff6b00]/30 transition-all duration-200"
                >
                  <MapPin className="w-4 h-4 text-[#ff6b00]" />
                  <span className="max-w-[100px] truncate">{location}</span>
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </button>
              )}

              {/* Cart Button */}
              {!isDelivery && !isAdmin && (
                <button 
                  onClick={toggleCart}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-transparent border border-white/[0.15] hover:bg-white/[0.15] hover:border-[#ff6b00]/30 transition-all duration-200"
                >
                  <ShoppingCart className="w-4 h-4 text-zinc-300" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-[#ff6b00] to-[#ff4500] text-white text-[10px] font-bold rounded-full shadow-[0_2px_8px_rgba(255,107,0,0.4)]">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              )}

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-sm font-bold text-white bg-white/[0.08] hover:bg-white/[0.15] px-3 py-2 rounded-full border border-white/[0.15] hover:border-[#ff6b00]/30 transition-all duration-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#ff6b00] to-[#ff0055] flex items-center justify-center shadow-[0_2px_8px_rgba(255,107,0,0.3)]">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="hidden sm:block max-w-[100px] truncate">{user?.name || 'Mi Cuenta'}</span>
                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 backdrop-blur-xl border border-white/[0.12] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden py-2 z-50" style={{ background: 'rgba(30, 26, 23, 0.98)' }}>
                      {role === 'provider' && (
                        <Link 
                          to="/" 
                          onClick={() => { setShowUserMenu(false); }}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.07] transition-colors duration-150"
                        >
                          <Store className="w-4 h-4 text-[#ff6b00]" />
                          <span className="font-semibold">Mi Dashboard</span>
                        </Link>
                      )}
                      {role === 'delivery' && (
                        <Link 
                          to="/delivery" 
                          onClick={() => { setShowUserMenu(false); }}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.07] transition-colors duration-150"
                        >
                          <Package className="w-4 h-4 text-blue-400" />
                          <span className="font-semibold">Panel Domiciliario</span>
                        </Link>
                      )}
                      {role === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/[0.07] transition-colors duration-150"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="font-semibold">Panel Admin</span>
                        </Link>
                      )}
                      <div className="border-t border-white/[0.07] my-1"></div>
                      <button 
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition-colors duration-150"
                      >
                        <LogIn className="w-4 h-4 rotate-180" />
                        <span className="font-semibold">Cerrar Sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center space-x-2 text-sm font-bold text-white bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:from-[#ff8533] hover:to-[#ff6b00] px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(255,107,0,0.3)] hover:shadow-[0_4px_25px_rgba(255,107,0,0.45)] transition-all duration-200 hover:scale-105"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Iniciar sesión</span>
                  <span className="sm:hidden">Entrar</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.15] text-zinc-300 hover:text-white hover:bg-white/[0.15] transition-all duration-200"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Search + Location */}
          {mobileMenuOpen && !isDelivery && (
            <div className="md:hidden pb-4 pt-2 space-y-3 border-t border-white/[0.08] animate-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar negocios, servicios..."
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-full pl-11 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff6b00]/50 focus:ring-2 focus:ring-[#ff6b00]/20 shadow-[inset_0_1px_4px_rgba(0,0,0,0.3)]"
                />
              </form>
              <button 
                onClick={() => { setShowLocationSelector(true); setMobileMenuOpen(false); }}
                className="flex items-center space-x-2 text-sm font-bold text-zinc-300 hover:text-white w-full bg-white/[0.06] px-4 py-2.5 rounded-full border border-white/[0.1] hover:border-white/20 transition-all duration-200"
              >
                <MapPin className="w-4 h-4 text-[#ff6b00]" />
                <span>{location}</span>
                <ChevronDown className="w-3 h-3 ml-auto text-zinc-500" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Location Modal */}
      {showLocationSelector && (
        <LocationSelector onClose={() => setShowLocationSelector(false)} />
      )}

      {/* Click-away for user menu */}
      {showUserMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
      )}
    </>
  );
}