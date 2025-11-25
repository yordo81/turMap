import React, { useEffect, useRef, useCallback } from 'react';
import { TouristResource } from '../types';

interface MapViewProps {
  places: TouristResource[];
  onSelectPlace: (place: TouristResource) => void;
}

const MapView: React.FC<MapViewProps> = ({ places, onSelectPlace }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  // Store markers by ID to easily add/remove specific ones
  const markersMapRef = useRef<Map<string, any>>(new Map());
  
  // Refs for props to avoid stale closures in event listeners
  const placesRef = useRef<TouristResource[]>(places);
  const onSelectPlaceRef = useRef(onSelectPlace);

  // Update refs when props change
  useEffect(() => {
    placesRef.current = places;
  }, [places]);

  useEffect(() => {
    onSelectPlaceRef.current = onSelectPlace;
  }, [onSelectPlace]);

  // Core Lazy Loading Logic
  const updateVisibleMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    if (!map || !L) return;

    // Get bounds with 50% buffer to preload markers just outside view
    // This ensures smooth panning without markers popping in immediately at the edge
    const bounds = map.getBounds().pad(0.5); 
    const currentMarkers = markersMapRef.current;

    placesRef.current.forEach(place => {
      // Skip valid places without coordinates
      if (!place.latitude || !place.longitude) return;

      const latLng = L.latLng(place.latitude, place.longitude);
      const isVisible = bounds.contains(latLng);
      const hasMarker = currentMarkers.has(place.id);

      if (isVisible && !hasMarker) {
        // 1. Create and add marker if visible and not yet present
         const marker = L.marker([place.latitude, place.longitude])
          .addTo(map)
          .bindPopup(`
            <div class="text-center font-sans min-w-[160px]">
              <div class="w-full h-24 mb-2 rounded overflow-hidden relative bg-gray-100">
                 <img src="${place.imageUrl || 'https://via.placeholder.com/150'}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/150'" />
              </div>
              <h3 class="font-bold text-sm mb-1 line-clamp-1">${place.name}</h3>
              <p class="text-xs text-gray-600 mb-1">${place.category}</p>
              <div class="text-xs font-semibold text-yellow-600 mb-2">★ ${place.rating}</div>
              <button id="btn-${place.id}" class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors w-full font-medium cursor-pointer">
                Details
              </button>
            </div>
          `);
        
        // Bind click event when popup opens (React handlers don't work in Leaflet HTML strings)
        marker.on('popupopen', () => {
          // Small timeout to ensure DOM is ready
          setTimeout(() => {
              const btn = document.getElementById(`btn-${place.id}`);
              if (btn) {
                  btn.onclick = (e) => {
                      e.preventDefault(); // Prevent default behavior
                      onSelectPlaceRef.current(place);
                  };
              }
          }, 0);
        });

        currentMarkers.set(place.id, marker);
      } else if (!isVisible && hasMarker) {
        // 2. Remove marker if it goes out of view (Lazy Unload)
        const marker = currentMarkers.get(place.id);
        map.removeLayer(marker);
        currentMarkers.delete(place.id);
      }
    });
  }, []);

  // Initialize Map (Run Once)
  useEffect(() => {
    if (!mapRef.current || !(window as any).L) return;
    if (mapInstanceRef.current) return; // Already initialized

    const L = (window as any).L;

    // Fix Leaflet default icon paths for CDN usage
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    const map = L.map(mapRef.current).setView([0, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    // Attach event listeners for lazy loading
    map.on('moveend', updateVisibleMarkers);
    map.on('zoomend', updateVisibleMarkers);
    map.on('resize', updateVisibleMarkers);

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [updateVisibleMarkers]);

  // Handle data changes (New Search Results)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = (window as any).L;
    
    if (!map || !L) return;

    // 1. Clear all existing markers to reset state
    markersMapRef.current.forEach(marker => map.removeLayer(marker));
    markersMapRef.current.clear();

    // 2. Fit bounds to new places list
    const validPlaces = places.filter(p => p.latitude && p.longitude);
    
    if (validPlaces.length > 0) {
       const bounds = L.latLngBounds(validPlaces.map(p => [p.latitude, p.longitude]));
       map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
       map.setView([20, 0], 2);
    }

    // 3. Trigger initial marker load for the new view
    // Wait for Leaflet animation/render frame to ensure bounds are correct
    setTimeout(() => {
        map.invalidateSize();
        updateVisibleMarkers();
    }, 250);
    
  }, [places, updateVisibleMarkers]);

  return <div ref={mapRef} className="w-full h-[600px] rounded-xl z-0 border border-gray-200 shadow-sm bg-gray-50" />;
};

export default MapView;