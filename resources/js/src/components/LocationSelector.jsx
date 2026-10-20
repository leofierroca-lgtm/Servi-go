import React, { useState } from 'react';
import { X, MapPin, Navigation, Search } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const MUNICIPALITIES = [
  'Yaguará'
];

export default function LocationSelector({ isOpen = true, onClose }) {
  const { location, setLocation } = useAppStore();
  const [isLocating, setIsLocating] = useState(false);
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const handleSelect = (mun) => {
    setLocation(mun);
    onClose();
  };

  const handleGPS = () => {
    setIsLocating(true);
    // Simulate GPS delay
    setTimeout(() => {
      setLocation('Yaguará');
      setIsLocating(false);
      onClose();
    }, 1500);
  };

  const filtered = MUNICIPALITIES.filter(m => m.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Seleccionar Ubicación</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={handleGPS}
            disabled={isLocating}
            className="w-full flex items-center justify-center space-x-2 bg-orange-50 hover:bg-orange-100 text-primary py-3 rounded-xl transition-colors font-medium disabled:opacity-70"
          >
            {isLocating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            ) : (
              <Navigation className="w-5 h-5" />
            )}
            <span>{isLocating ? 'Detectando ubicación...' : 'Usar mi ubicación GPS actual'}</span>
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar municipio..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-1">
            {filtered.map(mun => (
              <button
                key={mun}
                onClick={() => handleSelect(mun)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${location === mun ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                <MapPin className={`w-4 h-4 mr-3 ${location === mun ? 'text-primary' : 'text-gray-400'}`} />
                {mun}
              </button>
            ))}
            
            {filtered.length === 0 && (
              <p className="text-center text-gray-500 py-4">No se encontraron municipios</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
