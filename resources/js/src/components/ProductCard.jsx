import React, { useState } from 'react';
import { Plus, Minus, Image as ImageIcon, MessageSquare, AlertCircle } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import useCartStore from '../store/useCartStore';
import useAvailabilityStore from '../store/useAvailabilityStore';

export default function ProductCard({ product, provider, isOwner = false, canPurchase = true }) {
  const setActiveChat = useAppStore(state => state.setActiveChat);
  const items = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const setIsOpen = useCartStore(state => state.setIsOpen);
  const isProductInStock = useAvailabilityStore(state => state.isProductInStock);

  const isInStock = isProductInStock(product.id);
  
  const cartItem = items.find(i => i.id === product.id);
  const [localQuantity, setLocalQuantity] = useState(1);
  const currentQuantity = cartItem ? cartItem.quantity : localQuantity;

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editedPrice, setEditedPrice] = useState(product.price);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePrice = () => {
    setIsSaving(true);
    setTimeout(() => {
      product.price = parseInt(editedPrice, 10);
      setIsEditingPrice(false);
      setIsSaving(false);
    }, 600);
  };

  const handleAsk = () => {
    if (provider) {
      setActiveChat({
        ...provider,
        initialProductToSell: product
      });
    }
  };

  const handleAdd = () => {
    if (cartItem) {
      updateQuantity(product.id, currentQuantity);
    } else {
      addItem({ ...product, provider });
      if (localQuantity > 1) {
        updateQuantity(product.id, localQuantity);
      }
    }
    // setIsOpen(true); // Removed so it doesn't force the user to pay immediately
  };

  const decreaseQuantity = () => {
    if (cartItem) {
      if (currentQuantity > 1) updateQuantity(product.id, currentQuantity - 1);
      else removeItem(product.id);
    } else {
      if (localQuantity > 1) setLocalQuantity(localQuantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (cartItem) {
      updateQuantity(product.id, currentQuantity + 1);
    } else {
      setLocalQuantity(localQuantity + 1);
    }
  };

  const [isViewingImage, setIsViewingImage] = useState(false);

  return (
    <>
      {/* Modal for full screen image viewing */}
      {isViewingImage && product.image && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsViewingImage(false)}
        >
          <div className="relative max-w-4xl w-full h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsViewingImage(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors"
            >
              <AlertCircle className="w-6 h-6 rotate-45" /> {/* Using alert circle as a close button fallback, or just an X */}
            </button>
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
            />
            <h3 className="text-white font-bold text-xl mt-4 text-center">{product.name}</h3>
          </div>
        </div>
      )}

      <div className={`bg-[#151515] rounded-3xl border transition-all duration-300 shadow-lg relative overflow-hidden flex flex-col h-full hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] hover:-translate-y-1 ${
        isInStock ? 'border-white/5 hover:border-[#ff6b00]/30' : 'border-red-500/20 bg-[#161314]'
      }`}>
        
        {/* Out of Stock Overlay Badge */}
        {!isInStock && (
          <div className="absolute top-3 left-3 z-10 bg-red-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Agotado hoy
          </div>
        )}

        {/* Product Image */}
        {product.image ? (
          <div 
            className="w-full aspect-[4/3] sm:aspect-video bg-[#0a0a0a] relative overflow-hidden cursor-pointer group"
            onClick={() => setIsViewingImage(true)}
            title="Clic para ver imagen completa"
          >
            {/* Blurred background to fill space gracefully */}
            <div 
              className="absolute inset-0 opacity-30 blur-md scale-110"
              style={{ backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            ></div>
            <img 
              src={product.image} 
              alt={product.name} 
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.id}/400/300`; }}
              className={`w-full h-full relative z-10 object-contain p-2 transition-transform duration-300 group-hover:scale-105 ${
                !isInStock ? 'grayscale-[40%] opacity-60' : ''
              }`} 
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-[#111] flex items-center justify-center text-gray-600">
            <ImageIcon className="w-8 h-8 opacity-50" />
          </div>
        )}

      <div className="p-6 flex flex-col flex-1">
        <h4 className={`font-bold text-white text-lg leading-tight mb-2 ${!product.image ? 'pr-8' : ''}`}>{product.name}</h4>
        <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
        
        <div className="mb-6">
          {isEditingPrice ? (
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 font-bold text-lg">$</span>
              <input 
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
                className="bg-[#1f1f24] border border-white/10 rounded-lg px-2 py-1 text-[#ffcc00] font-bold text-lg w-28 focus:outline-none focus:border-[#ff6b00]"
                autoFocus
              />
              <span className="text-gray-500 text-xs ml-1 font-medium">/ {product.unit || 'unidad'}</span>
            </div>
          ) : (
            <>
              <span className={`font-bold text-lg ${isInStock ? 'text-[#ffcc00]' : 'text-gray-500 line-through'}`}>
                ${product.price.toLocaleString('es-CO')} COP
              </span>
              <span className="text-gray-500 text-xs ml-1 font-medium">/ {product.unit || 'unidad'}</span>
            </>
          )}
        </div>
        
        {/* Footer actions: Hide if cannot purchase */}
        {canPurchase && (
          <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
            {/* Quantity Selector */}
            <div className={`flex items-center space-x-2 bg-[#0a0a0a] rounded-full border border-white/10 px-2 py-1.5 ${
              !isInStock ? 'opacity-40 pointer-events-none' : ''
            }`}>
              <button onClick={decreaseQuantity} className="text-gray-400 hover:text-white transition-colors p-1">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm w-4 text-center text-white">{currentQuantity}</span>
              <button onClick={increaseQuantity} className="text-gray-400 hover:text-white transition-colors p-1">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex space-x-2">
              {/* Ask Button */}
              <button 
                onClick={handleAsk} 
                title="Preguntar disponibilidad por Chat"
                className="bg-white/5 hover:bg-white/10 text-white font-bold p-2.5 rounded-full transition-all shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              
              {/* Add Button */}
              {isInStock ? (
                <button 
                  onClick={handleAdd} 
                  className="bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-bold px-4 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-lg shadow-[#ff6b00]/20 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  {cartItem ? 'Actualizar' : 'Añadir'}
                </button>
              ) : (
                <button 
                  disabled 
                  className="bg-red-500/20 border border-red-500/30 text-red-400 font-extrabold px-4 py-2.5 rounded-full text-xs cursor-not-allowed flex items-center"
                >
                  Agotado
                </button>
              )}
            </div>
          </div>
        )}

        {/* Owner Actions */}
        {isOwner && (
          <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-white/5">
            {isEditingPrice ? (
              <button 
                onClick={handleSavePrice}
                disabled={isSaving}
                className="bg-green-500/20 text-green-400 border border-green-500/40 font-bold px-4 py-1.5 rounded-lg text-xs hover:bg-green-500/30 transition-colors flex items-center gap-1"
              >
                {isSaving ? 'Guardando...' : 'Guardar Precio'}
              </button>
            ) : (
              <button 
                onClick={() => setIsEditingPrice(true)}
                className="bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-blue-500/20 transition-colors flex items-center gap-1"
              >
                Editar Precio
              </button>
            )}
            <button 
              onClick={() => alert('Función de eliminar producto en construcción')}
              className="bg-red-500/10 text-red-400 border border-red-500/30 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/20 transition-colors flex items-center gap-1"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
