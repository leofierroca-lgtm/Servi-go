import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Settings, LogOut, Menu, X, ShieldCheck, ChevronRight, BarChart3 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import serviGoLogo from '../assets/servigo-logo.jpg';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Negocios', icon: Store, href: '/admin/negocios' },
    { label: 'Usuarios', icon: Users, href: '/admin/usuarios' },
    { label: 'Reportes', icon: BarChart3, href: '/admin/reportes' },
    { label: 'Ajustes', icon: Settings, href: '/admin/ajustes' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f0f14] border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 h-[88px] border-b border-white/5">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/uploads/servigo-icon.png" 
              alt="Logo" 
              className="h-[76px] sm:h-[88px] w-auto object-contain drop-shadow-[0_4px_12px_rgba(255,0,0,0.3)] group-hover:scale-105 transition-all duration-300"
            />
            <div className="flex flex-col justify-center">
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b00] to-[#ff3b00] drop-shadow-md leading-none mb-1">
                Servi-Go
              </span>
              <span className="text-[10px] font-bold text-[#ff6b00] tracking-[0.15em] uppercase leading-none">
                Admin
              </span>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Badge */}
        <div className="px-6 py-4">
          <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span className="text-xs font-bold text-green-400">Administrador</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/admin' 
              ? location.pathname === '/admin' 
              : location.pathname.startsWith(item.href);
              
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive 
                    ? 'bg-[#ff6b00]/10 text-[#ff6b00]' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#ff6b00]' : 'text-gray-600 group-hover:text-gray-300'}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-[88px] bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 flex items-center px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="lg:hidden mr-4 text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-white">Panel de Administración</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}