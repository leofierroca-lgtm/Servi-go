import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Leaflet icon fix
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Star } from 'lucide-react';

const createCustomIcon = (avatarUrl) => {
  return L.divIcon({
    className: 'custom-avatar-marker',
    html: `<div style="
      width: 44px; 
      height: 44px; 
      border-radius: 50%; 
      overflow: hidden; 
      border: 3px solid #ff6b00; 
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      background-color: #222;
    ">
      <img src="${avatarUrl || 'https://i.pravatar.cc/100'}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://i.pravatar.cc/100'" />
    </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
};

const MOCK_PINS = [
  { id: 1, lat: 2.6644, lng: -75.3949, name: 'Asadero El Gordo', type: 'commerce', rating: 4.8 },
  { id: 2, lat: 2.6680, lng: -75.3900, name: 'Electricista Juan', type: 'service', rating: 4.9 }
];

// Helper to calculate lat/lng from distance for mock data if needed
// Or we can just generate a random offset around Yaguará
const generateCoords = (id) => {
  // deterministic random based on string id
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const latOffset = (hash % 100) * 0.0002;
  const lngOffset = ((hash >> 3) % 100) * 0.0002;
  return { lat: 2.6644 + latOffset, lng: -75.3949 + lngOffset };
};

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function InteractiveMap({ businesses = [], closestBusinessId = null }) {
  const pins = businesses.map(b => {
    const coords = b.lat && b.lng ? { lat: b.lat, lng: b.lng } : generateCoords(b.id);
    return { ...b, ...coords };
  });

  // Determine center based on closest business or default
  let center = [2.6644, -75.3949];
  let zoom = 15;
  if (closestBusinessId) {
    const closest = pins.find(p => p.id === closestBusinessId);
    if (closest) {
      center = [closest.lat, closest.lng];
      zoom = 16;
    }
  }

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; Waze'
          url="https://worldtiles1.waze.com/tiles/{z}/{x}/{y}.png"
        />
        {pins.map(pin => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={createCustomIcon(pin.avatar)}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-gray-900">{pin.name}</h3>
                <div className="flex items-center text-sm mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span>{pin.rating}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="capitalize">{pin.type}</span>
                </div>
                {closestBusinessId === pin.id && (
                  <div className="mt-2 text-xs font-bold text-primary bg-orange-100 px-2 py-1 rounded">
                    ¡Más cercano a ti! ({pin.distance})
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-white px-4 py-3 rounded-full shadow-lg border border-gray-100 flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-600">Radio de búsqueda:</span>
        <input type="range" min="1" max="15" defaultValue="5" className="w-32 accent-primary" />
        <span className="text-sm font-bold text-primary">5 km</span>
      </div>
    </div>
  );
}
