import React, { useState } from 'react';
import { 
  X, 
  Megaphone, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Upload, 
  Copy, 
  Check, 
  AlertCircle,
  Eye,
  Store,
  ArrowRight,
  PenTool,
  Utensils,
  Hotel,
  Zap,
  ShoppingBag
} from 'lucide-react';
import usePromotionsStore, { PROMOTION_FEE, PROMOTION_DURATION_HOURS } from '../store/usePromotionsStore';
import useAuthStore from '../store/useAuthStore';
import { MOCK_BUSINESSES } from '../data/mockData';

export default function PromotionCheckoutModal({ 
  isOpen, 
  onClose, 
  initialData = null, 
  onSuccess = null 
}) {
  const { addPromotion } = usePromotionsStore();
  const { user } = useAuthStore();

  // Form State
  const [providerName, setProviderName] = useState(
    initialData?.providerName || user?.name || 'Mi Negocio'
  );
  const [providerId, setProviderId] = useState(
    initialData?.providerId || (user?.role === 'provider' ? user?.id : 'promo_biz_' + Date.now())
  );
  const [title, setTitle] = useState(initialData?.title || '¡Gran Oferta Especial!');
  const [description, setDescription] = useState(
    initialData?.description || 'Aprovecha este descuento exclusivo por tiempo limitado en Yaguará. ¡Haz tu pedido ahora!'
  );
  const [promoType, setPromoType] = useState(initialData?.promoType || 'fixed');
  const [price, setPrice] = useState(initialData?.price || '15000');
  const [discountPercentage, setDiscountPercentage] = useState(initialData?.discountPercentage || '20');
  const [categoryIcon, setCategoryIcon] = useState(initialData?.categoryIcon || 'ShoppingBag');
  const [color, setColor] = useState(initialData?.color || 'from-[#ff5500] via-[#ff6a00] to-[#e64700]');
  const [image, setImage] = useState(
    initialData?.image || '/images/chopsuey_promo.jpg'
  );

  // Checkout flow state: 'form' | 'payment' | 'processing' | 'success'
  const [step, setStep] = useState(initialData?.directPayment ? 'payment' : 'form');
  const [paymentMethod, setPaymentMethod] = useState('wompi'); // 'wompi' | 'nequi' | 'daviplata'
  const [voucherFile, setVoucherFile] = useState(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [completedPayment, setCompletedPayment] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleCopyAccount = (number) => {
    navigator.clipboard?.writeText(number);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Execution of payment and activation
  const processPromotionActivation = (paymentData) => {
    setStep('processing');
    setErrorMessage('');

    setTimeout(() => {
      try {
        const promoPayload = {
          providerId,
          providerName,
          title,
          description,
          promoType,
          price: promoType === 'fixed' ? parseInt(price, 10) || null : null,
          discountPercentage: promoType === 'percentage' ? parseInt(discountPercentage, 10) || null : null,
          categoryIcon,
          color,
          image: image || '/images/chopsuey_promo.jpg',
          daysLeft: 1
        };

        const paymentRecord = addPromotion(promoPayload, paymentData);
        setCompletedPayment(paymentRecord);
        setStep('success');

        if (onSuccess) {
          onSuccess(paymentRecord);
        }
      } catch (err) {
        setErrorMessage('Ocurrió un error al registrar la promoción. Por favor intenta de nuevo.');
        setStep('payment');
      }
    }, 1200);
  };

  // Handler for Wompi Widget
  const handleWompiPayment = () => {
    setErrorMessage('');
    const reference = `SG-PROMO-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
    const amountInCents = PROMOTION_FEE * 100; // $10.000 COP = 1.000.000 centavos

    if (window.WidgetCheckout) {
      try {
        const checkout = new window.WidgetCheckout({
          currency: 'COP',
          amountInCents: amountInCents,
          reference: reference,
          publicKey: 'pub_test_Q5yDA9xoKdePzhSGeZaQS1C8sBTIpIQG',
          redirectUrl: ''
        });

        checkout.open((result) => {
          const transaction = result?.transaction;
          if (transaction?.status === 'APPROVED') {
            processPromotionActivation({
              method: 'wompi',
              reference: transaction.reference || reference,
              transactionId: transaction.id || `WPI-${Date.now()}`
            });
          } else if (transaction?.status === 'DECLINED') {
            setErrorMessage('La transacción fue rechazada por la entidad bancaria.');
          }
        });
        return;
      } catch (e) {
        console.warn('Wompi popup error, falling back to simulated checkout', e);
      }
    }

    // Fallback if Wompi widget is blocked or in offline mode
    processPromotionActivation({
      method: 'wompi',
      reference: reference,
      transactionId: `WPI-TEST-${Date.now()}`
    });
  };

  // Handler for Manual Nequi / Daviplata / Bancolombia
  const handleManualPayment = (e) => {
    e.preventDefault();
    processPromotionActivation({
      method: paymentMethod,
      reference: `MANUAL-${paymentMethod.toUpperCase()}-${Date.now()}`,
      transactionId: `VOUCHER-${Math.floor(Math.random() * 900000 + 100000)}`,
      hasVoucher: !!voucherFile
    });
  };

  const renderIconPreview = () => {
    switch (categoryIcon) {
      case 'PenTool':
        return <PenTool className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />;
      case 'Utensils':
        return <Utensils className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />;
      case 'Hotel':
        return <Hotel className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />;
      default:
        return <ShoppingBag className="w-3.5 h-3.5 text-white" strokeWidth={2.2} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0d121c] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="relative p-6 sm:p-7 border-b border-white/[0.08] flex items-center justify-between bg-gradient-to-r from-[#111827] to-[#0d121c]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ff6b00]/15 border border-[#ff6b00]/30 flex items-center justify-center text-[#ff6b00] shadow-[0_0_20px_rgba(255,107,0,0.25)]">
              <Megaphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-[#ff6b00]/20 text-[#ff6b00] border border-[#ff6b00]/30">
                  Publicidad Servi-Go
                </span>
                <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#ff6b00]" /> 24 Horas
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Pautar Promoción Destacada
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Sticky Highlight */}
        <div className="bg-[#121927] px-6 sm:px-7 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ff6b00]" />
            <span className="text-xs text-zinc-300 font-medium">
              Tarifa única por pauta:
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#ff6b00]">
              ${PROMOTION_FEE.toLocaleString('es-CO')} COP
            </span>
            <span className="text-[11px] text-zinc-400 font-semibold">/ 24 horas</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* STEP 1: FORM */}
          {step === 'form' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Info banner */}
              <div className="bg-[#141d2c] border border-[#ff6b00]/20 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#ff6b00] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Tu promoción se posicionará en el <strong>carrusel principal de portada</strong> para todos los visitantes de Yaguará y el Huila durante 24 horas continuas desde el momento del pago.
                </p>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                {/* Business Selector / Input */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Nombre del Negocio o Comercio
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={providerName}
                      onChange={e => setProviderName(e.target.value)}
                      placeholder="Ej. Restaurante Chino Jinlong, Tatuajes Diablo..."
                      className="w-full bg-[#131b26] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                      required
                    />
                  </div>
                </div>

                {/* Promo Title */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Título de la Promoción (Llamativo)
                  </label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ej. ¡Descuento en Chop Suey! o ¡2x1 en Hamburguesas!"
                    className="w-full bg-[#131b26] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                    maxLength={45}
                    required
                  />
                </div>

                {/* Promo Description */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Descripción del Anuncio
                  </label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe la oferta, condiciones o llamado a la acción..."
                    className="w-full bg-[#131b26] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00] h-20 resize-none"
                    maxLength={130}
                    required
                  />
                </div>

                {/* Offer Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Tipo de Oferta
                    </label>
                    <select 
                      value={promoType}
                      onChange={e => setPromoType(e.target.value)}
                      className="w-full bg-[#131b26] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                    >
                      <option value="fixed">Precio Especial Fijo ($)</option>
                      <option value="percentage">Porcentaje de Descuento (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      {promoType === 'fixed' ? 'Precio Oferta ($ COP)' : 'Porcentaje (%)'}
                    </label>
                    <input 
                      type="number"
                      value={promoType === 'fixed' ? price : discountPercentage}
                      onChange={e => promoType === 'fixed' ? setPrice(e.target.value) : setDiscountPercentage(e.target.value)}
                      placeholder={promoType === 'fixed' ? '15000' : '20'}
                      className="w-full bg-[#131b26] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                      min="1"
                    />
                  </div>
                </div>

                {/* Category Icon & Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Ícono de Categoría
                    </label>
                    <select 
                      value={categoryIcon}
                      onChange={e => setCategoryIcon(e.target.value)}
                      className="w-full bg-[#131b26] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6b00]"
                    >
                      <option value="Utensils">Comida / Restaurante</option>
                      <option value="ShoppingBag">Comercio / Tienda</option>
                      <option value="Hotel">Hotel / Alojamiento</option>
                      <option value="PenTool">Arte / Tatuajes</option>
                      <option value="Zap">Servicios Técnicos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Color de Fondo
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      <button 
                        type="button" 
                        onClick={() => setColor('from-[#ff5500] via-[#ff6a00] to-[#e64700]')}
                        className={`w-9 h-9 rounded-full bg-gradient-to-r from-[#ff5500] to-[#e64700] border-2 ${color.includes('#ff5500') ? 'border-white scale-110' : 'border-transparent'}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => setColor('from-[#0052cc] via-[#0066ff] to-[#0040aa]')}
                        className={`w-9 h-9 rounded-full bg-gradient-to-r from-[#0052cc] to-[#0040aa] border-2 ${color.includes('#0052cc') ? 'border-white scale-110' : 'border-transparent'}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => setColor('from-[#2b080b] via-[#3d0f15] to-[#150406]')}
                        className={`w-9 h-9 rounded-full bg-gradient-to-r from-[#2b080b] to-[#150406] border-2 ${color.includes('#2b080b') ? 'border-white scale-110' : 'border-transparent'}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => setColor('from-[#059669] via-[#10b981] to-[#047857]')}
                        className={`w-9 h-9 rounded-full bg-gradient-to-r from-[#059669] to-[#047857] border-2 ${color.includes('#059669') ? 'border-white scale-110' : 'border-transparent'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Foto del Anuncio
                  </label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      id="promo-photo-upload"
                      className="hidden"
                    />
                    <label 
                      htmlFor="promo-photo-upload"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-[#131b26] hover:bg-[#1a2433] border border-white/10 rounded-xl text-xs font-bold text-white transition-colors"
                    >
                      <Upload className="w-4 h-4 text-[#ff6b00]" />
                      <span>Subir foto desde dispositivo</span>
                    </label>
                    <span className="text-xs text-zinc-400">O mantén la imagen sugerida</span>
                  </div>
                </div>
              </div>

              {/* Live Preview Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#ff6b00]" /> Vista previa en el Home
                  </span>
                  <span className="text-[11px] text-zinc-500">Cómo la verán los clientes</span>
                </div>
                
                {/* Live Card Mini Render */}
                <div className={`relative rounded-[1.75rem] overflow-hidden p-6 bg-gradient-to-br ${color} border border-white/15 shadow-xl flex items-center justify-between min-h-[200px]`}>
                  <div className="relative z-10 w-[58%] pr-2">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-2.5 bg-black/35 backdrop-blur-sm px-3 py-1 rounded-full border border-white/15 text-white">
                      {renderIconPreview()}
                      <span>{providerName || 'Mi Negocio'}</span>
                    </div>
                    <h4 className="font-black text-lg sm:text-xl leading-tight mb-2 text-white drop-shadow-md">
                      {title || 'Título de tu promoción'}
                    </h4>
                    <p className="text-xs text-white/90 leading-relaxed font-normal mb-3 line-clamp-2">
                      {description || 'Descripción breve...'}
                    </p>
                    <div className="text-xs font-bold bg-white text-zinc-950 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md">
                      <Clock className="w-3.5 h-3.5 text-zinc-950" />
                      <span>Quedan 24 horas</span>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-[48%] pointer-events-none overflow-hidden">
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      style={{
                        maskImage: 'linear-gradient(to right, transparent 0%, black 35%)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 35%)'
                      }} 
                    />
                  </div>
                </div>
              </div>

              {/* Action Button: Go to Payment */}
              <div className="pt-3">
                <button 
                  type="button"
                  onClick={() => setStep('payment')}
                  disabled={!title.trim() || !description.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:from-[#ff7700] hover:to-[#ff5500] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-[0_4px_25px_rgba(255,107,0,0.4)] transition-all disabled:opacity-50"
                >
                  <span>Continuar al Pago ($10.000 COP)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <button 
                  type="button" 
                  onClick={() => setStep('form')}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  ← Modificar anuncio
                </button>
                <div className="text-right">
                  <span className="text-[11px] text-zinc-400 block">Total a pagar:</span>
                  <span className="text-xl font-black text-[#ff6b00]">$10.000 COP</span>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-500/15 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('wompi')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'wompi'
                      ? 'bg-[#182338] border-[#ff6b00] text-white shadow-lg'
                      : 'bg-[#131b26] border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-[#ff6b00]" />
                  <span className="font-extrabold text-sm">Wompi Online</span>
                  <span className="text-[10px] text-zinc-400">PSE, Tarjetas, Bancolombia</span>
                </button>

                <button 
                  type="button"
                  onClick={() => setPaymentMethod('nequi')}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'nequi'
                      ? 'bg-[#182338] border-[#ff6b00] text-white shadow-lg'
                      : 'bg-[#131b26] border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-pink-600 flex items-center justify-center text-white font-black text-xs">
                    N
                  </div>
                  <span className="font-extrabold text-sm">Nequi / Daviplata</span>
                  <span className="text-[10px] text-zinc-400">Transferencia Directa</span>
                </button>
              </div>

              {/* Wompi Option Details */}
              {paymentMethod === 'wompi' && (
                <div className="bg-[#121927] p-5 rounded-2xl border border-white/[0.08] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Pasarela Wompi Bancolombia</h4>
                      <p className="text-xs text-zinc-400">Pago instantáneo protegido con cifrado bancario.</p>
                    </div>
                  </div>

                  <div className="bg-[#0b1017] p-3 rounded-xl border border-white/5 space-y-1.5 text-xs text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Concepto:</span>
                      <span className="font-semibold text-white">Publicidad Destacada (24 Horas)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Monto exacto:</span>
                      <span className="font-bold text-[#ff6b00]">$10.000 COP</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Activación:</span>
                      <span className="text-emerald-400 font-semibold">Inmediata al aprobar</span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleWompiPayment}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:from-[#ff7700] hover:to-[#ff5500] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg transition-all"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Pagar $10.000 con Wompi</span>
                  </button>
                </div>
              )}

              {/* Nequi / Daviplata Option Details */}
              {paymentMethod === 'nequi' && (
                <form onSubmit={handleManualPayment} className="bg-[#121927] p-5 rounded-2xl border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Transferencia Nequi / Daviplata</h4>
                      <p className="text-xs text-zinc-400">Transfiere y adjunta tu comprobante.</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-bold">
                      Aprobación Express
                    </span>
                  </div>

                  {/* Account Box */}
                  <div className="bg-[#0b1017] p-4 rounded-xl border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Número de Cuenta Nequi:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">312 456 7890</span>
                        <button 
                          type="button" 
                          onClick={() => handleCopyAccount('3124567890')}
                          className="p-1 rounded bg-white/10 hover:bg-white/20 text-zinc-300"
                          title="Copiar número"
                        >
                          {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Titular:</span>
                      <span className="text-zinc-300">Servi-Go Publicidad SAS</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Valor a transferir:</span>
                      <span className="font-bold text-[#ff6b00]">$10.000 COP</span>
                    </div>
                  </div>

                  {/* Voucher Upload */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                      Comprobante de Pago (Captura de pantalla)
                    </label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={e => setVoucherFile(e.target.files[0])}
                      className="w-full bg-[#131b26] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#ff6b00]/20 file:text-[#ff6b00] hover:file:bg-[#ff6b00]/30"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:from-[#ff7700] hover:to-[#ff5500] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg transition-all"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Confirmar Pago de Publicidad ($10.000 COP)</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 3: PROCESSING */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 border-4 border-[#ff6b00]/30 border-t-[#ff6b00] rounded-full animate-spin" />
              <h3 className="text-lg font-bold text-white">Validando transacción y activando anuncio...</h3>
              <p className="text-xs text-zinc-400">Por favor espera un momento mientras Servi-Go procesa tu pauta publicitaria.</p>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'success' && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-5 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ¡Publicidad Activa!
                </span>
                <h3 className="text-2xl font-black text-white mt-2">
                  ¡Promoción Publicada con Éxito!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-md mx-auto">
                  Tu anuncio ya está visible en la página principal para todos los usuarios de Servi-Go durante las próximas <strong>24 horas</strong>.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="w-full bg-[#111827] border border-white/10 rounded-2xl p-4 text-xs space-y-2 text-left">
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-zinc-400">Referencia:</span>
                  <span className="font-mono font-bold text-white">{completedPayment?.reference}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-zinc-400">Comercio:</span>
                  <span className="font-bold text-white">{providerName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-zinc-400">Valor Pagado:</span>
                  <span className="font-bold text-[#ff6b00]">${PROMOTION_FEE.toLocaleString('es-CO')} COP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Vigencia:</span>
                  <span className="text-emerald-400 font-semibold">24 Horas continuas</span>
                </div>
              </div>

              <div className="pt-2 w-full flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={onClose}
                  className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white transition-colors"
                >
                  Cerrar
                </button>
                <button 
                  onClick={() => {
                    onClose();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-[#ff6b00] hover:bg-[#ff5500] text-white shadow-lg shadow-[#ff6b00]/30 transition-colors"
                >
                  Ver en Portada (Home)
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
