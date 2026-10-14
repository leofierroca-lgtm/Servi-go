import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  Store, 
  Image as ImageIcon, 
  UploadCloud, 
  Minus, 
  ShoppingBag, 
  Camera, 
  Eye, 
  Paperclip, 
  Bot, 
  Sparkles, 
  Check, 
  Clock, 
  MapPin, 
  Truck, 
  CreditCard, 
  Plus, 
  ArrowRight, 
  ShoppingCart, 
  Copy, 
  ShieldCheck, 
  Wallet,
  Receipt,
  Layers,
  AlertTriangle,
  Bike
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useAppStore from '../store/useAppStore';
import useCartStore from '../store/useCartStore';
import useAvailabilityStore from '../store/useAvailabilityStore';
import usePromotionsStore from '../store/usePromotionsStore';
import useDeliveryStore from '../store/useDeliveryStore';
import { useAdminStore } from '../store/useAdminStore';
import { CATEGORY_PRODUCTS, MOCK_BUSINESSES } from '../data/mockData';
import FacturaElectronicaCard from './FacturaElectronicaCard';

const PAYMENT_INFO = {
  nequi: { name: 'Nequi', number: '315 892 3456', type: 'Número Nequi', holder: 'Negocio Verificado Servi-Go' },
  daviplata: { name: 'Daviplata', number: '315 892 3456', type: 'Número Daviplata', holder: 'Negocio Verificado Servi-Go' },
  bancos: { name: 'Bancolombia', number: '982-748291-04', type: 'Cuenta Ahorros', holder: 'Servi-Go Pagos Digitales' },
  efectivo: { name: 'Efectivo', number: 'Pagas al recibir', type: 'Pago Contra Entrega', holder: 'Entrega en tu domicilio' }
};

export default function GlobalChatBubble() {
  const { role, user } = useAuthStore();
  const { activeChat, setActiveChat } = useAppStore();
  const addDeal = useAdminStore(state => state.addDeal);
  
  // Registered Customer Defaults
  const customerName = user?.name || 'Carlos Mendoza';
  const customerPhone = user?.phone || '318 765 4321';
  const customerAddress = user?.address || 'Carrera 4 # 5-20, Centro, Yaguará';

  // Cart Store for sync
  const addItem = useCartStore(state => state.addItem);
  const clearCart = useCartStore(state => state.clearCart);
  const cartItems = useCartStore(state => state.items);
  const setIsCartOpen = useCartStore(state => state.setIsOpen);

  const currentChat = activeChat || MOCK_BUSINESSES[0];
  const catalog = currentChat.products || CATEGORY_PRODUCTS[currentChat.categoryId] || [];
  const productCategories = ['Todas', ...new Set(catalog.map(p => p.category).filter(Boolean))];
  const [selectedProductCategory, setSelectedProductCategory] = useState('Todas');

  const promotions = usePromotionsStore(state => state.promotions);
  const providerPromotions = promotions.filter(p => p.providerId === currentChat.id && (Date.now() - p.createdAt) < 24 * 60 * 60 * 1000);

  // Business and product availability from store
  const isBusinessOpen = useAvailabilityStore(state => state.isBusinessOpen(currentChat.id));
  const businessNote = useAvailabilityStore(state => state.getBusinessNote(currentChat.id));
  const isProductInStock = useAvailabilityStore(state => state.isProductInStock);

  const handleFilterByCategory = (cat) => {
    setSelectedProductCategory(cat);
    const filtered = cat === 'Todas' ? catalog : catalog.filter(p => p.category === cat);
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: cat === 'Todas' 
        ? `Mostrando todo el catálogo de *${currentChat.name}* (${filtered.length} productos):`
        : `Categoría *${cat}* (${filtered.length} productos disponibles):`,
      sender: 'provider',
      isBot: true,
      products: filtered,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Call State
  const [isCalling, setIsCalling] = useState(false);

  const fileInputRef = useRef(null);
  const chatImageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [activeDiscount, setActiveDiscount] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Initiate an In-Chat Checkout Flow (Comprar y Cerrar en el Chat)
  const DELIVERY_FEE_BASE = 2000;
  const DELIVERY_DISTANCE_KM = 3.5;
  const deliveryFeeCalc = DELIVERY_FEE_BASE + (Math.max(0, Math.ceil(DELIVERY_DISTANCE_KM) - 2) * 1000);

  const handleInitiateInChatCheckout = (productOrItems, isMultiple = false) => {
    if (!isBusinessOpen) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `⚠️ Atención: En este momento *${currentChat.name}* se encuentra no disponible hoy (${businessNote}). No es posible cerrar pedidos por el día de hoy.`,
        sender: 'provider',
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      return;
    }

    const itemsToBuy = isMultiple 
      ? productOrItems 
      : [{ ...productOrItems, quantity: 1 }];

    const subtotal = itemsToBuy.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    let total = subtotal;
    let appliedDiscount = 0;

    if (activeDiscount) {
      appliedDiscount = subtotal * (activeDiscount / 100);
      total = subtotal - appliedDiscount;
    }

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: `¡Perfecto! Vamos a cerrar totalmente tu compra directamente aquí en el chat ⚡. Revisa los detalles de tu pedido, elige si deseas *domicilio o recoger en tienda*, y selecciona cómo deseas pagar:`,
      sender: 'provider',
      isBot: true,
      inChatCheckout: {
        items: itemsToBuy,
        subtotal,
        discountPercentage: activeDiscount,
        discountAmount: appliedDiscount,
        total,
        deliveryOption: 'delivery',
        deliveryFee: deliveryFeeCalc,
        selectedPayment: 'nequi',
        voucher: null,
        address: customerAddress
      },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  // Add Product to Cart from Bot message without forcing immediate checkout
  const handleAddProductFromChat = (prod) => {
    if (!isBusinessOpen) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `⚠️ En este momento *${currentChat.name}* no está recibiendo pedidos por hoy (${businessNote}).`,
        sender: 'provider',
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      return;
    }
    if (!isProductInStock(prod.id)) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `⚠️ Lo sentimos, el producto o plato *${prod.name}* se encuentra agotado por el día de hoy.`,
        sender: 'provider',
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      return;
    }

    addItem({ ...prod, provider: currentChat });
    // const currentTotalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0) + 1;
  };

  // Change payment method inside In-Chat Checkout
  const handleSelectCheckoutPayment = (msgId, methodKey) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.inChatCheckout) {
        return {
          ...m,
          inChatCheckout: {
            ...m.inChatCheckout,
            selectedPayment: methodKey
          }
        };
      }
      return m;
    }));
  };

  // Toggle delivery option inside In-Chat Checkout
  const handleToggleDeliveryOption = (msgId, option) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.inChatCheckout) {
        const newDeliveryFee = option === 'delivery' ? deliveryFeeCalc : 0;
        const baseTotal = m.inChatCheckout.subtotal - (m.inChatCheckout.discountAmount || 0);
        return {
          ...m,
          inChatCheckout: {
            ...m.inChatCheckout,
            deliveryOption: option,
            deliveryFee: newDeliveryFee,
            total: baseTotal + newDeliveryFee
          }
        };
      }
      return m;
    }));
  };

  // Upload voucher inside In-Chat Checkout
  const handleCheckoutVoucherUpload = (msgId, e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMessages(prev => prev.map(m => {
        if (m.id === msgId && m.inChatCheckout) {
          return {
            ...m,
            inChatCheckout: {
              ...m.inChatCheckout,
              voucher: url
            }
          };
        }
        return m;
      }));
    }
  };

  // Finalize and CLOSE the purchase 100% inside the chat as Factura Electrónica
  const handleFinalizeInChatPurchase = (msgId, checkoutData) => {
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const orderId = `FE-${orderNumber}`;
    const payment = PAYMENT_INFO[checkoutData.selectedPayment] || PAYMENT_INFO.nequi;
    const subtotal = Math.round(checkoutData.total / 1.08);
    const tax = checkoutData.total - subtotal;
    const cufe = `cufe-dian-${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}e2026`;

    // Mock exitoso de la transacción para transferencias manuales y efectivo
    const transaction = { id: orderId, status: 'APPROVED' };

    if (transaction.status === 'APPROVED') {
        clearCart();

        setMessages(prev => prev.map(m => {
          if (m.id === msgId) {
            return {
              ...m,
              inChatCheckout: null,
              isClosedOrder: true,
              closedOrderData: {
                orderId,
                orderNumber,
                cufe,
                items: checkoutData.items,
                subtotal: checkoutData.subtotal || subtotal,
                discountPercentage: checkoutData.discountPercentage,
                discountAmount: checkoutData.discountAmount,
                tax,
                total: checkoutData.total,
                paymentMethod: payment.name,
                paymentType: payment.type,
                voucher: checkoutData.voucher,
                customerName,
                customerCedula: '1.075.284.912',
                customerPhone,
                customerAddress: checkoutData.address || customerAddress,
                businessName: currentChat.name,
                businessNit: `901.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}-1`,
                dianResolution: '187640291884 de 2026',
                date: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              }
            };
          }
          return m;
        }));

        // REGISTRAR LA VENTA Y COMISIÓN EN EL PANEL DEL ADMINISTRADOR
        addDeal({
          id: transaction.id || orderId,
          conversationId: `bot_chat_${Date.now()}`,
          providerId: currentChat.id,
          providerName: currentChat.name,
          consumerName: user?.name || 'Cliente Ocasional',
          title: `Venta por Vendedor IA (${checkoutData.items?.length || 1} items)`,
          amount: checkoutData.total,
          commissionRate: 0.05,
          commissionAmount: checkoutData.total * 0.05,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          municipality: location || 'Yaguará'
        });

        // Bot message confirming legal DIAN Electronic Invoice emission
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: `🏛️ *Factura Electrónica de Venta Emitida con Éxito.* He generado y transmitido la factura oficial *No. ${orderId}* con validación previa DIAN para tu compra en *${currentChat.name}*. Ya están preparando tu pedido. ¡Gracias por tu compra!`,
            sender: 'provider',
            isBot: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 600);

        // Simulated Delivery Driver Notification
        if (checkoutData.deliveryOption === 'delivery') {
          const isContraEntrega = checkoutData.selectedPayment === 'efectivo' || checkoutData.selectedPayment === 'contraentrega';
          
          try {
            useDeliveryStore.getState().addDelivery({
              id: orderId,
              customerName: user?.name || 'Cliente de App',
              address: checkoutData.address || customerAddress || 'Centro',
              phone: user?.phone || '320 000 0000',
              businessName: currentChat?.name || 'Negocio Local',
              businessAddress: currentChat?.location || 'Yaguará, Centro',
              total: checkoutData.total || 0,
              paymentMethod: isContraEntrega ? 'Efectivo' : 'Nequi',
              paymentStatus: isContraEntrega ? 'Pendiente' : 'Pagado',
              deliveryStatus: 'pending_pickup',
              time: 'Justo ahora',
              distance: '1.5 km'
            });
            console.log("Order dispatched to delivery store successfully:", orderId);
          } catch (e) {
            console.error("Error dispatching delivery:", e);
            alert("Error interno al despachar al domiciliario: " + e.message);
          }

          setTimeout(() => {
            const isContraEntrega = checkoutData.selectedPayment === 'efectivo' || checkoutData.selectedPayment === 'contraentrega';
            
            const driverMessage = isContraEntrega 
              ? `🛵 *Servi-Go Logistics:* Un repartidor ha aceptado tu servicio y llevará el pedido a *${checkoutData.address || customerAddress}*.\n\n⚠️ *Pago Contra Entrega:* Como elegiste pagar al recibir, por favor ten el pago listo. Si vas a transferir al recibir, deberás subir la captura de pantalla usando el ícono del clip 📎 en este chat, y el domiciliario escaneará tu código QR para confirmar la entrega exitosa.`
              : `🛵 *Servi-Go Logistics:* Un repartidor ha aceptado tu servicio y llevará el pedido a *${checkoutData.address || customerAddress}*.\n\n✅ *Pedido Pre-pagado:* Como pagaste por medio electrónico, el domiciliario simplemente te hará la entrega. No te pedirá confirmación con código QR ni cobros adicionales.`;

            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              text: driverMessage,
              sender: 'system',
              isBot: true,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
          }, 1500);
        }
      } else {
        alert('El pago no fue aprobado. Estado: ' + transaction.status);
      }
  };

  const handleCopyAccount = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleChatImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMessages(prev => [...prev, {
        id: Date.now(),
        isImage: true,
        imageUrl: url,
        caption: 'Evidencia / Baucher Adjunto 📄',
        sender: role === 'provider' ? 'provider' : 'client',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    const clean = text.replace(/\\n/g, '\n');
    return clean.split('\n').map((line, idx, arr) => {
      const parts = line.split(/(\*[^*]+\*)/g);
      return (
        <React.Fragment key={idx}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('*') && part.endsWith('*')) {
              return <strong key={pIdx} className="font-bold text-white">{part.slice(1, -1)}</strong>;
            }
            return part;
          })}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  // Contextual AI Sales Bot responses
  const triggerBotReply = (userText) => {
    const lower = userText.toLowerCase();
    let reply = '';
    let prodsToOffer = null;

    // 1. Direct intent to close/buy or checkout
    if (lower.includes('cerrar') || lower.includes('pagar') || lower.includes('comprar todo') || lower.includes('finalizar')) {
      if (cartItems.length > 0) {
        handleInitiateInChatCheckout(cartItems, true);
        return;
      } else if (catalog.length > 0) {
        handleInitiateInChatCheckout(catalog[0], false);
        return;
      }
    }

    // 1.5. Product Categories inquiry
    if (lower.includes('categoria') || lower.includes('categoría') || lower.includes('secciones') || lower.includes('grupos') || lower.includes('tipos')) {
      const catsList = productCategories.filter(c => c !== 'Todas').join(', ');
      reply = `En *${currentChat.name}* tenemos los productos organizados en las siguientes categorías: *${catsList}*. Puedes pulsar las pestañas de categorías arriba para filtrar el menú o ver estos productos:`;
      prodsToOffer = catalog;
    }
    // 2. Catalog / Menu / Offerings
    else if (lower.includes('catalogo') || lower.includes('carta') || lower.includes('menu') || lower.includes('productos') || lower.includes('servicios') || lower.includes('venden') || lower.includes('que tienes') || lower.includes('ofreces')) {
      reply = `¡Con gusto! Aquí tienes los productos destacados disponibles de *${currentChat.name}*. Puedes añadirlos o *cerrar tu compra directamente aquí*:`;
      prodsToOffer = catalog;
    }
    // 3. Best Sellers / Recommendations
    else if (lower.includes('mas vendido') || lower.includes('recomend') || lower.includes('popular') || lower.includes('especialidad') || lower.includes('estrella') || lower.includes('mejor')) {
      reply = `Lo más solicitado y recomendado por nuestros clientes en *${currentChat.name}* es:`;
      prodsToOffer = catalog.slice(0, 2);
    }
    // 4. Keyword matching against promotions
    let matchedPromo = null;
    if (lower.includes('promocion') || lower.includes('promoción') || lower.includes('oferta') || lower.includes('descuento')) {
      matchedPromo = providerPromotions.find(p => lower.includes(p.title.toLowerCase())) || providerPromotions[0];
    }

    if (matchedPromo) {
      if (matchedPromo.promoType === 'percentage') {
        reply = `¡Claro que sí! He activado el descuento de la promoción: *${matchedPromo.title}* (-${matchedPromo.discountPercentage}% OFF). Este descuento se aplicará automáticamente al total de tu orden cuando decidas pagar. ¿Qué te gustaría pedir del catálogo?`;
        setActiveDiscount(matchedPromo.discountPercentage);
        prodsToOffer = catalog.slice(0, 2);
      } else {
        reply = `¡Claro que sí! Aquí tienes nuestra promoción especial: *${matchedPromo.title}* por solo *$${matchedPromo.price?.toLocaleString('es-CO') || 'Precio Especial'} COP*. ¿Deseas agregarla a tu orden?`;
        prodsToOffer = [{
          id: `promo_${matchedPromo.id}`,
          name: `🏷️ PROMO: ${matchedPromo.title}`,
          price: matchedPromo.price || 0,
          unit: 'promoción',
          description: matchedPromo.description,
          image: matchedPromo.image || currentChat.image,
          category: 'Promociones Flash'
        }];
      }
    }
    // 5. Keyword matching against products
    else {
      const matched = catalog.find(p => {
        const words = p.name.toLowerCase().split(' ');
        return words.some(w => w.length > 3 && lower.includes(w)) || p.description?.toLowerCase().includes(lower);
      });

      if (matched) {
        reply = `¡Excelente elección! Tenemos disponible *${matched.name}* por *$${matched.price.toLocaleString('es-CO')} COP* (${matched.description}). ¿Deseas cerrarlo y pedirlo ya?`;
        prodsToOffer = [matched];
      } else if (lower.includes('horario') || lower.includes('hora') || lower.includes('abierto')) {
        reply = `Nuestro horario de atención habitual es de Lunes a Domingo de 8:00 AM a 9:00 PM. ¡Y a través de este chatbot puedes comprar las 24 horas! 🕒`;
      } else if (lower.includes('domicilio') || lower.includes('envio') || lower.includes('entrega') || lower.includes('domiciliario')) {
        reply = `¡Sí, ofrecemos servicio de *domicilio* a todo el municipio de Yaguará y veredas cercanas! 🛵\n\n🏪 *Recoger en Tienda:* Gratis — $0 COP\n🛵 *Domicilio:* +$${deliveryFeeCalc.toLocaleString('es-CO')} COP (${DELIVERY_DISTANCE_KM} km aprox.)\n\nTiempo promedio de entrega: 20 a 35 min. Puedes elegir la opción al momento de *cerrar tu compra*. ¿Qué deseas pedir?`;
        prodsToOffer = catalog.slice(0, 2);
      } else if (lower.includes('pago') || lower.includes('metodo') || lower.includes('nequi') || lower.includes('daviplata')) {
        reply = `Aceptamos Nequi, Daviplata, Bancolombia y Efectivo contra entrega. Puedes cerrar y pagar tu compra directamente en esta ventana de chat. 💳`;
      } else if (lower.includes('persona') || lower.includes('asesor') || lower.includes('humano') || lower.includes('vendedor')) {
        reply = `¡Entendido! He notificado al comerciante encargado de *${currentChat.name}*. En un momento se unirá a este chat para hablar directamente contigo. 👨‍💼`;
      } else {
        reply = `¡Hola! Como Asistente de Ventas IA de *${currentChat.name}*, puedo tomar tu orden y cerrar tu compra de inmediato. ¿Qué producto te gustaría llevar hoy?`;
        prodsToOffer = catalog.slice(0, 2);
      }
    }

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: reply,
        sender: 'provider',
        isBot: true,
        products: prodsToOffer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 600);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const text = newMessage;
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      text, 
      sender: role === 'provider' ? 'provider' : 'client', 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }]);
    setNewMessage('');

    if (role !== 'provider') {
      triggerBotReply(text);
    }
  };

  // Initialize chat when activeChat changes
  useEffect(() => {
    if (activeChat) {
      setIsOpen(true);
      setIsDismissed(false);
      
      const chatCatalog = activeChat.products || CATEGORY_PRODUCTS[activeChat.categoryId] || [];
      
      let initialMsgs = [];
      let shouldAppendPromo = false;

      if (activeChat.initialProductToSell) {
        const prod = activeChat.initialProductToSell;
        initialMsgs = [
          { 
            id: 1, 
            text: `¡Hola! 👋 Te atiende el Asistente Vendedor IA de *${activeChat.name}*. Veo que estás consultando por *${prod.name}* ($${prod.price.toLocaleString('es-CO')} COP). ¡Puedo cerrar tu compra de inmediato aquí en el chat!`, 
            sender: 'provider', 
            isBot: true,
            products: [prod],
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
          }
        ];
      } else if (activeChat.openSalesBot) {
        initialMsgs = [
          { 
            id: 1, 
            text: `¡Hola! 👋 Soy el Asistente de Ventas IA de *${activeChat.name}*. Estoy aquí 24/7 para tomar tus pedidos y cerrar tus compras al instante. ¿Qué deseas ordenar hoy?`, 
            sender: 'provider', 
            isBot: true,
            products: chatCatalog.slice(0, 3),
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
          }
        ];
        shouldAppendPromo = true;
      } else if (activeChat.initialMessage || activeChat.prefilledMessage) {
        const msgText = activeChat.prefilledMessage || activeChat.initialMessage;
        initialMsgs = [
          { 
            id: 1, 
            text: `¡Hola! 👋 Te atiende el Asistente Vendedor IA de *${activeChat.name}*. Recibí tu mensaje:`, 
            sender: 'provider', 
            isBot: true,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
          },
          { 
            id: 2, 
            text: msgText, 
            sender: 'client', 
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
          }
        ];
        if (activeChat.prefilledMessage) {
           setTimeout(() => triggerBotReply(msgText), 1000);
        }
      } else {
        initialMsgs = [
          { 
            id: 1, 
            text: `¡Hola! 👋 Te atiende el Asistente Vendedor IA de *${activeChat.name}*. ¿Deseas ver nuestro catálogo o cerrar una orden directa?`, 
            sender: 'provider', 
            isBot: true,
            products: chatCatalog.slice(0, 2),
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
          }
        ];
        shouldAppendPromo = true;
      }

      if (shouldAppendPromo && providerPromotions.length > 0) {
        initialMsgs.push({
          id: Date.now(),
          text: `📢 *¡Tenemos promociones activas hoy!* \n\n${providerPromotions.map(p => `🎁 *${p.title}*: ${p.description}`).join('\n\n')}\n\n¿Te gustaría aprovechar alguna de estas ofertas?`,
          sender: 'provider',
          isBot: true,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });
      }

      setMessages(initialMsgs);
    } else {
      setMessages([
        { 
          id: 1, 
          text: `¡Hola! 👋 Te atiende el Asistente Inteligente de *${currentChat.name}*. ¿En qué producto o servicio te podemos colaborar hoy?`, 
          sender: 'provider', 
          isBot: true,
          products: catalog.slice(0, 2),
          time: '10:00 AM' 
        }
      ]);
    }
  }, [activeChat]);

  const toggleChat = () => setIsOpen(!isOpen);
  const closeChat = () => {
    setIsOpen(false);
    setActiveChat(null);
    setIsDismissed(true);
  };

  const handleCall = () => {
    setIsCalling(true);
  };

  const handleEndCall = () => {
    setIsCalling(false);
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      isCallRecord: true, 
      sender: role === 'provider' ? 'provider' : 'client', 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }]);
  };

  if (isDismissed && !activeChat) return null;

  return (
    <>
      {/* Floating Button (Minimized State) */}
      {!isOpen && role !== 'provider' && (
        <button 
          onClick={toggleChat}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-[#ff6b00] to-[#ff4500] rounded-2xl shadow-2xl shadow-[#ff6b00]/35 flex items-center justify-center text-white hover:scale-105 transition-all z-50 group border border-white/20"
          title={`Chatbot Vendedor - ${currentChat.name}`}
        >
          <Bot className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#141416] flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-[410px] h-[610px] max-h-[85vh] bg-[#141416] rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-[#1a1a1e] flex justify-between items-center z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ff6b00] to-[#ff4500] flex items-center justify-center text-white font-extrabold shadow-md shadow-[#ff6b00]/25 border border-white/15 overflow-hidden flex-shrink-0">
                {currentChat.avatar ? (
                  <img src={currentChat.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-extrabold text-white leading-tight text-sm truncate max-w-[170px]">
                    {role === 'provider' ? 'Cliente Anónimo' : currentChat.name}
                  </h3>
                  <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.2 rounded-full border border-green-500/20 font-bold flex-shrink-0">
                    Cierre IA
                  </span>
                </div>
                <p className={`text-[10px] font-bold flex items-center gap-1.5 mt-0.5 ${isBusinessOpen ? 'text-green-400' : 'text-red-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isBusinessOpen ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></span>
                  {isCalling ? 'Llamada en curso...' : (isBusinessOpen ? 'Vendedor IA 24/7 Activo' : 'No disponible hoy / Cerrado')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {!isCalling && (
                <button 
                  onClick={handleCall} 
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors" 
                  title="Llamada de voz"
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={toggleChat} 
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors" 
                title="Minimizar"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button 
                onClick={closeChat} 
                className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors" 
                title="Cerrar Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Unavailable Business Notice inside chat */}
          {!isBusinessOpen && (
            <div className="px-3.5 py-2 bg-red-500/15 border-b border-red-500/30 flex items-center space-x-2 text-[11px] text-red-300 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="truncate">{businessNote || 'Negocio cerrado hoy. Pedidos en pausa.'}</span>
            </div>
          )}

          {/* Call Overlay */}
          {isCalling && (
            <div className="absolute inset-0 bg-[#141416]/95 backdrop-blur-md z-20 flex flex-col items-center justify-center animate-in fade-in p-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#ff6b00] to-[#ff4500] p-1 mb-5 animate-pulse shadow-2xl shadow-[#ff6b00]/30 flex items-center justify-center">
                <Store className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">
                {role === 'provider' ? 'Cliente Anónimo' : currentChat.name}
              </h2>
              <p className="text-xs text-gray-400 mb-8">Llamada de voz Servi-Go en vivo...</p>
              
              <button 
                onClick={handleEndCall}
                className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all shadow-xl shadow-red-500/30"
                title="Colgar"
              >
                <PhoneCall className="w-6 h-6 rotate-[135deg]" />
              </button>
            </div>
          )}

          {/* Category Filter Pills Bar */}
          {productCategories.length > 2 && (
            <div className="px-3.5 py-2 bg-[#17171a] border-b border-white/10 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase flex-shrink-0 flex items-center gap-1 mr-1">
                <Layers className="w-3 h-3 text-[#ff6b00]" /> Categorías:
              </span>
              {productCategories.map((cat, cIdx) => (
                <button
                  key={cIdx}
                  type="button"
                  onClick={() => handleFilterByCategory(cat)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-xl whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedProductCategory === cat 
                      ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff4500] text-white shadow-md shadow-[#ff6b00]/25' 
                      : 'bg-[#1e1e24] text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Quick Sales Action Chips */}
          <div className="px-3.5 py-2 bg-[#141416] border-b border-white/10">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {[
                { label: '📂 Ver Categorías', query: '¿Qué categorías de productos tienen disponibles?' },
                { label: '🛍️ Ver Catálogo / Carta', query: 'Muéstrame el catálogo completo para ordenar.' },
                { label: '⭐ Más Vendido', query: '¿Qué es lo más vendido que me recomiendas comprar ya?' },
                { label: '🛵 Pedir Domicilio', query: '¿Cómo puedo pedir un domiciliario para que me lleven el pedido?' },
                { label: '⚡ Cerrar Compra de Carrito', query: 'Quiero cerrar la compra de los productos que tengo en mi carrito.' },
                { label: '💳 Medios de Pago', query: '¿Cuáles son los medios de pago que aceptan?' },
                { label: '👨‍💼 Hablar con Humano', query: 'Hola, deseo hablar con el comerciante humano.' }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    setMessages(prev => [...prev, {
                      id: Date.now(),
                      text: chip.query,
                      sender: 'client',
                      time
                    }]);
                    triggerBotReply(chip.query);
                  }}
                  className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#1e1e24] hover:bg-[#ff6b00]/15 hover:border-[#ff6b00]/40 text-gray-300 hover:text-[#ff6b00] border border-white/5 transition-all font-semibold flex-shrink-0 shadow-sm"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#121215]">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${((role === 'provider' && msg.sender === 'provider') || (role !== 'provider' && msg.sender === 'client')) ? 'justify-end' : 'justify-start'}`}
              >
                {/* 1. In-Chat Checkout Flow (Completar y Cerrar Compra Directamente Aquí) */}
                {msg.inChatCheckout ? (
                  <div className="w-full bg-[#18181d] border border-[#ff6b00]/40 p-4 rounded-2xl shadow-2xl space-y-3.5 text-xs animate-in zoom-in-95">
                    
                    {/* Header del Cierre de Compra */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-[#ff6b00]/20 flex items-center justify-center text-[#ff6b00]">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-white text-xs block">Cierre de Compra Directo</span>
                          <span className="text-[10px] text-gray-400">{currentChat.name}</span>
                        </div>
                      </div>
                      <span className="bg-[#ff6b00] text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
                        En Vivo
                      </span>
                    </div>
                    <div className="space-y-1.5 bg-[#141416] p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Productos:</span>
                      {msg.inChatCheckout.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-gray-200 truncate pr-2 font-medium">
                            <strong className="text-[#ff6b00]">{item.quantity || 1}x</strong> {item.name}
                          </span>
                          <span className="font-bold text-white whitespace-nowrap">
                            ${((item.price) * (item.quantity || 1)).toLocaleString('es-CO')}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-white/10 space-y-1">
                        {msg.inChatCheckout.discountPercentage && msg.inChatCheckout.discountAmount > 0 && (
                          <div className="flex justify-between items-center text-[11px] text-[#ff6b00]">
                            <span>Descuento Aplicado (-{msg.inChatCheckout.discountPercentage}%):</span>
                            <span>-${msg.inChatCheckout.discountAmount.toLocaleString('es-CO')}</span>
                          </div>
                        )}
                        {msg.inChatCheckout.deliveryOption === 'delivery' && (
                          <div className="flex justify-between items-center text-[11px] text-gray-300">
                            <span className="flex items-center gap-1">
                              <Bike className="w-3 h-3 text-[#ff6b00]" /> Domicilio ({DELIVERY_DISTANCE_KM} km):
                            </span>
                            <span className="text-[#ff6b00] font-bold">+${(msg.inChatCheckout.deliveryFee || 0).toLocaleString('es-CO')}</span>
                          </div>
                        )}
                        {msg.inChatCheckout.deliveryOption === 'pickup' && (
                          <div className="flex justify-between items-center text-[11px] text-green-300">
                            <span className="flex items-center gap-1">
                              <Store className="w-3 h-3 text-green-400" /> Recoger en Tienda:
                            </span>
                            <span className="text-green-400 font-bold">Gratis</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-300">Total a Pagar:</span>
                          <span className="text-sm font-black text-[#ff6b00]">
                            ${msg.inChatCheckout.total.toLocaleString('es-CO')} COP
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Domicilio vs Recoger en Tienda */}
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <Bike className="w-3 h-3 text-[#ff6b00]" /> Tipo de Entrega:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleDeliveryOption(msg.id, 'pickup')}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            msg.inChatCheckout.deliveryOption === 'pickup'
                              ? 'bg-[#ff6b00]/15 border-[#ff6b00] ring-1 ring-[#ff6b00]/30'
                              : 'bg-[#141416] border-white/5 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Store className={`w-3.5 h-3.5 ${msg.inChatCheckout.deliveryOption === 'pickup' ? 'text-[#ff6b00]' : 'text-gray-500'}`} />
                            <span className={`text-[11px] font-bold ${msg.inChatCheckout.deliveryOption === 'pickup' ? 'text-[#ff6b00]' : 'text-gray-400'}`}>Recoger en Tienda</span>
                          </div>
                          <span className={`text-[9px] font-bold block ${msg.inChatCheckout.deliveryOption === 'pickup' ? 'text-green-400' : 'text-gray-500'}`}>Gratis — $0</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleDeliveryOption(msg.id, 'delivery')}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            msg.inChatCheckout.deliveryOption === 'delivery'
                              ? 'bg-[#ff6b00]/15 border-[#ff6b00] ring-1 ring-[#ff6b00]/30'
                              : 'bg-[#141416] border-white/5 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Bike className={`w-3.5 h-3.5 ${msg.inChatCheckout.deliveryOption === 'delivery' ? 'text-[#ff6b00]' : 'text-gray-500'}`} />
                            <span className={`text-[11px] font-bold ${msg.inChatCheckout.deliveryOption === 'delivery' ? 'text-[#ff6b00]' : 'text-gray-400'}`}>Domicilio</span>
                          </div>
                          <span className={`text-[9px] font-bold block ${msg.inChatCheckout.deliveryOption === 'delivery' ? 'text-[#ff6b00]' : 'text-gray-500'}`}>+${deliveryFeeCalc.toLocaleString('es-CO')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Datos de Entrega Automáticos */}
                    {msg.inChatCheckout.deliveryOption === 'delivery' ? (
                      <div className="bg-[#141416] p-2.5 rounded-xl border border-white/5 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Dirección de Domicilio:</span>
                          <span className="text-[9px] text-[#ff6b00] bg-[#ff6b00]/10 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                            <Bike className="w-2.5 h-2.5" /> Domicilio
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-gray-300">
                          <span className="font-bold text-white">{customerName}</span>
                          <span className="font-mono text-[#ff6b00]">{customerPhone}</span>
                        </div>
                        <div className="flex items-center text-gray-400 text-[11px] gap-1 truncate pt-0.5">
                          <MapPin className="w-3 h-3 text-[#ff6b00] flex-shrink-0" />
                          <span className="truncate">{customerAddress}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#141416] p-2.5 rounded-xl border border-green-500/20 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Recogida en Tienda:</span>
                          <span className="text-[9px] text-green-400 bg-green-500/10 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                            <Store className="w-2.5 h-2.5" /> Gratis
                          </span>
                        </div>
                        <div className="flex items-center text-green-300 text-[11px] gap-1 pt-0.5">
                          <Store className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span>Recoge tu pedido en <strong className="text-white">{currentChat.name}</strong></span>
                        </div>
                        <div className="flex justify-between items-center text-gray-300 text-[11px]">
                          <span className="font-bold text-white">{customerName}</span>
                          <span className="font-mono text-[#ff6b00]">{customerPhone}</span>
                        </div>
                      </div>
                    )}

                    {/* Selección de Método de Pago */}
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">
                        Selecciona Método de Pago:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['nequi', 'daviplata', 'bancos', 'efectivo'].map(key => {
                          const info = PAYMENT_INFO[key];
                          const isSelected = msg.inChatCheckout.selectedPayment === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleSelectCheckoutPayment(msg.id, key)}
                              className={`p-2 rounded-xl border text-[11px] font-bold text-left transition-all flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-[#ff6b00]/20 border-[#ff6b00] text-[#ff6b00]' 
                                  : 'bg-[#141416] text-gray-400 border-white/5 hover:bg-white/5'
                              }`}
                            >
                              <span>{info.name}</span>
                              {isSelected && <Check className="w-3 h-3" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cuenta Oficial para Pago */}
                    <div className="bg-[#141416] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block">
                          {PAYMENT_INFO[msg.inChatCheckout.selectedPayment].type}:
                        </span>
                        <span className="text-xs font-mono font-bold text-white">
                          {PAYMENT_INFO[msg.inChatCheckout.selectedPayment].number}
                        </span>
                      </div>
                      {msg.inChatCheckout.selectedPayment !== 'efectivo' && (
                        <button
                          type="button"
                          onClick={() => handleCopyAccount(PAYMENT_INFO[msg.inChatCheckout.selectedPayment].number)}
                          className="px-2.5 py-1 bg-[#ff6b00]/15 hover:bg-[#ff6b00]/25 text-[#ff6b00] rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                        >
                          {copiedAccount ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          {copiedAccount ? 'Copiado' : 'Copiar'}
                        </button>
                      )}
                    </div>

                    {/* Baucher / Comprobante Upload */}
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                        Evidencia / Baucher de Pago:
                      </span>
                      <label className="border border-dashed border-white/15 hover:border-[#ff6b00]/50 rounded-xl p-2 flex items-center justify-between cursor-pointer bg-[#141416] transition-colors">
                        <div className="flex items-center space-x-2 truncate">
                          {msg.inChatCheckout.voucher ? (
                            <>
                              <img src={msg.inChatCheckout.voucher} alt="Baucher" className="w-7 h-7 rounded-lg object-cover border border-green-500 flex-shrink-0" />
                              <span className="text-[11px] font-bold text-green-400 truncate flex items-center">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Baucher adjunto
                              </span>
                            </>
                          ) : (
                            <>
                              <Camera className="w-4 h-4 text-[#ff6b00] flex-shrink-0" />
                              <span className="text-[11px] text-gray-300 truncate">Adjuntar foto o captura del pago</span>
                            </>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-[#ff6b00] px-2 py-0.5 bg-[#ff6b00]/10 rounded-lg ml-1">
                          {msg.inChatCheckout.voucher ? 'Cambiar' : 'Subir'}
                        </span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleCheckoutVoucherUpload(msg.id, e)} 
                        />
                      </label>
                    </div>

                    {/* BOTÓN FINAL PARA CERRAR LA COMPRA */}
                    <button
                      type="button"
                      onClick={() => handleFinalizeInChatPurchase(msg.id, msg.inChatCheckout)}
                      className="w-full bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:opacity-95 text-white font-black py-3 rounded-xl transition-all shadow-xl shadow-[#ff6b00]/25 text-xs flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {msg.inChatCheckout.deliveryOption === 'delivery' 
                        ? `🛵 Confirmar con Domicilio ($${msg.inChatCheckout.total.toLocaleString('es-CO')} COP)` 
                        : `🏪 Confirmar Recogida en Tienda ($${msg.inChatCheckout.total.toLocaleString('es-CO')} COP)`
                      }
                    </button>

                  </div>
                ) : msg.isClosedOrder ? (
                  /* 2. Factura Electrónica de Venta Oficial DIAN */
                  <FacturaElectronicaCard 
                    facturaData={msg.closedOrderData} 
                    isCompact={true}
                    onViewVoucher={(img) => setViewingImage(img)} 
                  />
                ) : msg.isImage ? (
                  /* 3. Imagen / Baucher normal */
                  <div className={`max-w-[85%] p-2.5 rounded-2xl shadow-xl ${((role === 'provider' && msg.sender === 'provider') || (role !== 'provider' && msg.sender === 'client')) ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff4500] text-white rounded-tr-xs' : 'bg-[#1e1e24] border border-white/10 text-gray-200 rounded-tl-xs'}`}>
                    <div 
                      onClick={() => setViewingImage(msg.imageUrl)}
                      className="cursor-pointer overflow-hidden rounded-xl border border-white/10 relative group bg-black/40"
                    >
                      <img src={msg.imageUrl} alt="Evidencia" className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                        <Eye className="w-4 h-4" /> Ampliar Baucher
                      </div>
                    </div>
                    {msg.caption && (
                      <p className="text-xs font-bold mt-1.5 px-1">{msg.caption}</p>
                    )}
                    <span className={`text-[9px] block mt-1 ${((role === 'provider' && msg.sender === 'provider') || (role !== 'provider' && msg.sender === 'client')) ? 'text-white/80 text-right' : 'text-gray-500'}`}>{msg.time}</span>
                  </div>
                ) : (
                  /* 4. Mensajes Regulares de Diálogo y Oferta del Bot */
                  <div 
                    className={`max-w-[88%] p-3.5 rounded-2xl shadow-md ${
                      ((role === 'provider' && msg.sender === 'provider') || (role !== 'provider' && msg.sender === 'client'))
                        ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff4500] text-white rounded-tr-xs shadow-lg shadow-[#ff6b00]/15'
                        : 'bg-[#1e1e24] border border-white/10 text-gray-200 rounded-tl-xs'
                    }`}
                  >
                    {msg.isBot && (
                      <div className="flex items-center space-x-1.5 mb-1.5 text-[10px] text-[#ff6b00] font-bold uppercase tracking-wider bg-[#ff6b00]/10 px-2 py-0.5 rounded-md inline-flex border border-[#ff6b00]/20">
                        <Bot className="w-3.5 h-3.5 mr-1" />
                        <span>Vendedor IA • {currentChat.name}</span>
                      </div>
                    )}
                    
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                      {renderFormattedText(msg.text)}
                    </div>

                    {/* Tarjetas de Producto para Venta Directa en el Chat */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="space-y-2 mt-3 pt-2.5 border-t border-white/10">
                        <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider block">
                          Productos Disponibles para Ordenar:
                        </span>
                        {msg.products.map(prod => (
                          <div 
                            key={prod.id} 
                            className="bg-[#141416] p-2.5 rounded-xl border border-white/10 flex items-center justify-between gap-2.5 hover:border-[#ff6b00]/40 transition-colors shadow-sm"
                          >
                            <img 
                              src={prod.image} 
                              alt={prod.name} 
                              onClick={() => setViewingImage(prod.image)}
                              title="Ver imagen completa"
                              onError={(e) => { e.target.src = `https://picsum.photos/seed/${prod.id}/100/100`; }}
                              className="w-12 h-12 rounded-lg object-cover border border-white/10 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform" 
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1.5 mb-1">
                                {prod.category && (
                                  <span className="text-[9px] font-bold text-[#ff6b00] bg-[#ff6b00]/10 px-1.5 py-0.5 rounded border border-[#ff6b00]/20 inline-block">
                                    {prod.category}
                                  </span>
                                )}
                                {!isProductInStock(prod.id) && (
                                  <span className="text-[9px] font-extrabold text-red-400 bg-red-500/15 px-1.5 py-0.5 rounded border border-red-500/30 inline-block">
                                    Agotado
                                  </span>
                                )}
                              </div>
                              <span className={`font-bold text-xs block truncate ${isProductInStock(prod.id) ? 'text-white' : 'text-gray-400 line-through'}`}>
                                {prod.name}
                              </span>
                              <span className="text-xs font-black text-[#ff6b00] block">
                                ${prod.price.toLocaleString('es-CO')} <span className="text-[9px] font-normal text-gray-400">/ {prod.unit || 'unidad'}</span>
                              </span>
                              {prod.description && (
                                <span className="text-[9px] text-gray-400 block truncate">{prod.description}</span>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              {isProductInStock(prod.id) && isBusinessOpen ? (
                                <button 
                                  type="button"
                                  onClick={() => handleAddProductFromChat(prod)}
                                  className="px-3.5 py-2 bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#ff6b00]/25"
                                  title="Añadir a mi orden"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Añadir
                                </button>
                              ) : (
                                <button 
                                  disabled
                                  className="px-3 py-1.5 bg-red-500/15 border border-red-500/25 text-red-400 font-extrabold rounded-xl text-[10px] cursor-not-allowed"
                                >
                                  {!isBusinessOpen ? 'Cerrado' : 'Agotado'}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <span className={`text-[9px] block mt-1.5 ${((role === 'provider' && msg.sender === 'provider') || (role !== 'provider' && msg.sender === 'client')) ? 'text-white/80 text-right font-medium' : 'text-gray-500'}`}>
                      {msg.time}
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Barra de Resumen de Pedido y Cierre de Compra cuando el cliente tenga productos */}
          {cartItems.length > 0 && (
            <div className="px-3.5 py-2.5 bg-[#18181d] border-t border-white/10 flex items-center justify-between">
              <div 
                className="flex items-center space-x-2 min-w-0 cursor-pointer hover:bg-white/5 p-1 rounded-lg transition-colors"
                onClick={() => setIsCartOpen(true)}
                title="Ver carrito de compras"
              >
                <div className="w-7 h-7 rounded-lg bg-[#ff6b00]/20 flex items-center justify-center text-[#ff6b00] flex-shrink-0">
                  <ShoppingCart className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block leading-tight truncate">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)} {cartItems.reduce((s, i) => s + i.quantity, 0) === 1 ? 'producto' : 'productos'} en orden
                  </span>
                  <span className="text-[11px] font-black text-[#ff6b00] font-mono block">
                    ${cartItems.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleInitiateInChatCheckout(cartItems, true)}
                className="bg-gradient-to-r from-[#ff6b00] to-[#ff4500] hover:opacity-95 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-[#ff6b00]/25 flex items-center gap-1.5 transition-all flex-shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Cerrar Compra
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-[#1a1a1e] border-t border-white/10">
            <div className="flex items-center bg-[#141416] border border-white/10 focus-within:border-[#ff6b00] focus-within:ring-1 focus-within:ring-[#ff6b00]/30 rounded-2xl p-1.5 transition-all">
              
              {/* Attachment Button for Vouchers / Photos */}
              <button 
                type="button"
                onClick={() => chatImageInputRef.current?.click()}
                title="Adjuntar foto o baucher de pago"
                className="p-2 text-gray-400 hover:text-[#ff6b00] hover:bg-white/5 rounded-xl transition-colors flex-shrink-0"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={chatImageInputRef}
                onChange={handleChatImageUpload} 
              />

              <input 
                type="text" 
                placeholder="Pide un producto o escribe 'cerrar compra'..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none px-2"
              />

              <button 
                type="button"
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="w-8 h-8 rounded-xl bg-[#ff6b00] hover:bg-[#ff6b00]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all flex-shrink-0 shadow-md shadow-[#ff6b00]/25"
                title="Enviar mensaje"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Generic Image Lightbox Modal */}
      {viewingImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={viewingImage} 
              alt="Vista ampliada" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" 
            />
          </div>
        </div>
      )}
    </>
  );
}
