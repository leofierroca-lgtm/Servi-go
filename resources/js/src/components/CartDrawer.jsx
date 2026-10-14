import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  MessageCircle, 
  Wallet, 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Copy, 
  Check, 
  ShoppingBag, 
  User, 
  Phone, 
  MapPin, 
  Receipt,
  CreditCard,
  Building,
  DollarSign,
  Store,
  Bike
} from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import FacturaElectronicaCard from './FacturaElectronicaCard';

const PAYMENT_METHODS = [
  { 
    id: 'nequi', 
    name: 'Nequi', 
    bg: 'bg-[#190445]', 
    text: 'text-white', 
    border: 'border-[#400B96]',
    accountType: 'Número Nequi',
    accountNumber: '315 892 3456',
    holder: 'Negocio Verificado Servi-Go'
  },
  { 
    id: 'daviplata', 
    name: 'Daviplata', 
    bg: 'bg-[#E70012]/15', 
    text: 'text-[#E70012]', 
    border: 'border-[#E70012]/40',
    accountType: 'Número Daviplata',
    accountNumber: '315 892 3456',
    holder: 'Negocio Verificado Servi-Go'
  },
  { 
    id: 'bancos', 
    name: 'Bancos / PSE', 
    bg: 'bg-blue-500/15', 
    text: 'text-blue-400', 
    border: 'border-blue-500/40',
    accountType: 'Bancolombia Ahorros',
    accountNumber: '982-748291-04',
    holder: 'Servi-Go Pagos Digitales'
  },
  { 
    id: 'efectivo', 
    name: 'Efectivo Contra Entrega', 
    bg: 'bg-green-500/15', 
    text: 'text-green-400', 
    border: 'border-green-500/40',
    accountType: 'Pago Físico',
    accountNumber: 'Pagas al recibir',
    holder: 'Entrega directa en tu domicilio'
  }
];

export default function CartDrawer() {
  const items = useCartStore(state => state.items);
  const isOpen = useCartStore(state => state.isOpen);
  const toggleCart = useCartStore(state => state.toggleCart);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);
  const setActiveChat = useAppStore(state => state.setActiveChat);

  // Steps: 'cart' | 'checkout' | 'success'
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [selectedPayment, setSelectedPayment] = useState('nequi');
  const [voucherPreview, setVoucherPreview] = useState(null);
  const [copied, setCopied] = useState(false);

  const { user, isAuthenticated, setAuthModalOpen } = useAuthStore();
  const registeredName = user?.name || 'Carlos Mendoza';
  const registeredPhone = user?.phone || '318 765 4321';
  const defaultAddress = user?.address || 'Carrera 4 # 5-20, Centro, Yaguará';

  const [deliveryAddress, setDeliveryAddress] = useState(defaultAddress);
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  const [distanceKm, setDistanceKm] = useState(3.5); // Simulated distance for demo
  const [deliveryMode, setDeliveryMode] = useState('delivery'); // 'delivery' | 'pickup'

  useEffect(() => {
    if (user?.address) {
      setDeliveryAddress(user.address);
    }
  }, [user]);

  // Confirmed Order Result
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const subtotalProducts = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFeeCalc = distanceKm ? 2000 + (Math.max(0, Math.ceil(distanceKm) - 2) * 1000) : 0;
  const deliveryFee = deliveryMode === 'delivery' ? deliveryFeeCalc : 0;
  const total = subtotalProducts + deliveryFee;

  const currentPaymentInfo = PAYMENT_METHODS.find(p => p.id === selectedPayment) || PAYMENT_METHODS[0];

  const handleVoucherUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVoucherPreview(URL.createObjectURL(file));
    }
  };

  const handleCopyAccount = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Direct Cart Payment Confirmation (Independent from Chat)
  const handleDirectPayment = (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const orderId = `FE-${orderNumber}`;
    const provider = items[0]?.provider || { name: 'Comercio Servi-Go' };
    const subtotal = Math.round(total / 1.08);
    const tax = total - subtotal;
    const cufe = `cufe-dian-${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}e2026`;

    const deliveryPersonInfo = deliveryMode === 'delivery' ? {
      name: 'Andrés López',
      phone: '321 987 6543',
      vehicle: 'Moto Honda CB125',
      plate: 'YUI-98C'
    } : null;

    const newOrder = {
      orderId,
      orderNumber,
      cufe,
      items: [...items],
      subtotal: subtotalProducts,
      tax,
      deliveryFee,
      deliveryMode,
      distanceKm: deliveryMode === 'delivery' ? distanceKm : 0,
      total,
      paymentMethod: currentPaymentInfo.name,
      paymentType: currentPaymentInfo.type,
      paymentId: currentPaymentInfo.id,
      voucher: voucherPreview,
      customerName: registeredName,
      customerCedula: '1.075.284.912',
      customerPhone: registeredPhone,
      customerAddress: deliveryMode === 'delivery' ? deliveryAddress : 'Recoge en tienda',
      businessName: provider.name,
      businessNit: `901.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}-1`,
      dianResolution: '187640291884 de 2026',
      provider,
      deliveryPerson: deliveryPersonInfo,
      date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setConfirmedOrder(newOrder);
    clearCart();
    setCheckoutStep('success');
  };

  const handleClose = () => {
    toggleCart();
    if (checkoutStep === 'success') {
      setCheckoutStep('cart');
      setVoucherPreview(null);
      setConfirmedOrder(null);
    }
  };

  const handleOpenChatWithSeller = () => {
    if (confirmedOrder?.provider) {
      setActiveChat({
        ...confirmedOrder.provider,
        initialMessage: `¡Hola! Acabo de pagar directamente por el carrito el pedido #${confirmedOrder.id} ($${confirmedOrder.total.toLocaleString('es-CO')} COP). ¿Podrían confirmarme el tiempo estimado de entrega?`
      });
      toggleCart();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity" onClick={handleClose} />
      
      <div className="fixed inset-y-0 right-0 z-[60] w-full max-w-md bg-[#141416] shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/10 bg-[#1a1a1e]">
          <div className="flex items-center space-x-2">
            {checkoutStep === 'checkout' && (
              <button 
                onClick={() => setCheckoutStep('cart')}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 mr-1 transition-colors"
                title="Volver a la lista de productos"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-[#ff6b00]" />
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {checkoutStep === 'cart' && 'Tu Carrito de Compras'}
                {checkoutStep === 'checkout' && 'Pagar Compra Directa'}
                {checkoutStep === 'success' && '¡Pedido Pagado y Confirmado!'}
              </h2>
              <span className="text-[10px] text-gray-400 block">
                {checkoutStep === 'cart' && `${items.length} producto(s) añadidos`}
                {checkoutStep === 'checkout' && 'Pago seguro e independiente'}
                {checkoutStep === 'success' && 'Transacción directa completada'}
              </span>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Lista de Productos del Carrito */}
        {checkoutStep === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 py-16">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-base font-semibold text-gray-400">Tu carrito está vacío</p>
                  <p className="text-xs text-gray-600 mt-1 max-w-xs text-center">Explora los perfiles de los negocios y añade lo que desees comprar.</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex space-x-4 bg-[#1e1e24] p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/200/200`; }}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0" 
                    />
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                        <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-400 p-1 transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[11px] text-gray-400 block truncate">
                        ${item.price.toLocaleString('es-CO')} c/u
                      </span>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="font-extrabold text-[#ff6b00] text-sm">
                          ${(item.price * item.quantity).toLocaleString('es-CO')}
                        </span>
                        <div className="flex items-center space-x-2 bg-[#121215] rounded-full border border-white/10 px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-white px-1 font-bold">-</button>
                          <span className="text-xs font-bold w-4 text-center text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-white px-1 font-bold">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/10 p-5 bg-[#17171a] space-y-4">

                {/* Toggle Domicilio vs Recoger en Tienda */}
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5 text-[#ff6b00]" /> ¿Cómo deseas recibir tu pedido?
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('pickup')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        deliveryMode === 'pickup'
                          ? 'bg-[#ff6b00]/15 border-[#ff6b00] ring-1 ring-[#ff6b00]/40'
                          : 'bg-[#1e1e24] border-white/5 hover:bg-[#25252b]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Store className={`w-4 h-4 ${deliveryMode === 'pickup' ? 'text-[#ff6b00]' : 'text-gray-500'}`} />
                        <span className={`text-xs font-bold ${deliveryMode === 'pickup' ? 'text-[#ff6b00]' : 'text-gray-400'}`}>Recoger en Tienda</span>
                      </div>
                      <span className={`text-[10px] font-bold block ${deliveryMode === 'pickup' ? 'text-green-400' : 'text-gray-500'}`}>Gratis — $0 COP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('delivery')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        deliveryMode === 'delivery'
                          ? 'bg-[#ff6b00]/15 border-[#ff6b00] ring-1 ring-[#ff6b00]/40'
                          : 'bg-[#1e1e24] border-white/5 hover:bg-[#25252b]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Bike className={`w-4 h-4 ${deliveryMode === 'delivery' ? 'text-[#ff6b00]' : 'text-gray-500'}`} />
                        <span className={`text-xs font-bold ${deliveryMode === 'delivery' ? 'text-[#ff6b00]' : 'text-gray-400'}`}>Domicilio</span>
                      </div>
                      <span className={`text-[10px] font-bold block ${deliveryMode === 'delivery' ? 'text-[#ff6b00]' : 'text-gray-500'}`}>+${deliveryFeeCalc.toLocaleString('es-CO')} COP</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-xs text-gray-400">Subtotal Productos</span>
                  <span className="text-sm font-bold text-white">${subtotalProducts.toLocaleString('es-CO')}</span>
                </div>
                {deliveryMode === 'delivery' && (
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs text-gray-400">🛵 Domicilio ({distanceKm} km)</span>
                    <span className="text-sm font-bold text-[#ff6b00]">+${deliveryFee.toLocaleString('es-CO')}</span>
                  </div>
                )}
                {deliveryMode === 'pickup' && (
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs text-gray-400">🏪 Recoger en Tienda</span>
                    <span className="text-sm font-bold text-green-400">Gratis</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className="text-xs text-gray-400 block">Total a pagar</span>
                    <span className="text-2xl font-black text-white">${total.toLocaleString('es-CO')} <span className="text-xs font-semibold text-[#ff6b00]">COP</span></span>
                  </div>
                  <span className="text-[10px] text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20 font-bold">
                    {deliveryMode === 'delivery' ? '🛵 Domicilio' : '🏪 Recogida'}
                  </span>
                </div>

                <button 
                  onClick={() => {
                    if (isAuthenticated) {
                      setCheckoutStep('checkout');
                    } else {
                      setAuthModalOpen(true);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:opacity-95 text-white font-extrabold py-3.5 rounded-2xl transition-all flex items-center justify-center shadow-lg shadow-[#ff6b00]/25 text-sm"
                >
                  Proceder al Pago Directo <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: Checkout Directo (Datos de Envío, Selección de Pago y Subida de Baucher) */}
        {checkoutStep === 'checkout' && (
          <form onSubmit={handleDirectPayment} className="flex-1 overflow-y-auto p-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* Resumen Superior y Lista de Productos */}
              <div className="bg-[#1e1e24] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-3.5 flex items-center justify-between border-b border-white/5">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Subtotal Productos</span>
                    <span className="text-sm font-extrabold text-white">${subtotalProducts.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
                      {deliveryMode === 'delivery' ? `🛵 Domicilio (${distanceKm}km)` : '🏪 Recogida en Tienda'}
                    </span>
                    <span className={`text-sm font-extrabold ${deliveryMode === 'delivery' ? 'text-[#ff6b00]' : 'text-green-400'}`}>
                      {deliveryMode === 'delivery' ? `+$${deliveryFee.toLocaleString('es-CO')}` : 'Gratis'}
                    </span>
                  </div>
                </div>
                <div className="p-3.5 flex items-center justify-between border-b border-white/5 bg-[#17171a]">
                  <div>
                    <span className="text-[10px] text-[#ff6b00] block uppercase font-black tracking-wider">Total del Pedido</span>
                    <span className="text-xl font-extrabold text-[#ff6b00]">${total.toLocaleString('es-CO')} COP</span>
                  </div>
                  <span className="text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                {/* Detalles de los productos */}
                <div className="p-3.5 bg-black/20 space-y-2.5 max-h-40 overflow-y-auto custom-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <span className="text-[#ff6b00] font-black">{item.quantity}x</span>
                        <span className="text-gray-300 truncate">{item.name}</span>
                      </div>
                      <span className="font-mono text-gray-400 whitespace-nowrap font-medium">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Datos de Entrega - Cuenta Registrada */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-300 font-bold uppercase tracking-wider flex items-center">
                    <User className="w-3.5 h-3.5 mr-1.5 text-[#ff6b00]" /> {deliveryMode === 'delivery' ? 'Tu Dirección de Entrega' : 'Tu Cuenta'}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 ${
                    deliveryMode === 'delivery' 
                      ? 'text-[#ff6b00] bg-[#ff6b00]/10 border-[#ff6b00]/20'
                      : 'text-green-400 bg-green-500/10 border-green-500/20'
                  }`}>
                    {deliveryMode === 'delivery' ? <><Bike className="w-3 h-3" /> Domicilio</> : <><Store className="w-3 h-3" /> Recogida</>}
                  </span>
                </div>

                <div className="bg-[#1e1e24] p-3 rounded-2xl border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{registeredName}</span>
                    <span className="text-xs font-mono font-bold text-[#ff6b00]">{registeredPhone}</span>
                  </div>
                  {deliveryMode === 'delivery' ? (
                    <div className="flex items-center text-xs text-gray-300 gap-1.5 pt-1.5 border-t border-white/5">
                      <MapPin className="w-3.5 h-3.5 text-[#ff6b00] flex-shrink-0" />
                      <span className="truncate">{deliveryAddress}</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-green-300 gap-1.5 pt-1.5 border-t border-white/5">
                      <Store className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      <span className="truncate">Recoge tu pedido directamente en <strong className="text-white">{items[0]?.provider?.name || 'la tienda'}</strong></span>
                    </div>
                  )}
                </div>

                {deliveryMode === 'delivery' && (
                  <>
                    <div className="flex justify-end mt-1.5">
                      <button 
                        type="button"
                        onClick={() => setIsCustomAddress(!isCustomAddress)}
                        className="text-[11px] text-[#ff6b00] hover:underline font-semibold"
                      >
                        {isCustomAddress ? '✓ Usar dirección predeterminada' : '✏️ Cambiar dirección para este pedido'}
                      </button>
                    </div>

                    {isCustomAddress && (
                      <div className="mt-2 space-y-1.5 animate-in fade-in">
                        <label className="text-[10px] text-gray-400 font-bold block">Nueva Dirección de Entrega:</label>
                        <input 
                          type="text" 
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Ej. Calle 7 # 3-10, Barrio San Pedro..."
                          className="w-full bg-[#18181d] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b00]"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Selector de Método de Pago */}
              <div>
                <span className="text-xs text-gray-300 font-bold uppercase tracking-wider block mb-2.5 flex items-center">
                  <Wallet className="w-3.5 h-3.5 mr-1.5 text-[#ff6b00]" /> ¿Cómo vas a pagar?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        selectedPayment === method.id 
                          ? `${method.bg} ${method.text} ${method.border} ring-1 ring-[#ff6b00]` 
                          : 'bg-[#1e1e24] text-gray-400 border-white/5 hover:bg-[#25252b]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{method.name}</span>
                        {selectedPayment === method.id && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Datos de Cuenta y Transferencia del Negocio */}
              <div className="p-3.5 bg-[#18181d] rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">Cuenta para realizar el pago:</span>
                  <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 font-bold">Oficial</span>
                </div>
                
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-gray-400 block">{currentPaymentInfo.accountType}</span>
                    <span className="text-sm font-mono font-bold text-white">{currentPaymentInfo.accountNumber}</span>
                    <span className="text-[10px] text-gray-500 block">{currentPaymentInfo.holder}</span>
                  </div>
                  {currentPaymentInfo.id !== 'efectivo' && (
                    <button 
                      type="button"
                      onClick={() => handleCopyAccount(currentPaymentInfo.accountNumber)}
                      className="px-2.5 py-1.5 bg-[#ff6b00]/15 hover:bg-[#ff6b00]/25 text-[#ff6b00] rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copiado' : 'Copiar'}
                    </button>
                  )}
                </div>
              </div>

              {/* Adjuntar Baucher o Comprobante de Pago */}
              <div>
                <span className="text-xs text-gray-300 font-bold uppercase tracking-wider block mb-2 flex items-center">
                  <Camera className="w-3.5 h-3.5 mr-1.5 text-[#ff6b00]" /> Evidencia de Pago / Baucher
                </span>
                
                <label className="border border-dashed border-white/15 hover:border-[#ff6b00]/50 rounded-2xl p-3 flex items-center justify-between cursor-pointer bg-[#18181d] transition-colors">
                  <div className="flex items-center space-x-3 truncate">
                    {voucherPreview ? (
                      <>
                        <img src={voucherPreview} alt="Baucher" className="w-10 h-10 rounded-xl object-cover border border-green-500/50 flex-shrink-0" />
                        <div className="truncate">
                          <span className="text-xs font-bold text-green-400 block truncate flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Baucher Adjunto
                          </span>
                          <span className="text-[10px] text-gray-500 block">Clic para reemplazar foto</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 flex-shrink-0">
                          <UploadCloud className="w-5 h-5 text-[#ff6b00]" />
                        </div>
                        <div className="truncate">
                          <span className="text-xs text-gray-300 font-medium block truncate">Subir foto o captura del pago</span>
                          <span className="text-[10px] text-gray-500 block">Comprobante Nequi, Daviplata o recibo</span>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#ff6b00] px-3 py-1.5 bg-[#ff6b00]/10 rounded-xl flex-shrink-0 ml-2">
                    {voucherPreview ? 'Cambiar' : 'Subir'}
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleVoucherUpload} 
                  />
                </label>
              </div>

            </div>

            {/* Botón de Confirmación y Pago Directo */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button 
                type="submit"
                className="w-full bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-xl shadow-[#ff6b00]/25 text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Confirmar y Pagar Pedido Directo (${total.toLocaleString('es-CO')})
              </button>
              <p className="text-[10px] text-gray-500 text-center">
                El pago se procesa y registra directamente en el sistema de la tienda.
              </p>
            </div>
          </form>
        )}

        {/* STEP 3: Confirmación de Pago y Factura Electrónica Oficial */}
        {checkoutStep === 'success' && confirmedOrder && (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between animate-in zoom-in-95">
            <div className="space-y-4 my-auto w-full">
              
              <div className="text-center">
                <span className="text-[11px] font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                  ¡Pago y Compra Exitosa!
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  Tu factura electrónica ha sido generada y validada ante la DIAN.
                </p>
              </div>

              {/* FACTURA ELECTRÓNICA OFICIAL */}
              <FacturaElectronicaCard facturaData={confirmedOrder} />

              {/* Botón Opcional para dialogar con el vendedor o chatbot */}
              <div className="p-3.5 bg-[#18181d] rounded-2xl border border-white/5 text-left flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">¿Deseas hablar con el vendedor?</span>
                  <span className="text-[10px] text-gray-400 block">Inicia un diálogo o consulta al chatbot</span>
                </div>
                <button 
                  onClick={handleOpenChatWithSeller}
                  className="px-3.5 py-2 bg-[#ff6b00]/15 hover:bg-[#ff6b00]/25 text-[#ff6b00] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Abrir Chat
                </button>
              </div>

            </div>

            <div className="w-full pt-4 border-t border-white/10">
              <button 
                onClick={handleClose}
                className="w-full bg-[#222] hover:bg-white/10 text-white font-bold py-3 rounded-xl text-xs transition-colors"
              >
                Seguir Comprando en el Directorio
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
