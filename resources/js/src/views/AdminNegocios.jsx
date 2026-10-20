import React from 'react';
import { CheckCircle2, XCircle, FileText } from 'lucide-react';
import { useAdminStore } from '../store/useAdminStore';

export default function AdminNegocios() {
  const { verifications, fetchVerifications, approveVerification, rejectVerification } = useAdminStore();
  const pendingKYC = verifications.filter(v => v.status === 'pending').length;

  React.useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  return (
    <div className="space-y-6 font-sans pb-12">
      <div className="bg-[#0f172a] rounded-[2rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b00]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Gestión de Negocios</h1>
          <p className="text-gray-400 font-medium">Verificación de documentos, aprobaciones y control de proveedores.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-xl">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Aprobaciones Pendientes ({pendingKYC})</h2>
        {pendingKYC === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-slate-500 font-bold text-lg">No hay verificaciones pendientes.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {verifications.filter(v => v.status === 'pending').map(v => (
              <div key={v.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                    <FileText className="w-6 h-6 text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-extrabold text-lg text-slate-900">{v.businessName}</h4>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded uppercase font-black tracking-widest">PENDING</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">
                      Solicitante: <span className="text-slate-700">{v.applicantName}</span> • {v.municipality} ({v.categoryName})
                    </p>
                    <p className="text-sm text-slate-500 font-bold mb-1">
                      Doc: {v.documentType} (#{v.documentNumber})
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 w-full lg:w-auto mt-2 lg:mt-0 pt-4 lg:pt-0 border-t border-slate-100 lg:border-0 pl-0 lg:pl-4">
                  <button 
                    onClick={() => approveVerification(v.id)}
                    className="flex-1 lg:flex-none px-6 py-3 bg-[#00a859] hover:bg-[#00a859]/90 text-white rounded-full text-sm font-bold shadow-lg shadow-[#00a859]/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Aprobar
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
    </div>
  );
}
