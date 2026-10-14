import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Smartphone } from 'lucide-react';

export default function AdminAjustes() {
  const [comision, setComision] = useState(5);
  const [notificaciones, setNotificaciones] = useState(true);

  return (
    <div className="space-y-6 font-sans pb-12">
      <div className="bg-[#0f172a] rounded-[2rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Ajustes del Sistema</h1>
          <p className="text-gray-400 font-medium">Configuración general de la plataforma y reglas de negocio.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-xl max-w-3xl">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#ff6b00]" /> Configuración General
        </h2>
        
        <div className="space-y-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" /> Tarifas de Comisión
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-600 mb-1">Porcentaje de comisión base (%)</label>
                <input 
                  type="number" 
                  value={comision} 
                  onChange={(e) => setComision(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-slate-500 flex-1">
                Este porcentaje se aplicará automáticamente a todos los tratos confirmados en la plataforma.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-500" /> Alertas del Sistema
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Notificaciones de Moderación</p>
                <p className="text-xs text-slate-500 mt-1">Recibir alertas en tiempo real sobre intentos de evasión.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notificaciones}
                  onChange={(e) => setNotificaciones(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00a859]"></div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white rounded-full font-bold shadow-lg shadow-[#ff6b00]/20 transition-all">
              <Save className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
