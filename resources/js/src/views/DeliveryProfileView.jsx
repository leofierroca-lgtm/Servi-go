import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import useDeliveryStore from '../store/useDeliveryStore';
import { 
  Package, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Camera, 
  Clock,
  Navigation,
  X,
  TrendingUp,
  Star,
  Map,
  Bike,
  ShieldCheck,
  Zap,
  Banknote,
  Store,
  AlertTriangle,
  Wallet,
  Power,
  Navigation2
} from 'lucide-react';

export default function DeliveryProfileView() {
  const deliveries = useDeliveryStore(state => state.deliveries);
  const markAsDeliveredStore = useDeliveryStore(state => state.markAsDelivered);
  const updateDeliveryStatus = useDeliveryStore(state => state.updateDeliveryStatus);
  
  const [showScanner, setShowScanner] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'history'
  const [isOnline, setIsOnline] = useState(true);
  const [showWallet, setShowWallet] = useState(false);

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("reader", { 
        qrbox: { width: 250, height: 250 }, 
        fps: 10,
        aspectRatio: 1.0 
      });

      scanner.render(
        (decodedText) => {
          scanner.clear();
          setShowScanner(false);
          handleScanSuccess(decodedText);
        },
        (error) => {
          // Ignore frequent scanning errors
        }
      );

      return () => {
        scanner.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error));
      };
    }
  }, [showScanner]);

  const handleScanSuccess = (text) => {
    try {
      const url = new URL(text);
      const orderId = url.searchParams.get('orderId');
      if (orderId) {
        setScannedResult(orderId);
        markAsDelivered(orderId);
      } else {
        alert("Código QR inválido para confirmación de entrega.");
      }
    } catch (e) {
      setScannedResult(text);
      markAsDelivered(text);
    }
  };

  const markAsDelivered = (orderId) => {
    markAsDeliveredStore(orderId);
    // Pequeño delay para mostrar un mensaje bonito
    setTimeout(() => {
      alert(`✅ ¡Entrega y Pago Confirmados para el pedido ${orderId}! Has sumado $3,000 a tus ganancias.`);
    }, 500);
  };

  const handleStatusChange = (id, newStatus) => {
    updateDeliveryStatus(id, newStatus);
  };

  const activeDeliveries = deliveries.filter(d => d.deliveryStatus !== 'delivered');
  const pastDeliveries = deliveries.filter(d => d.deliveryStatus === 'delivered');

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-br from-[#1a1a24] via-[#11111a] to-[#0a0a0a] border-b border-white/10 pt-8 pb-12 px-4 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6b00]/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Driver Identity */}
            <div className="flex items-center gap-5">
              <div className="relative group cursor-pointer">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#ff6b00] to-blue-500 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-full border-4 border-[#1a1a24] overflow-hidden bg-black">
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" alt="Driver" className="w-full h-full object-cover" />
                  </div>
                </div>
                <button 
                  onClick={() => setIsOnline(!isOnline)}
                  className={`absolute -bottom-2 -right-2 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border-2 border-[#1a1a24] flex items-center gap-1.5 shadow-lg transition-colors ${isOnline ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                >
                  <div className={`w-2 h-2 rounded-full bg-white ${isOnline ? 'animate-pulse' : ''}`}></div>
                  {isOnline ? 'Online' : 'Offline'}
                </button>
              </div>
              
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Juan Pérez</h1>
                <p className="text-[#ff6b00] font-bold text-sm flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="w-4 h-4" /> Repartidor Verificado
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Bike className="w-3.5 h-3.5" /> Moto Honda CB125</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Zona Yaguará</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 w-full md:w-auto">
              <button 
                onClick={() => setShowWallet(true)}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 text-center hover:bg-white/10 hover:border-green-500/50 transition-all group"
                title="Ver Billetera"
              >
                <div className="flex items-center justify-center gap-1 text-green-400 mb-1 group-hover:scale-105 transition-transform">
                  <Wallet className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Mi Billetera</span>
                </div>
                <p className="text-xl md:text-2xl font-black text-white">$45K</p>
              </button>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 text-center hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Viajes</span>
                </div>
                <p className="text-xl md:text-2xl font-black text-white">{pastDeliveries.length}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 text-center hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-center gap-1 text-[#ffcc00] mb-1">
                  <Star className="w-4 h-4 fill-[#ffcc00]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Rating</span>
                </div>
                <p className="text-xl md:text-2xl font-black text-white">4.9</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20">
        
        {/* Tabs */}
        <div className="flex bg-[#1f1f24] p-1 rounded-xl border border-white/10 mb-6 shadow-xl w-full max-w-sm mx-auto md:mx-0">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'active' ? 'bg-[#ff6b00] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            <Zap className={`w-4 h-4 ${activeTab === 'active' ? 'fill-white' : ''}`} />
            En Curso ({activeDeliveries.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-[#ff6b00] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Completados
          </button>
        </div>

        {/* Active Deliveries View */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            {activeDeliveries.length === 0 ? (
              <div className="bg-[#151515] rounded-3xl border border-white/5 p-12 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sin pedidos activos</h3>
                <p className="text-gray-400">Estás en línea. Te notificaremos cuando haya un nuevo domicilio disponible en tu zona.</p>
              </div>
            ) : (
              activeDeliveries.map((delivery, index) => (
                <div key={delivery.id} className="bg-[#151515] rounded-3xl border border-white/10 overflow-hidden shadow-2xl group hover:border-white/20 transition-colors relative">
                  
                  {/* Status Indicator Bar */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${delivery.deliveryStatus === 'in_transit' ? 'bg-blue-500' : 'bg-[#ff6b00]'}`}></div>

                  <div className="p-5 md:p-6 pl-6 md:pl-8">
                    
                    {/* Header: ID & Status */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-white/10 text-white px-2 py-0.5 rounded text-xs font-mono font-bold border border-white/5">
                            #{delivery.id}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {delivery.time}
                          </span>
                        </div>
                        {delivery.deliveryStatus === 'in_transit' ? (
                          <h3 className="text-xl font-black text-white flex items-center gap-2">
                            <Navigation className="w-5 h-5 text-blue-500" /> En camino al cliente
                          </h3>
                        ) : (
                          <h3 className="text-xl font-black text-white flex items-center gap-2">
                            <Store className="w-5 h-5 text-[#ff6b00]" /> Ir a recoger pedido
                          </h3>
                        )}
                      </div>
                      <div className="bg-[#1f1f24] px-3 py-2 rounded-xl text-center border border-white/5">
                        <span className="block text-[10px] text-gray-500 uppercase font-bold mb-0.5">Distancia</span>
                        <span className="text-sm font-black text-white">{delivery.distance}</span>
                      </div>
                    </div>

                    {/* Routing Info (Pickup -> Dropoff) */}
                    <div className="relative pl-6 mb-8">
                      {/* Tracking Line */}
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-gray-600 to-gray-800"></div>
                      
                      {/* Pickup Point */}
                      <div className="relative mb-6">
                        <div className={`absolute -left-8 top-0.5 w-5 h-5 rounded-full border-4 border-[#151515] flex items-center justify-center z-10 ${delivery.deliveryStatus === 'pending_pickup' ? 'bg-[#ff6b00]' : 'bg-green-500'}`}>
                          {delivery.deliveryStatus !== 'pending_pickup' && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Punto de Recogida</h4>
                        <div className="flex flex-col gap-2">
                          <div>
                            <p className="text-white font-bold text-lg leading-tight">{delivery.businessName}</p>
                            <p className="text-gray-400 text-sm mt-0.5">{delivery.businessAddress}</p>
                          </div>
                          <a href={`https://waze.com/ul?q=${encodeURIComponent(delivery.businessAddress + ' Yaguará')}&navigate=yes`} target="_blank" rel="noreferrer" className="w-full py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-sm flex items-center justify-center gap-2 border border-blue-500/30 transition-colors mt-1" title="Ruta hacia el negocio (Waze)">
                            <Navigation2 className="w-4 h-4" />
                            Navegar al negocio (Waze)
                          </a>
                        </div>
                      </div>

                      {/* Dropoff Point */}
                      <div className="relative">
                        <div className={`absolute -left-8 top-0.5 w-5 h-5 rounded-full border-4 border-[#151515] flex items-center justify-center z-10 ${delivery.deliveryStatus === 'in_transit' ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Punto de Entrega</h4>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-white font-bold text-lg leading-tight flex items-center gap-2">
                              {delivery.customerName}
                            </p>
                            <p className="text-gray-400 text-sm mt-0.5 max-w-xs">{delivery.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          {delivery.deliveryStatus === 'in_transit' && (
                            <a href={`tel:${delivery.phone.replace(/\s/g,'')}`} className="flex-1 py-2.5 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold text-sm flex items-center justify-center gap-2 border border-green-500/30 transition-colors" title="Llamar al cliente">
                              <Phone className="w-4 h-4" /> Llamar
                            </a>
                          )}
                          <a href={`https://waze.com/ul?q=${encodeURIComponent(delivery.address + ' Yaguará')}&navigate=yes`} target="_blank" rel="noreferrer" className="flex-[2] py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-sm flex items-center justify-center gap-2 border border-blue-500/30 transition-colors" title="Ruta hacia el cliente (Waze)">
                            <Navigation2 className="w-4 h-4" /> Navegar al cliente (Waze)
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                      
                      {/* Payment Details */}
                      <div className="flex items-center gap-4 w-full md:w-auto bg-[#1a1a24] p-4 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center shrink-0">
                          <Banknote className="w-6 h-6 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase">Cobro al cliente</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-white">${delivery.total.toLocaleString('es-CO')}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${delivery.paymentStatus === 'Pendiente' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                              {delivery.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="w-full md:w-auto flex-1 md:flex-none space-y-3">
                        {delivery.deliveryStatus === 'pending_pickup' && (
                          <button 
                            onClick={() => handleStatusChange(delivery.id, 'in_transit')}
                            className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-wide rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <Package className="w-5 h-5" /> Ya recogí el pedido
                          </button>
                        )}
                        
                        {delivery.deliveryStatus === 'in_transit' && delivery.paymentMethod === 'Efectivo' && delivery.paymentStatus === 'Pendiente' && (
                          <button 
                            onClick={() => setShowScanner(true)}
                            className="w-full px-8 py-4 bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:scale-105 text-white font-black text-sm uppercase tracking-wide rounded-xl shadow-xl shadow-[#ff6b00]/20 transition-all flex items-center justify-center gap-2 group"
                          >
                            <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                            Escanear QR para Cobrar
                          </button>
                        )}

                        {delivery.deliveryStatus === 'in_transit' && delivery.paymentMethod !== 'Efectivo' && (
                          <button 
                            onClick={() => markAsDelivered(delivery.id)}
                            className="w-full px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-black text-sm uppercase tracking-wide rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-5 h-5" /> Finalizar Entrega
                          </button>
                        )}

                        <button 
                          onClick={() => alert('Conectando con soporte para reportar incidencia con el pedido ' + delivery.id)}
                          className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Reportar un Problema
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* History View */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {pastDeliveries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay entregas completadas hoy.</p>
            ) : (
              pastDeliveries.map(delivery => (
                <div key={delivery.id} className="bg-[#151515] rounded-2xl border border-white/5 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">#{delivery.id} - {delivery.customerName}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{delivery.businessName} • {delivery.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-black text-sm">${delivery.total.toLocaleString('es-CO')}</p>
                    <p className="text-green-400 text-xs font-bold mt-0.5">Completado</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Modern Fullscreen Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
          
          <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start z-10">
            <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 border border-white/10 max-w-[250px]">
              <h3 className="font-black text-white text-lg leading-tight mb-1">Escanea la Factura</h3>
              <p className="text-xs text-gray-400 leading-tight">Alinea el código QR del cliente dentro del marco para confirmar pago en Efectivo.</p>
            </div>
            <button 
              onClick={() => setShowScanner(false)}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors border border-white/20 backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative w-full max-w-sm mx-auto p-4 mt-16">
            {/* The Scanner */}
            <div className="rounded-3xl overflow-hidden border-4 border-[#ff6b00] shadow-[0_0_50px_rgba(255,107,0,0.3)] bg-black relative">
              <div id="reader" className="w-full h-full object-cover"></div>
              {/* Scan Line Animation Overlay */}
              <div className="absolute left-0 right-0 top-0 h-1 bg-[#ff6b00] shadow-[0_0_15px_#ff6b00] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
          
          <div className="mt-8 text-center px-6">
            <div className="inline-flex items-center gap-2 bg-[#ff6b00]/20 text-[#ff6b00] px-4 py-2 rounded-full font-bold text-sm border border-[#ff6b00]/30 animate-pulse">
              <Camera className="w-4 h-4" /> Buscando código QR...
            </div>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {showWallet && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-[#1a1a24] w-full max-w-md sm:rounded-[2rem] rounded-t-[2rem] p-6 border border-white/10 shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-white text-xl flex items-center gap-2">
                <Wallet className="w-6 h-6 text-green-400" /> Mi Billetera
              </h3>
              <button onClick={() => setShowWallet(false)} className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-6 text-center border border-green-500/30 mb-6">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Saldo Disponible</p>
              <h2 className="text-4xl font-black text-white">$45,000</h2>
            </div>
            
            <button 
              onClick={() => {
                alert('Solicitud de retiro enviada. El dinero llegará a tu Nequi/Daviplata al final del día.');
                setShowWallet(false);
              }}
              className="w-full bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-black py-4 rounded-xl shadow-lg transition-colors"
            >
              Retirar a mi Cuenta
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </div>
  );
}
