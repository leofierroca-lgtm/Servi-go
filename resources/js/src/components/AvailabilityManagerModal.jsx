import React, { useState } from 'react';
import { 
  X, 
  Store, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ToggleLeft, 
  ToggleRight, 
  Package, 
  Power, 
  Sparkles,
  Info
} from 'lucide-react';
import useAvailabilityStore from '../store/useAvailabilityStore';

export default function AvailabilityManagerModal({ isOpen, onClose, provider }) {
  if (!isOpen || !provider) return null;

  const businesses = useAvailabilityStore(state => state.businesses);
  const productsState = useAvailabilityStore(state => state.products);
  const toggleBusiness = useAvailabilityStore(state => state.toggleBusiness);
  const setBusinessStatus = useAvailabilityStore(state => state.setBusinessStatus);
  const toggleProduct = useAvailabilityStore(state => state.toggleProduct);

  const businessId = provider.id;
  const isBusinessAvailable = businesses[businessId]?.isAvailable ?? true;
  const currentNote = businesses[businessId]?.note || '';
  
  const [note, setNote] = useState(currentNote);
  const [savedNote, setSavedNote] = useState(false);

  const handleSaveNote = (e) => {
    e.preventDefault();
    setBusinessStatus(businessId, isBusinessAvailable, note);
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 3000);
  };

  const handleToggleBusinessStatus = () => {
    toggleBusiness(businessId);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#151515] border border-white/10 w-full max-w-2xl rounded-3xl p-6 sm:p-8 relative shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-[#ff6b00]/20 flex items-center justify-center text-[#ff6b00] flex-shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Gestión de Disponibilidad
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Controla si <strong className="text-white">{provider.name}</strong> y sus productos están disponibles hoy
            </p>
          </div>
        </div>

        <div className="overflow-y-auto space-y-6 flex-1 pr-1">
          {/* Section 1: Business Availability */}
          <div className={`p-5 rounded-3xl border transition-all ${
            isBusinessAvailable 
              ? 'bg-green-950/20 border-green-500/30' 
              : 'bg-red-950/25 border-red-500/30'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`w-3 h-3 rounded-full ${isBusinessAvailable ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></span>
                  <span className="text-sm font-black uppercase tracking-wider text-white">
                    {isBusinessAvailable ? 'Negocio Abierto y Atendiendo Hoy' : 'Negocio No Disponible / Cerrado Hoy'}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  {isBusinessAvailable 
                    ? 'Los clientes y el chatbot pueden consultar y cerrar pedidos normalmente.' 
                    : 'Los clientes verán tu negocio como "No disponible hoy" y los pedidos quedarán pausados.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleBusinessStatus}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-2 flex-shrink-0 shadow-lg ${
                  isBusinessAvailable 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
                }`}
              >
                <Power className="w-4 h-4" />
                {isBusinessAvailable ? 'Pausar / Cerrar Hoy' : 'Abrir y Atender Hoy'}
              </button>
            </div>

            {/* Custom Note/Message for Customers */}
            <form onSubmit={handleSaveNote} className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Mensaje o motivo (ej. 'Hoy cerrado por mantenimiento, volvemos mañana')"
                className="flex-1 bg-[#1a1a1e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold rounded-xl transition-colors whitespace-nowrap"
              >
                {savedNote ? '✓ Guardado' : 'Guardar Aviso'}
              </button>
            </form>
          </div>

          {/* Section 2: Products & Dishes Availability */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#ff6b00]" />
                  Disponibilidad de Platos y Artículos
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Marca qué productos se agotaron para que los clientes y el chatbot no los ordenen
                </p>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                {provider.products?.length || 0} items
              </span>
            </div>

            <div className="space-y-2.5">
              {(provider.products || []).map((prod) => {
                const isProdInStock = productsState[prod.id]?.isAvailable ?? true;
                
                return (
                  <div 
                    key={prod.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isProdInStock 
                        ? 'bg-[#1a1a1e] border-white/5 hover:border-white/15' 
                        : 'bg-red-950/20 border-red-500/20 opacity-90'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        onError={(e) => { e.target.src = `https://picsum.photos/seed/${prod.id}/80/80`; }}
                        className={`w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0 ${
                          !isProdInStock ? 'grayscale-[50%] opacity-60' : ''
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-xs block truncate">
                            {prod.name}
                          </span>
                          {!isProdInStock && (
                            <span className="text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.2 rounded-full uppercase flex-shrink-0">
                              Agotado
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#ffcc00] block mt-0.5">
                          ${prod.price.toLocaleString('es-CO')} COP 
                          <span className="text-[10px] font-normal text-gray-400 ml-1">/ {prod.unit || 'unidad'}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleProduct(prod.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 flex-shrink-0 ${
                        isProdInStock
                          ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
                          : 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20'
                      }`}
                    >
                      {isProdInStock ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Disponible</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Agotado</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#ff6b00]/25 transition-all"
          >
            Listo / Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  );
}
