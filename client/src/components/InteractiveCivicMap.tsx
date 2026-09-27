import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { CivicCenter } from './WardLocatorView';

interface InteractiveCivicMapProps {
  centers: CivicCenter[];
  activeCenter: CivicCenter;
  userLocation: { lat: number; lng: number; accuracy?: number } | null;
  onSelectCenter: (centerId: string) => void;
}

export const InteractiveCivicMap: React.FC<InteractiveCivicMapProps> = ({
  centers,
  activeCenter,
  userLocation,
  onSelectCenter
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = activeCenter.lat || 19.076;
      const initialLng = activeCenter.lng || 72.8777;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: true,
        attributionControl: false
      });

      // Crisp, free, high-detail OpenStreetMap tiles with no API key requirement or watermarks
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Invalidate size once rendered
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Render Markers and Connections on Data / Center Changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Custom Icon Generator for Civic Centers
    const createCivicIcon = (center: CivicCenter, isSelected: boolean) => {
      const bgColor = isSelected
        ? '#1B4D3E'
        : center.category === 'rto'
        ? '#2563EB'
        : center.category === 'cfc'
        ? '#D97706'
        : center.category === 'registrar'
        ? '#7C3AED'
        : '#059669';

      const tagText = center.wardCode || center.categoryLabel.split(' ')[0];
      const scaleClass = isSelected ? 'transform: scale(1.18); z-index: 999;' : '';

      const html = `
        <div style="${scaleClass}" class="group relative flex flex-col items-center cursor-pointer transition-transform">
          ${
            isSelected
              ? '<span style="background-color: ' +
                bgColor +
                ';" class="absolute -inset-1.5 rounded-full opacity-40 animate-ping"></span>'
              : ''
          }
          <div style="background-color: ${bgColor}; border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.25);" class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs">
            ${
              center.category === 'rto'
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>'
                : center.category === 'registrar'
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><line x1="8" y1="6" x2="8.01" y2="6"/><line x1="16" y1="6" x2="16.01" y2="6"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/></svg>'
            }
          </div>
          <div style="background-color: rgba(13, 31, 26, 0.92); color: white; border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 2px 6px rgba(0,0,0,0.2);" class="mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold whitespace-nowrap leading-tight">
            ${tagText}
          </div>
        </div>
      `;

      return L.divIcon({
        className: 'custom-civic-marker',
        html,
        iconSize: [36, 48],
        iconAnchor: [18, 24],
        popupAnchor: [0, -26]
      });
    };

    // Plot all visible centers
    centers.forEach((center) => {
      const isSelected = center.id === activeCenter.id;
      const markerIcon = createCivicIcon(center, isSelected);

      const marker = L.marker([center.lat, center.lng], { icon: markerIcon });

      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; color: #11261F; line-height: 1.4; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
            <span style="background: #EAF2ED; color: #1B4D3E; font-size: 9px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; rounded: 4px; border: 1px solid #D1E2D8;">
              ${center.categoryLabel}
            </span>
            ${center.wardCode ? `<span style="font-size: 10px; font-weight: bold; color: #6C8075;">${center.wardCode}</span>` : ''}
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0D1F1A; margin-bottom: 4px;">
            ${center.name}
          </div>
          <div style="color: #4A5D54; font-size: 11px; margin-bottom: 6px;">
            <strong>Address:</strong> ${center.address}
          </div>
          <div style="color: #1B4D3E; font-size: 11px; font-weight: 700; margin-bottom: 6px;">
            Token Counter: ${center.tokenTiming}
          </div>
          <div style="display: flex; gap: 6px; margin-top: 8px; padding-top: 6px; border-top: 1px solid #E2E8F0;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}" target="_blank" rel="noopener noreferrer" style="background: #1B4D3E; color: white; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: bold; text-decoration: none; display: inline-block;">
              Get GPS Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: false,
        offset: [0, -10],
        className: 'civic-map-popup'
      });

      marker.on('mouseover', () => {
        marker.openPopup();
      });

      marker.on('mouseout', () => {
        marker.closePopup();
      });

      marker.on('click', () => {
        onSelectCenter(center.id);
        marker.openPopup();
      });

      markersLayer.addLayer(marker);
    });

    // Plot User's Live GPS Pin if present
    if (userLocation) {
      const userHtml = `
        <div class="relative flex flex-col items-center">
          <span class="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping"></span>
          <div class="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></svg>
          </div>
          <div class="mt-0.5 px-1.5 py-0.2 rounded bg-blue-900 text-white text-[8px] font-black uppercase tracking-wider shadow">
            You (GPS)
          </div>
        </div>
      `;

      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: userHtml,
        iconSize: [32, 40],
        iconAnchor: [16, 20]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
      userMarker.bindPopup(`
        <div style="font-size: 11px; font-weight: bold; color: #1E3A8A;">
          Your Live GPS Position<br/>
          <span style="font-weight: normal; color: #475569;">${userLocation.lat.toFixed(4)}°N, ${userLocation.lng.toFixed(4)}°E</span>
        </div>
      `, {
        closeButton: false,
        offset: [0, -10]
      });

      userMarker.on('mouseover', () => {
        userMarker.openPopup();
      });
      userMarker.on('mouseout', () => {
        userMarker.closePopup();
      });

      markersLayer.addLayer(userMarker);

      // Trajectory connection line between User and Active Center
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }

      // 1. Initial direct line while fetching road geometry
      const fallbackLine = L.polyline(
        [
          [userLocation.lat, userLocation.lng],
          [activeCenter.lat, activeCenter.lng]
        ],
        {
          color: '#1B4D3E',
          weight: 3.5,
          dashArray: '6, 8',
          opacity: 0.85
        }
      );
      fallbackLine.addTo(markersLayer);
      polylineRef.current = fallbackLine;

      // 2. Fetch real street-by-street road network trajectory from free OSRM / OpenRouteService
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${activeCenter.lng},${activeCenter.lat}?overview=full&geometries=geojson`;
      
      fetch(osrmUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.routes && data.routes[0] && data.routes[0].geometry) {
            const coordinates = data.routes[0].geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
            );
            if (polylineRef.current) {
              polylineRef.current.remove();
            }
            const roadLine = L.polyline(coordinates, {
              color: '#1B4D3E',
              weight: 4,
              opacity: 0.9
            });
            roadLine.addTo(markersLayer);
            polylineRef.current = roadLine;
          }
        })
        .catch(() => {
          // Keep fallback direct line if network is offline
        });
    }

    // Pan to active center
    map.flyTo([activeCenter.lat, activeCenter.lng], 14, {
      duration: 1.2
    });
  }, [centers, activeCenter, userLocation, onSelectCenter]);

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px] z-10" />
    </div>
  );
};

export default InteractiveCivicMap;
