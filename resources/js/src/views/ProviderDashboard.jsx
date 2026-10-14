import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  MessageSquare,
  Image as ImageIcon,
  Store,
  DollarSign,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Megaphone
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import usePromotionsStore from '../store/usePromotionsStore';
import ProviderInboxModal from '../components/ProviderInboxModal';

export default function ProviderDashboard({ provider }) {
  const [activeTab, setActiveTab] = useState('promotions');
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const addPromotion = usePromotionsStore(state => state.addPromotion);
  const promotions = usePromotionsStore(state => state.promotions);
  const providerPromotions = promotions.filter(p => p.providerId === provider.id);
  
  const [newPromo, setNewPromo] = useState({ title: '', description: '', promoType: 'fixed', price: '', discountPercentage: '', image: '', color: 'from-[#ff6b00] to-[#ff4500]' });

  const handleCreatePromo = (e) => {
    e.preventDefault();
    if (!newPromo.title || !newPromo.description) return;
    if (newPromo.promoType === 'fixed' && !newPromo.price) return;
    if (newPromo.promoType === 'percentage' && !newPromo.discountPercentage) return;
    
    addPromotion({
      ...newPromo,
      price: newPromo.promoType === 'fixed' ? parseInt(newPromo.price, 10) : null,
      discountPercentage: newPromo.promoType === 'percentage' ? parseInt(newPromo.discountPercentage, 10) : null,
      image: newPromo.image || 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=400',
      providerId: provider.id,
      providerName: provider.name
    });
    
    setNewPromo({ title: '', description: '', promoType: 'fixed', price: '', discountPercentage: '', image: '', color: 'from-[#ff6b00] to-[#ff4500]' });
    alert('Promoción publicada con éxito por 24 horas');
  };

  // Tab configuration
  const tabs = [
    { id: 'promotions', label: 'Promociones (24h)', icon: Megaphone },
    { id: 'menu', label: `Catálogo / Menú (${provider?.products?.length || 0})`, icon: Store },
    { id: 'gallery', label: 'Galería (1)', icon: ImageIcon },
    { id: 'commissions', label: '$ Comisiones (5%)', icon: DollarSign },
    { id: 'profile', label: 'Fotos y Perfil', icon: ImageIcon },
    { id: 'settings', label: 'Ajustes', icon: Store }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 font-sans pt-4">
      
      {/* 1. Hero Banner Card */}
      <div className="bg-[#0b132c] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex items-center gap-6 relative z-10 w-full sm:w-auto">
          <img 
            src={provider.avatar} 
            alt={provider.name}
            onError={(e) => { e.target.src = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`; }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover bg-black/50 border-2 border-white/10 shadow-xl"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight flex items-center gap-3">
              {provider.name}
            </h1>
            <p className="text-sm text-blue-200 mt-1">{provider.category} • {provider.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 sm:mt-0 relative z-10 w-full sm:w-auto justify-end">
          {provider.verified && (
            <div className="flex items-center px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 font-bold text-xs tracking-wider">
              <ShieldCheck className="w-4 h-4 mr-1.5" /> Verificado
            </div>
          )}
          <button className="flex items-center space-x-1.5 text-xs font-bold text-gray-300 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-colors">
            <QrCode className="w-4 h-4" />
            <span>Mi Código QR</span>
          </button>
          <button 
            onClick={() => setIsInboxOpen(true)}
            className="flex items-center space-x-1.5 text-xs font-extrabold text-white bg-[#00c853] hover:bg-[#00e676] px-5 py-2.5 rounded-xl shadow-lg shadow-green-500/20 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inbox de Clientes</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Tratos Cerrados</span>
          <span className="text-3xl font-black text-black">310</span>
          <span className="text-[11px] font-bold text-green-600 mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +12% este mes
          </span>
        </div>
        
        {/* KPI 2 */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Ventas Totales (GMV)</span>
          <span className="text-3xl font-black text-black">$22.000</span>
          <span className="text-[11px] font-bold text-gray-500 mt-1">En pesos colombianos</span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Comisión Vecired (5%)</span>
          <span className="text-3xl font-black text-green-600">$1.100</span>
          <span className="text-[11px] font-bold text-gray-500 mt-1">Deducida por trato cerrado</span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Tasa de Respuesta</span>
          <span className="text-3xl font-black text-black">100%</span>
          <span className="text-[11px] font-bold text-gray-500 mt-1">Tpo. prom ~8 min</span>
        </div>
      </div>

      {/* 3. Tabs Navigation */}
      <div className="flex space-x-6 border-b border-white/5 pb-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 pb-4 border-b-2 font-bold text-sm transition-all whitespace-nowrap px-1 ${
              activeTab === tab.id 
                ? 'text-white border-white' 
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            {tab.id === 'menu' && (
              <div className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 ${activeTab === 'menu' ? 'bg-white/10 text-white' : ''}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </div>
            )}
            {tab.id === 'gallery' && (
              <div className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 ${activeTab === 'gallery' ? 'bg-white/10 text-white' : ''}`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </div>
            )}
            {tab.id !== 'menu' && tab.id !== 'gallery' && (
              <span className="flex items-center gap-1.5">
                {tab.id !== 'commissions' && <tab.icon className="w-4 h-4" />}
                {tab.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 4. Tab Contents */}
      
      {/* PROMOTIONS TAB */}
      {activeTab === 'promotions' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-[#1a1a24] p-6 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#ff6b00]" /> Crear Promoción Flash
            </h2>
            <p className="text-sm text-gray-400 mb-6">Esta promoción aparecerá destacada en la página principal (Home) para todos los usuarios durante 24 horas.</p>
            
            <form onSubmit={handleCreatePromo} className="space-y-4 max-w-xl">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Título de la Promoción</label>
                <input 
                  type="text"
                  value={newPromo.title}
                  onChange={e => setNewPromo({...newPromo, title: e.target.value})}
                  placeholder="Ej. ¡2x1 en Hamburguesas!"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                  maxLength={40}
                  required
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Descripción corta</label>
                <textarea 
                  value={newPromo.description}
                  onChange={e => setNewPromo({...newPromo, description: e.target.value})}
                  placeholder="Ej. Válido de 6pm a 10pm presentando este anuncio."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm h-20 resize-none"
                  maxLength={100}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-300 block mb-2">Tipo de Promoción</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input 
                      type="radio" 
                      name="promoType" 
                      checked={newPromo.promoType === 'fixed'} 
                      onChange={() => setNewPromo({...newPromo, promoType: 'fixed'})}
                      className="accent-[#ff6b00]"
                    />
                    Producto / Combo (Precio Fijo)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input 
                      type="radio" 
                      name="promoType" 
                      checked={newPromo.promoType === 'percentage'} 
                      onChange={() => setNewPromo({...newPromo, promoType: 'percentage'})}
                      className="accent-[#ff6b00]"
                    />
                    Descuento Porcentual (%)
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {newPromo.promoType === 'fixed' ? (
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Precio Promocional ($ COP)</label>
                    <input 
                      type="number"
                      value={newPromo.price}
                      onChange={e => setNewPromo({...newPromo, price: e.target.value})}
                      placeholder="Ej. 10000"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                      required={newPromo.promoType === 'fixed'}
                      min="1"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">Porcentaje de Descuento (%)</label>
                    <input 
                      type="number"
                      value={newPromo.discountPercentage}
                      onChange={e => setNewPromo({...newPromo, discountPercentage: e.target.value})}
                      placeholder="Ej. 20"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm"
                      required={newPromo.promoType === 'percentage'}
                      min="1"
                      max="100"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Foto de la Promoción (Opcional)</label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewPromo({...newPromo, image: reader.result});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#ff6b00]/20 file:text-[#ff6b00] hover:file:bg-[#ff6b00]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Color de Fondo</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setNewPromo({...newPromo, color: 'from-[#ff6b00] to-[#ff4500]'})} className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b00] to-[#ff4500] border-2 ${newPromo.color === 'from-[#ff6b00] to-[#ff4500]' ? 'border-white' : 'border-transparent'}`}></button>
                  <button type="button" onClick={() => setNewPromo({...newPromo, color: 'from-blue-600 to-indigo-700'})} className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 border-2 ${newPromo.color === 'from-blue-600 to-indigo-700' ? 'border-white' : 'border-transparent'}`}></button>
                  <button type="button" onClick={() => setNewPromo({...newPromo, color: 'from-green-600 to-emerald-700'})} className={`w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-700 border-2 ${newPromo.color === 'from-green-600 to-emerald-700' ? 'border-white' : 'border-transparent'}`}></button>
                  <button type="button" onClick={() => setNewPromo({...newPromo, color: 'from-purple-600 to-fuchsia-700'})} className={`w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-700 border-2 ${newPromo.color === 'from-purple-600 to-fuchsia-700' ? 'border-white' : 'border-transparent'}`}></button>
                </div>
              </div>
              
              <div className="pt-2">
                <button type="submit" className="bg-[#ff6b00] hover:bg-[#ff8533] text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-[#ff6b00]/20 flex items-center gap-2">
                  <Megaphone className="w-4 h-4" /> Publicar Anuncio (24h)
                </button>
              </div>
            </form>
          </div>

          {providerPromotions.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Mis Promociones Activas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providerPromotions.map(promo => (
                  <div key={promo.id} className={`bg-gradient-to-r ${promo.color} p-5 rounded-2xl flex items-center justify-between shadow-xl border-2 border-white/20 animate-neon-pulse`}>
                    <div className="text-white">
                      <h4 className="font-bold text-lg leading-tight">{promo.title}</h4>
                      <p className="text-xs text-white/80 mt-1 max-w-[200px]">{promo.description}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] bg-black/20 px-2 py-1 rounded-md inline-block">
                          Termina en: {Math.max(0, 24 - Math.floor((Date.now() - promo.createdAt)/(1000*60*60)))}h
                        </span>
                        {promo.promoType === 'percentage' ? (
                          <span className="text-xs font-black bg-white text-black px-2 py-1 rounded-md">
                            -{promo.discountPercentage}% OFF
                          </span>
                        ) : (
                          <span className="text-xs font-black bg-white text-black px-2 py-1 rounded-md">
                            ${promo.price?.toLocaleString('es-CO')}
                          </span>
                        )}
                      </div>
                    </div>
                    {promo.image && <img src={promo.image} className="w-16 h-16 rounded-xl object-cover border border-white/20" alt="promo" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MENU TAB */}
      {activeTab === 'menu' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Administra tus productos, tarifas o servicios para cotizar rápidamente en los chats.</p>
            <button className="flex items-center space-x-1.5 text-xs font-extrabold text-white bg-[#00c853] hover:bg-[#00e676] px-5 py-2.5 rounded-full shadow-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span>Añadir Producto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {provider.products.map(product => (
              <div key={product.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-bold text-black text-sm">{product.name}</h3>
                    <span className="font-black text-[#00c853] text-sm shrink-0">${product.price.toLocaleString('es-CO')}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">{product.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center px-3 py-1 rounded-full bg-green-50 text-[#00c853] font-bold text-xs gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Disponible
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GALLERY TAB */}
      {activeTab === 'gallery' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">Sube fotos de evidencia de tus mejores trabajos para generar confianza.</p>
            <button className="flex items-center space-x-1.5 text-xs font-extrabold text-white bg-[#00c853] hover:bg-[#00e676] px-5 py-2.5 rounded-full shadow-lg transition-colors">
              <Plus className="w-4 h-4" />
              <span>Añadir Foto de Evidencia</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col">
              <div className="h-40 rounded-2xl bg-gray-100 mb-3 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Evidencia" />
              </div>
              <h4 className="font-bold text-sm text-black mb-1">Quesillos recién empacados en hoja</h4>
              <span className="text-xs text-gray-500">2026-08-01</span>
            </div>
          </div>
        </div>
      )}

      {/* COMMISSIONS TAB */}
      {activeTab === 'commissions' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2 text-[#00c853]">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="font-bold text-base text-black">Libro de Tratos Cerrados & Comisiones Transparentes</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              VeciRed solo descuenta el <strong className="text-black">5% de comisión</strong> al momento en que un cliente o tú confirman un trato dentro del chat.
            </p>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-black">Combo Yaguareño con Quesillo y Achiras</h4>
                <p className="text-xs text-gray-400 mt-1">Cliente: Laura Morales • 2026-08-24 10:24</p>
              </div>
              <div className="text-right">
                <span className="font-black text-black text-sm block">$22.000 COP</span>
                <span className="font-bold text-[#00c853] text-xs">Comisión (5%): -$1.100 COP</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 max-w-4xl">
            <h3 className="font-bold text-lg text-black mb-1">Foto de Perfil & Imagen de Portada (B7)</h3>
            <p className="text-sm text-gray-500 mb-8">Personaliza la apariencia de tu negocio. Una foto clara genera 3x más confianza en los clientes.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-black mb-2">Imagen de Portada (Banner):</label>
                <div className="h-32 bg-gray-100 rounded-2xl mb-3 relative overflow-hidden group">
                  <img src={provider.image} alt="Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold text-xs flex items-center gap-1 bg-black/50 px-3 py-1.5 rounded-full"><ImageIcon className="w-3.5 h-3.5" /> Vista Previa</span>
                  </div>
                </div>
                <input type="text" readOnly value={provider.image} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400" />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Foto de Perfil / Logo:</label>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 shrink-0 overflow-hidden">
                    <img src={provider.avatar} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <input type="text" readOnly value={provider.avatar} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400">Pega una URL de imagen directa (JPG/PNG).</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">Presentación / Bio de la Empresa:</label>
                <textarea rows={4} readOnly value={provider.description} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 resize-none"></textarea>
              </div>

              <button className="bg-[#00c853] hover:bg-[#00e676] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg">
                Guardar Fotos y Presentación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 max-w-4xl">
            <h3 className="font-bold text-lg text-black mb-1">Ajustes de Cuenta & Estado (B3)</h3>
            <p className="text-sm text-gray-500 mb-8">Configura los datos principales de tu comercio o servicio en VeciRed.</p>
            
            <div className="space-y-6">
              
              {/* Toggle Status */}
              <div className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-black">Estado de Recepción de Solicitudes</h4>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00c853]"></span> Abierto — Tu perfil aparece en los resultados de búsqueda</p>
                </div>
                <div className="bg-[#00c853] text-white font-bold text-xs px-4 py-1.5 rounded-full cursor-pointer shadow-md">
                  Abierto
                </div>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">Nombre Comercial:</label>
                  <input type="text" readOnly value={provider.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">Barrio / Comuna:</label>
                  <input type="text" readOnly value="Centro" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">Dirección Física:</label>
                  <input type="text" readOnly value={provider.fullAddress} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2">Teléfono Enmascarado:</label>
                  <input type="text" readOnly value="312 *** 8819" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400" />
                </div>
              </div>

              <button className="bg-[#0f172a] hover:bg-black text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg">
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inbox Modal */}
      <ProviderInboxModal 
        isOpen={isInboxOpen} 
        onClose={() => setIsInboxOpen(false)} 
        providerName={provider.name}
      />
    </div>
  );
}
