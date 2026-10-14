import React from 'react';
import { X, MessageSquare, ShoppingBag, CheckCircle2, ChevronRight } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function ProviderInboxModal({ isOpen, onClose, providerName }) {
  if (!isOpen) return null;

  const mockInbox = [
    {
      id: 1,
      type: 'chat',
      customer: 'Carlos Mendoza',
      avatar: 'https://i.pravatar.cc/150?img=11',
      preview: 'Hola, ¿tienen disponibilidad de Quesillo de kilo para hoy?',
      time: 'Hace 5 min',
      unread: true
    },
    {
      id: 2,
      type: 'order',
      customer: 'Laura Morales',
      avatar: 'https://i.pravatar.cc/150?img=47',
      preview: 'Pedido Confirmado: Combo Yaguareño + Domicilio',
      amount: '$22.000',
      time: 'Hace 1 hora',
      unread: false
    },
    {
      id: 3,
      type: 'chat',
      customer: 'Andrés Felipe',
      avatar: 'https://i.pravatar.cc/150?img=14',
      preview: 'Muchas gracias, todo llegó perfecto y caliente.',
      time: 'Ayer',
      unread: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#151515]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00c853]/20 text-[#00c853] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Bandeja de Entrada</h2>
              <p className="text-xs text-gray-400">Mensajes y Pedidos Recibidos</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-2">
          {mockInbox.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 mx-2 my-2 rounded-2xl flex items-start gap-4 cursor-pointer transition-all border ${
                item.unread 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                  : 'bg-transparent border-transparent hover:bg-white/5'
              }`}
              onClick={() => {
                useAppStore.getState().setActiveChat({
                  id: `chat-${item.id}`,
                  name: item.customer,
                  avatar: item.avatar,
                  initialMessage: item.preview
                });
                onClose();
              }}
            >
              <div className="relative shrink-0">
                <img src={item.avatar} alt={item.customer} className="w-12 h-12 rounded-full object-cover bg-gray-800" />
                {item.type === 'order' ? (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#ff6b00] rounded-full border-2 border-[#111] flex items-center justify-center text-white">
                    <ShoppingBag className="w-2.5 h-2.5" />
                  </div>
                ) : (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-[#111] flex items-center justify-center text-white">
                    <MessageSquare className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <span className={`font-bold text-sm truncate ${item.unread ? 'text-white' : 'text-gray-300'}`}>
                    {item.customer}
                  </span>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                    {item.time}
                  </span>
                </div>
                <p className={`text-xs truncate ${item.unread ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                  {item.preview}
                </p>
                {item.amount && (
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-[#00c853]">
                    <CheckCircle2 className="w-3 h-3" /> Trato cerrado: {item.amount}
                  </div>
                )}
              </div>
              
              <div className="shrink-0 self-center text-gray-600">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
