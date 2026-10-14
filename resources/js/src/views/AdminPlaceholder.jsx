import React from 'react';
import { Construction } from 'lucide-react';

export default function AdminPlaceholder({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-[#0f172a] rounded-[2rem] border border-white/5 shadow-2xl mt-6">
      <Construction className="w-16 h-16 text-[#ffb020] mb-4 opacity-80" />
      <h2 className="text-3xl font-black text-white mb-2">{title}</h2>
      <p className="text-gray-400 font-medium">Esta sección está en desarrollo activo.</p>
    </div>
  );
}
