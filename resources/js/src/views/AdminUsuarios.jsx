import React from 'react';
import { ShieldCheck, AlertOctagon, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';

export default function AdminUsuarios() {
  const { flaggedChats, warnChat, resolveChat } = useAdminStore();
  const unresolvedChats = flaggedChats.filter(c => c.status === 'unresolved').length;

  return (
    <div className="space-y-6 font-sans pb-12">
      <div className="bg-[#0f172a] rounded-[2rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Moderación de Usuarios</h1>
          <p className="text-gray-400 font-medium">Revisa las conversaciones marcadas automáticamente por evasión de comisiones.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-xl">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Alertas Pendientes ({unresolvedChats})</h2>
        {unresolvedChats === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-slate-500 font-bold text-lg">No hay alertas de chat pendientes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedChats.filter(c => c.status === 'unresolved').map(chat => (
              <div key={chat.id} className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-red-100 rounded-2xl shrink-0">
                      <AlertOctagon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-red-600 text-lg">{chat.flaggedReason}</h4>
                      <p className="text-sm text-slate-500 font-medium mt-1">
                        Chat ID: <span className="font-mono text-slate-800">{chat.conversationId}</span> • Proveedor: <span className="font-bold text-slate-800">{chat.providerName}</span> • Cliente: <span className="font-bold text-slate-800">{chat.consumerName}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black rounded uppercase tracking-wider">Alta Prioridad</span>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
                  <div className="flex items-center gap-2 mb-3 text-xs font-black text-slate-400 uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4" /> Fragmento Detectado
                  </div>
                  <p className="text-base text-slate-800 font-mono italic">
                    "{chat.snippet.split(new RegExp(`(${chat.detectedKeyword})`, 'gi')).map((part, i) => 
                      part.toLowerCase() === chat.detectedKeyword.toLowerCase() 
                        ? <span key={i} className="bg-red-200 text-red-800 px-1 rounded font-bold">{part}</span> 
                        : part
                    )}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => warnChat(chat.id)}
                    className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-bold shadow-lg shadow-red-600/20 transition-colors"
                  >
                    Emitir Advertencia Sancionatoria
                  </button>
                  <button 
                    onClick={() => resolveChat(chat.id)}
                    className="flex-1 py-3.5 bg-white border-2 border-slate-300 text-slate-700 rounded-full text-sm font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Marcar como Falso Positivo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
