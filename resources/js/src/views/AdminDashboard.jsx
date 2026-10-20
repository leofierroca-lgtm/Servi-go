import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Shield,
  TrendingUp,
  FileText,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  MessageSquare
} from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('kyc');
  
  // Store Data
  const { 
    verifications, 
    flaggedChats, 
    deals, 
    fetchVerifications,
    approveVerification,
    rejectVerification,
    warnChat,
    resolveChat
  } = useAdminStore();

  React.useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  // Calculated Metrics
  const totalGMV = deals.reduce((acc, deal) => acc + deal.amount, 0);
  const totalCommissions = deals.reduce((acc, deal) => acc + deal.commissionAmount, 0);
  const pendingKYC = verifications.filter(v => v.status === 'pending').length;
  const unresolvedChats = flaggedChats.filter(c => c.status === 'unresolved').length;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Banner / Header */}
      <div className="bg-[#0f172a] rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-full bg-[#1e293b] border-2 border-[#ffb020] flex items-center justify-center shrink-0 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-[#ffb020]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Panel de Administración Servi-Go</h1>
            <p className="text-sm md:text-base text-gray-400 mt-1 font-medium">Validación de Prestadores • Moderación de Chats • Control de Comisiones</p>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 relative z-10">
          <span className="px-5 py-2.5 bg-[#ffb020] hover:bg-[#ffb020]/90 transition-colors cursor-pointer text-black font-extrabold text-sm rounded-full shadow-lg shadow-[#ffb020]/20">
            SuperAdmin Colombia
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Verificaciones Pendientes</h3>
          <p className="text-4xl font-black text-[#ff6b00]">{pendingKYC}</p>
          <p className="text-sm text-gray-400 font-medium mt-2">En cola de revisión</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Chats Moderados</h3>
          <p className="text-4xl font-black text-red-600">{unresolvedChats}</p>
          <p className="text-sm text-gray-400 font-medium mt-2">Riesgo fuera de app</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Ventas Plataforma (GMV)</h3>
          <p className="text-4xl font-black text-black">${totalGMV.toLocaleString('es-CO')}</p>
          <p className="text-sm text-gray-400 font-medium mt-2">Total transaccionado</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Comisiones Recaudadas</h3>
          <p className="text-4xl font-black text-[#00a859]">${totalCommissions.toLocaleString('es-CO')}</p>
          <p className="text-sm text-gray-400 font-medium mt-2">5% tarifa de servicio</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-8 border-b border-white/10 mt-10 no-scrollbar">
        <button 
          onClick={() => setActiveTab('kyc')}
          className={`pb-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'kyc' 
              ? 'border-white text-white' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Aprobaciones de Proveedores ({pendingKYC})
        </button>
        <button 
          onClick={() => setActiveTab('audit')}
          className={`pb-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'audit' 
              ? 'border-white text-white' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <Shield className="w-4 h-4" />
          Moderación de Chats ({unresolvedChats})
        </button>
        <button 
          onClick={() => setActiveTab('finance')}
          className={`pb-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'finance' 
              ? 'border-white text-white' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Métricas Globales
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        
        {/* Tab: KYC Aprobaciones */}
        {activeTab === 'kyc' && (
          <div className="animate-in fade-in duration-300">
            <p className="text-gray-400 text-sm mb-6 font-medium">Revisa la documentación adjuntada (Cédula / RUT / RETIE / Invima) para otorgar el sello verde de verificación.</p>
            
            {pendingKYC === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                <CheckCircle2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-bold text-lg">No hay verificaciones pendientes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verifications.filter(v => v.status === 'pending').map(v => (
                  <div key={v.id} className="bg-white rounded-[2rem] p-5 shadow-lg flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                    
                    <div className="flex gap-4">
                      {/* Document Icon Container */}
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                        <FileText className="w-6 h-6 text-slate-500" />
                      </div>
                      
                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-extrabold text-lg text-slate-900">{v.businessName}</h4>
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-500 text-[10px] rounded uppercase font-black tracking-widest">PENDING</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mb-1">
                          Solicitante: <span className="text-slate-700">{v.applicantName}</span> • {v.municipality} ({v.categoryName})
                        </p>
                        <p className="text-sm text-slate-500 font-bold mb-1">
                          Doc: {v.documentType} (#{v.documentNumber})
                        </p>
                        {v.notes && (
                          <p className="text-xs text-slate-400 font-medium italic">
                            Nota auditoría: "{v.notes}"
                          </p>
                        )}
                        {!v.notes && (
                          <p className="text-xs text-slate-400 font-medium italic">
                            Nota auditoría: "Documentos radicados, pendientes de validación."
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 w-full lg:w-auto mt-2 lg:mt-0 pt-4 lg:pt-0 border-t border-slate-100 lg:border-0 pl-0 lg:pl-4">
                      <button 
                        onClick={() => approveVerification(v.id)}
                        className="flex-1 lg:flex-none px-6 py-3 bg-[#00a859] hover:bg-[#00a859]/90 text-white rounded-full text-sm font-bold shadow-lg shadow-[#00a859]/20 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Aprobar y Verificar
                      </button>
                      <button 
                        onClick={() => rejectVerification(v.id, 'Rechazado manualmente')}
                        className="flex-1 lg:flex-none px-6 py-3 bg-white border-2 border-red-500 hover:bg-red-50 text-red-500 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Rechazar
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Auditoría */}
        {activeTab === 'audit' && (
          <div className="animate-in fade-in duration-300">
            <p className="text-gray-400 text-sm mb-6 font-medium">Revisa las conversaciones marcadas automáticamente por evasión de comisiones.</p>
            
            {unresolvedChats === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
                <CheckCircle2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-bold text-lg">No hay alertas de chat pendientes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {flaggedChats.filter(c => c.status === 'unresolved').map(chat => (
                  <div key={chat.id} className="bg-white rounded-[2rem] p-6 shadow-lg">
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
        )}

        {/* Tab: Finanzas */}
        {activeTab === 'finance' && (
          <div className="animate-in fade-in duration-300 bg-white rounded-[2rem] p-6 shadow-xl overflow-hidden">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6">Historial de Tratos y Comisiones</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-200">
                  <tr>
                    <th className="px-5 py-4 font-black">ID Trato</th>
                    <th className="px-5 py-4 font-black">Fecha</th>
                    <th className="px-5 py-4 font-black">Comercio / Proveedor</th>
                    <th className="px-5 py-4 font-black">Cliente</th>
                    <th className="px-5 py-4 font-black text-right">GMV (Total)</th>
                    <th className="px-5 py-4 font-black text-right">Comisión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deals.map(deal => (
                    <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-5 font-mono text-xs font-bold text-slate-400">{deal.id}</td>
                      <td className="px-5 py-5 font-medium">{new Date(deal.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-5 font-extrabold text-slate-900">{deal.providerName}</td>
                      <td className="px-5 py-5 font-medium">{deal.consumerName}</td>
                      <td className="px-5 py-5 text-right font-bold text-slate-900">${deal.amount.toLocaleString('es-CO')}</td>
                      <td className="px-5 py-5 text-right font-black text-[#00a859]">${deal.commissionAmount.toLocaleString('es-CO')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
