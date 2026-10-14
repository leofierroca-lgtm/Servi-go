import React from 'react';
import { useAdminStore } from '../store/useAdminStore';

export default function AdminReportes() {
  const { deals } = useAdminStore();

  const totalGMV = deals.reduce((acc, deal) => acc + deal.amount, 0);
  const totalCommissions = deals.reduce((acc, deal) => acc + deal.commissionAmount, 0);

  return (
    <div className="space-y-6 font-sans pb-12">
      <div className="bg-[#0f172a] rounded-[2rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <div className="relative z-10 mb-6 md:mb-0">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Reportes y Finanzas</h1>
          <p className="text-gray-400 font-medium">Transacciones, GMV y control de comisiones de la plataforma.</p>
        </div>
        <div className="relative z-10 flex gap-4">
           <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 text-center">
             <p className="text-gray-400 text-xs font-bold uppercase mb-1">GMV Total</p>
             <p className="text-2xl font-black text-white">${totalGMV.toLocaleString('es-CO')}</p>
           </div>
           <div className="bg-[#00a859]/20 px-6 py-3 rounded-2xl border border-[#00a859]/30 text-center">
             <p className="text-[#00a859] text-xs font-bold uppercase mb-1">Comisiones</p>
             <p className="text-2xl font-black text-[#00a859]">${totalCommissions.toLocaleString('es-CO')}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 shadow-xl overflow-hidden">
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
    </div>
  );
}
