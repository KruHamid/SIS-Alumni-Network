import React, { useEffect, useRef, useState } from 'react';
import { AlumniProfile } from '../types';
import { geocodeAddress } from '../services/geminiService';

// Add a declaration for the Leaflet global object
declare const L: any;

interface MapViewProps {
  profiles: AlumniProfile[];
  onProfileSelect: (profile: AlumniProfile) => void;
}

interface Coords {
  lat: number;
  lng: number;
}

const MapView: React.FC<MapViewProps> = ({ profiles, onProfileSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // To hold the map instance
  const [geocodedProfiles, setGeocodedProfiles] = useState<Map<string, Coords | null>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const geocodeAll = async () => {
      setIsLoading(true);
      const profilesWithLocation = profiles.filter(p => p.location && p.location.trim() !== 'ออนไลน์' && p.location.trim() !== '');
      const newGeocodedProfiles = new Map<string, Coords | null>();

      await Promise.all(profilesWithLocation.map(async (profile) => {
        if (!geocodedProfiles.has(profile.id)) { // Geocode only if not already cached
            const coords = await geocodeAddress(profile.location!);
            newGeocodedProfiles.set(profile.id, coords);
        } else {
            newGeocodedProfiles.set(profile.id, geocodedProfiles.get(profile.id)!);
        }
      }));

      setGeocodedProfiles(newGeocodedProfiles);
      setIsLoading(false);
    };

    geocodeAll();
  }, [profiles]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    mapRef.current = L.map(mapContainer.current).setView([13.7563, 100.5018], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || isLoading) return;

    mapRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapRef.current.removeLayer(layer);
      }
    });

    const markerGroup: any[] = [];

    profiles.forEach(profile => {
      const coords = geocodedProfiles.get(profile.id);
      if (coords) {
        const marker = L.marker([coords.lat, coords.lng]);

        const popupContent = `
          <div class="p-1 max-w-xs">
            <h3 class="font-bold text-base text-green-800">${profile.businessName}</h3>
            <p class="text-sm text-gray-600">${profile.name}</p>
            <button id="view-details-${profile.id}" class="mt-2 w-full text-center px-3 py-1 bg-green-700 text-white text-xs font-semibold rounded-md hover:bg-green-800 transition-colors">ดูรายละเอียด</button>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-details-${profile.id}`);
          if (btn) {
            btn.onclick = () => onProfileSelect(profile);
          }
        });

        markerGroup.push(marker);
      }
    });

    if (markerGroup.length > 0) {
      const group = L.featureGroup(markerGroup).addTo(mapRef.current);
      if (markerGroup.length > 1) {
          mapRef.current.fitBounds(group.getBounds().pad(0.2));
      } else {
          mapRef.current.setView(markerGroup[0].getLatLng(), 14);
      }
    }

  }, [geocodedProfiles, isLoading, profiles, onProfileSelect]);

  return (
    <div className="relative container mx-auto px-4 pb-8">
        <div className="relative" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-700 mx-auto"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700">กำลังค้นหาตำแหน่งบนแผนที่ด้วย AI...</p>
                </div>
                </div>
            )}
            <div ref={mapContainer} className="w-full h-full rounded-lg shadow-lg z-0" />
        </div>
    </div>
  );
};

export default MapView;
