import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  LogIn, 
  Mail, 
  Lock, 
  UserPlus, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Package
} from 'lucide-react';
import useAuthStore, { DEMO_USERS } from '../store/useAuthStore';

export default function AuthModal() {
  const isAuthModalOpen = useAuthStore((state) => state.isAuthModalOpen);
  const authModalReason = useAuthStore((state) => state.authModalReason);
  const setAuthModalOpen = useAuthStore((state) => state.setAuthModalOpen);
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('carlos.mendoza@gmail.com');
  const [password, setPassword] = useState('123456');

  // Register Fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const navigate = useNavigate();

  const register = useAuthStore((state) => state.register);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');
    try {
      await login({ email, password });
      const currentRole = useAuthStore.getState().role;

      // Auto-navigate based on user role
      if (currentRole === 'delivery' || email === DEMO_USERS.delivery.email) {
        navigate('/delivery');
      } else if (currentRole === 'admin' || email === DEMO_USERS.admin.email) {
        navigate('/admin');
      } else if (currentRole === 'provider' || email === DEMO_USERS.provider.email) {
        const busId = useAuthStore.getState().user?.businessId || DEMO_USERS.provider.businessId;
        navigate(`/provider/${busId}`);
      }
    } catch (err) {
      setAuthError('Error al iniciar sesión. Revisa tus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');
    try {
      const res = await register({
        name: regName || 'Nuevo Usuario',
        email: regEmail,
        password: regPassword || 'password',
        phone: regPhone || '310 000 0000',
        address: regAddress || 'Zona Centro, Yaguará',
        role: 'client'
      });
      if (res && !res.success) {
        setAuthError(res.message);
      }
    } catch (err) {
      setAuthError('Error al procesar el registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoCredentials = (role) => {
    setIsLogin(true);
    setAuthError('');
    if (role === 'admin') {
      setEmail(DEMO_USERS.admin.email);
      setPassword('password');
    } else if (role === 'provider') {
      setEmail(DEMO_USERS.provider.email);
      setPassword('password');
    } else if (role === 'delivery') {
      setEmail(DEMO_USERS.delivery.email);
      setPassword('password');
    } else {
      setEmail(DEMO_USERS.client.email);
      setPassword('password');
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#151515] border border-white/10 w-full max-w-md rounded-3xl p-6 sm:p-8 relative shadow-2xl space-y-5">
        
        {/* Close Button (Only if already authenticated or user wants to browse as guest) */}
        <button 
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Inactivity or Logout Alert Notice */}
        {authModalReason === 'inactivity' ? (
          <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl flex items-start space-x-3 text-left">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-xs text-amber-400 block uppercase tracking-wider">
                Sesión Bloqueada por Inactividad (10 Min)
              </span>
              <p className="text-[11px] text-gray-300 mt-0.5 leading-tight">
                Por tu seguridad, la sesión se bloqueó tras 10 minutos sin actividad. Ingresa tus credenciales o regístrate para continuar.
              </p>
            </div>
          </div>
        ) : authModalReason === 'logout' ? (
          <div className="bg-blue-500/10 border border-blue-500/30 p-3.5 rounded-2xl flex items-start space-x-3 text-left">
            <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-xs text-blue-400 block uppercase tracking-wider">
                Has Cerrado Sesión
              </span>
              <p className="text-[11px] text-gray-300 mt-0.5 leading-tight">
                Ingresa nuevamente tus credenciales o crea una cuenta nueva para acceder a tu perfil y realizar compras.
              </p>
            </div>
          </div>
        ) : null}

        {/* Modal Header */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#ff6b00] to-[#ff4500] rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-[#ff6b00]/25">
            {isLogin ? <LogIn className="w-7 h-7 text-white" /> : <UserPlus className="w-7 h-7 text-white" />}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {isLogin ? 'Iniciar Sesión' : 'Crear Nueva Cuenta'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isLogin 
              ? 'Ingresa tus credenciales registradas para ingresar' 
              : 'Regístrate para comprar con el chatbot y gestionar pedidos'}
          </p>
        </div>

        {/* Toggle Login / Register Tabs */}
        <div className="flex bg-[#222] p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${isLogin ? 'bg-[#ff6b00] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${!isLogin ? 'bg-[#ff6b00] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Registrarse
          </button>
        </div>

        {authError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-semibold text-center">
            {authError}
          </div>
        )}

        {/* Formulario de Inicio de Sesión */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#222] border border-white/10 text-white text-xs rounded-xl focus:ring-[#ff6b00] focus:border-[#ff6b00] block w-full pl-9 p-2.5" 
                  placeholder="ejemplo@correo.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#222] border border-white/10 text-white text-xs rounded-xl focus:ring-[#ff6b00] focus:border-[#ff6b00] block w-full pl-9 p-2.5" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:opacity-95 text-white font-extrabold py-3 rounded-xl transition-all shadow-xl shadow-[#ff6b00]/25 text-xs flex items-center justify-center gap-1.5 mt-2"
            >
              <LogIn className="w-4 h-4" />
              Ingresar al Directorio
            </button>

            {/* Quick Demo Credentials Buttons */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Accesos Rápidos Demo</span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemoCredentials('admin')}
                  className="py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemoCredentials('provider')}
                  className="py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Local
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemoCredentials('delivery')}
                  className="py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1"
                >
                  <Package className="w-3.5 h-3.5" />
                  Repartidor
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemoCredentials('client')}
                  className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Cliente
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Formulario de Registro */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <UserPlus className="h-4 w-4" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="bg-[#222] border border-white/10 text-white text-xs rounded-xl focus:ring-[#ff6b00] block w-full pl-9 p-2.5" 
                  placeholder="Ej: Laura Gutiérrez" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Teléfono</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-500">
                    <Phone className="h-3.5 w-3.5" />
                  </div>
                  <input 
                    type="tel" 
                    required 
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="bg-[#222] border border-white/10 text-white text-xs rounded-xl focus:ring-[#ff6b00] block w-full pl-8 p-2.5 font-mono" 
                    placeholder="312 000 0000" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dirección Yaguará</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <input 
                    type="text" 
                    required 
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    className="bg-[#222] border border-white/10 text-white text-xs rounded-xl focus:ring-[#ff6b00] block w-full pl-8 p-2.5 truncate" 
                    placeholder="Calle 5 # 4-12" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="bg-[#222] border border-white/10 text-white text-xs rounded-xl focus:ring-[#ff6b00] block w-full pl-9 p-2.5" 
                  placeholder="laura@ejemplo.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input 
                  type="password" 
                  required 
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="bg-[#222] border border-white/10 text-white text-xs rounded-xl focus:ring-[#ff6b00] block w-full pl-9 p-2.5" 
                  placeholder="Mínimo 6 caracteres" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:opacity-95 text-white font-extrabold py-3 rounded-xl transition-all shadow-xl shadow-[#ff6b00]/25 text-xs flex items-center justify-center gap-1.5 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Crear Cuenta e Ingresar
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
