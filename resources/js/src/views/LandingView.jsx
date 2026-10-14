import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn, TrendingUp, Users, Zap, CheckCircle2, Map, MessageSquare } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import serviGoLogo from '../assets/servigo-logo.jpg';

export default function LandingView() {
  const { setAuthModalOpen } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#0f0f11] overflow-hidden font-sans selection:bg-[#ff6b00] selection:text-white">
      {/* Background Orbs / Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ff6b00]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#ffcc00]/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Top Navbar specifically for Landing Page */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center space-x-4">
          <img 
            src="/uploads/servigo-icon.png" 
            alt="Logo" 
            className="h-[88px] sm:h-[104px] w-auto object-contain drop-shadow-[0_8px_24px_rgba(255,0,0,0.4)] hover:scale-105 transition-all duration-300"
          />
          <div className="flex flex-col justify-center">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] via-[#ff8c00] to-[#ff3b00] drop-shadow-[0_2px_4px_rgba(255,107,0,0.4)] leading-none mb-1">
              Servi-Go
            </span>
            <span className="text-xs sm:text-sm font-bold text-white/60 tracking-[0.2em] uppercase leading-none">
              Directorio Digital
            </span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#inicio" className="text-sm font-medium text-white hover:text-[#ff6b00] transition-colors">Inicio</a>
          <a href="#nosotros" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Nosotros</a>
          <Link to="/directory" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Directorio</Link>
          <a href="#contacto" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Contacto</a>
        </div>

        <button 
          onClick={() => setAuthModalOpen(true)}
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-6 py-2.5 text-sm font-bold flex items-center transition-all hover:scale-105 backdrop-blur-sm"
        >
          <LogIn className="w-4 h-4 mr-2" /> Iniciar Sesión
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-screen-2xl mx-auto px-8 pt-12 md:pt-24 pb-32 flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Column: Hero Text */}
        <div className="lg:w-1/2 space-y-8">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-300 tracking-wider uppercase">Plataforma 100% Activa</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
            Directorio <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-[#ffcc00] italic">Yaguará</span>
          </h1>
          
          <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
            Gestión de comercios locales, servicios profesionales y oficios con trazabilidad, comunicación directa y perfiles detallados en una sola plataforma.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link 
              to="/directory"
              className="w-full sm:w-auto bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-bold py-4 px-8 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-xl shadow-[#ff6b00]/20"
            >
              <Zap className="w-5 h-5 mr-2" /> Acceso al Sistema
            </Link>
            <button className="w-full sm:w-auto bg-transparent border border-white/20 text-white font-bold py-4 px-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
              Conocer Más <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          <div className="flex items-center gap-6 pt-8 border-t border-white/5">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Cero comisiones</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Conexión directa</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Soporte 24/7</span>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphism Dashboard Panel */}
        <div className="lg:w-1/2 w-full max-w-lg relative">
          {/* Decorative element behind panel */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b00]/20 to-transparent blur-2xl transform translate-x-4 translate-y-4 rounded-3xl"></div>
          
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden group hover:border-white/20 transition-all duration-500">
            {/* Glossy reflection line */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="flex items-center space-x-3 text-white">
                <div className="w-10 h-10 bg-[#ff6b00]/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#ff6b00]" />
                </div>
                <h2 className="text-xl font-bold">Panel Operativo</h2>
              </div>
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                Online
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              {/* Stat Card 1 */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:bg-black/60 transition-colors">
                <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">Negocios Activos</p>
                <div className="text-3xl font-black text-white">35<span className="text-[#ff6b00]">+</span></div>
              </div>
              
              {/* Stat Card 2 */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:bg-black/60 transition-colors">
                <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">Categorías</p>
                <div className="text-3xl font-black text-white">7</div>
              </div>
              
              {/* Stat Card 3 */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:bg-black/60 transition-colors">
                <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">Conexión</p>
                <div className="text-xl font-black text-white flex items-center mt-2">
                  <MessageSquare className="w-5 h-5 text-[#ffcc00] mr-2" /> Directa
                </div>
              </div>
              
              {/* Stat Card 4 */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:bg-black/60 transition-colors">
                <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1">Ubicación</p>
                <div className="text-xl font-black text-white flex items-center mt-2">
                  <Map className="w-5 h-5 text-blue-400 mr-2" /> Yaguará
                </div>
              </div>
            </div>

            {/* Bottom Bar in Panel */}
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?img=11" alt="User" className="w-10 h-10 rounded-full border-2 border-[#151515]" />
                <img src="https://i.pravatar.cc/100?img=22" alt="User" className="w-10 h-10 rounded-full border-2 border-[#151515]" />
                <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-10 h-10 rounded-full border-2 border-[#151515]" />
                <div className="w-10 h-10 rounded-full border-2 border-[#151515] bg-[#222] flex items-center justify-center text-xs text-white font-bold">+5k</div>
              </div>
              <div className="text-xs text-gray-400 font-medium text-right">
                Únete a la <br />comunidad
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
