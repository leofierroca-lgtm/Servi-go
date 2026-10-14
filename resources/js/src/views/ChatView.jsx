import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Send, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useAdminStore } from '../store/useAdminStore';

const INITIAL_MESSAGES = [
  { id: 1, text: "Hola, me interesa el servicio de plomería.", sender: 'client', time: '10:00 AM' },
  { id: 2, text: "¡Hola! Claro, con gusto le colaboramos. ¿En qué barrio se encuentra?", sender: 'provider', time: '10:05 AM' }
];

export default function ChatView() {
  const { role } = useAuthStore();
  const location = useLocation();
  const business = location.state?.business || { name: 'Servicio Local' };
  
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [showDealPanel, setShowDealPanel] = useState(false);
  const [dealAmount, setDealAmount] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  
  const addDeal = useAdminStore(state => state.addDeal);

  // Los administradores no tienen acceso al chat — solo moderación
  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      text: newMessage, 
      sender: role === 'provider' ? 'provider' : 'client', 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }]);
    setNewMessage('');
  };

  const handleConfirmDeal = () => {
    const amount = parseInt(dealAmount.replace(/\D/g, ''));
    if (isNaN(amount) || amount <= 0) return;
    
    setMessages([...messages, {
      id: Date.now(),
      isDeal: true,
      status: 'pending_payment',
      amount,
      commission: amount * 0.05,
      sender: 'provider',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }]);
    setShowDealPanel(false);
    setDealAmount('');
  };

  const handlePay = (messageId) => {
    setIsPaying(true);
    const msg = messages.find(m => m.id === messageId);
    if (!msg) return;

    // Inicializar Wompi Widget
    const checkout = new window.WidgetCheckout({
      currency: 'COP',
      amountInCents: msg.amount * 100, // Wompi requiere centavos
      reference: `SG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      publicKey: 'pub_test_Q5yDA9xoKdePzhSGeZaQS1C8sBTIpIQG', // Llave Pública de Pruebas
      redirectUrl: '' // Opcional, lo manejamos por callback
    });

    checkout.open(function (result) {
      setIsPaying(false);
      const transaction = result.transaction;

      if (transaction.status === 'APPROVED') {
        // Actualizar mensaje a pagado
        setMessages(messages.map(m => 
          m.id === messageId ? { ...m, status: 'paid' } : m
        ));
        
        // Registrar en el sistema (Administrador)
        addDeal({
          id: transaction.id || `deal_${Date.now()}`,
          conversationId: 'chat_current',
          providerId: 'prov_current',
          providerName: business.name,
          consumerName: 'Cliente Anónimo',
          title: 'Servicio Acordado en Chat',
          amount: msg.amount,
          commissionRate: 0.05,
          commissionAmount: msg.commission,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          municipality: 'Yaguará'
        });
      } else {
        alert('El pago no fue aprobado. Estado: ' + transaction.status);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] bg-[#151515] rounded-3xl shadow-2xl border border-white/5 flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#222]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#ff6b00]/20 flex items-center justify-center text-[#ff6b00] font-bold">
            {role === 'provider' ? 'C' : 'P'}
          </div>
          <div>
            <h3 className="font-bold text-white">{role === 'provider' ? 'Cliente Anónimo' : business.name}</h3>
            <p className="text-xs text-green-400 font-medium">En línea</p>
          </div>
        </div>
        {role === 'provider' && (
          <button 
            onClick={() => setShowDealPanel(!showDealPanel)}
            className="bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors"
          >
            Enviar Cotización
          </button>
        )}
      </div>

      {/* Deal Panel */}
      {showDealPanel && (
        <div className="bg-[#ff6b00]/10 p-4 border-b border-[#ff6b00]/20 animate-in slide-in-from-top">
          <h4 className="font-bold text-[#ff6b00] mb-2">Enviar Cotización de Servicio</h4>
          <div className="flex space-x-2">
            <input 
              type="number" 
              placeholder="Valor acordado (COP)" 
              value={dealAmount}
              onChange={(e) => setDealAmount(e.target.value)}
              className="flex-1 p-2.5 rounded-xl bg-[#222] text-white border border-white/10 focus:outline-none focus:border-[#ff6b00]/50"
            />
            <button onClick={handleConfirmDeal} className="bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-bold py-2 px-5 rounded-xl">
              Enviar al Cliente
            </button>
          </div>
          <p className="text-xs text-[#ff6b00]/70 mt-2">La comisión de la plataforma (5%) se calculará automáticamente al confirmar el pago.</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f0f11]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${((role === 'provider' && msg.sender === 'provider') || (role !== 'provider' && msg.sender === 'client')) ? 'justify-end' : 'justify-start'}`}>
            {msg.isDeal ? (
              <div className="bg-[#ff6b00]/10 border border-[#ff6b00]/20 p-4 rounded-2xl w-3/4 md:w-1/2">
                <div className={`flex items-center space-x-2 mb-2 ${msg.status === 'paid' ? 'text-green-500' : 'text-[#ff6b00]'}`}>
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold">{msg.status === 'paid' ? 'Servicio Pagado' : 'Cotización Pendiente'}</span>
                </div>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Total a pagar:</span>
                    <span className="font-bold text-white">${msg.amount.toLocaleString('es-CO')}</span>
                  </div>
                  {msg.status === 'paid' && role === 'provider' && (
                    <div className="flex justify-between text-xs opacity-70">
                      <span>Comisión Servi-Go deducida (5%):</span>
                      <span className="text-yellow-500">-${msg.commission.toLocaleString('es-CO')}</span>
                    </div>
                  )}
                </div>
                {msg.status === 'pending_payment' && role === 'client' && (
                  <button 
                    onClick={() => handlePay(msg.id)}
                    disabled={isPaying}
                    className="mt-4 w-full bg-[#00a859] hover:bg-[#00a859]/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg"
                  >
                    {isPaying ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Procesando pago...</>
                    ) : (
                      <><CreditCard className="w-5 h-5 mr-2" /> Pagar Ahora con Wompi</>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className={`max-w-[70%] p-3.5 rounded-2xl ${((role === 'provider' && msg.sender === 'provider') || (role !== 'provider' && msg.sender === 'client')) ? 'bg-[#ff6b00] text-white rounded-br-none' : 'bg-[#222] border border-white/5 text-gray-200 rounded-bl-none'}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] block mt-1.5 ${((role === 'provider' && msg.sender === 'provider') || (role !== 'provider' && msg.sender === 'client')) ? 'text-white/70' : 'text-gray-500'}`}>{msg.time}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#151515] border-t border-white/5">
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Escribe un mensaje..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-[#222] text-white border border-white/10 rounded-full px-5 py-3 focus:outline-none focus:border-[#ff6b00]/50"
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 rounded-full bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white flex items-center justify-center transition-colors flex-shrink-0 shadow-lg shadow-[#ff6b00]/20"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
